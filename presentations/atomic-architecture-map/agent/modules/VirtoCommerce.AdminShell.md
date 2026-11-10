# Admin Shell (`VirtoCommerce.AdminShell`)

> Vue (vc-shell) back office (Commerce Manager) for the Virto Commerce Platform. Without an admin UI module the platform runs API only.

- Latest version: 3.1094.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-admin-shell
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.AdminShell`

## For business analysts

The new back office, built on Vue. Administrators can arrange its menu and brand it with their own logo, company name and help and support links without a developer, and modules add their screens to it as plugins.

## For architects

An `App`-hosted admin UI (app id `admin-shell`, priority 50) served from `/apps/admin-shell/`. With Admin AngularJS installed as well, AngularJS owns the site root by default because its priority is higher; set `VirtoCommerce:PlatformUI:RootApp` to `admin-shell` to switch. Menu items can open Vue screens or AngularJS screens in an embedded frame, which is how the two back offices share one menu during a migration. It has no tables; branding and menu behaviour are platform settings.

## For developers

A module ships its Admin Shell UI in `plugins/admin-shell/`, and the platform lists installed plugins in the app manifest. The menu is assembled on the server from layers (the default menu, installed apps, plugin contributions) and can be edited in the Menu Editor, which needs `admin-shell:menu:manage`. Branding comes from the `AdminShell.Branding.*` settings and menu behaviour from `AdminShell.Menu.AllowHide` and `AdminShell.Menu.AllowPin`.

## Use it when

- New back-office work: screens are built as Admin Shell plugins
- Moving off the AngularJS Commerce Manager screen by screen, with both UIs in one menu
- A back office that has to carry a customer's or partner's own branding

## Do not use it when

- Installing it alone while some of your modules have no Admin Shell plugin yet. Their screens are AngularJS, which the shell can only show in its embedded frame when Admin AngularJS is installed too; without it the menu item says the classic admin is not installed
- Hosts that serve no back office at all

## REST controllers

- `api/admin-shell/branding` · 1 actions · [vc-module-admin-shell/src/VirtoCommerce.AdminShell.Web/Controllers/Api/AdminShellBrandingController.cs](https://github.com/VirtoCommerce/vc-module-admin-shell/blob/dev/src/VirtoCommerce.AdminShell.Web/Controllers/Api/AdminShellBrandingController.cs)
- `api/admin-shell/menu` · 14 actions · [vc-module-admin-shell/src/VirtoCommerce.AdminShell.Web/Controllers/Api/AdminShellMenuController.cs](https://github.com/VirtoCommerce/vc-module-admin-shell/blob/dev/src/VirtoCommerce.AdminShell.Web/Controllers/Api/AdminShellMenuController.cs)

## Permissions

- `admin-shell:menu:manage`

## Settings

- `AdminShell.Branding.CompanyName`
- `AdminShell.Branding.FaviconUrl`
- `AdminShell.Branding.HelpUrl`
- `AdminShell.Branding.LogoDarkUrl`
- `AdminShell.Branding.LogoUrl`
- `AdminShell.Branding.MarkUrl`
- `AdminShell.Branding.PrivacyUrl`
- `AdminShell.Branding.SupportUrl`
- `AdminShell.Branding.TermsUrl`
- `AdminShell.Home.Welcome`
- `AdminShell.Menu.AllowHide`
- `AdminShell.Menu.AllowPin`
- `AdminShell.Menu.AllowReorder`
- `AdminShell.Menu.Global`
- `AdminShell.Menu.Recent`
- `AdminShell.Menu.Role`
- `AdminShell.Menu.User`
- `AdminShell.SignIn.Showcase`
- `AdminShell.SignIn.Slides`
- `AdminShell.Theme.Appearance`
- `AdminShell.Theme.Default`
- `AdminShell.Theme.UserChoice`
- `AdminShell.UI.Appearance`
- `AdminShell.UI.Theme`

## Business features it serves

- **Back office for staff** (Integration & operations): A screen where staff manage the catalogue, orders and customers. Without one, the platform serves APIs only.

## Key features

- **Module plugins:** modules ship their UI in `plugins/admin-shell/`. The platform lists installed plugins in the app manifest and the shell loads them at runtime, with their screens, menu items, search providers and widgets.
- **Seamless migration:**
- menu items open Vue screens, AngularJS screens (the classic admin in a persistent embedded frame), platform apps (embedded) or external links;
- a default menu item opens its module's Vue screen once the module's Admin Shell plugin is installed, and its AngularJS screen until then, keeping its place, group, pins and user settings.
- **Server-driven, layered menu:** the default menu (`default-menu.json`, installed apps, plugin contributions) → a global patch → role patches → each user's pins and hidden items. The result is filtered by permission, and a section or item stays visible when any role keeps it.
- **Admin Shell Menu Editor (Configuration › Monitoring & Tools):** drag sections and items (mouse, touch or keyboard) to reorder them or move them to another section or group, rename (per language), hide, add sections and links, saved as the global patch; *Edit as JSON* to view, download, upload and edit the changes for backup and restore; choose what users may personalize (pin, hide, reorder: turning one off stops applying users' changes without deleting them); find the AngularJS admin's screens and add the ones the menu doesn't have.
- **Nothing missing from the menu:** a workspace blade that no menu entry opens is listed in *More*, as is a contribution to a section the menu doesn't have.
- **Translated menu:** section, group and item titles in 15 languages from the menu's own locale files (`App/src/locales/menu`), plugin keys and the platform's server texts; renames by language from the editor.
- **Menu counters:** menu items show what waits (new orders, returns requested, reviews to moderate). Each module registers its counter from its plugin, and the shell polls them every minute while the tab is visible.
- **Recent and Pinned:**
- the panel lists the pages a user opens most (frequency with a 7-day half-life);
- users can pin and hide items.
- **Global search:** the header box (Ctrl+K / ⌘K; a full-screen sheet on phones) searches every registered provider at once, grouped by provider.
- `alias: text` scopes a search;
- slow groups don't hold back the others;
- a group that fails or takes over 8 seconds shows *Search failed* with *Retry*.
- **Platform screens in Vue:** Settings, Security, Modules, Dynamic properties, Developer tools, License and the user profile ship with the host.
- **Dashboard:**
- the host's and the modules' widgets on a draggable, resizable grid;
- the layout is saved per browser;
- *Reset layout* restores the defaults.
- **Desktop and phone:**
- a section rail and panel on desktop;
- a top bar and drawer on phones;
- light, dark and system themes.
- **Extension points for modules:**
- menu contributions;
- search providers;
- menu counters;
- dashboard widgets;
- widgets on other modules' and the platform's blades;
- the sign-in page.

## Documentation

- [View on GitHub](https://github.com/VirtoCommerce/vc-module-admin-shell/)
