# Redis cache bus (Rc)

> Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.

- Family: Caching
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/redis-cache-bus`

## Pattern

Publish/subscribe invalidation. `RedisPlatformMemoryCache` wraps the in-memory cache and publishes a `RedisCachingMessage` whenever a region or key is expired; every other instance receives it and expires the same region locally. Each instance keeps its own copy of the data.

## When to use

- Any deployment with more than one instance — at that point this stops being optional
- When users report "the change shows on some page loads but not others" — the classic symptom of missing coherence
- Blue/green and rolling deploys, where old and new instances run side by side

## Avoid

- Expecting it to be a shared cache. Every instance still computes and stores its own values
- Relying on it for correctness-critical consistency; propagation is fast but not instant
- Chatty per-item invalidation during bulk work — every message fans out to every instance

## API

- `RedisPlatformMemoryCache` · [src/VirtoCommerce.Platform.Caching/Redis/RedisPlatformMemoryCache.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/Redis/RedisPlatformMemoryCache.cs)
- `RedisCachingMessage` · [src/VirtoCommerce.Platform.Caching/Redis/RedisCachingMessage.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/Redis/RedisCachingMessage.cs)
- `RedisCachingOptions` · [src/VirtoCommerce.Platform.Caching/Redis/RedisCachingOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/Redis/RedisCachingOptions.cs)

## Example

```json
// appsettings.json — the connection string is what switches coherence on.
{
  "ConnectionStrings": {
    "RedisConnectionString": "localhost:6379,ssl=False,abortConnect=False"
  },
  "Caching": {
    "CacheEnabled": true,
    "CacheSlidingExpiration": "0:15:0"
  }
}
```

## Pitfalls

- This is the single most misunderstood piece of Virto caching: Redis here carries *invalidation messages*, not cache entries. Losing Redis costs coherence, not the cache.
- Without it, a save on instance A leaves instance B serving stale data until its own entry expires — intermittent staleness that is miserable to reproduce.
- Redis does triple duty in a Virto deployment: this bus, the distributed lock, and the SignalR backplane. Keep them straight when diagnosing.
- Cache memory is per instance, so cluster memory scales with instance count rather than being pooled.

## Documentation

- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)
- [Scale out on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)

## See also

- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.
- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [Push notifications](push-notifications.md): Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
