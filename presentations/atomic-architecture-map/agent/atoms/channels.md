# Channels (Ch)

> In-memory producer/consumer queues from .NET. The platform uses one to buffer the sign-in log.

- Family: Execution & async
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/channels`

## Pattern

Bounded or unbounded in-memory channel with async readers and writers, usually drained by a hosted service. A good fit for in-process pipelines; no persistence and no cross-instance delivery. The platform's use is the example to copy: the sign-in log writer puts each row into a bounded channel with `TryWrite` from the request path, and a background loop writes them to the database in batches.

## When to use

- Smoothing bursts of in-process work where losing the backlog on restart is genuinely acceptable
- Decoupling a fast producer from a slower consumer inside one instance
- Applying backpressure with a bounded channel rather than unbounded memory growth

## Avoid

- Anything that must survive a restart or reach another instance — use background jobs
- Reaching for it before you have a measured in-process bottleneck
- Unbounded channels in request paths: they turn a load spike into an out-of-memory failure

## Use instead

For durable or cross-instance work use `IBackgroundJob`. For a continuous in-process loop use a `BackgroundService`.

## Note

Since 3.1071 the sign-in log is written through a bounded channel, which keeps the database off the sign-in path. Before that release the platform had no `System.Threading.Channels` usage.

## API

- `System.Threading.Channels.Channel<T>` · (.NET base class library)
- `BufferedUserSignInLogWriter (the platform's use)` · [src/VirtoCommerce.Platform.Security/SignInLog/BufferedUserSignInLogWriter.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Security/SignInLog/BufferedUserSignInLogWriter.cs)

## Pitfalls

- A channel is not a queue in the durability sense. Process exit discards everything buffered.
- You still need something to drain it — normally a hosted service, with all of that atom's caveats.
- `TryWrite` only reports a full channel when `FullMode` is `Wait`; every `Drop*` mode returns `true` and discards silently. The sign-in writer uses `Wait` with `TryWrite` for that reason: a full buffer never blocks a sign-in, and each dropped row is counted and logged.

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Hosted service](hosted-service.md): A .NET long-running loop tied to application lifetime — for in-process work no queue should own.
- [Sign-in extensions](sign-in-extensions.md): Extension points a module uses to add a way of signing in, a second factor, or a sign-in method a user manages.
