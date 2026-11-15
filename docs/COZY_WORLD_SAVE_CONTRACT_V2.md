# Cozy world V2: one economy, migration and recovery contract

Date: 15 November 2026. Scope: P3–P7 domain and storage implementation. Browser acceptance and deployment are recorded by the release owner separately; the checks in this document are pure Node domain/storage checks.

## Authority and identity

`game/client/cozy-domain.js` implements the new cozy economy. `cozy-placement.js` implements invisible footprint and entrance calculations. `cozy-storage.js` owns one authoritative local snapshot at `myfarmtwin.cozy.save.v2`. The new primary contains both economy and layout, so a building purchase or move cannot commit money without committing placement. The application wraps mutations in the existing `myfarmtwin.save.write` Web Lock. Browsers without a writable lock can inspect and export data.

Opening, camera navigation and export are read-only. Fresh farms have 120 coins, 120 L, three lettuce seeds, 24 owned active beds, a public market, and a dawn clock at hour 6. Existing farms retain their exact native tick and wallet. Automatic runtime play is a transient UI choice and begins paused on each open; there is no offline accrual or offline punishment.

Each bed, facility, animal/cohort and stored lot has a stable ID. A move changes only that placement's x/z/rotation; contents, ownership, upgrades, production and money remain unchanged. A newly purchased additional building is empty. The first explicitly started barn, coop, goat shelter or pond grants its finite starter kit once per kind, tracked in `progression.startedKinds`. Viewing an area grants nothing.

## State and API

The strict state discriminator is `{format:'MyFarmTwinCozy',version:2}`. Its top-level fields are revision, tick, seed, rng, weather, coins, water, careCredits, seeds, plots, inventory, ledger, stats, progression, orders, land, layout, facilities, nextLot and provenance. Unknown fields and future versions are rejected. IDs, numeric bounds, collection bounds, plot/layout ownership, facility/layout references, animal uniqueness, wallet/last-ledger agreement and placement validity are checked before persistence or import.

- `plots` retain the native plot shape and crop fractional progress, quality and planting tick. The authoritative free placement is in `layout.items`; it does not depend on old fixed grid coordinates.
- `inventory` records `{id,type,quantity,quality,sourceId,value3000}`. Milk quantity is mL; fish quantity is grams; other goods use whole item counts. `value3000` is the lot's exact monetary amount in 1/3000 coin units. Legacy stored lots keep their native valuation, while newly created lots use the new balance. A partial order removes proportional value from the lot and keeps its remainder.
- `facilities` record identity/kind/level, finite feed/water reserves and trough contents, cleanliness, auto/shade/enabled flags, production hours, pending products and animals. `pendingLots` keeps original pending egg grade/value until collection. `foragePlots` and `forageG` retain owned goat pastures and their live forage separately from purchased hay.
- `progression` records XP/level, achievements, completed orders, started kinds, `credit3000` and `debtCoins`. `credit3000` preserves old fractional milk proceeds and unused paid service. It is spendable before wallet coins. Whole-wallet coins do not change merely because a legacy farm is opened or migrated. Fish operating/restocking debts are retained and can be repaid explicitly.
- `provenance.native` and `provenance.layout` carry exact original strings, including detailed history and mechanics removed from active play. They remain available in the portable backup; they are not re-simulated or silently regenerated.

`CozySession(storage,{writable})` exposes `state`, `layout`, `status`, `readOnly`, `backupAvailable`, `command(type,args)`, `advance(hours)`, `build(kind,transform)`, `move(id,transform)`, `previewPlacement(candidate)`, `exportBundle()`, `exportLegacy()`, `importBundle(text)` and `recoverBackup()`.

Commands include plant/water/waterAll/harvest/harvestAll, buySeed/refill/recovery, start/build/move, feed/waterFacility/clean/buyFeed/collect/buyAnimal/sellAnimal, upgrade/toggleAuto/togglePump/toggleAerator, sell/sellAll/discard/order/refreshOrders, repayDebt and expand. Every accepted command advances one revision. A rejected command returns the exact original state. Quotes from `quoteLot` and `quoteAnimal` are revision- and price-bound. Unknown command fields, executable nested objects and forged prices are rejected.

## Native V0–V6 and P2 mapping

The existing strict `deserialize()` remains the versioned native reader, followed by `activateGarden()` so all supported old saves gain 24 beds while retaining their original garden data. Frozen native fixtures V0–V5 and legitimate-dispatch V6 fixtures are under `game/tests/fixtures/`.

