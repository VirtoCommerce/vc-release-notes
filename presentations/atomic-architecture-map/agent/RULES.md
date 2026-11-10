# Rules for building on Virto Commerce

> For AI coding agents and the people reviewing their work. Platform 3.1096.0, map updated 2026-11-08. Every rule links to the page that explains why.

Reference this file from your `CLAUDE.md` or `AGENTS.md`, or copy the first two sections into it. Before writing code that uses a platform pattern, read that pattern's atom page.

## Before you write code

- Never edit the source of a Virto module or the platform. Extend from your own module; otherwise every upgrade becomes a merge.
- Extend in this order and stop at the first level that works: no-code (dynamic properties, settings, permissions), then API (REST or GraphQL, webhooks, event handlers), then native (`AbstractTypeFactory` override).
- A custom module has the same three projects as a Virto one: `Core`, `Data`, `Web`.
- `vc-package.json` pins the Virto modules and versions the solution uses. Commit it.
- Read the atom page for the pattern you are about to use. It lists when to use it, what to avoid and the API to call.

## Solution and module structure

- A module is not a service. Splitting by role gives you separate processes over the same modules and the same data; splitting by module set gives you a smaller host. Neither turns one module into an independently deployable unit. ([Your solution](layers/solution.md))
- Every dependency a module declares as **required** has to be installed in the package with it — there is no partial install, and a missing one does not degrade the module, it takes the module and everything depending on it out of the host. So when you write a module, **split its dependencies into required and optional**: mark `optional="true"` on everything it can start without, and it becomes installable in several PBCs instead of only in the one that happens to carry the whole list. `VirtoCommerce.Orders`, with 11 required and none optional, is the counter-example. ([Your solution](layers/solution.md))
- There is no distributed transaction. The moment two modules are on two databases, a write that spans them is two writes, and you own the reconciliation. ([Your solution](layers/solution.md))
- Every host sharing a database runs migrations at startup, serialised by the platform distributed lock — which falls back to an in-process lock when Redis is not configured and so does not coordinate between hosts. Split hosts without Redis and two of them can migrate at once. ([Your solution](layers/solution.md))
- Never edit vendor module source, even locally to "just test something". The moment you do, you own that module forever and upgrades become merges. ([Your solution](layers/solution.md))
- Manifest dependencies are caret SemVer ranges, so an unpinned range can resolve differently on two machines. `vc-package.json` is what makes the result repeatable — commit it. ([Your solution](layers/solution.md))
- Prefix anything you add to a vendor type with your own abbreviation (`AbcStatus`). A future vendor property with the same name is a collision you cannot rename your way out of. ([Your solution](layers/solution.md))
- A custom module owning schema needs a migration per database provider it must support — not just the one you develop against. ([Your solution](layers/solution.md))
- Dev and prod differ by provider modules as much as by configuration: Lucene and filesystem assets work on one instance and quietly break on several. ([Your solution](layers/solution.md))
- A module without a valid `module.manifest` will not load — there is no convention-based fallback. ([Modules](layers/modules.md))
- Never edit vendor module source. Derive a type and register the override, handle an event, or use a dynamic property; anything else you cannot upgrade. ([Modules](layers/modules.md))
- When you add a property to a vendor type, prefix it with your solution abbreviation so a future vendor property cannot collide with it. ([Modules](layers/modules.md))
- Manifest dependencies use caret SemVer ranges (`^1.2.3` means `>=1.2.3 <2.0.0`), and `platformVersion` must be pinned. ([Modules](layers/modules.md))

## For new code, use the alternative

- [Hangfire](atoms/hangfire.md) (Legacy). Use instead: Install `VirtoCommerce.BackgroundJobs`, then define a payload plus an `IBackgroundJobHandler<TPayload>` and enqueue through `IBackgroundJob` — see the Background jobs atom. Migration is two steps: swap the dead `VirtoCommerce.Platform.Hangfire` package reference for `VirtoCommerce.BackgroundJobs.Hangfire`, then move off `Hangfire.BackgroundJob.Enqueue()` to `IBackgroundJob.Enqueue<THandler>()`.
- [Channels](atoms/channels.md) (Platform). Use instead: For durable or cross-instance work use `IBackgroundJob`. For a continuous in-process loop use a `BackgroundService`.
- [Hybrid Cache](atoms/hybrid-cache.md) (Available). Use instead: `IPlatformMemoryCache` with `GetOrCreateExclusiveAsync` and a cache region token — see [Cache](atoms/platform-memory-cache.md).
- [Keyed services](atoms/keyed-services.md) (Platform). Use instead: For choosing between providers, follow the provider-registry pattern: one active implementation selected by configuration, exactly as search providers and background-job engines are chosen.

