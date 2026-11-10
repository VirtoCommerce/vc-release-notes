# Current user & tenancy (Cu)

> Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.

- Family: Security
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/current-user`

## Pattern

Resolver over an ambient principal. `IUserNameResolver.GetCurrentUserName()` works inside a request from `HttpContext` and can be set explicitly where no request exists — which is how a background job records a meaningful actor. `ClaimsPrincipalExtensions` reads ids and claims; `TenantIdentity` pairs an object type with an id for scoping.

## When to use

- Audit fields and change-log entries
- Addressing a push notification to the user who started the work
- Background jobs that must act, and be recorded, as a specific user

## Avoid

- Injecting `IHttpContextAccessor` into business services; depend on the resolver instead
- Assuming a current user exists. In a job, a hosted service or at startup there may be none
- Trusting a user id from the request body over the authenticated principal

## API

- `IUserNameResolver` · [src/VirtoCommerce.Platform.Core/Security/IUserNameResolver.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/IUserNameResolver.cs)
- `ICurrentUser` · [src/VirtoCommerce.Platform.Core/Security/ICurrentUser.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/ICurrentUser.cs)
- `ClaimsPrincipalExtensions` · [src/VirtoCommerce.Platform.Core/Security/ClaimsPrincipalExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/ClaimsPrincipalExtensions.cs)
- `TenantIdentity` · [src/VirtoCommerce.Platform.Core/Common/TenantIdentity.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/TenantIdentity.cs)
- `IUserSessionsService` · [src/VirtoCommerce.Platform.Core/Security/IUserSessionsService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/IUserSessionsService.cs)

## Example

```csharp
// Works inside a request; also settable where there is no request.
public class MyService(IUserNameResolver userNameResolver)
{
    public Task Save(MyEntity entity)
    {
        entity.ModifiedBy = userNameResolver.GetCurrentUserName();
        return _repository.SaveAsync(entity);
    }
}

// In a background job there is no HttpContext, so make the actor explicit
// rather than letting audit fields record something meaningless.
userNameResolver.SetCurrentUserName(payload.InitiatedBy);
```

## Pitfalls

- `ICurrentUser` carries only `UserName`. For ids and claims use `ClaimsPrincipalExtensions` — expecting a rich user object here leads to a confusing dead end.
- A background job with no user set records whatever default applies, which makes an audit trail that looks complete and tells you nothing.
- The enqueuing user flows into a job's DI scope via `IHttpContextAccessor`, so audit fields often survive an enqueue — but do not rely on it without checking.

## Documentation

- [User manager](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/global-permissions/)

## See also

- [Authentication](authentication.md): Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.
- [Push notifications](push-notifications.md): Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.

## Topic

Part of **Security & compliance**: Identity, permissions and the surfaces that need locking down.