| Native holding or capability | Active V2 mapping and retained evidence |
| --- | --- |
| Coins, water, seed counts, care credits, tick/weather/RNG | Exact values mapped. No migration reward, fee or clock advance. |
| Existing plots, crops, history and garden lots | Every plot record retained; existing crop progress/quality unchanged. All 24 bed IDs have placements. Old stored crop sale values are preserved separately from new crop prices. |
| Native ledger, missions, followups and completed orders | Ledger tail retained for UI, cumulative income/expense calculated from the full native ledger. Mission/followup achievement IDs and completed order IDs retained; full exact ledger/history also remains in provenance. |
| P2 moved beds/buildings/decor | Exact valid positions/rotations retained. Layout-only saves are also migrated; unowned P2 barn/pump placeholders do not become ownership. The new public market is placed around owned placements. |
| Chicken hens, feed stock/trough, water, cleanliness, pending eggs and inventory | IDs/counts/resources retained without rounding valid fractional feed/water. Old pending egg grade/value remains frozen until collected. Existing egg lot values use original A/B/C prices. |
| Coop capacity/auto feeder/shade | Existing level and effective auto capability retained; a legacy auto feeder implies at least the new automation-capable level. Shade stays owned. |
| Goat herd, purchased hay, feeder, water and growth/condition | Every ID/growth/condition and resource retained. A native starter-water voucher is already inside native shared water and is not granted again. |
| Paid goat paddocks and remaining forage | `foragePlots` keeps owned count and `forageG` keeps exact summed biomass. Each owned plot regrows 25 g/game-hour, capped at 9,000 g/plot. Automatic shared grazing replaces manual paddock rotation; forage is consumed before trough hay. Old active-paddock/history values stay in provenance. |
| Goat shelter/care upgrades | Shelter capacity level retained; care upgrade enables the corresponding new automatic-care capability. |
| Cows, lactation, milk reservoirs, feed/water pools and barn | Every cow ID and ready milk amount retained. Dry cows remain nonproducing. Normal/starter/recovery supply pools are aggregated once into the appropriate reserve or trough without duplication. Existing barn/trough/sanitation upgrades give active upgraded capacity/automation; shade remains owned. |
| Stored milk and cooler | Remaining volume and current effective native grade determine exact old lot value. Rejected/spoiled milk stays quality/value zero and cannot be sold or used for an order. Cleaning or collecting never refreshes it. New produce has no time spoilage, so legacy cooler/sanitation ownership is retained as achievements/provenance and its protection becomes the new baseline. Unused paid cooler hours are credited separately. |
| Fractional milk sale proceeds | Native `milkRevenueRemainder/1000` becomes `credit3000` by multiplying the numerator by 3. Sales retain later fractional proceeds rather than deleting or rounding them upward. |
| Active/completed cow delivery | The accepted unfinished native order is added with the same ID, required milk volume and bonus. Completed IDs stay completed. The new cozy delivery uses saleable milk without the removed scientific grade checklist. |
| Fish ponds, cohorts, quantities, mass, condition and lots | Every owned pond and cohort ID/count/mass retained. Native stored fish lots keep exact prior sale value. Existing efficient/filter/feeder upgrades map to upgraded level/automatic feeding; aerator state remains enabled/disabled. |
| Fish reserve water | Exact reserve maps to `waterStockMl`. `waterFacility` on a pond exchanges up to 200 L, taking reserve water first, improves cleanliness and keeps basin volume unchanged. The button is distinct from filling an animal drinker. |
| Paid cooler/aerator/filter service | Credit denominator is 3000: cooler 500 units/remaining hour; basic air 500, efficient air 250; filter 125. This preserves remaining current-rate service value while new service no longer charges recurring fees. |
| Fish advance/recovery debt | Existing restocking advance plus native `fishSupportAccount(...).debtCoins` remains `progression.debtCoins`. Repayment is explicit, interest-free and recorded in the ledger. New cozy recovery does not create hidden loans. |
| Detailed chemistry, source-specific grant counters, receipts and science histories | Exact native bytes remain in provenance and the on-device original archive. The active replacement is readable needs, finite stock, mild production delay, no permanent death and no offline penalty. Removed counters are not claimed to remain active scientific simulation. |

The new balance is fictional game balance. Lettuce/tomato/corn base cycles are 18/30/42 active game-hours; hens lay on eight healthy hours, cows produce each shared hour, and young goats/fish grow over shorter active sessions. Missing care slows production and lowers condition within recovery floors. There is no breeding or permanent animal death.

