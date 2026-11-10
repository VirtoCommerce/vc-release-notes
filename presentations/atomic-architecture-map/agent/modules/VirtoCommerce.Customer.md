# Companies and Contacts (`VirtoCommerce.Customer`)

> Managing customers contacts and organizations

- Latest version: 3.1034.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-customer
- Area: Customer
- On the map: `#/molecule/VirtoCommerce.Customer`

## For business analysts

Who you sell to and who works for you: contacts, the organizations they belong to, employees, and the addresses, notes and preferences attached to each. In B2B this is the module that models the buying company and its people, not just a login.

## For architects

One `Member` hierarchy — contact, organization, employee — with relations and memberships on top, which is why organization structure is a query here rather than a join across modules. It sits beside platform security rather than inside it: it handles `UserChangedEvent`, `UserRoleAddedEvent` and `UserRoleRemovedEvent` to keep member data aligned with accounts, so a solution that creates users must expect members to follow. Four index builders feed member search.

## For developers

`MemberChangingEvent` and `MemberChangedEvent` are the hooks; the 42-action member controller is the write surface, and the storefront path is the Profile experience API. Statuses, groups and the membership role whitelist are settings — `Customer.MembershipRolesWhitelist` decides which roles a customer administrator may hand out.

## Use it when

- You need the customer or company record behind an order, a cart or a login
- B2B structure matters: who belongs to which organization, and with what role
- You are storing contact-level data — addresses, notes, preferences — that is not authentication

## Do not use it when

- You need credentials, roles or tokens — that is platform security, and this module only reacts to it
- You are listing or searching members at scale on a storefront: use the index and the profile experience API
- The data belongs to an order — an order keeps its own copy of the addresses it shipped to

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [SEO](VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`) ≥ 3.1005.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1013.0

## Owns these entities

- `MemberEntity`
- `ContactEntity`
- `OrganizationEntity`
- `EmployeeEntity`
- `MemberRelationEntity`
- `OrganizationMembershipEntity`

## Events it publishes

- `MemberChangedEvent`
- `MemberChangingEvent`

## Events it handles

- `MemberChangedEvent`
- `OrganizationMembershipChangedEvent`
- `UserChangedEvent`
- `UserRoleAddedEvent`
- `UserRoleRemovedEvent`

## REST controllers

- `api` · 42 actions · [vc-module-customer/src/VirtoCommerce.CustomerModule.Web/Controllers/Api/CustomerModuleController.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/src/VirtoCommerce.CustomerModule.Web/Controllers/Api/CustomerModuleController.cs)
- `api/customer-preferences` · 5 actions · [vc-module-customer/src/VirtoCommerce.CustomerModule.Web/Controllers/Api/CustomerPreferenceController.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/src/VirtoCommerce.CustomerModule.Web/Controllers/Api/CustomerPreferenceController.cs)
- `api/customer/organization-memberships` · 9 actions · [vc-module-customer/src/VirtoCommerce.CustomerModule.Web/Controllers/Api/OrganizationMembershipController.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/src/VirtoCommerce.CustomerModule.Web/Controllers/Api/OrganizationMembershipController.cs)

## Search index builders

- [vc-module-customer/src/VirtoCommerce.CustomerModule.Data/Search/Indexing/MemberDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/src/VirtoCommerce.CustomerModule.Data/Search/Indexing/MemberDocumentBuilder.cs)
- [vc-module-customer/src/VirtoCommerce.CustomerModule.Data/Search/Indexing/MemberDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/src/VirtoCommerce.CustomerModule.Data/Search/Indexing/MemberDocumentChangesProvider.cs)
- [vc-module-customer/tests/VirtoCommerce.CustomerModule.Tests/Handlers/IndexOrganizationMembersChangedEventHandlerTests.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/tests/VirtoCommerce.CustomerModule.Tests/Handlers/IndexOrganizationMembersChangedEventHandlerTests.cs)
- [vc-module-customer/tests/VirtoCommerce.CustomerModule.Tests/Handlers/IndexOrganizationMembershipChangedEventHandlerTests.cs](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/tests/VirtoCommerce.CustomerModule.Tests/Handlers/IndexOrganizationMembershipChangedEventHandlerTests.cs)

## Permissions

- `customer:access`
- `customer:create`
- `customer:delete`
- `customer:invite`
- `customer:organization-membership:create`
- `customer:organization-membership:delete`
- `customer:organization-membership:read`
- `customer:organization-membership:update`
- `customer:read`
- `customer:update`

## Settings

- `Customer.ContactDefaultStatus`
- `Customer.ContactStatuses`
- `Customer.EmployeeStatuses`
- `Customer.ExportImport.PageSize`
- `Customer.MemberGroups`
- `Customer.MembershipRolesWhitelist`
- `Customer.OrganizationDefaultStatus`
- `Customer.OrganizationMembershipStatuses`
- `Customer.OrganizationRolesWhitelist`
- `Customer.OrganizationStatuses`
- `Customer.Search.EventBasedIndexation.Enable`
- `Customer.VendorStatuses`
- `Customer.WebContactIdTemplate`
- `VirtoCommerce.Search.IndexingJobs.IndexationDate.Member`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 71.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Companies & buyer accounts** (B2B buying): Sell to organisations: their people, their structure, and who may order.
- **Customer records** (Customer & accounts): Contacts, addresses, notes and preferences behind every order.

## Key features

- **Polymorphic member hierarchy** — `Contact`, `Organization`, `Employee`, `Vendor` inherit from a shared `Member` base and live in a parent/child tree (companies can contain sub-companies, employees, and contacts).
- **Extensible member types** — additional types can be registered by downstream modules via `memberTypesResolverService.registerType(...)` on the UI side and the polymorphic JSON converter on the API side.
- **Extensible filter panel** — downstream modules can contribute custom rows to the Members blade's `<va-filter-panel>` via `memberListFilterExtensionService.register(...)`. Each registered descriptor renders a partial inside the panel and hooks into `hasActiveFilters` / `clearFilters` / the Lucene token assembly used by `getSearchCriteria`. See [samples/VirtoCommerce.CustomerSampleModule.Web](https://github.com/VirtoCommerce/vc-module-customer/blob/dev/samples/VirtoCommerce.CustomerSampleModule.Web) for a working **Job title** example.
- **Polymorphic REST API** — a single `/api/members` surface handles search/CRUD for every type, with type-specific convenience routes (`/contacts`, `/organizations`, `/vendors`, `/employees`).
- **Structured filter panel** — filter members by type and Created/Modified date ranges (preset + custom) using Lucene-style keyword syntax (`membertype:Organization`, `createddate:[2026-01-01 TO]`).
- **Search indexing** — member documents are indexed through the Search module with event-driven reindexing on create/update/delete.
- **Invite customers** — generate invitation emails that onboard external contacts with a specific role (`RegisterCompanyEmailNotification` template).
- **Dynamic properties & SEO** — all member types support dynamic properties; `Vendor` also ships with SEO widget integration.
- **Favourite addresses and customer preferences** — per-member preference storage with its own CRUD/search services.
- **Multi-database support** — ships adapters for SQL Server, MySQL, and PostgreSQL.
- **Organization-scoped permissions** — `AssociatedOrganizationsOnlyScope` restricts access to members belonging to the caller's organisation.

## Documentation

- [Customer module user documentation](https://docs.virtocommerce.org/platform/user-guide/contacts/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Customer)
- [View on Github](https://github.com/VirtoCommerce/vc-module-customer)
- [Developer guide](https://docs.virtocommerce.org/platform/developer-guide/Tutorials-and-How-tos/Tutorials/extending-domain-models/)
