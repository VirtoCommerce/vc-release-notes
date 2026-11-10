# Optional dependency (Od)

> Declare a dependency you can live without, and the module still loads when it is absent.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/optional-dependency`

## Pattern

Optional dependency, declared and resolved. `optional="true"` in the manifest takes the module out of the dependency solver and out of the installed-check; `IOptionalDependency<T>` is the runtime half, so code can ask whether the service is actually there.

## When to use

- A capability that enriches your module but is not required — the digital catalog runs without Pricing
- Building a module set small enough to deploy on its own: an optional edge is an edge you can cut
- Integrating with a module a customer may not have licensed or installed
- Any `serviceCollection` consumer that must not throw when the provider module is missing

## Avoid

- Marking a real requirement optional to make an install succeed — it will fail later, at a worse moment
- Resolving the service in `Initialize` and caching it; ask through `IOptionalDependency<T>` at the point of use
- Optional dependencies as a substitute for events. If you only need to be told something happened, handle the event instead

## API

- `IOptionalDependency<T> — HasValue / Value` · [src/VirtoCommerce.Platform.Core/Modularity/IOptionalDependency.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IOptionalDependency.cs)
- `OptionalDependencyManager<T> — the registered implementation` · [src/VirtoCommerce.Platform.Modules/OptionalDependencyManager.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Modules/OptionalDependencyManager.cs)
- `ManifestDependency.Optional — the optional="true" attribute` · [src/VirtoCommerce.Platform.Core/Modularity/ManifestDependency.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ManifestDependency.cs)
- `ModuleCatalog.SolveDependencies — optional edges are not added to the solver` · [src/VirtoCommerce.Platform.Core/Modularity/ModuleCatalog.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/ModuleCatalog.cs)
- `ModuleBootstrapper — required-dependency errors and their cascade` · [src/VirtoCommerce.Platform.Modules/ModuleBootstrapper.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Modules/ModuleBootstrapper.cs)
- `IPricingEvaluatorService.EvaluateProductPricesAsync — the optional service in the snippet` · [vc-module-pricing/src/VirtoCommerce.PricingModule.Core/Services/IPricingEvaluatorService.cs](https://github.com/VirtoCommerce/vc-module-pricing/blob/dev/src/VirtoCommerce.PricingModule.Core/Services/IPricingEvaluatorService.cs)

## Example

```csharp
// 1. Declare it in module.manifest:
//
//    <dependency id="VirtoCommerce.Pricing" version="3.1003.0" optional="true" />
//
//    xCatalog does exactly this for Pricing, Inventory and Marketing, which is why a
//    catalog-only host is a viable module set.

// 2. Ask for it at the point of use, not at registration:
public class ProductPriceEnricher
{
    private readonly IOptionalDependency<IPricingEvaluatorService> _pricing;

    public ProductPriceEnricher(IOptionalDependency<IPricingEvaluatorService> pricing)
    {
        _pricing = pricing;
    }

    public async Task EnrichAsync(Product product, PriceEvaluationContext context)
    {
        // HasValue is false when the Pricing module is not installed in THIS host.
        if (!_pricing.HasValue)
        {
            return;   // degrade, do not throw
        }

        // Evaluation takes a context, not an id: a pricelist assignment depends on
        // store, catalog, customer and quantity, not on the product alone.
        var prices = await _pricing.Value.EvaluateProductPricesAsync(context);
        product.Prices = prices.Where(x => x.ProductId == product.Id).ToList();
    }
}
```

## Pitfalls

- A **required** dependency that is missing is a hard gate: the module records `Module dependency {id} {version} is not installed` and every module depending on it is skipped with `Module skipped because its dependency has errors`. Optional edges are excluded from that cascade.
- `IOptionalDependency<T>` resolves through `IServiceProvider.GetService<T>()` on every access, so `HasValue` reflects the host it is running in — the same code is correct in a full host and in a subset host.
- Optional in the manifest and optional in code are two separate decisions. Declaring the edge optional without guarding the resolve gives you a null reference instead of a clear install error.
- The dependency solver ignores optional edges entirely, so an optional dependency does **not** guarantee load order. Do not rely on the other module having initialised first.

## Documentation

- [Modularity overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)
- [Extensibility overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Extensibility/overview/)

## See also

- [module.manifest](module-manifest.md): The file without which a module does not exist — and the file that decides whether it needs a .NET assembly at all.
- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [Host composition](host-composition.md): One image, several hosts: choose the module set per host, then choose the role per host in configuration.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.

## Topic

Part of **eCommerce modules**: What ships in the box and how the bounded contexts relate.
