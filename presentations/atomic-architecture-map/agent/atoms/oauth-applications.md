# OAuth applications (Oa)

> Clients registered in the back office, AI agents among them, with the resources each one may request tokens for.

- Family: Security
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: api-edge
- Verified against platform 3.1096.0
- On the map: `#/atom/oauth-applications`

## Pattern

Each OAuth client is an OpenIddict application, created and edited in the back office and saved through `api/platform/oauthapps`. Before saving, `IOAuthAppRules` fills in defaults and validates it. Modules publish the resources they serve, such as MCP endpoints, through `IOAuthResourceProvider`; an administrator allows an application to request tokens for specific resources (RFC 8707 resource indicators). Interactive clients go through a consent page that lists what the application will get, and the sign-in page can differ per host.

## When to use

- Letting an AI agent or MCP client call the platform under a user's identity rather than a shared key
- Registering a third-party application that signs users in with the platform as the identity provider
- Exposing a module's API or MCP endpoint as a resource that OAuth applications can be granted
- Serving several front-ends from one platform, each with its own sign-in page

## Avoid

- Handing an agent an API key for an administrator account. An OAuth application can be limited to named resources and is subject to consent
- Accepting any resource URI. Only URIs listed in `Authorization:Resources` are accepted, and the application also needs a matching permission
- Changing validation rules by editing controllers. Replace or derive from `OAuthAppRules`

## Note

Since 3.1072 the platform accepts OAuth resources and storefront sign-in for authorization requests. Since 3.1095 OAuth applications, including AI agent clients, are set up in the back office, and since 3.1096 the consent page describes what the client receives and the sign-in page can be set per host.

## API

- `OAuthAppsController (api/platform/oauthapps)` · [src/VirtoCommerce.Platform.Web/Controllers/Api/OAuthAppsController.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/OAuthAppsController.cs)
- `IOAuthAppRules / OAuthAppRules` · [src/VirtoCommerce.Platform.Security/OpenIddict/IOAuthAppRules.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/OpenIddict/IOAuthAppRules.cs)
- `IOAuthResourceProvider` · [src/VirtoCommerce.Platform.Core/Security/IOAuthResourceProvider.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/IOAuthResourceProvider.cs)
- `OAuthResource` · [src/VirtoCommerce.Platform.Core/Security/OAuthResource.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/OAuthResource.cs)
- `OAuthHostLoginPath` · [src/VirtoCommerce.Platform.Core/Security/OAuthHostLoginPath.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Security/OAuthHostLoginPath.cs)
- `Consent page (Authorize.cshtml)` · [src/VirtoCommerce.Platform.Web/Views/Shared/Authorize.cshtml](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Views/Shared/Authorize.cshtml)

## Example

```csharp
// A module lists the resources it serves, so the back office can offer them
// when an administrator sets up an OAuth application.
public class McpResourceProvider : IOAuthResourceProvider
{
    public Task<IList<OAuthResource>> GetResourcesAsync(OAuthResourceContext context,
        CancellationToken cancellationToken)
    {
        IList<OAuthResource> resources =
        [
            new OAuthResource
            {
                Uri = "https://platform.example.com/mcp",   // exactly as clients send it
                Kind = "mcp",
                Title = "Commerce MCP server",
            },
        ];
        return Task.FromResult(resources);
    }
}

// Module.Initialize
services.AddTransient<IOAuthResourceProvider, McpResourceProvider>();
```

## Pitfalls

- A resource has to be allowed twice: its URI must be listed in `Authorization:Resources`, and the application must have the matching resource permission. Either one alone is not enough.
- The URI is compared exactly as the client sends it in the `resource` parameter. A trailing slash or a different host is a different resource.
- A provider that throws is skipped, so a broken module removes its own resources from the list rather than breaking the screen. Check the list after deploying.
- `Authorization:OAuthLoginPath` points authorization requests at a storefront sign-in page; `Authorization:OAuthLoginPaths` sets one per host. A host that is not listed uses the single path, and an empty path means the platform's own login page.

## Documentation

- [Virto Commerce as an identity provider](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authentication/virto-as-identity-provider/)
- [Issuing and using access tokens](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authentication/issuing-and-using-access-token/)

## See also

- [Authentication](authentication.md): Who the caller is: OpenIddict-issued tokens, API keys, basic auth, and external identity providers.
- [Sign-in extensions](sign-in-extensions.md): Extension points a module uses to add a way of signing in, a second factor, or a sign-in method a user manages.
- [Permissions](permissions.md): Declared per module, assigned to roles, enforced per endpoint — with optional row-level scopes.
- [REST API](rest-api.md): The platform’s HTTP surface: an MVC controller per module, a permission per action, a Swagger document per module.

## Topic

Part of **Security & compliance**: Identity, permissions and the surfaces that need locking down.
