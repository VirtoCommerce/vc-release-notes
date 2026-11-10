# Azure App Configuration (`VirtoCommerce.AzureAppConfiguration`)

> Allows using Azure App Configuration to externalize storage and management of your app settings for Virto Commerce

- Latest version: 3.1003.0 (needs platform 3.1038.0)
- Repository: https://github.com/VirtoCommerce/vc-module-azure-app-configuration
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AzureAppConfiguration`

## For business analysts

Application settings and feature flags kept in Azure App Configuration rather than in a file.

## For architects

No dependencies and no settings of its own: it adds a configuration source, so values arrive from the service before the platform reads them. Central configuration is what makes many instances behave identically.

## For developers

Settings resolve at startup unless refresh is configured — decide deliberately whether a value may change under a running host. Secrets belong in a key vault, not here.

## Use it when

- Several instances or environments must share one source of configuration
- Feature flags should flip without a deployment
- Configuration has to be audited or versioned centrally

## Do not use it when

- A single developer machine — appsettings is simpler
- Storing secrets: use a key vault reference instead
- Per-store business settings: those are platform settings, not app configuration

## Business features it serves

- **Central configuration & feature flags** (Integration & operations): Change settings and switch features on across every instance without a redeploy.

## Key features

- **Managed Identity & connection string authentication** — supports `DefaultAzureCredential`, `ManagedIdentityCredential` (recommended for Azure-hosted production), and connection string authentication.
- **Geo-replication failover & load balancing** — connect to multiple replica endpoints in preference order for automatic failover during regional outages, with optional load balancing to spread request load across replicas.
- **Resilient startup** — configurable time-out for the initial configuration load, with built-in transient-fault retries during platform boot.
- **Key Vault reference resolution** — automatically resolves [Key Vault references](https://learn.microsoft.com/en-us/azure/azure-app-configuration/use-key-vault-references-dotnet-core) stored in App Configuration, retrieving secret values directly from Azure Key Vault.
- **Early configuration pipeline integration** — registers as a `ConfigurationSource` at the highest startup priority, ensuring Azure-managed settings are available before any module initialization.
- **Environment-aware key filtering** — automatically loads base keys and environment-specific keys labeled with `IHostEnvironment.EnvironmentName`, allowing environment overrides.
- **Key prefix filtering** — optionally filter and trim key prefixes to scope configuration to your application.
- **Sentinel-based configuration refresh** — monitors a configurable Sentinel key; when its value changes, all configuration entries are refreshed without application restart.
- **Configurable refresh interval** — control how frequently the module polls for configuration changes.
- **Health check** — built-in ASP.NET Core health check for monitoring Azure App Configuration connectivity.
- **Structured logging** — logs authentication method, configuration status, and refresh events at startup.
- **Zero-code adoption** — no changes required in other modules; settings resolved through `IConfiguration` and `IOptions<T>` automatically pick up values from Azure App Configuration.

## Documentation

- [Azure App Configuration overview](https://learn.microsoft.com/en-us/azure/azure-app-configuration/overview)
- [Use dynamic configuration in ASP.NET Core](https://learn.microsoft.com/en-us/azure/azure-app-configuration/enable-dynamic-configuration-aspnet-core)
- [Azure App Configuration best practices](https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-best-practices)
- [Enable geo-replication](https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-geo-replication)
- [Resiliency and disaster recovery](https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-disaster-recovery)
- [Use managed identities to access App Configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)
- [Use Key Vault references in an ASP.NET Core app](https://learn.microsoft.com/en-us/azure/azure-app-configuration/use-key-vault-references-dotnet-core)
- [Reload secrets and certificates from Key Vault automatically](https://learn.microsoft.com/en-us/azure/azure-app-configuration/reload-key-vault-secrets-dotnet)
