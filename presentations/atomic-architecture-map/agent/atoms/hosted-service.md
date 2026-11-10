# Hosted service (Hs)

> A .NET long-running loop tied to application lifetime — for in-process work no queue should own.

- Family: Execution & async
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/hosted-service`

## Pattern

Hosted service. Derive from `BackgroundService`, override `ExecuteAsync`, and let the host start and stop it with the application. The platform uses exactly this for periodic in-memory synchronisation work.

## When to use

- Continuous in-process work: polling a channel, syncing in-memory state, keeping a connection warm
- Startup work that must run once per instance rather than once per cluster
- Intervals too short to be a cron job

## Avoid

- Work that must not be lost — a hosted service dies with its instance and has no retry
- Work that should run once cluster-wide; every instance runs its own copy
- Anything an operator needs to trigger, monitor or cancel — that is a background job

## API

- `BackgroundService` · [src/VirtoCommerce.Platform.Web/PushNotifications/Scalability/PushNotificationSynchronizerTask.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/PushNotifications/Scalability/PushNotificationSynchronizerTask.cs)
- `services.AddHostedService<T>()` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)

## Example

```csharp
// The platform's own example: src/VirtoCommerce.Platform.Web/PushNotifications/
//   Scalability/PushNotificationSynchronizerTask.cs
public class MySynchronizerTask(IMyService service) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await service.Synchronize(stoppingToken);
            }
            catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
            {
                // Never let one iteration kill the loop for the rest of the process lifetime.
                _logger.LogError(ex, "Synchronisation iteration failed");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
```

## Pitfalls

- An unhandled exception in `ExecuteAsync` stops the service silently for the rest of the process lifetime. Wrap the body of the loop, not just the outside.
- `BackgroundService` is a singleton — resolve scoped services by creating a scope per iteration, never by injecting them into the constructor.
- Shutdown gives you a limited grace period. Honour `stoppingToken` or deploys become forced kills.
- Every instance runs it, so N instances mean N copies. Add a distributed lock if that is not acceptable.

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Cancellation](cancellation.md): Threading a cancellation signal all the way down — and the obsolete shim you will still meet in older code.
- [Distributed lock](distributed-lock.md): Cluster-wide mutual exclusion on Redis, and an in-process lock on a single instance — the same interface either way.
- [Push notifications](push-notifications.md): Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.
