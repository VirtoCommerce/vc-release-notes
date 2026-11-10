# Map / reduce jobs (MR)

> Fan a large batch out across workers, then aggregate the results in one place.

- Family: Execution & async
- Adoption: **In flight**. Changing right now: read the migration note.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/map-reduce-jobs`

## Pattern

Map/reduce over the job engine. `IMapReduceJob.Enqueue<TMap, TReduce>` splits a collection into per-item map jobs, then runs a single reduce handler over the collected `MapResult`s once every map finishes.

## When to use

- Bulk operations over thousands of entities where each item is independent
- Work where you need a summary at the end: counts, failures, a report
- Any place you were about to write your own "enqueue N jobs and poll for completion" loop

## Avoid

- Small batches — the coordination overhead outweighs the parallelism
- Items that depend on each other, or that must be processed in order
- Map handlers with side effects that are not idempotent; individual maps can be retried

## Note

Part of the same background-processing extraction as the other job atoms. Read the Hub spec before designing around it — the contract is still settling.

## API

- `IMapReduceJob` · [src/VirtoCommerce.Platform.Core/Jobs/IMapReduceJob.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IMapReduceJob.cs)
- `IMapJobHandler<TItem, TState, TResult>` · [src/VirtoCommerce.Platform.Core/Jobs/IMapJobHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IMapJobHandler.cs)
- `IReduceJobHandler` · [src/VirtoCommerce.Platform.Core/Jobs/IReduceJobHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IReduceJobHandler.cs)
- `MapReduceOptions` · [src/VirtoCommerce.Platform.Core/Jobs/MapReduceOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/MapReduceOptions.cs)
- `AddMapReduce()` · [src/VirtoCommerce.Platform.Core/Jobs/MapReduceServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/MapReduceServiceCollectionExtensions.cs)

## Example

```csharp
// items are mapped in parallel by TMap; TReduce runs once over all MapResults.
var jobId = await _mapReduceJob.Enqueue<PriceRecalcMap, PriceRecalcReduce>(
    items: productIds,
    state: new PriceRecalcState { PricelistId = pricelistId },
    options: new MapReduceOptions { /* batching, queue, retries */ });
```

## Pitfalls

- The reduce step only runs once every map job has reached a terminal state, so one stuck map job stalls the aggregate.
- `state` is serialized once and handed to every map job — it is shared read-only input, not a place to accumulate results.
- Requires an installed job engine, exactly like plain background jobs.

## Documentation

- [Background Processing Hub — design spec](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/superpowers/specs/2026-06-06-background-processing-hub-design.md)

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Hangfire](hangfire.md): Referencing Hangfire directly is the legacy path. It is now one selectable engine behind the background-jobs port, not the platform's job system.
- [Job progress](job-progress.md): Reporting how far a long job has got, so the UI can show it instead of spinning.
- [Backup & restore](backup-restore.md): The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.

## Topic

Part of **Background processing hub**: The in-flight extraction of the job engine behind one port.
