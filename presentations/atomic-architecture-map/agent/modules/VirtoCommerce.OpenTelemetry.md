# Open Telemetry (`VirtoCommerce.OpenTelemetry`)

> Provides Open Telemetry metrics, tracing, and logging via OTLP exporter

- Latest version: 3.1002.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-opentelemetry
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.OpenTelemetry`

## For business analysts

Traces and metrics in the vendor-neutral OpenTelemetry format, for whichever backend you run.

## For architects

No dependencies and no settings: it wires the standard SDK and lets the collector decide where data goes. The portable alternative to a vendor agent.

## For developers

Instrument spans in your own module through the standard API and they appear alongside the platform's. Exporter configuration is environment, not code.

## Use it when

- You need to see what a deployed instance is doing
- An incident needs traces or metrics that survive a restart
- The hosting platform already collects this format

## Do not use it when

- Business reporting — this is operational telemetry, not analytics
- You want an audit trail of who changed what: that is Audit Log
- Adding several collectors for the same signal, which doubles cost for one answer

## Business features it serves

- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.

## Key features

- **Metrics**: ASP.NET Core, HTTP Client, Runtime, Process, EF Core, Elasticsearch, Redis instrumentation
- **Distributed Tracing**: ASP.NET Core, HTTP Client, Hangfire, EF Core, Elasticsearch, Redis instrumentation
- **Logging**: Serilog → OpenTelemetry via OTLP sink, with trace/span ID correlation
- **Conditional Activation**: Only enabled when explicitly configured
