# MyFarmTwin full GLB world: P3-P7 acceptance matrix

Date: 15 November 2026 (WIB). Status: final post-slab source deployed and verified on both production origins; source/foundation and actual internal-browser receipts are recorded below. The closure table at the end is the current status and overrides the original planning rows marked Pending.

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

The rows below retain the original acceptance specification and its initial **Pending** labels. Use the source-bound closure table at the end for current results, explicit scope changes and verification limits; do not interpret the historical labels as the current implementation status.

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

These initial findings are pure JavaScript/Map-store checks, not browser or release acceptance. They are now covered by the final retained domain/storage tests and the mapping contract; browser evidence is recorded separately below.

| Finding | Initial observed behavior | Corrected source independently checked |
| --- | --- | --- |
| Fractional legacy consumables | Valid V5/rich V6 import rejected because native hourly feed/forage/water quantities are fractional but new validator required integers | Rich V6 and moved P2 bundle migrate successfully with finite bounded quantities preserved. |
| P2 layout without a native primary | Valid moves/free-kit progress was validated but silently replaced by default layout | Layout-only migration retains moved/rotated bed and placed kit data without inventing a native source archive. |
| Future-version backup recovery | `saveNewer` V99 primary could be overwritten with an older V2 backup | Recovery returns `saveNewer` and keeps the future primary byte-exact. |
| Corrupt primary + valid external text | Read-only protection also prevented explicit valid text recovery | Confirmed protected import can replace corrupt primary after preserving it; a good backup is not poisoned by the corrupt preimage. |
| Spoiled produce in an order | The first implementation counted quality-zero lots toward order quantities | After legitimate discard of fresh milk, a dairy order with only 20,766 mL spoiled milk is rejected with no payout. |

Six additional storage cases pass: write-free V0, V5 and rich V6 opening followed by a real seed purchase while source native bytes remain exact/archived; quota failure at original archive and primary write; and a stale CozySession refusing to overwrite another session's accepted revision. The rich fixture with the moved P2 layout maps seven active shared/livestock facilities.

The active mapping review is closed in `COZY_WORLD_SAVE_CONTRACT_V2.md`. Pending egg grades and exact native lot values are retained, fractional/service credit is spendable, active cow orders remain active, pond reserve water can be exchanged, and owned goat forage regrows separately from hay. Installed capabilities and fish advance debt have explicit mappings. Removed scientific counters/history remain in exact provenance rather than being claimed as active simulation.

## Current verified work for this matrix

- Fixture generation: **complete**. Strict native serialized roundtrip and strict P2 layout validation pass; canonical fixture hashes are in `game/tests/fixtures/cozy-world/manifest.json`.
- The fixture generator's dispatched history is reproducible and does not read or change personal storage.
- Full-world domain/migration audit: the concrete initial storage/import faults above were corrected and independently rechecked; the finalized mapping contract and retained tests cover active values/capabilities as well as raw archives.
- Internal-browser candidate evidence is now available for the builds below. The final production closure below records the later source identity, post-slab review and actual public verification.

## Candidate evidence closure â€” current status

This section supersedes the original Pending labels above. It records what was actually observed and keeps source checks, internal-browser interaction, resource hashes, unavailable checks and remaining release work separate. It does **not** mark every original row as passed.

| Evidence group | Exact source / receipt | Observed result and scope |
| --- | --- | --- |
| Retained source regressions | `COZY_WORLD_RELEASE_V2.md`, retained non-network regression receipts | **576 passed** in the old non-network group. Its header coverage overlaps the foundation group below; these counts must not be added as unique tests. The actual local-server gzip case was separated and is not internal-browser acceptance. |
| Final foundation | `qa-artifacts/cozy-world/final-foundation-tests.txt` | **52/52 passed**: 45 domain/storage, two legacy-P2-journal recovery, one animation lifecycle, two delivery and two header checks. This is Node/source validation, not 52 browser journeys. |
| Broad actual internal-browser journey | `preview-report.json`, source `c64ab60cdf9534df0c859d2f13394abe7eca027c`, preview `https://b7449934.myfarmtwin-com.pages.dev/play/` | **14 recorded groups passed**, including all three crops, five-area production/turnover, orders, building/moves, data/migration/conflicts, recovery reader and measured layouts. |
| Final candidate actual internal-browser follow-up | `candidate-final-report.json`, source `a7913982458f1e108ee08237a792d020a2924058`, preview `https://1057dbb9.myfarmtwin-com.pages.dev/play/` | **Eight recorded groups passed** for instanced crop behavior/picking, pump, reader, resource plateau, language/homepage and browser-computed resource parity. These are follow-up groups on a different candidate, not eight repeats of the entire broad matrix. |
| Candidate actual resource bytes | `candidate-resource-integrity.json`, same `a791398` preview origin | **30/30 resources matched** SHA-256 computed from fetched public bytes inside the internal browser; **22 were GLBs**. Responses were HTTP 200, with expected MIME/hash. Candidate entry: `app-QXJW6TRQ.js`; manifest hash: `e10a793b28076f7bb4c16fe18e8373b0e5916a92ca3ca86be5b455b0a74332f3`. This identifies the pre-slab candidate, not the final production artifact. |

