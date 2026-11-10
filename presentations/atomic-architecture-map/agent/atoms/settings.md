# Settings (St)

> Operator-editable configuration, declared in code and overridable per object — reach for this before appsettings.

- Family: Config & metadata
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/settings`

## Pattern

Declared registry plus a key-value store. A module declares `SettingDescriptor`s as static members of `ModuleConstants`, registers them at startup, and reads them through `ISettingsManager`. Values resolve per object (store, provider) with the declared default as fallback, and the Admin UI renders the editor from the descriptor.

## When to use

- Anything an operator should change without a deploy: thresholds, toggles, cron expressions, provider credentials
- Configuration that differs per store or per provider instance
- Feature flags scoped to a module

## Avoid

- Infrastructure configuration — connection strings and hosting concerns belong in `appsettings.json` and the options pattern
- Secrets operators should not see; use configuration and a secret store
- Reading a setting inside a tight loop without hoisting the value out

## API

- `ISettingsManager` · [src/VirtoCommerce.Platform.Core/Settings/ISettingsManager.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Settings/ISettingsManager.cs)
- `SettingDescriptor` · [src/VirtoCommerce.Platform.Core/Settings/SettingDescriptor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Settings/SettingDescriptor.cs)
- `ISettingsRegistrar.RegisterSettings` · [src/VirtoCommerce.Platform.Core/Settings/ISettingsRegistrar.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Settings/ISettingsRegistrar.cs)
- `SettingsExtension.GetValue<T>` · [src/VirtoCommerce.Platform.Core/Settings/SettingsExtension.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Settings/SettingsExtension.cs)
- `ObjectSettingEntry` · [src/VirtoCommerce.Platform.Core/Settings/ObjectSettingEntry.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Settings/ObjectSettingEntry.cs)

## Example

```csharp
// Module.Core/ModuleConstants.cs — declare once, reference everywhere.
public static class Settings
{
    public static SettingDescriptor ExportPageSize { get; } = new()
    {
        Name = "MyModule.Export.PageSize",
        GroupName = "MyModule|Export",
        ValueType = SettingValueType.Integer,
        DefaultValue = 50,
        IsPublic = false
    };

    public static IEnumerable<SettingDescriptor> AllSettings => [ExportPageSize];
}

// Module.Web/Module.cs — PostInitialize
var registrar = appBuilder.ApplicationServices.GetRequiredService<ISettingsRegistrar>();
registrar.RegisterSettings(ModuleConstants.Settings.AllSettings, ModuleInfo.Id);

// Reading: pass the descriptor, so the name and default cannot drift apart.
var pageSize = await _settingsManager.GetValueAsync<int>(ModuleConstants.Settings.ExportPageSize);

// Per-object override (e.g. per store).
var setting = await _settingsManager.GetObjectSettingAsync(
    ModuleConstants.Settings.ExportPageSize.Name, nameof(Store), storeId);
```

## Pitfalls

- Pass the `SettingDescriptor` to `GetValue`, not a bare string name — the descriptor carries the default, so a typo becomes a compile error instead of a silent zero.
- `RestartRequired = true` tells the Admin UI to warn the operator; it does not restart anything for you.
- A setting declared but never registered simply does not exist at runtime: no error, no editor, and the default is all you ever read.
- Settings can also be declared in `module.manifest`; both paths converge on the same registry, so pick one per setting and stay consistent.
- `IsPublic = true` exposes the value to the storefront — check this before putting anything sensitive in a setting.
- Since 3.1077 a typed read (`GetValue<T>`) with no stored value returns a `DefaultValue` override from configuration. Before that it returned the descriptor default, so the code and the Admin UI could disagree about the same setting. A dictionary setting's override is an array and does not convert, so typed reads of those still fall back to the descriptor default.
- The settings API at `api/platform/settings/v2` reads and writes by scope: `global`, `tenant/{tenantType}/{tenantId}` (a store, for example) and `me`, each with a schema and values. Dictionary settings and tenant scope were added to it in 3.1063.

## Documentation

- [Settings V2](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/06-module-manifest-file/)
- [Manifest settings](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/06-module-manifest-file/)

## See also

- [Dynamic properties](dynamic-properties.md): Add a field to an existing entity without a migration, a code change or a fork. The first thing to try when extending.
- [Options pattern](options-pattern.md): Strongly typed `appsettings.json` binding — for infrastructure configuration, as opposed to operator settings.
- [Recurring jobs](recurring-jobs.md): Cron-scheduled work whose schedule an operator can change without a deploy.
- [Localizations](localizations.md): Translated strings for the Admin UI and localizable entity values, contributed per module.
