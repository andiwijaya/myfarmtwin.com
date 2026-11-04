# MyFarmTwin Cow Farm V1.1 — implementation checklist

Source: original Library `libfile_af2b8f2e0db881918dcdc1e510040b4f`, version `1`, modified 2026-11-04T10:06:35.744634Z; 616 lines read completely via Library on 4 November 2026. This is derived project tracking, not a materialized Library attachment. The full original PRD remains authoritative.

Coding-at-home session explicitly started by Product Owner. Routine local implementation/testing authorized. **No push or deploy for this Cow release without separate user authorization.** Publication and live-dependent items stay pending until then; homepage Cow availability stays future until actually live-verified.

Progress: **46/64 (71.88%)**

### M0 — Current-state audit and safety baseline (7)

- [x] **M0-F01** — Audit local/remote/live commit, active Dot tasks, uncommitted files, branch divergence and deploy; record baseline & rollback without touching user files.
- [x] **M0-F02** — Verify Chicken status (code, live, PRD checklist) and Goat status (PRD/local task/branch/live); choose safe sequential integration strategy.
- [x] **M0-F03** — Map existing headless engine, clock, weather, wallet, Market, inventory, events, renderer and save validator; document reuse contracts.
- [x] **M0-F04** — Run baseline local `lint`, `typecheck`, `test`, `build`, `e2e`, chicken & other project scripts actually available; document pre-existing issues.
- [x] **M0-F05** — Snapshot/anonymized fixtures for current save versions and realistic mixed-farm states; establish non-destructive rollback plan.
- [x] **M0-F06** — Confirm responsive UX/camera/low-graphics and create small visual assets plan consistent with existing renderer; no engine rewrite.
- [x] **M0-F07** — Commit/copy this living PRD to repo docs, create isolated safe branch, release checkpoints and feature flag; no premature deployment.

**M0 gate:** verified baseline, safe worktree, no conflict with other Dot work, older saves protected.

### M1 — Cow Barn world, visual life and controls (8)

- [x] **M1-F01** — Add `Cow Barn` area entry to `/play/` and existing area selector; accessible keyboard/touch, preserves selected crop/chicken/goat game state.
- [x] **M1-F02** — Render barn exterior/interior or cutaway, fencing/rest area and milk station with world footprint & collision safe.
- [x] **M1-F03** — Render initial two cows and optional third from stable engine IDs, distinguish them, show lactating/ready status and owned/capacity; prevent duplicate cows on rerender.
- [x] **M1-F04** — Implement low-cost cow idle/walk/eat/drink/rest animations; reduced-motion/low-graphics parity and no state changes from animation.
- [x] **M1-F05** — Render interactive feeder, water trough, cleaning station, milk can and co-op pickup point.
- [x] **M1-F06** — Implement contextual cow/barn actions and HUD with disabled reasons, progress and immediate visible feedback.
- [x] **M1-F07** — Integrate pan/zoom/rotate if supported, reset view, object picking and viewport responsive 320–1440 widths/landscape; no touch trap.
- [x] **M1-F08** — Translate all Cow screens, missions, notices, labels and accessibility strings EN/ID, preserve locale preference & other-area UI.

**M1 gate:** Cow Barn view and interactions visually usable, **not** yet claiming milking/sale production works.

### M2 — Real deterministic cow care, lactation and milk model (10)

- [x] **M2-F01** — Add typed/configured cow/barn/lot model, unique IDs, unit normalization, bounded values and validator structure.
- [x] **M2-F02** — Add revision-safe idempotent cow commands, no direct DOM economy mutation, no duplicative scheduler or RNG.
- [x] **M2-F03** — Add feed inventory purchase, store→trough transfer and per-tick intake; avoid free/negative feed and unrealistic crop conversion.
- [x] **M2-F04** — Add trough refill as atomic transfer from shared farm tank and tick water consumption; test mixed crop/chicken/goat demand.
- [x] **M2-F05** — Add cleanliness, shade/heat protection and derived comfort model with gradual recovery; no animal death/offline punishment.
- [x] **M2-F06** — Add `lactating` eligibility and prior-calving metadata, fixed-stage sustained V1 scenario with no automatic dry transition, bounded tick production and dry-cow 0-yield tests; expose model disclaimer.
- [x] **M2-F07** — Add reservoir, max 2 sessions/cow/game-day and 8-game-hour spacing across midnight; prevent button-created milk/replay and catch-up overflow.
- [x] **M2-F08** — Add deterministic grade and atomic full-reservoir→lot transfer with capacity rejection; prove opening + produced = ready + stored + sold + discarded using integer mL.
- [x] **M2-F09** — Add game-tick freshness/grade ceilings, cooler paid-credit and no-funds behavior; no clock-based offline decay, grade restoration or free cooling.
- [x] **M2-F10** — Headless deterministic comparison suite: adequate vs scarce water, feed, heat, hygiene; invariants/clock/seed repeatability.

