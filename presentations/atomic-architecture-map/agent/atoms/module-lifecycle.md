# Module lifecycle (Mo)

> The two methods every module implements, and why the difference between them matters.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/module-lifecycle`

## Pattern

Two-phase initialization over a dependency-sorted module graph. `Initialize` registers services and type overrides while the container is still being built; `PostInitialize` runs once everything is registered and may resolve services — which is where registrars (settings, permissions) are called.

## When to use

- `Initialize` — DI registrations, `AbstractTypeFactory` overrides, options binding, EF context registration
- `PostInitialize` — registering settings and permissions, seeding, anything that needs to resolve a service
- Anywhere you are deciding "why is my registration too late?"

## Avoid

- Resolving services in `Initialize`. The container is not finished, and you will capture the wrong thing or fail outright
- Registering an `AbstractTypeFactory` override in `PostInitialize` — by then something may already have constructed the base type
- Long-running or network work in either method; it blocks startup for the whole application

## API

- `IModule` · [src/VirtoCommerce.Platform.Core/Modularity/IModule.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IModule.cs)
- `ManifestModuleInfo` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestModuleInfo.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestModuleInfo.cs)
- `ModuleManifest` · [src/VirtoCommerce.Platform.Core/Modularity/ModuleManifest.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ModuleManifest.cs)
- `ModuleDependencySolver` · [src/VirtoCommerce.Platform.Core/Modularity/ModuleDependencySolver.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ModuleDependencySolver.cs)
- `IHasConfiguration / IHasLogger` · [src/VirtoCommerce.Platform.Core/Modularity/IHasConfiguration.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IHasConfiguration.cs)

## Example

```csharp
public class Module : IModule, IHasConfiguration
{
    public ManifestModuleInfo ModuleInfo { get; set; }
    public IConfiguration Configuration { get; set; }

    public void Initialize(IServiceCollection services)
    {
        // Registrations only — the container is still being built.
        services.AddDbContext<MyModuleDbContext>(/* ... */);
        services.AddTransient<IMyService, MyService>();
        AbstractTypeFactory<CustomerOrder>.OverrideType<CustomerOrder, AbcCustomerOrder>();
    }

    public void PostInitialize(IApplicationBuilder appBuilder)
    {
        // Now it is safe to resolve things.
        var services = appBuilder.ApplicationServices;
        services.GetRequiredService<ISettingsRegistrar>()
            .RegisterSettings(ModuleConstants.Settings.AllSettings, ModuleInfo.Id);
        services.GetRequiredService<IPermissionsRegistrar>()
            .RegisterPermissions(ModuleConstants.Security.Permissions.AllPermissions);
    }

    public void Uninstall() { }
}
```

## Pitfalls

- A module without a valid `module.manifest` never loads, and the failure is easy to miss among startup logs.
- How the platform finds this class: it scans the assembly named by `assemblyFile` for non-abstract `IModule` implementations. One match is used directly and the manifest's `moduleType` is ignored; several require `moduleType` to disambiguate; none throws `ModuleInitializeException`.
- The class is instantiated with `Activator.CreateInstance`, so it needs a public parameterless constructor. Constructor injection does not work here — take `IConfiguration`, `ILogger` and `IHostEnvironment` through the marker interfaces instead, and resolve everything else in `PostInitialize`.
- A module with no `assemblyFile` has no `IModule` at all and skips this lifecycle entirely — see the `module.manifest` atom.
- Load order comes from the manifest dependency graph, topologically sorted. If your module needs another's registration, declare the dependency — do not rely on luck.
- `AbstractTypeFactory` overrides belong in `Initialize` precisely because `PostInitialize` can be too late.
- Optional dependencies exist (`IOptionalDependency`), so a module can adapt to another being absent rather than failing.

## Documentation

- [Create a new module](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/create-new-module-from-scratch/)
- [Create a new module (advanced)](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/02-folder-structure/)
- [Essential modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)

## See also

- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Platform startup hooks](platform-startup.md): How a module participates in application startup beyond its own DI registrations.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Settings](settings.md): Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.

## Topic

Part of **eCommerce modules**: What ships in the box and how the bounded contexts relate.
