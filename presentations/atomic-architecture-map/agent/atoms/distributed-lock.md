# Distributed lock (Dl)

> Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/distributed-lock`

## Pattern

Acquire a handle, hold it, dispose it. `IDistributedLock.AcquireAsync(resource)` returns an `IDistributedLockHandle`; `await using` releases it. With `ConnectionStrings:RedisConnectionString` set the lock is `RedisDistributedLock` (RedLock.net), renewed automatically while the handle is held; without it, `InProcessDistributedLock` serializes callers within the one instance. `ExecuteAsync` and `TryExecuteAsync` extensions wrap acquire, run and release, and hand your delegate a token that is cancelled if the lock is lost.

## When to use

- Work that must happen once cluster-wide: a scheduled task, a reindex, a migration step
- Guarding a resource that two instances could otherwise corrupt
- `TryExecuteAsync` when the right answer to "someone else is already doing it" is to skip, not to wait

## Avoid

- Treating the lock as a transaction. It orders access; it does not roll anything back
- Ignoring the token passed to your delegate. If the lock is lost, another instance may already be running the same work
- New code on `IDistributedLockService`. It is deprecated and kept for existing callers

## Note

Since 3.1073, `IDistributedLock` replaces `IDistributedLockService`. The old interface still works and runs on the new lock, but its `lockTimeout` and `retryInterval` arguments are ignored. Configuration moved to the `DistributedLock` section: `DefaultTimeout` (30 s), `Expiry` (30 s), `RetryInterval` (100 ms, backing off ×1.8 with jitter up to `MaxRetryInterval`, 2 s) and `WaitTime` for the startup lock (180 s). Platform startup takes its own keyed lock with a longer expiry, so a Redis brownout during a long migration does not let a second instance start migrating. The `DistributedLock` section is validated when the platform starts, so an invalid value stops startup instead of failing at the first lock.

## API

- `IDistributedLock` · [src/VirtoCommerce.Platform.Core/DistributedLock/IDistributedLock.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DistributedLock/IDistributedLock.cs)
- `IDistributedLockHandle` · [src/VirtoCommerce.Platform.Core/DistributedLock/IDistributedLockHandle.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DistributedLock/IDistributedLockHandle.cs)
- `ExecuteAsync / TryExecuteAsync` · [src/VirtoCommerce.Platform.Core/DistributedLock/DistributedLockExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DistributedLock/DistributedLockExtensions.cs)
- `RedisDistributedLock (RedLock.net)` · [src/VirtoCommerce.Platform.DistributedLock/Redis/RedisDistributedLock.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.DistributedLock/Redis/RedisDistributedLock.cs)
- `InProcessDistributedLock (no Redis)` · [src/VirtoCommerce.Platform.DistributedLock/InProcess/InProcessDistributedLock.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.DistributedLock/InProcess/InProcessDistributedLock.cs)
- `DistributedLockOptions` · [src/VirtoCommerce.Platform.DistributedLock/DistributedLockOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.DistributedLock/DistributedLockOptions.cs)
- `IDistributedLockService (deprecated)` · [src/VirtoCommerce.Platform.Core/DistributedLock/IDistributedLockService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DistributedLock/IDistributedLockService.cs)

## Example

```csharp
// Skip if another instance is already reindexing this store; otherwise run under the lock.
// The token passed to the delegate is cancelled if the lock is lost mid-run.
var ran = await _distributedLock.TryExecuteAsync(
    $"reindex:{storeId}",
    async token => await _indexing.IndexAsync(storeId, token),
    cancellationToken: cancellationToken);

// Or hold the handle yourself and wait up to the configured DefaultTimeout (30 s).
await using var handle = await _distributedLock.AcquireAsync($"cart:recalc:{cartId}",
    cancellationToken: cancellationToken);
await RecalculateAsync(cartId, handle.HandleLostToken);
```

## Pitfalls

- Without Redis the lock is in-process: it serializes callers on one instance and nothing more. That is correct for a single instance and wrong the moment you scale out without Redis. The old no-op `NoLockService` is obsolete (`VC0015`) and no longer registered.
- Redis locks are renewed every `Expiry / 2` (15 s by default) while the handle is held, so you no longer size a lock timeout against the work. What bounds you now is `Expiry`: a crashed holder blocks others for up to 30 s, and if renewal fails for that long the lock is lost.
- Loss is signalled, not prevented. `HandleLostToken` fires after the fact, and another instance may already hold the lock by then. Stop the protected work when it fires.
- `AcquireAsync` throws `DistributedLockTimeoutException` when the wait runs out and `DistributedLockUnavailableException` when Redis cannot be reached. `TryAcquireAsync` returns `null` only for the first case; an unreachable Redis still throws, so nothing is skipped silently.
- Locks are not reentrant. Acquiring the same resource twice from the same flow waits on yourself.
- `AsyncLock` and this are different tools: in-process versus cluster-wide. Choosing the wrong one produces a bug that only appears when you scale out.

## Documentation

- [Scale out on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)
- [Scalability](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scalability-options/)

## See also

- [Async lock](async-lock.md): An awaitable in-process lock keyed by string — one process only, not a cluster.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Recurring jobs](recurring-jobs.md): Cron-scheduled work whose schedule an operator can change without a deploy.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
