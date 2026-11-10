# EventBus & WebHooks (Wh)

> Getting events out of the process: to a message broker, or as an HTTP callback to someone else's system.

- Family: Messaging & events
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: integration
- Verified against platform 3.1096.0
- On the map: `#/atom/eventbus-webhooks`

## Pattern

Bridge from in-process domain events to external transports. The EventBus module forwards selected domain events to a broker; the WebHooks module turns them into configurable outbound HTTP calls. Both are installable modules, not platform core.

## When to use

- Letting an external system react to commerce changes without polling your API
- Integration middleware consuming a stream of changes rather than diffing snapshots
- Partner or customer systems that want callbacks

## Avoid

- Assuming these exist in a bare platform — they must be installed
- Sending sensitive payloads to a webhook endpoint you do not control
- Treating outbound delivery as guaranteed and ordered. It is neither

## API

- `VirtoCommerce.EventBus module` · (separate repository — vc-module-event-bus)
- `VirtoCommerce.WebHooks module` · (separate repository — vc-module-webhooks)
- `IEventPublisher (the in-process source)` · [src/VirtoCommerce.Platform.Core/Events/IEventPublisher.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/IEventPublisher.cs)

## Example

```csharp
// Nothing special is required of the publisher: a normal domain event is what
// EventBus and WebHooks subscribe to. Publish once, and both can forward it.
await _eventPublisher.Publish(new MyEntityChangedEvent(changes));

// Which events go out, and where, is configuration in the respective module —
// not a code change in yours. That is the point of the split.
```

## Pitfalls

- Outbound delivery is at-least-once at best. Receivers must be idempotent, and so must any loop that comes back into the platform.
- A slow or failing webhook endpoint should not slow your write path — check how the installed module handles retries before relying on it.
- Forwarding a high-volume event (every price change, say) can generate far more traffic than anyone expected. Filter deliberately.

## Documentation

- [Extending using events](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Event-Driven-Development/using-domain-events/)

## See also

- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
