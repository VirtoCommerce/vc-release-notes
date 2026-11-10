# AbstractTypeFactory (Af)

> The keystone of the extension model: replace any platform or vendor type with your own derived type.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/abstract-type-factory`

## Pattern

Type registry with factory creation. Every extensible type is constructed through `AbstractTypeFactory<T>.TryCreateInstance()` rather than `new`. Register an override once at startup and every construction site — including inside vendor modules you cannot edit — produces your derived type instead.

## When to use

- Adding a property or behaviour to a vendor domain type, when a dynamic property is not enough
- Replacing a vendor implementation with your own subclass
- Making your own types extensible for whoever builds on your module — always construct through the factory

## Avoid

- `new` for any extensible domain type. It works, and it silently breaks everyone's overrides
- Overriding a type in two places; the last registration wins and the conflict is invisible
- Reaching for this before checking whether a dynamic property or an event handler solves the problem more cheaply

## API

- `AbstractTypeFactory<T>.TryCreateInstance` · [src/VirtoCommerce.Platform.Core/Domain/AbstractTypeFactory.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/AbstractTypeFactory.cs)
- `AbstractTypeFactory<T>.OverrideType<Old, New>` · [src/VirtoCommerce.Platform.Core/Domain/AbstractTypeFactory.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/AbstractTypeFactory.cs)
- `AbstractTypeFactory<T>.RegisterType<T>` · [src/VirtoCommerce.Platform.Core/Domain/AbstractTypeFactory.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/AbstractTypeFactory.cs)
- `IFactory<T>` · [src/VirtoCommerce.Platform.Core/Domain/IFactory.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/IFactory.cs)

## Example

```csharp
// 1. Derive. Prefix new members so a future vendor property cannot collide.
public class AbcCustomerOrder : CustomerOrder
{
    public string AbcExternalOrderId { get; set; }
}

// 2. Register the override once, in Module.Initialize.
AbstractTypeFactory<CustomerOrder>.OverrideType<CustomerOrder, AbcCustomerOrder>();

// 3. Vendor code that never heard of you now builds your type:
var order = AbstractTypeFactory<CustomerOrder>.TryCreateInstance();   // → AbcCustomerOrder

// Which is why your own extensible types must also be created this way:
var mine = AbstractTypeFactory<MyEntity>.TryCreateInstance();         // not: new MyEntity()
```

## Pitfalls

- Register overrides in `Initialize`, before anything constructs the type. An override registered too late applies only to later constructions.
- The EF Core entity and the domain model are separate types. Overriding the domain model does not persist your new property — you also need the entity, the mapping and a migration.
- Two modules overriding the same type is a genuine conflict with no error: the load order decides, and load order is not something you control.
- Serialization sees the derived type, so a polymorphic payload can arrive as a base type unless the factory registration is present on both ends.

## Documentation

- [Extending domain models](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/extending-domain-models/)
- [Extensibility overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Extensibility/overview/)
- [Extend the DB model](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/extending-database-model/)

## See also

- [Dynamic properties](dynamic-properties.md): Add a field to an existing entity without a migration, a code change or a fork. The first thing to try when extending.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [JSON serialization](json-serialization.md): The platform's REST API serializes with Newtonsoft, not System.Text.Json. Custom converters must match.

## Topic

Part of **Extensibility decision tree**: No-code → API → native. Pick the lowest level that works.
