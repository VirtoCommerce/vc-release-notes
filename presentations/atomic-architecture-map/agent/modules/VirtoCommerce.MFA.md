# Multi-Factor Authentication (`VirtoCommerce.MFA`)

> Protects password sign-ins to the Backoffice and the storefront with a second factor: a one-time code sent by email. Enabled globally or per store.

- Latest version: 3.1003.0 (needs platform 3.1093.0)
- Repository: https://github.com/VirtoCommerce/vc-module-mfa
- Area: Security & compliance
- On the map: `#/molecule/VirtoCommerce.MFA`

## For business analysts

Adds a second step to password sign-in: after the password, the user enters a code sent by email. It can be required for everyone, per store, or left to customers and their organizations, and an organization can require it for all its members.

## For architects

Built on the platform's two-factor extension points (3.1090) and the ASP.NET Core Identity email token provider, so it keeps no tables of its own. The back office follows only the global setting; a password sign-in on the token endpoint follows the store named in the request, or the global setting when it names none. Basic authentication follows the global rule and, for users who need a code, is refused by the platform. It depends on Customer, Notifications and Store; with xAPI installed, an organization maintainer can also manage the organization's mode from the storefront.

## For developers

Before switching it on, confirm the email of every user it applies to and enable lockout for them: codes go to a confirmed address only. If an administrator is locked out by MFA, set `MultiFactorAuthentication:DisableEnforcement` to `true` as a recovery switch. The storefront calls `POST /api/mfa/resend` on its own host, so an ingress that forwards only listed paths needs `/api/mfa` added. Modes are `Off`, `Enabled` and `Required` per user and organization, and stores are `AdminManaged` or `CustomerChoice`.

## Use it when

- A security or compliance requirement for a second factor on back-office accounts
- B2B customers whose organizations want to require a second factor for their buyers
- Stores that should require a code while others on the same platform do not

## Do not use it when

- A second factor by authenticator app or SMS: this module sends codes by email only
- Integrations that sign in with a user's password. Move them to API keys first, or they stop working when the user needs a code
- Users whose email addresses are not confirmed

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1030.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1009.3
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1005.1

## Optional modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1027.0

## REST controllers

- `api/mfa` · 3 actions · [vc-module-mfa/src/VirtoCommerce.MFA.Web/Controllers/Api/MfaController.cs](https://github.com/VirtoCommerce/vc-module-mfa/blob/dev/src/VirtoCommerce.MFA.Web/Controllers/Api/MfaController.cs)
- `api/mfa/modes` · 6 actions · [vc-module-mfa/src/VirtoCommerce.MFA.Web/Controllers/Api/MfaModesController.cs](https://github.com/VirtoCommerce/vc-module-mfa/blob/dev/src/VirtoCommerce.MFA.Web/Controllers/Api/MfaModesController.cs)

## GraphQL builders

- [vc-module-mfa/src/VirtoCommerce.MFA.Xapi/Queries/MfaSettingsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-mfa/blob/dev/src/VirtoCommerce.MFA.Xapi/Queries/MfaSettingsQueryBuilder.cs)

## Permissions

- `mfa:manage`
- `mfa:read`
- `xapi:my_organization:mfa:manage`

## Settings

- `MultiFactorAuthentication.Enabled`
- `MultiFactorAuthentication.OrganizationMode`
- `MultiFactorAuthentication.StoreMode`
- `MultiFactorAuthentication.UserMode`

## Business features it serves

- **Two-factor sign-in** (Customer & accounts): After the password, a code sent by email — required for everyone, per store, or per customer organisation.
