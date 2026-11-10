# Health checks (Hc)

> A `/health` endpoint that already checks modules, cache, Redis and the database — extend it, do not reinvent it.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/health-checks`

## Pattern

Composed health checks with tags and failure severities. The platform registers checks for modules, cache, Redis and the configured database provider, mapping them to `/health`. A module adds its own by registering another check.

## When to use

- Container orchestration probes — readiness and liveness
- Load-balancer health decisions
- Adding a check for a dependency your module cannot work without

## Avoid

- Expensive checks. A probe runs constantly and must not become load
- Marking a soft dependency `Unhealthy`; that takes the whole instance out of rotation
- Leaking internal details in the response body if the endpoint is publicly reachable

## API

- `services.AddHealthChecks()` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `ModulesHealthChecker` · [src/VirtoCommerce.Platform.Web/Infrastructure/HealthCheck/ModulesHealthChecker.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Infrastructure/HealthCheck/ModulesHealthChecker.cs)
- `CacheHealthChecker` · [src/VirtoCommerce.Platform.Web/Infrastructure/HealthCheck/CacheHealthChecker.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Infrastructure/HealthCheck/CacheHealthChecker.cs)
- `RedisHealthCheck` · [src/VirtoCommerce.Platform.Web/Infrastructure/HealthCheck/RedisHealthCheck.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Infrastructure/HealthCheck/RedisHealthCheck.cs)
- `MapHealthChecks("/health")` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)

## Example

```csharp
// What the platform already registers (Startup.cs) — note the deliberate severities:
services.AddHealthChecks()
    .AddCheck<ModulesHealthChecker>("Modules health",
        failureStatus: HealthStatus.Unhealthy, tags: ["Modules"])
    .AddCheck<CacheHealthChecker>("Cache health",
        failureStatus: HealthStatus.Degraded,  tags: ["Cache"])   // degraded, not unhealthy
    .AddCheck<RedisHealthCheck>("Redis health",
        failureStatus: HealthStatus.Unhealthy, tags: ["Cache"]);

// Plus a per-provider database check, and the endpoint:
// endpoints.MapHealthChecks("/health", new HealthCheckOptions { ... });
```

## Pitfalls

- Severity is a deployment decision encoded in code: `Degraded` keeps the instance in rotation, `Unhealthy` removes it. The platform marks cache degraded and Redis unhealthy — understand why before copying either.
- The database check is registered per configured provider, so a check that works on SQL Server has an equivalent for PostgreSQL and MySQL.
- A probe that touches the database on every call becomes a load source of its own at orchestration frequency.

## Documentation

- [Health checks](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/health-checks/)

## See also

- [Logging](logging.md): Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.
- [Developer tools](developer-tools.md): A registry of in-product diagnostic links, surfaced in the Admin UI and filtered by permission.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.

## Topic

Part of **Observability**: Knowing what production is doing before a customer tells you.