## Changing right now: read the atom page before using

- [Background jobs](atoms/background-jobs.md). Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Recurring jobs](atoms/recurring-jobs.md). Cron-scheduled work whose schedule an operator can change without a deploy.
- [Map / reduce jobs](atoms/map-reduce-jobs.md). Fan a large batch out across workers, then aggregate the results in one place.
- [Job progress](atoms/job-progress.md). Reporting how far a long job has got, so the UI can show it instead of spinning.

## What to avoid, pattern by pattern

### Execution & async

- [Background jobs](atoms/background-jobs.md):
  - Anything needing `HttpContext` — the job runs outside the request scope
  - Sub-second latency work; enqueue plus dispatch is not free
  - Passing large data in the payload — store the blob and pass a reference (claim-check)
  - Assuming exactly-once. Make the handler idempotent instead
- [Recurring jobs](atoms/recurring-jobs.md):
  - Sub-minute intervals — that is a queue consumer or a hosted service, not a cron job
  - Long chains where each step depends on the last; enqueue explicit follow-on jobs instead
  - Assuming only one instance fires it — take a distributed lock if the work must be exclusive
- [Map / reduce jobs](atoms/map-reduce-jobs.md):
  - Small batches — the coordination overhead outweighs the parallelism
  - Items that depend on each other, or that must be processed in order
  - Map handlers with side effects that are not idempotent; individual maps can be retried
- [Job progress](atoms/job-progress.md):
  - Reporting per item in a tight loop — batch it, or you make progress reporting the bottleneck
  - Using progress messages as a log. They are a UI surface, not a diagnostic record
- [Fire & forget](atoms/fire-and-forget.md):
  - `Task.Run` or an un-awaited `Task` for real work — the request ends, the DI scope is disposed, and unobserved exceptions vanish silently
  - Anything whose result the caller needs. Fire-and-forget means you have given up the answer, not just the wait
  - Assuming ordering between two things you fired. There is none
  - Firing something and never surfacing its failure — give it a notification, a log, or a status the operator can see
- [Hangfire](atoms/hangfire.md):
  - Referencing `Hangfire.*` types from new module code — that is the coupling the extraction removed
  - Assuming the platform provides job execution on its own. Without an engine module installed, `IBackgroundJob` throws
  - Depending on the dead `VirtoCommerce.Platform.Hangfire` package rather than `VirtoCommerce.BackgroundJobs.Hangfire`
  - Treating `InMemory` as a production engine — it is documented for development and testing only
- [Hosted service](atoms/hosted-service.md):
  - Work that must not be lost — a hosted service dies with its instance and has no retry
  - Work that should run once cluster-wide; every instance runs its own copy
  - Anything an operator needs to trigger, monitor or cancel — that is a background job
- [Cancellation](atoms/cancellation.md):
  - Swallowing `OperationCanceledException` — it is the success path of a cancelled operation, not an error to log as one
  - Accepting a token and then never passing it to the calls you make; that is worse than not accepting it
  - The obsolete `ICancellationToken` interface in new code
- [Async lock](atoms/async-lock.md):
  - Multi-instance coordination — this lock is invisible to other processes. Use the distributed lock
  - Holding it across a network call you do not control; you are serialising every caller on someone else's latency
  - Using `lock` around `await` instead. It does not compile, and the workarounds are worse
- [Channels](atoms/channels.md):
  - Anything that must survive a restart or reach another instance — use background jobs
  - Reaching for it before you have a measured in-process bottleneck
  - Unbounded channels in request paths: they turn a load spike into an out-of-memory failure
- [TimeProvider](atoms/time-provider.md):
  - Retrofitting it across existing platform-facing code for its own sake
  - Mixing `TimeProvider` and `DateTime.UtcNow` in the same logic; only half of it becomes testable
  - Assuming platform APIs accept a clock. They do not

### Caching

- [Cache](atoms/platform-memory-cache.md):
  - Caching per-user or per-request data here — use the request-scoped cache instead
  - Caching without an expiration token: an entry nothing can invalidate is a bug with a long fuse
  - Treating it as shared state across instances. It is per-process; only invalidation is coordinated
