# Resilience (Polly) (Re)

> Retry, circuit-breaker and timeout policies. The package is referenced but the platform has no call sites.

- Family: Infra & ops
- Adoption: **Available**. .NET offers it; this platform does not use it.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/resilience`

## Pattern

Resilience pipeline around an outbound call, usually attached to a typed `HttpClient`. Polly 8 composes retry, circuit-breaker, timeout and hedging strategies into one pipeline.

## When to use

- Calls to a flaky external dependency where a retry genuinely helps
- Protecting yourself from a failing dependency with a circuit breaker rather than piling up requests
- Enforcing a hard timeout the remote side does not honour

## Avoid

- Retrying non-idempotent operations — a retried payment is worse than a failed one
- Retrying inside a request handler without a budget; you multiply load on an already-struggling dependency
- Assuming a platform convention exists. There is none to follow yet

## Note

Grep across `src/` finds no `Polly`, `ResiliencePipeline` or `AddResilienceHandler` usage in code — the only trace is a `PackageReference` in `VirtoCommerce.Platform.Caching.csproj`. Treat it as available rather than adopted, and do not assume behaviour you did not configure yourself.

## API

- `Polly 8.7.0 (package reference)` · [src/VirtoCommerce.Platform.Caching/VirtoCommerce.Platform.Caching.csproj](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Caching/VirtoCommerce.Platform.Caching.csproj)
- `AddResilienceHandler` · (.NET — no platform usage)

## Pitfalls

- Retry plus a long timeout multiplies worst-case latency. Budget the whole pipeline, not each step.
- A circuit breaker changes failure semantics: callers start failing fast, which is correct and surprising if nobody expected it.
- Because there is no platform precedent, whatever you configure becomes your solution's convention. Document it.

## See also

- [HTTP client](http-client.md): Outbound HTTP the correct way — factory-managed clients, never a `new HttpClient` per call.
- [Health checks](health-checks.md): A `/health` endpoint that already checks modules, cache, Redis and the database — extend it, do not reinvent it.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
