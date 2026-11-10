# Cache regions (Cr)

> Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.

- Family: Caching
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/cache-regions`

## Pattern

Change token per region, backed by a `CancellationTokenSource`. Entries opt into a region with `AddExpirationToken(Region.CreateChangeToken())`; a write calls `ExpireRegion()` or `ExpireTokenForKey(id)`, cancelling the token and evicting every entry that registered it. Regions are strongly typed: `CancellableCacheRegion<T>` derives its name from `T`.

## When to use

- Every cached read in a service — pair each entity type with its own region
- Invalidating "everything derived from this entity" after a save, without tracking individual keys
- Per-id invalidation when a region-wide flush would be too blunt

## Avoid

- Inventing a region per method. Region granularity should follow the entity, not the call site
- Expiring a global region on every write — correct, but it throws away unrelated cached work
- Assuming an expire on one instance clears the others; that is what the Redis bus is for

## API

- `CancellableCacheRegion<T>` · [src/VirtoCommerce.Platform.Core/Caching/CancellableCacheRegion.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/CancellableCacheRegion.cs)
- `GenericCachingRegion<T>` · [src/VirtoCommerce.Platform.Caching/GenericCachingRegion.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/GenericCachingRegion.cs)
- `GenericSearchCachingRegion<T>` · [src/VirtoCommerce.Platform.Caching/GenericSearchCachingRegion.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/GenericSearchCachingRegion.cs)
- `GlobalCacheRegion` · [src/VirtoCommerce.Platform.Caching/GlobalCacheRegion.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/GlobalCacheRegion.cs)

## Example

```csharp
// Module.Data — one region per cached concern.
public class MyEntityCacheRegion : CancellableCacheRegion<MyEntityCacheRegion>
{
}

// Read side: enrol the entry in the region.
cacheEntry.AddExpirationToken(MyEntityCacheRegion.CreateChangeToken());

// Write side: after saving, clear what depends on it.
MyEntityCacheRegion.ExpireRegion();                 // everything in the region
MyEntityCacheRegion.ExpireTokenForKey(entity.Id);   // just one entity's entries
```

## Pitfalls

- A region cancels its token and replaces it, so entries registered *after* the expire are unaffected — expire after the write commits, not before.
- Search results usually need their own region separate from entity reads; otherwise every entity save also throws away every cached search.
- Expiring a region is cheap; recomputing everything it held may not be. Watch for expire-per-item loops during bulk saves — expire once at the end.

## Documentation

- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)

## See also

- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
