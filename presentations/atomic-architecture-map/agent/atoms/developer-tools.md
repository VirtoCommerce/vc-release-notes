# Developer tools (Dt)

> A registry of in-product diagnostic links, surfaced in the Admin UI and filtered by permission.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/developer-tools`

## Pattern

Descriptor registry with per-user filtering. A module registers a `DeveloperToolDescriptor` pointing at a diagnostic page; `GetRegisteredTools(claimsPrincipal)` returns only what the current user may see, so tools are discoverable without being exposed.

## When to use

- Giving your module a diagnostics page reachable from the Admin UI
- Surfacing an existing dashboard (a job engine UI, a cache inspector) in one predictable place
- Anything an operator or support engineer needs, and should not have to be told the URL of

## Avoid

- Registering a tool without a permission check; the registry filters, but the page itself must also be protected
- Exposing anything that mutates state without an explicit confirmation and authorization
- Using it as a substitute for logs or health checks

## API

- `IDeveloperToolRegistrar` · [src/VirtoCommerce.Platform.Core/DeveloperTools/IDeveloperToolsRegistrar.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DeveloperTools/IDeveloperToolsRegistrar.cs)
- `DeveloperToolDescriptor` · [src/VirtoCommerce.Platform.Core/DeveloperTools/DeveloperToolDescriptor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DeveloperTools/DeveloperToolDescriptor.cs)
- `DeveloperToolsController (the list the UI reads)` · [src/VirtoCommerce.Platform.Web/Controllers/Api/DeveloperToolsController.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/DeveloperToolsController.cs)
- `Commerce Manager blade` · (vc-module-admin-angular-js: src/VirtoCommerce.AdminAngularJs.Web/Content/wwwroot/js/app/developer-tools/)

## Example

```csharp
// Module.Web/Module.cs — PostInitialize
appBuilder.ApplicationServices.GetRequiredService<IDeveloperToolRegistrar>()
    .RegisterDeveloperTool(new DeveloperToolDescriptor
    {
        Name = "My module diagnostics",
        Url = "/my-module/diagnostics"
    });

// The registry filters by ClaimsPrincipal, but the page behind the URL still
// needs its own [Authorize] — the registry hides the link, not the endpoint.
```

## Pitfalls

- Hiding a link is not access control. The tool's own endpoint must enforce authorization independently.
- This is where the job engine dashboard has historically been registered, which is why it disappears when no engine module is installed.
- Tool pages tend to accumulate privileged capability over time. Review what yours exposes as it grows.
- The registry and its REST endpoint are in the platform; the screen that lists the tools is not. Since 3.1092 it ships with the Admin AngularJS module, so a platform without that module has the registry but no page showing it.

## Documentation

- [Debugging without source code](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/debugging/)

## See also

- [Health checks](health-checks.md): A `/health` endpoint that already checks modules, cache, Redis and the database — extend it, do not reinvent it.
- [Logging](logging.md): Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [Cache disabler](cache-disabler.md): Turn caching off for a scope or for the whole app — a diagnostic tool and an import-time necessity.
- [Back office module](admin-ui.md): The back office is an installable module. Without one, the platform serves APIs only.

## Topic

Part of **Observability**: Knowing what production is doing before a customer tells you.
