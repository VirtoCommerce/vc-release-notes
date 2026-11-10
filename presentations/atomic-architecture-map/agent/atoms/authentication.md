# Authentication (Au)

> Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.

- Family: Security
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/authentication`

## Pattern

ASP.NET Core Identity plus OpenIddict as the authorization server, with additional handlers for machine callers. The platform ships password login, bearer tokens, API key and basic authentication handlers, and external sign-in for SSO providers. Other ways to sign in, a second factor and passkeys are added by modules through [Sign-in extensions](sign-in-extensions.md); clients such as AI agents are registered as [OAuth applications](oauth-applications.md).

## When to use

- Storefront and Admin UI sign-in — bearer tokens from OpenIddict
- Machine-to-machine and integration callers — API keys
- Corporate SSO — an external provider such as Azure AD, via the external sign-in pipeline
- AI agents and third-party applications acting for a user — an OAuth application with consent, not a shared key

## Avoid

- Rolling your own token validation. The handlers already exist and are wired
- Basic authentication over anything but TLS, and preferably not at all
- Long-lived API keys with broad permissions; scope them and rotate them

## API

- `OpenIddict 7.7 configuration` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `ApiKeyAuthenticationHandler` · [src/VirtoCommerce.Platform.Web/Security/Authentication/ApiKeyAuthenticationHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Security/Authentication/ApiKeyAuthenticationHandler.cs)
- `BasicAuthenticationHandler` · [src/VirtoCommerce.Platform.Web/Security/Authentication/BasicAuthenticationHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Security/Authentication/BasicAuthenticationHandler.cs)
- `IUserApiKeyService` · [src/VirtoCommerce.Platform.Core/Security/IUserApiKeyService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/IUserApiKeyService.cs)
- `ExternalSignIn` · [src/VirtoCommerce.Platform.Core/Security/ExternalSignIn/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Core/Security/ExternalSignIn/)
- `ApplicationUser` · [src/VirtoCommerce.Platform.Core/Security/ApplicationUser.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/ApplicationUser.cs)

## Example

```bash
# Bearer token from the OpenIddict token endpoint.
curl -X POST https://localhost:5001/connect/token \
  -d "grant_type=password&username=admin&password=***&scope=offline_access"

# Then call the API with it:
curl https://localhost:5001/api/platform/modules \
  -H "Authorization: Bearer <access_token>"

# Or, for an integration caller, an API key instead of a token:
curl https://localhost:5001/api/platform/modules -H "api_key: <key>"
```

## Pitfalls

- Scaled out, bearer tokens must be validated by every instance — that needs shared data-protection keys, or tokens issued by one instance are rejected by another.
- External sign-in maps an external identity onto an `ApplicationUser`. Getting that mapping wrong silently creates duplicate users.
- API keys authenticate as a user, so they carry that user's permissions. A key for a highly privileged account is a highly privileged key.
- OpenIddict 7.x differs substantially from older majors; do not follow tutorials written for earlier versions.
- Since 3.1090 basic authentication refuses a user who needs a second factor and tells the caller to use an API key. An integration that signs in with a password stops working when MFA is switched on for its user.

## Documentation

- [Authentication overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authentication/overview/)
- [Secure Web API](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/overview/)
- [Authentication with Azure AD](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/extensions/adding-azure-as-sso-provider/)
- [Sharing bearer tokens across instances](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/sharing-bearer-tokens/)

## See also

- [Authorization policies](authorization.md): What the caller may do: policies and requirements for rules that a permission attribute cannot express.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [Current user & tenancy](current-user.md): Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.
- [Sign-in extensions](sign-in-extensions.md): Extension points a module uses to add a way of signing in, a second factor, or a sign-in method a user manages.
- [OAuth applications](oauth-applications.md): Clients registered in the back office, AI agents among them, with the resources each one may request tokens for.

## Topic

Part of **Security & compliance**: Identity, permissions and the surfaces that need locking down.
