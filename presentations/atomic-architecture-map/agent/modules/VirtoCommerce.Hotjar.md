# Hotjar (`VirtoCommerce.Hotjar`)

> Allows to assign Hotjar Site Id for a Store and get insights about the shopping behaviour of your users with Heatmaps, Recordings, Feedback and etc.

- Latest version: 3.1003.0 (needs platform 3.1007.10)
- Repository: https://github.com/VirtoCommerce/vc-module-hotjar
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.Hotjar`

## For business analysts

Session recording and heatmaps, so someone can watch how shoppers actually behave.

## For architects

A thin bridge: one dependency, three settings, no storage. Its footprint is a script on the storefront, which makes it a privacy decision more than an architectural one.

## For developers

Recording sessions captures whatever is on screen — mask fields before enabling it, and treat this as personal-data processing.

## Use it when

- UX questions need observation rather than numbers
- A funnel drop-off has no obvious cause
- Marketing wants heatmaps

## Do not use it when

- Consent and masking have not been designed
- You need aggregate metrics — analytics is cheaper and less invasive
- The question is server-side: this sees only the browser

## Required modules

- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0

## REST controllers

- `api/hotjar` · 2 actions · [vc-module-hotjar/src/VirtoCommerce.Hotjar.Web/Controllers/Api/HotjarController.cs](https://github.com/VirtoCommerce/vc-module-hotjar/blob/dev/src/VirtoCommerce.Hotjar.Web/Controllers/Api/HotjarController.cs)

## Permissions

- `Hotjar:access`

## Settings

- `Hotjar.EnableTracking`
- `Hotjar.SiteId`
- `Hotjar.SnippetVersion`

## Business features it serves

- **Session recordings & heatmaps** (Marketing & loyalty): Watch how shoppers actually behave, instead of arguing about it.

## Documentation

- [Hotjar](https://www.hotjar.com/)
- [Module Documentation](https://docs.virtocommerce.org/modules/hotjar/)
