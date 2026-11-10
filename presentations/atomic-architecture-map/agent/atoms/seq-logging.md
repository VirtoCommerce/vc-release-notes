# Seq & log sinks (Sq)

> Sending structured logs somewhere you can query them, instead of reading console output.

- Family: Infra & ops
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: infrastructure
- Verified against platform 3.1096.0
- On the map: `#/atom/seq-logging`

## Pattern

Serilog sink added by configuration. The platform logs through `ILogger<T>` onto Serilog; a sink module such as `VirtoCommerce.SeqLog` forwards those events to a log server, where the structured properties become queryable fields.

## When to use

- Any environment where you cannot attach a debugger — which is every shared environment
- Following one request or job across instances by correlating on a structured property
- Turning "it failed yesterday for one customer" into a query rather than an archaeology exercise

## Avoid

- Shipping personal data or secrets to a log server — it is a searchable index of whatever you send it
- Debug level in production without a retention and volume plan
- Relying on the console sink in a container nobody is watching

## Note

The module ships no interfaces of its own — it is wiring. You keep logging through `ILogger<T>` and the sink decides where events land; Application Insights is the other documented option.

## API

- `VirtoCommerce.SeqLog (module)` · (vc-module-seq-log — a configuration-only Serilog sink module)
- `Serilog configuration` · [src/VirtoCommerce.Platform.Web/Program.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Program.cs)
- `ILogger<T> (what you write against)` · [src/VirtoCommerce.Platform.Core/Logger/](https://github.com/VirtoCommerce/vc-platform/tree/dev/src/VirtoCommerce.Platform.Core/Logger/)

## Pitfalls

- A sink is only as useful as your message templates. `LogInformation("Reindexed {StoreId}", id)` is queryable; an interpolated string is one opaque line and no sink can recover the property.
- Sinks are configured, not coded — "logs are not arriving" is almost always the `Serilog` section rather than your code.
- Log volume is a cost. The same sink that makes an incident tractable makes a chatty debug statement expensive.

## Documentation

- [Seq module](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Logging/seq-module/)
- [Logging overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Logging/overview/)
- [Extended logging](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Logging/extended-logging/)
- [vc-module-seq-log (GitHub)](https://github.com/VirtoCommerce/vc-module-seq-log)

## See also

- [Logging](logging.md): Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.
- [Health checks](health-checks.md): A `/health` endpoint that already checks modules, cache, Redis and the database — extend it, do not reinvent it.
- [Developer tools](developer-tools.md): A registry of in-product diagnostic links, surfaced in the Admin UI and filtered by permission.

## Topic

Part of **Observability**: Knowing what production is doing before a customer tells you.
