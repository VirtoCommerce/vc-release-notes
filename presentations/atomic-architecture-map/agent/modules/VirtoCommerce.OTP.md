# OTP Sign-In (`VirtoCommerce.OTP`)

> Enables customers to sign in to the storefront with a one-time code emailed to them, instead of a password.

- Latest version: 3.1001.0 (needs platform 3.1090.0)
- Repository: https://github.com/VirtoCommerce/vc-module-otp
- Area: Security & compliance
- On the map: `#/molecule/VirtoCommerce.OTP`

## For business analysts

Lets storefront customers sign in with a one-time code sent to their email instead of a password. It signs in existing customers only and does not create accounts.

## For architects

A custom grant type, `otp_email`, on the platform token endpoint, using the extension point added in 3.1075. Codes are generated and checked by the ASP.NET Core Identity email token provider, so the module stores nothing. It is switched on per store with `OtpSignIn.Enabled` (off by default) and depends on Customer, Notifications and Store.

## For developers

The storefront calls `POST /api/otp/request` with `storeId` and `email`, then exchanges the code at `POST /connect/token` with `grant_type=otp_email`, `storeId`, `email` and `code`. Wrong codes count toward account lockout, and accounts with lockout disabled cannot use it. Any change to the user's security stamp, such as signing out in another session, invalidates codes already sent. The email is the `OtpSignInEmailNotification` notification.

## Use it when

- Shoppers who forget passwords, or a storefront that does not want to manage them
- Occasional B2B buyers who sign in rarely

## Do not use it when

- Self-registration by code: it signs in existing accounts only
- A storefront with no rate limiting in front of it. Code requests are not rate-limited by the module, so limit `/api/otp/request` at the edge

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1011.1
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1009.3
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1005.1

## REST controllers

- `api/otp` · 1 actions · [vc-module-otp/src/VirtoCommerce.Otp.Web/Controllers/Api/OtpController.cs](https://github.com/VirtoCommerce/vc-module-otp/blob/dev/src/VirtoCommerce.Otp.Web/Controllers/Api/OtpController.cs)

## Settings

- `OtpSignIn.Enabled`

## Business features it serves

- **Sign-in with an emailed code** (Customer & accounts): Shoppers sign in with a one-time code sent to their email, with no password to remember.
