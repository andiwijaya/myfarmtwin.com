# MyFarmTwin full GLB world: P3-P7 acceptance matrix

Date: 15 November 2026 (WIB). Status: executable acceptance specification and valid fixture sources; full-world browser/release checks are pending.

This matrix follows `PRD_MYFARMTWIN_GLB_UPGRADE_V1.md`, including the later authorization to finish P3-P7. The product is a warm, semi-realistic Indonesian tropical farm with all visible world models from GLB, all five farming areas plus market, continuous orbit and interiors, free farm arrangement, simple cozy/business play, and preservation of existing progress.

The owner now requires **only the Codex internal browser** for visual and interaction tests, with no desktop takeover. Older standalone Playwright receipts are historical/exploratory evidence, not acceptance evidence for the new full-world build. Do not launch them for this matrix. Tests that require owner approval, including upload/download flows, remain skipped rather than triggering a permission prompt.

## Evidence rules

- Use only synthetic QA farms on an isolated origin/session. Never mutate a personal browser profile or a player's saved farm.
- Record the source/build receipt, GLB manifest hash, URL/origin, locale, viewport, graphics profile, start/end time, fixture hash, and exact result for every accepted group.
- Run read-only camera checks on a paused fixture, then compare the complete protected save/layout/export, not just coins or animal counts.
- Record failed attempts and retained screenshots. A repaired implementation requires a fresh passing check against that repaired artifact.
- Emulated phone viewports prove responsive layout and input behavior only. They do not prove physical Android/iOS GPU, display FPS, battery, heat, or Safari behavior.
- Label checks separately as source/unit, actual internal-browser interaction, HTTP/resource-integrity, performance observation, or unavailable. A source assertion does not replace a browser check.
- An asset format validator does not establish close-up quality. Overview, medium, and close-up screenshots must be inspected from the actual game.
- A deployment initiation is not a completed release. Public resource hashes and an actual internal-browser live journey are required before P7 is marked complete.

## Valid synthetic fixture sources

Run `node tools/cozy-world-fixtures.mjs` to regenerate the canonical committed fixtures in `game/tests/fixtures/cozy-world/`. It performs no browser, external network, or personal-storage operation. Add `--qa` to mirror the canonical outputs and frozen legacy inputs to `qa-artifacts/cozy-world/fixture-source/` for internal-browser work. Tests on a fresh clone must use canonical fixture paths, not ignored QA output.

| Fixture | Purpose and validation |
| --- | --- |
| `v0-fresh.json` | Exact frozen legacy V0 source bytes; strict native deserialization and additive migration expose 24 beds. |
| `v1-mixed.json` | Exact frozen V1 source; original crop state, funds, inventory, history, RNG and mission preservation. |
| `v2-mixed.json` | Exact frozen V2 source; adds chicken ownership/supplies/eggs/progress. |
| `v3-mixed.json` | Exact frozen V3 source; adds goats, paddocks, supplies and sale history. |
| `v4-mixed.json` | Exact frozen V4 source; adds cows, reservoirs, milk lots, cold storage and native accounting. |
| `v5-mixed.json` | Exact frozen V5 all-area source; adds fish cohorts, lots, water/air/feed balances and upgrades. |
| `v6-fresh.json` | Current `createState()` serialized through the native V6 validator; 24 active empty beds, no unearned livestock. |
| `v6-all-areas-baseline.json` | Strict V5 migration plus `activateGarden`, with every existing native field retained. |
| `v6-rich-all-areas.json` | Rich V6 state made by real native dispatch from the valid V5 source; exact serialized roundtrip passes. |
| `p2-rich-moved-layout.json` | Valid P2 sidecar: moved/rotated bed and barn, plus bounded free path/fence/banana kit placements. |
| `p2-rich-moved-bundle.json` | `MyFarmTwinGLBPrototype` V1 bundle with the entire rich native JSON string and validated moved layout. |
| `dispatch-recipe.json` | Source path/hash, every accepted native command and all P2 layout operations, plus result hash. |
| `v6-rich-summary.json` | Readable resource/ownership/order inventory for independent import comparison. |
| `manifest.json` | Byte sizes and SHA-256s of the fixture files, source provenance and validator scope. |

