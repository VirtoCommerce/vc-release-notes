# Identity Provider (package)

> Virto as the identity provider: authenticating users and authorising their access to other applications.

- Audience: Identity
- Modules: 9, for platform 3.1076.0
- Manifest: https://github.com/VirtoCommerce/vc-modules/blob/master/pbc/idp-packages.json
- On the map: `#/cell/idp`

## Overview

Virto Commerce can be used as an Identity Provider, essential for organizations needing secure and efficient user identity management. This system authenticates users’ identities and authorizes their access to various applications and services, enhancing security and streamlining customer authentication processes.

## Business outcomes

- One account signs a person into every application you run, not just the store.
- Stop holding passwords: identity is proven by a directory the organisation already trusts.
- Grant and revoke access centrally, so leavers lose it everywhere at once.
- Every sign-in and permission change is recorded, which is what an auditor asks for.
- Other systems hear about account changes immediately rather than on a nightly sync.
- Deploy it on its own: eight modules, no catalogue, no checkout, nothing to keep in step.

## Business features included

- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.
- **Transactional email & SMS** (Marketing & loyalty): Order confirmations and alerts, with wording editable and delivery on record.
- **Outbound webhooks** (Integration & operations): External systems are told when something happens, without polling your API.
- **Event streaming to a queue** (Integration & operations): A durable stream of changes for integrations that must not miss one.
- **Background processing** (Integration & operations): Long or scheduled work runs outside the request, and survives a restart.
- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.
- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.

## Modules by layer

- **platform**: [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`), [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`), [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`), [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- **integration**: [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`), [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- **outbound**: [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`), [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`), [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)

## All modules

- [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`)
- [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`)
- [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`)
- [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`)
- [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`)
- [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
- [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)
