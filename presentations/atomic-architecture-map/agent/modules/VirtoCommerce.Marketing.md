# Marketing (`VirtoCommerce.Marketing`)

> Marketing system with dynamic contents and promotions management

- Latest version: 3.1011.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-marketing
- Area: Marketing & loyalty
- On the map: `#/molecule/VirtoCommerce.Marketing`

## For business analysts

Promotions and the content that advertises them: discount rules, coupons and their usage, plus dynamic content placed on the storefront. It is where a campaign is defined and where its take-up is recorded.

## For architects

Interesting for what is optional: Customer and Orders are declared `optional="true"`, so promotions can be evaluated on a host that has neither — the personalisation and order-history rules simply do not apply. It depends on Catalog, Payment, Shipping and Store because a promotion reasons about all four. Coupon usage is a table it owns, which is what makes "one per customer" enforceable rather than advisory.

## For developers

`Marketing.Promotion.CombinePolicy` decides whether promotions stack — read it before debugging a "wrong" discount. It handles `OrderChangedEvent` to record usage, so a promotion's counters follow checkout rather than the cart. Extend by contributing promotion and content conditions; the two controllers cover promotions and dynamic content separately.

## Use it when

- Discounts, coupons or campaign rules are the requirement
- Storefront content must vary by audience, place or campaign
- Coupon usage has to be limited or reported on

## Do not use it when

- You need the price before promotions — that is Pricing, and it runs first
- The discount is already on an order: the order keeps its own copy of what was applied
- You are building general CMS pages — that is Content, not dynamic content placement

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1010.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1009.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Optional modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0

## Owns these entities

- `PromotionEntity`
- `CouponEntity`
- `PromotionUsageEntity`
- `DynamicContentItemEntity`
- `DynamicContentPlaceEntity`
- `DynamicContentFolderEntity`

## Events it handles

- `CouponChangedEvent`
- `OrderChangedEvent`
- `PromotionChangedEvent`

## REST controllers

- `api/marketing` · 23 actions · [vc-module-marketing/src/VirtoCommerce.MarketingModule.Web/Controllers/Api/MarketingModuleDynamicContentController.cs](https://github.com/VirtoCommerce/vc-module-marketing/blob/dev/src/VirtoCommerce.MarketingModule.Web/Controllers/Api/MarketingModuleDynamicContentController.cs)
- `api/marketing/promotions` · 12 actions · [vc-module-marketing/src/VirtoCommerce.MarketingModule.Web/Controllers/Api/MarketingModulePromotionController.cs](https://github.com/VirtoCommerce/vc-module-marketing/blob/dev/src/VirtoCommerce.MarketingModule.Web/Controllers/Api/MarketingModulePromotionController.cs)

## Permissions

- `marketing:access`
- `marketing:create`
- `marketing:delete`
- `marketing:read`
- `marketing:update`

## Settings

- `Marketing.Coupon.CodeValidationPattern`
- `Marketing.Promotion.CombinePolicy`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 25.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Promotions & discounts** (Marketing & loyalty): Campaign rules that change what a shopper pays, configured rather than coded.
- **Coupons with usage limits** (Marketing & loyalty): Codes that can be limited per customer and reported on afterwards.
- **Targeted on-site content** (Marketing & loyalty): Banners and blocks that change by audience, place or campaign.

## Key features

- **Promotion lifecycle**: create, edit, clone, delete, enable/disable
- **Coupons support**: manage promotion coupons and coupon usages
- **Search and filtering**:
- keyword search
- saved filters (stored in client storage)
- predefined status filters: **All Promotions**, **Active**, **Upcoming**, **Archived**, **Deactivated**
- **Promotion usage visibility (optional Orders integration)**:
- “Usage History” widget shows the number of orders that used the promotion
- opens an Orders blade filtered by the current promotion
- shown only when `VirtoCommerce.Orders` module is installed
- **Dynamic content items**: create and manage content items and folders
- **Placeholders**: manage placeholders that define content slots in storefront pages
- **Publications**: publish content to placeholders with time windows and conditions
- **Role-based access control**:
- `marketing:access`, `marketing:read`, `marketing:create`, `marketing:update`, `marketing:delete`
- **Scope-based access**: permission scope supports restricting access by Store

## Documentation

- [Marketing module user documentation](https://docs.virtocommerce.org/platform/user-guide/marketing/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Marketing)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-marketing)
- [Developer guide](https://docs.virtocommerce.org/platform/developer-guide/Extensibility/extending-dynamic-expression-tree/#defining-new-class-for-expression-tree-prototype)