The original frozen V0-V5 fixtures remain under `game/tests/fixtures/unified-world/` and are referenced by path/hash in the manifest instead of duplicated in the committed cozy fixture folder. The optional QA mirror copies their bytes without modification. The rich fixture never edits native money, yields, identities, production, histories, orders or balance fields directly. Every purchase, harvest, upgrade and completion uses `dispatch`. Its native source remains an independently valid V6 save.

The generated rich fixture has **454 coins, 24 beds, four hens, four goats, three cows, two fish ponds and four live fish**. It deliberately includes crop inventory, new plants and mature corn, chicken inventory plus pending eggs, old spoiled milk plus fresh milk, fresh harvested fish, paid upgrades, supply stores, prepaid cooler/aerator/filter service ticks, completed crop/chicken orders, completed `cow.delivery` and active `cow.volume`. Exact values are in the summary and manifest; they are synthetic fixture facts, not player holdings or live data.

## Required legacy mapping and preservation

For a changed mechanic, record old field -> active new field/benefit -> unit conversion -> retained original evidence. A raw archive alone does not show that the player can use owned assets in the new game. Any unavoidable loss or conversion needs an explicit, reviewable compensation rule before release.

| Source value | Active preservation requirement / common failure |
| --- | --- |
| `coins`, `water`, `seeds` | Keep exact funds and owned quantities. Water is litres. Do not round down fractional owned quantities silently or invent a second wallet. |
| 24 `plots`, crop type/progress/stage/quality, soil water | Keep stable bed IDs, all 24 usable beds, readiness, moisture and crop quality/value. A mature crop stays harvestable after migration. |
| Crop `inventory` lots | Keep each quantity and quality. Do not respawn sold produce from ledger history. |
| Chicken `hens`, `coop.pending`, `inventory` | Preserve live hen IDs/counts and both pending and collected graded eggs without counting an egg twice. `lastLayDay`/next production cannot create an immediate duplicate grant. |
| Chicken feed store + coop feed/water, feeder ownership/ON, shade/coop level | Convert grams/litres explicitly; stored and delivered supplies remain separately owned quantities or a documented pooled equivalent. Installed equipment must not require repurchase. |
| Goat active `herd` versus `sales` | Import only active animals, retain growth/condition/age and IDs. Historical sold goats are not live animals. Future IDs cannot collide with imported IDs. |
| Goat hay/feeder/water, shelter/care levels, paddocks/active paddock | Preserve paid capacity, consumables, forage and access. Moving shelter retains the herd and supplies. |
| Cow IDs and `milkReadyMl` | Preserve every live cow and its individual reservoir. Convert **mL to L once**, not zero or 1,000 times too much. |
| Cow milk lots: amount, grade, `freshnessScore`, storage | Keep amounts and status. The fixture's zero-freshness milk remains spoiled/unsellable or receives an explicit compensation rule; it must never become new full-price fresh milk. |
| Cow `milkRevenueRemainder` | Preserve fractional accrued value in an equivalent credit/carry field or state an explicit compensation rule. |
| Cow supplies/starter/recovery rations, troughs, barn upgrades/cooler/paid ticks | Keep all owned supplies and installed capacity without replaying the finite starter kit or losing prepaid service benefit. |
| Fish ponds and active cohorts | Preserve pond IDs/counts, cohort counts/species/mass/condition, including partial harvest remainder. Do not include sold/harvested receipt counts as living fish. |
| Fish lots | Preserve count, mass and grade independently of live stock. A harvested fish must not simultaneously remain in the pond. |
| Fish feed/water/air reserves, pending feed, paid air/filter ticks and equipment | Preserve units and prepaid service/ownership; do not turn pond basin water into duplicate sellable/shared water inventory. |
| Missions, completed orders, accepted cow order, grants/reward flags | Retain completion/accepted progress; opening, migration and camera cannot replay a payout. Source-native progress must be inspectable even when new tutorial/goals are separate. |
| Native `tick`, weather/RNG, history/ledger and next IDs | Define time/balance conversion explicitly, retain original evidence, prevent imported IDs and future IDs from colliding. Do not silently reset progress to a fresh farm. |
| P2 layout transforms and kit ownership | Preserve moved bed/barn, rotations and placed kit pieces. Add other full-world areas around valid retained placements; avoid silently resetting old layout to bypass collision validation. |
| Exact original raw native and P2 layout bytes | Archive before the first write/activation. Reads/camera are write-free. A future/corrupt input cannot be converted into an apparent valid fresh farm. |

