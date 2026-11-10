# Change log & audit (Cl)

> Who changed what, when — recorded automatically for entities that opt in.

- Family: Data & domain
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/change-log`

## Pattern

Operation log written on save. Entities implementing `IHasChangesHistory` get `OperationLog` records; `IChangeLogSearchService` queries them, and `ILastChangesService` answers "what changed since" without scanning history.

## When to use

- Entities with compliance or dispute-resolution requirements: orders, prices, customer data
- Answering "who changed this and when" without adding your own audit columns
- Incremental sync — "what changed since this timestamp" for an integration

## Avoid

- Enabling it on high-write entities without thinking about volume; the log grows faster than the data
- Using it as an event stream. It is a record for humans, not a delivery mechanism
- Relying on it for field-level diffs unless you have checked what is actually captured

## API

- `IChangeLogService` · [src/VirtoCommerce.Platform.Core/ChangeLog/IChangeLogService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ChangeLog/IChangeLogService.cs)
- `IChangeLogSearchService` · [src/VirtoCommerce.Platform.Core/ChangeLog/IChangeLogSearchService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ChangeLog/IChangeLogSearchService.cs)
- `IHasChangesHistory` · [src/VirtoCommerce.Platform.Core/ChangeLog/IHasChangesHistory.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ChangeLog/IHasChangesHistory.cs)
- `OperationLog` · [src/VirtoCommerce.Platform.Core/ChangeLog/OperationLog.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ChangeLog/OperationLog.cs)
- `ILastChangesService` · [src/VirtoCommerce.Platform.Core/ChangeLog/ILastChangesService.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ChangeLog/ILastChangesService.cs)

## Example

```csharp
// Query the audit trail for one object.
var result = await _changeLogSearchService.SearchAsync(new ChangeLogSearchCriteria
{
    ObjectIds = [orderId],
    ObjectTypes = [nameof(CustomerOrder)],
    Take = 50
});

// AuditableEntity already carries CreatedBy/CreatedDate/ModifiedBy/ModifiedDate —
// the change log is the history on top of that current-state snapshot.
```

## Pitfalls

- The operation log table is one of the fastest-growing in a busy deployment. Retention is an operational decision somebody has to make.
- `AuditableEntity` fields tell you the last change; the change log tells you all of them. Reaching for the wrong one gives a confidently wrong answer.
- Audit fields are populated from the resolved current user, so work in a background job records whoever the job thinks it is running as.
- Since 3.1064 last-modified changes are recorded as entities are saved, one per saved row. `LastChanges:IgnoredEntityTypes` silences noisy types; the match covers the whole inheritance chain, so listing a type also stops its base types being announced for the rows it produces.

## See also

- [Repository & unit of work](repository-uow.md): The data-access boundary: a repository per module, one commit per unit of work.
- [Current user & tenancy](current-user.md): Who is acting right now — for audit fields, notifications and scoping — and how to get it outside a request.
- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.
