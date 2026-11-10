# Datatrans Payment (`VirtoCommerce.Datatrans`)

> Datatrans payment module provides integration with Datatrans payment gateway for Virto Commerce.

- Latest version: 3.1003.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-datatrans
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.Datatrans`

## For business analysts

Card and local payment methods through Datatrans, common in the Swiss and EU markets.

## For architects

A Payment adapter with five settings. Regional method coverage is the reason to choose it over a global gateway.

## For developers

Method availability differs by market and currency, so store configuration matters more here than in a single-method gateway.

## Use it when

- This gateway is the one the business has a contract with
- A store needs a payment method that gateway offers
- Card data must stay out of your own scope

## Do not use it when

- You need the payment record — that is the order's payment document
- The requirement is a new method type rather than a gateway — extend Payment instead
- Two gateways for the same method on one store: choose per store, not per request

## Required modules

- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1002.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0

## Settings

- `VirtoCommerce.Payment.Datatrans.LightboxAutoSettle`
- `VirtoCommerce.Payment.Datatrans.LightboxPaymentMethods`
- `VirtoCommerce.Payment.Datatrans.PaymentMode`
- `VirtoCommerce.Payment.Datatrans.ReturnUrl`
- `VirtoCommerce.Payment.Datatrans.Sandbox`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Card payments via gateway** (Cart & checkout): Take card payments without card data entering your systems.

## Key features

- Two payment modes: Secure Fields (inline) and Lightbox (popup)
- Configurable payment method filtering for Lightbox mode
- Auto-settlement option for Lightbox transactions
- Full payment lifecycle: authorize, capture, void, refund
- Sandbox and production environments
- 3-D Secure support
- UI localization for Lightbox — the popup is rendered in the shopper's current culture via the Datatrans `language` parameter
