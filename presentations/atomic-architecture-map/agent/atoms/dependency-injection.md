# Dependency injection (Di)

> Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/dependency-injection`

## Pattern

Constructor injection over `IServiceCollection`, with override-by-later-registration. Because modules initialize in dependency order, a module loaded later can replace a service registered earlier simply by registering its own implementation.

## When to use

- **`AddTransient` — a new instance per resolution. Start here.** Stateless services, domain services, handlers: cheap to construct, nothing shared, no thread-safety question to answer. Microsoft says the same — do not reach for singleton just because a service holds no state.
- **`AddScoped` — one instance per request.** Anything that must see one consistent view of the data for the length of a request: `DbContext` (which `AddDbContext` registers as scoped for you), repositories and units of work built on it. A scoped service may only be used **inside** a scope — the implicit per-request one, or an explicit `IServiceScopeFactory.CreateScope()`.
- **`AddSingleton` — one instance for the process.** State that is expensive to build or genuinely global, plus connections and clients: the memory cache, the in-process event bus, `IHttpClientFactory`. Two obligations come with it — it must be thread-safe, and it must hold nothing scoped.
- Work with no request to borrow a scope from — a background job, a hosted service, a startup task — opens its own: `using var scope = provider.CreateScope();`. The platform does exactly this in `BackgroundJob.Enqueue`.
- Replacing a vendor service with your own implementation — register yours in a module that depends on theirs
- Making your own services replaceable by registering against an interface

## Avoid

- Injecting a scoped service into a singleton — a **captive dependency**. The scoped service is promoted to the process lifetime, and the symptom is stale data on a later request rather than an exception
- Resolving a scoped service straight from the root provider. Same outcome: only the root container disposes it, so it lives until shutdown
- Singleton for a service with no state of its own. It buys nothing and costs thread-safety, coupling between requests, harder tests and no configuration reload
- Service locator patterns (`GetRequiredService` in business code) outside `PostInitialize`
- Calling `BuildServiceProvider` while configuring services — take the factory overload that hands you an `IServiceProvider` instead
- Registering a `DbContext` or repository as a singleton — see [Repository & unit of work](repository-uow.md) for why

## API

- `IServiceCollection (module Initialize)` · [src/VirtoCommerce.Platform.Core/Modularity/IModule.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Modularity/IModule.cs)
- `Platform service registrations` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `AddPlatformServices — transient repository, Func<> factory, singleton bus` · [src/VirtoCommerce.Platform.Data/Extensions/ServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Data/Extensions/ServiceCollectionExtensions.cs)
- `IPlatformMemoryCache — registered as a singleton` · [src/VirtoCommerce.Platform.Caching/ServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/ServiceCollectionExtensions.cs)
- `BackgroundJob.Enqueue — CreateScope outside a request` · [src/VirtoCommerce.Platform.Core/Jobs/BackgroundJob.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/BackgroundJob.cs)

## Example

```csharp
// ------------------------------------------------------- 1. pick the lifetime
//
// Transient - a new one per resolution. The default: stateless, cheap, nothing shared.
services.AddTransient<IPriceService, PriceService>();

// Scoped - one per request, for anything needing one consistent view of the data.
// AddDbContext already does this, so the DbContext is scoped whether you say so or not.
services.AddDbContext<AbcDbContext>(options => { /* ... */ });
services.AddScoped<IAbcRepository, AbcRepository>();

// Singleton - one per process. Expensive or genuinely global state, connections, clients.
// Must be thread-safe, and must hold nothing scoped.
services.AddSingleton<IAbcPriceIndex, AbcPriceIndex>();

// One instance behind several interfaces - register the class once and alias the rest,
// or you get one object per interface. This is how the platform exposes InProcessBus.
services.AddSingleton<AbcBus>();
services.AddSingleton<IAbcPublisher>(sp => sp.GetRequiredService<AbcBus>());