**M2 gate:** milk output arises only from valid lactating cows + care + time, and grades obey causal model.

### M3 — Full playable first milk delivery & cashflow (9)

- [x] **M3-F01** — One-time `cow.*` starter kit at first entry: 2 lactating cows, stand, limited supplies and pre-existing milk reservoir, preserving old wallet.
- [x] **M3-F02** — Add FarmGirl `First Milk Delivery` mission, one objective at a time and no collision with crop/chicken/goat missions.
- [x] **M3-F03** — Hook feed/refill/clean/inspect UI to real validated engine actions and negative/disabled feedback.
- [x] **M3-F04** — Hook milking station to per-cow production/eligibility and lot creation, with friendly visual feedback.
- [x] **M3-F05** — Add milk lots A/B/C to existing inventory and **Co-op delivery** to existing Market; accepted only if valid grade/freshness.
- [x] **M3-F06** — Exact integer sale/ledger income with persisted fractional remainder, ordinary/contract lot selection and partial contract lots; no double-credit or mutation on invalid/stale/replayed orders.
- [x] **M3-F07** — Add affordable first upgrade path (cooler/trough) with visible world change and measurable engine benefit.
- [x] **M3-F08** — Add free cleaning/disposal and repeatable Co-op Care Jobs with time gate, source/capacity accounting, restricted ration and durable deduplication; prove a second independent zero-wallet recovery.
- [x] **M3-F09** — **CRITICAL VERTICAL SLICE:** desktop/touch-mobile first entry → care → clean → milk → valid co-op sale → Coins → view upgrade goal, target ≤180 seconds in measured scenarios. Upgrade purchase is a separate balance test; all old farm loops pass.

**M3 gate:** end-to-end Dairy core gameplay functional. **Do not** add advanced features until this passes. **Do not deploy** without M4 save safety and M6/M7 release gates.

### M4 — Save migration, old-user safety and failure recovery (8)

- [x] **M4-F01** — Read actual current save version, design latest→next upgrade without hardcoded version number and without losing old unknown/newer save.
- [x] **M4-F02** — Migrate crop-only saves retaining every original crop/Coins/market/weather/ledger field semantically exact.
- [x] **M4-F03** — Migrate Chicken-era saves retaining hens, egg lots, orders, upgrades, histories, rewards; test chicken regression.
- [x] **M4-F04** — Migrate Goat-era saves if implemented; if not, document applicability and ensure future Goat integration uses shared migration chain.
- [x] **M4-F05** — Serialize/validate cows, provenance-tagged supplies, lots, milk counters, production/sale remainders, cooling credit, recovery episodes, missions/grants, third-cow purchase, versions and ledger (§6.9).
- [x] **M4-F06** — Test autosave/reload/return, import/export, cancel/invalid data, confirmed reset, rolling backup, quarantine corrupt/future saves.
- [x] **M4-F07** — Two-tabs/stale-revision/double-click and time pause/hidden tab/system-clock tests; no dupe sale/milk/grant or softlock.
- [x] **M4-F08** — 30+ game-day mixed farm endurance with save roundtrips, shared resource conservation, no negative balance and no storage bloat.

**M4 gate:** older players resume all existing content unharmed; no silent downgrade/reset. **Release blocker.**

### M5 — Strategy, progression and optional engineering depth (8)

