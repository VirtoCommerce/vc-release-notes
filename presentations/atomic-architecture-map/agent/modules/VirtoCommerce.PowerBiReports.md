# Power BI Commerce Reports (`VirtoCommerce.PowerBiReports`)

> Power BI Commerce Reports for Virto Commerce

- Latest version: 3.1002.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-power-bi-reports
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.PowerBiReports`

## For business analysts

Gives the back office a Reports entry that opens a Power BI sales dashboard and sales analysis report. The reports themselves are built and published in Power BI from a template the module provides.

## For architects

A thin launcher, not a reporting engine. The module ships SQL views (`bi-Orders-view.sql`) to apply to the commerce database and a Power BI report file (`ECommerce-Sales-Report.pbix`) to publish to the Power BI Service; its only endpoint redirects the back-office user to the report URL in `PowerBiReports.PowerBiReportsUrl`. Power BI therefore reads the Orders data straight from the database through those views, not through any platform API, which means it needs network access to the database and can break when the Orders schema changes.

## For developers

Setup is mostly outside the platform: apply the SQL script, open the .pbix in Power BI Desktop, check the data loads, publish it, schedule refresh, and paste the published URL into the setting. The module declares create, read, update, delete and access permissions; the redirect endpoint checks read.

## Use it when

- A sales dashboard in Power BI quickly, for a business that already uses Power BI
- A starting template for order and revenue reporting that a BI team will extend

## Do not use it when

- Environments where a reporting tool may not connect to the transactional database. Point Power BI at a replica or a warehouse instead
- Reporting inside the platform: everything here runs in Power BI

## Required modules

- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1000.0

## REST controllers

- `api/power-bi-reports` · 1 actions · [vc-module-power-bi-reports/src/VirtoCommerce.PowerBiReports.Web/Controllers/Api/PowerBiReportsController.cs](https://github.com/VirtoCommerce/vc-module-power-bi-reports/blob/dev/src/VirtoCommerce.PowerBiReports.Web/Controllers/Api/PowerBiReportsController.cs)

## Permissions

- `PowerBiReports:access`
- `PowerBiReports:create`
- `PowerBiReports:delete`
- `PowerBiReports:read`
- `PowerBiReports:update`

## Settings

- `PowerBiReports.PowerBiReportsUrl`

## Business features it serves

- **Sales reporting in Power BI** (Integration & operations): A ready sales dashboard and sales analysis in Power BI, opened from the back office.

## Key features

- Connect Virto Commerce Data to Microsoft Power BI: The Reports module enables users to connect their e-commerce data from Virto Commerce to Microsoft Power BI, allowing them to create interactive and customizable reports and dashboards.
- Explore Your Data Using Natural Language Capabilities: The Reports module allows users to explore their data using natural language capabilities, making it easier to extract insights and make data-driven decisions.
- Sales Dashboard: The Reports module provides a pre-built sales dashboard template, allowing users to easily visualize and track their sales performance.
- Sales Analysis: The Reports module provides a pre-built sales analysis report template, allowing users to extract and analyze critical data on their sales performance, including revenue, order volume, and more.

## Documentation

- [Power Bi Reports module user documentation](https://docs.virtocommerce.org/platform/user-guide/integrations/power-bi/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.PowerBiReports)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-power-bi-reports)
