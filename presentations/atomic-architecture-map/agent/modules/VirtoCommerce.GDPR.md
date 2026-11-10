# GDPR (`VirtoCommerce.GDPR`)

> Apply General Data Protection Regulation policies with review or remove their personal details, by anonymizing them, from your online store.

- Latest version: 3.1005.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-gdpr
- Area: Security & compliance
- On the map: `#/molecule/VirtoCommerce.GDPR`

## For business analysts

The data-protection obligations: exporting everything held about a person, and deleting it on request.

## For architects

Two dependencies, no storage and three permissions — it orchestrates other modules rather than holding personal data itself. That is the only design that can work, because personal data is spread across customer, order, cart and review data.

## For developers

Extend it when your module stores personal data: if it does not know about your table, your table will be missed by a subject access request. Deletion has to reconcile with records that must be kept for tax or audit.

## Use it when

- Subject access or erasure requests must be answerable
- A module you wrote stores personal data
- Compliance needs evidence that a request was fulfilled

## Do not use it when

- Anonymised analytics — no personal data, no obligation
- You expect it to find data it was never told about
- Retention rules are undecided: erasure and record-keeping conflict without them

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0

## REST controllers

- `api/gdpr` · 3 actions · [vc-module-gdpr/src/VirtoCommerce.GDPR.Web/Controllers/Api/GdprController.cs](https://github.com/VirtoCommerce/vc-module-gdpr/blob/dev/src/VirtoCommerce.GDPR.Web/Controllers/Api/GdprController.cs)

## Permissions

- `gdpr:access`
- `gdpr:anonymize`
- `gdpr:download`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Data export & erasure requests** (Customer & accounts): Answer a subject access or deletion request across everything the platform holds.

## Documentation

- [GDPR module user documentation](https://docs.virtocommerce.org/platform/user-guide/gdpr/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.GDPR)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-gdpr)