- [x] **M5-F01** — Upgrade cow water trough / modest automatic refill **from paid shared tank source**, to reduce chores without magic water.
- [x] **M5-F02** — Implement shade/ventilation upgrade with measured effect on comfort/yield during hot weather and transparent cost.
- [x] **M5-F03** — Implement optional cooling tank purchase, added capacity, toggle/status, prepaid energy ledger and slower decline only while actively cooled; verify no-funds/off/empty/reload cases.
- [x] **M5-F04** — Implement milking stand sanitation upgrade/maintenance and traceable quality improvement; avoid meaningless decorative upgrades.
- [ ] **M5-F05** — Add co-op contracts by milk quantity/grade, one-time rewards, capacity-affordable objectives and no punitive real-time deadlines.
- [ ] **M5-F06** — Add `Happy Cows`, `Cool the Milk`, `Heat Wave`, `Bigger Dairy` missions/unlocks and fair resupply; implement one 2→3 barn upgrade and atomic third already-lactating cow purchase with all prerequisites.
- [ ] **M5-F07** — Read-only Dairy Engineering Lab: water/feed trends, comfort factors, milk reservoir vs yield, grade/freshness, expenses/revenue/cost per L and model limitations.
- [ ] **M5-F08** — Balance fixed-seed 7/30/60/90 game days, dairy-only/crop/chicken/goat/mixed; grade/refrigeration/no-care strategies; detect exploit/dominant economy and tune.

**M5 gate:** player decisions affect throughput, quality, operating cost and quality of life—not endless micromanagement.

### M6 — Black-box, white-box, compatibility & protection (8)

- [ ] **M6-F01** — Black-box desktop/touch-mobile full Dairy loop, mixed farm switching, all Market flows, upgrade, mission, recoveries and no softlock.
- [ ] **M6-F02** — White-box tests: deterministic tick/weather, lactation eligibility, resource conservation, grade, freshness, market/ledger invariants and action idempotency.
- [ ] **M6-F03** — Security/resilience: malicious/corrupt/import JSON, unknown/prototype fields, future schema, storage disabled/quota, stale tab and safe backup behavior.
- [ ] **M6-F04** — Layout/keyboard/ARIA/mobile at 320/360/390/768/1024/1440 + landscape, EN/ID, reduced motion; cross-browser if runners available.
- [ ] **M6-F05** — Performance/memory benchmark with cows animation and all areas enabled, low-graphics fallback, bounded timers/history/save payload.
- [ ] **M6-F06** — Dead-code and license audit; clean only confirmed unused NEW code/assets, keep all prior media and avoid QA/cache in Git.
- [ ] **M6-F07** — Full regression of crop/chicken/goat (if implemented), save/import/backup, existing Market, weather, water, homepage desktop/mobile, SEO and GA4.
- [ ] **M6-F08** — Verify claims against code/biology: lactation-after-calving metadata, no raw milk direct-consumption promises, no offline welfare punishment, acceptable game simplifications visible.

**M6 gate:** no unresolved P0/P1 or save corruption, performance stable, desktop/mobile usable, existing products preserved.

### M7 — Local release, production live verification and report (6)

- [ ] **M7-F01** — Run full clean build/test/lint/typecheck/e2e/chicken/other applicable suites, include scenario/balance tests and review protected-file diff.
- [ ] **M7-F02** — Verify migration compatibility and rollback that **preserves new-format save** even if previous client cannot understand it; archive release evidence outside Git.
- [ ] **M7-F03** — Push/deploy through currently audited GitHub→Cloudflare Pages pipeline after all gates; no force-push/GitHub Actions routine QA.
- [ ] **M7-F04** — Live smoke desktop/mobile using isolated test browser profile: first dairy sale + save/reload + all old area checks + no uncaught exceptions.
- [ ] **M7-F05** — Update homepage **existing single card** promotional copy/alt text/SEO EN/ID from “cows not playable” to accurate status **only after dairy is verified live**; preserve unfinished goat/fish disclaimers; retest.
- [ ] **M7-F06** — Final report with commit, tested deployment link/ID, performance/security/QA evidence, remaining risks, rollback and 64/64 checklist only if each done.

**M7 gate:** production fully verified, not merely “build succeeded”; save recovery documented and actual homepage claims truthful.

