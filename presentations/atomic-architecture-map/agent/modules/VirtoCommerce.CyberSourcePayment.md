# CyberSource Payment (`VirtoCommerce.CyberSourcePayment`)

> Integrates CyberSource's payment solutions into your Virto Commerce platform

- Latest version: 3.1003.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-cyber-source
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.CyberSourcePayment`

## For business analysts

Card payments through CyberSource.

## For architects

A Payment adapter with three settings and four dependencies — slightly heavier than its siblings because it reaches into the order and store context during authorisation.

## For developers

Follow the gateway's flow rather than the platform's: decision manager responses map onto payment status, and getting that mapping wrong strands orders in a pending state.

## Use it when

- This gateway is the one the business has a contract with
- A store needs a payment method that gateway offers
- Card data must stay out of your own scope

## Do not use it when

- You need the payment record — that is the order's payment document
- The requirement is a new method type rather than a gateway — extend Payment instead
- Two gateways for the same method on one store: choose per store, not per request

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1000.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1000.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1000.0

## Settings

- `VirtoCommerce.Payment.CyberSourcePayment.CardTypes`
- `VirtoCommerce.Payment.CyberSourcePayment.PaymentMode`
- `VirtoCommerce.Payment.CyberSourcePayment.Sandbox`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Card payments via gateway** (Cart & checkout): Take card payments without card data entering your systems.

## Key features

- Cybersource based payment methods like Card Payment, 3D Secure, Visa Click to Pay, Google Pay, eCheck & Apple Pay.
- Tokenization to create, update and delete a card token.
- Authorization and Capture of a payment.
- Refunding a payment back to the merchant.
- (Cooming Soon) Manual capture of a payment.
- (Cooming Soon) Synchronize payments for synchronizing the missing transactions and fraud transactions based on the decision taken by the merchant.

## Documentation

- [CyberSource module user documentation](https://docs.virtocommerce.org/platform/user-guide/cybersource/overview/)
- [CyberSource module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Payments/cybersource/)
- [Payment methods configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#payments)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-cyber-source)
