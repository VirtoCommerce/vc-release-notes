# Async lock (Al)

> An awaitable in-process lock keyed by string — one process only, not a cluster.

- Family: Execution & async
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/async-lock`

## Pattern

Keyed semaphore with reference counting. `AsyncLock.GetLockByKey(key)` returns a per-key lock; `await LockAsync()` yields an `IDisposable` you release with `using`. Locks are reference-counted so unused keys do not accumulate.

## When to use

- Serialising concurrent work on the same key inside one process — cache loading, lazy initialisation
- Protecting a critical section where `lock` would be wrong because the body awaits
- Single-instance deployments where a distributed lock would be overkill

## Avoid

- Multi-instance coordination — this lock is invisible to other processes. Use the distributed lock
- Holding it across a network call you do not control; you are serialising every caller on someone else's latency
- Using `lock` around `await` instead. It does not compile, and the workarounds are worse

## API

- `AsyncLock.GetLockByKey` · [src/VirtoCommerce.Platform.Core/Common/AsyncLock.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/AsyncLock.cs)
- `AsyncLock.LockAsync` · [src/VirtoCommerce.Platform.Core/Common/AsyncLock.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/AsyncLock.cs)

## Example

```csharp
// Serialise per-key work inside this process.
using (await AsyncLock.GetLockByKey($"rebuild:{storeId}").LockAsync())
{
    // Only one caller per storeId gets in here at a time, within this instance.
    await Rebuild(storeId);
}
```

## Pitfalls

- In-process only. On two instances, two callers hold "the same" lock simultaneously — this is the single most common misuse.
- Forgetting the `using` leaks the lock for the process lifetime and deadlocks every later caller on that key.
- For cache loading you usually do not need this: `GetOrCreateExclusiveAsync` already locks per key.

## See also

- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Hosted service](hosted-service.md): A .NET long-running loop tied to application lifetime — for in-process work no queue should own.