- [Cache regions](atoms/cache-regions.md):
  - Inventing a region per method. Region granularity should follow the entity, not the call site
  - Expiring a global region on every write — correct, but it throws away unrelated cached work
  - Assuming an expire on one instance clears the others; that is what the Redis bus is for
- [Redis cache bus](atoms/redis-cache-bus.md):
  - Expecting it to be a shared cache. Every instance still computes and stores its own values
  - Relying on it for correctness-critical consistency; propagation is fast but not instant
  - Chatty per-item invalidation during bulk work — every message fans out to every instance
- [Request-scoped cache](atoms/request-scoped-cache.md):
  - Data that should outlive the request — that is the memory cache
  - Background jobs and hosted services: there is no request, so there is no scope
  - Using it as a way to avoid passing state through your own call chain
- [Cache disabler](atoms/cache-disabler.md):
  - Leaving it disabled globally in production. Performance falls off a cliff, and the platform assumes caching is on
  - Using it to paper over a missing expiration token — fix the invalidation instead
  - Wrapping large call trees; you disable far more than you meant to
- [Hybrid Cache](atoms/hybrid-cache.md):
  - Introducing it alongside `IPlatformMemoryCache`. You end up with two caches, one invalidation mechanism, and stale reads nobody can explain
  - Assuming Virto's Redis integration is an `IDistributedCache`. It is not — it carries invalidation messages, not values

### Config & metadata

- [Settings](atoms/settings.md):
  - Infrastructure configuration — connection strings and hosting concerns belong in `appsettings.json` and the options pattern
  - Secrets operators should not see; use configuration and a secret store
  - Reading a setting inside a tight loop without hoisting the value out
- [Dynamic properties](atoms/dynamic-properties.md):
  - Fields you filter or sort large result sets by — EAV storage makes that expensive
  - Core domain fields with real business behaviour; those deserve a proper typed property
  - Dozens of properties on a hot entity — every read carries them
- [Options pattern](atoms/options-pattern.md):
  - Configuration an operator should change from the Admin UI — that is a platform setting
  - Injecting `IConfiguration` and reading raw string keys; you lose validation, defaults and discoverability
  - `IOptions<T>` for something that must react to a config change — it is captured once
- [External tool processes](atoms/external-processes.md):
  - Work a library could do in-process; a subprocess is a deployment dependency and a security surface
  - Passing unvalidated user input as arguments — that is command injection
  - Long-running tools in a request. Shell out from a background job instead
- [Localizations](atoms/localizations.md):
  - Concatenating translated fragments; grammar differs between languages and the result is unlocalizable
  - Using UI translations for data that belongs to an entity — those are different mechanisms
  - Assuming a key exists in every language. Missing keys fall back, and the fallback is visible

### Messaging & events

- [Domain events](atoms/domain-events.md):
  - Long or blocking work in a handler; publishing is in-process and synchronous, so you are extending the caller's transaction time
  - Assuming ordering between handlers of the same event
  - Relying on a changed event for durability. It is in-process — a crash loses it. Enqueue a job for work that must happen
- [Suppress events](atoms/suppress-events.md):
  - Nesting it. `Dispose()` sets the flag to **false**, not back to what it was, so an inner `using` un-suppresses the outer one early
  - Expecting it to reach a background job. Enqueue work inside the block and the job runs in a different flow — and usually a different process — with events fully live
  - Leaving it around an HTTP request boundary, or holding it open across work you did not write
  - Using it to hide a slow handler. It removes the symptom for your code path and leaves the handler slow for everyone else
- [In-process bus](atoms/inprocess-bus.md):
  - Using it directly for ordinary event handling — register an `IEventHandler<T>` in DI and let the platform wire it
  - Expecting durability, ordering guarantees or cross-process delivery
  - Registering handlers per request; registrations are process-wide and will accumulate
- [Commands](atoms/commands.md):
  - Using a command where an event fits — if several modules may want to react, publish an event
  - Wrapping every service call in a command; the indirection has to buy something
  - Expecting multiple handlers. A command has one
- [Business API (XAPI)](atoms/xapi.md):
  - Back-office CRUD. The Admin SPA speaks [REST API](atoms/rest-api.md), and mutations are not a substitute for a resource with a verb
  - Constructor-injecting `IMediator` into a builder — builders are singletons, so a captured mediator is root-scoped. The base class resolves it per request from `context.RequestServices`, and the old constructor is `[Obsolete]` with diagnostic `VC0015`
  - Resolving a child field with its own service call. That is the N+1 that DataLoader exists to batch
  - Assuming introspection and GraphiQL are available in production — both are configuration-gated
