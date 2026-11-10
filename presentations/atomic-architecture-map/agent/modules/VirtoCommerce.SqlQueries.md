# Sql Queries (`VirtoCommerce.SqlQueries`)

> Adds SQL query/report capabilities to the VirtoCommerce platform, enabling advanced data access directly through SQL.

- Latest version: 3.1008.0 (needs platform 3.1007.28)
- Repository: https://github.com/VirtoCommerce/vc-module-sql-queries
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.SqlQueries`

## For business analysts

Saved SQL queries an administrator can run and export — reporting without a BI project.

## For architects

Two entities and six migrations, no dependencies, five permissions. Powerful and deliberately permissioned: it puts SQL in the back office, which is exactly as dangerous as it sounds.

## For developers

Two declared events. Treat the permission as production-critical, use read-only credentials where possible, and remember queries bypass every module's caching and validation.

## Use it when

- An ad-hoc question needs answering from data today
- Reporting is not worth a BI pipeline yet
- Support needs a repeatable diagnostic query

## Do not use it when

- Untrusted users could reach it — this is direct database access
- The query belongs in an application feature: build the feature
- The data lives across modules that own their own schemas: joins here couple you to them

## Owns these entities

- `SqlQueryEntity`

## REST controllers

- `api/sql-queries` · 11 actions · [vc-module-sql-queries/src/VirtoCommerce.SqlQueries.Web/Controllers/Api/SqlQueriesController.cs](https://github.com/VirtoCommerce/vc-module-sql-queries/blob/dev/src/VirtoCommerce.SqlQueries.Web/Controllers/Api/SqlQueriesController.cs)

## Permissions

- `sql-queries:access`
- `sql-queries:create`
- `sql-queries:delete`
- `sql-queries:read`
- `sql-queries:update`

## Settings

- `SqlQueries.General.CommandTimeout`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 9.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Ad-hoc reporting** (Integration & operations): Answer a data question today, without a BI project.

## Key features

- Execute custom SQL queries against the VirtoCommerce databases.
- Integrate with the platform’s security and permissions system to control query access.
- Return results in user-friendly formats for reporting and analysis: HTML, CSV, XLSX.
- Save reports as PDF from the admin UI: the HTML report opens in the browser's print dialog, where you choose **Save as PDF**.
- Supports query parameters: Short Text, Date Time, Boolean, Integer, Decimal.
- Supports multiple database providers: SQL Server (default), MySQL, and PostgreSQL.
- Supports multiple connection strings.
- Platform Backup & Restore support.

## Documentation

- [View on GitHub](https://github.com/VirtoCommerce/vc-module-sql-queries)
