# Background Jobs (`VirtoCommerce.BackgroundJobs`)

> Handles asynchronous processing, allowing applications to offload time-consuming, repetitive, or resource-heavy tasks outside the platform

- Latest version: 3.1055.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-background-jobs
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.BackgroundJobs`

## For business analysts

The work the platform does out of sight — reindexing, imports, exports, scheduled reminders — and the place to look when something is queued rather than instant.

## For architects

The engine behind every long-running task, and **it owns no database and has no migrations**: state lives in whichever engine you configure. Three engine projects ship in the box — Hangfire, RabbitMQ and an in-memory one for local work — plus a shim that keeps modules calling the old Hangfire API working. That is what lets a producer host enqueue and a worker host drain, which is the horizontal split behind `VirtoCommerce:BackgroundJobs:Mode`. It subscribes to events dynamically rather than declaring handlers.

## For developers

Depend on the engine-agnostic abstraction, not on Hangfire: a payload plus an `IBackgroundJobHandler<TPayload>`, enqueued through `IBackgroundJob`. That keeps your module working when the engine changes, and it is the difference between a module that runs on RabbitMQ and one that does not. `api/platform/jobs` is the surface the back office watches.

## Use it when

- Work is too slow, too large or too repetitive to do inside a request
- A task must survive a restart, or run on a schedule
- You are splitting a deployment into request hosts and worker hosts

## Do not use it when

- The reaction must be transactional with the write — that is a domain event handler
- You are calling Hangfire directly: the abstraction exists so the engine can change under you
- The job needs a database table of its own — this module keeps none, so bring your own store

## Events it handles

- `ObjectSettingChangedEvent`

## REST controllers

- `api/background-jobs/google-cloud-tasks` · 1 actions · [vc-module-background-jobs/samples/VirtoCommerce.BackgroundJobs.GoogleCloudTasks/Controllers/GoogleCloudTasksCallbackController.cs](https://github.com/VirtoCommerce/vc-module-background-jobs/blob/dev/samples/VirtoCommerce.BackgroundJobs.GoogleCloudTasks/Controllers/GoogleCloudTasksCallbackController.cs)
- `api/background-jobs-sample/benchmark` · 3 actions · [vc-module-background-jobs/samples/VirtoCommerce.BackgroundJobs.SampleModule/Controllers/Api/BenchmarkController.cs](https://github.com/VirtoCommerce/vc-module-background-jobs/blob/dev/samples/VirtoCommerce.BackgroundJobs.SampleModule/Controllers/Api/BenchmarkController.cs)
- `api/background-jobs-sample` · 2 actions · [vc-module-background-jobs/samples/VirtoCommerce.BackgroundJobs.SampleModule/Controllers/Api/SampleJobsController.cs](https://github.com/VirtoCommerce/vc-module-background-jobs/blob/dev/samples/VirtoCommerce.BackgroundJobs.SampleModule/Controllers/Api/SampleJobsController.cs)
- `api/background-jobs` · 3 actions · [vc-module-background-jobs/src/VirtoCommerce.BackgroundJobs.Web/Controllers/Api/BackgroundJobsAdminController.cs](https://github.com/VirtoCommerce/vc-module-background-jobs/blob/dev/src/VirtoCommerce.BackgroundJobs.Web/Controllers/Api/BackgroundJobsAdminController.cs)
- `api/platform/jobs` · 2 actions · [vc-module-background-jobs/src/VirtoCommerce.BackgroundJobs.Web/Controllers/Api/JobsController.cs](https://github.com/VirtoCommerce/vc-module-background-jobs/blob/dev/src/VirtoCommerce.BackgroundJobs.Web/Controllers/Api/JobsController.cs)

## Permissions

- `background-jobs:access`
- `background-jobs:create`
- `background-jobs:delete`
- `background-jobs:execute`
- `background-jobs:read`
- `background-jobs:update`

## Settings

- `BackgroundJobs.Sample.EnableHeartbeat`
- `BackgroundJobs.Sample.HeartbeatCron`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Background processing** (Integration & operations): Long or scheduled work runs outside the request, and survives a restart.

## Key features

- **Engine-agnostic job API** — define a payload + `IBackgroundJobHandler<TPayload>` handler and enqueue via the
- **Pluggable engines behind one port** (`IJobEngine`) — Hangfire and RabbitMQ ship in the box; selected by a
- **Fire-and-forget with or without progress** — opt into live progress streamed to the admin notification UI over
- **Map/reduce (fan-out → aggregate)** — split big work into N map tasks that run in parallel across all workers, then
- **Instance modes** — the same container image runs as `Producer` (enqueue only), `Worker` (process only) or
- **No breaking changes** — a type-forwarding shim keeps existing `VirtoCommerce.Platform.Hangfire.*` consumers
- **Extensible by partners** — override a handler via DI (last registration wins) and extend a payload via
- **Static enqueue for migration** — a Hangfire-style `BackgroundJob.Enqueue<THandler>(payload)` static entry point
- **Admin & integration REST API** — list registered handlers and recurring schedules for troubleshooting, and
- **Application Insights telemetry** — every job on every engine emits pre-aggregated duration/queue-latency metrics
- **Graceful when absent** — if no engine module is installed, the platform boots and surfaces an actionable

## Documentation

- [Background processing developer guide](https://docs.virtocommerce.org/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.BackgroundJobs)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-background-jobs/)
