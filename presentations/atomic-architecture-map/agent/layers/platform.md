# Platform (architecture layer)

> The shared substrate every module builds on. Most atoms on this poster live here — this is the layer worth knowing by heart.

- Tags: `Core`, `Data`, `Caching`, `Security`, `Modules`, `Web`
- On the map: `#/layer/platform`

## What to know

- `Platform.Core` — contracts and primitives only: caching, settings, dynamic properties, events, jobs, CRUD abstractions, `AbstractTypeFactory`, security contracts. Almost every atom in this map is declared here.
- `Platform.Data` — EF Core infrastructure, the platform `DbContext` and repositories, plus one project per database provider (`.SqlServer`, `.PostgreSql`, `.MySql`).
- `Platform.Caching` — `PlatformMemoryCache`, cache regions, and the Redis-backed variant that keeps per-instance memory caches coherent.
- `Platform.Security` — ASP.NET Core Identity, OpenIddict, permissions, API keys, external sign-in, admin-UI access policy.
- `Platform.Modules` — discovery, probing folder, dependency resolution, install/uninstall.
- `Platform.DistributedLock` — Redis (RedLock.net), or an in-process lock when Redis is not configured, so single-instance development needs no Redis.
- `Platform.Web` — the host: startup wiring, platform REST controllers, hosting for whichever admin UI module is installed, health checks at `/health`.

## Pitfalls

- Do not modify platform source in a solution. Customisation belongs in modules; this is what keeps updates clean.
- A DI registration made later wins. That is the extension mechanism for services, and also the way you accidentally replace something you did not mean to.

## Documentation

- [Architecture reference](https://docs.virtocommerce.org/platform/developer-guide/latest/Back-End-Architecture/02-conceptual-overview/)
- [Database agnostic](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Persistence/DB-Agnostic/overview/)
- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)