## P3: gameplay, building and farm management

All rows start **Pending** for the full-world artifact. Parent release evidence should replace the state with an exact passing receipt or a named limitation.

| ID | Fixture / action in the internal browser | Required result | Evidence / status |
| --- | --- | --- | --- |
| G01 | Fresh farm; open each area, orbit, zoom, enter/exit interiors | 24 beds available; only explicitly started owned livestock appear; no economy/save writes from looking | Complete export comparison + screenshots; Pending |
| G02 | Plant each crop, water, advance through real growth, harvest and sell | Readable simple needs; finite growth; costs, stock and revenue reconcile; no duplicate harvest | Before/after state and ledger; Pending |
| G03 | Chicken starter, fill feed/water, clean, wait, collect and sell eggs | One finite starter grant; actual hens, graded production and conserved egg quantities | State/ledger plus actual scene; Pending |
| G04 | Goat starter, feed/water/clean, grow, inspect, quote/sell and restock | Growth/condition affect actual action; sold animal disappears once; purchase is charged once | Animal IDs, quote and receipt; Pending |
| G05 | Cow care, hygiene, milk collection and quoted sale | Reservoir -> lot -> sold amount is conserved, no button-created milk or payout replay | mL/L values, grades, receipt; Pending |
| G06 | Fish stock/feed/water/aeration, grow, partial/full harvest, sale | Living counts/mass and inventory match; partial harvest keeps only the unharvested remainder | Cohort/lot ledger and scene; Pending |
| G07 | Market summary, supplies and paid upgrades in every area | Clear displayed cost before confirmation; wallet/stock changes once; owned capacity works | Before/after whole export; Pending |
| G08 | Complete an order, reopen/reload, revisit same reward | Requirements consumed once, payment once, completion persists | Completed IDs + ledger; Pending |
| G09 | Advance/wait with insufficient care | Consequences remain light, understandable and recoverable; no unrequested permanent animal death | Actual need/status/recovery actions; Pending |
| G10 | Pause/play and explicit time advance | Exactly one authoritative simulation loop; camera/animation changes do not advance production | Time/export observations; Pending |
| B01 | Preview each facility; cancel or Escape | No wallet, stock, layout or ownership change | Full protected-store/export equality; Pending |
| B02 | Confirm a paid facility on valid terrain | Footprint/access/ownership/funds checked; one atomic purchase and placement | Ledger, layout, reload; Pending |
| B03 | Preview overlapping/outside/blocked entrance placements | Clear reason; Confirm unavailable/rejected; no charge or hidden placement | Invalid/valid screenshots + equality; Pending |
| B04 | Move/rotate a stocked facility from rich fixture | All animals, crops, stored goods, upgrades and timers follow stable IDs; move remains free | Full native/value comparison + scene; Pending |
| B05 | Build modular road/fence, return kit/decor, arrange near an entrance | Connections/limits are clear; access remains usable; refunds/kit returns follow stated policy | Layout and matching visible GLBs; Pending |
| B06 | Expand land/capacity | Expansion differs from the 24 already active beds; existing beds never become locked or charged again | Ownership/cost comparison; Pending |
| B07 | New placements after migrated P2 layout | Imported positions stay intact and new areas fit around them; IDs remain unique | Layout validation, manifest, browser; Pending |

## P4-P5: all-model GLB world, camera, visuals and resource behavior

