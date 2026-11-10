# State Machine (`VirtoCommerce.StateMachine`)

> Provides core functionality for entity's State Machine

- Latest version: 3.1003.0 (needs platform 3.1007.10)
- Repository: https://github.com/VirtoCommerce/vc-module-state-machine
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.StateMachine`

## For business analysts

Configurable status flows — which state a document can move to, from where, and who may do it.

## For architects

Four entities and 21 migrations over one dependency, with seven permissions. It exists so an order or quote lifecycle becomes configuration rather than a switch statement in five modules.

## For developers

Define the machine as data and drive transitions through it; the alternative is status logic scattered across handlers. One declared event marks transitions for downstream automation.

## Use it when

- Status flows differ per business and change over time
- Transitions need permissions and validation
- Several modules should share one lifecycle definition

## Do not use it when

- Two statuses that never change — a field is enough
- The flow is a long-running orchestration with waits: that wants a workflow engine
- You expect it to move documents itself: it governs transitions, it does not schedule them

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1000.0

## Owns these entities

- `StateMachineDefinitionEntity`

## REST controllers

- `api/statemachine` · 15 actions · [vc-module-state-machine/src/VirtoCommerce.StateMachineModule.Web/Controllers/Api/StateMachineController.cs](https://github.com/VirtoCommerce/vc-module-state-machine/blob/dev/src/VirtoCommerce.StateMachineModule.Web/Controllers/Api/StateMachineController.cs)

## Permissions

- `statemachine:access`
- `statemachine:create`
- `statemachine:delete`
- `statemachine:fire`
- `statemachine:localize`
- `statemachine:read`
- `statemachine:update`

## Settings

- `StateMachineModule.StateMachineAttributeKeys`
- `StateMachineModule.StateMachineLanguages`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 21.

## Business features it serves

- **Configurable status flows** (Orders & fulfilment): The states an order or quote can move through, changed as the business changes.

## Key features

- **Configurable State Machines**: Define custom workflows for any entity type in your system
- **Visual State Machine Editor**: Intuitive drag-and-drop interface for creating and editing state machines
- **Conditional Transitions**: Set up complex business rules with transition conditions
- **Custom Actions**: Implement custom logic for state transitions and entity operations
- **Multi-language Support**: Localize state and transition names for global applications
- **Entity Type Registration**: Easily bind state machines to any business entity
- **Extensible Architecture**: Register custom conditions and actions through the modular framework
- **Operator & Vendor Portal Integration**: Seamless integration with both admin and customer portals