Supported native fish become harvestable at 500 g with either the starter-ready source or at least 240 hours of age (`fishStage`/`fishReady`); native validation caps live per-fish mass at 500 g. There is no supported native harvest-ready fish below 500 g. Every previously ready cohort therefore remains ready under the new 500 g rule, and the old age wait is removed. Accepted Cozy backups can contain heavier fish: clock advancement retains that mass and never decreases their saved growth. Harvest records their complete actual mass. Goat growth is likewise monotonic, including a lack-of-care clock advance.

Automatic care tests actual transferable water, so a harmless remainder below 1 mL cannot abort the clock. Facility levels are bounded to 0–3 at import as well as purchase: the highest animal capacities are six cows, eleven goats and twelve hens, matching the production interior anchors. Supported native coop/shelter levels and mapped pond/barn upgrades fit this range.

## Transactions, safe import and recovery

Primary key: `myfarmtwin.cozy.save.v2`. Rolling backup: `myfarmtwin.cozy.backup.v2`. Original archive: `myfarmtwin.cozy.original.v2`. Import and corrupt-recovery preimages use `myfarmtwin.cozy.before-import.v2` and `myfarmtwin.cozy.before-recovery.v2`.

Before any first write the exact legacy native/layout/current Cozy strings are archived and read back. Before replacing a valid Cozy primary, its exact bytes are written and verified as the rolling backup. Only then is the validated new primary written atomically. State is published in memory after the durable write. Quota/archive/backup failure leaves the previous authoritative snapshot and old source untouched; incidental successfully written recovery metadata may remain.

Mutations compare the primary, legacy native, P2 layout and P2 transaction-journal strings with the opening snapshot. A stale tab or an old game writing those keys blocks the mutation instead of overwriting progress. The application also listens for relevant storage events. A pending old two-key journal blocks the new writer until that earlier operation is resolved; it is never guessed away.

Portable text format is `{format:'MyFarmTwinCozyBackup',version:2,state:...}`. Native V0–V6 strings and P2 `{format:'MyFarmTwinGLBPrototype',version:1,native,layout}` bundles are also accepted. Text is bounded to 8 MB and the entire state is validated before writes. The UI confirms replacement and lets the player keep an export first. Corrupt primary data can be explicitly replaced by a valid text backup after preserving the corrupt bytes. A future version is always protected: neither import nor rolling-backup recovery downgrades it. Invalid text, collisions, unknown fields, nonfinite values and stale quotes cannot change the primary.

`recoverBackup()` validates the prior snapshot and archives a corrupt current primary before restoring it. The known-good backup is not overwritten with corrupt data. Normal accepted backup recovery can intentionally step back one action; it is an explicit player action.

## Rollback boundary

The original `myfarmtwin.save.v1` and P2 sidecar are never overwritten by V2. Their exact original bytes are also in the archive and portable provenance. Returning to V6 code can therefore show the migration-point native farm, while the newer V2 progress remains safely retained under its separate key. V6 code cannot interpret later V2 production/builds; this is not a reverse simulation or an automatic merge.

A compatible production rollback must retain the V2 reader/data controls, or explicitly restore the archived native snapshot while preserving/exporting the newer V2 snapshot for later resumption. Merely claiming that old code reads new progress would be incorrect. HTML care/data controls remain available when GLB rendering fails; model failure does not reset the save. Release documentation must name the actual tested rollback artifact or recovery procedure.

`/play/recovery/` also exposes an explicit pending-P2-save completion. Its handler creates a fresh `PrototypeSession` inside the same Web Lock and uses `recoverPending()` only when the journal is valid and nonconflicting. It finishes recorded native/layout afterimages without replaying a purchase. Before first V2 activation, migration then sees that coherent pair. With an existing V2 primary, that primary remains unchanged and active; late cached-P2 changes stay in the native/layout branch and are not merged automatically. Both the complete V2 backup and the currently stored P2 bundle can be exported for inspection or a deliberate later import. The original V2 provenance continues to identify the first migration source. A corrupt, future or conflicting journal is retained and cannot be cleared by this button.

## Verification

`game/tests/cozy-world-domain.test.mjs` and `cozy-world-storage.test.mjs` cover frozen V0–V6 migration, rich all-area ownership/values/credits, P2/layout-only placement, exactly-once starters, all production/sales/orders, no-death care consequences, preserved facility contents during moves, collision/access, credit spending, quote staleness, old spoiled milk, pending egg value, pond reserve use, upgrades/extra buildings/land, strict imports, archives, quota, backup, stale tabs, corrupt recovery and future-version protection. Domain and storage tests do not launch a browser. Actual visual/game UI testing is performed separately in the internal browser only.