| ID | Check | Required result | Evidence / status |
| --- | --- | --- | --- |
| A01 | Manifest/source/runtime inventory for all areas | Terrain, water mesh, crops, animals, structures, interiors, props and environment originate in GLB | Manifest/hash + actual scene audit; Pending |
| A02 | Validate exported asset structure and external references | Accepted glTF 2.0 resources, finite geometry/animation, embedded/resolved texture dependencies, known provenance | Validator reports with named scope; Pending |
| A03 | Overview, medium and close-up for garden/chicken/goat/cow/fish/market | Coherent warm tropical art, plausible proportions, scale, material response and detail | Actual game screenshots inspected; Pending |
| A04 | All plant stages, animal states and upgraded facilities | Correct native/active new state represented; no absent/miscounted/duplicated animals or ghost sold stock | Fixture/state vs scene comparisons; Pending |
| A05 | Every kandang exterior and interior, all permitted angles | Complete walls/roof/structure/facilities, controlled cutaway, readable lighting, no backface holes | Inspected interior views; Pending |
| A06 | Idle/walk/eat/drink/rest/swim and transitions as supported | Natural joint/contact behavior, no floor/facility penetration, cosmetics do not change production | Internal-browser observations; Pending |
| C01 | Click area/individual object, use accessible object alternatives | Correct target framed considering care panel; no hidden starter purchase/grant | Trustworthy input + save equality; Pending |
| C02 | Continuous 360 orbit, pitch/zoom limits, pan, interior collision | Camera stays above ground, avoids walls/roof and remains controllable | Desktop/touch/keyboard where available; Pending |
| C03 | Back, overview and Reset after repeated area/interior visits | Actual camera, active nav, location label and care context agree | Exact view sequence/screenshots; Pending |
| C04 | Tap a visible model once on a narrow viewport | Selection does not fall through to Plant/Buy when panel scrolls or layout changes | No seed/wallet/state change until explicit action; Pending |
| C05 | Gesture drag/pinch versus click; builder versus camera | Drag does not select/buy, pinch does not place, Confirm is explicit | Actual internal-browser input where supported; Pending |
| U01 | ID/EN, desktop/narrow portrait/tablet/short landscape | No horizontal overflow; native actions and close controls fully reachable, sensible target sizes | Layout/keyboard screenshots; Pending |
| U02 | Reduced motion and page visibility changes | Cosmetic motion/transition adjusts; simulation follows stated pause/visibility policy without duplicate loops | State/time + camera; Pending |
| R01 | Failed GLB or texture load, Retry | Honest error/progress state; care/data stay reachable; retry does not reset or duplicate progress | Injected/controlled failure if internal browser supports it; Pending |
| R02 | Context loss/restoration or unsupported GPU | Clear recovery/unsupported message, no fresh-farm overwrite; export/recovery remains available | Actual supported failure path; Pending |
| R03 | Repeated build previews, crop changes, add/remove/move, area visits | Bounded clone/material/animation/texture ownership; old resources disposed; one active scene/loop | Source+instrumentation with explicit scope; Pending |
| P01 | Chosen desktop reference and dense all-area fixture | Record resolution/DPR/device/quality, load/decode time, frame-time observations, triangles/calls and memory | Measured receipt; targets must be stated before acceptance; Pending |
| P02 | Supported modern phone profile | Record real hardware where available; distinguish emulation from actual GPU/FPS/thermal behavior | Physical proof or explicit unavailable boundary; Pending |
| P03 | Default/High/lighter graphics and progressive loading | All modes remain GLB and ownership-correct; no misleading ready state; reasonable focus-area priority | Actual loading/render behavior; Pending |

## P6: migration, data protection and rollback

| ID | Fixture / operation | Required result | Evidence / status |
| --- | --- | --- | --- |
| S01 | Open V0 through V6 and moved P2 bundle without action | Valid source recognized; 24 active beds; all existing ownership visible/mapped; exact original raw bytes unchanged | Source hashes + mapped whole export; Pending |
| S02 | Activate/migrate rich V6 and P2 bundle, reload twice | Every field family above mapped, originals archived before writing, no repeated grants/compensation | Mapping report + archive hashes; Pending |
| S03 | Rich fixture spoiled/fresh milk, live/harvested fish and pending/collected eggs | Status/value and quantities retained; no duplication or stale stock becoming full-price new stock | Item-by-item quantity/status/value comparison; Pending |
| S04 | Legacy completed/active orders, paid equipment and credits | Progress and installed capability preserved; no re-purchase or reward replay | Flags, active tasks, credits, receipts; Pending |
| S05 | Full text export/import and cancelled replacement | Entire new state/layout roundtrips; confirmation/cancel writes nothing; source archive remains recoverable | Before/after whole-state comparison; Pending |
| S06 | Invalid/oversized/unknown future save or layout, hidden/extra fields | Explicit error/read-only preservation; no silent normalization or fresh-farm fallback | Source/unit + internal-browser invalid text; Pending |
| S07 | Two simultaneous tabs and layout/native races | One accepted revision; stale writer blocked; no overwritten latest state or replayed purchase | Exact snapshots/receipts; Pending |
| S08 | Storage unavailable/quota failure at each write boundary | Previous valid primary/backup/originals retained; in-memory economy not presented as durable success | Deterministic storage unit tests; Pending |
| S09 | Interrupted journal or migration activation | Recovery is explicit/idempotent; no replayed starter/purchase; unrelated later changes block recovery | Failure-point unit receipts; Pending |
| S10 | Recovery from backup, export original, corrupted/newer primary | Valid supported recovery only; never downgrade a newer unknown save or delete unreadable source | Exact bytes + visible error/recovery state; Pending |
| S11 | Production rollback after new save has been written | Compatible reader or rehearsed safe restoration path exists; original and new progress remain recoverable | Actual rollback artifact and rehearsal; Pending |

