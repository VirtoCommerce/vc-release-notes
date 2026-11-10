# Tax Core (`VirtoCommerce.Tax`)

> Defines Core Abstractions for taxes evaluation by using different tax providers and FixedRateTaxProvider.

- Latest version: 3.1011.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-tax
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.Tax`

## For business analysts

How much tax to add, decided per store by a provider you choose — a fixed rate out of the box, or a service like Avalara for real jurisdictions. It is a calculation, not a stored number.

## For architects

The smallest port on the map: **one entity**, `StoreTaxProviderEntity`, and seven migrations. Everything else is provider code, and AvalaraTax is the adapter that proves the seam. Only two modules require it and two more declare it optional, so a host can be built without tax at all — which is exactly what a catalog-only or content-only Cell does.

## For developers

Implement a tax provider against the abstraction; the fixed-rate provider in the box is the reference. `VirtoCommerce.Core.FixedTaxRateProvider.Rate` and `VirtoCommerce.Core.General.TaxTypes` are settings, so a demo can be configured rather than coded. Evaluation happens on the cart and order totals path — keep providers fast, and cache remote calls yourself.

## Use it when

- Tax has to be calculated rather than typed in
- You are integrating a tax service, or writing rules for one jurisdiction
- Tax behaviour must differ per store

## Do not use it when

- You need the tax that was charged — the order and its line items keep their own copy
- The requirement is a price including tax: that is Pricing plus this evaluation, in that order
- You are building a Cell that never quotes a total — then this module need not be installed

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `StoreTaxProviderEntity`

## REST controllers

- `api/taxes` · 4 actions · [vc-module-tax/src/VirtoCommerce.TaxModule.Web/Controllers/Api/TaxModuleController.cs](https://github.com/VirtoCommerce/vc-module-tax/blob/dev/src/VirtoCommerce.TaxModule.Web/Controllers/Api/TaxModuleController.cs)

## Permissions

- `tax:read`
- `tax:update`

## Settings

- `VirtoCommerce.Core.FixedTaxRateProvider.Rate`
- `VirtoCommerce.Core.General.TaxTypes`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 7.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Tax calculation** (Pricing): Tax worked out per order rather than typed in, by whichever provider you choose.

## Key features

- **Flexible tax calculation**: Evaluate tax using different tax providers, including the built-in FixedRateTaxProvider, and easily add custom rules for tax calculation.
- **UI integration**: Display the list of available tax providers on the user interface and edit their settings directly from the platform.
- **Store-level tax configuration**: Connect tax providers to specific stores and configure different tax rates based on location, product type, or other parameters.
- **Customizable tax providers**: Implement custom tax providers by creating new modules that inherit from the abstract TaxProviderBase class.
- **Programmatic tax provider registration**: Register new tax providers programmatically by implementing the ITaxProvider interface.
- **API access**: Access the list of available tax providers and their settings via the public API.

## Documentation

- [Tax module user documentation](https://docs.virtocommerce.org/platform/user-guide/tax/overview/)
- [New tax provider registration](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Taxes/new-tax-provider-registration/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Tax)
- [Tax configurations](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#tax)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-tax)
