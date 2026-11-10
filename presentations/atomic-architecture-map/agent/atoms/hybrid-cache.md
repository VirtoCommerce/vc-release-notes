# Hybrid Cache (HC)

> .NET's own two-tier and distributed caching APIs. Neither is used here — reach for the platform cache instead.

- Family: Caching
- Adoption: **Available**. .NET offers it; this platform does not use it.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/hybrid-cache`

## Pattern

Two-tier (memory plus out-of-process backing store) with built-in stampede protection, in `HybridCache`; raw byte-array distributed storage in `IDistributedCache`. Conceptually attractive, but they do not participate in Virto's region-based invalidation.

## When to use

- Practically never inside a Virto module. The platform cache already gives you exclusive loading and cluster-wide invalidation
- Only if you need a genuinely shared cache store — and then only after confirming a memory cache plus the Redis bus will not do

## Avoid

- Introducing it alongside `IPlatformMemoryCache`. You end up with two caches, one invalidation mechanism, and stale reads nobody can explain
- Assuming Virto's Redis integration is an `IDistributedCache`. It is not — it carries invalidation messages, not values

## Use instead

`IPlatformMemoryCache` with `GetOrCreateExclusiveAsync` and a cache region token — see [Cache](platform-memory-cache.md).

## Note

Verified by grep across `src/`: there is no `HybridCache` package reference and no `IDistributedCache` store registration. The platform's answer to the same problems is per-instance memory plus the Redis invalidation bus.

## API

- `Microsoft.Extensions.Caching.Hybrid.HybridCache` · (.NET — not referenced by the platform)
- `IDistributedCache` · (.NET — no store registered by the platform)

## Pitfalls

- `HybridCache` solves cache stampede, which `GetOrCreateExclusiveAsync` already solves here — the reason to adopt it is usually already met.
- Two caching systems in one process is a correctness problem, not a redundancy: only one of them hears a region expire.

## Documentation

- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)

## See also

- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.
