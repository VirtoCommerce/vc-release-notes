# REST API (Rt)

> The platform’s HTTP surface: an MVC controller per module, a permission per action, a Swagger document per module.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: api-edge
- Verified against platform 3.1096.0
- On the map: `#/atom/rest-api`

## Pattern

Controllers under `Module.Web/Controllers/Api`, attribute-routed. `[Route("api/…")]` on the class, an HTTP verb attribute per action, `[Authorize(permission)]` where the permission name **is** the policy name. Three platform behaviours ride on the MVC pipeline and only on it: permission enforcement, the per-module Swagger document, and Newtonsoft serialization with polymorphic type resolution.

## When to use

- Anything the back office calls — the Admin SPA is a REST client and nothing else
- Full CRUD over a module’s entities, including the write side
- Server-to-server integration that wants a resource per URL and a verb per operation
- File upload and download, long-running job control, anything that is not a page of data for a storefront

## Avoid

- Minimal APIs (`app.MapGet`) inside a module — grep finds no `MapGet` in `src/`, and an endpoint registered that way inherits none of the three behaviours above
- Read-heavy storefront traffic. That is what [Business API (XAPI)](xapi.md) is for: one round trip, shaped by the caller
- Business logic in the controller. A controller binds, authorizes and delegates — the service layer holds the rules
- Inventing your own route shape. `api/{module}/{resource}` is what every existing client, and the Swagger grouping, expects

## API

- `[Route("api/platform/modules")] + [Authorize]` · [src/VirtoCommerce.Platform.Web/Controllers/Api/ModulesController.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/ModulesController.cs)
- `[Authorize(PlatformConstants.Security.Permissions.SettingQuery)]` · [src/VirtoCommerce.Platform.Web/Controllers/Api/SettingController.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/SettingController.cs)
- `One Swagger document per module` · [src/VirtoCommerce.Platform.Web/Swagger/SwaggerServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Swagger/SwaggerServiceCollectionExtensions.cs)
- `AddNewtonsoftJson + PolymorphJsonContractResolver` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `Controllers, as a set to read` · [src/VirtoCommerce.Platform.Web/Controllers/Api/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/)

## Example

```csharp
// Module.Web/Controllers/Api/MyThingsController.cs
[Route("api/mymodule/things")]
[Authorize]                                   // authenticated by default
public class MyThingsController : Controller
{
    private readonly IMyThingService _service;

    public MyThingsController(IMyThingService service) => _service = service;

    // GET api/mymodule/things/{id}
    [HttpGet("{id}")]
    [Authorize(ModuleConstants.Security.Permissions.Read)]   // the permission name IS the policy name
    public async Task<ActionResult<MyThing>> Get([FromRoute] string id)
    {
        var thing = await _service.GetByIdAsync(id);
        return thing == null ? NotFound() : Ok(thing);
    }

    // POST api/mymodule/things
    [HttpPost]
    [Authorize(ModuleConstants.Security.Permissions.Update)]
    public async Task<ActionResult<MyThing>> Create([FromBody] MyThing thing)
    {
        await _service.SaveChangesAsync([thing]);
        return Ok(thing);
    }

    // Hide an internal action from the module’s Swagger document
    [HttpGet("internal")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public ActionResult<string> Internal() => Ok("not documented");
}
```

## Pitfalls

- Microsoft recommends Minimal APIs for **new** projects, and is right to — but this is not a new project. Controllers are the extension point the platform’s permissions, Swagger grouping and serializer settings are attached to, so a module that steps outside MVC silently loses all three.
- A permission passed to `[Authorize]` is resolved as a policy name. Misspell it and you do not get a compile error — you get a 403 at runtime.
- `ApiExplorerSettings(IgnoreApi = true)` is how the platform keeps internal actions out of a module’s Swagger document. An action you forget to mark becomes part of your public API by accident.
- Serialization is Newtonsoft, not System.Text.Json, and polymorphic types resolve through `AbstractTypeFactory`. A DTO that serializes correctly in a unit test can still lose its derived type over the wire if it was never registered.

## Documentation

- [Create web APIs with ASP.NET Core (controllers)](https://learn.microsoft.com/aspnet/core/web-api/)
- [Routing to controller actions](https://learn.microsoft.com/aspnet/core/mvc/controllers/routing)
- [Controller-based vs Minimal APIs — Microsoft’s own comparison](https://learn.microsoft.com/aspnet/core/fundamentals/apis)
- [Policy-based authorization](https://learn.microsoft.com/aspnet/core/security/authorization/policies)
- [Swagger / OpenAPI in a module](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/swagger-api/)

## See also

- [Swagger / OpenAPI](swagger.md): Generated API documentation per module and combined — the browsable contract, and the basis for generated clients.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [JSON serialization](json-serialization.md): The platform's REST API serializes with Newtonsoft, not System.Text.Json. Custom converters must match.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Business API (XAPI)](xapi.md): The GraphQL business API: one endpoint, queries and mutations, assembled from whatever X-API modules are installed.
