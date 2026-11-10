# Task Management (`VirtoCommerce.TaskManagement`)

> Headquarters personas can use task management to create task lists for retail stores, and to track status by store or worker.

- Latest version: 3.1007.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-task-management
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.TaskManagement`

## For business analysts

Work assigned to people inside the platform — tasks with owners, due dates and completion.

## For architects

Two entities and eight migrations over three dependencies, with four declared events, one GraphQL builder and seven permissions. Notifications is in its dependency chain because a task nobody is told about is not a task.

## For developers

Four events make assignment and completion subscribable — the hook for escalation. Model your own workflow's human steps as tasks rather than as statuses on a document.

## Use it when

- A process needs a human step that must not be forgotten
- Approvals or reviews should be tracked and chased
- Work has to be assigned and reported on

## Do not use it when

- The step is automatic — that is a job or an event handler
- You need a full BPM engine with parallel branches
- Tasks would duplicate a system the team already uses

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1015.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1010.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1009.0

## Owns these entities

- `WorkTaskEntity`

## Events it handles

- `WorkTaskChangedEvent`

## REST controllers

- `api/task-management` · 11 actions · [vc-module-task-management/src/VirtoCommerce.TaskManagement.Web/Controllers/Api/TaskManagementController.cs](https://github.com/VirtoCommerce/vc-module-task-management/blob/dev/src/VirtoCommerce.TaskManagement.Web/Controllers/Api/TaskManagementController.cs)

## GraphQL builders

- [vc-module-task-management/src/VirtoCommerce.TaskManagement.ExperienceApi/Queries/WorkTasksQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-task-management/blob/dev/src/VirtoCommerce.TaskManagement.ExperienceApi/Queries/WorkTasksQueryBuilder.cs)

## Permissions

- `task:access`
- `task:attachment:management`
- `task:create`
- `task:delete`
- `task:finish`
- `task:read`
- `task:update`

## Settings

- `TaskManagement.TaskAppUrl`
- `TaskManagement.TaskNotificationNoReplyEmail`
- `TaskManagement.TaskNotificationsEnabled`
- `TaskManagement.TaskTypes`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 8.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Approvals & assigned tasks** (Orders & fulfilment): Human steps in a process get an owner, a due date and a record.

## Key features

- Role-Based Security & Permissions
- Configurable Task Types - predefined task types such as Registration Review, Order Review, Order Processing, Product Catalog Management, Pricing and Promotions, Content Management, Customer Support, and more.
- Notification Settings:
- Enable or disable task notifications.
- Configure a no-reply email address for notifications.
- Set the base URL for task-related application links in notifications.
- Embedded Task Management UI - provides a user-friendly interface for managing tasks directly within the Virto Commerce platform.

## Documentation

- [Task Management module user documentation](https://docs.virtocommerce.org/platform/user-guide/tasks/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.TaskManagement)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-task-management)
