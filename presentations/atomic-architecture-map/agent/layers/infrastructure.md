# Infrastructure (architecture layer)

> What must exist for the platform to run, what each piece is actually for — and who operates it. Cloud-agnostic: Azure, AWS, GCP or on-premise, self-hosted or managed on Virto Cloud.

- Tags: `SQL`, `Redis`, `Elasticsearch`, `Blob`, `Kubernetes`, `GitOps`
- On the map: `#/layer/infrastructure`

## What to know

- Relational database — SQL Server, PostgreSQL or MySQL. One provider per deployment, chosen by connection string and provider package; migrations exist per provider.
- Redis — three distinct jobs, worth separating in your head: cache-invalidation bus, distributed lock (RedLock), and SignalR backplane. It is not used as a shared cache store.
- Search engine — Elasticsearch (or Lucene / Azure Search via the matching provider module). The catalog read path depends on it; it is not optional at scale.
- Blob storage — product images, imports, exports and other assets, behind a file-system or cloud provider.
- CDN — static assets and product images, in front of blob storage.
- **Kubernetes-native, and portable.** On Virto Cloud the runtime is a Kubernetes-native core following CNCF practice — AKS, SQL, Redis and Elasticsearch as managed services, in a dedicated isolated environment. Azure today; AWS and GCP on request. Portable, not simultaneous.
- **Composable scaling is an infrastructure property, not just a code one.** Catalog, pricing and search scale independently, horizontally and automatically; vertical sizing stays manual and on demand. That is the same seam the Composable Architecture view draws — see [Host composition](../atoms/host-composition.md) and [Scalability](../atoms/scalability.md).
- **The environment is a Git artifact.** Declarative infrastructure reconciled by Argo means an environment is reviewable and reproducible, and a rollback is a revert rather than a rebuild. If you self-host, this is the practice worth copying first.

## Who runs it — self-hosted or Virto Cloud

- **Required skills**: **Self-hosted:** Kubernetes, DevOps, DBA and security capability in-house — a platform team, permanently staffed. **Virto Cloud:** the platform skills come with it, and your team stays on the solution.
- **DevOps process**: **Self-hosted:** you design and run CI/CD and GitOps yourself. **Virto Cloud:** starter CI/CD plus **GitOps with Argo**, ready to use — the environment is declared in Git and reconciled from it.
- **New environments**: **Self-hosted:** built per project, in weeks. **Virto Cloud:** self-service, in minutes. This is the difference a team feels first.
- **Maintenance**: **Self-hosted:** patching, version updates and database routines are yours. **Virto Cloud:** automated and run by Virto, including scheduled backups for every critical component.
- **Rollback strategy**: **Self-hosted:** you design it, and — the part that gets skipped — you test it. **Virto Cloud:** blue-green deployment with instant rollback, staged.
- **Performance on the same resources**: **Self-hosted:** generic infrastructure. **Virto Cloud:** tuned for this stack, so the same solution runs faster on identical resources. Worth asking to see measured, on your workload.
- **Multi-region and residency**: **Self-hosted:** you build each region. **Virto Cloud:** nearest datacenters including **China** — the deck cites a dedicated China deployment with 20k+ SKUs and 50+ modules. Data residency and sovereignty stay your decision either way.
- **Monitoring and telemetry**: **Self-hosted:** you set it up and you watch it. **Virto Cloud:** proactive alerts and one dashboard across every solution — and metrics, logs and traces stay open to your team rather than locked away.
- **Support, uptime and compliance**: **Self-hosted:** your team, and you certify it. **Virto Cloud:** 24×7 for Priority-1 incidents, follow-the-sun business hours across AMER · EMEA · APAC, a **99.9% availability SLA**, and SOC 2 / GDPR.

## Pitfalls

- Scaling out to more than one instance makes Redis mandatory: without it, per-instance memory caches drift and module installation has no distributed lock.
- Redis holding cache *invalidation messages* rather than cache *values* surprises almost everyone. Losing Redis costs coherence, not the cache itself.
- An SLA covers the layer the provider operates. **99.9% on the platform layer is not 99.9% on your solution** — a custom module that throws, or a migration that locks a table, is inside your half of the boundary. Know where the line is before you quote a number to a customer.
- Managed does not mean unobservable, and it does not mean unwatched either: telemetry being open to your team is only worth something if someone on it is looking at the dashboard.
- "Azure today, AWS and GCP on request" means the stack is portable, not that it runs on all three at once. Treat a second cloud as a project with a date, not a switch.
- Everything in the comparison above comes from the Virto Cloud presentation — vendor material, and correct as far as it goes. The numbers worth asking to see measured on your own workload are the performance claim and the achieved uptime, not the target.

## Documentation

- [Scalability](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scalability-options/)
- [Scale out on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)
- [Health checks](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/health-checks/)
- [Search](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Indexed-Search/overview/)
- [Virto Cloud (presentation)](https://virtocommerce.github.io/vc-release-notes/presentations/virto-cloud.html)