// --------------------------------------------- 2. reach a scope from outside one
//
// A job, hosted service or startup task has no request, so it opens its own scope.
// Injecting the scoped service here would capture it for the life of the process.
public class AbcNightlyJob(IServiceProvider provider)
{
    public async Task RunAsync()
    {
        using var scope = provider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IAbcRepository>();
        // ... one unit of work, and the scope disposes the DbContext with it
    }
}

// The platform's idiom for the same need: a factory registered beside the repository,
// so a longer-lived service asks for a fresh one instead of holding one.
//   services.AddTransient<Func<IPlatformRepository>>(provider =>
//       () => provider.CreateScope().ServiceProvider.GetService<IPlatformRepository>());

// ------------------------------------------------ 3. override, do not edit
//
// Your module depends on theirs, so it initializes later and simply registers again.
services.AddTransient<IPriceService, AbcPriceService>();

// Decorating instead of replacing: keep the original as a concrete registration.
services.AddTransient<PriceService>();
services.AddTransient<IPriceService>(sp =>
    new AbcCachingPriceService(sp.GetRequiredService<PriceService>()));
```

## Pitfalls

- Override-by-last-registration is both the extension mechanism and the accident: two modules replacing the same service means load order silently decides, with no warning.
- Registration order across modules follows the manifest dependency graph. If you must load after someone, declare the dependency.
- Keyed services exist in .NET but are unused here — see the Keyed services atom before introducing them.
- Captive dependencies (scoped inside singleton) are the most common lifetime bug and often surface as stale data rather than an exception.
- **Scope validation only runs in Development.** The host verifies that no scoped service is resolved from the root provider or injected into a singleton — and that check is off in production, which is exactly where the same mistake becomes stale data instead of a startup exception.
- The container disposes what it creates, and **when** depends on the lifetime: transient and scoped at the end of their scope, singleton at shutdown. A disposable transient resolved from the root provider is therefore held until shutdown — a leak wearing a lifetime label.
- This platform leans singleton: on `dev` the mix is roughly **91 singleton, 25 transient, 17 scoped**. Almost all of those singletons are caches, buses, registrars and factories — read the ratio as infrastructure, not as a licence for your own services.
- `IPlatformMemoryCache` and `InProcessBus` are singletons, so anything handed to them lives as long as the process. Pass values, not scoped services.
- The platform registers `IPlatformRepository` as **transient** and puts a `Func<IPlatformRepository>` next to it that opens its own scope. Injecting the repository into something longer-lived than a request is what that factory exists to prevent.

## Documentation

- [Extensibility overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Extensibility/overview/)
- [Service lifetimes (Microsoft)](https://learn.microsoft.com/dotnet/core/extensions/dependency-injection/service-lifetimes)
- [DI guidelines (Microsoft)](https://learn.microsoft.com/dotnet/core/extensions/dependency-injection/guidelines)
- [DI in ASP.NET Core (Microsoft)](https://learn.microsoft.com/aspnet/core/fundamentals/dependency-injection)
- [Scope validation (Microsoft)](https://learn.microsoft.com/dotnet/core/extensions/dependency-injection/overview#scope-validation)

## See also

- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [Keyed services](keyed-services.md): .NET keyed DI registrations. The platform uses one internally; modules select providers by registry instead.
- [AbstractTypeFactory](abstract-type-factory.md): The keystone of the extension model: replace any platform or vendor type with your own derived type.
- [Options pattern](options-pattern.md): Strongly typed `appsettings.json` binding — for infrastructure configuration, as opposed to operator settings.
- [Repository & unit of work](repository-uow.md): The data-access boundary: a repository per module, one commit per unit of work.
- [Cache](platform-memory-cache.md): The one caching primitive you will use constantly: in-process memory, keyed, with coordinated invalidation.

## Topic

Part of **Extensibility decision tree**: No-code → API → native. Pick the lowest level that works.