---


## Verification evidence



### M0-F01
Verified clean c77f78a checkout, origin/main dd8184e and all 80 production resources with zero byte mismatches; isolated Cow branch, immutable rollback and no publication. Evidence qa/cow/M0-F01/live-integrity.json and COW_AUDIT.md.

### M0-F02
Verified completed Chicken and Goat source, preserved 60/60 Goat release documents and exact live assets; sequential isolated branch starts after completed Goat, without touching owner saves. See COW_AUDIT.md.

### M0-F03
Mapped deterministic shared reducer, clock, seeded weather, ledger, Market, 240 L tank, V3 validation/archives and isometric UI integration; Cow units and V4 additive migration boundary documented in COW_AUDIT.md.

### M0-F04
All 15 baseline npm gates PASS, 169 unit tests, full crop/Chicken and 8 Goat mixed browser journeys; homepage24, SEO9, compat and12 performance profiles PASS. No pre-existing application failures. Evidence qa/cow/M0-F04 and COW_AUDIT.md.

### M0-F05
Captured actual V3 fresh and35-day mixed synthetic saves plus exact production reader hashes;3 preservation/future-primary rollback tests PASS. All earlier fixtures untouched, separate pre-Cow archive/rollback policy documented.

### M0-F06
Reviewed current desktop/mobile world pixels and baseline camera/low-graphics evidence; original lightweight SVG Cow asset, layout, picking, accessibility and EN/ID plan documented. Baseline responsive and12 performance profiles pass.

### M0-F07
Original V1.1 Library text read fully and derived64-entry living checklist/contracts committed; isolated cow-farm-v1 preserves prior work. New Cow feature gate initially off, typecheck/build and3 fixture safety tests PASS; protected site/config unchanged, no push/deploy.

### M1-F01
Cow Barn area works with keyboard/touch in8 new/existing EN/ID desktop320px profiles; entering/switching/language leaves exact farm save unchanged and restores selected crop. Typecheck/build/locale audit PASS; Crop/Chicken/Goat navigation preserved. Evidence qa/cow/M1-F01.

### M1-F02
Original lightweight isometric cutaway barn, straw rest area, fences and6 dairy stations rendered;8 EN/ID new/existing desktop320px browser profiles PASS with exact save preservation. Reviewed actual desktop/mobile pixels; no engine rewrite/dependency/media. Typecheck/build/locale audit PASS. Evidence qa/cow/M1-F02.

### M1-F03
Two saved stable adult lactating cows,4000/0mL opening reservoirs, owned/capacity and one-time source kit work; real V3->V4 archives preserve all older farm fields.175 unit tests,8 Cow profiles, full crop E2E and8 three-area sale journeys PASS; old V3 reader protects real V4. Reviewed final pixels. Local only.

### M1-F04
Five lightweight shared-tick cosmetic activities implemented; no eating/drinking from empty troughs.8 focused state/scene tests and8 browser profiles PASS; low graphics/reduced motion disable animation while preserving exact save bytes. Typecheck/build PASS. Evidence qa/cow/M1-F04.

### M1-F05
All9 actual Cow/care objects have map picking and44px labelled shortcuts, selected feedback, keyboard Enter/Escape and focus restoration.8 EN/ID new/existing desktop320px browser profiles PASS with exact saves; reviewed mobile pixels. Typecheck/build/locale audit PASS. Evidence qa/cow/M1-F05.

### M1-F06
Real contextual feed/water/three free hygiene/inspect commands and Cow HUD/progress/disabled reasons work end-to-end; tagged kit fills24kg/100L, retains8kg/80L, no old wallet/tank change or instant comfort gain.180 unit tests and8 EN/ID new/existing desktop320px care/reload profiles PASS; reviewed pixels, removed inherited crop highlight. Evidence qa/cow/M1-F06.

### M1-F07
14 EN/ID surfaces320–1440 plus landscape PASS: Cow/water picking in4 rotations, real touch/mouse drag with no accidental selection, keyboard pan, zoom bounds/reset, independent4-area cameras,44px controls, no overlay/overflow, low/reduced-motion and exact saves.10 old Goat camera regression surfaces also PASS. Evidence qa/cow/M1-F07.

