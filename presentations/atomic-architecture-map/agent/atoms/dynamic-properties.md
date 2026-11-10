# Dynamic properties (DP)

> Add a field to an existing entity without a migration, a code change or a fork. The first thing to try when extending.

- Family: Config & metadata
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/dynamic-properties`

## Pattern

Entity-attribute-value with a typed registry. Any entity implementing `IHasDynamicProperties` exposes an `ObjectType` and a `DynamicProperties` collection; properties are declared at runtime (or registered at startup) and stored generically, with optional dictionary-backed value lists.

## When to use

- A customer-specific field on a vendor entity — the canonical no-code extension
- Fields an operator should be able to add themselves
- Anything you would otherwise add by deriving a type and writing a migration, where the field is only ever data

## Avoid

- Fields you filter or sort large result sets by — EAV storage makes that expensive
- Core domain fields with real business behaviour; those deserve a proper typed property
- Dozens of properties on a hot entity — every read carries them

## API

- `IHasDynamicProperties` · [src/VirtoCommerce.Platform.Core/DynamicProperties/IHasDynamicProperties.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DynamicProperties/IHasDynamicProperties.cs)
- `IDynamicPropertyService` · [src/VirtoCommerce.Platform.Core/DynamicProperties/IDynamicPropertyService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DynamicProperties/IDynamicPropertyService.cs)
- `IDynamicPropertyRegistrar` · [src/VirtoCommerce.Platform.Core/DynamicProperties/IDynamicPropertyRegistrar.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DynamicProperties/IDynamicPropertyRegistrar.cs)
- `DynamicPropertiesExtensions` · [src/VirtoCommerce.Platform.Core/DynamicProperties/DynamicPropertiesExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DynamicProperties/DynamicPropertiesExtensions.cs)
- `IDynamicPropertyMetaDataResolver` · [src/VirtoCommerce.Platform.Core/DynamicProperties/IDynamicPropertyMetaDataResolver.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/DynamicProperties/IDynamicPropertyMetaDataResolver.cs)

## Example

```csharp
// Make your own entity extensible the same way vendor entities are.
public class MyEntity : AuditableEntity, IHasDynamicProperties
{
    public string ObjectType => GetType().FullName;
    public ICollection<DynamicObjectProperty> DynamicProperties { get; set; }
}

// Reading — the default is a required argument, and the value is coerced
// with Convert.ChangeType, so a bad cast throws here rather than at the call site.
var priority = order.GetDynamicPropertyValue("AbcPriority", defaultValue: "Normal");

// Writing — there is no Set… helper. You construct the property and its value.
order.DynamicProperties =
[
    new DynamicObjectProperty
    {
        Name = "AbcPriority",
        Values =
        [
            new DynamicPropertyObjectValue
            {
                PropertyName = "AbcPriority",
                ValueType = DynamicPropertyValueType.ShortText,
                Value = "High"
            }
        ]
    }
];
```

## Pitfalls

- Prefix your property names with a solution abbreviation (`AbcPriority`). A future vendor property with the same name is otherwise a collision you cannot rename your way out of.
- The API is asymmetric: `GetDynamicPropertyValue` exists, a matching setter does not. Writing means building a `DynamicObjectProperty` with its `Values` collection by hand.
- The getter takes only the *first* value across all matching properties, so a multi-value property silently gives you one of them.
- Dictionary-backed properties resolve to the dictionary item's `Name`, not the raw stored value — the getter unwraps `DynamicPropertyDictionaryItem` (including from a `JObject`) for you, which is convenient until you compare against the wrong thing.
- Dynamic property values load separately from the entity, so check they are actually populated before reading rather than assuming.
- This is level 1 of the extensibility model. If you need behaviour rather than data, go to `AbstractTypeFactory` instead.

## Documentation

- [Using dynamic properties](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Dynamic-Properties/using-DynamicPropertyAccessor/)
- [Extending domain models](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/extending-domain-models/)

## See also

- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Settings](settings.md): Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.

## Topic

Part of **Extensibility decision tree**: No-code → API → native. Pick the lowest level that works.
