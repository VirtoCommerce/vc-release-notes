# Recurring jobs (Rj)

> Cron-scheduled work whose schedule an operator can change without a deploy.

- Family: Execution & async
- Adoption: **In flight**. Changing right now: read the migration note.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/recurring-jobs`

## Pattern

Declarative schedule registered at startup, resolved by the engine's scheduler. Either a fixed cron or — the Virto-specific move — a **setting-driven** schedule: an on/off setting plus a cron setting, re-evaluated automatically whenever either setting changes.

## When to use

- Nightly or periodic maintenance: pruning, digests, reconciliation, reindexing
- Any schedule an operator should be able to tune or switch off from the Admin UI
- Work that should be skipped entirely in some environments, via a deployment flag

## Avoid

- Sub-minute intervals — that is a queue consumer or a hosted service, not a cron job
- Long chains where each step depends on the last; enqueue explicit follow-on jobs instead
- Assuming only one instance fires it — take a distributed lock if the work must be exclusive

## Note

Same extraction as background jobs: `Platform.Core/Jobs/IRecurringJobService` is the new engine-free contract, and scheduling is executed by the `VirtoCommerce.BackgroundJobs` module. The older `VirtoCommerce.Platform.Hangfire.IRecurringJobService` is a *distinct type* kept for binary compatibility — check which one you are injecting, because both compile.

## API

- `IRecurringJobService` · [src/VirtoCommerce.Platform.Core/Jobs/IRecurringJobService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IRecurringJobService.cs)
- `IRecurringJobScheduleBuilder` · [src/VirtoCommerce.Platform.Core/Jobs/IRecurringJobScheduleBuilder.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IRecurringJobScheduleBuilder.cs)
- `AddRecurringJob<THandler, TPayload>()` · [src/VirtoCommerce.Platform.Core/Jobs/BackgroundJobsServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/BackgroundJobsServiceCollectionExtensions.cs)

## Example

```csharp
// Setting-driven: the operator owns the schedule, and changing the setting re-registers the job.
services.AddRecurringJob<SendDigestJob, SendDigestPayload>(
    new SendDigestPayload { Top = 10 },
    schedule => schedule
        .WithId("MyModule.SendDigest")            // stable id — required
        .FromSettings(
            ModuleConstants.Settings.DigestEnabled,
            ModuleConstants.Settings.DigestCronExpression));

// Fixed cron, switched off by a deployment flag. WithEnabled(false) also REMOVES an
// already-scheduled job from engine storage, rather than silently leaving it behind.
services.AddRecurringJob<PruneTokensJob>(
    schedule => schedule
        .WithId("MyModule.PruneTokens")
        .WithCron("0 3 * * *")
        .WithTimeZone(TimeZoneInfo.Utc)
        .WithEnabled(_options.PruneEnabled));
```

## Pitfalls

- With no engine installed, `AddRecurringJob` only records a registration that nothing reads: the platform boots and the job never runs, with no exception and no warning. Silence is the failure mode to watch for. The source comments on `IRecurringJobScheduler` and `IRecurringJobService` describe a no-op fallback that logs a warning, but none is registered, so do not count on the log either.
- `WithCron` and `FromSettings` are mutually exclusive — supply exactly one.
- `WithMaxRetryAttempts(0)` stops a failed occurrence being retried. For most schedules that is what you want: the next occurrence supersedes the failed one, and a retry only repeats the work.
- The payload instance passed to the non-factory overload is serialized identically on every occurrence. Use the `Func<TPayload>` overload when a run needs a fresh value such as a timestamp.
- Cron is evaluated in UTC unless you pass `WithTimeZone` — a nightly job can fire at the wrong local hour after a DST change.

## Documentation

- [vc-module-background-jobs (GitHub)](https://github.com/VirtoCommerce/vc-module-background-jobs)
- [Background Processing Hub — design spec](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/superpowers/specs/2026-06-06-background-processing-hub-design.md)

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Hangfire](hangfire.md): Referencing Hangfire directly is the legacy path. It is now one selectable engine behind the background-jobs port, not the platform's job system.
- [Settings](settings.md): Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [Hosted service](hosted-service.md): A .NET long-running loop tied to application lifetime — for in-process work no queue should own.

## Topic

Part of **Background processing hub**: The in-flight extraction of the job engine behind one port.
