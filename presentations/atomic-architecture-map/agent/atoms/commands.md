# Commands (Cm)

> A thin command/handler abstraction alongside events — present, but far less used than events.

- Family: Messaging & events
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/commands`

## Pattern

Command dispatch, one handler per command. `ICommandSender.Send` routes a command to its `ICommandHandler`. Where an event says "this happened, react if you like", a command says "do this" and expects exactly one thing to act.

## When to use

- Modelling an explicit imperative operation you want dispatched rather than called directly
- CQRS-shaped code where write operations are commands — XAPI modules use this shape heavily
- Decoupling a caller from a single implementation without inventing an interface per operation

## Avoid

- Using a command where an event fits — if several modules may want to react, publish an event
- Wrapping every service call in a command; the indirection has to buy something
- Expecting multiple handlers. A command has one

## API

- `ICommand` · [src/VirtoCommerce.Platform.Core/Commands/ICommand.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Commands/ICommand.cs)
- `ICommandSender` · [src/VirtoCommerce.Platform.Core/Commands/ICommandSender.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Commands/ICommandSender.cs)
- `ICommandHandler<T>` · [src/VirtoCommerce.Platform.Core/Commands/ICommandHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Commands/ICommandHandler.cs)
- `CommandBase` · [src/VirtoCommerce.Platform.Core/Commands/CommandBase.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Commands/CommandBase.cs)
- `ICancellableCommandHandler` · [src/VirtoCommerce.Platform.Core/Commands/ICancellableCommandHandler.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Commands/ICancellableCommandHandler.cs)

## Example

```csharp
// Send a command; exactly one handler is expected to act on it.
await _commandSender.Send(new RecalculatePricesCommand { PricelistId = id }, cancellationToken);

// Contrast with an event, where zero or many modules may react:
await _eventPublisher.Publish(new PricesRecalculatedEvent(changes));
```

## Pitfalls

- The platform itself barely uses this; commands are much more prominent in the XAPI modules. Do not assume platform conventions exist for it.
- Commands and events share the same underlying dispatch, so a missing registration fails the same quiet way.
- One handler per command is a design constraint, not an enforced invariant — registering two is a mistake the compiler will not catch.

## See also

- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
- [In-process bus](inprocess-bus.md): The machinery under domain events: how a published event finds its handlers.
