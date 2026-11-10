# Returns (`VirtoCommerce.Return`)

> Return management module

- Latest version: 3.1007.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-return
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.Return`

## For business analysts

Returns and refunds after the sale: what came back, why, and what the customer gets.

## For architects

Three entities (the return, its lines and its attachments) and eight dependencies: no longer the light add-on it was, but a full part of the order lifecycle. Thirteen settings carry the policy — which order and shipment statuses allow a return, the return window, reasons, attachments and notifications — so a change of policy is not a release.

## For developers

It raises three events (`ReturnChangingEvent`, `ReturnChangedEvent`, `ReturnStatusChangedEvent`) for downstream systems; the money movement itself belongs to the order's refund document. Model the physical return and the financial refund as separate steps, because they fail independently.

## Use it when

- Customers send goods back and expect money or credit
- Return reasons and windows are business policy that changes
- Warehouse and finance need separate signals

## Do not use it when

- You only need to cancel an unshipped order — that is an order status change
- The refund is the whole requirement: Orders owns the payment document
- Exchange logistics: that is a new order plus a return, not one document

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1006.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Order Experience API](VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`) ≥ 3.1014.0

## Optional modules

- [Push Messages](VirtoCommerce.PushMessages.md) (`VirtoCommerce.PushMessages`) ≥ 3.1007.0

## Owns these entities

- `ReturnEntity`

## Events it publishes

- `ReturnStatusChangedEvent`

## Events it handles

- `ReturnChangedEvent`
- `ReturnStatusChangedEvent`

## REST controllers

- `api/return` · 7 actions · [vc-module-return/src/VirtoCommerce.ReturnModule.Web/Controllers/Api/ReturnController.cs](https://github.com/VirtoCommerce/vc-module-return/blob/dev/src/VirtoCommerce.ReturnModule.Web/Controllers/Api/ReturnController.cs)

## GraphQL builders

- [vc-module-return/src/VirtoCommerce.ReturnModule.ExperienceApi/Queries/ReturnQueryBuilderBase.cs](https://github.com/VirtoCommerce/vc-module-return/blob/dev/src/VirtoCommerce.ReturnModule.ExperienceApi/Queries/ReturnQueryBuilderBase.cs)
- [vc-module-return/src/VirtoCommerce.ReturnModule.ExperienceApi/Queries/ReturnSearchQueryBuilderBase.cs](https://github.com/VirtoCommerce/vc-module-return/blob/dev/src/VirtoCommerce.ReturnModule.ExperienceApi/Queries/ReturnSearchQueryBuilderBase.cs)
- [vc-module-return/src/VirtoCommerce.ReturnModule.ExperienceApi/Queries/ReturnStatusesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-return/blob/dev/src/VirtoCommerce.ReturnModule.ExperienceApi/Queries/ReturnStatusesQueryBuilder.cs)
- [vc-module-return/tests/VirtoCommerce.ReturnModule.Tests/ReturnSchemaBuilderTests.cs](https://github.com/VirtoCommerce/vc-module-return/blob/dev/tests/VirtoCommerce.ReturnModule.Tests/ReturnSchemaBuilderTests.cs)

## Permissions

- `return:access`
- `return:authorize`
- `return:create`
- `return:delete`
- `return:read`
- `return:update`
- `xapi:my_organization:return:submit`
- `xapi:my_organization:return:view`

## Settings

- `Return.AllowedOrderStatuses`
- `Return.AllowedShipmentStatuses`
- `Return.AttachmentsRequired`
- `Return.NotifyOrganizationEmail`
- `Return.Reasons`
- `Return.ReasonsRequiringComment`
- `Return.ReturnEnabled`
- `Return.ReturnNewNumberTemplate`
- `Return.ReturnPassword`
- `Return.SendNotifications`
- `Return.SendPushNotifications`
- `Return.Status`
- `Return.WindowDays`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 20.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Returns & refunds** (Orders & fulfilment): Handle goods coming back and money going out, as separate steps that can fail apart.

## Documentation

- [Returns module user documentation](https://docs.virtocommerce.org/platform/user-guide/return/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Return)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-return)
