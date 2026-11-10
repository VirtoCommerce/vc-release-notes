# Native Payment Methods (`VirtoCommerce.NativePaymentMethods`)

> Non-integrative payment methods support

- Latest version: 3.1004.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-NativePaymentMethods
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.NativePaymentMethods`

## For business analysts

The payment options a business can offer without a gateway integration — cash on delivery, invoice, manual capture.

## For architects

The reference Payment adapter, and the one that proves the port: one entity, six migrations, and methods that complete without an external call. Often the only payment module a B2B solution needs.

## For developers

Read this module before writing a gateway integration — it is the smallest complete example of the Payment abstraction.

## Use it when

- Payment happens outside the system: invoice, bank transfer, on delivery
- A B2B flow needs an order placed before money moves
- You want a working example of the payment abstraction

## Do not use it when

- Card data is involved — that needs a real gateway and its compliance scope
- You need automatic capture or refund: those require the gateway's API
- The business expects instant authorisation

## Required modules

- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1000.0

## Owns these entities

- `NativePaymentMethodEntity`

## Events it handles

- `PaymentMethodInstancingEvent`

## REST controllers

- `api/native-payment-methods` · 4 actions · (vc-module-NativePaymentMethods/src/VirtoCommerce.NativePaymentMethods.Web/Controllers/Api/NativePaymentMethodsController.cs)

## Permissions

- `NativePaymentMethods:access`
- `NativePaymentMethods:create`
- `NativePaymentMethods:delete`
- `NativePaymentMethods:read`
- `NativePaymentMethods:update`

## Settings

- `NativePaymentMethods.DefaultSetting`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 6.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Pay by invoice or on account** (Cart & checkout): B2B buyers order now and settle later, with no gateway involved.

## Documentation

- [Native Payment Methods module user documentation](https://docs.virtocommerce.org/platform/user-guide/native-payment-methods/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.NativePaymentMethods)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-native-payment-methods)
