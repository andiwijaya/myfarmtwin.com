# Chicken state/API and verification contract

The version3 PRD in PRD_MYFARMTWIN_CHICKEN_FARM_V1.md is the living58-item acceptance list. CHICKEN_PROGRESS.md records proof and a commit per completed item. The original crop PRD and all legacy fixture bytes remain intact. Implementation order is strictly sequential; incomplete milestones are local only, never deployed. M3 full play and M4 migration/concurrency are mandatory stop-and-fix gates; final release also requires M5/M6 and actual live verification.

## Additive model and commands

Plan one Chicken subtree on the existing engine state: visited/grant IDs, one coop with level/feedG/waterL/cleanliness/gradual care adequacy/upgrades/nest, stable adult hen IDs and last-lay-day markers, egg inventory lots and counters, separate chicken mission/stats/history. Use configuration for every capacity/cost/rate. No goat/cow/fish gameplay fields, second wallet, second calendar or weather forecast.

Use existing dispatch revision/idempotency and immutable-return semantics for enterYard, feedHens, waterHens, cleanCoop, collectEggs, sellEggs, buyFeed, upgradeCoop, buyHen, upgradeFeeder, toggleFeeder, addShade, chickenOrder and bounded recovery. Every resource transfer conserves stock and every monetary change appends the existing ledger; only explicit validated commands mutate stock. Egg sampling is deterministic per seed/day/hen and never changes crop weather RNG. Render/area/camera changes do not dispatch simulation commands.

M1 presentation prototypes use explicit view snapshots while headless mechanics are introduced in M2. Before M4, any unsupported expanded save must fail closed and preserve existing V1 bytes, never silently drop Chicken state or reset. The branch is not publishable during this interval. M4 installs the strict complete V2 codec/migration/backup path and removes that limitation before release. Milestone checks must describe actual scope rather than claiming production or persistence early.

## Feature flag / rollback

`game/client/features.js` exports immutable `FEATURES.chicken`. It is enabled only in this isolated working branch; no partial feature is published. It will gate yard entry, Chicken commands and hourly consumption/laying. A rollback build may set it false, rebuild and deploy through the existing pipeline while keeping V2 validation/migrations and its stored subtree. Hidden Chicken data stays present and unchanged; crop play stays operational. Do not remove/rename storage keys, overwrite a newer envelope or reset/import a blank farm as rollback. Old V1 code rejects V2 rather than converting it destructively. Redeploy a V2-capable build to resume.

## Stable browser verification surfaces

Area entry: `#area-field`, `#area-chicken`; one `#world` and one context panel. Yard shapes: `[data-chicken-object=coop|feeder|drinker|clean|nest]`; hens `[data-hen]`; eggs `[data-egg]`. Equivalent HTML object shortcuts use `[data-choose-chicken]`.

Care: `#chicken-panel`, `#chicken-feed`, `#chicken-water`, `#chicken-clean`, `#chicken-collect`; status counters/data attributes must reflect the engine. Market: `#buy-feed`, `[data-sell-eggs]`, `#upgrade-coop`, `#buy-hen`, `#upgrade-feeder`, `#toggle-feeder`, `#add-shade`, `#chicken-order`. Guide uses the existing single FarmGirl guide slot, not a second simultaneous crop tutorial.

Camera: existing `[data-camera=in|out|reset]` plus `left/right`; shared projection, bounded per-area view; targets/picking and fixed build footprints verified after all rotations. No save revision/clock/RNG/resource changes from view control. Accessible naming,44px targets, keyboard, touch, small/landscape screens and reduced motion are verified.

QA: headless chicken tests cover bounds/replays/causal ordering/economy/clock; frozen V1 fixture test is the crop replay oracle; browser Chicken runner covers each new end-to-end feature; existing local commands remain regression gates. All browser contexts are fresh and isolated. Evidence stays in task-2/qa/chicken outside Git. No manual Product Owner testing, routine approval or GitHub Actions.
