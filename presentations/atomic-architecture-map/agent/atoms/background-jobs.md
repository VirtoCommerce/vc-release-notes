# Background jobs (Jb)

> Durable queued work that outlives the request, behind an engine-agnostic facade.

- Family: Execution & async
- Adoption: **In flight**. Changing right now: read the migration note.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/background-jobs`

## Pattern

Port and adapter, with work crossing the boundary as a serialized message rather than a delegate. The platform owns the port (`IBackgroundJob`); an installed engine module adapts it to Hangfire, RabbitMQ or another transport. You implement `IBackgroundJobHandler<TPayload>` and enqueue a payload.

## When to use

- Work that must survive an app restart or a deploy
- Anything slower than a request should be: imports, indexing, bulk updates, report generation
- Work needing retries, or at-least-once delivery guarantees
- Fan-out where you want the engine to handle concurrency and queueing

## Avoid

- Anything needing `HttpContext` — the job runs outside the request scope
- Sub-second latency work; enqueue plus dispatch is not free
- Passing large data in the payload — store the blob and pass a reference (claim-check)
- Assuming exactly-once. Make the handler idempotent instead

## Note

Hangfire is no longer a platform dependency. `VirtoCommerce.Platform.Hangfire` has been removed from `VirtoCommerce.Platform.sln`, and the platform now depends only on the contracts in `Platform.Core/Jobs`. Execution comes from the installable **`VirtoCommerce.BackgroundJobs`** module, which picks one engine — Hangfire (default), RabbitMQ, or in-memory for development — from `VirtoCommerce:BackgroundJobs:Provider`. Your code never names the engine.

## API

- `IBackgroundJob` · [src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJob.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJob.cs)
- `IBackgroundJobHandler<TPayload>` · [src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJobHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJobHandler.cs)
- `EnqueueOptions` · [src/VirtoCommerce.Platform.Core/Jobs/EnqueueOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/EnqueueOptions.cs)
- `IJobExecutionContext` · [src/VirtoCommerce.Platform.Core/Jobs/IJobExecutionContext.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IJobExecutionContext.cs)
- `AddBackgroundJob<THandler, TPayload>()` · [src/VirtoCommerce.Platform.Core/Jobs/BackgroundJobsServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/BackgroundJobsServiceCollectionExtensions.cs)

## Example

```csharp
// Module.Core — the payload. Create it via AbstractTypeFactory so partners can override it.
public class ReindexPayload
{
    public string StoreId { get; set; }
}

// Module.Data — the handler. Resolved from DI; last registration wins, so it stays overridable.
public class ReindexHandler(IIndexingService indexing) : IBackgroundJobHandler<ReindexPayload>
{
    public async Task Execute(ReindexPayload payload, IJobExecutionContext context,
        CancellationToken cancellationToken = default)
    {
        await context.Progress.Report(
            new JobProgressInfo { Message = $"Reindexing {payload.StoreId}" }, cancellationToken);

        await indexing.IndexAsync(payload.StoreId, cancellationToken);
    }
}

// Module.Web — Module.Initialize. Note the order: handler first, payload second.
services.AddBackgroundJob<ReindexHandler, ReindexPayload>();

// Anywhere — enqueue. Naming the handler makes the call self-documenting.
await _backgroundJob.Enqueue<ReindexHandler>(
    new ReindexPayload { StoreId = storeId },
    new EnqueueOptions
    {
        Title = "Reindex catalog",
        ReportProgress = true,
        UniqueKey = $"reindex:{storeId}",   // dedup: one in flight per store
        MaxRetryAttempts = 3
    });
```

## Pitfalls

- Without the `VirtoCommerce.BackgroundJobs` module nothing registers `IBackgroundJob`: a class that injects it fails to resolve, and the static `BackgroundJob` facade throws an `InvalidOperationException` that names the module to install. The platform itself still boots. With the module installed but no engine available, `Enqueue` throws `BackgroundJobEngineNotInstalledException` with installation instructions.
- The engine module validates the payload against the handler at enqueue time: if `THandler` does not implement `IBackgroundJobHandler<>` for the payload's runtime type, `Enqueue` throws immediately rather than failing later on a worker.
- Since 3.1065 a job can be cancelled by id with `Cancel(jobId)`. Not every engine supports it, and both "not supported" and "nothing to cancel" return `false`, so check `SupportsCancellation` first.
- There is a shorter registration overload, `AddBackgroundJob<THandler>()`, which infers the payload type from the handler's interface. It requires the handler to implement exactly one `IBackgroundJobHandler<>`; name both types when it implements several.
- `UniqueKey` is how you stop a user double-clicking their way into two concurrent imports.
- Handlers get a fresh DI scope per job — not the enqueuing request's scope.

## Documentation

- [vc-module-background-jobs (GitHub)](https://github.com/VirtoCommerce/vc-module-background-jobs)
- [Background Processing Hub — design spec](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/superpowers/specs/2026-06-06-background-processing-hub-design.md)
- [Scalability](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scalability-options/)

## See also

- [Recurring jobs](recurring-jobs.md): Cron-scheduled work whose schedule an operator can change without a deploy.
- [Map / reduce jobs](map-reduce-jobs.md): Fan a large batch out across workers, then aggregate the results in one place.
- [Job progress](job-progress.md): Reporting how far a long job has got, so the UI can show it instead of spinning.
- [Fire & forget](fire-and-forget.md): Start work and move on without waiting for the result — durably, so it survives the request that started it.
- [Hangfire](hangfire.md): Referencing Hangfire directly is the legacy path. It is now one selectable engine behind the background-jobs port, not the platform's job system.
- [Push notifications](push-notifications.md): Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.

## Topic

Part of **Background processing hub**: The in-flight extraction of the job engine behind one port.
