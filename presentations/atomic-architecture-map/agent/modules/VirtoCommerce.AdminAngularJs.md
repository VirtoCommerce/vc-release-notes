# Admin Angular JS (`VirtoCommerce.AdminAngularJs`)

> The AngularJS back office (Commerce Manager) for the Virto Commerce Platform. Without an admin UI module the platform runs API only.

- Latest version: 3.1096.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-admin-angular-js
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.AdminAngularJs`

## For business analysts

The back office most teams use today, the Commerce Manager, delivered as a module. A platform without it or Admin Shell has no back office screen at all; the APIs still run.

## For architects

Until platform 3.1092 the AngularJS admin was built into the platform. This module now carries the same page, scripts, styles and translations and maps the page itself (`hosting="Endpoint"`, app id `platform`, priority 100). With Admin Shell installed too, it owns the site root unless `VirtoCommerce:PlatformUI:RootApp` says otherwise, and it stays reachable at `/apps/platform/`. It has no database, settings or permissions of its own: who may sign in is decided by the platform's admin UI access policy.

## For developers

Module screens written for AngularJS keep working: each module's `dist/app.js` and `dist/style.css` bundles are loaded by this module as before. To close the page without uninstalling, set `VirtoCommerce:PlatformUI:Enable` to `false`; the API keeps running. Its version follows the platform's, so upgrade the two together.

## Use it when

- Every installation that uses the Commerce Manager today. After upgrading the platform past 3.1092, add this module to the package or the back office disappears
- Running it beside Admin Shell while screens move to Vue, with `RootApp` choosing which one opens at `/`

## Do not use it when

- API-only hosts, such as a scaled-out storefront tier. Leave it out and the host serves no back office
- New back-office screens. Build them as Admin Shell plugins; the AngularJS UI is maintained, not extended

## Business features it serves

- **Back office for staff** (Integration & operations): A screen where staff manage the catalogue, orders and customers. Without one, the platform serves APIs only.

## Key features

- **The AngularJS admin as it was:** the same page, scripts, styles, images, templates and translations, at the same URLs (`/dist/app.js`, `/images/...`, `/$(Platform)/Scripts/...`).
- **Module screens unchanged:** each module's AngularJS bundle (`dist/app.js`, `dist/style.css`) is listed by `GET /api/apps/platform/manifest` and loaded by the admin, as before.
- **Site root or app path:** served at `/` when it owns the site root, and always at `/apps/platform/`, where Admin Shell embeds it when the shell owns the root.
- **Turn off without uninstalling:** `VirtoCommerce:PlatformUI:Enable = false` keeps the page closed; the API is not affected.
- **No database, no settings, no permissions** of its own. Who may sign in is the platform's admin UI access policy (`VirtoCommerce:PlatformUI:Access`).

## Documentation

- [Admin UI in the platform](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/developer-guide/admin-ui.md)
- [Backoffice modularity](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/developer-guide/backoffice-modularity.md)
- [Admin Shell](https://github.com/VirtoCommerce/vc-module-admin-shell)
- [vc-platform](https://github.com/VirtoCommerce/vc-platform)
