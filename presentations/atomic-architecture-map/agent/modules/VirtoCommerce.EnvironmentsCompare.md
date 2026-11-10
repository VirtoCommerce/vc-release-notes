# Environments Compare (`VirtoCommerce.EnvironmentsCompare`)

> Enables backend administrators to compare platform settings, environment configurations, and system information across multiple Virto Commerce environments

- Latest version: 3.1003.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-environments-compare
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.EnvironmentsCompare`

## For business analysts

Comparing two environments to see what differs — settings, modules, configuration — before a release goes wrong.

## For architects

One dependency, no storage, two permissions. A diagnostic tool rather than a capability, and one of the few modules whose value is entirely in a back-office screen.

## For developers

Useful in the moment a deployment misbehaves and everyone believes the environments are identical. It reads; it changes nothing.

## Use it when

- Staging and production behave differently and nobody knows why
- A release checklist should include a configuration diff
- Module versions across environments need verifying

## Do not use it when

- You need the data compared — this is configuration, not content
- Configuration is already managed centrally and versioned
- You expect it to fix the difference: it reports

## Required modules

- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0

## REST controllers

- `api/environments-compare` · 4 actions · [vc-module-environments-compare/src/VirtoCommerce.EnvironmentsCompare.Web/Controllers/Api/EnvironmentsCompareController.cs](https://github.com/VirtoCommerce/vc-module-environments-compare/blob/dev/src/VirtoCommerce.EnvironmentsCompare.Web/Controllers/Api/EnvironmentsCompareController.cs)
- `null` · 1 actions · [vc-module-environments-compare/src/VirtoCommerce.EnvironmentsCompare.Web/Controllers/Api/EnvironmentsCompareExternalController.cs](https://github.com/VirtoCommerce/vc-module-environments-compare/blob/dev/src/VirtoCommerce.EnvironmentsCompare.Web/Controllers/Api/EnvironmentsCompareExternalController.cs)

## Permissions

- `environments-compare:access`
- `environments-compare:read`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 0.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Environment comparison** (Integration & operations): See exactly how staging differs from production before a release goes wrong.

## Key features

- **Multi-Environment Comparison**: Compare settings across two or more environments simultaneously, including the current environment and remote environments
- **Comprehensive Settings Coverage**:
- Platform settings (grouped by settings groups)
- Environment variables (system and process variables)
- .NET runtime information (framework version, OS description, architecture)
- Server features and hosting configuration
- **Environment Settings View**: From the environments list, click any environment to open a dedicated blade showing all of its settings in the same structured, filterable layout as the comparison view. This blade focuses on a single environment (without comparison controls), making it easy to inspect, search, and review configuration scopes and groups for one environment at a time.
- **Base Environment Comparison**: Select a base environment and compare all other environments against it to highlight differences
- **Difference Filtering**: Toggle between showing all settings or only differences to focus on what's changed
- **Search**: Quickly filter specific settings using a search bar
- **Settings Export**: Choose an environment and export its settings for future reference
- **Security Features**:
- API key-based authentication for secure communication with remote environments
- Automatic masking of secret/sensitive settings (passwords, secure strings) using SHA1 hashes
- **Visual Indicators**: Clear visual feedback showing which settings differ from the base environment and which environments have errors
- **Error Handling**: Displays connection errors and missing settings with descriptive error messages
- **External API Endpoint**: Provides a secure endpoint for remote environments to expose their settings for comparison
