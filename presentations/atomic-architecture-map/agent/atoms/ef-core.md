# EF Core & migrations (Ef)

> EF Core 10 across three database providers — which is why a migration is never written just once.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/ef-core`

## Pattern

Provider-agnostic core plus per-provider projects. `Platform.Data` holds the context and entity configuration; `Platform.Data.SqlServer`, `.PostgreSql` and `.MySql` each carry provider-specific migrations. A module follows the same split for its own schema.

## When to use

- Any persistent schema a module owns
- Adding a column to support a type you overrode via `AbstractTypeFactory`
- Query work where you need real SQL translation rather than in-memory filtering

## Avoid

- Provider-specific SQL or types in shared code — it compiles and then breaks on somebody else's database
- Generating a migration for one provider and assuming the others follow
- Client-side evaluation by accident: an unsupported expression silently pulls the table into memory

## API

- `Platform DbContext` · [src/VirtoCommerce.Platform.Data/Repositories/PlatformDbContext.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/Repositories/PlatformDbContext.cs)
- `SQL Server migrations` · [src/VirtoCommerce.Platform.Data.SqlServer/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Data.SqlServer/)
- `PostgreSQL migrations` · [src/VirtoCommerce.Platform.Data.PostgreSql/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Data.PostgreSql/)
- `MySQL migrations` · [src/VirtoCommerce.Platform.Data.MySql/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Data.MySql/)
- `MigrationName` · [src/VirtoCommerce.Platform.Core/Common/MigrationName.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/MigrationName.cs)

## Example

```bash
# One migration per provider. All three, or the module only works on one database.
dotnet ef migrations add AddAbcExternalOrderId \
  --project src/MyModule.Data.SqlServer \
  --startup-project src/MyModule.Web \
  --context MyModuleDbContext

# Then repeat for .PostgreSql and .MySql. Diff the generated SQL between them —
# differences are where provider-specific assumptions leaked into your model.
```

## Pitfalls

- Three providers means three migration sets. Forgetting one turns into a runtime failure on a customer's database, not a build error.
- The platform pins EF Core 10 and builds with `TreatWarningsAsErrors` — an EF analyzer warning will fail your build.
- Entity configuration lives with the entity, not the context, so a module can extend the schema without touching platform code.
- `EntityFrameworkCore.Triggers` is in use, so some behaviour happens at save time that is not visible in your service code.
- The platform's design-time MySQL factory, used when generating migrations, targets server version 8.4 since 3.1078; it was 5.7. A module's own factory sets its own version, so check it before generating MySQL migrations.

## Documentation

- [Database agnostic](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Persistence/DB-Agnostic/overview/)
- [Extend the DB model](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/extending-database-model/)

## See also

- [Repository & unit of work](repository-uow.md): The data-access boundary: a repository per module, one commit per unit of work.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Dynamic properties](dynamic-properties.md): Add a field to an existing entity without a migration, a code change or a fork. The first thing to try when extending.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.

## Topic

Part of **Development process + roles**: Who does what, and the path from ticket to production.
