# Module federation (Fe)

> The same modularity, on the front end: a module ships a built plugin and the shell discovers it at runtime.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/module-federation`

## Pattern

Micro-frontend host with runtime discovery. A module declares an `<app>` it hosts; any module can drop a `plugin.json` into its plugins folder, and the platform composes the list per app and per user into one manifest the shell fetches at startup. Webpack Module Federation loads the remotes.

## When to use

- Adding a screen to the Commerce Manager, the Vendor Portal or any VC-Shell app without forking the shell
- Shipping back-office UI **with** the module that owns the domain, so one artifact carries both halves of the feature
- Standing up your own vertical app — declare it in `module.manifest` and let other modules extend it
- Gating UI by permission: a plugin declares one, and it simply does not reach a user who lacks it

## Avoid

- Editing the shell to add your screen. That is the same mistake as editing a vendor module, one layer up
- Treating the manifest as static. It is per app and per user, and the ETag is what makes it cheap
- Shipping a plugin whose `remoteEntry.js` is built against a different shared-dependency version than the host — federation resolves shared deps at runtime, and a mismatch fails there rather than at build

## API

- `GET api/apps/{appId}/manifest — the shell's entry point` · [src/VirtoCommerce.Platform.Web/Controllers/Api/AppManifestController.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/AppManifestController.cs)
- `AppManifestService — probes every module for plugin.json` · [src/VirtoCommerce.Platform.Modules/AppManifestService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Modules/AppManifestService.cs)
- `AppManifestDescriptor.Hash — the ETag, and what it covers` · [src/VirtoCommerce.Platform.Core/Modularity/AppManifestDescriptor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/AppManifestDescriptor.cs)
- `PluginDescriptor — Entry, ContentFiles, Remote, Permission` · [src/VirtoCommerce.Platform.Core/Modularity/PluginDescriptor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/PluginDescriptor.cs)
- `ManifestApp — the <app> element in module.manifest` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestApp.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestApp.cs)
- `AppManifestCacheRegion — explicit invalidation` · [src/VirtoCommerce.Platform.Modules/AppManifestCacheRegion.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Modules/AppManifestCacheRegion.cs)

## Example

```xml
<!-- 1. A module declares an app it hosts. The platform serves it at /apps/{id}. -->
<module>
  <id>MyCompany.VendorPortal</id>
  <apps>
    <app id="vendor-portal">
      <title>Vendor Portal</title>
      <permission>vendor-portal:access</permission>
      <contentPath>Content/vendor-portal</contentPath>
    </app>
  </apps>
</module>

<!-- 2. Any module can contribute a federated plugin INTO that app, by dropping a
     plugin.json in its plugins folder. No change to the host, no rebuild of it. -->
<!--
plugins/abc-dashboard/plugin.json
{
  "id": "abc-dashboard",
  "version": "1.2.0",
  "permission": "abc:dashboard:access",
  "entry":  { "path": "remoteEntry.js" },
  "remote": { "name": "abcDashboard", "module": "./Dashboard" }
}
-->

<!-- 3. The shell asks the platform what it is made of, and caches on the ETag:

     GET  api/apps/vendor-portal/manifest
     If-None-Match: "<hash>"     ->  304, or the plugin list this user may see

     The hash covers the app version, every plugin entry and content file, the
     federation coordinates, and the permission-filtered subset - so a changed
     permission produces a changed manifest, not a stale one. -->
```

## Pitfalls

- The manifest is **cached per app id** in `IPlatformMemoryCache` — and the cache is **bypassed in Development**, so a `yarn build` that produces a new `remoteEntry.js` shows up on the next fetch without restarting the platform. In production it is stable until restart or `AppManifestCacheRegion.ExpireRegion()`.
- Plugin order follows the **module dependency graph**, not the folder listing — the service walks the topologically sorted module list. If your plugin must load after another module's, declare the module dependency.
- `platform` is a reserved app id: it belongs to the legacy AngularJS admin shell. Do not use it for your own app.
- The descriptor `Version` is the running **platform** version for the `platform` app, and the version of the module that declares `<app>` for everything else. Two different meanings behind one field name.
- The hash covers the permission-filtered plugin subset, so two users can legitimately receive two different manifests for the same app — do not cache it at a CDN or shared proxy keyed on the URL alone.
- Two registry modules carry the same title, **Frontend Modules Registry** — `VirtoCommerce.ModuleFederation` and `VirtoCommerce.FrontendModules`, both from the `frontend-modules` repository, both described as replacing the static `apps.json`. Check which one your solution actually installs before pinning a version.
- Since 3.1078 a `plugin.json` can carry a `contributions` object. The platform passes it to the host app unchanged and never interprets it; Admin Shell, for example, builds part of its menu from it.

## Documentation

- [Back-office app modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/07-backoffice-app-modularity/)
- [Modularity overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)
- [frontend-modules (GitHub)](https://github.com/VirtoCommerce/frontend-modules)
- [Module Federation (webpack)](https://webpack.js.org/concepts/module-federation/)

## See also

- [module.manifest](module-manifest.md): The file without which a module does not exist — and the file that decides whether it needs a .NET assembly at all.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.
- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.

## Topic

Part of **eCommerce modules**: What ships in the box and how the bounded contexts relate.
