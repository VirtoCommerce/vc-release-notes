# Commerce core (`VirtoCommerce.Core`)

> Common e-commerce domain functionality

- Latest version: 3.1014.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-core
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.Core`

## For business analysts

The shared vocabulary of commerce: currencies and their exchange rates, units of measure and weight, package types, and the number sequences that give orders and invoices their human-readable codes.

## For architects

A foundation module in the literal sense — it depends on nothing and much of the catalogue depends on it. Three entities only, because its value is the abstractions other modules build on rather than data of its own. The sequence table is the quiet load-bearing part: order and document numbering is centralised here, which is why numbering stays unique across a scaled-out deployment instead of colliding per host.

## For developers

Look here before defining your own currency, unit or numbering scheme — `MeasureUnits`, `WeightUnits` and `TaxTypes` are settings, not code. Sequences are the mechanism to reach for when a solution needs its own gapless document number. Note it publishes no domain events: this is data other modules read, not a source of change notifications.

## Use it when

- Currencies, exchange rates or units of measure are involved
- A document needs a generated, unique, human-readable number
- You are about to define a shared commerce primitive — check it does not already exist here

## Do not use it when

- You need a price: currency lives here, the price does not
- You want tax calculation — Core holds the tax *types*, Tax evaluates them
- You expect events on change: this module raises none

## Owns these entities

- `CurrencyEntity`
- `PackageTypeEntity`
- `SequenceEntity`

## REST controllers

- `api` · 9 actions · [vc-module-core/src/VirtoCommerce.CoreModule.Web/Controllers/Api/CommerceController.cs](https://github.com/VirtoCommerce/vc-module-core/blob/dev/src/VirtoCommerce.CoreModule.Web/Controllers/Api/CommerceController.cs)

## Permissions

- `core:currency:create`
- `core:currency:delete`
- `core:currency:update`
- `core:packageType:create`
- `core:packageType:delete`
- `core:packageType:update`

## Settings

- `VirtoCommerce.Core.FixedTaxRateProvider.Rate`
- `VirtoCommerce.Core.General.MeasureUnits`
- `VirtoCommerce.Core.General.TaxTypes`
- `VirtoCommerce.Core.General.WeightUnits`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 14.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Units & measurements** (Product data): Sell by weight, length or volume with units the business actually uses.
- **Multiple currencies** (Pricing): Sell in the currencies each market expects, with rates you control.

## Key features

- **Common commerce domain models**: shared types for money/currency, tax, addresses, outlines, SEO.
- **Currency management API**: list/create/update/delete currencies.
- **Package types management API**: list/create/update/delete package types.
- **Money rounding**: default rounding policy with an extension point to override it via DI.
- **Unique number generator**: sequence-based generator with configurable retry policy and counter reset rules.
- **Conditions engine foundation**: condition tree types, JSON converter, and a set of built-in conditions (geo, language, URL, etc.).
- **Multi-database support**: EF Core database provider selection (SQL Server / PostgreSQL / MySQL).
- **Export/Import support**: integrates with platform export/import pipeline for module data.
- **Back office assets**: scripts/templates and localization resources for admin UI scenarios.
