# JSON serialization (Js)

> The platform's REST API serializes with Newtonsoft, not System.Text.Json. Custom converters must match.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: api-edge
- Verified against platform 3.1096.0
- On the map: `#/atom/json-serialization`

## Pattern

Newtonsoft-based MVC serialization with polymorphic type support. `AddNewtonsoftJson` is configured in `Startup`, partly so derived types registered through `AbstractTypeFactory` are represented correctly in Swagger and on the wire.

## When to use

- Writing a converter for a type crossing the REST boundary — use Newtonsoft's `JsonConverter`
- Exposing a polymorphic type, where the concrete type must survive the round trip
- Controlling how a domain type appears in the API without changing the domain type

## Avoid

- Assuming `System.Text.Json` attributes apply to REST responses. They do not — MVC is on Newtonsoft
- Two competing converters for one type; the one that wins depends on registration order
- Serializing EF entities directly. Serialize the domain model

## API

- `AddNewtonsoftJson configuration` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `Platform JSON converters` · [src/VirtoCommerce.Platform.Core/JsonConverters/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Core/JsonConverters/)
- `DynamicPropertyAccessorJsonConverter` · [src/VirtoCommerce.Platform.Core/DynamicProperties/DynamicPropertyAccessorJsonConverter.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DynamicProperties/DynamicPropertyAccessorJsonConverter.cs)
- `ExportImport JsonSerializerExtensions` · [src/VirtoCommerce.Platform.Core/ExportImport/JsonSerializerExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ExportImport/JsonSerializerExtensions.cs)

## Example

```csharp
// Startup.cs configures MVC with Newtonsoft — note the comment in the source:
// "Next line needs to represent custom derived types in the resulting swagger doc
//  definitions. Because default SwaggerProvider used global JSON serialization settings"
services.AddControllers().AddNewtonsoftJson(options => { /* ... */ });

// So a converter for the REST boundary is a Newtonsoft one:
public class MyTypeConverter : Newtonsoft.Json.JsonConverter   // not System.Text.Json
{
    // ...
}
```

## Pitfalls

- This trips up developers arriving from modern ASP.NET Core, where `System.Text.Json` is the default. Here it is not, and attributes from the wrong library are silently ignored.
- Swagger schema generation reads the same global serializer settings, so a serialization change can quietly alter your published API contract.
- Types created through `AbstractTypeFactory` need the override registered on both sides of a round trip, or your derived properties are dropped on deserialization.

## Documentation

- [Polymorphic types in Swagger](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/type-inheritance-support-in-swagger/)

## See also

- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Swagger / OpenAPI](swagger.md): Generated API documentation per module and combined — the browsable contract, and the basis for generated clients.
- [Backup & restore](backup-restore.md): The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.
