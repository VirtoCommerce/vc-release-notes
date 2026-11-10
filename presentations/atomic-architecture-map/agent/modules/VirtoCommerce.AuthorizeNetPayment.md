# Authorize.Net Payment Method (`VirtoCommerce.AuthorizeNetPayment`)

> Provides the integration with Authorize.Net payment provider

- Latest version: 3.1005.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-authorize-net
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AuthorizeNetPayment`

## For business analysts

Card payments through Authorize.Net.

## For architects

A Payment adapter: no schema, five settings carrying credentials and mode. The gateway holds the card data, which keeps PCI scope out of the platform.

## For developers

Test with the gateway's sandbox credentials; the settings switch environments. Capture and refund semantics are the gateway's, so read its docs before promising a flow.

## Use it when

- This gateway is the one the business has a contract with
- A store needs a payment method that gateway offers
- Card data must stay out of your own scope

## Do not use it when

- You need the payment record — that is the order's payment document
- The requirement is a new method type rather than a gateway — extend Payment instead
- Two gateways for the same method on one store: choose per store, not per request

## Required modules

- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1010.0

## Settings

- `VirtoCommerce.Payment.AuthorizeNetPayment.AcceptJSProdPath`
- `VirtoCommerce.Payment.AuthorizeNetPayment.AcceptJSTestPath`
- `VirtoCommerce.Payment.AuthorizeNetPayment.Mode`
- `VirtoCommerce.Payment.AuthorizeNetPayment.PaymentActionType`
- `VirtoCommerce.Payment.AuthorizeNetPayment.ProcessPaymentAction`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Card payments via gateway** (Cart & checkout): Take card payments without card data entering your systems.

## Documentation

- [Authorize.Net module user documentation](https://docs.virtocommerce.org/platform/user-guide/authorize-net/overview/)
- [Authorize.Net module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Payments/authorize-net/)
- [Payment methods configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#payments)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-authorize-net)