### M1-F08
All current Cow screens/actions/disabled notices and model/biology disclosures translated EN/ID.16 Chromium153/Firefox155 new/full-care320/1440 profiles PASS: locale flips preserve exact saves, keyboard skip link works, old areas and locale reload safe, no raw keys.180 units/typecheck/build/client audit PASS. M1 gate ready for M2, local only.

### M2-F01
Typed configured Cow/barn/lot data now validates integer units, per-cow opening/produced/collected provenance, unique bounded lots, chronological session counters, cumulative sale/fraction/energy/recovery constraints and malicious hidden/getter/prototype fields.183 units/typecheck/build/audit PASS; fixed provisional balance and examples documented. Evidence qa/cow/M2-F01.

### M2-F02
Revision-safe command gate rejects getters before reading id/type, forged payloads, prototypes, symbols and all stale/replays; frozen inputs remain unchanged.186 unit tests PASS including deterministic mixed replay/no wall-clock or unseeded RNG and24 ticks==NextDay.20 real two-tab EN/ID desktop/mobile entry/care races PASS: exactly one revision/grant/transfer, stale read-only and reload safe. Evidence qa/cow/M2-F02.

### M2-F03
Paid mixed feed uses shared Market/wallet and exact purchase ledger; no crop/Goat conversion. Integer hourly demand with persisted remainder consumes exactly8000g/cow/day, restricted starter before normal stock, no negative feed or button-created milk.190 units and4 EN/ID desktop/mobile purchase/double-gesture/transfer/day-intake/reload profiles PASS. Evidence qa/cow/M2-F03.

### M2-F04
Integer water consumption is30/45L per cow/day normal/hot, on shared ticks only. Starter180L is separate/finite; later Cow refill exactly debits shared tank, preserves legacy sub-mL residue and old crop/hen/Goat state.194 units and4 EN/ID desktop/mobile source/intake/shared paid resupply/reload profiles PASS; no transfer fee or negative water. Evidence qa/cow/M2-F04.

### M2-F05
Ordinary ticks now drive fractional barn soil, gradual care-derived comfort and recoverable body condition; separate stand/can hygiene unchanged by basic care clock. Controlled shade/hot comparison and90-day neglect keep both cows alive.198 units and4 EN/ID desktop/mobile real-care/Why/reload profiles PASS; cleaning never gives instant comfort, money or offline penalties. Evidence qa/cow/M2-F05.

### M2-F06
Only already-calved lactating cows produce admitted integer milk from care and ordinary hours; fixed-stage V1 has no automatic dry expiry.202 units and4 EN/ID desktop/mobile lactating/dry UI profiles PASS, including persisted sub-mL arithmetic,9900+250 admits only100 and no catch-up, separate4000 opening source, and90 paid-care days funded by real existing farm earnings. Dairy-only cashflow remains M3/M5. Evidence qa/cow/M2-F06.

### M2-F07
Full-reservoir milking now creates one real stored lot/session without fee or fraction reset.205 units and4 EN/ID desktop/mobile real-care/milking/double-click/reload profiles PASS;8-hour spacing and max2/day hold across midnight, dry/dirty/forged requests reject unchanged. Actual can gauge/HUD track4000mL opening transfer; deterministic grade supports valid lots, deeper quality/capacity gate follows. Evidence qa/cow/M2-F07.

### M2-F08
Atomic whole-reservoir capacity and deterministic grades verified:3999mL free rejects4000 unchanged, exact4000 fits, rejected lots occupy space, all integer mass balances survive ticks and reload.208 unit tests and4 EN/ID desktop/mobile capacity profiles PASS. Evidence qa/cow/M2-F08.

### M2-F09
Freshness uses ordinary ticks only and exact A/B/C/rejected ceilings. Whole-lot moves preserve provenance; spoiled lots occupy capacity until free disposal. Paid cooling prepays1Coin/6active hours, persists credit and pauses safely at0Coins;213 units and4 EN/ID desktop/mobile storage profiles PASS. Evidence qa/cow/M2-F09.

