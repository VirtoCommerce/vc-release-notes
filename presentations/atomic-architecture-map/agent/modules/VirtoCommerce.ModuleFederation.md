# Frontend Modules Registry (`VirtoCommerce.ModuleFederation`)

> Provides API endpoint for dynamic frontend module discovery via Module Federation. Replaces static apps.json.

- Latest version: 3.1000.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/frontend-modules
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.ModuleFederation`

## For business analysts

The registry that lets independently built front-end modules load into one admin application at runtime.

## For architects

No dependencies, one entity, four migrations — and it lives in the `frontend-modules` repository, which is why its registry ProjectUrl redirects. It is the back-end half of the admin UI's Module Federation setup.

## For developers

Register a remote and the shell loads it at runtime; version skew between shell and remote is the failure mode to design against. Pair it with the platform's Module federation atom.

## Use it when

- The back office must be extended by separately deployed front-end modules
- Teams need to ship UI without rebuilding the shell
- A remote's version has to be recorded rather than assumed

## Do not use it when

- A single, monolithic admin build is acceptable — this adds moving parts
- The extension is server-side: this is front-end composition
- Shell and remote cannot be kept version-compatible

## Owns these entities

- `FrontendModuleAssignmentEntity`

## REST controllers

- `api` · 4 actions · (frontend-modules/src/VirtoCommerce.ModuleFederation.Web/Controllers/Api/ModuleFederationController.cs)

## Permissions

- `frontend-modules:access`
- `frontend-modules:read`
- `frontend-modules:update`

## Database

Providers: SqlServer, PostgreSql. Migrations: 4.

## Business features it serves

- **Extendable back office** (Integration & operations): Teams add their own back-office screens without rebuilding the application.
