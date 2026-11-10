# Ids, not foreign keys (Xr)

> A module references another module's data by id and copies what it needs — which is what makes separate databases possible.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/cross-module-references`

## Pattern

Bounded context with denormalised boundary data. Across a module boundary you keep an **id** for traceability and a **copy** of the values you must not lose. No navigation property, no foreign key, no join.

## When to use

- Any time your entity needs data owned by another module
- Recording *what was true at the time* — a price, a name, a tax rate on an order
- Making a module independently deployable and independently storable
- Reporting that must not change when the source record changes

## Avoid

- A foreign key to another module's table. It compiles, it even works in one database, and it makes the boundary a lie
- Re-reading the source module to display a historical document — that is how an invoice silently changes
- Copying data that is not part of the decision being recorded; a copy is a maintenance cost

## API

- `LineItemEntity — ProductId, CatalogId, PriceId, Price, Sku, Name as plain values` · [vc-module-order/src/VirtoCommerce.OrdersModule.Data/Model/LineItemEntity.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Data/Model/LineItemEntity.cs)
- `DefaultCustomerOrderTotalsCalculator — sums stored values, never re-prices` · [vc-module-order/src/VirtoCommerce.OrdersModule.Data/Services/DefaultCustomerOrderTotalsCalculator.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Data/Services/DefaultCustomerOrderTotalsCalculator.cs)
- `AuditableEntity — the base every module entity derives from` · [src/VirtoCommerce.Platform.Core/Domain/AuditableEntity.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/AuditableEntity.cs)

## Example

```csharp
// vc-module-order — the order line item, trimmed to the boundary fields.
//
// Note what is NOT here: no Product navigation property, no Price navigation
// property, no [ForeignKey] to another module. Ids for traceability, values for
// truth. This is the entire reason Orders can live in its own database.
public class LineItemEntity : AuditableEntity
{
    // Owned by the Catalog module — an id, nothing more.
    public string ProductId { get; set; }
    public string CatalogId { get; set; }

    // Owned by the Pricing module — which price was used, recorded for audit.
    public string PriceId { get; set; }

    // Copied at checkout. The order keeps what was charged, not what the
    // pricelist says today.
    [Column(TypeName = "Money")]
    public decimal Price { get; set; }
    public string Sku { get; set; }
    public string Name { get; set; }

    // Every navigation property stays inside OrderDbContext.
    public virtual CustomerOrderEntity CustomerOrder { get; set; }
}
```

## Pitfalls

- The Order module has **no** backend dependency on Pricing — the only mention of pricing in the whole repository is in the Admin UI JavaScript. An order never re-prices itself.
- A copied value can go stale by design. That is intentional: a product renamed today must not rename itself on last year's invoice.
- Without a foreign key nothing stops a dangling id. Deleting a product does not clean up orders that reference it, and should not.
- You cannot join across modules in SQL. Cross-module reporting belongs in the search index or a warehouse, not in a query.

## Documentation

- [Architecture reference](https://docs.virtocommerce.org/platform/developer-guide/latest/Back-End-Architecture/02-conceptual-overview/)
- [Modularity overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)

## See also

- [Database per module](module-database.md): Every module owns its schema, and can own its physical database on one line of configuration.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
- [Repository & unit of work](repository-uow.md): The data-access boundary: a repository per module, one commit per unit of work.
- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
- [Indexed search](search.md): The read path the catalogue actually depends on — and one more engine to keep consistent with the database.

## Topic

Part of **eCommerce modules**: What ships in the box and how the bounded contexts relate.
