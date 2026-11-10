# Repository & unit of work (Rp)

> The data-access boundary: a repository per module, one commit per unit of work.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/repository-uow`

## Pattern

Repository over a `DbContext`, with an explicit unit of work. `IRepository` exposes `Add` / `Update` / `Remove` / `Attach` and a `UnitOfWork` whose `CommitAsync()` is the single place a transaction lands. Services take a `Func<IRepository>` factory rather than a repository, so each operation gets a fresh context.

## When to use

- All data access inside a module — one repository interface per module
- When several changes must commit together
- Read-only queries, with change tracking disabled for speed

## Avoid

- Injecting a repository directly instead of a factory; a long-lived `DbContext` accumulates tracked entities and leaks memory
- Committing inside a loop. Batch and commit once
- Leaking `IQueryable` out of the repository — the context is disposed before the query runs, and you get a confusing failure far from the cause

## API

- `IRepository` · [src/VirtoCommerce.Platform.Core/Domain/IRepository.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/IRepository.cs)
- `IUnitOfWork` · [src/VirtoCommerce.Platform.Core/Domain/IUnitOfWork.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/IUnitOfWork.cs)
- `Entity / AuditableEntity` · [src/VirtoCommerce.Platform.Core/Domain/AuditableEntity.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/AuditableEntity.cs)
- `PrimaryKeyResolvingMap` · [src/VirtoCommerce.Platform.Core/Common/PrimaryKeyResolvingMap.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/PrimaryKeyResolvingMap.cs)
- `IDataEntity` · [src/VirtoCommerce.Platform.Core/Domain/IDataEntity.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Domain/IDataEntity.cs)

## Example

```csharp
// A factory, not a repository — each call gets a fresh, short-lived context.
public class MyService(Func<IMyRepository> repositoryFactory)
{
    public async Task SaveChangesAsync(IList<MyEntity> models)
    {
        using var repository = repositoryFactory();

        var pkMap = new PrimaryKeyResolvingMap();
        foreach (var model in models)
        {
            var entity = AbstractTypeFactory<MyEntityEntity>.TryCreateInstance().FromModel(model, pkMap);
            repository.Add(entity);
        }

        await repository.UnitOfWork.CommitAsync();   // one commit, one transaction
        pkMap.ResolvePrimaryKeys();                  // new ids flow back into the models
    }
}
```

## Pitfalls

- `PrimaryKeyResolvingMap` is how database-generated ids get back onto your domain models after a commit. Skip it and new entities look like they have no id.
- Read paths should call `DisableChangesTracking()`. Tracking thousands of entities you never modify is pure overhead.
- A `Func<IRepository>` looks like ceremony until you hit a memory leak from a repository injected into a singleton.
- The domain model and the EF entity are deliberately different types, mapped by `ToModel` / `FromModel`. Merging them looks tempting and defeats extensibility.

## Documentation

- [Extend the DB model](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/extending-database-model/)
- [Database agnostic](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Persistence/DB-Agnostic/overview/)

## See also

- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
- [Generic CRUD](generic-crud.md): Two abstract base classes with one abstract method each — you supply the query, not the plumbing.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.
