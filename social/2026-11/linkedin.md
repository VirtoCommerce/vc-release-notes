# Virto Commerce — November 2026 release notes

Stable 16 is the first Virto release shipped as a machine-readable module kit that AI coding agents can read directly. The agent analyzes upgrade impact across your codebase, drafts one PR per module, and runs the end-to-end check on a live stack before handing each PR back for review. Five modules join the stable line for the first time.

Other updates from the month:

• Admin Shell. The AngularJS admin UI moves out of Platform core into its own module. Admin Shell is a Vue-based preview at /apps/admin-shell/. It uses a strangler pattern: modules move screens to Vue in a server-built menu, and unmigrated screens run in an embedded frame. Platform package: 37 MB, down from 58 MB.

• Frontend Next. A redesigned Vue theme, built alongside the current one. No forced migration.

• Three new sign-in paths. OTP by email, WebAuthn passkeys, and multi-factor authentication. Each is configurable per store and separately for the Backoffice.

• Returns. Buyers see every decision in-app, including the decline reason. Organization maintainers see every return filed in the organization. Marketplace vendors handle their own returns in the vendor portal.

• UCP agent checkout. The agent signs the buyer in and builds the cart under their identity. B2B contract prices and assortment apply, anonymous carts merge into the account cart, and spoofed buyer IDs receive a 403.

• Sales Rep Hub ships as the first Module Federation plugin. It loads only when the module is installed and the store setting is on, so there is no bundle cost when it is off.

The 34-slide interactive deck lets you mark the features that matter for your team, then export a Markdown table ready to paste into Jira, Linear or GitHub Issues.

https://virtocommerce.github.io/vc-release-notes/2026-11/

Source notes: https://www.virtocommerce.org/t/virto-s-release-notes-november-2026/867

#VirtoCommerce #B2BCommerce #ComposableCommerce #ReleaseNotes