The three JSON receipts above are under `qa-artifacts/cozy-world/internal-browser/`. Detailed delivered behavior, repaired findings, screenshot provenance and final release fields are owned by `COZY_WORLD_RELEASE_V2.md`.

| Matrix rows | Current closure | Evidence and practical limit |
| --- | --- | --- |
| G01-G05, G07-G10; B01-B04, B06-B07 | **Source + actual internal-browser candidate coverage** | The broad `c64ab60` journey exercised finite first kits, all crop families, livestock production/sales/purchases, three cross-area orders, upgrades/automation, invalid placement/cancel, stocked-building free move/rotation, a paid extra facility without another kit, a 25th bed and land expansion. Final `a791398` repeated plant/grow/harvest/move/restore and the paid 80-coin pump/shared-water path. No camera-only grant/write was observed. |
| G06 â€” fish partial/full wording | **Delivered whole-ready-cohort collection; migration preservation verified** | New-game UI collection takes the eligible ready cohort(s) as a whole. An optional count-based partial-harvest UI is **not implemented**. Native partially harvested remainder counts/mass and stored fish lots are preserved on migration; this does not imply a new partial-harvest control. |
| B05 â€” modular paths/fences and return-kit wording | **Catalog/placement source coverage; optional return UI not delivered** | Modular GLB path/fence catalog and placement rules exist. A dedicated new-game return-kit/remove/refund UI is **not implemented** and is not counted as a passed browser action. Existing valid P2 placed kit pieces remain owned after migration. The named browser receipts do not separately prove every decorative catalog item was built through UI. |
| A01-A02 | **Source validation + candidate GLB runtime proof; final three-model gate open** | Manifest/runtime audit reported 22 models and zero non-GLB visible meshes in observed scenes. The release report records official Khronos validation of all 22 runtime files with zero errors/warnings/infos and independent deterministic/resource checks. The later 6 mm slab correction changes three GLBs and must receive its own final validation/hash check. |
| A03-A06 | **Actual candidate visual review plus source/pose checks, with bounded coverage** | Overview/area/interior review and animal/plant representations are documented in the release record. The final candidate observed 128 crop plants and 17 animal models; walk/rest/swim states were present. Source clips and 1,694 near/far floor-contact samples cover authored animation behavior. Exhaustive close-up comparison of every stage, pose, transition and angle is not claimed. Artistic interpretation is not a zoological/architectural fidelity certification. |
| C01-C04, U01 | **Actual internal-browser candidate coverage** | Area/object approach, 16 orbit steps, zoom/pan/interiors and read-only state comparison passed. Actual measured layouts were 320Ã—740, 390Ã—844, 768Ã—1024, 844Ã—390 and 1440Ã—900 without horizontal overflow. A visible canvas selection at measured 390Ã—844 changed no progress; the final instanced picker selected `bed.9`. ID/EN and homepage entry were checked. These were desktop internal-browser viewport checks, not physical touch-device tests or a spoken-accessibility study. |
| C05, U02 | **Mouse/button/source support; native gesture/media/lifecycle limits remain** | The recorded camera paths support internal-browser mouse/button interaction and explicit placement confirmation. Physical touch/pinch/multitouch was not tested. Reduced-motion and visibility policies are implemented, but these receipts do not establish an exhaustive media-override/hidden-page lifecycle matrix or full keyboard-only journey. |
| S01-S07, S10 | **Source + actual internal-browser candidate coverage** | Broad UI evidence covers V0-V5, rich V6 and moved P2 import, exact source preservation, 24 beds, all active area counts, moved barn `x=9,z=8,rotation=Ï€/2`, large backup roundtrip, invalid text, previous-backup recovery and stale-tab blocking. Rich migration retained 454 coins and `credit3000=10757`. Strict/future/oversized/hidden-field/quote/value cases are source tests; not every adversarial case was replayed in UI. |
| S08-S09 | **Deterministic source/storage checks; partial actual reader coverage** | Quota, unavailable storage and interrupted/conflicting journal handling are covered by retained tests, including two legacy-journal recovery cases. The internal browser verified the normal renderer-independent reader and export paths. Deliberate browser-level quota/journal fault injection is not claimed. |
| S11 | **Compatible reader and rollback artifact prepared/verified; production rollback not performed** | `/play/recovery/` exported a 387,817-character V2 backup and 213,376-character original legacy source in the broad journey; the final reader UI was rechecked. `prepare-cozy-rollback.mjs` prepares the V2-reader-preserving rollback artifact. Reverting to V6 alone cannot read later V2 progress. No actual production rollback/re-promotion is claimed at this checkpoint. |
| R01-R02 | **Source safeguards and actual independent data reader; induced renderer-failure matrix unavailable** | Model/context failure protects data and leaves HTML/recovery access by design. The independent reader was exercised. These candidate receipts do not record a forced missing-texture/GLB, GPU unsupported or context-loss/retry browser matrix; those paths are not silently marked passed. |
| R03, P01, P03 | **Measured internal-browser observations; hardware target not certified** | At the same 1280Ã—720 High dense fixture, the recorded overview draw calls changed from 1,810 (`c64ab60`) to 1,155 (`a791398`) with approximately 963,000 triangles retained. The final sample recorded median/p95 RAF intervals 33.20/33.60 ms. Warm repeated interiors plateaued at 397 geometries and 58 textures in that session. This is a bounded browser/renderer observation, not a long-soak leak proof, physical GPU/VRAM allocation, hardware 60-FPS pass or controlled network-loading guarantee. |
| P02; physical portions of C05/U01/A06 | **N/A â€” environment unavailable** | Physical Android/iOS/Safari, native touch/pinch/multitouch, thermal/battery behavior, GPU VRAM and physical display FPS were not measured. Spoken screen-reader testing was not performed. |
| Upload/download/clipboard flows | **Skipped by owner instruction** | No approval-requiring upload, download or clipboard test was performed. Text backup workflows were exercised through the internal browser without claiming native file-transfer/clipboard delivery. |
| D01-D04, D07 â€” candidate scope | **Candidate source/delivery and actual public preview integrity coverage** | The two candidate identities are explicit above. Final candidate homepage/language entry preserved saves and used an actual 1280Ã—720 gameplay capture. All 30 preview resources, including 22 GLBs, matched actual browser hashes/MIME. Header/delivery checks passed separately. This is not proof of the subsequently corrected three GLBs or the canonical production origin. |
| D05-D08 â€” final production scope | **Pending final owner release work** | Final source identity, deployment success, post-slab asset validation, public resource parity, immutable-origin synthetic gameplay check and read-only canonical player-origin check are owned by the release parent. Final production fields must be populated from real results rather than copied from either preview. |

