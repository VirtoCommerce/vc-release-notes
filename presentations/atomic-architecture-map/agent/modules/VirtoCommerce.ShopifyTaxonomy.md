# Shopify Taxonomy Importer (`VirtoCommerce.ShopifyTaxonomy`)

> Importing Shopify's Standard Product Taxonomy into Virto Commerce catalog

- Latest version: 3.1002.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-shopify-taxonomy
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.ShopifyTaxonomy`

## For business analysts

Fills a new catalog with Shopify's Standard Product Taxonomy: its categories, product attributes, the allowed values for them and their translations. A catalog starts from a widely used classification instead of an empty tree.

## For architects

A one-time import into Catalog, its only dependency. It reads the taxonomy from the file at `ShopifyTaxonomy.ShopifyTaxonomyFileUrl`, Shopify's published distribution by default, in the languages listed in `ShopifyTaxonomy.ShopifyTaxonomyLanguagesCodes`. It keeps no tables; what it creates are ordinary catalog categories, properties and dictionary values, owned by Catalog from then on.

## For developers

It is started from the catalog's Import menu in the back office. Shopify attributes become catalog properties and their values become dictionary values, which products then use like any other property.

## Use it when

- Setting up a new catalog with no existing classification
- Products that will also be listed on channels that use Shopify's taxonomy

## Do not use it when

- A catalog that already has its own category tree and properties. The import adds Shopify's structure; it does not map yours onto it
- A specialist B2B assortment that a general retail taxonomy does not describe well

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1051.0

## REST controllers

- `api/shopify-taxonomy` · 1 actions · [vc-module-shopify-taxonomy/src/VirtoCommerce.ShopifyTaxonomy.Web/Controllers/Api/ShopifyTaxonomyController.cs](https://github.com/VirtoCommerce/vc-module-shopify-taxonomy/blob/dev/src/VirtoCommerce.ShopifyTaxonomy.Web/Controllers/Api/ShopifyTaxonomyController.cs)

## Settings

- `ShopifyTaxonomy.ShopifyTaxonomyFileUrl`
- `ShopifyTaxonomy.ShopifyTaxonomyLanguagesCodes`

## Business features it serves

- **Catalog started from Shopify’s taxonomy** (Product data): A new catalog gets a widely used category tree, attributes and allowed values instead of an empty one.
