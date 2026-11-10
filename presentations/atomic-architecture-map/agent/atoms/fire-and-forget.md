# Fire & forget (FF)

> Start work and move on without waiting for the result — durably, so it survives the request that started it.

- Family: Execution & async
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/fire-and-forget`

## Pattern

Enqueue-and-continue. You await the *enqueue*, not the work: `IBackgroundJob.Enqueue` hands the payload to the engine and returns a job id immediately, so the caller is not blocked by however long the work takes. The durability is what separates this from simply not awaiting a `Task`.

## When to use

- Work the caller genuinely should not wait for: sending a confirmation email, warming a cache, notifying a downstream system
- Keeping a request fast when the slow part does not affect the response
- Reacting to an event where the handler must not extend the publisher's transaction

## Avoid

- `Task.Run` or an un-awaited `Task` for real work — the request ends, the DI scope is disposed, and unobserved exceptions vanish silently
- Anything whose result the caller needs. Fire-and-forget means you have given up the answer, not just the wait
- Assuming ordering between two things you fired. There is none
- Firing something and never surfacing its failure — give it a notification, a log, or a status the operator can see

## API

- `IBackgroundJob.Enqueue` · [src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJob.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IBackgroundJob.cs)
- `BackgroundJob (static facade)` · [src/VirtoCommerce.Platform.Core/Jobs/BackgroundJob.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/BackgroundJob.cs)
- `EnqueueOptions` · [src/VirtoCommerce.Platform.Core/Jobs/EnqueueOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/EnqueueOptions.cs)

## Example

```csharp
// ✓ Durable fire-and-forget: await the enqueue, not the work.
public class OrderService(IBackgroundJob backgroundJob)
{
    public async Task Place(CustomerOrder order)
    {
        await Save(order);

        // Returns as soon as the job is queued. The email send happens on a worker,
        // survives a restart, and retries on failure.
        await backgroundJob.Enqueue<SendOrderEmailJob>(
            new SendOrderEmailPayload { OrderId = order.Id });
    }
}

// ✕ Not fire-and-forget so much as fire-and-lose: the scope dies with the request,
//   nothing retries, and an exception here is never observed by anyone.
_ = Task.Run(() => _service.SendEmail(order.Id));

// ~ Static facade — works, but ambient and awkward to test. It is a migration aid
//   for code moving off Hangfire's static API; prefer injecting IBackgroundJob.
await BackgroundJob.Enqueue<SendOrderEmailJob>(payload);
```

## Pitfalls

- `Task.Run` inside a request competes for the same thread pool that serves requests, so it degrades latency precisely when you are busiest.
- The static `BackgroundJob` facade is not deprecated, but it is documented in its own source as a migration aid rather than an API to build on. It only works once an engine module has called `BackgroundJob.Initialize`, and it opens a fresh DI scope per call rather than inheriting the caller's.
- The enqueuing user flows into the job's scope via `IHttpContextAccessor`, so audit fields survive the hand-off — one of the few pieces of ambient context that does.
- Fire-and-forget hides failures by construction. Pair it with a push notification or a visible job status, or nobody learns the email never went.

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Hangfire](hangfire.md): Referencing Hangfire directly is the legacy path. It is now one selectable engine behind the background-jobs port, not the platform's job system.
- [Hosted service](hosted-service.md): A .NET long-running loop tied to application lifetime — for in-process work no queue should own.
- [Push notifications](push-notifications.md): Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.

## Topic

Part of **Background processing hub**: The in-flight extraction of the job engine behind one port.
