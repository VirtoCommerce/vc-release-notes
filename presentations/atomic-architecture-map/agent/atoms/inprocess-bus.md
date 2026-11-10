# In-process bus (Bu)

> The machinery under domain events: how a published event finds its handlers.

- Family: Messaging & events
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/inprocess-bus`

## Pattern

Handler registry with wrapper-based dispatch. `InProcessBus` resolves every `IHandler<T>` registered for a message type and invokes them; `IEventHandlerRegistrar` lets code register handlers dynamically rather than only through DI.

## When to use

- Registering a handler at runtime instead of at startup — conditional wiring, plug-in scenarios
- Understanding why a handler is or is not being called
- Building a message-driven mechanism of your own on top of the same dispatch

## Avoid

- Using it directly for ordinary event handling — register an `IEventHandler<T>` in DI and let the platform wire it
- Expecting durability, ordering guarantees or cross-process delivery
- Registering handlers per request; registrations are process-wide and will accumulate

## API

- `InProcessBus` · [src/VirtoCommerce.Platform.Core/Bus/InProcessBus.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Bus/InProcessBus.cs)
- `HandlerWrapper` · [src/VirtoCommerce.Platform.Core/Bus/HandlerWrapper.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Bus/HandlerWrapper.cs)
- `IEventHandlerRegistrar` · [src/VirtoCommerce.Platform.Core/Events/IEventHandlerRegistrar.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/IEventHandlerRegistrar.cs)
- `IHandler<T>` · [src/VirtoCommerce.Platform.Core/Messages/IHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Messages/IHandler.cs)
- `ICancellableEventHandler` · [src/VirtoCommerce.Platform.Core/Events/ICancellableEventHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/ICancellableEventHandler.cs)

## Example

```csharp
// The whole contract handlers implement, from Core/Messages/IHandler.cs:
public interface IHandler<in T> where T : IMessage
{
    Task Handle(T message);
}

// IEventHandler<T> is just IHandler<T> constrained to IEvent — which is why
// "register a handler" and "register a message handler" are the same act here.
```

## Pitfalls

- Handler resolution is by exact message type. A handler for a base event type does not receive derived events unless it is registered for them.
- Dynamic registration bypasses DI lifetime management — you own the handler instance's lifetime.
- This is platform internals. If you are here to fix a handler that does not fire, the answer is almost always a missing DI registration.

## Documentation

- [Extending using events](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Event-Driven-Development/using-domain-events/)

## See also

- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
- [Commands](commands.md): A thin command/handler abstraction alongside events — present, but far less used than events.
- [Dependency injection](dependency-injection.md): Standard .NET DI — pick the lifetime first — plus the Virto convention that makes it an extension point: the last registration wins.
