# Back office module (Ad)

> The back office is an installable module. Without one, the platform serves APIs only.

- Family: Modularity
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: channels
- Verified against platform 3.1096.0
- On the map: `#/atom/admin-ui`

## Pattern

An admin UI is a module that declares an `<app>` with an `<adminUI>` element in its `module.manifest`. Two ship today: **Admin AngularJS** (the Commerce Manager, app id `platform`, priority 100) and **Admin Shell** (the Vue/VC-Shell back office, app id `admin-shell`, priority 50). The platform picks the one that owns the site root from `VirtoCommerce:PlatformUI:RootApp`, or by highest priority when that is not set. An `App`-hosted UI is a static single-page app under `/apps/{appId}/`; an `Endpoint`-hosted UI maps its own page and is also mounted at `/apps/{appId}/`.

## When to use

- Every installation with people working in the back office: install one of the two admin UI modules
- API-only hosts, such as a scaled-out storefront tier, which should not serve a back office at all
- Running both UIs side by side during a move from the AngularJS Commerce Manager to Admin Shell, with `RootApp` choosing which opens at `/`

## Avoid

- Expecting the AngularJS Commerce Manager to be there after a platform upgrade. Since 3.1092 it comes from a module and has to be in the package
- Building a new back-office screen for the AngularJS UI when the target is Admin Shell. New work belongs in a VC-Shell app
- Using `platform` as an app id for your own app. It belongs to the AngularJS Commerce Manager

## Note

Until 3.1092 the AngularJS Commerce Manager was built into `Platform.Web/wwwroot`. It now lives in `vc-module-admin-angular-js`, and the platform keeps only the hosting: choosing the root UI, serving it, mounting it under `/apps/{appId}/`, and the landing page shown when no admin UI owns the root.

## API

- `ManifestAppAdminUI (<adminUI priority hosting>)` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestAppAdminUI.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestAppAdminUI.cs)
- `AdminUIHosting (App / Endpoint)` · [src/VirtoCommerce.Platform.Core/Modularity/AdminUIHosting.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/AdminUIHosting.cs)
- `PlatformUIOptions (VirtoCommerce:PlatformUI)` · [src/VirtoCommerce.Platform.Core/PlatformUIOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PlatformUIOptions.cs)
- `IAdminUIAppService` · [src/VirtoCommerce.Platform.Core/IAdminUIAppService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/IAdminUIAppService.cs)
- `AdminUIMiddleware` · [src/VirtoCommerce.Platform.Web/Infrastructure/AdminUI/AdminUIMiddleware.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Infrastructure/AdminUI/AdminUIMiddleware.cs)

## Example

```xml
<!-- module.manifest of an admin UI module. Admin Shell declares this; -->
<!-- Admin AngularJS declares app id "platform" with priority 100 and hosting="Endpoint". -->
<apps>
  <app id="admin-shell">
    <title>Admin Shell</title>
    <adminUI priority="50" />   <!-- hosting defaults to App -->
  </app>
</apps>

<!-- appsettings.json: which installed admin UI opens at the site root.     -->
<!-- Unset: highest priority wins. "none": no admin UI at /.                 -->
<!-- "VirtoCommerce": { "PlatformUI": { "RootApp": "admin-shell" } }          -->
```

## Pitfalls

- A platform with no admin UI module still starts and serves its APIs. The site root shows a small platform landing page instead of a back office, and it answers both GET and HEAD, so load-balancer probes on `/` keep passing and will not tell you the back office is missing.
- `RootApp` set to `none`, or `VirtoCommerce:PlatformUI:Enable` set to `false`, leaves the root without an admin UI even when one is installed.
- An `App`-hosted UI must load its files by absolute URLs under `/apps/{appId}/`, because the platform serves its index page at `/` without changing the address.
- Admin UI module versions move with the platform: Admin AngularJS is versioned in step with platform releases. Upgrade them together.

## Documentation

- [Back-office app modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/07-backoffice-app-modularity/)
- [Restrict admin UI access](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/restrict-admin-ui-access/)

## See also

- [Module federation](module-federation.md): The same modularity, on the front end: a module ships a built plugin and the shell discovers it at runtime.
- [module.manifest](module-manifest.md): The file without which a module does not exist — and the file that decides whether it needs a .NET assembly at all.
- [Host composition](host-composition.md): One image, several hosts: choose the module set per host, then choose the role per host in configuration.
- [REST API](rest-api.md): The platform’s HTTP surface: an MVC controller per module, a permission per action, a Swagger document per module.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
