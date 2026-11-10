# Localizations (Lz)

> Translated strings for the Admin UI and localizable entity values, contributed per module.

- Family: Config & metadata
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/localizations`

## Pattern

Provider aggregation. Each module ships JSON localization files; `ITranslationService` merges every provider's data per language and reports the installed languages. Separately, `LocalizableSetting` and `ILocalizedItemService` handle per-language *data* values rather than UI strings.

## When to use

- Any Admin UI string a module contributes — never hardcode display text
- Entity values that differ per language: status names, category labels, dictionary items
- Adding a new language to an existing deployment

## Avoid

- Concatenating translated fragments; grammar differs between languages and the result is unlocalizable
- Using UI translations for data that belongs to an entity — those are different mechanisms
- Assuming a key exists in every language. Missing keys fall back, and the fallback is visible

## API

- `ITranslationService` · [src/VirtoCommerce.Platform.Core/Localizations/ITranslationService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Localizations/ITranslationService.cs)
- `ITranslationDataProvider` · [src/VirtoCommerce.Platform.Core/Localizations/ITranslationDataProvider.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Localizations/ITranslationDataProvider.cs)
- `ILocalizedItemService` · [src/VirtoCommerce.Platform.Core/Localizations/ILocalizedItemService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Localizations/ILocalizedItemService.cs)
- `LocalizableSetting` · [src/VirtoCommerce.Platform.Core/Settings/LocalizableSetting.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Settings/LocalizableSetting.cs)
- `TranslationOptions` · [src/VirtoCommerce.Platform.Core/Localizations/TranslationOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Localizations/TranslationOptions.cs)

## Example

```json
// Module.Web/Localizations/en.MyModule.json — merged with every other module's file.
{
  "MyModule": {
    "blades": {
      "list": { "title": "My entities" }
    },
    "settings": {
      "MyModule.Export.PageSize": {
        "title": "Export page size",
        "description": "Rows per export batch"
      }
    }
  }
}
```

## Pitfalls

- Localization files load at runtime from the module's deployed folder, so editing them in the source tree does not change a running instance until the assets are deployed.
- Two modules using the same top-level key merge into each other. Namespace by module id.
- Setting descriptors are localized by their `Name` — rename a setting and every translation for it silently detaches.
- `ILocalizedItemService` (entity data) and `ITranslationService` (UI strings) are unrelated despite sounding alike.

## See also

- [Settings](settings.md): Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.

## Topic

Part of **Multi-store & multi-region**: One environment, many brands, many regions.