### M2-F10
Headless model gate PASS:24seeds x6 controlled conditions x24h, exact deterministic replay, care and shade improve actual yield; reservoir suppression and paid cold-chain tradeoffs hold.216unit tests PASS. Derived report docs/COW_M2_GATE.md; evidence qa/cow/M2-F10. M3 first-sale gate remains next, no publication.

### M3-F01
One-time starter slice verified across16 fresh/actual older-save wallet-and-tank combinations. ZeroCoins and empty shared tank still allow real restricted care and one4000mL opening lot without changing existing farm assets; reload/archive/re-entry cannot duplicate kit. Targeted starter tests PASS;216 full units at preceding model gate. No publication.

### M3-F02
First Milk Delivery now presents one real causal objective at a time, with localized targets, persisted progress and zero welcome Coin bonus.218unit tests and4 EN/ID desktop/mobile guided-care-to-milk profiles PASS; original farm guides and locale changes remain independent. Evidence qa/cow/M3-F02.

### M3-F03
Care UI now exposes separate starter/recovery entitlements, owned feed and shared water, explains capped transfers/free hygiene, and focuses actual Market restock/refill controls. Typecheck/build/audit and8 fresh/existing EN/ID desktop320/touch care profiles PASS; all real transfers, disabled reasons and older assets verified. Evidence qa/cow/M3-F03.

### M3-F04
Milking station now lists actual owned cows, reservoir volume, individual eligibility/reasons and validated whole-can collection, with direct inspection navigation.4 EN/ID desktop320/touch profiles PASS, including double-click one session, saved lot, world can gauge and localized success notice. Typecheck/build/audit PASS. Evidence qa/cow/M3-F04.

### M3-F05
Milk batches now appear in shared inventory and existing Market Co-op, with effective grade/freshness, current quote and one atomic whole-batch delivery.221unit tests and4 zero-wallet/empty-tank EN/ID desktop320/touch care-milk-sale-reload profiles PASS:4000mL B yields16Coins once with zero welcome bonus. Egg/milk summaries coexist. Evidence qa/cow/M3-F05.

### M3-F06
Exact sale accounting and first contract verified:one rounding per transaction, persisted fractional carry including zeroCoin sales, FIFO exact1500mL and partial lots retain provenance, separate8Coin bonus deduplicated.225units and4 real EN/ID desktop/mobile contract profiles PASS; stale/forged/getter/duplicate inputs reject unchanged. Evidence qa/cow/M3-F06.

### M3-F07
First upgrade goal shows90Coin price,100-to150L benefit and true shortfall; purchase changes world/capacity once without free water.227unit tests PASS, including five days of zero-wallet dairy-only normal paid resupply/sales funding the upgrade;4 EN/ID desktop/mobile goal/purchase/reload profiles PASS. Evidence qa/cow/M3-F07.

### M3-F08
Repeatable care jobs require real next-hour shortage, unavailable affordable resupply and no usable milk, recheck after8ordinary hours, and complete at most once/24absolute hours. Restricted16kg/90L two-cow aid preserves exact sources and cannot credit Coins/shared water; second independent zero-wallet episode verified.230units and4 EN/ID desktop320/touch recovery profiles PASS. Disposal reasons now persist. Evidence qa/cow/M3-F08.

### M3-F09
Critical vertical slice PASS:8fresh/existing EN/ID desktop/mobile scenarios with0Coins/empty tank use actual1x3000ms shared clock; automated5723-5891ms,2ticks,4289mL sale,17Coins+156/1000 and90Coin goal/73shortfall. Full crop black-box, complete Chicken runner and8Goat full profiles PASS;230unit baseline, final build/audit PASS. Report docs/COW_M3_GATE.md. No publication.

### M4-F01
Actual releasedV3 discovered from immutable source and targetV4 from current configuration; additive migration/rollback contract documented.6 targeted real-reader/migration tests PASS, including future primary with valid backup, unchanged prior archives, archive collision/quota read-only preview and malformed-current no-default behavior. No runtime change or publication.

### M4-F02
V0/V1 crop-only migration retains every original field, exact source archives and original frozen hash/replay oracle; only legitimately absent history/modules/version are added.4 targeted crop migration/frozen replay tests PASS; malformed unknown-field/negative-soil sources stay intact and receive no replacement farm or starter. Existing full crop browser gate also passed M3.

