# Hangfire (Hf)

> Referencing Hangfire directly is the legacy path. It is now one selectable engine behind the background-jobs port, not the platform's job system.

- Family: Execution & async
- Adoption: **Legacy**. Still works; do not build new code on it.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/hangfire`

## Pattern

Provider behind a port, chosen by configuration — the same shape as search providers. `VirtoCommerce.BackgroundJobs` owns the engine contract; Hangfire is its default reference engine, with RabbitMQ and an in-memory engine as alternatives. Application code talks to `IBackgroundJob` and never names the engine.

## When to use

- Reading or maintaining existing code that calls `Hangfire.BackgroundJob.Enqueue` or the old `VirtoCommerce.Platform.Hangfire.IRecurringJobService`
- Choosing Hangfire deliberately as your engine — it is still the default and a perfectly good one
- Reaching the Hangfire dashboard to inspect jobs in a running environment

## Avoid

- Referencing `Hangfire.*` types from new module code — that is the coupling the extraction removed
- Assuming the platform provides job execution on its own. Without an engine module installed, `IBackgroundJob` throws
- Depending on the dead `VirtoCommerce.Platform.Hangfire` package rather than `VirtoCommerce.BackgroundJobs.Hangfire`
- Treating `InMemory` as a production engine — it is documented for development and testing only

## Use instead

Install `VirtoCommerce.BackgroundJobs`, then define a payload plus an `IBackgroundJobHandler<TPayload>` and enqueue through `IBackgroundJob` — see the Background jobs atom. Migration is two steps: swap the dead `VirtoCommerce.Platform.Hangfire` package reference for `VirtoCommerce.BackgroundJobs.Hangfire`, then move off `Hangfire.BackgroundJob.Enqueue()` to `IBackgroundJob.Enqueue<THandler>()`.

## Note

The badge is about **direct Hangfire coupling**, not about Hangfire itself — Hangfire remains the default engine and is fine to run. What is legacy is code that names `Hangfire.*` types, and the `VirtoCommerce.Platform.Hangfire` package, which is now a type-forwarding shim kept only so existing assemblies still load.

## API

- `VirtoCommerce.BackgroundJobs (module)` · (separate repository — vc-module-background-jobs)
- `VirtoCommerce.BackgroundJobs.Hangfire (engine)` · (engine package, replaces VirtoCommerce.Platform.Hangfire)
- `IBackgroundJob (the port to use instead)` · [src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJob.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJob.cs)
- `IRecurringJobService (engine-free contract)` · [src/VirtoCommerce.Platform.Core/Jobs/IRecurringJobService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IRecurringJobService.cs)
- `BackgroundJobEngineNotInstalledException` · [src/VirtoCommerce.Platform.Core/Jobs/BackgroundJobEngineNotInstalledException.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/BackgroundJobEngineNotInstalledException.cs)

## Example

```json
// appsettings.json — the engine is a configuration choice, not a code dependency.
{
  "VirtoCommerce": {
    "BackgroundJobs": {
      "Provider": "Hangfire",        // Hangfire (default) | RabbitMQ | InMemory
      "Mode": "Both",                // Producer | Worker | Both
      "EnableLegacyHangfire": true,  // keeps Hangfire running alongside another engine
      "DefaultQueue": "default",
      "MaxRetryAttempts": 3
    },
    "Hangfire": { "WorkerCount": 10, "JobStorageType": "SqlServer" },
    "RabbitMQ": { "HostName": "localhost", "Port": 5672, "PrefetchCount": 10 }
  }
}
```

## Pitfalls

- `EnableLegacyHangfire` defaults to **true**, so Hangfire may still be running even when you have selected another provider. That is deliberate backward compatibility, and it surprises people debugging which engine actually ran a job.
- `VirtoCommerce.Platform.Hangfire.dll` still exists as a type-forwarding shim. A reference to it compiles and appears to work, which is exactly why stale references survive unnoticed.
- `Mode` splits producer from worker: an instance set to `Producer` enqueues but never executes. A queue that fills up while nothing drains it is usually this.
- Engine choice changes delivery semantics — RabbitMQ is push-based and scale-to-zero friendly, Hangfire polls its storage. Handlers must be idempotent either way.

## Documentation

- [vc-module-background-jobs (GitHub)](https://github.com/VirtoCommerce/vc-module-background-jobs)
- [Background Processing Hub — design spec](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/superpowers/specs/2026-06-06-background-processing-hub-design.md)

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Recurring jobs](recurring-jobs.md): Cron-scheduled work whose schedule an operator can change without a deploy.
- [Fire & forget](fire-and-forget.md): Start work and move on without waiting for the result — durably, so it survives the request that started it.
- [Map / reduce jobs](map-reduce-jobs.md): Fan a large batch out across workers, then aggregate the results in one place.

## Topic

Part of **Background processing hub**: The in-flight extraction of the job engine behind one port.
