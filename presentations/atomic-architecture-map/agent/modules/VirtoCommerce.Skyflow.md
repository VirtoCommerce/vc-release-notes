# Skyflow (`VirtoCommerce.Skyflow`)

> Skyflow Integration as payment provider enables a unified user experience for Credit Card transactions across diverse payment providers.

- Latest version: 3.1005.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-skyflow
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.Skyflow`

## For business analysts

A vault for sensitive payment data, so the platform never stores card details itself.

## For architects

Unusual for a payment module: it carries a GraphQL builder, because tokenisation has to reach the storefront where the card is entered. Three dependencies, no schema — the vault holds the data.

## For developers

Tokens, not numbers, cross your boundary. Anything that would put a raw card value in a log or a database is the mistake this module exists to prevent.

## Use it when

- Card data must never enter your infrastructure
- Compliance scope has to be reduced deliberately
- A storefront needs to tokenise at the point of entry

## Do not use it when

- You expect to read a card number back — that is the point of a vault
- The gateway already tokenises and you need nothing more
- Non-payment secrets: use configuration and a key vault

## Required modules

- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1000.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1015.0

## GraphQL builders

- [vc-module-skyflow/src/VirtoCommerce.Skyflow.XApi/Queries/SkyflowCardQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-skyflow/blob/dev/src/VirtoCommerce.Skyflow.XApi/Queries/SkyflowCardQueryBuilder.cs)

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Card data kept in a vault** (Cart & checkout): Sensitive payment details live outside the platform, which shrinks what has to be audited.

## Key features

- **Unified Credit Card User Experience:** Elevate your users' payment journey with a unified experience for credit card transactions across diverse payment providers.
- **PCI Compliance:** Skyflow ensures PCI compliance, streamlining adherence to industry standards for secure handling of payment data.
- **Integration with Virto Storefront:** Seamlessly integrated with [Virto Storefront](https://github.com/VirtoCommerce/vc-theme-b2b-vue) for a cohesive e-commerce experience.
- **Production-Ready Integration with Authorize.NET:** Fully functional integration with Authorize.NET payment providers, ready for production use.
- **Flexible Customization:** Utilize the power of Virto Commerce Native Extensibility Framework and Skyflow to integrate with a wide range of payment providers, tailored to your specific needs.
- **Optimized for Marketplaces:** Marketplaces can effortlessly connect with various Payment Service Providers preferred by individual suppliers, facilitating diverse payment options for customers.
- **Saved Credit Card:** Customers have the option to securely save their credit card information for future transactions, enhancing convenience and speed of checkout.

## Documentation

- [Skyflow module user documentation](https://docs.virtocommerce.org/platform/user-guide/inventory/overview/)
- [Skyflow module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Payments/skyflow/)
- [Payment methods configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#payments)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Skyflow)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-skyflow)
