# Cache (MC)

> The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.

- Family: Caching
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/platform-memory-cache`

## Pattern

Cache-aside with an exclusive loader. `IPlatformMemoryCache` extends `IMemoryCache`; `GetOrCreateExclusiveAsync` guarantees one loader runs per key under concurrency (no cache stampede), and the entry is tied to a **cache region** token so a write elsewhere can invalidate it.

## When to use

- Any read that is expensive and repeated — the default for service read paths
- Search results, keyed by the criteria's own cache key
- Reference data: countries, dictionaries, settings, metadata

## Avoid

- Caching per-user or per-request data here — use the request-scoped cache instead
- Caching without an expiration token: an entry nothing can invalidate is a bug with a long fuse
- Treating it as shared state across instances. It is per-process; only invalidation is coordinated

## API

- `IPlatformMemoryCache` · [src/VirtoCommerce.Platform.Core/Caching/IPlatformMemoryCache.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/IPlatformMemoryCache.cs)
- `MemoryCacheExtensions.GetOrCreateExclusiveAsync` · [src/VirtoCommerce.Platform.Core/Caching/MemoryCacheExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/MemoryCacheExtensions.cs)
- `MemoryCacheExtensions.GetOrLoadByIdsAsync` · [src/VirtoCommerce.Platform.Core/Caching/MemoryCacheExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/MemoryCacheExtensions.cs)
- `CacheKey.With` · [src/VirtoCommerce.Platform.Core/Caching/CacheKey.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/CacheKey.cs)
- `PlatformMemoryCache` · [src/VirtoCommerce.Platform.Caching/PlatformMemoryCache.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/PlatformMemoryCache.cs)

## Example

```csharp
// src/VirtoCommerce.Platform.Data/ChangeLog/ChangeLogSearchService.cs — the canonical shape.
public virtual async Task<ChangeLogSearchResult> SearchAsync(ChangeLogSearchCriteria criteria)
{
    // Key includes the owning type, the method, and the criteria's own cache key.
    var cacheKey = CacheKey.With(GetType(), nameof(SearchAsync), criteria.GetCacheKey());

    return await _memoryCache.GetOrCreateExclusiveAsync(cacheKey, async cacheEntry =>
    {
        // Without this token the entry can never be invalidated by a write.
        cacheEntry.AddExpirationToken(ChangeLogCacheRegion.CreateChangeToken());

        var result = AbstractTypeFactory<ChangeLogSearchResult>.TryCreateInstance();
        using var repository = _repositoryFactory();
        repository.DisableChangesTracking();
        // ... query, project to models ...
        return result;
    });
}
```

## Pitfalls

- Forgetting `AddExpirationToken` is the most common caching bug in Virto code: it works in development and serves stale data in production.
- `GetOrCreateExclusiveAsync` locks per key, so a slow loader blocks only its own key — but it does block. Keep loaders free of unrelated work.
- Null results are cached by default (`cacheNullValue: true`) to avoid a hammering miss — which also means "not found" sticks around.
- Cache keys are normalized, so do not rely on exact string identity when debugging a key.
- For batches of entities by id, `GetOrLoadByIdsAsync` loads only the misses instead of all-or-nothing.
- Since 3.1082 cache lookups are counted on the `VirtoCommerce.Platform.Caching` meter (`virtocommerce.cache.requests` and `virtocommerce.cache.request.groups`, tagged with `cache.name` and the hit or miss outcome). `CrudService` and `SearchService` register their own cache names; a service that owns cache keys of its own should call `CacheKey.RegisterCacheName(ownerType, modelType)`, or its lookups are reported unclassified. The registration changes telemetry only, never keys or invalidation.

## Documentation

- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)

## See also

- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [Request-scoped cache](request-scoped-cache.md): A cache that lives exactly as long as one request — the cheap fix for repeated loads inside a single call.
- [Cache disabler](cache-disabler.md): Turn caching off for a scope or for the whole app — a diagnostic tool and an import-time necessity.
- [Hybrid Cache](hybrid-cache.md): .NET's own two-tier and distributed caching APIs. Neither is used here — reach for the platform cache instead.
- [Logging](logging.md): Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.
