# Azure Application Insights (`VirtoCommerce.ApplicationInsights`)

> Enables developers and administrators to collect, monitor, and analyze application performance, usage, and diagnostic data

- Latest version: 3.1005.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-app-insights
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.ApplicationInsights`

## For business analysts

Operational telemetry in Azure Monitor: requests, dependencies, failures and traces from a running instance.

## For architects

No dependencies, three settings, no schema — configuration that turns on the Azure SDK. Xapi even registers a telemetry processor to keep plain GraphQL POSTs from flooding it, which tells you how much traffic this sees.

## For developers

Sampling and cost are the design decisions. Correlate by operation id across hosts; without that a scaled-out deployment produces telemetry you cannot join.

## Use it when

- You need to see what a deployed instance is doing
- An incident needs traces or metrics that survive a restart
- The hosting platform already collects this format

## Do not use it when

- Business reporting — this is operational telemetry, not analytics
- You want an audit trail of who changed what: that is Audit Log
- Adding several collectors for the same signal, which doubles cost for one answer

## REST controllers

- `api/application-insights` · 1 actions · [vc-module-app-insights/src/VirtoCommerce.ApplicationInsights.Web/Controllers/Api/ApplicationInsightsController.cs](https://github.com/VirtoCommerce/vc-module-app-insights/blob/dev/src/VirtoCommerce.ApplicationInsights.Web/Controllers/Api/ApplicationInsightsController.cs)

## Permissions

- `application-insights:access`

## Settings

- `ApplicationInsights.ApplicationInsightsUrl`
- `ApplicationInsights.EnableTracking`
- `ApplicationInsights.InstrumentationKey`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.

## Key features

- Collecting standard metric
- Supports Code Optimizations and Application Insights Profiler
- Collecting application telemetry data
- Collecting application trace logging data
- Flexible configuration by config and code
- Store Setting to configure Application Insights and specify the InstrumentationKey per store.

## Documentation

- [AppInsights module user documentation](https://docs.virtocommerce.org/platform/user-guide/application-insights/overview/)
- [App Insights configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#application-insights)
- [Configure Profiler](https://learn.microsoft.com/en-us/azure/azure-monitor/profiler/profiler-settings)
- [Logging configuration](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Logging/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-app-insights)
