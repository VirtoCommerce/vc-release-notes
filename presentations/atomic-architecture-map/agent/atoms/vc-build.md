# vc-build CLI (Cb)

> The official CLI for building, packaging, installing and releasing a Virto solution — and for making installs reproducible.

- Family: Modularity
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: modules
- Verified against platform 3.1096.0
- On the map: `#/atom/vc-build`

## Pattern

Target-based build automation over nuke.build, plus a lockfile. `vc-package.json` records the platform and module versions a solution needs, so the same command produces the same environment on a laptop and on a build server. `Install` and `Update` maintain that file for you.

## When to use

- Standing up or updating an environment: `Install`, `Update`, `InstallPlatform`, `InstallModules`
- Packaging for deployment: `Compress`, `Pack`, `Publish`
- Release and hotfix flow: `StartRelease` / `CompleteRelease`, `StartHotfix` / `CompleteHotfix`
- CI pipelines — the same targets you run locally, so the build is not a second implementation

## Avoid

- Hand-copying module folders between environments; that is what `vc-package.json` and `Install` exist to replace
- Editing `vc-package.json` by hand when a command maintains it
- Letting local and CI use different build steps — both should call the same targets

## Note

Not a platform module but a .NET global tool (`VirtoCommerce.GlobalTool`), powered by nuke.build. It carries the install-separately badge for the same reason a module does: it is not in the platform, and nothing happens until you add it.

## API

- `dotnet tool install VirtoCommerce.GlobalTool -g` · (NuGet package id — installs the vc-build global tool)
- `Install · Update · Uninstall · InstallPlatform · InstallModules` · (package-management targets)
- `Clean · Restore · Compile · Test · Publish · Compress · Pack · WebPackBuild` · (build targets)
- `StartRelease · CompleteRelease · QuickRelease · StartHotfix · CompleteHotfix` · (release targets)
- `vc-package.json` · (records platform + module versions for reproducible installs)

## Example

```bash
# Install once, globally.
dotnet tool install VirtoCommerce.GlobalTool -g

# Stand up an environment from the lockfile — same result on a laptop and in CI.
vc-build Install

# Or pin pieces explicitly; both commands update vc-package.json for you.
vc-build Install -platform
vc-build Update

# Package a module for deployment.
vc-build Compress

# Release flow, rather than hand-tagging.
vc-build StartRelease
vc-build CompleteRelease
```

## Pitfalls

- `vc-package.json` is the reproducibility contract. Commit it, or "works on my machine" turns into a version-drift hunt.
- Module versions resolve through caret SemVer ranges, so an unpinned range can move under you between two runs of the same command.
- The tool is versioned independently of the platform; an old global tool against a new platform is a common source of confusing install failures.
- Targets compose, so a CI job can call `Compile` then `Test` then `Compress` rather than scripting each step itself.

## Documentation

- [CLI overview](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/overview/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/getting-started/)
- [Package management](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/package-management/)
- [Install & update platform and modules](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/install-and-update-platform-and-modules/)
- [Build automation](https://docs.virtocommerce.org/platform/developer-guide/latest/CLI-tools/build-automation/)
- [vc-build (GitHub)](https://github.com/VirtoCommerce/vc-build)

## See also

- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.

## Topic

Part of **Development process + roles**: Who does what, and the path from ticket to production.
