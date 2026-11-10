# Azure Blob Storage Assets Provider (`VirtoCommerce.AzureBlobAssets`)

> Provide integration with Azure Blob Storage for Assets Management

- Latest version: 3.1009.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-azureblob-assets
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AzureBlobAssets`

## For business analysts

File storage in Azure Blob Storage, so images and documents live in the cloud rather than on a disk.

## For architects

The Assets adapter for clustered deployments: shared storage is what lets several instances serve the same files. One dependency, no schema, configuration only.

## For developers

Go through the blob abstraction, not the Azure SDK, or your module stops working on the file-system provider. CDN in front of the container is the usual pairing.

## Use it when

- The deployment has more than one instance and files must be shared
- Storage should scale and be backed up independently of the database
- A CDN will serve assets

## Do not use it when

- A single-instance developer setup — the file-system provider is simpler
- You are writing to the container directly from module code
- Files must be transactional with database writes: they are not

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.

## Documentation

- [Azure Blob Assets module user documentation](https://docs.virtocommerce.org/platform/user-guide/azure-blob-storage/overview/)
- [Assets management](https://docs.virtocommerce.org/platform/user-guide/assets/managing-assets/)
- [Assets storage configuration](http://localhost/platform/developer-guide/Configuration-Reference/appsettingsjson/#assets)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.AzureBlobAssets)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-azureblob-assets)
