# File Systems Assets Provider (`VirtoCommerce.FileSystemAssets`)

> Provide integration with File Systems for Assets Management

- Latest version: 3.1006.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-filesystem-assets
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.FileSystemAssets`

## For business analysts

File storage on the local disk of the server.

## For architects

The simplest Assets adapter and the reason a developer can run the platform with no cloud account. In a scaled-out deployment it is a trap: each instance sees its own disk.

## For developers

Fine for local work and single-instance demos. The moment a second instance appears, move to blob storage — the abstraction means that is a configuration change.

## Use it when

- Local development, CI, or a genuinely single-instance install
- You want no external storage dependency

## Do not use it when

- Any deployment with more than one instance
- Files must survive a container restart
- You need a CDN in front of assets

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.

## Documentation

- [File System Assets module user documentation](https://docs.virtocommerce.org/platform/user-guide/file-system/overview/)
- [Assets management](https://docs.virtocommerce.org/platform/user-guide/assets/managing-assets/)
- [Assets storage configuration](http://localhost/platform/developer-guide/Configuration-Reference/appsettingsjson/#assets)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.FileSystemAssets)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-filesystem-assets)
