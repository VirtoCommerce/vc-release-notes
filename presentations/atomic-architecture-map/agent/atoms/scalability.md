# Scalability (Sc)

> What is ready to scale out today, what will only ever scale up, and what has to be true before the second instance.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: infrastructure
- Verified against platform 3.1096.0
- On the map: `#/atom/scalability`

## Pattern

Stateless request path with shared state behind it. Every instance keeps a local memory cache and holds nothing else worth protecting, so capacity is a replica count; the state that cannot be replicated — one database writer, one index, one lock — is what you scale up instead. **Readiness is per level, not per platform**: some levels are ready out of the box, some are ready only vertically, and two are not ready at all.

## When to use

- **Ready to scale out, no work needed:** the request path (REST and XAPI) — it is stateless; the per-instance memory cache, once Redis carries invalidation; background jobs, via `Mode: Producer` and `Mode: Worker` hosts; a host per module subset; search, as an external cluster; assets, behind a cloud blob provider
- **Every module can have its own database — one line, no code.** Each module registers its own `DbContext` and resolves its connection string by module id first: add `ConnectionStrings:VirtoCommerce.Pricing` and Pricing moves to its own server, migrations and all. The platform does this for identity itself with `Auth:ConnectionString`. It works because modules hold ids and copied values across a boundary, never foreign keys — so the split is a configuration change rather than a schema project. See [Database per module](module-database.md) and [Ids, not foreign keys](cross-module-references.md).
- **Ready to scale up only:** the relational database — one writer, and read replicas where the provider allows; a single index rebuild; a single large import. More instances do not divide this work, a bigger machine does
- **Not ready, and no configuration changes it:** a transaction spanning two module databases, and a single module as its own service. Both are design constraints rather than settings — see [Ids, not foreign keys](cross-module-references.md) and [Host composition](host-composition.md)
- Before a launch, to decide the shape rather than discover it — the readiness list above is the checklist
- When one workload is degrading another: the answer is usually another host, not a bigger one

## Avoid

- Scaling up first. It buys headroom you pay for around the clock and hides the coupling that stopped you scaling out
- Adding the second instance before the four prerequisites are met: Redis configured, a cloud blob provider instead of `FileSystemAssets`, a real search provider instead of Lucene, and the bearer-token certificate shared. Each of these works on one instance and fails on two
- Scaling the database to fix catalog browse. The index is the read path; the database is not in it
- Sizing every host the same. A 512 MB request host and a reindex worker want different machines
- Quoting a scalability number without saying which level it applies to — the platform layer and your custom modules scale on different curves

## API

- `VirtoCommerce:BackgroundJobs:Mode — Producer | Worker | Both, the horizontal split for jobs` · [src/VirtoCommerce.Platform.Web/appsettings.json](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/appsettings.json)
- `ConnectionStrings:RedisConnectionString — the scale-out prerequisite` · [src/VirtoCommerce.Platform.Caching/ServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/ServiceCollectionExtensions.cs)
- `PushNotifications:ScalabilityMode — RedisBackplane | AzureSignalRService | None` · [src/VirtoCommerce.Platform.Core/PushNotifications/PushNotificationOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PushNotifications/PushNotificationOptions.cs)
- `SqlServer:CompatibilityLevel / ParameterTranslationMode — EF Core 10 query translation` · [src/VirtoCommerce.Platform.Data.SqlServer/Extensions/DbContextOptionsBuilderExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data.SqlServer/Extensions/DbContextOptionsBuilderExtensions.cs)
- `DbContextRepositoryBase — command timeout inherited from the connection string` · [src/VirtoCommerce.Platform.Data/Infrastructure/DbContextRepositoryBase.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/Infrastructure/DbContextRepositoryBase.cs)
- `Startup lock — migrations serialised across instances` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `RedisPlatformMemoryCache — per-instance cache, shared invalidation` · [src/VirtoCommerce.Platform.Caching/Redis/RedisPlatformMemoryCache.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/Redis/RedisPlatformMemoryCache.cs)

## Example

