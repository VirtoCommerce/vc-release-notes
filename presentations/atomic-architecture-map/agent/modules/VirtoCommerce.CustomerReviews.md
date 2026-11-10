# Rating and Reviews (`VirtoCommerce.CustomerReviews`)

> Enables customers to share their feedback on products and vendors after making a purchase, helping others make informed decisions.

- Latest version: 3.1011.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-customer-review
- Area: Customer
- On the map: `#/molecule/VirtoCommerce.CustomerReviews`

## For business analysts

Ratings and written reviews on products, with moderation before they appear.

## For architects

Ten required dependencies — surprising for a review module, and the reason is that a review touches catalog, customer, order (verified purchase) and notifications. Four entities, ten settings for moderation and rating rules, two GraphQL builders for the storefront.

## For developers

Three declared events cover submission and moderation, which is where notification and recalculation hang. Aggregate ratings are derived — decide deliberately whether they are computed live or projected into the index.

## Use it when

- Social proof is a requirement and moderation is not optional
- Reviews must be tied to verified purchases
- Ratings should be filterable on the storefront

## Do not use it when

- You only need a star field on a product — that is a catalog property
- Reviews live in an external service that owns moderation
- The host must stay small: ten dependencies say otherwise

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1006.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Commerce Profile Experience API](VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`) ≥ 3.1020.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1023.0

## Owns these entities

- `CustomerReviewEntity`

## Events it publishes

- `ReviewStatusChangedEvent`

## Events it handles

- `OrderChangedEvent`
- `ReviewStatusChangedEvent`

## REST controllers

- `api/customerReviews` · 9 actions · [vc-module-customer-review/src/VirtoCommerce.CustomerReviews.Web/Controllers/Api/CustomerReviewsModuleController.cs](https://github.com/VirtoCommerce/vc-module-customer-review/blob/dev/src/VirtoCommerce.CustomerReviews.Web/Controllers/Api/CustomerReviewsModuleController.cs)
- `api/rating` · 2 actions · [vc-module-customer-review/src/VirtoCommerce.CustomerReviews.Web/Controllers/Api/CustomerReviewsModuleRatingController.cs](https://github.com/VirtoCommerce/vc-module-customer-review/blob/dev/src/VirtoCommerce.CustomerReviews.Web/Controllers/Api/CustomerReviewsModuleRatingController.cs)

## GraphQL builders

- [vc-module-customer-review/src/VirtoCommerce.CustomerReviews.ExperienceApi/Queries/CanLeaveFeedbackQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-customer-review/blob/dev/src/VirtoCommerce.CustomerReviews.ExperienceApi/Queries/CanLeaveFeedbackQueryBuilder.cs)
- [vc-module-customer-review/src/VirtoCommerce.CustomerReviews.ExperienceApi/Queries/CustomerReviewQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-customer-review/blob/dev/src/VirtoCommerce.CustomerReviews.ExperienceApi/Queries/CustomerReviewQueryBuilder.cs)

## Permissions

- `customerReviews:delete`
- `customerReviews:ratingRead`
- `customerReviews:ratingRecalc`
- `customerReviews:read`
- `customerReviews:update`

## Settings

- `CustomerReviews.Calculation.Method`
- `CustomerReviews.CanSubmitReviewWhenHasOrder`
- `CustomerReviews.CustomerReviewsEnabled`
- `CustomerReviews.CustomerReviewsEnabledForAnonymous`
- `CustomerReviews.CustomerReviewsEnabledRequestReviewJob`
- `CustomerReviews.CustomerReviewsRequestReviewCronJob`
- `CustomerReviews.CustomerReviewsRequestReviewDaysInState`
- `CustomerReviews.CustomerReviewsRequestReviewMaxRequests`
- `CustomerReviews.CustomerReviewsRequestReviewOrderInState`
- `CustomerReviews.ReviewMaximumImages`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 18.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Ratings & reviews** (Catalog & discovery): Shoppers rate and review products, with moderation before anything appears.

## Key features

- **Review lifecycle management** — create, update, moderate (approve/reject/reset), and delete reviews through the Admin Portal or REST API.
- **Rich review content** — title, body, numeric rating, and up to N attached images per review (configurable).
- **Rating aggregation** — pluggable rating calculators with two built-in strategies: `Average` and [Wilson lower bound](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html). Ratings are computed per entity and per store.
- **Multi-store and store-agnostic support** — each store maintains its own ratings and can be configured independently; non-store-scoped reviews are also supported.
- **Flexible entity model** — reviews are keyed by `EntityId` + `EntityType`, so additional object types (vendor, order, custom objects) can be registered without modifying the module's source code.
- **Anonymous vs. authenticated reviews** — per-store toggle to allow or require a signed-in user.
- **"Purchase-verified" reviews** — optional store-level rule restricting reviews to customers who have previously ordered the product.
- **Email review reminders** — recurring Hangfire job that emails buyers after their order reaches a configured status (e.g. `Completed`), prompting them to leave feedback. Reminder cadence, eligibility window, and the maximum number of reminders per customer are all configurable.
- **GraphQL (xAPI) integration** — storefront-facing GraphQL schema for querying reviews, checking whether the current user can leave feedback, and submitting new reviews.
- **Image uploads** — integrates with `VirtoCommerce.FileExperienceApi` / Assets for a dedicated `review-images` scope.
- **Event-driven integrations** — publishes `CustomerReviewChangeEvent`, `CustomerReviewChangedEvent`, and `ReviewStatusChangedEvent` so other modules can react to moderation changes and rating recalculations.
- **Multi-database support** — ships with EF Core providers for SQL Server, PostgreSQL, and MySQL.
- **Permissions-aware Admin UI** — fine-grained permissions for reading reviews, updating, deleting, reading ratings, and triggering rating recalculation.

## Documentation

- [Rating and Reviews module user documentation](https://docs.virtocommerce.org/platform/user-guide/rating-reviews/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Reviews/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.CustomerReviews)
- [Reviewing products on Frontend](https://docs.virtocommerce.org/storefront/user-guide/account/review-products)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-customer-review)
