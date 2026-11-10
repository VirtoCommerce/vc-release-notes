# Authorization policies (Az)

> What the caller may do: policies and requirements for rules that a permission attribute cannot express.

- Family: Security
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/authorization`

## Pattern

Requirement plus handler. Where `[Authorize("permission")]` reads as a static check, it is actually a policy underneath: `PermissionAuthorizationRequirement` carries the permission name and `PermissionAuthorizationHandlerBase` decides whether the user satisfies it. Write your own requirement and handler when the rule depends on the resource — ownership, tenancy, or entity state.

## When to use

- Rules depending on the resource, not just the user: "may edit their own orders only"
- Tenant or store scoping enforced centrally rather than per query
- Extending or replacing an existing platform policy

## Avoid

- Putting business logic in a handler that belongs in the domain
- Client-side-only gates. A UI check is a usability feature, not a security control
- Duplicating a permission check that the attribute already performs

## API

- `PermissionAuthorizationHandlerBase<TRequirement>` · [src/VirtoCommerce.Platform.Security/Authorization/PermissionAuthorizationHandlerBase.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/Authorization/PermissionAuthorizationHandlerBase.cs)
- `PermissionAuthorizationRequirement` · [src/VirtoCommerce.Platform.Security/Authorization/PermissionAuthorizationRequirement.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/Authorization/PermissionAuthorizationRequirement.cs)
- `DefaultPermissionAuthorizationHandler` · [src/VirtoCommerce.Platform.Security/Authorization/DefaultPermissionAuthorizationHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/Authorization/DefaultPermissionAuthorizationHandler.cs)
- `AuthorizationOptions` · [src/VirtoCommerce.Platform.Core/Security/AuthorizationOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/AuthorizationOptions.cs)

## Example

```csharp
// A requirement plus its handler — the resource-aware alternative to a permission attribute.
public class OwnOrderRequirement : IAuthorizationRequirement { }

public class OwnOrderHandler : AuthorizationHandler<OwnOrderRequirement, CustomerOrder>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        OwnOrderRequirement requirement, CustomerOrder resource)
    {
        if (resource.CustomerId == context.User.GetUserId())
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}

// Module.Web — register the handler; policies compose from requirements.
services.AddSingleton<IAuthorizationHandler, OwnOrderHandler>();
```

## Pitfalls

- Handlers must call `Succeed` to allow; doing nothing denies. A handler that silently does nothing looks like a mysterious 403.
- Several handlers for one requirement means any one succeeding is enough — that is deliberate, and easy to misread as "all must agree".
- There is a second, less obvious permission path: a `limited_permissions` claim. When present, it *caps* what the identity may do — only permissions listed in the claim are granted, whatever the user's roles say. When absent, no limit applies. It exists so cookie-authenticated non-AJAX GETs and third-party dashboards can be given a narrow slice of access, and it will confuse you if you debug a 403 by looking only at roles.
- Gates that exist only in the SPA are bypassable by calling the API directly. Enforce server-side, then mirror it in the UI.

## Documentation

- [Extending authorization policies](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/overview/)
- [Authorization with JWT](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/authorization-using-jwt/)

## See also

- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [Authentication](authentication.md): Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.
- [Current user & tenancy](current-user.md): Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.

## Topic

Part of **Security & compliance**: Identity, permissions and the surfaces that need locking down.