- [Push notifications](atoms/push-notifications.md):
  - High-frequency updates — batch them, or you flood both the hub and the UI
  - Using it as an event bus between server components; it is a UI transport
  - Assuming delivery. A user with no open browser gets nothing live, only the stored record
- [EventBus & WebHooks](atoms/eventbus-webhooks.md):
  - Assuming these exist in a bare platform — they must be installed
  - Sending sensitive payloads to a webhook endpoint you do not control
  - Treating outbound delivery as guaranteed and ordered. It is neither

### Data & domain

- [AbstractTypeFactory](atoms/abstract-type-factory.md):
  - `new` for any extensible domain type. It works, and it silently breaks everyone's overrides
  - Overriding a type in two places; the last registration wins and the conflict is invisible
  - Reaching for this before checking whether a dynamic property or an event handler solves the problem more cheaply
- [Generic CRUD](atoms/generic-crud.md):
  - Writing `GetAsync` / `SaveChangesAsync` / `DeleteAsync` yourself. If you are, you have re-implemented the base class and you now own its caching and event bugs
  - Putting query logic in `LoadEntities` — that one loads by id. Criteria belong in `BuildQuery` on the search service
  - Skipping the events. Other modules and integrations subscribe to `*ChangedEvent`; a hand-rolled save that does not publish is invisible to them
  - Injecting `IRepository` directly instead of `Func<IRepository>` — the service is longer-lived than a request, which is exactly why the base takes a factory
- [Repository & unit of work](atoms/repository-uow.md):
  - Injecting a repository directly instead of a factory; a long-lived `DbContext` accumulates tracked entities and leaks memory
  - Committing inside a loop. Batch and commit once
  - Leaking `IQueryable` out of the repository — the context is disposed before the query runs, and you get a confusing failure far from the cause
- [EF Core & migrations](atoms/ef-core.md):
  - Provider-specific SQL or types in shared code — it compiles and then breaks on somebody else's database
  - Generating a migration for one provider and assuming the others follow
  - Client-side evaluation by accident: an unsupported expression silently pulls the table into memory
- [Change log & audit](atoms/change-log.md):
  - Enabling it on high-write entities without thinking about volume; the log grows faster than the data
  - Using it as an event stream. It is a record for humans, not a delivery mechanism
  - Relying on it for field-level diffs unless you have checked what is actually captured
- [Specifications](atoms/specifications.md):
  - Wrapping a one-line predicate used once; a lambda is clearer
  - Expecting it to translate to SQL. This evaluates in memory, unlike an EF predicate
  - Building deep composition trees nobody can debug
- [Validation](atoms/validation.md):
  - Duplicating validation in the controller and the service; pick the layer that owns the invariant
  - Database lookups inside a validator without care — validation runs on every save
  - Relying on validation for security. Authorization is a separate concern
- [JSON serialization](atoms/json-serialization.md):
  - Assuming `System.Text.Json` attributes apply to REST responses. They do not — MVC is on Newtonsoft
  - Two competing converters for one type; the one that wins depends on registration order
  - Serializing EF entities directly. Serialize the domain model
- [Indexed search](atoms/search.md):
  - Treating the index as the source of truth. It is a projection, and it can be rebuilt
  - Reading from the index immediately after a write and expecting your change — indexing is asynchronous
  - Lucene in a scaled-out deployment; it is a local index, so every instance would hold its own copy
  - Reindexing everything on every change when `IndexChangesAsync` exists
- [Database per module](atoms/module-database.md):
  - Anything needing one transaction across two modules — there is no distributed transaction, and none is coming
  - Splitting before you have a measured reason. One database is simpler to run, back up and restore
  - Assuming a split module is now a service — it still loads in the same host process
- [Ids, not foreign keys](atoms/cross-module-references.md):
  - A foreign key to another module's table. It compiles, it even works in one database, and it makes the boundary a lie
  - Re-reading the source module to display a historical document — that is how an invoice silently changes
  - Copying data that is not part of the decision being recorded; a copy is a maintenance cost

### Modularity

