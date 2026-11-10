# Contentful (`VirtoCommerce.Contentful`)

> Integration for contentful.com.

- Latest version: 3.1002.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-contentful
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.Contentful`

## For business analysts

Content authored in Contentful and delivered to a Virto storefront.

## For architects

A CMS bridge with two entities and no migrations over four dependencies and one optional. The registry has no ProjectUrl for it, so its repository link is derived rather than read.

## For developers

Content stays in Contentful; this module maps and fetches. Cache deliberately — an editor expects changes to appear, and the CMS bills per request.

## Use it when

- Editorial teams already work in Contentful
- Content must be shared with channels beyond commerce
- The CMS is the system of record and should stay that way

## Do not use it when

- Content is only used by this storefront — the Content module is simpler
- You expect commerce data to live in the CMS: it should not
- Offline or air-gapped deployments

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1000.0
- [Content](VirtoCommerce.Content.md) (`VirtoCommerce.Content`) ≥ 3.1000.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1000.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0

## Optional modules

- [Virto Pages](VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`) ≥ 3.1004.0

## Owns these entities

- `LocalizedPageEntity`
- `ProductEntity`

## REST controllers

- `api/contentful` · 1 actions · [vc-module-contentful/src/VirtoCommerce.Contentful.Web/Controllers/Api/ContentfulController.cs](https://github.com/VirtoCommerce/vc-module-contentful/blob/dev/src/VirtoCommerce.Contentful.Web/Controllers/Api/ContentfulController.cs)
- `api/pages/contentful` · 1 actions · [vc-module-contentful/src/VirtoCommerce.Contentful.Web/Controllers/Api/PagesContentfulController.cs](https://github.com/VirtoCommerce/vc-module-contentful/blob/dev/src/VirtoCommerce.Contentful.Web/Controllers/Api/PagesContentfulController.cs)

## Business features it serves

- **Content from an external CMS** (Content & experience): Editors keep working in the CMS the business already owns.

## Documentation

- [setting up page model](https://user-images.githubusercontent.com/1566470/27984254-f057f266-6385-11e7-9a1a-fec1bfe67439.png)
- [Create page in Contentful](https://user-images.githubusercontent.com/330693/211509494-82cbbd40-842f-46e3-b314-1362cfba9a2a.png)
- [image](https://user-images.githubusercontent.com/1566470/27984281-a87f280a-6386-11e7-8543-74b0e0e20091.png)
