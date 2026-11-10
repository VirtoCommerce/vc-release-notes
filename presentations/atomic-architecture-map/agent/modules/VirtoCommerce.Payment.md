# Payment (`VirtoCommerce.Payment`)

> Provides management and integration of various payment methods.

- Latest version: 3.1012.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-payment
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.Payment`

## For business analysts

Which ways a shopper may pay, per store — and the record of each attempt to collect the money. The module itself takes no payments; it is the list of methods, their settings and their status, with the actual gateway plugged in behind it.

## For architects

A port with its adapters shipped separately: NativePaymentMethods, AuthorizeNet, CyberSource, Datatrans and Skyflow are each their own module, so adding a gateway is an install rather than a change here. Two entities is all it owns — a method per store, and its translated name — because the transactions themselves belong to the order. Ten modules require it, so it is present on almost every host.

## For developers

Implement a payment method against the module's abstraction and register it in code; the per-store configuration and its settings then appear in the back office without UI work. `PaymentMethodInstancingEvent` is the hook for adjusting a method as it is created — the place to inject solution-specific rates or restrictions.

## Use it when

- A store needs a new way to pay, or an existing method configured differently
- You are writing a gateway integration — implement the method, do not fork the module
- Payment methods must vary by store, market or currency

## Do not use it when

- You need what was actually paid — that is the payment document on the order
- You are reconciling money movements: captures, refunds and invoices live in Orders
- The requirement is a wallet or stored card — that is the gateway's concern, and PCI scope with it

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `StorePaymentMethodEntity`
- `PaymentMethodLocalizedNameEntity`

## REST controllers

- `api/payment` · 4 actions · [vc-module-payment/src/VirtoCommerce.Payment.Web/Controllers/Api/PaymentModuleController.cs](https://github.com/VirtoCommerce/vc-module-payment/blob/dev/src/VirtoCommerce.Payment.Web/Controllers/Api/PaymentModuleController.cs)

## Settings

- `VirtoCommerce.Payment.DefaultManualPaymentMethod.ExampleSetting`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 13.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Payment methods** (Cart & checkout): Offer the ways to pay each store needs, configured rather than coded.
- **Card payments via gateway** (Cart & checkout): Take card payments without card data entering your systems.

## Key features

- **Extensible payment method registration** — Register custom payment methods via code using `IPaymentMethodsRegistrar.RegisterPaymentMethod<T>()`; payment methods are resolved through `AbstractTypeFactory` polymorphism
- **Full payment lifecycle** — Abstract `PaymentMethod` base class supports Process, PostProcess, Void, Capture, and Refund operations with both synchronous (obsolete) and async APIs
- **Per-store configuration** — Each payment method is persisted per store with settings for activation, priority, logo, deferred payment, partial payment availability, and localized display names
- **Search and filtering** — Search payment methods by store, code, keyword, and active status; includes both persisted and transient (registered but not yet configured) methods in results
- **Built-in manual payment method** — `DefaultManualPaymentMethod` provides an out-of-the-box payment method supporting capture and refund flows for manual/offline payment scenarios
- **Localized display names** — Payment methods support localized names per language through the `PaymentMethodLocalizedName` entity
- **Domain events** — Publishes `PaymentMethodChangeEvent` (before save), `PaymentMethodChangedEvent` (after save), and `PaymentMethodInstancingEvent` (before instantiation) for extensibility
- **Export/Import** — Full platform export/import support for payment method configurations with batched processing
- **Multi-database support** — Entity Framework Core migrations for SQL Server, PostgreSQL, and MySQL
- **Polymorphic JSON serialization** — Custom `PaymentMethodsJsonConverter` enables correct deserialization of payment method subtypes via the `TypeName` discriminator

## Documentation

- [Payment module user documentation](https://docs.virtocommerce.org/platform/user-guide/payment/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Payment)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-payment)