- [Module federation](atoms/module-federation.md):
  - Editing the shell to add your screen. That is the same mistake as editing a vendor module, one layer up
  - Treating the manifest as static. It is per app and per user, and the ETag is what makes it cheap
  - Shipping a plugin whose `remoteEntry.js` is built against a different shared-dependency version than the host — federation resolves shared deps at runtime, and a mismatch fails there rather than at build
- [Back office module](atoms/admin-ui.md):
  - Expecting the AngularJS Commerce Manager to be there after a platform upgrade. Since 3.1092 it comes from a module and has to be in the package
  - Building a new back-office screen for the AngularJS UI when the target is Admin Shell. New work belongs in a VC-Shell app
  - Using `platform` as an app id for your own app. It belongs to the AngularJS Commerce Manager
- [Module lifecycle](atoms/module-lifecycle.md):
  - Resolving services in `Initialize`. The container is not finished, and you will capture the wrong thing or fail outright
  - Registering an `AbstractTypeFactory` override in `PostInitialize` — by then something may already have constructed the base type
  - Long-running or network work in either method; it blocks startup for the whole application
- [module.manifest](atoms/module-manifest.md):
  - Assuming `moduleType` is how the platform finds your `IModule` — it is only a tie-breaker
  - A floating `platformVersion`; it is a compatibility gate, not documentation
  - Declaring the same setting both in the manifest and in code — pick one per setting
  - `startupType` in a module with no `assemblyFile`; it is resolved from the assembly, so it is silently meaningless
- [Module catalog & install](atoms/module-catalog.md):
  - Editing the probing folder by hand and expecting it to survive; it is derived state
  - Installing modules at runtime as a deployment strategy for production — prefer a baked image
  - Assuming install is instant. It is a background operation, historically an actual background job
- [Platform startup hooks](atoms/platform-startup.md):
  - Adding middleware in `Configure` when its position matters. `ConfigureAfterRouting` and `ConfigureAfterAuthentication` have defined places; `Configure` does not
  - Doing in a startup hook what a plain DI registration would do
  - Assuming your hook runs before another module's — order follows the dependency graph
- [Dependency injection](atoms/dependency-injection.md):
  - Injecting a scoped service into a singleton — a **captive dependency**. The scoped service is promoted to the process lifetime, and the symptom is stale data on a later request rather than an exception
  - Resolving a scoped service straight from the root provider. Same outcome: only the root container disposes it, so it lives until shutdown
  - Singleton for a service with no state of its own. It buys nothing and costs thread-safety, coupling between requests, harder tests and no configuration reload
  - Service locator patterns (`GetRequiredService` in business code) outside `PostInitialize`
  - Calling `BuildServiceProvider` while configuring services — take the factory overload that hands you an `IServiceProvider` instead
  - Registering a `DbContext` or repository as a singleton — see [Repository & unit of work](atoms/repository-uow.md) for why
- [Keyed services](atoms/keyed-services.md):
  - Using keys where the platform would use a registry — you break the pattern other developers expect
  - Keying a service other modules should be able to override; keyed registrations do not participate in override-by-last-registration
  - Introducing it into a shared contract; consumers then need to know your keys
- [Backup & restore](atoms/backup-restore.md):
  - Loading everything into memory before writing. Stream it, or large tenants fail
  - Ignoring the progress callback — an import with no feedback looks hung
  - Implementing only the obsolete `ICancellationToken` overload in new code
- [vc-build CLI](atoms/vc-build.md):
  - Hand-copying module folders between environments; that is what `vc-package.json` and `Install` exist to replace
  - Editing `vc-package.json` by hand when a command maintains it
  - Letting local and CI use different build steps — both should call the same targets
- [Optional dependency](atoms/optional-dependency.md):
  - Marking a real requirement optional to make an install succeed — it will fail later, at a worse moment
  - Resolving the service in `Initialize` and caching it; ask through `IOptionalDependency<T>` at the point of use
  - Optional dependencies as a substitute for events. If you only need to be told something happened, handle the event instead
- [Host composition](atoms/host-composition.md):
  - Expecting a single module to become a service. The unit of deployment is a host with a module set, never one module
  - Splitting by role before Redis is in place — cache coherence, the SignalR backplane and the migration lock all depend on it
  - A module subset whose dependency graph does not close; the missing module takes its dependents down with it
  - More than one shape at once. Get all-in-one measured first, then split the axis your metrics point at

### Security

