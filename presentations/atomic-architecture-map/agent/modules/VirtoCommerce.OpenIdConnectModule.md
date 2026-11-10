# OpenID Connect (`VirtoCommerce.OpenIdConnectModule`)

> OpenID Connect is an identity module on top of the OAuth 2.0

- Latest version: 3.1002.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-openid-connect
- Area: Security & compliance
- On the map: `#/molecule/VirtoCommerce.OpenIdConnectModule`

## For business analysts

Signing in through any standards-compliant OpenID Connect provider.

## For architects

The generic identity adapter — no dependencies, no storage — and the answer when a customer brings their own identity provider rather than one of the named ones.

## For developers

Everything is in the provider's discovery document and your claim mapping. Prefer this over a provider-specific module when the requirement is 'their IdP'.

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
- **A customer’s own identity provider** (Customer & accounts): Each buying organisation authenticates against its own directory, whichever standard one it is.

## Key features

- Authentication: Ensures secure user authentication and authorization.
- Single Sign-On (SSO): Allows users to log in once and gain access to multiple applications.
- User Information: Provides access to user profile information.
- Interoperability: Works with various identity providers like Google, Microsoft, and others.
- Security: Implements robust security measures to protect user data.

## Documentation

- [OpenID Connect module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Security/authentication/oidc/#openid-connect)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.OpenIdConnectModule)
- [Configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#oidc)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-openid-connect)
