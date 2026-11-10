# Google Single Sign-On (`VirtoCommerce.GoogleSSO`)

> Enables Google external login setup (Single Sign-On) for Virto Commerce Platform and Frontend

- Latest version: 3.1003.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-google-sso
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.GoogleSSO`

## For business analysts

Signing in with a Google account.

## For architects

The same authentication-adapter shape as the Entra ID module: no dependencies, no storage, configuration only.

## For developers

Restrict to your workspace domain unless you genuinely want any Google account to reach the login screen.

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

## Business features it serves

- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.

## Key features

- The Google SSO module can be integrated with both the Virto Commerce Platform and the Frontend Application

## Documentation

- [Google SSO module user documentation](https://docs.virtocommerce.org/platform/user-guide/google-sso/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.GoogleSSO)
- [Add Google as SSO provider to Platform](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Security/extensions/adding-google-as-sso-provider/)
- [Add Google as SSO provider to Frontend](https://docs.virtocommerce.org/storefront/developer-guide/authentication/adding-google-as-sso-provider/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-google-sso)