- [Permissions](atoms/permissions.md):
  - Checking role names in code. Roles are operator-assignable; permissions are the contract
  - A single coarse permission for a whole module; operators cannot delegate what you did not separate
  - Enforcing only in the UI. The API is the security boundary
- [Authentication](atoms/authentication.md):
  - Rolling your own token validation. The handlers already exist and are wired
  - Basic authentication over anything but TLS, and preferably not at all
  - Long-lived API keys with broad permissions; scope them and rotate them
- [Authorization policies](atoms/authorization.md):
  - Putting business logic in a handler that belongs in the domain
  - Client-side-only gates. A UI check is a usability feature, not a security control
  - Duplicating a permission check that the attribute already performs
- [Current user & tenancy](atoms/current-user.md):
  - Injecting `IHttpContextAccessor` into business services; depend on the resolver instead
  - Assuming a current user exists. In a job, a hosted service or at startup there may be none
  - Trusting a user id from the request body over the authenticated principal
- [Sign-in extensions](atoms/sign-in-extensions.md):
  - Writing a token endpoint of your own. Register a grant type and the OpenIddict server issues the token
  - Implementing `IGrantTypeHandler` from scratch when `GrantTypeHandlerBase` fits. The base class is where lockout, two-factor and logging already happen
  - Treating basic authentication as an integration path for users who need a second factor. It refuses them by design
- [OAuth applications](atoms/oauth-applications.md):
  - Handing an agent an API key for an administrator account. An OAuth application can be limited to named resources and is subject to consent
  - Accepting any resource URI. Only URIs listed in `Authorization:Resources` are accepted, and the application also needs a matching permission
  - Changing validation rules by editing controllers. Replace or derive from `OAuthAppRules`

### Infra & ops

- [Distributed lock](atoms/distributed-lock.md):
  - Treating the lock as a transaction. It orders access; it does not roll anything back
  - Ignoring the token passed to your delegate. If the lock is lost, another instance may already be running the same work
  - New code on `IDistributedLockService`. It is deprecated and kept for existing callers
- [Logging](atoms/logging.md):
  - String interpolation in log messages — you lose every structured property
  - Logging personal data, secrets or full request bodies
  - Logging and rethrowing at every level; one exception becomes five confusing entries
- [Swagger / OpenAPI](atoms/swagger.md):
  - Leaving the UI publicly reachable in production without considering what it discloses
  - Assuming a derived type appears correctly. Polymorphism needs configuration
  - Treating the generated document as documentation of intent; it describes shape, not meaning
- [HTTP client](atoms/http-client.md):
  - `new HttpClient()` per request. It exhausts sockets under load, and the failure looks like a network problem
  - A static `HttpClient` that never refreshes DNS — the opposite failure
  - No timeout. The default is long enough to turn a slow dependency into an outage
- [Resilience (Polly)](atoms/resilience.md):
  - Retrying non-idempotent operations — a retried payment is worse than a failed one
  - Retrying inside a request handler without a budget; you multiply load on an already-struggling dependency
  - Assuming a platform convention exists. There is none to follow yet
- [Developer tools](atoms/developer-tools.md):
  - Registering a tool without a permission check; the registry filters, but the page itself must also be protected
  - Exposing anything that mutates state without an explicit confirmation and authorization
  - Using it as a substitute for logs or health checks
- [File operations](atoms/file-operations.md):
  - Expecting blob or asset storage here. There is no blob abstraction in the platform — that is the Assets module
  - Local file paths as durable storage in a scaled-out deployment; instances do not share a disk
  - Direct `System.IO` calls for multi-step changes you would need to unwind
- [Health checks](atoms/health-checks.md):
  - Expensive checks. A probe runs constantly and must not become load
  - Marking a soft dependency `Unhealthy`; that takes the whole instance out of rotation
  - Leaking internal details in the response body if the endpoint is publicly reachable
- [REST API](atoms/rest-api.md):
  - Minimal APIs (`app.MapGet`) inside a module — grep finds no `MapGet` in `src/`, and an endpoint registered that way inherits none of the three behaviours above
  - Read-heavy storefront traffic. That is what [Business API (XAPI)](atoms/xapi.md) is for: one round trip, shaped by the caller
  - Business logic in the controller. A controller binds, authorizes and delegates — the service layer holds the rules
  - Inventing your own route shape. `api/{module}/{resource}` is what every existing client, and the Swagger grouping, expects
