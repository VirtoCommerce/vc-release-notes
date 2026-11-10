# Google Analytics 4 (`VirtoCommerce.GoogleEcommerceAnalytics`)

> Allows you active Measurement Id for a Store and measure traffic and ecommerce events to collect information about the shopping behavior of your users.

- Latest version: 4.1007.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-google-ecommerce-analytics
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.GoogleEcommerceAnalytics`

## For business analysts

Sends storefront and purchase events to Google Analytics 4 so marketing can measure the funnel.

## For architects

The one module in the catalogue at major version 4, tracking GA4 rather than the platform's own numbering. One dependency and no schema — it is a bridge, and now in both directions: besides the tracking settings, three settings (property id, request timeout, cache lifetime) configure reading reports back from the GA4 Data API.

## For developers

Events fire from the storefront, so what GA sees depends on the frontend implementation as much as on this module. Consent handling is yours to get right.

## Use it when

- The business measures conversion in GA4
- Marketing needs funnel and revenue reporting
- Campaign attribution matters

## Do not use it when

- Operational monitoring — that is Application Insights or OpenTelemetry
- You need exact financial figures: the order data is authoritative, analytics is sampled
- Consent has not been designed: this ships personal data to a third party

## Required modules

- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## REST controllers

- `api/googleanalytics` · 3 actions · [vc-module-google-ecommerce-analytics/src/VirtoCommerce.GoogleEcommerceAnalyticsModule.Web/Controllers/Api/GoogleAnalyticsController.cs](https://github.com/VirtoCommerce/vc-module-google-ecommerce-analytics/blob/dev/src/VirtoCommerce.GoogleEcommerceAnalyticsModule.Web/Controllers/Api/GoogleAnalyticsController.cs)

## Permissions

- `googleanalytics:access`

## Settings

- `GoogleAnalytics4.DataApi.CacheTtlMinutes`
- `GoogleAnalytics4.DataApi.PropertyId`
- `GoogleAnalytics4.DataApi.RequestTimeoutSeconds`
- `GoogleAnalytics4.EnableTracking`
- `GoogleAnalytics4.GoogleAnalyticsUrl`
- `GoogleAnalytics4.GtmContainerId`
- `GoogleAnalytics4.MeasurementId`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Funnel & revenue analytics** (Marketing & loyalty): Marketing measures the funnel in the analytics tool it already uses.

## Documentation

- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Tag Manager](https://developers.google.com/tag-platform/tag-manager)
- [GTM with GA4 Setup Guide](https://support.google.com/tagmanager/answer/9442095)
- [GA4 Ecommerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Module Documentation](https://docs.virtocommerce.org/modules/google-ecommerce-analytics/)
