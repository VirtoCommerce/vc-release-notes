# Seq log sink (`VirtoCommerce.SeqLog`)

> Writes logs events to Serilog Seq

- Latest version: 3.1002.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-seq-log
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.SeqLog`

## For business analysts

Structured logs shipped to Seq, where they can be queried instead of grepped.

## For architects

A logging sink with no dependencies and no settings of its own — Serilog configuration in appsettings does the work. Structured logging is what makes a scaled-out deployment debuggable.

## For developers

Log properties, not sentences: `{OrderId}` is queryable, an interpolated string is not. This module only decides where those events land.

## Use it when

- You need to see what a deployed instance is doing
- An incident needs traces or metrics that survive a restart
- The hosting platform already collects this format

## Do not use it when

- Business reporting — this is operational telemetry, not analytics
- You want an audit trail of who changed what: that is Audit Log
- Adding several collectors for the same signal, which doubles cost for one answer

## Business features it serves

- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.
