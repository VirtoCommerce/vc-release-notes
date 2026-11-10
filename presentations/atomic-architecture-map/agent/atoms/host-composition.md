# Host composition (Ho)

> One image, several hosts: choose the module set per host, then choose the role per host in configuration.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: solution
- Verified against platform 3.1096.0
- On the map: `#/atom/host-composition`

## Pattern

Composition at deployment time, on two axes. **Which modules** a host contains comes from its package manifest; **which role** it plays comes from configuration. Neither needs a code change, and the second needs no separate image.

## When to use

- Isolating a workload so it cannot degrade another — background jobs away from checkout
- Scaling one business capability on its own: a catalog-read host, sized for shopper traffic
- Giving the back office and the storefront API separate failure domains
- Cutting the surface of a host on purpose — fewer modules, fewer endpoints, smaller blast radius

## Avoid

- Expecting a single module to become a service. The unit of deployment is a host with a module set, never one module
- Splitting by role before Redis is in place — cache coherence, the SignalR backplane and the migration lock all depend on it
- A module subset whose dependency graph does not close; the missing module takes its dependents down with it
- More than one shape at once. Get all-in-one measured first, then split the axis your metrics point at

## API

- `VirtoCommerce:BackgroundJobs:Mode — Producer | Worker | Both` · [src/VirtoCommerce.Platform.Web/appsettings.json](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/appsettings.json)
- `PushNotifications:ScalabilityMode — RedisBackplane | AzureSignalRService | None` · [src/VirtoCommerce.Platform.Core/PushNotifications/PushNotificationOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PushNotifications/PushNotificationOptions.cs)
- `Startup lock — migrations run one host at a time` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `ModuleBootstrapper — discovery, probing and the resolved module set` · [src/VirtoCommerce.Platform.Modules/ModuleBootstrapper.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Modules/ModuleBootstrapper.cs)
- `vc-build install -PackageManifestPath — a different module set per image` · (vc-build CLI; manifest is vc-package.json)

## Example

```bash
# Axis 1 — WHICH MODULES. Two manifests, two images, one source tree.
# vc-package.json         full host: everything the solution has
# vc-package.catalog.json catalog read path only

vc-build install -PackageManifestPath vc-package.catalog.json \
                 -ProbingPath ./app_data/modules

# Axis 2 — WHICH ROLE. Same image, same modules, configuration only.
#
#   storefront API   BackgroundJobs:Mode=Producer   ScalabilityMode=None            ARR off
#   back office      BackgroundJobs:Mode=Producer   ScalabilityMode=RedisBackplane  ARR on
#   job workers      BackgroundJobs:Mode=Worker     ScalabilityMode=None            ARR off
#
# As environment variables, so one image serves all three:
export BackgroundJobs__Mode=Worker
export PushNotifications__ScalabilityMode=None
```

## Pitfalls

- The dependency graph is the ceiling on a module subset. `VirtoCommerce.Orders` declares 11 dependencies — Cart, Catalog, Customer, Inventory, Notifications, Payment, Search, Shipping, Store, Assets, Core — so "orders on its own" is not a module set that exists.
- Splitting by role changes nothing about the data: same modules, same database, same migrations. Splitting by module set is what changes the surface.
- Every host that shares a database runs migrations at startup. That is safe only under the distributed lock, which needs Redis — see [Distributed lock](distributed-lock.md).
- A host without a module still shares the platform tables: settings, dynamic properties, permissions and module state are common ground.
- Two images means two things to promote. The DevOps view has one image on purpose; a second one doubles the release surface.

## Documentation

- [Scalability options (S · M · L · XL)](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scalability-options/)
- [Scaling configuration on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)
- [Package management (vc-package.json)](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/package-management/)
- [Configuring environments](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/configuring-environments/)

## See also

- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Optional dependency](optional-dependency.md): Declare a dependency you can live without, and the module still loads when it is absent.
- [Database per module](module-database.md): Every module owns its schema, and can own its physical database on one line of configuration.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [vc-build CLI](vc-build.md): The official CLI for building, packaging, installing and releasing a Virto solution — and for making installs reproducible.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