- [Assets & blob storage](atoms/assets.md):
  - The filesystem provider on more than one instance. Instances do not share a disk, so an upload lands on whichever node served the request
  - Storing binaries in the relational database
  - Serving large assets through the API instead of putting a CDN in front of blob storage
  - Assuming the abstraction exists in a bare platform — without the module there is no blob API at all
- [Seq & log sinks](atoms/seq-logging.md):
  - Shipping personal data or secrets to a log server — it is a searchable index of whatever you send it
  - Debug level in production without a retention and volume plan
  - Relying on the console sink in a container nobody is watching
- [Scalability](atoms/scalability.md):
  - Scaling up first. It buys headroom you pay for around the clock and hides the coupling that stopped you scaling out
  - Adding the second instance before the four prerequisites are met: Redis configured, a cloud blob provider instead of `FileSystemAssets`, a real search provider instead of Lucene, and the bearer-token certificate shared. Each of these works on one instance and fails on two
  - Scaling the database to fix catalog browse. The index is the read path; the database is not in it
  - Sizing every host the same. A 512 MB request host and a reindex worker want different machines
  - Quoting a scalability number without saying which level it applies to — the platform layer and your custom modules scale on different curves

## Pitfalls by layer

### [Channels](layers/channels.md)

- The Admin UI is back-office only. It is never the customer-facing surface, and its AngularJS age says nothing about the storefront stack.
- Admin UI assets are built into the source `wwwroot/dist`, but a running platform serves the installed module's copy — a webpack build alone does not update a running instance.
- Every back-office host converges on one contract: `GET /api/apps/{appId}/manifest`, driven by the same `module.manifest` dependency graph as .NET install order. `POST /api/frontend-modules` survives only as a deprecated alias.
- The platform core does not implement MCP or UCP; the UCP module does. Treat any agent as an untrusted client: give it its own OAuth application limited to the resources it needs, not an API key for a privileged account.

### [API edge](layers/api-edge.md)

- MVC is configured with `AddNewtonsoftJson`, so REST serialization is Newtonsoft — not `System.Text.Json`. Custom converters must be written against Newtonsoft.
- The platform uses MVC controllers throughout; there are no Minimal API endpoints to copy as a pattern.
- XAPI lives in a separate repository (`vc-module-x-api`) — it is a module set, not part of the platform core. `vc-module-experience-api` is the archived predecessor; do not start from it.

### [Platform](layers/platform.md)

- Do not modify platform source in a solution. Customisation belongs in modules; this is what keeps updates clean.
- A DI registration made later wins. That is the extension mechanism for services, and also the way you accidentally replace something you did not mean to.

### [Integration](layers/integration.md)

- Integration events are at-least-once in practice. Handlers must be idempotent; assume every message can arrive twice.
- EventBus and WebHooks are installable modules, not platform core — the tiles on this poster reflect that.
- Point-to-point integration between the platform and each external system is the trap middleware exists to prevent.
- The most expensive integration is the one that never needed to exist — a ticket raised because a price list, a promotion or an approval limit could only be changed by a developer. Check the Admin UI door before scoping anything.
- Hand-written integration code has a running cost: every field the ERP team renames becomes a ticket, a release and a deployment window. That cost, not the build, is what middleware is bought to avoid.
- **Punchout is named in the Integration Capabilities deck but is not in the public module registry** and has no public repository. Treat it as a delivered capability to scope with the Virto team, not a package you can install from `vc-package.json`.

### [Infrastructure](layers/infrastructure.md)

- Scaling out to more than one instance makes Redis mandatory: without it, per-instance memory caches drift and module installation has no distributed lock.
- Redis holding cache *invalidation messages* rather than cache *values* surprises almost everyone. Losing Redis costs coherence, not the cache itself.
- An SLA covers the layer the provider operates. **99.9% on the platform layer is not 99.9% on your solution** — a custom module that throws, or a migration that locks a table, is inside your half of the boundary. Know where the line is before you quote a number to a customer.
- Managed does not mean unobservable, and it does not mean unwatched either: telemetry being open to your team is only worth something if someone on it is looking at the dashboard.
- "Azure today, AWS and GCP on request" means the stack is portable, not that it runs on all three at once. Treat a second cloud as a project with a date, not a switch.
- Everything in the comparison above comes from the Virto Cloud presentation — vendor material, and correct as far as it goes. The numbers worth asking to see measured on your own workload are the performance claim and the achieved uptime, not the target.
