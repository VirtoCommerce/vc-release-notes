# Platform startup hooks (Pi)

> How a module participates in application startup beyond its own DI registrations.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/platform-startup`

## Pattern

Startup contributor. A module can implement `IPlatformStartup` to take part in host configuration, and marker interfaces (`IHasConfiguration`, `IHasLogger`, `IHasHostEnvironment`, `IHasModuleCatalog`) declare what the platform should inject into the module class itself. Every `IPlatformStartup` method has an empty default, so a module implements only the stages it needs. Two of them place middleware at fixed points: `ConfigureAfterRouting` runs after the endpoint is matched and before authentication; `ConfigureAfterAuthentication` runs once the user is known and before authorization, so it still sees the requests authorization is about to reject.

## When to use

- Adding middleware to the request pipeline from a module
- Middleware that needs the matched endpoint, or the signed-in user, at a known point in the pipeline
- Needing `IConfiguration`, `ILogger` or `IHostEnvironment` inside `Module.cs`
- Startup work that must happen outside `Initialize` / `PostInitialize`

## Avoid

- Adding middleware in `Configure` when its position matters. `ConfigureAfterRouting` and `ConfigureAfterAuthentication` have defined places; `Configure` does not
- Doing in a startup hook what a plain DI registration would do
- Assuming your hook runs before another module's — order follows the dependency graph

## API

- `IPlatformStartup` · [src/VirtoCommerce.Platform.Core/Modularity/IPlatformStartup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IPlatformStartup.cs)
- `IHasConfiguration` · [src/VirtoCommerce.Platform.Core/Modularity/IHasConfiguration.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IHasConfiguration.cs)
- `IHasHostEnvironment` · [src/VirtoCommerce.Platform.Core/Modularity/IHasHostEnvironment.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IHasHostEnvironment.cs)
- `IHasLogger` · [src/VirtoCommerce.Platform.Core/Modularity/IHasLogger.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IHasLogger.cs)
- `IPlatformRestarter` · [src/VirtoCommerce.Platform.Core/Modularity/IPlatformRestarter.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IPlatformRestarter.cs)

## Example

```csharp
// Marker interfaces are how the module class gets platform services injected.
public class Module : IModule, IHasConfiguration, IHasLogger, IHasHostEnvironment
{
    public IConfiguration Configuration { get; set; }
    public ILogger Logger { get; set; }
    public IHostEnvironment HostEnvironment { get; set; }

    public void Initialize(IServiceCollection services)
    {
        if (HostEnvironment.IsDevelopment())
        {
            Logger.LogInformation("Registering development-only services");
        }
    }
}
```

## Pitfalls

- These marker interfaces are the supported way to reach configuration and logging in `Module.cs` — reaching for a static or a service locator instead is the usual mistake.
- Requests for static files never reach `ConfigureAfterRouting` or `ConfigureAfterAuthentication`: the platform serves the file and ends the request before either runs. Middleware registered there sees API and page requests, not scripts, styles or images.
- The two pipeline hooks arrived in 3.1067, and the empty defaults with them. A module that implements them needs that platform version as its minimum.
- `IPlatformRestarter` exists because some changes genuinely require a restart. Triggering one is an operational act, not a code path to take lightly.
- Since 3.1067 a module the platform will not initialize, because it failed validation, runs no startup hooks either. Before that its middleware still ran and resolved services that were never registered.

## Documentation

- [Create a new module (advanced)](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/02-folder-structure/)

## See also

- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [Options pattern](options-pattern.md): Strongly typed `appsettings.json` binding — for infrastructure configuration, as opposed to operator settings.
- [Logging](logging.md): Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.
- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Authentication](authentication.md): Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.
