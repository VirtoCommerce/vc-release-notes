# Generic CRUD (Cs)

> Two abstract base classes with one abstract method each — you supply the query, not the plumbing.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/generic-crud`

## Pattern

Template Method over repository plus cache plus events. `CrudService` and `SearchService` implement the whole read/write path — batched get, save, delete, response groups, cloning, cache regions, changing and changed events — and leave exactly one hole each for the part only your module knows.

## When to use

- **Every entity your module owns.** Inheriting is the default; writing a service from scratch is the thing to justify
- When you want the standard behaviour for free: `IPlatformMemoryCache` regions wired up, `GenericChangedEntryEvent` published before and after a save, soft delete, response groups
- When you want your service replaceable — the base implements the `ICrudService<TModel>` / `ISearchService<...>` interfaces that other modules and XAPI resolve
- **Starting a new entity: let the CLI write it.** `dotnet new vc-crud` emits the whole set and you edit rather than assemble

## Avoid

- Writing `GetAsync` / `SaveChangesAsync` / `DeleteAsync` yourself. If you are, you have re-implemented the base class and you now own its caching and event bugs
- Putting query logic in `LoadEntities` — that one loads by id. Criteria belong in `BuildQuery` on the search service
- Skipping the events. Other modules and integrations subscribe to `*ChangedEvent`; a hand-rolled save that does not publish is invisible to them
- Injecting `IRepository` directly instead of `Func<IRepository>` — the service is longer-lived than a request, which is exactly why the base takes a factory

## API

- `CrudService<TModel, TEntity, TChangingEvent, TChangedEvent> — one abstract member: LoadEntities` · [src/VirtoCommerce.Platform.Data/GenericCrud/CrudService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/GenericCrud/CrudService.cs)
- `SearchService<TCriteria, TResult, TModel, TEntity> — one abstract member: BuildQuery` · [src/VirtoCommerce.Platform.Data/GenericCrud/SearchService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/GenericCrud/SearchService.cs)
- `ICrudService<TModel>` · [src/VirtoCommerce.Platform.Core/GenericCrud/ICrudService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/GenericCrud/ICrudService.cs)
- `ISearchService<TCriteria, TResult, TModel>` · [src/VirtoCommerce.Platform.Core/GenericCrud/ISearchService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/GenericCrud/ISearchService.cs)
- `CrudOptions` · [src/VirtoCommerce.Platform.Core/GenericCrud/CrudOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/GenericCrud/CrudOptions.cs)
- `CrudServiceExtensions / SearchServiceExtensions — the single-item helpers` · [src/VirtoCommerce.Platform.Core/Extensions/CrudServiceExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Extensions/CrudServiceExtensions.cs)
- `vc-crud — "Virto Commerce 3.x CRUD Template", shortName vc-crud` · [vc-cli-module-template/templates/vc-crud-template](https://github.com/VirtoCommerce/vc-cli-module-template/tree/main/templates/vc-crud-template)

## Example

```csharp
// Two base classes, one abstract method each. Everything else is inherited:
// batched Get, Save, Delete, response groups, cloning, cache regions and the
// changing/changed events - none of which you write.

public class AbcThingService(
        Func<IRepository> repositoryFactory,        // a factory: the service outlives a request
        IPlatformMemoryCache cache,
        IEventPublisher eventPublisher)
    : CrudService<AbcThing, AbcThingEntity, AbcThingChangingEvent, AbcThingChangedEvent>(
        repositoryFactory, cache, eventPublisher), IAbcThingService
{
    // The one thing the base class cannot know: how to load your entities.
    protected override Task<IList<AbcThingEntity>> LoadEntities(
        IRepository repository, IList<string> ids, string responseGroup)
        => ((IAbcRepository)repository).GetThingsByIdsAsync(ids, responseGroup);
}

public class AbcThingSearchService(/* ... same three, plus your options ... */)
    : SearchService<AbcThingSearchCriteria, AbcThingSearchResult, AbcThing, AbcThingEntity>(
        /* ... */), IAbcThingSearchService
{
    // And here: how to turn criteria into a query. Paging and sorting are inherited.
    protected override IQueryable<AbcThingEntity> BuildQuery(
        IRepository repository, AbcThingSearchCriteria criteria)
    {
        var query = ((IAbcRepository)repository).Things;
        if (!string.IsNullOrEmpty(criteria.Keyword))
            query = query.Where(x => x.Name.Contains(criteria.Keyword));
        return query;
    }
}

// Or do not write any of it. The CLI template emits the whole set:
//
//   dotnet new vc-crud -n MyCompany.Catalog --EntityName Thing
//
// model, search criteria and result, changing/changed events, the EF entity,
// DbContext and repository, both services, an API controller and Module.cs.
```

## Pitfalls

- **`LoadEntities` is the only abstract member on `CrudService`** and `BuildQuery` the only one on `SearchService`. If a code review shows you overriding much more than that, the question is why — usually the answer is a `responseGroup` that should have been handled in the loader.
- The base constructor takes `Func<IRepository>`, not `IRepository`. That is deliberate: the service is registered longer-lived than a request, so it opens a scope per call — see [Dependency injection](dependency-injection.md).
- Saves publish a **changing** event before and a **changed** event after. The changing one can be cancelled, which means a save can be refused by a handler in another module — read the event, not just the return value.
- `clone: true` is the default on reads, and it is what stops a caller mutating the cached instance. Passing `false` is a performance choice with a correctness price; know which one you are making.
- Cache invalidation is by region, so a save evicts more than the one entity. That is the trade the base class makes for you — see [Cache regions](cache-regions.md).
- The `vc-crud` template takes an `EntityName` symbol and generates against it, so pick the entity name before you run it; renaming afterwards means touching every generated file.
- Since 3.1061 `DeleteAsync` loads the entities from the database before removing them. Before that it deleted entities built from the models, which carry no concurrency token, so the DELETE matched no row and threw `DbUpdateConcurrencyException`.

## Documentation

- [Creating a custom module (DB-agnostic)](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Persistence/DB-Agnostic/creating-custom-module/)
- [Create a module from scratch](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/create-new-module-from-scratch/)
- [vc-cli-module-template (GitHub)](https://github.com/VirtoCommerce/vc-cli-module-template)
- [vc-crud template source](https://github.com/VirtoCommerce/vc-cli-module-template/tree/main/templates/vc-crud-template)

## See also

- [Repository & unit of work](repository-uow.md): The data-access boundary: a repository per module, one commit per unit of work.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [Specifications](specifications.md): A one-method interface for a reusable, composable business rule.

## Topic

Part of **eCommerce modules**: What ships in the box and how the bounded contexts relate.