### M4-F03
Actual V2 Chicken fresh/mixed saves retain every prior field and exact era archives. Additional real-command fully upgraded six-hen farm with feeder/shade, completed order/rewards, pending eggs and stored lots is accepted by the exact releasedV2 reader before migration and remains semantically identical afterward. Targeted migration tests PASS; full Chicken release regression passed M3.

### M4-F04
ActualV3 fresh/mixed Goat-era farms preserve every prior field and exact original bytes. Advanced paid shelter/care, two rotated pastures, herd IDs, sales/contracts, sources, histories and rewards are validated by the exact releasedV3 reader before migration and remain unchanged after explicit Cow entry.9 targeted tests PASS, original fixture/reader hashes unchanged;8 full Goat browser profiles already passed M3.

### M4-F05
Final CowV4 boundary reconciles all paid flags, source ledgers, integer milk/revenue/fractions, partial receipts, cooling credit/freshness history, recovery/disposal, mission evidence and third-purchase proof.242full units plus8native-clock and4recovery EN/ID browser profiles PASS. Coherently balanced forged prices/credits/grants/receipts and prepoisoned namespaces reject; old readers/fixtures unchanged. docs/COW_V4_VALIDATION.md; qa/cow/M4-F05*.

### M4-F06
245unit tests and24isolated browser data/resilience profiles PASS. Exact Cow exports, dedicated pre-Cow/pre-Goat originals, cancel/invalid imports, confirmed reset/backup restore preserve partial lots, paid credit and active jobs. Older backup recovery now archives source before autosave; archive collision/quota stays read-only. Future/corrupt/disabled-storage/denied-or-absent-lock/poisoned saves stay protected. Evidence qa/cow/M4-F06*.

### M4-F07
40real EN/ID desktop/mobile two-tab races PASS:entry, care, inspect, milk, quoted sale, job start/completion and upgrade each accept exactly one revision and stale tabs cannot write.4browser clock profiles PASS for all4areas, pause/hidden/system-time changes and exact NextDay;2headless24tick/stale-immutability tests PASS. Evidence qa/cow/M4-F07-*; no app permission changes.

### M4-F08
35-day real-command4area endurance PASS from fresh and exact olderV3 farms:1971/1981commands,63replay rejects each, deterministic full replay, daily reload and exact old archive. Minimum120/1765Coins; peak77687/97583bytes; milk409142/405788mL sold plus continuing crop/egg/goat sales.247full units/type/build/audit PASS. M4 gate docs/COW_M4_GATE.md, qa/cow/M4-F08.

### M5-F01
Larger-trough progression verified under identical controlled8hot game days:actual water-fill actions fall8to5 while both herds consume720000mL and produce identical milk.90Coin upgrade remains single-purchase, exact tagged transfers/no free water; existing EN/ID world/capacity UI already verified.3 targeted workload/affordability tests PASS;247full unit gate precedes this added case.

### M5-F02
Paid100Coin shade/ventilation is real and idempotent, visible as original world awning with EN/ID optional upgrade controls. Controlled24hot-hour matched intake yields9612plain vs10360shadedmL with90000mL drinking in both; no instant welfare/resources.250full units and4desktop/mobile EN/ID browser profiles PASS, screenshot reviewed. Evidence qa/cow/M5-F02.

### M5-F03
Actual120Coin cooler purchase starts off/zero credit and adds40L separate storage, service HUD and original world tank/gauge. Empty/off do not charge; zero wallet never cools free or borrows; paid credit survives toggle/move/reload.252full units and4EN/ID desktop/mobile real purchase/direct-milking/24h-four-fee/whole-move profiles PASS. Evidence qa/cow/M5-F03.

### M5-F04
80Coin sanitation upgrade reduces future stand/handling dirt without instant cleaning, comfort, freshness or milk. Matched48h handling improves retained hygiene and actual A-grade collections at equal intake; free basic cleaning remains available.254full units and4EN/ID desktop/mobile paid-purchase/free-clean/world-equipment/reload profiles PASS. Evidence qa/cow/M5-F04.
