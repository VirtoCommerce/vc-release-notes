# Push notifications (Pn)

> Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.

- Family: Messaging & events
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/push-notifications`

## Pattern

Hub plus persisted notification store, with a backplane for scale-out. `IPushNotificationManager.SendAsync` pushes a `PushNotification` to a user's connected clients and stores it so it survives a page reload. A synchroniser task keeps instances in step when scaled out.

## When to use

- Progress and completion for imports, exports, reindexing, module installation
- Anything where the Admin UI would otherwise poll an endpoint
- Per-user notifications that should still be there after a refresh

## Avoid

- High-frequency updates — batch them, or you flood both the hub and the UI
- Using it as an event bus between server components; it is a UI transport
- Assuming delivery. A user with no open browser gets nothing live, only the stored record

## API

- `IPushNotificationManager` · [src/VirtoCommerce.Platform.Core/PushNotifications/IPushNotificationManager.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PushNotifications/IPushNotificationManager.cs)
- `PushNotification` · [src/VirtoCommerce.Platform.Core/PushNotifications/PushNotification.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PushNotifications/PushNotification.cs)
- `IPushNotificationStorage` · [src/VirtoCommerce.Platform.Core/PushNotifications/IPushNotificationStorage.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/PushNotifications/IPushNotificationStorage.cs)
- `PushNotificationSynchronizerTask` · [src/VirtoCommerce.Platform.Web/PushNotifications/Scalability/PushNotificationSynchronizerTask.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/PushNotifications/Scalability/PushNotificationSynchronizerTask.cs)
- `AddSignalR().AddPushNotifications()` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)

## Example

```csharp
// Send a notification to the user who started the work.
await _pushNotificationManager.SendAsync(new MyImportNotification(_userNameResolver.GetCurrentUserName())
{
    Title = "Import products",
    Description = "Processed 500 of 2000 rows"
});

// Scale-out wiring, from Startup.cs — the backplane is what makes this work on N instances:
// services.AddSignalR().AddPushNotifications(Configuration);
```

## Pitfalls

- Scaled out without a Redis or Azure SignalR backplane, notifications reach only the instance that sent them — so progress appears to stall at random for half your users.
- Notifications are keyed to a user. Getting the current user wrong means the update goes to nobody visible.
- The stored history is what the UI shows after a reload; a notification that was only pushed live effectively disappears.

## Documentation

- [Scale out on Azure](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Scalability/scaling-configuration-on-azure-cloud/)

## See also

- [Job progress](job-progress.md): Reporting how far a long job has got, so the UI can show it instead of spinning.
- [Redis cache bus](redis-cache-bus.md): Keeps per-instance memory caches coherent across a cluster. It stores invalidation messages, not cached values.
- [Current user & tenancy](current-user.md): Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.
- [Hosted service](hosted-service.md): A .NET long-running loop tied to application lifetime — for in-process work no queue should own.

## Topic

Part of **Observability**: Knowing what production is doing before a customer tells you.
