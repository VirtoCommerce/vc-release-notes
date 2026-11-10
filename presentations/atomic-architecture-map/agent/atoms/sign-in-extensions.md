# Sign-in extensions (Si)

> Extension points a module uses to add a way of signing in, a second factor, or a sign-in method a user manages.

- Family: Security
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/sign-in-extensions`

## Pattern

The platform owns the sign-in flow and exposes extension points; modules plug into them. A custom token grant is an `IGrantTypeHandler`, usually derived from `GrantTypeHandlerBase`, which already applies lockout, the second-factor check and the sign-in log. A second factor is an `ITwoFactorPolicy` (who needs one) and an `ITwoFactorSignInHandler` (how the challenge is sent). A sign-in method a user can see and manage, such as a passkey, is an `ISignInMethodProvider`. Every sign-in is written to the sign-in log with a `SignInType` string, which modules may extend.

## When to use

- Adding a way to sign in: a code sent by email, a token issued by another system, a device key
- Requiring a second factor for some users, stores or roles
- Showing users the keys they can rename or revoke, alongside their password and external logins
- Auditing sign-ins, including the failures and their reasons

## Avoid

- Writing a token endpoint of your own. Register a grant type and the OpenIddict server issues the token
- Implementing `IGrantTypeHandler` from scratch when `GrantTypeHandlerBase` fits. The base class is where lockout, two-factor and logging already happen
- Treating basic authentication as an integration path for users who need a second factor. It refuses them by design

## Note

These extension points arrived over several releases: the sign-in log in 3.1071, custom grant types in 3.1075, two-factor sign-in in 3.1090 and sign-in methods with passkey support in 3.1091. The OTP Sign-In, Multi-Factor Authentication and Passkeys modules are built on them.

## API

- `IGrantTypeHandler` · [src/VirtoCommerce.Platform.Security/OpenIddict/IGrantTypeHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/OpenIddict/IGrantTypeHandler.cs)
- `GrantTypeHandlerBase` · [src/VirtoCommerce.Platform.Security/OpenIddict/GrantTypeHandlerBase.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/OpenIddict/GrantTypeHandlerBase.cs)
- `AddGrantTypeHandler<THandler>(grantType)` · [src/VirtoCommerce.Platform.Security/OpenIddict/ServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/OpenIddict/ServiceCollectionExtensions.cs)
- `ITwoFactorPolicy` · [src/VirtoCommerce.Platform.Core/Security/ITwoFactorPolicy.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/ITwoFactorPolicy.cs)
- `ITwoFactorSignInHandler` · [src/VirtoCommerce.Platform.Security/OpenIddict/ITwoFactorSignInHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/OpenIddict/ITwoFactorSignInHandler.cs)
- `ISignInMethodProvider` · [src/VirtoCommerce.Platform.Core/Security/SignInMethods/ISignInMethodProvider.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/SignInMethods/ISignInMethodProvider.cs)
- `IUserSignInLogService` · [src/VirtoCommerce.Platform.Core/Security/SignInLog/IUserSignInLogService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/SignInLog/IUserSignInLogService.cs)
- `SignInType` · [src/VirtoCommerce.Platform.Core/Security/SignInLog/SignInType.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/SignInLog/SignInType.cs)

## Example

```csharp
// A custom grant: the client posts grant_type=email_code to /connect/token.
// The base class runs lockout, the second-factor check and the sign-in log around ValidateGrantAsync.
public class EmailCodeGrantHandler(/* base dependencies */) : GrantTypeHandlerBase(/* … */)
{
    public override string GrantType => "email_code";
    protected override string SignInType => "EmailCode";   // at most 32 characters

    protected override async Task<GrantValidationResult> ValidateGrantAsync(TokenRequestContext context)
    {
        var user = await FindUserByValidCodeAsync(context.Request);
        return user is null
            ? GrantValidationResult.Fail(new TokenResponse
              {
                  Error = OpenIddictConstants.Errors.InvalidGrant,
                  ErrorDescription = "The code is invalid or has expired.",
              })
            : GrantValidationResult.Succeed(user);
    }
}

// Module.Initialize: registers the handler and allows the grant in OpenIddict.
services.AddGrantTypeHandler<EmailCodeGrantHandler>("email_code");
```

## Pitfalls

- A second factor is required when the user has turned it on, or when any registered `ITwoFactorPolicy` says so. It can only be challenged if an `ITwoFactorSignInHandler` is installed: the platform ships the policy hooks, the MFA module ships the challenge.
- Basic authentication fails for a user who needs a second factor, with a message pointing to API keys. Integrations that sign in as such a user break when MFA is switched on.
- The platform registers sign-in method providers for passwords and external logins. A module adds its own, such as passkeys, and the back office lists them together with the keys the user can manage.
- `SignInType` is a set of string constants rather than an enum so modules can add their own. Keep custom values short; the sign-in log column takes 32 characters.
- A cleanup job keeps the sign-in log to `VirtoCommerce.Platform.Security.SignInLogRetentionDays`, 30 days by default; 0 keeps it forever.
- Sign-ins are written through an in-memory buffer (`SignInLog` section: 10,000 records, written in batches of 200 every 5 s). When the buffer is full the writer drops records rather than slow down sign-in, so a flood of attempts can leave gaps in the log. Each dropped row is counted and logged as a warning.

## Documentation

- [Adding a custom grant type](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/extensions/adding-custom-grant-type/)
- [Authentication overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authentication/overview/)

## See also

- [Authentication](authentication.md): Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.
- [OAuth applications](oauth-applications.md): Clients registered in the back office, AI agents among them, with the resources each one may request tokens for.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.

## Topic

Part of **Security & compliance**: Identity, permissions and the surfaces that need locking down.
