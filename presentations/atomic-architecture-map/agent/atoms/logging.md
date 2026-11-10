# Logging (Lg)

> Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/logging`

## Pattern

Structured logging through the standard abstraction. Inject `ILogger<T>`, log message templates with named properties rather than interpolated strings, and let configuration decide the sinks. A bootstrap logger exists because module loading happens before DI is ready.

## When to use

- Anything you would want to see in production when something goes wrong
- Structured properties you will later filter on: entity ids, store ids, job ids
- Warnings for recoverable oddities, errors for genuine failures

## Avoid

- String interpolation in log messages — you lose every structured property
- Logging personal data, secrets or full request bodies
- Logging and rethrowing at every level; one exception becomes five confusing entries

## API

- `Serilog configuration` · [src/VirtoCommerce.Platform.Web/Program.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Program.cs)
- `ILogger<T> (Microsoft.Extensions.Logging)` · [src/VirtoCommerce.Platform.Core/Logger/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Core/Logger/)
- `IHasLogger (module logger injection)` · [src/VirtoCommerce.Platform.Core/Modularity/IHasLogger.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IHasLogger.cs)

## Example

```csharp
// ✓ Structured: storeId and count stay queryable properties.
_logger.LogInformation("Reindexed store {StoreId} with {Count} documents", storeId, count);

// ✕ Interpolated: one opaque string, nothing to filter on.
_logger.LogInformation($"Reindexed store {storeId} with {count} documents");

// Exceptions go in the first parameter, not into the message.
_logger.LogError(ex, "Reindex failed for store {StoreId}", storeId);
```

## Pitfalls

- Sinks and levels come from the `Serilog` section of `appsettings.json`, so "logging is broken" is usually configuration rather than code.
- A bootstrap logger handles the window before DI exists — early module-loading failures land there, not in your configured sinks, which is why they can seem to vanish.
- Log level is a production cost. Debug logging left on in a hot path can outweigh the work being logged.

## Documentation

- [Logging](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Logging/overview/)

## See also

- [Health checks](health-checks.md): A `/health` endpoint that already checks modules, cache, Redis and the database — extend it, do not reinvent it.
- [Developer tools](developer-tools.md): A registry of in-product diagnostic links, surfaced in the Admin UI and filtered by permission.
- [Platform startup hooks](platform-startup.md): How a module participates in application startup beyond its own DI registrations.

## Topic

Part of **Observability**: Knowing what production is doing before a customer tells you.
