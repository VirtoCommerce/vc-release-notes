# Sanity (`VirtoCommerce.Sanity`)

> Integration module for Sanity CMS

- Latest version: 3.1004.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-sanity
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.Sanity`

## For business analysts

Content authored in Sanity, delivered to a Virto storefront.

## For architects

The third CMS bridge: no storage, one dependency plus one optional, five permissions. Three bridges exist because content ownership is a business decision, not a technical one.

## For developers

Sanity's GROQ queries and schema live in Sanity; keep the mapping thin so a CMS change does not become a platform release.

## Use it when

- Sanity is the content system of record
- Editors need structured content with their own workflow
- Content serves more channels than commerce

## Do not use it when

- Only this storefront consumes the content
- You are choosing a CMS: this module assumes the choice is made
- Commerce data would end up duplicated in the CMS

## Required modules

- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0

## Optional modules

- [Virto Pages](VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`) ≥ 3.1004.0

## REST controllers

- `api/pages/sanity` · 1 actions · [vc-module-sanity/src/VirtoCommerce.Sanity.Web/Controllers/Api/SanityController.cs](https://github.com/VirtoCommerce/vc-module-sanity/blob/dev/src/VirtoCommerce.Sanity.Web/Controllers/Api/SanityController.cs)

## Permissions

- `sanity:access`
- `sanity:create`
- `sanity:delete`
- `sanity:read`
- `sanity:update`

## Business features it serves

- **Content from an external CMS** (Content & experience): Editors keep working in the CMS the business already owns.
