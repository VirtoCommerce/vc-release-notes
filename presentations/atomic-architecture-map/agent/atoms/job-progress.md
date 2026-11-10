# Job progress (Jp)

> Reporting how far a long job has got, so the UI can show it instead of spinning.

- Family: Execution & async
- Adoption: **In flight**. Changing right now: read the migration note.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/job-progress`

## Pattern

Ambient reporter handed to the running handler. `IJobExecutionContext.Progress` accepts a `JobProgressInfo` (message plus processed and total counts) and is a **no-op** when the job was enqueued without `ReportProgress`, so handlers never branch on whether anyone is watching.

## When to use

- Imports, exports, reindexing — anything where the operator needs to see movement
- Jobs where a stalled step should be visibly distinguishable from a slow one
- Any job a user can trigger from the Admin UI

## Avoid

- Reporting per item in a tight loop — batch it, or you make progress reporting the bottleneck
- Using progress messages as a log. They are a UI surface, not a diagnostic record

## API

- `IJobProgress` · [src/VirtoCommerce.Platform.Core/Jobs/IJobProgress.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IJobProgress.cs)
- `JobProgressInfo` · [src/VirtoCommerce.Platform.Core/Jobs/JobProgressInfo.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/JobProgressInfo.cs)
- `IJobExecutionContext.Progress` · [src/VirtoCommerce.Platform.Core/Jobs/IJobExecutionContext.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/IJobExecutionContext.cs)
- `EnqueueOptions.ReportProgress` · [src/VirtoCommerce.Platform.Core/Jobs/EnqueueOptions.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Jobs/EnqueueOptions.cs)

## Example

```csharp
public async Task Execute(ImportPayload payload, IJobExecutionContext context,
    CancellationToken cancellationToken = default)
{
    var total = rows.Count;
    for (var i = 0; i < total; i++)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await ImportRow(rows[i]);

        if (i % 100 == 0)   // batch the reporting, not every row
        {
            await context.Progress.Report(new JobProgressInfo
            {
                Message = "Importing rows",
                ProcessedCount = i,
                TotalCount = total
            }, cancellationToken);
        }
    }
}
```

## Pitfalls

- Progress is a no-op unless the job was enqueued with `ReportProgress = true` — a handler that "reports nothing" is usually an enqueue-side omission.
- `ProcessedCount` and `TotalCount` are nullable: send a message-only update when you genuinely do not know the total yet, rather than guessing.
- Progress reaches the browser over SignalR push notifications, so scaled-out deployments need the backplane configured or updates land on the wrong instance.

## Documentation

- [Background Processing Hub — design spec](https://github.com/VirtoCommerce/vc-platform/blob/dev/docs/superpowers/specs/2026-06-06-background-processing-hub-design.md)

## See also

- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Hangfire](hangfire.md): Referencing Hangfire directly is the legacy path. It is now one selectable engine behind the background-jobs port, not the platform's job system.
- [Push notifications](push-notifications.md): Server-to-browser push over SignalR — how long-running work reports back to the Admin UI.
- [Backup & restore](backup-restore.md): The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.

## Topic

Part of **Background processing hub**: The in-flight extraction of the job engine behind one port.
