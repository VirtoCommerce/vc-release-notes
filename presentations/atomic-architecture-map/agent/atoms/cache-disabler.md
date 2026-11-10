# Cache disabler (Cd)

> Turn caching off for a scope or for the whole app — a diagnostic tool and an import-time necessity.

- Family: Caching
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/cache-disabler`

## Pattern

Ambient scoped switch, plus global configuration. `CacheDisabler.DisableCache()` returns an `IDisposable`: inside that scope reads bypass the cache. `CachingOptions.CacheEnabled` does the same globally from configuration.

## When to use

- Confirming whether a bug is a stale cache entry or genuinely wrong data — the fastest way to split that question
- Bulk import or migration code that must read what it just wrote
- Locally reproducing a problem that only appears on a cold cache

## Avoid

- Leaving it disabled globally in production. Performance falls off a cliff, and the platform assumes caching is on
- Using it to paper over a missing expiration token — fix the invalidation instead
- Wrapping large call trees; you disable far more than you meant to

## API

- `CacheDisabler.DisableCache` · [src/VirtoCommerce.Platform.Core/Caching/CacheDisabler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/CacheDisabler.cs)
- `CacheDisabler.CacheDisabled` · [src/VirtoCommerce.Platform.Core/Caching/CacheDisabler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/CacheDisabler.cs)
- `CachingOptions.CacheEnabled` · [src/VirtoCommerce.Platform.Caching/CachingOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/CachingOptions.cs)

## Example

```csharp
// Read-after-write inside a scope, without touching global configuration.
using (CacheDisabler.DisableCache())
{
    var fresh = await _service.GetByIdAsync(id);   // bypasses the cache
}

// Globally, from appsettings.json:  "Caching": { "CacheEnabled": false }
```

## Pitfalls

- The flag is ambient (an async-local), so it follows the async flow — including into code you did not intend to affect.
- If disabling the cache fixes your bug, the real defect is a missing or wrong expiration token. Do not ship the disabler as the fix.
- Global `CacheEnabled: false` is a legitimate debugging setting and a terrible production one.

## Documentation

- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)
- [Debugging without source code](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/debugging/)

## See also

- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.
- [Developer tools](developer-tools.md): A registry of in-product diagnostic links, surfaced in the Admin UI and filtered by permission.
