# Contracts (`VirtoCommerce.Contracts`)

> Contract based price personalization for customers and organizations

- Latest version: 3.1008.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-contract
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.Contracts`

## For business analysts

Negotiated terms for a customer or organisation — agreed prices, validity dates, and who they apply to. The standing agreement behind B2B pricing.

## For architects

Three entities, 14 migrations, four dependencies and two GraphQL builders. It sits between Customer and Pricing: the contract decides which price list applies, so it is a pricing input rather than a price store.

## For developers

Two declared events make contract changes subscribable — the hook for invalidating cached prices. Read Pricing's assignment model before extending: a contract is another way to select a price list, not a second pricing engine.

## Use it when

- Different customers pay agreed rather than published prices
- Terms have validity periods that must be enforced
- A B2B account expects its own catalogue and pricing

## Do not use it when

- A promotion would do — that is Marketing, and it is simpler
- You need the price itself: contracts select, Pricing evaluates
- Consumer retail, where one public price list is the rule

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1008.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0

## Owns these entities

- `ContractEntity`

## Events it handles

- `ContractChangedEvent`

## REST controllers

- `api/contracts` · 5 actions · [vc-module-contract/src/VirtoCommerce.Contracts.Web/Controllers/Api/ContractController.cs](https://github.com/VirtoCommerce/vc-module-contract/blob/dev/src/VirtoCommerce.Contracts.Web/Controllers/Api/ContractController.cs)
- `api/contracts/members` · 3 actions · [vc-module-contract/src/VirtoCommerce.Contracts.Web/Controllers/Api/ContractMembersController.cs](https://github.com/VirtoCommerce/vc-module-contract/blob/dev/src/VirtoCommerce.Contracts.Web/Controllers/Api/ContractMembersController.cs)
- `api/contracts/prices` · 5 actions · [vc-module-contract/src/VirtoCommerce.Contracts.Web/Controllers/Api/ContractPricesController.cs](https://github.com/VirtoCommerce/vc-module-contract/blob/dev/src/VirtoCommerce.Contracts.Web/Controllers/Api/ContractPricesController.cs)

## GraphQL builders

- [vc-module-contract/src/VirtoCommerce.Contracts.ExperienceApi/Queries/ContractQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-contract/blob/dev/src/VirtoCommerce.Contracts.ExperienceApi/Queries/ContractQueryBuilder.cs)
- [vc-module-contract/src/VirtoCommerce.Contracts.ExperienceApi/Queries/OrganizationContractsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-contract/blob/dev/src/VirtoCommerce.Contracts.ExperienceApi/Queries/OrganizationContractsQueryBuilder.cs)

## Permissions

- `Contract:access`
- `Contract:create`
- `Contract:delete`
- `Contract:read`
- `Contract:update`

## Settings

- `Contract.Status`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 14.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Contracted prices** (Pricing): Negotiated rates for a customer or organisation, valid for an agreed period.

## Key features

- Support for multiple contracts for a single user
- Maintaining the **one contract to one store** relation
- Support for contracts based on the user group feature
- Attachments

## Documentation

- [Contract module documentation](https://docs.virtocommerce.org/platform/user-guide/contracts/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Contracts)
- [GitHub](https://github.com/VirtoCommerce/vc-module-contract)
