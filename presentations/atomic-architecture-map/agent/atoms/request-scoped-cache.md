# Request-scoped cache (Rs)

> A cache that lives exactly as long as one request — the cheap fix for repeated loads inside a single call.

- Family: Caching
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/request-scoped-cache`

## Pattern

Per-request memoisation. `IRequestScopedCache` stores values for the lifetime of the current request via `HttpRequestScopedCacheAccessor`, and `GetOrLoadMapByIdsAsync` loads only the ids not already present — the dataloader pattern, minus the ceremony.

## When to use

- The same entity loaded several times while serving one request
- GraphQL resolvers, where the N+1 problem is structural rather than accidental
- Per-user or per-request data that must never leak into the shared memory cache

## Avoid

- Data that should outlive the request — that is the memory cache
- Background jobs and hosted services: there is no request, so there is no scope
- Using it as a way to avoid passing state through your own call chain

## API

- `IRequestScopedCache` · [src/VirtoCommerce.Platform.Core/Caching/IRequestScopedCache.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/IRequestScopedCache.cs)
- `IRequestScopedCacheAccessor` · [src/VirtoCommerce.Platform.Core/Caching/IRequestScopedCacheAccessor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/IRequestScopedCacheAccessor.cs)
- `HttpRequestScopedCacheAccessor` · [src/VirtoCommerce.Platform.Caching/HttpRequestScopedCacheAccessor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/HttpRequestScopedCacheAccessor.cs)
- `RequestScopedCacheExtensions` · [src/VirtoCommerce.Platform.Core/Caching/RequestScopedCacheExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Caching/RequestScopedCacheExtensions.cs)

## Example

```csharp
// Simple memoisation for the current request.
var store = await _requestCache.GetOrAddAsync(
    $"store:{storeId}",
    () => _storeService.GetByIdAsync(storeId));

// Batch by ids — only the misses reach loadMissing. This is the N+1 fix.
var map = await _requestCache.GetOrLoadMapByIdsAsync(
    keyPrefix: "product",
    ids: productIds,
    idSelector: x => x.Id,
    loadMissing: missing => _productService.GetAsync(missing));
```

## Pitfalls

- Outside a request there is no scope to store into — check behaviour before reusing request-scoped code inside a job.
- It is not a substitute for the memory cache: nothing survives the response, so a hot read still hits the database once per request.
- Per-user data belongs here precisely because it cannot leak; putting it in the shared cache is a data-disclosure bug, not just a design smell.

## Documentation

- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)

## See also

- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Current user & tenancy](current-user.md): Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.
