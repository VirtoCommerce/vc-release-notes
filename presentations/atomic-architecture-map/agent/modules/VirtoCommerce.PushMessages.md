# Push Messages (`VirtoCommerce.PushMessages`)

> Enables back-end admins to send custom notifications to selected organizations within the Virto Commerce platform.

- Latest version: 3.1009.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-push-messages
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.PushMessages`

## For business analysts

In-app messages and alerts for back-office users — the notifications that appear inside the application rather than in an inbox.

## For architects

Four entities, 18 migrations, six declared events and three GraphQL builders over two dependencies. Seven settings, and its own storage because a message must survive until it is read.

## For developers

SignalR delivers it, so a scaled-out deployment needs the backplane — the same requirement the platform's push notification atom describes. Six events make read state subscribable.

## Use it when

- Users inside the application must be told something now
- A long job's completion should reach whoever started it
- Messages need to persist until acknowledged

## Do not use it when

- The recipient is outside the platform — that is Notifications or a webhook
- You have no SignalR backplane and more than one instance
- Transient UI feedback: that is the front end's own concern

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0

## Owns these entities

- `PushMessageEntity`

## Events it handles

- `MemberChangedEvent`
- `PushMessageChangedEvent`
- `PushMessageRecipientChangedEvent`

## REST controllers

- `api/push-message` · 8 actions · [vc-module-push-messages/src/VirtoCommerce.PushMessages.Web/Controllers/Api/PushMessageController.cs](https://github.com/VirtoCommerce/vc-module-push-messages/blob/dev/src/VirtoCommerce.PushMessages.Web/Controllers/Api/PushMessageController.cs)

## GraphQL builders

- [vc-module-push-messages/src/VirtoCommerce.PushMessages.ExperienceApi/Queries/GetFcmSettingsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-push-messages/blob/dev/src/VirtoCommerce.PushMessages.ExperienceApi/Queries/GetFcmSettingsQueryBuilder.cs)
- [vc-module-push-messages/src/VirtoCommerce.PushMessages.ExperienceApi/Queries/GetPushMessagesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-push-messages/blob/dev/src/VirtoCommerce.PushMessages.ExperienceApi/Queries/GetPushMessagesQueryBuilder.cs)
- [vc-module-push-messages/src/VirtoCommerce.PushMessages.ExperienceApi/Schemas/PushMessagesSchema.cs](https://github.com/VirtoCommerce/vc-module-push-messages/blob/dev/src/VirtoCommerce.PushMessages.ExperienceApi/Schemas/PushMessagesSchema.cs)

## Permissions

- `PushMessages:access`
- `PushMessages:create`
- `PushMessages:delete`
- `PushMessages:read`
- `PushMessages:update`

## Settings

- `PushMessages.BatchSize`
- `PushMessages.Enable`
- `PushMessages.FCM.Enable`
- `PushMessages.SendScheduledMessagesRecurringJob.CronExpression`
- `PushMessages.SendScheduledMessagesRecurringJob.Enable`
- `PushMessages.TrackNewRecipientsRecurringJob.CronExpression`
- `PushMessages.TrackNewRecipientsRecurringJob.Enable`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 18.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **In-app alerts for staff** (AI & agents): People working in the back office are told when their long job finishes.

## Key features

- Send a Short Message in HTML format. Max length: 1024.
- Select multiple customers or organizations for notification delivery
- Check Delivery status display per customer
- Notification Preview (Soon)
- Templates (Soon)
- Extend message with Subjet and Full Message (Soon)
- Add attachments (Soon)
- Reporting (Soon)
- More Notifications Channels: Browser Push Notifications, SMS, Email, etc. (Soon)

## Documentation

- [Push Meessages module user documentation](https://docs.virtocommerce.org/platform/user-guide/push-messages/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Push-messages/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.PushMessages)
- [Push messages configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#pushmessages)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-push-messages)
