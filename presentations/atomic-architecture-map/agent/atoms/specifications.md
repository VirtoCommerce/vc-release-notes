# Specifications (Sp)

> A one-method interface for a reusable, composable business rule.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/specifications`

## Pattern

Specification pattern, deliberately minimal: `ISpecification<T>` is a single `bool IsSatisfiedBy(T obj)`. Rules become objects you can name, test in isolation and combine, instead of predicates duplicated across services.

## When to use

- A business rule stated in more than one place — eligibility, applicability, validity
- Rules a module should be able to replace, by registering a different specification
- Anything you want to unit test without constructing the service that uses it

## Avoid

- Wrapping a one-line predicate used once; a lambda is clearer
- Expecting it to translate to SQL. This evaluates in memory, unlike an EF predicate
- Building deep composition trees nobody can debug

## API

- `ISpecification<T>` · [src/VirtoCommerce.Platform.Core/Specifications/ISpecification.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Specifications/ISpecification.cs)
- `PredicateBuilder` · [src/VirtoCommerce.Platform.Core/Common/PredicateBuilder.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/PredicateBuilder.cs)

## Example

```csharp
// The entire contract, from Core/Specifications/ISpecification.cs:
public interface ISpecification<in T>
{
    bool IsSatisfiedBy(T obj);
}

// A named, testable, replaceable rule:
public class OrderIsRefundable : ISpecification<CustomerOrder>
{
    public bool IsSatisfiedBy(CustomerOrder order) =>
        order.Status == "Completed" && order.CreatedDate > DateTime.UtcNow.AddDays(-30);
}

// For database-side filtering use PredicateBuilder with IQueryable instead —
// specifications run in memory.
```

## Pitfalls

- In-memory evaluation only. Applying a specification to a large table means loading the table.
- For composable *query* predicates use `PredicateBuilder`, which builds expression trees EF can translate.
- Registering a specification in DI makes it overridable by a solution module — which is usually the reason to write one.

## See also

- [Validation](validation.md): FluentValidation for domain and input rules — declared as a validator class, not scattered through services.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
