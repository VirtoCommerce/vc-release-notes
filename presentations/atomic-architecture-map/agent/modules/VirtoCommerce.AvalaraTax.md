# Avalara Tax Provider (`VirtoCommerce.AvalaraTax`)

> Provides real time integration with Avalara Tax https://www.avalara.com/

- Latest version: 3.1007.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-avatax
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AvalaraTax`

## For business analysts

Tax calculated by Avalara, with real jurisdictions, exemptions and filing-grade rates.

## For architects

A Tax adapter, and the heaviest of the provider modules here — six dependencies and six settings — because a tax call needs the address, the line items and the customer's exemption status.

## For developers

Every quote is a remote call on the totals path: cache aggressively and design for the service being slow or down. Address validation is part of the value, not a side effect.

## Use it when

- Tax must be correct across jurisdictions rather than approximated
- Filing or exemption certificates are in scope
- Rates change often enough that maintaining them yourself is a liability

## Do not use it when

- A single flat rate is genuinely enough — the fixed-rate provider is free and instant
- The deployment cannot tolerate a remote call in checkout without a fallback
- You need the tax that was charged: read the order

## Required modules

- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1010.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1009.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Tax Core](VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`) ≥ 3.1007.0

## REST controllers

- `api/tax/avatax` · 5 actions · [vc-module-avatax/src/AvaTax.TaxModule.Web/Controller/AvaTaxController.cs](https://github.com/VirtoCommerce/vc-module-avatax/blob/dev/src/AvaTax.TaxModule.Web/Controller/AvaTaxController.cs)

## Permissions

- `tax:manage`

## Settings

- `Avalara.Credentials.AdminAreaUrl`
- `Avalara.Credentials.CompanyCode`
- `Avalara.Credentials.ServiceUrl`
- `Avalara.ScheduledOrdersSynchronization.CronExpression`
- `Avalara.ScheduledOrdersSynchronization.IsEnabled`
- `Avalara.ScheduledOrdersSynchronization.LastExecutionDate`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Jurisdiction-grade tax** (Pricing): Real rates, exemptions and filing data from a tax service.

## Documentation

- [AvaTax module user documentation](https://docs.virtocommerce.org/platform/user-guide/integrations/avalara/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.AvalaraTax)
- [Tax providers configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#tax)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-avatax)
