# Validation (Vl)

> FluentValidation for domain and input rules — declared as a validator class, not scattered through services.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/validation`

## Pattern

Validator per type. Derive from `AbstractValidator<T>`, declare rules in the constructor, register in DI, and validate before persisting. The platform validates dynamic property types and setting entries exactly this way.

## When to use

- Validating a domain model before save, with messages an operator will read
- Complex or conditional rules where data annotations run out
- Rules a solution module should be able to extend or replace

## Avoid

- Duplicating validation in the controller and the service; pick the layer that owns the invariant
- Database lookups inside a validator without care — validation runs on every save
- Relying on validation for security. Authorization is a separate concern

## API

- `AbstractValidator<T> (FluentValidation 12.1)` · [src/VirtoCommerce.Platform.Data/Validators/ObjectSettingEntryValidator.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/Validators/ObjectSettingEntryValidator.cs)
- `DynamicPropertyTypeValidator` · [src/VirtoCommerce.Platform.Data/Validators/DynamicPropertyTypeValidator.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/Validators/DynamicPropertyTypeValidator.cs)
- `Validator registration` · [src/VirtoCommerce.Platform.Data/DynamicProperties/ServiceCollectionExtenions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/DynamicProperties/ServiceCollectionExtenions.cs)

## Example

```csharp
// Module.Data/Validators — see ObjectSettingEntryValidator for the platform's own example.
public class MyEntityValidator : AbstractValidator<MyEntity>
{
    public MyEntityValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Code).NotEmpty().Matches("^[A-Z0-9-]+$")
            .WithMessage("Code may contain only capitals, digits and hyphens");
    }
}

// Validate before persisting, and fail with the collected messages.
await _validator.ValidateAndThrowAsync(entity);
```

## Pitfalls

- A validator registered but never invoked is dead code that looks like a safeguard. Make sure something actually calls it.
- Validation messages surface in the Admin UI, so they should be localizable and written for the operator rather than the developer.
- FluentValidation 12 tightened some behaviour versus older majors; do not copy rule syntax from ancient examples without checking.

## See also

- [Specifications](specifications.md): A one-method interface for a reusable, composable business rule.
- [Generic CRUD](generic-crud.md): Two abstract base classes with one abstract method each — you supply the query, not the plumbing.
- [Localizations](localizations.md): Translated strings for the Admin UI and localizable entity values, contributed per module.
