# Suppress events (Su)

> Switch domain events off for one async flow — the bulk-import escape hatch, and the one thing that stops an import from indexing the same SKU 6000 times.

- Family: Messaging & events
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/suppress-events`

## Pattern

`using (EventSuppressor.SuppressEvents())` sets an `AsyncLocal<bool>`; `InProcessBus.Publish` sees the flag and returns before it looks up a single handler. Because it is `AsyncLocal`, the suppression follows the async control flow — inherited by tasks you await inside the block, invisible to every other request on the server.

## When to use

- Bulk import, migration or seeding, where a per-row handler would do the work n times instead of once
- The real case: 6000 price lists × 66 SKUs. Each list publishes `PriceChangedEvent`, `IndexPricesProductChangedEventHandler` enqueues one index job per changed SKU — ~400 000 jobs queued to produce an index you could have rebuilt once
- Any write loop where you already know you will rebuild the derived state afterwards

## Avoid

- Nesting it. `Dispose()` sets the flag to **false**, not back to what it was, so an inner `using` un-suppresses the outer one early
- Expecting it to reach a background job. Enqueue work inside the block and the job runs in a different flow — and usually a different process — with events fully live
- Leaving it around an HTTP request boundary, or holding it open across work you did not write
- Using it to hide a slow handler. It removes the symptom for your code path and leaves the handler slow for everyone else

## API

- `EventSuppressor.SuppressEvents() / EventsSuppressed` · [src/VirtoCommerce.Platform.Core/Events/EventSuppressor.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Events/EventSuppressor.cs)
- `InProcessBus.Publish — the only place the flag is read` · [src/VirtoCommerce.Platform.Core/Bus/InProcessBus.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Bus/InProcessBus.cs)
- `IndexPricesProductChangedEventHandler — the handler in the story` · [vc-module-pricing/src/VirtoCommerce.PricingModule.Data/Handlers/IndexPricesProductChangedEventHandler.cs](https://github.com/VirtoCommerce/vc-module-pricing/blob/dev/src/VirtoCommerce.PricingModule.Data/Handlers/IndexPricesProductChangedEventHandler.cs)
- `IIndexingJobService — the one pass afterwards` · [vc-module-search/src/VirtoCommerce.SearchModule.Core/BackgroundJobs/IIndexingJobService.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/BackgroundJobs/IIndexingJobService.cs)

## Example

```csharp
// Import 6000 price lists without queueing an index job per SKU per list.
//
// 1. suppress → 2. import → 3. ONE indexation pass at the end.
using (EventSuppressor.SuppressEvents())
{
    // The flag rides the async control flow, so everything awaited in here is covered too.
    foreach (var batch in priceLists.Chunk(500))
    {
        await _priceService.SaveChangesAsync(batch);   // PriceChangedEvent published → dropped
    }
}

// 3. Outside the block, events are live again. Rebuild the derived state once:
await _indexingJobService.EnqueueAsync(userName,
    [new IndexingOptions { DocumentType = KnownDocumentTypes.Product, DocumentIds = affectedProductIds }]);

// The setting-level lever, for when the import is not your code:
//   Pricing.Search.EventBasedIndexation.Enable = false
//   Catalog.Search.EventBasedIndexation.Enable = false
// The handlers check it before enqueueing anything, so no code change is needed —
// and no other handler is affected, which is what makes it the safer of the two.
```

## Pitfalls

- It suppresses **all** domain events for that flow, not the noisy one: `…ChangingEvent` validation and veto handlers stop running too, so an import can write data an interactive save would have rejected.
- The change log goes quiet. `LogChangesChangedEventHandler` is an event handler like any other, so a suppressed import leaves no audit trail of what it wrote.
- Outbound integration goes quiet as well — EventBus and WebHooks subscribe to domain events, so downstream systems never hear about the import.
- Caches are safe: `CrudService` calls `ClearCache` directly rather than through a handler, so suppression does not leave stale entries behind.
- The static name suggests a global switch. It is not — it is per async flow, so a parallel request is unaffected. That is a feature, and also why it cannot help you across a job boundary.

## Documentation

- [Extending using events](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Event-Driven-Development/using-domain-events/)
- [AsyncLocal<T> — why the flag follows the flow](https://learn.microsoft.com/dotnet/api/system.threading.asynclocal-1)

## See also

- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
- [In-process bus](inprocess-bus.md): The machinery under domain events: how a published event finds its handlers.
- [Indexed search](search.md): The read path the catalogue actually depends on — and one more engine to keep consistent with the database.
- [Change log & audit](change-log.md): Who changed what, when — recorded automatically for entities that opt in.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
