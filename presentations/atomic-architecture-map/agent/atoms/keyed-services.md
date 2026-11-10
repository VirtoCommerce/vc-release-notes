# Keyed services (Kd)

> .NET keyed DI registrations. The platform uses one internally; modules select providers by registry instead.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/keyed-services`

## Pattern

Register several implementations of one interface under distinct keys and resolve by key. The platform does this in one place: the startup lock is a second `IDistributedLock` registered under a key, with a longer Redis lease for migrations, while everything else resolves the unkeyed one. For provider selection the Virto convention is still a registry or a factory chosen by configuration, as search providers and job engines do.

## When to use

- Rarely, inside a single module that genuinely needs several implementations of one interface side by side
- Only after checking how the surrounding code selects providers, so you stay consistent with it

## Avoid

- Using keys where the platform would use a registry — you break the pattern other developers expect
- Keying a service other modules should be able to override; keyed registrations do not participate in override-by-last-registration
- Introducing it into a shared contract; consumers then need to know your keys

## Use instead

For choosing between providers, follow the provider-registry pattern: one active implementation selected by configuration, exactly as search providers and background-job engines are chosen.

## Note

Until 3.1073 the platform had no keyed registrations. It now registers the startup lock under the key `VirtoCommerce.Platform.Startup`, an internal detail: module code resolves the unkeyed `IDistributedLock`. Keyed services remain unusual here, and they interact badly with the override convention modules rely on.

## API

- `AddKeyedScoped / AddKeyedSingleton` · (.NET)
- `[FromKeyedServices]` · (.NET)
- `Keyed startup lock (the platform's use)` · [src/VirtoCommerce.Platform.Web/Redis/ServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Redis/ServiceCollectionExtensions.cs)

## Pitfalls

- A keyed registration is not replaced by a later unkeyed one, so a module trying to override your service will appear to succeed and change nothing.
- Keys are strings or objects with no compile-time relationship to the consumer — the failure mode is a resolution exception at runtime.
- The platform's own keyed service is a variant of a service that also has an unkeyed registration. That shape is safe for consumers who never ask for the key; keying the only registration of a service is not.

## See also

- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
- [Module lifecycle](module-lifecycle.md): The two methods every module implements, and why the difference between them matters.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
