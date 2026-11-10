# Options pattern (Op)

> Strongly typed `appsettings.json` binding — for infrastructure configuration, as opposed to operator settings.

- Family: Config & metadata
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/options-pattern`

## Pattern

Bind a configuration section to a POCO and inject it. `IOptions<T>` for values fixed at startup, `IOptionsMonitor<T>` when the value should follow a configuration reload. The platform uses both, `PlatformOptions` being the central example.

## When to use

- Connection strings, paths, feature switches that belong to the deployment rather than the operator
- Anything read at startup to decide how services are wired
- Values that must be present before the database is reachable

## Avoid

- Configuration an operator should change from the Admin UI — that is a platform setting
- Injecting `IConfiguration` and reading raw string keys; you lose validation, defaults and discoverability
- `IOptions<T>` for something that must react to a config change — it is captured once

## API

- `PlatformOptions` · [src/VirtoCommerce.Platform.Core/PlatformOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PlatformOptions.cs)
- `CachingOptions` · [src/VirtoCommerce.Platform.Caching/CachingOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/CachingOptions.cs)
- `AuthorizationOptions` · [src/VirtoCommerce.Platform.Core/Security/AuthorizationOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/AuthorizationOptions.cs)
- `IOptionsMonitor<T> usage` · [src/VirtoCommerce.Platform.Web/Security/Authentication/ApiKeyAuthenticationHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Security/Authentication/ApiKeyAuthenticationHandler.cs)

## Example

```csharp
// Module.Web — bind a section from appsettings.json.
services.AddOptions<MyModuleOptions>()
    .Bind(Configuration.GetSection("MyModule"))
    .ValidateDataAnnotations()      // fail at startup, not at first use
    .ValidateOnStart();

// Fixed at startup.
public class MyService(IOptions<MyModuleOptions> options) { }

// Follows configuration reloads — see ApiKeyAuthenticationHandler for a real example.
public class MyHandler(IOptionsMonitor<MyModuleOptions> options)
{
    private MyModuleOptions Current => options.CurrentValue;
}
```

## Pitfalls

- `IOptions<T>` is a singleton snapshot. If you edit `appsettings.json` expecting a live change, you need `IOptionsMonitor<T>`.
- `ValidateOnStart()` turns a typo in configuration into a startup failure instead of a null-reference hours later.
- The line between an option and a setting is ownership: the deployment owns options, the operator owns settings. Getting it wrong means an operator files a ticket to change a number.

## See also

- [Settings](settings.md): Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [Platform startup hooks](platform-startup.md): How a module participates in application startup beyond its own DI registrations.
