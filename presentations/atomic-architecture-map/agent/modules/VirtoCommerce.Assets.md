# Assets Management (`VirtoCommerce.Assets`)

> Common abstractions for asset search, retrieval, and manipulation, making it easy for developers to work with assets regardless of their underlying storage location.

- Latest version: 3.1012.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-assets
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.Assets`

## For business analysts

Every file the store holds — product images, videos, documents, downloads — described and findable, wherever it is physically stored.

## For architects

**The most depended-on module in the catalogue: 22 modules require it, and it requires nothing.** That is the definition of a base module. Storage is an adapter — FileSystemAssets for a developer box, AzureBlobAssets for a cluster — so the same solution runs on a local disk and on cloud storage without a code change. It owns one entity: the asset *entry*, the metadata record. The bytes are never in the database, which is why a deployment copies files and a migration does not.

## For developers

Go through the blob abstraction rather than a storage SDK, or your module stops working on the other provider. `BlobCreatedEvent` and `BlobDeletedEvent` are the hooks — image processing and cache invalidation both hang off them. Asset entries are searchable metadata; the file itself is addressed by URL.

## Use it when

- A module needs to store or serve a file and must not care where it lives
- You are adding a storage backend, or moving from local disk to cloud storage
- File metadata has to be searchable or linked to a domain object

## Do not use it when

- You are writing to a container directly — that breaks the other provider and the local developer setup
- The content is editorial pages or themes: those are Content, which itself sits on top of this
- You expect files to travel with a database backup — they do not

## Owns these entities

- `AssetEntryEntity`

## REST controllers

- `api/assetentries` · 4 actions · [vc-module-assets/src/VirtoCommerce.AssetsModule.Web/Controllers/AssetEntryController.cs](https://github.com/VirtoCommerce/vc-module-assets/blob/dev/src/VirtoCommerce.AssetsModule.Web/Controllers/AssetEntryController.cs)
- `api/assets` · 5 actions · [vc-module-assets/src/VirtoCommerce.AssetsModule.Web/Controllers/AssetsController.cs](https://github.com/VirtoCommerce/vc-module-assets/blob/dev/src/VirtoCommerce.AssetsModule.Web/Controllers/AssetsController.cs)

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 7.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Images, video & documents** (Product data): Rich media on products, stored wherever the deployment keeps files.
- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.

## Key features

- Upload files
- Read files
- Search files

## Documentation

- [Assets module user documentation](https://docs.virtocommerce.org/platform/user-guide/assets/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Assets)
- [Assets management providers configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#assets)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-assets/)
