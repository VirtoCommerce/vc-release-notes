# Business API (XAPI) (Xa)

> The GraphQL business API: one endpoint, queries and mutations, assembled from whatever X-API modules are installed.

- Family: Messaging & events
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: api-edge
- Verified against platform 3.1096.0
- On the map: `#/atom/xapi`

## Pattern

A query or mutation is a MediatR request — `IQuery<TResult>` / `ICommand<TResult>` with an `IQueryHandler<,>` behind it. A `QueryBuilder` exposes it as a GraphQL field; the schema is stitched at startup from every `ISchemaBuilder` the installed assemblies contain, so installing `VirtoCommerce.XCatalog` adds catalog queries to the same `/graphql` endpoint without a line of glue.

## When to use

- Any storefront, mobile app or AI agent — the caller asks for the fields it needs in one round trip
- When a page needs data from several modules and you do not want three REST calls to assemble it
- Extending or overriding an existing query: the query type resolves through `AbstractTypeFactory`, so a solution adds arguments and fields without forking the module
- When you want the API surface to follow the Cell you deployed — a Digital Catalog instance serves catalog queries and nothing else

## Avoid

- Back-office CRUD. The Admin SPA speaks [REST API](rest-api.md), and mutations are not a substitute for a resource with a verb
- Constructor-injecting `IMediator` into a builder — builders are singletons, so a captured mediator is root-scoped. The base class resolves it per request from `context.RequestServices`, and the old constructor is `[Obsolete]` with diagnostic `VC0015`
- Resolving a child field with its own service call. That is the N+1 that DataLoader exists to batch
- Assuming introspection and GraphiQL are available in production — both are configuration-gated

## Note

Verified against the vc-module-x-api checkout on `dev` at 3.1031.0, after the 3.1030.0 release (GraphQL.NET 8.8.3, MediatR 12.4.1). Since 3.1017 the module dropped AutoMapper from `Xapi.Core` and removed its expired obsolete APIs; none of the patterns on this page relied on either.

## API

- `IQuery<TResult> : IRequest<TResult>` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/IQuery.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/IQuery.cs)
- `ICommand<TResult> : IRequest<TResult>` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/ICommand.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/ICommand.cs)
- `IQueryHandler<TQuery, TResult>` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/IQueryHandler.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/IQueryHandler.cs)
- `ISchemaBuilder.Build(ISchema)` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/ISchemaBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/ISchemaBuilder.cs)
- `QueryBuilder / RequestBuilder base classes` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/BaseQueries/RequestBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/BaseQueries/RequestBuilder.cs)
- `GraphQlPath = "/graphql", DefaultPageSize = 20` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/ModuleConstants.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/ModuleConstants.cs)
- `UseSchemaGraphQL + GraphiQL at /ui/graphiql` · [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Extensions/ApplicationBuilderExtensions.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Extensions/ApplicationBuilderExtensions.cs)

## Example

```csharp
// 1. The request: a MediatR message that happens to be a GraphQL query.
public class GetThingQuery : Query<ThingType>
{
    public string Id { get; set; }

    public override IEnumerable<QueryArgument> GetArguments()
    {
        yield return new QueryArgument<NonNullGraphType<StringGraphType>> { Name = nameof(Id) };
    }

    public override void Map(IResolveFieldContext context) => Id = context.GetArgument<string>(nameof(Id));
}

// 2. The handler: ordinary services, no GraphQL types in sight.
public class GetThingQueryHandler : IQueryHandler<GetThingQuery, ThingType>
{
    private readonly IThingService _service;

    public GetThingQueryHandler(IThingService service) => _service = service;

    public async Task<ThingType> Handle(GetThingQuery request, CancellationToken cancellationToken)
        => new ThingType { Thing = await _service.GetByIdAsync(request.Id) };
}

// 3. The builder: adds one field to the shared schema. Registered as a singleton ISchemaBuilder.
public class GetThingQueryBuilder : QueryBuilder<GetThingQuery, ThingType, ThingGraphType>
{
    public GetThingQueryBuilder(IAuthorizationService authorizationService) : base(authorizationService) { }

    protected override string Name => "thing";
}

// Module.Web: services.AddSchemaBuilder<GetThingQueryBuilder>();  →  query { thing(id: "x") { name } }
```

## Pitfalls

- It is a module suite, not the platform: `VirtoCommerce.Xapi` is the core, and `XCatalog`, `XCart`, `XOrder`, `XCMS`, `XPickup`, `XRecommend`, `XFrontend` and the Profile / Marketing / File experience APIs each add their own slice of schema.
- The manifest declares an **incompatibility** with the deprecated `VirtoCommerce.ExperienceApi` (3.800.0). The old repository is archived; the current one is `vc-module-x-api`.
- Every installed X-API module shares one schema and one endpoint, so a field name collision between modules is a startup problem, not a request-time one.
- A mutation runs in the caller’s async flow like any other request — domain events, indexation and webhooks fire from it exactly as they would from REST.
- `AddSchema` has overloads that take an `Action<MediatRServiceConfiguration>`. Use them to add MediatR pipeline behaviours for your module's handlers instead of registering MediatR a second time.

## Documentation

- [vc-module-x-api](https://github.com/VirtoCommerce/vc-module-x-api)
- [GraphQL.NET — the server library (8.x)](https://graphql-dotnet.github.io/docs/getting-started/introduction/)

## See also

- [Commands](commands.md): A thin command/handler abstraction alongside events — present, but far less used than events.
- [REST API](rest-api.md): The platform’s HTTP surface: an MVC controller per module, a permission per action, a Swagger document per module.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Request-scoped cache](request-scoped-cache.md): A cache that lives exactly as long as one request — the cheap fix for repeated loads inside a single call.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
