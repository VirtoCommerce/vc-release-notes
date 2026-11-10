# TimeProvider (Tp)

> .NET's abstract clock, for testable time. The package is referenced; nothing in the platform calls it.

- Family: Execution & async
- Adoption: **Available**. .NET offers it; this platform does not use it.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/time-provider`

## Pattern

Inject an abstract clock instead of calling `DateTime.UtcNow`, then substitute a fake in tests. The platform uses `DateTime.UtcNow` directly, so time-dependent logic here is tested by other means.

## When to use

- New code with time-dependent behaviour you want to unit test without waiting or sleeping
- Expiry, scheduling and windowing logic where a fake clock makes the test deterministic

## Avoid

- Retrofitting it across existing platform-facing code for its own sake
- Mixing `TimeProvider` and `DateTime.UtcNow` in the same logic; only half of it becomes testable
- Assuming platform APIs accept a clock. They do not

## Note

Verified by grep: `Microsoft.Bcl.TimeProvider 10.0.13` appears as a `PackageReference` in `VirtoCommerce.Platform.Web.csproj`, but there are no `TimeProvider` usages in platform source. It is available to your module; there is no platform pattern to follow.

## API

- `TimeProvider` · (Microsoft.Bcl.TimeProvider — referenced by Platform.Web, no call sites)

## Pitfalls

- Because nothing uses it, adopting it is a local decision within your own module rather than following a convention.
- The value shows up in tests, not production. If your time logic is not tested, this buys you nothing.

## See also

- [Recurring jobs](recurring-jobs.md): Cron-scheduled work whose schedule an operator can change without a deploy.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.
