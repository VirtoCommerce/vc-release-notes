# Notifications (`VirtoCommerce.Notifications`)

> Provides a comprehensive infrastructure for managing and delivering notifications within the Virto Commerce platform.

- Latest version: 3.1020.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-notification
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.Notifications`

## For business analysts

Every message the platform sends — order confirmations, password resets, abandoned-cart reminders — with its template, its layout and a record of what was actually delivered. Marketing edits the wording; the module owns the sending.

## For architects

One module, many transports: **twelve projects**, six of which are adapters and renderers — SMTP, SendGrid, Twilio, Microsoft Graph, a Liquid renderer and a file-system template loader. That is why eleven modules require it and its only dependency is Assets (attachments). Messages are persisted, not fire-and-forget, so delivery is auditable and retryable — thirteen entities exist for exactly that.

## For developers

Define a notification type and a template; the transport is configuration. It handles `UserRequestPasswordResetEvent`, which is the pattern to copy — subscribe to a domain event and send, rather than calling a mailer from business code. Templates render with Liquid, so a wording change is not a deployment.

## Use it when

- Anything must reach a person by email, SMS or another channel
- A message's wording or layout has to be editable without a release
- You need evidence that a notification was sent, and what it contained

## Do not use it when

- The recipient is another system — that is an outbound webhook or a queue, not a notification
- You want in-app messages for back-office users: that is push notifications on the platform
- The template belongs to a storefront page — that is Content

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0

## Owns these entities

- `NotificationEntity`
- `NotificationTemplateEntity`
- `NotificationLayoutEntity`
- `NotificationMessageEntity`
- `EmailAttachmentEntity`

## Events it publishes

- `NotificationChangedEvent`
- `NotificationChangingEvent`
- `NotificationMessageChangedEvent`
- `NotificationMessageChangingEvent`

## Events it handles

- `UserRequestPasswordResetEvent`

## REST controllers

- `api/notification-layouts` · 6 actions · [vc-module-notification/src/VirtoCommerce.NotificationsModule.Web/Controllers/NotificationLayoutsController.cs](https://github.com/VirtoCommerce/vc-module-notification/blob/dev/src/VirtoCommerce.NotificationsModule.Web/Controllers/NotificationLayoutsController.cs)
- `api/notifications` · 11 actions · [vc-module-notification/src/VirtoCommerce.NotificationsModule.Web/Controllers/NotificationsController.cs](https://github.com/VirtoCommerce/vc-module-notification/blob/dev/src/VirtoCommerce.NotificationsModule.Web/Controllers/NotificationsController.cs)

## Permissions

- `notifications:access`
- `notifications:create`
- `notifications:delete`
- `notifications:export`
- `notifications:import`
- `notifications:read`
- `notifications:template:create`
- `notifications:templates:read`
- `notifications:update`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 32.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Abandoned-cart reminders** (Cart & checkout): Shoppers who left something behind are reminded, on a schedule you set.
- **Transactional email & SMS** (Marketing & loyalty): Order confirmations and alerts, with wording editable and delivery on record.

## Key features

- **Email templates with Scriban/Liquid**: The module supports email templates using the powerful Scriban templating language, with Liquid support enabled. This allows for dynamic content generation and customization of email notifications, ensuring personalized and engaging communication with recipients.
- **Extendable model**: The notifications module offers an extendable model, allowing developers to add custom fields and attributes to notifications as per their specific business requirements. This flexibility enables seamless integration with existing systems and workflows.
- **Notification layouts**: Create reusable layout templates with common elements (header, footer, etc.) to maintain consistent branding across all notification templates.
- **Multi-language support**: Templates can be created for multiple languages to support international customers.
- **Template preview and testing**: Preview rendered templates with sample data and send test emails before going live.
- **CC and BCC support**: Send copies and blind copies of notifications to additional recipients.
- **Email attachments**: Support for adding file attachments to email notifications (API only).
- **SMTP support**: Send emails via any SMTP server with SSL/TLS support and custom headers.
- **SendGrid support**: Integrate with SendGrid for reliable cloud-based email delivery.
- **Microsoft Graph support**: Send emails through Microsoft 365 using Microsoft Graph API.
- **Twilio support**: Send SMS notifications via Twilio gateway.
- **Async delivery with retry policy**: The module implements asynchronous delivery with a built-in retry policy using Hangfire and Polly. Failed notifications are automatically retried with exponential backoff to ensure reliable delivery.
- **Notification activity logs**: All notification activities are logged, including delivery status, send attempts, and error messages.
- **File system template loader**: Load notification templates from the file system for easier version control and deployment.
- **Export/Import support**: Export and import notification configurations for backup and migration purposes.
- **SQL Server**: Primary database provider (default)
- **PostgreSQL**: Full support for PostgreSQL databases
- **MySQL**: Full support for MySQL databases

## Documentation

- [Notification module user documentation](https://docs.virtocommerce.org/platform/user-guide/notifications/overview/)
- [Notification module developer guide](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Notifications/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Notifications)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-notification/)
- [Liquid as Primary Template Language](https://community.virtocommerce.com/t/liquid-as-primary-template-language/78)
- [Creating Email templates](https://docs.virtocommerce.org/platform/user-guide/notifications/notification-templates/)