## P7: release and public verification

| ID | Check | Required result | Evidence / status |
| --- | --- | --- | --- |
| D01 | Final source/branch/host reconciliation | Known intended production source, no unrelated overwritten work, compatible save scope documented | Remote/source receipt; Pending |
| D02 | Package/build integrity | Exact tested artifact, retained notices/provenance, no QA saves/screenshots/traces shipped as game assets | File hashes/artifact manifest; Pending |
| D03 | Static host headers/CSP/cache/MIME | GLB served correctly; only necessary self/blob access; protected HTML; resource policy verified on public responses | Actual HTTP headers and hashes; Pending |
| D04 | Preserve editorial routes and approved original assets | Unrelated homepage/editorial content remains intact; game entry/promo claims accurate | Source preservation + public route check; Pending |
| D05 | Publish authorized final artifact | Hosting returns terminal success for the exact artifact/source; normal concurrency-safe update | Deployment ID/source/URL; Pending |
| D06 | Actual live internal-browser journey | Cold entry, one crop and one animal/market action, camera/interior, save/reload and EN/ID remain functional on isolated synthetic farm | Live source-bound interaction receipt; Pending |
| D07 | Public resource parity and restore readiness | Served build/GLBs match artifact; missing/stale mixed bundles rejected; rollback information usable | HTTP integrity + runbook; Pending |
| D08 | Final checklist and limitations | Completed, failed, skipped and unavailable checks separated; physical-device/voice screen-reader/download limits stated | Final acceptance record; Pending |

## Independent source/domain audit findings

These results are pure JavaScript/Map-store checks, not browser or release acceptance. The owning domain/storage module is still being finalized; rerun its retained test suite on the final artifact/source.

| Finding | Initial observed behavior | Corrected source independently checked |
| --- | --- | --- |
| Fractional legacy consumables | Valid V5/rich V6 import rejected because native hourly feed/forage/water quantities are fractional but new validator required integers | Rich V6 and moved P2 bundle migrate successfully with finite bounded quantities preserved. |
| P2 layout without a native primary | Valid moves/free-kit progress was validated but silently replaced by default layout | Layout-only migration retains moved/rotated bed and placed kit data without inventing a native source archive. |
| Future-version backup recovery | `saveNewer` V99 primary could be overwritten with an older V2 backup | Recovery returns `saveNewer` and keeps the future primary byte-exact. |
| Corrupt primary + valid external text | Read-only protection also prevented explicit valid text recovery | Confirmed protected import can replace corrupt primary after preserving it; a good backup is not poisoned by the corrupt preimage. |
| Spoiled produce in an order | The first implementation counted quality-zero lots toward order quantities | After legitimate discard of fresh milk, a dairy order with only 20,766 mL spoiled milk is rejected with no payout. |

Six additional storage cases pass: write-free V0, V5 and rich V6 opening followed by a real seed purchase while source native bytes remain exact/archived; quota failure at original archive and primary write; and a stale CozySession refusing to overwrite another session's accepted revision. The rich fixture with the moved P2 layout maps seven active shared/livestock facilities.

Migration service credits, accepted legacy orders, installed upgrade benefits, pending graded eggs and usable reserve supplies remain subject to the final field-by-field mapping review. Their original raw bytes stay preserved; active mapping is checked separately from archival evidence.

## Current verified work for this matrix

- Fixture generation: **complete**. Strict native serialized roundtrip and strict P2 layout validation pass; canonical fixture hashes are in `game/tests/fixtures/cozy-world/manifest.json`.
- The fixture generator's dispatched history is reproducible and does not read or change personal storage.
- Full-world domain/migration audit: concrete initial storage/import faults above have been corrected and independently rechecked; final semantic mapping review remains in progress.
- All new full-world browser, performance, host and release rows remain pending. Their presence in this plan is not a claim that P3-P7 has passed.
