# Commerce Profile Experience API (`VirtoCommerce.ProfileExperienceApiModule`)

> 

- Latest version: 3.1023.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-profile-experience-api
- Area: Customer
- On the map: `#/molecule/VirtoCommerce.ProfileExperienceApiModule`

## For business analysts

Account and company self-service for a signed-in shopper: their profile, their addresses, their colleagues and who may do what.

## For architects

Four schema builders over Customer, with four optional dependencies — the most optional of any X module, which is what lets a customer-and-company Cell stand on its own. B2B organisation structure is the part that makes it more than a profile editor.

## For developers

Authorisation is the work: every query is scoped to the caller and their organisation role. Extend the requirements, not the resolver, when adding a field only an administrator should see.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0

## Optional modules

- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1009.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1008.0
- [Tax Core](VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`) ≥ 3.1007.0
- [Order Experience API](VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`) ≥ 3.1014.0

## GraphQL builders

- [vc-module-profile-experience-api/src/VirtoCommerce.ProfileExperienceApiModule.Data/Queries/AddressesQuery/BaseAddressesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-profile-experience-api/blob/dev/src/VirtoCommerce.ProfileExperienceApiModule.Data/Queries/AddressesQuery/BaseAddressesQueryBuilder.cs)
- [vc-module-profile-experience-api/src/VirtoCommerce.ProfileExperienceApiModule.Data/Queries/AddressesQuery/CurrentCustomerAddressesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-profile-experience-api/blob/dev/src/VirtoCommerce.ProfileExperienceApiModule.Data/Queries/AddressesQuery/CurrentCustomerAddressesQueryBuilder.cs)
- [vc-module-profile-experience-api/src/VirtoCommerce.ProfileExperienceApiModule.Data/Queries/AddressesQuery/CurrentOrganizationAddressesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-profile-experience-api/blob/dev/src/VirtoCommerce.ProfileExperienceApiModule.Data/Queries/AddressesQuery/CurrentOrganizationAddressesQueryBuilder.cs)
- [vc-module-profile-experience-api/src/VirtoCommerce.ProfileExperienceApiModule.Data/Schemas/ProfileSchema.cs](https://github.com/VirtoCommerce/vc-module-profile-experience-api/blob/dev/src/VirtoCommerce.ProfileExperienceApiModule.Data/Schemas/ProfileSchema.cs)

## Permissions

- `xapi:my_organization:edit`
- `xapi:my_organization:order:view`
- `xapi:my_organization:user:invite`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Customer self-service** (B2B buying): A customer administrator manages their own colleagues and addresses, within your limits.

## Documentation

- [xProfile module documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Profile/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-profile-experience-api)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