### Final gate and production closure

The barn, coop and market slab correction is present in exact final public bytes. All 22 models passed official validation, the three 6 mm slab offsets were checked, and final barn/market close-ups were inspected. The final model-only edit retained the already-tested `app-QXJW6TRQ.js` game bundle. Broad UI coverage is carried forward under that exact behavior parity, without asserting that every original UI row was rerun after the edit.

| Final evidence field | Verified value |
| --- | --- |
| Final post-slab source commit | `f0b6fa91ffa42d0b691da316133847a4cabbeffc` |
| Final model validation/visual receipt | Khronos 22/22, zero errors/warnings/infos; final preview hashes 30/30; actual barn/market close-ups, then live cow-interior capture |
| Production deployment / immutable origin | `2080cc0c-489a-41a7-b54e-e700e600e79b`; https://2080cc0c.myfarmtwin-com.pages.dev/play/ ; terminal completed/success |
| Final public resource hashes | `COZY_WORLD_BROWSER_REPORT_V2.json`: canonical and immutable origin both pass 30/30, including 22 GLBs; manifest `c593ace2574bc5b617c74469de6925ddc20d6bfa6be15121d96294c35e5b682b` |
| Synthetic live journey | 11/11 bounded groups; crop/milk conservation, stocked barn movement, exact reload/restore, reader, language and runtime provenance |
| Canonical player-origin | Read-only export byte equality through camera and homepage return; no synthetic import, starter grant or gameplay commit |
| Artifact | 18,383,315 bytes, SHA-256 `dd0e1844ad530e2c122fe3105b60e028c67d99f5faaf211c1636649b7b2d1042`; all static game bytes match |
| Final report and compatible rollback | `COZY_WORLD_RELEASE_V2.md`; final build preserves all keys through the tested renderer-independent V2 reader |

P3–P7 implementation and the final production release gate are complete. Unavailable hardware/voice/input measurements, induced graphics-failure cases and the explicitly undelivered optional UI above remain qualified; release completion does not turn them into passed tests. Actual public GLB MIME and hashes were checked. Exact HTTP cache/CSP values were source/header-tested; the runtime successfully fetched the GLBs under the deployed policy, without claiming a complete public HTTP-header capture.
