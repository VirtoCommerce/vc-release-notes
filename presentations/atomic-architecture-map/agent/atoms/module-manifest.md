# module.manifest (Mf)

> The file without which a module does not exist — and the file that decides whether it needs a .NET assembly at all.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/module-manifest`

## Pattern

Declarative descriptor read before any code runs. `ManifestReader` deserializes `module.manifest` into `ModuleManifest`, the catalog turns that into `ManifestModuleInfo` and resolves the dependency graph from it, and only then is an assembly loaded — if the manifest names one.

## When to use

- Every module. There is no convention-based fallback: no manifest, no module
- Declaring what you need — `platformVersion` gates compatibility and `dependencies` drives load order
- Shipping a **frontend-only module**: omit `assemblyFile` and you need no C# at all
- Contributing a standalone app to the admin shell through `<apps>`
- Declaring settings without an assembly, via `<settings>`

## Avoid

- Assuming `moduleType` is how the platform finds your `IModule` — it is only a tie-breaker
- A floating `platformVersion`; it is a compatibility gate, not documentation
- Declaring the same setting both in the manifest and in code — pick one per setting
- `startupType` in a module with no `assemblyFile`; it is resolved from the assembly, so it is silently meaningless

## API

- `ModuleManifest — the module.manifest schema` · [src/VirtoCommerce.Platform.Core/Modularity/ModuleManifest.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ModuleManifest.cs)
- `ManifestReader.Read` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestReader.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestReader.cs)
- `ManifestModuleInfo.LoadFromManifest` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestModuleInfo.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestModuleInfo.cs)
- `ManifestApp / AppPlacement` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestApp.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestApp.cs)
- `ManifestSetting` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestSetting.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestSetting.cs)

## Example

```xml
<!-- A .NET module. assemblyFile is what makes it code. -->
<module>
  <id>MyCompany.MyModule</id>
  <version>1.0.0</version>
  <platformVersion>3.1096.0</platformVersion>
  <dependencies>
    <dependency id="VirtoCommerce.Core" version="3.800.0" />
  </dependencies>

  <assemblyFile>MyCompany.MyModule.Web.dll</assemblyFile>
  <!-- Only consulted when that assembly contains MORE THAN ONE IModule.
       With exactly one, this element is ignored entirely. -->
  <moduleType>MyCompany.MyModule.Web.Module</moduleType>
  <!-- Optional IPlatformStartup contributor, resolved from the same assembly. -->
  <startupType>MyCompany.MyModule.Web.Startup</startupType>
</module>

<!-- A frontend-only module: no assemblyFile, therefore no C# and no IModule.
     The catalog marks it Initialized straight away and never loads an assembly. -->
<module>
  <id>MyCompany.MyPortal</id>
  <version>1.0.0</version>
  <platformVersion>3.1096.0</platformVersion>

  <apps>
    <app id="my-portal">
      <title>My portal</title>
      <permission>myPortal:access</permission>
      <contentPath>dist</contentPath>
      <placement>MainMenu</placement>
    </app>
  </apps>

  <!-- Settings with no assembly: registered through ISettingsRegistrar at startup,
       exactly as if IModule.Initialize had registered them. -->
  <settings>
    <setting>
      <name>MyPortal.PageSize</name>
      <valueType>Integer</valueType>
      <defaultValue>20</defaultValue>
    </setting>
  </settings>
</module>
```

## Pitfalls

- The platform does **not** read `moduleType` to find your module class. It scans the assembly for non-abstract `IModule` implementations: with exactly one it uses that and ignores `moduleType` completely — which is why a stale value can sit in a manifest for years and never break. Only when an assembly holds several does `moduleType` matter, matched by assembly-qualified-name prefix; no match throws `ModuleInitializeException`.
- Naming an `assemblyFile` whose assembly has *no* `IModule` implementation fails initialization with "No IModule implementation found in assembly …". A module with code must have a module class.
- The module class is created with `Activator.CreateInstance`, so it needs a public parameterless constructor. There is no constructor injection — that is precisely why the marker interfaces (`IHasConfiguration`, `IHasLogger`, `IHasHostEnvironment`) exist.
- Omitting `assemblyFile` is a supported shape, not an oversight: the catalog comments say "modules without assembly file don't need initialization" and set state to `Initialized` without loading anything.
- `<app>` takes `id` as an XML *attribute* while everything inside it is an element — an easy thing to get wrong by symmetry.
- Since 3.1092 an `<app>` can carry `<adminUI priority="…" hosting="…"/>` to declare itself a back office that can own the site root. Platforms older than that ignore the element. See [Back office module](admin-ui.md).

## Documentation

- [module.manifest file](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/06-module-manifest-file/)
- [Loading modules into the app process](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/04-loading-modules-into-app-process/)
- [Modularity overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)

## See also

- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Platform startup hooks](platform-startup.md): How a module participates in application startup beyond its own DI registrations.
- [Settings](settings.md): Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.
- [vc-build CLI](vc-build.md): The official CLI for building, packaging, installing and releasing a Virto solution — and for making installs reproducible.
