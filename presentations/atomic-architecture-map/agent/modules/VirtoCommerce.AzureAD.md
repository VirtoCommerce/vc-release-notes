# Azure Active Directory Single Sign-On (`VirtoCommerce.AzureAD`)

> Azure AD SSO integrates with Azure AD to provide secure authentication and authorization for cloud and on-premises applications.

- Latest version: 3.1003.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-azure-ad
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AzureAD`

## For business analysts

Signing in with a Microsoft Entra ID (Azure AD) account instead of a platform password.

## For architects

An authentication adapter with no dependencies, no schema and no settings — it is configured through the platform's authentication section. Back-office access is the usual case.

## For developers

Claims must be mapped to platform roles; nothing arrives authorised. Test the group-to-role mapping before switching a team over.

## Use it when

- Users must sign in with an identity your organisation already owns
- You need to stop managing passwords in the platform
- A B2B customer requires their own directory

## Do not use it when

- Authorisation questions — this only proves who someone is
- Storefront customer accounts, unless the business really wants a corporate directory for shoppers
- You expect roles to arrive automatically: mapping is configuration you must do

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.

## Key features

- The Azure AD module can be integrated with both the Virto Commerce Platform and the Frontend Application:
- Azure AD supports single-tenant and multi-tenant configurations.

## Documentation

- [Azure AD module user documentation](https://docs.virtocommerce.org/platform/user-guide/azure-ad/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.AzureAD)
- [Add Azure AD as SSO provider to Platform](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Security/extensions/adding-azure-as-sso-provider)
- [Add Azure AD as SSO provider to Frontend](https://docs.virtocommerce.org/storefront/developer-guide/authentication/adding-sso-provider)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-azure-ad)
