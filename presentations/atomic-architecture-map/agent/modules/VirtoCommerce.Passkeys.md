# Passkeys (`VirtoCommerce.Passkeys`)

> Sign-in with passkeys (WebAuthn) for the Commerce Manager and the storefront, with creating, renaming and deleting passkeys.

- Latest version: 3.1001.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-passkeys
- Area: Security & compliance
- On the map: `#/molecule/VirtoCommerce.Passkeys`

## For business analysts

Lets people sign in with a passkey, using a fingerprint, face or device PIN, instead of a password, both in the back office and in the storefront. Users create, rename and delete their passkeys from their profile.

## For architects

WebAuthn on top of the platform's sign-in methods (3.1091): the module adds a `passkey` grant type on the token endpoint and registers passkeys as a sign-in method, so they appear next to passwords and external logins. The keys are stored in the platform's security database, which gained the passkey tables in 3.1091; the module has none of its own. It depends on xAPI and XFrontend because its storefront part is delivered as an XFrontend plugin; an Admin Shell plugin adds passkey sign-in to the new back office.

## For developers

The passkey button and passkey creation appear only in browsers that support WebAuthn. A passkey is bound to the domain it was created on, so a passkey made for one host does not sign in on another. Each key shows its backup state (`DeviceOnly`, `BackedUp` or `NotBackedUp`), and a key without a name shows the authenticator's name from its AAGUID.

## Use it when

- Removing passwords for back-office users, or offering a faster sign-in to returning customers
- Phishing-resistant sign-in for privileged accounts

## Do not use it when

- Storefronts on several domains that expect one passkey to work on all of them
- Storefronts that do not use XFrontend: the storefront part is delivered through it

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1027.0
- [Frontend Experience API](VirtoCommerce.XFrontend.md) (`VirtoCommerce.XFrontend`) ≥ 3.1009.0

## REST controllers

- `api/passkeys` · 3 actions · [vc-module-passkeys/src/VirtoCommerce.Passkeys.Web/Controllers/Api/PasskeysController.cs](https://github.com/VirtoCommerce/vc-module-passkeys/blob/dev/src/VirtoCommerce.Passkeys.Web/Controllers/Api/PasskeysController.cs)

## GraphQL builders

- [vc-module-passkeys/src/VirtoCommerce.Passkeys.Xapi/Queries/PasskeyCreationOptionsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-passkeys/blob/dev/src/VirtoCommerce.Passkeys.Xapi/Queries/PasskeyCreationOptionsQueryBuilder.cs)
- [vc-module-passkeys/src/VirtoCommerce.Passkeys.Xapi/Queries/PasskeyRequestOptionsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-passkeys/blob/dev/src/VirtoCommerce.Passkeys.Xapi/Queries/PasskeyRequestOptionsQueryBuilder.cs)

## Business features it serves

- **Sign-in with passkeys** (Customer & accounts): Staff and customers sign in with a fingerprint, face or device PIN instead of a password.

## Key features

- **Passwordless sign-in** — sign in with a passkey in the Commerce Manager and in the storefront
- **Passkey management** — create passkeys from the user profile; rename and delete them through the platform's sign-in method API
- **`passkey` grant type** — exchanges a WebAuthn assertion for a token on the token endpoint and on the platform's cookie sign-in endpoint; lockout and the platform's sign-in rules apply
- **Readable key names** — a passkey without a name shows the authenticator's name, derived from its AAGUID
- **Backup state** — each passkey shows whether it is `DeviceOnly`, `BackedUp` or `NotBackedUp`
- **Storefront plugin** — adds the passkey sign-in button and passkey creation to the storefront through the XFrontend plugin system
- **Admin Shell plugin** — adds "Sign in with a passkey" to the Admin Shell sign-in page and "Add a passkey" to its profile's sign-in methods, where passkeys are renamed and deleted (`AdminShellApp`, built into `plugins/admin-shell/`; `-p:SkipAdminShellPlugin=true` leaves it out)
- **Browser detection** — the passkey button and passkey creation appear only when the browser supports WebAuthn
- **Impersonation-safe** — passkeys cannot be created in an impersonated session

## Documentation

- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Passkeys)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-passkeys/)
