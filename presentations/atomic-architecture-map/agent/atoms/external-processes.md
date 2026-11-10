# External tool processes (Xp)

> Launching an external command-line tool from the platform, portably across Windows and Linux.

- Family: Config & metadata
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/external-processes`

## Pattern

Descriptor plus fluent builder. `ProcessSettings` captures the tool name, path, working directory, environment variables and arguments; `GetFullPathTool()` resolves the executable per OS, so the same registration works on Windows and Linux containers.

## When to use

- Wrapping a real command-line tool you must shell out to — PDF renderers, image processors, converters
- Tools shipped alongside the app under the configured processes path
- Anywhere you were about to hand-roll `Process.Start` with a hardcoded `.exe`

## Avoid

- Work a library could do in-process; a subprocess is a deployment dependency and a security surface
- Passing unvalidated user input as arguments — that is command injection
- Long-running tools in a request. Shell out from a background job instead

## API

- `ProcessSettings` · [src/VirtoCommerce.Platform.Core/ProcessSettings/ProcessSettings.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ProcessSettings/ProcessSettings.cs)
- `ProcessSettingsExtensions` · [src/VirtoCommerce.Platform.Core/ProcessSettings/ProcessSettingsExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ProcessSettings/ProcessSettingsExtensions.cs)
- `PlatformOptions.ProcessesPath` · [src/VirtoCommerce.Platform.Core/PlatformOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PlatformOptions.cs)

## Example

```csharp
// Fluent configuration; ToolPath defaults from PlatformOptions.ProcessesPath.
var settings = myProcessSettings
    .SetToolPath("tools/wkhtmltopdf")
    .SetWorkingDirectory(workDir)
    .SetArguments(["--quiet", inputPath, outputPath]);

// GetFullPathTool() resolves the executable for the current OS.
var executable = settings.GetFullPathTool();
```

## Pitfalls

- Despite the name, this has nothing to do with application configuration — it configures *external processes*. Do not confuse it with settings or options.
- The tool must actually be present in the container image; a working local build proves nothing about deployment.
- Argument arrays avoid one class of quoting bug but not injection. Validate anything user-supplied.

## Documentation

- [Generate a PDF file](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/generating-pdfs/)

## See also

- [Options pattern](options-pattern.md): Strongly typed `appsettings.json` binding — for infrastructure configuration, as opposed to operator settings.
- [File operations](file-operations.md): Rollbackable file-system operations and zip handling. Blob and asset storage is a module, not platform core.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
