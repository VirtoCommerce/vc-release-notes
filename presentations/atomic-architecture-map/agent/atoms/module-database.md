# Database per module (Db)

> Every module owns its schema, and can own its physical database on one line of configuration.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/module-database`

## Pattern

Database per service, applied at the module boundary. Each module registers its own `DbContext` and resolves its connection string by **module id** first, falling back to the shared one — so moving a module to its own server is configuration, not code.

## When to use

- A hot table set that needs its own compute or its own backup schedule — orders, or the catalog
- A compliance boundary: identity on a separate server is the platform's own precedent (`Auth:ConnectionString`)
- Scaling one module's storage independently of the rest
- Answering "is it really separated?" — the schema always is; the server is a config line

## Avoid

- Anything needing one transaction across two modules — there is no distributed transaction, and none is coming
- Splitting before you have a measured reason. One database is simpler to run, back up and restore
- Assuming a split module is now a service — it still loads in the same host process

## API

- `Auth:ConnectionString — the platform's own per-context override` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `ConnectionStrings:VirtoCommerce — the shared fallback` · [src/VirtoCommerce.Platform.Web/appsettings.json](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/appsettings.json)
- `GetConnectionString(ModuleInfo.Id) ?? GetConnectionString("VirtoCommerce")` · (module-side pattern — Module.cs in every vc-module-* repo and in vc-cli-module-template)

## Example

```json
// appsettings.json — the shipped file shows only the shared entry, but every module
// looks for its own module id FIRST. Adding a key is the whole migration.
{
  "ConnectionStrings": {
    "VirtoCommerce": "Data Source=sql-main;Initial Catalog=VirtoCommerce3;...",

    // Pricing now lives on its own server. No code change, no redeploy of other modules.
    "VirtoCommerce.Pricing": "Data Source=sql-pricing;Initial Catalog=Pricing;...",

    // Orders too — its own instance, its own backup window.
    "VirtoCommerce.Orders": "Data Source=sql-orders;Initial Catalog=Orders;..."
  },

  // Identity is the platform's own example of the same idea, under a different key.
  "Auth": {
    "ConnectionString": "Data Source=sql-identity;Initial Catalog=Security;..."
  }
}
```

## Pitfalls

- The key is the **module id** from `module.manifest` — `VirtoCommerce.Pricing`, not `Pricing` and not the assembly name.
- It works only because modules never hold a foreign key across the boundary. Read [Ids, not foreign keys](cross-module-references.md) before you split anything.
- Each module migrates its own context at startup, inside the platform's startup distributed lock. Without Redis that lock is in-process only, so two instances starting at once can both migrate.
- A per-module database is invisible in the shipped `appsettings.json`, which is the main reason teams believe it does not exist.
- Backup and restore become per-module: a point-in-time restore of one database leaves the others ahead of it.

## Documentation

- [Configuring environments](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/configuring-environments/)
- [appsettings.json reference](https://docs.virtocommerce.org/platform/developer-guide/latest/Configuration-Reference/appsettingsjson/)
- [DB-agnostic persistence](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Persistence/DB-Agnostic/overview/)

## See also

- [Ids, not foreign keys](cross-module-references.md): A module references another module's data by id and copies what it needs — which is what makes separate databases possible.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
- [module.manifest](module-manifest.md): The file without which a module does not exist — and the file that decides whether it needs a .NET assembly at all.
- [Host composition](host-composition.md): One image, several hosts: choose the module set per host, then choose the role per host in configuration.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
