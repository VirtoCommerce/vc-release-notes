# Loyalty (`VirtoCommerce.Loyalty`)

> Customer loyalty program is offering your customers some reward for shopping at your store.

- Latest version: 3.1011.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-loyalty
- Area: Marketing & loyalty
- On the map: `#/molecule/VirtoCommerce.Loyalty`

## For business analysts

Points, tiers and rewards: what a customer earns by buying and what they can spend it on.

## For architects

Eleven entities across programs, balances and missions, and five dependencies — a self-contained capability with fourteen declared events, the most of any extension here, because every accrual, redemption and mission step is something another system wants to hear about.

## For developers

Balances are data you own; accrual rules are the part to extend. Subscribe to its events rather than polling balances, and treat redemption as a transaction that can fail after the order is placed.

## Use it when

- The business rewards repeat purchase and wants it modelled, not improvised
- Points or tiers affect what a customer pays or sees
- Loyalty data must be visible to the storefront

## Do not use it when

- A single discount would do — that is a promotion
- You need the money side: loyalty is a parallel currency, not a payment method
- An external loyalty platform is the system of record: then integrate, do not duplicate

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1013.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1019.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1051.0
- [Cart Experience API](VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`) ≥ 3.1046.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1024.0

## Owns these entities

- `LoyaltyBalanceOperationLogEntity`
- `LoyaltyMissionEntity`
- `LoyaltyMissionGoalItemEntity`
- `LoyaltyMissionLocalizedDescriptionEntity`
- `LoyaltyMissionLocalizedNameEntity`
- `LoyaltyMissionProgressEntity`
- `LoyaltyMissionProgressItemEntity`
- `LoyaltyMissionTransactionEntity`
- `LoyaltyProgramEntity`
- `LoyaltyProgramLocalizedNameEntity`
- `LoyaltyProgramProductFactorEntity`

## Events it handles

- `OrderChangedEvent`
- `UserChangedEvent`

## REST controllers

- `api/loyalty-program-operation-log` · 3 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyBalanceOperationLogController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyBalanceOperationLogController.cs)
- `api/loyalty-missions` · 6 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyMissionController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyMissionController.cs)
- `api/loyalty-mission-goal-items` · 6 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyMissionGoalItemController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyMissionGoalItemController.cs)
- `api/loyalty-mission-progress` · 2 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyMissionProgressController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyMissionProgressController.cs)
- `api/loyalty-programs` · 6 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyProgramController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyProgramController.cs)
- `api/loyalty-program-product-factors` · 6 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyProgramProductFactorController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltyProgramProductFactorController.cs)
- `api/loyalty-setting` · 2 actions · [vc-module-loyalty/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltySettingController.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.Web/Controllers/Api/LoyaltySettingController.cs)

## GraphQL builders

- [vc-module-loyalty/src/VirtoCommerce.Loyalty.ExperienceApi/Queries/GetLoyaltyBalanceQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.ExperienceApi/Queries/GetLoyaltyBalanceQueryBuilder.cs)
- [vc-module-loyalty/src/VirtoCommerce.Loyalty.ExperienceApi/Queries/GetLoyaltyHistoryQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.ExperienceApi/Queries/GetLoyaltyHistoryQueryBuilder.cs)
- [vc-module-loyalty/src/VirtoCommerce.Loyalty.ExperienceApi/Queries/GetMissionProgressQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-loyalty/blob/dev/src/VirtoCommerce.Loyalty.ExperienceApi/Queries/GetMissionProgressQueryBuilder.cs)

## Permissions

- `loyalty:access`
- `loyalty:create`
- `loyalty:delete`
- `loyalty:read`
- `loyalty:update`

## Settings

- `Loyalty.Currency`
- `Loyalty.DefaultProductMultiplyFactor`
- `Loyalty.Enable`
- `Loyalty.LoyaltyBalanceCalculationMode`
- `Loyalty.Missions.Enable`
- `Loyalty.Mode`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 27.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Loyalty points & tiers** (Marketing & loyalty): Customers earn and spend rewards, with balances the storefront can show.

## Key features

- **Loyalty Program Management**
- Create and configure loyalty programs with specific conditions and reward rules.
- Define rewards in fixed points or as a percentage of the order value.
- Set program priorities, activation periods, and localized names.
- **Transaction Logging**
- Full audit log of loyalty points accruals and redemptions.
- Visibility into customer activity and balance changes.
- **Loyalty Payments**
- Includes a built-in **LoyaltyPaymentMethod** allowing customers to pay for orders using loyalty points.
- Payment with points can be activated and displayed as a checkout option on the storefront.
- Currently, points can only be used if the customer’s balance fully covers the order amount.
- Conversion rate: **1 point = 1 unit of order currency**.

## Documentation

- [User Documentation](https://docs.virtocommerce.org/platform/user-guide/3.0/loyalty/overview/)
- [API Reference](https://docs.virtocommerce.org/platform/developer-guide/3.0/GraphQL-Storefront-API-Reference-xAPI/Loyalty/overview/)
