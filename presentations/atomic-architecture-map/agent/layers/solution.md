# Your solution (architecture layer)

> What a custom Virto project actually consists of: a little code you own, a lot of vendor artifacts you consume, and one file that pins the two together. You never fork the platform.

- Tags: `custom modules`, `vc-package.json`, `environments`
- On the map: `#/layer/solution`

## What to know

- How far can you decompose? Rung by rung, on the ladder the Architectural Guidelines define. **Atom** — a primitive, in-process, not a boundary. **Molecule** (a module) — a schema boundary yes, a process boundary no. **Cell** (Digital Catalog, Order Management) — deployable: this is where you cut. **Organism** — the environment topology, drawn below.
- The two decomposition levers worth knowing by name: `optional="true"` in a manifest, which is how a module set gets small enough to deploy on its own, and `ConnectionStrings:<ModuleId>`, which is how a module gets its own database. Both are configuration; neither appears in the shipped `appsettings.json`, which is why teams reasonably assume they do not exist.
- Modules never hold a foreign key across the boundary — ids and copied values only. That single convention is what makes a per-module database work at all, and it is why an order keeps the price it charged instead of looking one up.
- The ratio surprises people: a mature solution is mostly configuration plus a handful of custom modules, sitting on dozens of vendor modules. If you are writing a lot of code, check whether a lower extensibility level would do.
- Your custom module has the same three-project shape as a vendor one — `Core` / `Data` / `Web` — and loads through the same manifest and dependency graph. There is no "application project" that is special.
- Extend in this order: no-code (dynamic properties, settings, permissions) → API (REST/GraphQL, webhooks, event handlers) → native (`AbstractTypeFactory` override). Each step up costs more at upgrade time.
- `vc-package.json` is the boundary between what you own and what you consume. It is the file that makes an environment reproducible, and the first thing to read when two environments behave differently.
- The storefront is a separate deliverable with its own build and deploy — a platform release does not update it, and it does not ship inside the container image.

## Composition shapes — pick the shallowest cut that solves your problem

- **All-in-one · cut nothing**: One host, every module, one database. **Use it until something measured says otherwise** — it is the only shape with no coordination cost, and most solutions never need to leave it. The cost: a bulk import or a reindex competes with checkout, and scaling means scaling all of it.
- **Split by role · cut at configuration**: Same image, same modules, same database — different settings per host: `VirtoCommerce:BackgroundJobs:Mode`, `PushNotifications:ScalabilityMode`, ARR affinity. **The highest value per unit of effort**, and the shape the production topology below already draws. The cost: Redis becomes mandatory, and every host still carries every module.
- **Split by Cell · cut at the module set**: A second package manifest, a second image, a smaller module set — a catalog-read host is the clean example. **This is real decomposition**: independent scaling and a smaller blast radius per business capability. The cost: two images to promote, and the dependency graph has to close around the subset.
- **Split the database · cut at the module**: One configuration line — `ConnectionStrings:<ModuleId>` — moves a module to its own server, schema, backups and all. **Orthogonal to the other three**: you can do it in an all-in-one host. The cost: no transaction spans two module databases, and restore becomes per-module.
- **Not available · a module as a service**: A module is a unit of *code and schema*, not of process. Every module in a host loads into that host. **There is no supported way to run one module as its own service** — the seam is the module set, which is why the Cells tier exists.

## Pitfalls

- A module is not a service. Splitting by role gives you separate processes over the same modules and the same data; splitting by module set gives you a smaller host. Neither turns one module into an independently deployable unit.
- Every dependency a module declares as **required** has to be installed in the package with it — there is no partial install, and a missing one does not degrade the module, it takes the module and everything depending on it out of the host. So when you write a module, **split its dependencies into required and optional**: mark `optional="true"` on everything it can start without, and it becomes installable in several PBCs instead of only in the one that happens to carry the whole list. `VirtoCommerce.Orders`, with 11 required and none optional, is the counter-example.
- There is no distributed transaction. The moment two modules are on two databases, a write that spans them is two writes, and you own the reconciliation.
- Every host sharing a database runs migrations at startup, serialised by the platform distributed lock — which falls back to an in-process lock when Redis is not configured and so does not coordinate between hosts. Split hosts without Redis and two of them can migrate at once.
- Never edit vendor module source, even locally to "just test something". The moment you do, you own that module forever and upgrades become merges.
- Manifest dependencies are caret SemVer ranges, so an unpinned range can resolve differently on two machines. `vc-package.json` is what makes the result repeatable — commit it.
- Prefix anything you add to a vendor type with your own abbreviation (`AbcStatus`). A future vendor property with the same name is a collision you cannot rename your way out of.
- A custom module owning schema needs a migration per database provider it must support — not just the one you develop against.
- Dev and prod differ by provider modules as much as by configuration: Lucene and filesystem assets work on one instance and quietly break on several.

## Documentation

- [Package management (vc-package.json)](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/package-management/)
- [Create a module from scratch](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/create-new-module-from-scratch/)
- [Extensibility overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Extensibility/overview/)
- [Release strategy for business users (presentation)](https://virtocommerce.github.io/vc-release-notes/presentations/release-strategy-for-business-users.html)
- [Release strategy](https://docs.virtocommerce.org/platform/developer-guide/latest/Updating-Virto-Commerce-Based-Project/release-strategy-overview/)
- [vc-testing-module (GitHub)](https://github.com/VirtoCommerce/vc-testing-module)
- [Scalability options (S · M · L · XL)](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scalability-options/)
- [Scaling configuration on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)
- [Key extensibility points](https://docs.virtocommerce.org/platform/developer-guide/latest/Extensibility/key-extensibility-points/)
- [Storefront architecture (docs site)](https://docs.virtocommerce.org/storefront/developer-guide/latest/architecture/)
