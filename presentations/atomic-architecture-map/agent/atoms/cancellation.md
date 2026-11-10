# Cancellation (Ct)

> Threading a cancellation signal all the way down — and the obsolete shim you will still meet in older code.

- Family: Execution & async
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/cancellation`

## Pattern

Cooperative cancellation. A `CancellationToken` is passed down the call chain and checked at safe points; nothing is aborted forcibly. The platform threads it through jobs, event handlers, repositories and export/import.

## When to use

- Every async method that does real work — accept a token and pass it on
- Long loops: check `ThrowIfCancellationRequested()` once per iteration or batch
- Any call to a database, HTTP endpoint or search engine

## Avoid

- Swallowing `OperationCanceledException` — it is the success path of a cancelled operation, not an error to log as one
- Accepting a token and then never passing it to the calls you make; that is worse than not accepting it
- The obsolete `ICancellationToken` interface in new code

## API

- `ICancellationToken (obsolete, VC0014)` · [src/VirtoCommerce.Platform.Core/Common/ICancellationToken.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/ICancellationToken.cs)
- `CancellationTokenWrapper` · [src/VirtoCommerce.Platform.Core/Common/CancellationTokenWrapper.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/CancellationTokenWrapper.cs)

## Example

```csharp
// ✕ Obsolete: ICancellationToken is a Hangfire compatibility shim for legacy queue items.
//   Marked [Obsolete] with diagnostic id VC0014.
Task ExportAsync(Stream stream, ExportImportOptions options,
    Action<ExportImportProgressInfo> progress, ICancellationToken token);

// ✓ The current shape. Note the platform bridges old implementers automatically
//   via CancellationTokenWrapper, so both overloads exist on IExportSupport.
Task ExportAsync(Stream stream, ExportImportOptions options,
    Action<ExportImportProgressInfo> progress, CancellationToken cancellationToken);
```

## Pitfalls

- `ICancellationToken` is `[Obsolete]` with diagnostic id `VC0014`. Because the solution builds with `TreatWarningsAsErrors`, using it will fail your build unless suppressed — which is the intended nudge.
- `IExportSupport` and `IImportSupport` carry both overloads: the obsolete one throws `NotImplementedException` by default, and the modern one bridges to it via `CancellationTokenWrapper` for old implementers.
- A token that is never checked is decoration. Cancellation only happens where you look for it.

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Hosted service](hosted-service.md): A .NET long-running loop tied to application lifetime — for in-process work no queue should own.
- [Backup & restore](backup-restore.md): The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.
