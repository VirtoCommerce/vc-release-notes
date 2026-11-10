# File Experience API (`VirtoCommerce.FileExperienceApi`)

> Manages all file-related operations, from file upload to file content download for different client applications.

- Latest version: 3.1008.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-file-experience-api
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.FileExperienceApi`

## For business analysts

Uploading and fetching files from a storefront — order attachments, quote documents, customer uploads.

## For architects

One schema builder over Assets, with permissions of its own: it exists so a storefront can handle files without exposing the back-office asset API. Two dependencies, no storage.

## For developers

Uploads are scoped and permissioned here; the bytes still land in whichever blob provider is installed. Validate size and type at this edge rather than downstream.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0

## REST controllers

- `api/files` · 2 actions · [vc-module-file-experience-api/src/VirtoCommerce.FileExperienceApi.Web/Controllers/Api/FileUploadController.cs](https://github.com/VirtoCommerce/vc-module-file-experience-api/blob/dev/src/VirtoCommerce.FileExperienceApi.Web/Controllers/Api/FileUploadController.cs)

## GraphQL builders

- [vc-module-file-experience-api/src/VirtoCommerce.FileExperienceApi.Data/Queries/OptionsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-file-experience-api/blob/dev/src/VirtoCommerce.FileExperienceApi.Data/Queries/OptionsQueryBuilder.cs)

## Permissions

- `FileExperienceApi:access`
- `FileExperienceApi:create`
- `FileExperienceApi:delete`
- `FileExperienceApi:read`
- `FileExperienceApi:update`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **File uploads from the storefront** (Content & experience): Customers attach documents to orders and quotes, and get them back later.

## Key features

- **Isolation:** File upload operations are scoped, allowing for defined settings and isolation from mutations. The process involves uploading files to blob storage and then manipulating them via XAPI, creating the Xapi.FileUpload module.
- **Intuitive Developer Experience:** The file upload process supports different upload processes with customizable validation rules, such as file extensions, count, size limits, and antivirus scanning. Developers can access core validation settings by scope for client-side validation.
- **Extensible Post Processing:** File upload process supports post-processing actions like AI integration, leveraging a pipelines architecture for extensibility.
- **Ready to Use with Client Applications:** XAPI supports file usage with mutations and queries, enabling seamless integration with client applications.
- **Security:** Anonymous file uploads are disabled by default, ensuring a security-first approach. Clean answers are provided for security inquiries.

## Documentation

- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/File/getting-started/)
- [GraphQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/File/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-file-experience-api)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
