# Swagger / OpenAPI (Sw)

> Generated API documentation per module and combined — the browsable contract, and the basis for generated clients.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: api-edge
- Verified against platform 3.1096.0
- On the map: `#/atom/swagger`

## Pattern

Reflection-driven document generation with per-module grouping. `AddSwagger` builds a document per module plus a combined one, so a module's API is discoverable as soon as it loads. Polymorphic types need explicit help to appear correctly.

## When to use

- Exploring an unfamiliar module's API — start here rather than in the controller source
- Generating a typed client (AutoRest and similar) from the document
- Confirming that a change to your controller did what you meant to the published contract

## Avoid

- Leaving the UI publicly reachable in production without considering what it discloses
- Assuming a derived type appears correctly. Polymorphism needs configuration
- Treating the generated document as documentation of intent; it describes shape, not meaning

## API

- `services.AddSwagger` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `app.UseSwagger` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `Platform Swagger helpers` · [src/VirtoCommerce.Platform.Core/Swagger/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Core/Swagger/)
- `PlatformOptions.UseAllOfToExtendReferenceSchemas` · [src/VirtoCommerce.Platform.Core/PlatformOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PlatformOptions.cs)

## Example

```bash
# Combined document and per-module documents are both served.
#   /docs/index.html                     — the UI
#   /docs/PlatformModule/swagger.json    — one module
#   /docs/VirtoCommerce.Platform/swagger.json

# Swashbuckle 10.2 with Microsoft.OpenApi 2.x. Because MVC serializes with
# Newtonsoft, schema generation follows those settings — a serialization
# change can alter your published contract.
```

## Pitfalls

- Schema generation uses the global JSON serializer settings, which are Newtonsoft here. That coupling means serializer changes are contract changes.
- Derived types registered through `AbstractTypeFactory` need explicit handling to show up — see the polymorphic-types technique doc.
- Per-module documents keep the UI usable; the combined document on a large install is enormous and slow to render.

## Documentation

- [Swagger endpoints](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/swagger-api/)
- [Polymorphic types in Swagger](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/type-inheritance-support-in-swagger/)

## See also

- [JSON serialization](json-serialization.md): The platform's REST API serializes with Newtonsoft, not System.Text.Json. Custom converters must match.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Developer tools](developer-tools.md): A registry of in-product diagnostic links, surfaced in the Admin UI and filtered by permission.
