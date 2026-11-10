# HTTP client (Ht)

> Outbound HTTP the correct way — factory-managed clients, never a `new HttpClient` per call.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/http-client`

## Pattern

Factory-pooled handlers. `services.AddHttpClient()` registers `IHttpClientFactory`, which pools and recycles the underlying handlers. The platform uses it for external module catalogue access and licensing calls.

## When to use

- Any call to an external API: payment gateways, ERP, licensing, webhooks
- When you want per-client configuration — base address, default headers, timeout
- As the injection point for resilience policies, if you add them

## Avoid

- `new HttpClient()` per request. It exhausts sockets under load, and the failure looks like a network problem
- A static `HttpClient` that never refreshes DNS — the opposite failure
- No timeout. The default is long enough to turn a slow dependency into an outage

## API

- `services.AddHttpClient()` · [src/VirtoCommerce.Platform.Web/Startup.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Startup.cs)
- `ExternalModulesClient` · [src/VirtoCommerce.Platform.Modules/External/ExternalModulesClient.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Modules/External/ExternalModulesClient.cs)
- `LicensingController usage` · [src/VirtoCommerce.Platform.Web/Controllers/Api/LicensingController.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Web/Controllers/Api/LicensingController.cs)

## Example

```csharp
// A named or typed client, configured once.
services.AddHttpClient<IErpClient, ErpClient>(client =>
{
    client.BaseAddress = new Uri(options.ErpBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(30);   // always set one
});

// Inject the typed client; the factory owns handler lifetime.
public class ErpClient(HttpClient httpClient) : IErpClient
{
    public Task<HttpResponseMessage> GetOrder(string id) =>
        httpClient.GetAsync($"orders/{id}");
}
```

## Pitfalls

- The platform calls the parameterless `AddHttpClient()`, so there are no pre-configured named clients to inherit from — configure your own.
- A typed client is transient while its handler is pooled. Do not keep per-call state on the client class.
- An outbound call with no timeout inside a request handler is how one slow third party takes down your thread pool.

## See also

- [Resilience (Polly)](resilience.md): Retry, circuit-breaker and timeout policies. The package is referenced but the platform has no call sites.
- [Options pattern](options-pattern.md): Strongly typed `appsettings.json` binding — for infrastructure configuration, as opposed to operator settings.
- [EventBus & WebHooks](eventbus-webhooks.md): Getting events out of the process: to a message broker, or as an HTTP callback to someone else's system.
- [Logging](logging.md): Serilog behind `ILogger<T>`, configured from `appsettings.json`, with a bootstrap logger for early module loading.
