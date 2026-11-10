# Audit Log (`VirtoCommerce.AuditLog`)

> Provides extended audit features

- Latest version: 3.1005.0 (needs platform 3.1076.10)
- Repository: https://github.com/VirtoCommerce/vc-module-audit-log
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.AuditLog`

## For business analysts

A record of who changed what and when, for the changes a business must be able to explain.

## For architects

Three entities and nine migrations over one dependency, with five permissions. It is separate from the platform's change log because an audit trail has different retention and access rules from a developer-facing diff.

## For developers

Two declared events. Volume is the design problem: decide what is audited and for how long before enabling it broadly, because everything is cheap to record and expensive to keep.

## Use it when

- Compliance or a customer contract requires an audit trail
- Disputes about who changed a price or an order must be settled
- Access to sensitive data needs recording

## Do not use it when

- Debugging a data problem — the change log is closer to the code
- You need operational telemetry: that is Application Insights
- Retention is undecided: audit data grows without limit

## Required modules

- [Azure Application Insights](VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`) ≥ 3.1001.0

## Owns these entities

- `AuditLogRecordEntity`
- `AuditLogRecordFieldEntity`
- `HttpDependencySettingEntity`

## Events it handles

- `DomainEvent`

## REST controllers

- `api/audit-log` · 5 actions · [vc-module-audit-log/src/VirtoCommerce.AuditLog.Web/Controllers/Api/AuditLogController.cs](https://github.com/VirtoCommerce/vc-module-audit-log/blob/dev/src/VirtoCommerce.AuditLog.Web/Controllers/Api/AuditLogController.cs)
- `api/audit-log/http-dependency-settings` · 4 actions · [vc-module-audit-log/src/VirtoCommerce.AuditLog.Web/Controllers/Api/HttpDependencySettingController.cs](https://github.com/VirtoCommerce/vc-module-audit-log/blob/dev/src/VirtoCommerce.AuditLog.Web/Controllers/Api/HttpDependencySettingController.cs)

## Permissions

- `AuditLog:access`
- `AuditLog:create`
- `AuditLog:delete`
- `AuditLog:read`
- `AuditLog:update`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 14.

## Business features it serves

- **Audit trail** (Integration & operations): A record of who changed what, kept for as long as compliance requires.

## Key features

- Subscribes to `GenericChangedEntryEvent<T>` and compares old/new snapshots.
- Tracks **primitive properties** (string, int, enum, DateTime, …).
- Tracks **primitive collections** (e.g. `IList<string> Tags`) via set equality.
- Tracks **`IEntity` child collections** matched by `Id`.
- Tracks **ValueObject child collections** matched by position.
- Tracks **single `IEntity` / ValueObject child properties**.
- Supports **deep nesting** — child records can carry their own child records (e.g. Contact → Organization → Address).
- Each record stores operation type (`Added` / `Modified` / `Deleted`), changed fields with old/new values, and a tree of child records.
- Domain events are processed **asynchronously** through a bounded `Channel<T>` and a background `IHostedService`, so event publishers are not blocked.
- **`HttpLoggingMiddleware`** captures inbound request/response content for matching routes.
- **`HttpTelemetryInitializer`** enriches outgoing `DependencyTelemetry` (Application Insights) with request/response content and headers.
- Per-host / per-method / per-path rules with independent limits for request and response body length.
- Settings are kept in a singleton in-memory cache, invalidated automatically when the management API mutates them. A pre-warm load starts at startup without holding it.
- Cold-cache reads are bounded by a short timeout, so a slow database never blocks the request pipeline. The telemetry path bounds its wait on the thread that blocks, which holds even when the thread pool is saturated. A read that times out degrades to no HTTP logging for that item; the global redaction rules still apply to its URL.
- Because the pre-warm is not awaited, the cache may still be cold when the first requests after a restart arrive, so that burst can meet the timeout and go unlogged, by design.
- Tracked outgoing response bodies are captured as a bounded prefix, and the caller still receives the full body. The telemetry initializer runs before `HttpClient` reads the body, so it blocks the calling thread for at most `AuditLogOptions:HttpResponseCaptureTimeout` (default 1 s) waiting for that prefix; a body that does not arrive in time is logged as `<not captured>`. With `HttpCompletionOption.ResponseHeadersRead` the caller can therefore get its headers up to that long later, and its first body bytes only once the whole prefix has arrived or the body has ended. Under body redaction rules the prefix is up to `MaxBodyLength` characters (1,048,576 by default, read as up to 4 MB of body), and with no response length set it is up to 1,048,576 characters the same way, so on a slow link a large body may exceed the timeout and go unlogged, and a response the caller reads as it arrives — NDJSON, a long poll — reaches it only in prefix-sized steps, and one that stays open sending less than a prefix reaches it only when it closes. Server-sent events (`text/event-stream`), gRPC and gRPC-Web (`application/grpc*`, requests too), `101 Switching Protocols` and `CONNECT` responses are not captured at all and are logged as `<not captured>`. `gzip`, `br` and `deflate` bodies are decoded for the log.
- **Header names** (case-insensitive), or the inverse — an allow list that masks every header not explicitly permitted. Deny-by-default is the safer mode, because vendor header names are themselves injected from configuration. Allow-list mode with an empty list falls back to the built-in allow list rather than to the deny list, so opting out of the defaults cannot turn the strictest mode into the weakest one. There is consequently no configuration that means "mask every header": an empty list is read as "use the built-in one", and masking all of them would take listing them in `HeaderNames`.
- **URI-valued headers** (`Location`, `Content-Location`, `Referer`, `Refresh`) have their query string redacted instead of being logged as an opaque string, and are masked whole when redaction is on but the query rules have been emptied — such a header is only in clear text because it was expected to be redacted, and both routes to that state ("Ignore default redaction", an explicitly empty `FormKeys`) are ones an operator takes to tighten things. With redaction off and no query rule left they are logged as they arrived; a setting's own `FormKeys` still apply even then, because an explicit per-setting rule is an explicit instruction. Without this a `302 Location: …?access_token=…` would carry the token past every other rule, while masking the header whole would throw away the redirect target.
- **JsonPath** expressions for JSON bodies, including recursive descent (`$..password`). A plain `$..name` expression is matched **case-insensitively** — deliberately unlike JsonPath, because no literal list can enumerate every casing a field arrives under and the ones it misses are silent leaks. A different *name* still needs its own expression: `$..password` covers `Password` and `PASSWORD`, but neither `newPassword` nor `client_secret` against `clientSecret`. Expressions with a filter or an index (`$.records[*].fields`) are evaluated by Newtonsoft and keep its exact-match semantics.
- **XPath** expressions for XML and SOAP bodies. Plain element names are matched by local name — inside predicates as well — so `//Credential[Identity='buyer']/SharedSecret` works for namespace-free cXML and for SOAP envelopes whose namespaces vary between endpoints. A namespace-sensitive name would make the expression select nothing, and unlike a malformed expression that failure is silent.
- **Form and query keys** for `application/x-www-form-urlencoded` bodies, for the dependency URL, and for the inbound request URL — where OAuth tokens and blob SAS signatures appear. A form field that carries a whole document is decoded and run through the JsonPath/XPath rules too: the cXML punch-out return leg posts its response as one url-encoded field.
- **Body kind** comes from the media type, but a declared type is a claim rather than proof, so the content overrides it wherever the content is unambiguous: JSON declared as `text/html` or as a form is still redacted as JSON, and a body declared as a form but not shaped like one is re-classified instead of passing through. A kind this module does not model still gets the key/value pass: every sensitive key it finds is masked, in any position, up to the next separator — and there whitespace counts as one, since that is how pairs arrive in an unstructured body. Only there: a query string and a declared form body are split on `&` alone, because a space inside a query-string value would otherwise end a mask early and publish the tail of the secret. `text/html` is never parsed as XML. A field value that fails to parse as a document is left alone when nothing a rule names appears in its text — which is what keeps error pages, pure diagnostics, readable — and masked when a rule name is in there, because the failed parse was then the only thing between that name's value and the log.
- **Fail-safe**: when expressions apply to a body they cannot be applied to, a placeholder is logged instead of the raw body, and each cause has its own so the message names the real one — the body is unparsable, it holds content after the first document (which the parser itself accepted, such as NDJSON or a trailing comment), it is over the size limit, or an expression failed to evaluate. The last names the expression, so a typo is locatable rather than silently matching nothing.
- Body length limits are enforced on the **redacted** copy, so a body long enough to be truncated is still redacted rather than dropped. A body over `MaxBodyLength` gets its own placeholder instead — see the option's row below.
- Header names in `SecurityHeaderNames` (`Authorization`, `Cookie`, `Password`, …) are masked in **both** modes and cannot be un-masked by configuration — not by an allow list, not by `Enabled: false`, not by a setting's "Ignore default redaction".
- Expressions come from the built-in defaults, from `AuditLogOptions:Redaction`, and from the individual HTTP dependency setting; the three are merged.
- The **inbound request URL** is redacted by the telemetry initializer, not by the logging middleware: `HostingDiagnosticListener.EndRequest` assigns `RequestTelemetry.Url` unconditionally after the pipeline unwinds, so a value written from the middleware would be overwritten. Initializers run inside the `TrackRequest` call that follows that assignment.
- REST endpoints under `api/audit-log` and `api/audit-log/http-dependency-setting/...`.
- Module-scoped permissions: `AuditLog:access`, `AuditLog:read`, `AuditLog:create`, `AuditLog:update`, `AuditLog:delete`.
