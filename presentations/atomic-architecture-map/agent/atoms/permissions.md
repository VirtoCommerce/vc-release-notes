# Permissions (Pm)

> Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.

- Family: Security
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/permissions`

## Pattern

Declare then register then enforce. Permissions are declared as constants in `ModuleConstants.Security.Permissions`, registered via `IPermissionsRegistrar` in `PostInitialize`, and enforced with `[Authorize(ModuleConstants.Security.Permissions.Read)]`. `PermissionScope` narrows a granted permission to a subset of data.

## When to use

- Every REST endpoint a module exposes — no exceptions
- Any Admin UI action that should depend on the user's role
- Row-level restrictions, using scopes rather than a bespoke filter

## Avoid

- Checking role names in code. Roles are operator-assignable; permissions are the contract
- A single coarse permission for a whole module; operators cannot delegate what you did not separate
- Enforcing only in the UI. The API is the security boundary

## API

- `IPermissionsRegistrar` · [src/VirtoCommerce.Platform.Core/Security/IPermissionsRegistrar.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/IPermissionsRegistrar.cs)
- `Permission` · [src/VirtoCommerce.Platform.Core/Security/Permission.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/Permission.cs)
- `PermissionScope` · [src/VirtoCommerce.Platform.Core/Security/PermissionScope.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/PermissionScope.cs)
- `ISupportSecurityScopes` · [src/VirtoCommerce.Platform.Core/Security/ISupportSecurityScopes.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/ISupportSecurityScopes.cs)
- `IPermissionsRegistrarExtensions` · [src/VirtoCommerce.Platform.Core/Security/IPermissionsRegistrarExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/IPermissionsRegistrarExtensions.cs)

## Example

```csharp
// Module.Core/ModuleConstants.cs
public static class Security
{
    public static class Permissions
    {
        public const string Read   = "myModule:read";
        public const string Create = "myModule:create";
        public const string Update = "myModule:update";
        public const string Delete = "myModule:delete";

        public static string[] AllPermissions => [Read, Create, Update, Delete];
    }
}

// Module.Web/Module.cs — PostInitialize
appBuilder.ApplicationServices.GetRequiredService<IPermissionsRegistrar>()
    .RegisterPermissions(ModuleConstants.Security.Permissions.AllPermissions
        .Select(x => new Permission { GroupName = "MyModule", Name = x }).ToArray());

// Controller — enforcement lives here, not in the UI.
[Authorize(ModuleConstants.Security.Permissions.Read)]
public async Task<ActionResult<MyEntity[]>> Get() { /* ... */ }
```

## Pitfalls

- An unregistered permission cannot be granted to a role, so an endpoint using it is effectively closed to everyone but administrators — and the diagnostic is a bare 403.
- Separate read from write from delete. Merging them means an operator must grant deletion to allow viewing.
- Scopes are enforced only where a service actually consults them; adding a scope does not retroactively filter existing queries.

## Documentation

- [Secure Web API](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/overview/)
- [User manager](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/global-permissions/)

## See also

- [Authorization policies](authorization.md): What the caller may do: policies and requirements for rules that a permission attribute cannot express.
- [Authentication](authentication.md): Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.
- [Current user & tenancy](current-user.md): Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.

## Topic

Part of **Security & compliance**: Identity, permissions and the surfaces that need locking down.
