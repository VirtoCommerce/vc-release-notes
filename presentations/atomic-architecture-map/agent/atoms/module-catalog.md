# Module catalog & install (Mc)

> How modules are found, chosen, copied and loaded — including at runtime, from a gallery.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/module-catalog`

## Pattern

Discovery then probing then load. The local catalog scans the modules folder, the external catalog reads a remote manifest feed, the highest matching version wins, files are copied to a probing folder under a distributed lock, then assemblies load in dependency order — for the modules that have one.

## When to use

- Diagnosing why a module did not load, or why an old version is still running
- Understanding what module install does on a multi-instance deployment
- Reasoning about the two kinds of module the catalog handles: **.NET modules** with an `assemblyFile` and a C# `IModule`, and **frontend-only modules** that carry only static content, apps and manifest settings
- Building tooling or deployment automation around modules

## Avoid

- Editing the probing folder by hand and expecting it to survive; it is derived state
- Installing modules at runtime as a deployment strategy for production — prefer a baked image
- Assuming install is instant. It is a background operation, historically an actual background job

## API

- `ILocalModuleCatalog` · [src/VirtoCommerce.Platform.Core/Modularity/ILocalModuleCatalog.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ILocalModuleCatalog.cs)
- `IExternalModuleCatalog` · [src/VirtoCommerce.Platform.Core/Modularity/IExternalModuleCatalog.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IExternalModuleCatalog.cs)
- `IModuleInstaller` · [src/VirtoCommerce.Platform.Core/Modularity/IModuleInstaller.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IModuleInstaller.cs)
- `IModuleManagementService` · [src/VirtoCommerce.Platform.Core/Modularity/IModuleManagementService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IModuleManagementService.cs)
- `SemanticVersion` · [src/VirtoCommerce.Platform.Core/Common/SemanticVersion.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/SemanticVersion.cs)

## Example

```json
// module.manifest — the file without which nothing loads.
// Caret ranges: ^3.800.0 means >=3.800.0 <4.0.0
{
  "id": "MyCompany.MyModule",
  "version": "1.0.0",
  "platformVersion": "3.1096.0",
  "dependencies": [
    { "id": "VirtoCommerce.Core", "version": "3.800.0" }
  ]
}
```

## Pitfalls

- Two versions of a module present means the highest version wins — which is how a stale copy left in the modules folder can quietly shadow your build.
- A module with no `assemblyFile` is not broken: the catalog marks it `Initialized` on the spot and never loads an assembly for it. That is how a frontend-only module — admin app, static content, manifest-declared settings — ships with no C# at all.
- Which means "my module loaded but none of my code ran" has a boring likely cause: no `assemblyFile` in the manifest, so there was no code to run.
- Multi-instance installs coordinate through a Redis distributed lock. Without Redis, concurrent installs can race over the probing folder.
- The platform's own module management has historically run as a background job, which is why job engine availability and module install are entangled.
- `platformVersion` is a compatibility gate, not documentation: get it wrong and the module is skipped.
- Since 3.1091 dependencies are resolved for the version being installed rather than the one already installed, so upgrading a module shows and installs what its new version requires.

## Documentation

- [Modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)
- [Deploy a module from source](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/deploy-module-from-source-code/)

## See also

- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [Platform startup hooks](platform-startup.md): How a module participates in application startup beyond its own DI registrations.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
