# AI (`VirtoCommerce.AI`)

> AI manifest aggregation module for VirtoCommerce Platform. Collects and exposes AI tool and agent definitions from all installed modules.

- Latest version: 3.1001.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-ai
- Area: AI
- On the map: `#/molecule/VirtoCommerce.AI`

## For business analysts

The platform's AI foundation: where a model provider is configured and where AI features get their access from.

## For architects

No dependencies, no tables, two settings and five permissions — a configuration and abstraction module, which is the same shape Search and Payment take. At 3.1001.0 it is early, and the AI family around it is the newest part of the catalogue.

## For developers

Depend on the abstraction rather than a vendor SDK, exactly as with search providers — the model landscape moves faster than the platform does. Permissions matter: AI calls cost money per request.

## Use it when

- A module needs a model without owning the credentials
- AI provider choice should be configuration
- Access to AI features must be permissioned and auditable

## Do not use it when

- You need a specific model's exclusive features — the abstraction may not expose them
- Latency budgets are tight: model calls are slow and remote
- Cost per call is unbudgeted

## REST controllers

- `api/ai` · 6 actions · [vc-module-ai/src/VirtoCommerce.AI.Web/Controllers/Api/AIController.cs](https://github.com/VirtoCommerce/vc-module-ai/blob/dev/src/VirtoCommerce.AI.Web/Controllers/Api/AIController.cs)

## Permissions

- `ai:access`
- `ai:create`
- `ai:delete`
- `ai:read`
- `ai:update`

## Settings

- `AI.ChatEndpoint`
- `AI.Enabled`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 0.

## Business features it serves

- **AI provider foundation** (AI & agents): A configured model provider that features can use, with access permissioned.

## Key features

- **Automatic Discovery**: Scans all installed modules for AI definitions
- **Tool Definitions**: Aggregates YAML-based tool definitions from `ai/tools/` directories
- **Agent Definitions**: Aggregates Markdown-based agent definitions from `ai/agents/` directories
- **ETag Caching**: Supports HTTP ETag headers for efficient bandwidth usage
- **Cache Invalidation**: API endpoint to force manifest regeneration
- **Permission-Based Access**: All endpoints protected by VirtoCommerce RBAC
- **AI Assistant blade**: Embeds an external chatbot SPA into the admin UI via iframe (configurable through `appsettings.json`)
