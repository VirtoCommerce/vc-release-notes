# Domain events (Ev)

> The preferred way for modules to react to each other without depending on each other.

- Family: Messaging & events
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/domain-events`

## Pattern

In-process publish/subscribe with a changing/changed pair. A service publishes a `…ChangingEvent` before committing and a `…ChangedEvent` after; handlers implement `IEventHandler<T>`. `GenericChangedEntry<T>` carries old and new state plus an `EntryState`, so a handler can tell an add from an update.

## When to use

- Reacting to another module's data changes — the "reacts to" relationship, and the one to prefer
- Cache invalidation after a write
- Validation or veto before a write, using the changing event
- Anything you would otherwise achieve by calling into a module that should not know about you

## Avoid

- Long or blocking work in a handler; publishing is in-process and synchronous, so you are extending the caller's transaction time
- Assuming ordering between handlers of the same event
- Relying on a changed event for durability. It is in-process — a crash loses it. Enqueue a job for work that must happen

## API

- `IEventPublisher` · [src/VirtoCommerce.Platform.Core/Events/IEventPublisher.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/IEventPublisher.cs)
- `IEventHandler<T>` · [src/VirtoCommerce.Platform.Core/Events/IEventHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/IEventHandler.cs)
- `GenericChangedEntryEvent<T>` · [src/VirtoCommerce.Platform.Core/Events/GenericChangedEntryEvent.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/GenericChangedEntryEvent.cs)
- `GenericChangedEntry<T>` · [src/VirtoCommerce.Platform.Core/Events/GenericChangedEntry.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/GenericChangedEntry.cs)
- `EventSuppressor` · [src/VirtoCommerce.Platform.Core/Events/EventSuppressor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/EventSuppressor.cs)

## Example

```csharp
// Publish: changing before the commit, changed after it.
var changes = models.Select(x => new GenericChangedEntry<MyEntity>(x, EntryState.Modified)).ToList();

await _eventPublisher.Publish(new MyEntityChangingEvent(changes));
await repository.UnitOfWork.CommitAsync();
await _eventPublisher.Publish(new MyEntityChangedEvent(changes));

// Handle: registered in DI, resolved per event.
public class InvalidateCacheHandler : IEventHandler<MyEntityChangedEvent>
{
    public Task Handle(MyEntityChangedEvent message)
    {
        foreach (var entry in message.ChangedEntries)
        {
            MyEntityCacheRegion.ExpireTokenForKey(entry.NewEntry.Id);
        }
        return Task.CompletedTask;
    }
}

// Module.Web: services.AddTransient<IEventHandler<MyEntityChangedEvent>, InvalidateCacheHandler>();
```

## Pitfalls

- A throwing handler propagates to the publisher. One module's bad handler can fail another module's save — wrap non-critical work.
- For bulk work there is an escape hatch — [Suppress events](suppress-events.md) drops every event in the current async flow, including the changing events other modules validate with. It is the right tool for an import and a bad habit everywhere else.
- Publishing the changed event *before* the commit is a real and subtle bug: handlers see data that may still roll back.
- For cross-process reactions you need the EventBus module. Domain events never leave the process on their own.

## Documentation

- [Extending using events](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Event-Driven-Development/using-domain-events/)

## See also

- [In-process bus](inprocess-bus.md): The machinery under domain events: how a published event finds its handlers.
- [Cache regions](cache-regions.md): Named groups of cache entries you can invalidate together — how a write clears the reads that depend on it.
- [EventBus & WebHooks](eventbus-webhooks.md): Getting events out of the process: to a message broker, or as an HTTP callback to someone else's system.
- [Generic CRUD](generic-crud.md): Two abstract base classes with one abstract method each — you supply the query, not the plumbing.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.

## Topic

Part of **Extensibility decision tree**: No-code → API → native. Pick the lowest level that works.