```json
// The scale-out floor. Without the first two lines, a second instance is a second truth.
{
  // Each module can own its database: the key is the module id from module.manifest, and the
  // fallback is the shared string — so this is additive, per module, and needs no code.
  "ConnectionStrings": {
    "VirtoCommerce": "Data Source=sql;Initial Catalog=VirtoCommerce3;Connect Timeout=30;...",
    "RedisConnectionString": "redis:6380,ssl=True,abortConnect=False",
    "VirtoCommerce.Pricing": "Data Source=sql-pricing;Initial Catalog=Pricing;...",
    "VirtoCommerce.Orders":  "Data Source=sql-orders;Initial Catalog=Orders;..."
  },

  // Horizontal split by role. Same image on every host, one key apart.
  //   request hosts  Producer  — enqueue, never drain
  //   worker hosts   Worker    — drain, serve nothing
  // Under the VirtoCommerce section since 3.1057.0 — at the root it is read as nothing.
  "VirtoCommerce": {
    "BackgroundJobs": { "Mode": "Producer" }
  },

  // Back office only: push notifications need the backplane and sticky sessions.
  // Stateless request hosts set None and turn ARR affinity off.
  "PushNotifications": { "ScalabilityMode": "RedisBackplane" },

  // Cheaper than either kind of scaling: how EF Core 10 translates against SQL Server.
  // Below level 120 it reaches for OPENJSON, which performs badly.
  "SqlServer": {
    "CompatibilityLevel": 120,
    "ParameterTranslationMode": "Constant"
  },
}

// runtimeconfig.json — the runtime side, and only if a measurement asked for it.
// Defaults are already right for most hosts: Server GC for multi-core, Workstation on
// 1 vCPU, DATAS sizing the heap to the app since .NET 9.
{
  "runtimeOptions": {
    "configProperties": {
      "System.GC.HeapHardLimitPercent": 75,   // the container-aware default
      "System.GC.HighMemoryPercent": 90       // raise it for a small process, per Microsoft
    }
  }
}
```

## Pitfalls

- `Connect Timeout` in the connection string becomes the **command** timeout: `DbContextRepositoryBase` reads it off the connection and calls `SetCommandTimeout` with it — since 3.1064 only when no command timeout was configured through the DbContext options, so a module that sets one keeps it. Raise it there and every query gets it, which is rarely what you want.
- The migration lock is a scale-out dependency, not a nicety. Platform and module migrations run under the keyed startup lock (`VirtoCommerce.Platform.Startup`). Without Redis that lock is in-process, so two instances starting together can both migrate. With Redis, an instance that waits longer than `DistributedLock:WaitTime` (180 s) for another instance's migrations fails to start rather than migrating alongside it.
- .NET reads its container limits and sizes the GC heap to them — in a container the GC treats the **container limit** as total physical memory, with a default heap hard limit of **75%** of it. Work that needs memory in bursts still does not fit: put a reindex or a bulk import on the jobs host and size that one for it.
- **Server GC is the ASP.NET Core default, and it is not available on a single-core machine** — a 1-vCPU container silently runs Workstation GC. That is usually what you want there: Microsoft's guidance is that Server GC suits a machine the process dominates, while for **small containers and high-density hosting Workstation GC can be more performant**, and their own sample shows the working set dropping from ~500 MB to ~70 MB on the switch. Decide it per host role rather than once for the solution.
- **DATAS is on by default from .NET 9**, which changes the shape of the question. It sizes the heap to the application rather than to the machine, starting at one heap and adding heaps under load — so the same image behaves similarly on a small container and a large one. Microsoft measures ~80% working-set improvement against a 2–3% throughput cost; if you are chasing that last 2%, `System.GC.DynamicAdaptationMode: 0` turns it off, and you own the consequences.
- GC settings are read **once, at process start**, and are per process — so they belong in the image or the host's environment, never at machine level. `System.GC.HeapHardLimitPercent` bounds the heap, and for a small process Microsoft suggests **raising** `System.GC.HighMemoryPercent` rather than lowering it, because a 1 GB process can run comfortably with less headroom than a 64 GB one.
- A Redis **cluster** is not a drop-in replacement for a single instance — the platform uses operations whose semantics change across slots. Scale Redis up before you scale it out.
- Sticky sessions belong on hosts serving the Commerce Manager UI and nowhere else. On stateless request hosts they defeat the load balancer for no benefit.
- Two levels quietly refuse to scale out at all: `LuceneSearch` and `FileSystemAssets`. Both work on one instance and break on the second, which is why the provider swap is part of scaling rather than a later cleanup.

## Documentation

- [Scalability options (S · M · L · XL)](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scalability-options/)
- [Scaling configuration on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)
- [Essential caching](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Caching/01-overview/)
- [Indexed search overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Indexed-Search/overview/)
- [Memory and GC in ASP.NET Core (Microsoft)](https://learn.microsoft.com/aspnet/core/performance/memory)
- [GC runtime configuration (Microsoft)](https://learn.microsoft.com/dotnet/core/runtime-config/garbage-collector)
- [DATAS — heap sized to the app (Microsoft)](https://learn.microsoft.com/dotnet/standard/garbage-collection/datas)
- [Workstation vs Server GC (Microsoft)](https://learn.microsoft.com/dotnet/standard/garbage-collection/workstation-server-gc)

## See also

- [Host composition](host-composition.md): One image, several hosts: choose the module set per host, then choose the role per host in configuration.
- [Database per module](module-database.md): Every module owns its schema, and can own its physical database on one line of configuration.
- [Ids, not foreign keys](cross-module-references.md): A module references another module's data by id and copies what it needs — which is what makes separate databases possible.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Indexed search](search.md): The read path the catalogue actually depends on — and one more engine to keep consistent with the database.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
