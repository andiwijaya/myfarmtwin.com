# MyFarmTwin Cow Farm V1.1 — implementation checklist

Source: original Library `libfile_af2b8f2e0db881918dcdc1e510040b4f`, version `1`, modified 2026-11-04T10:06:35.744634Z; 616 lines read completely via Library on 4 November 2026. This is derived project tracking, not a materialized Library attachment. The full original PRD remains authoritative.

Coding-at-home session explicitly started by Product Owner. Routine local implementation/testing authorized. **No push or deploy for this Cow release without separate user authorization.** Publication and live-dependent items stay pending until then; homepage Cow availability stays future until actually live-verified.

Progress: **20/64 (31.25%)**

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
- [ ] **M2-F06** — Add `lactating` eligibility and prior-calving metadata, fixed-stage sustained V1 scenario with no automatic dry transition, bounded tick production and dry-cow 0-yield tests; expose model disclaimer.
- [ ] **M2-F07** — Add reservoir, max 2 sessions/cow/game-day and 8-game-hour spacing across midnight; prevent button-created milk/replay and catch-up overflow.
- [ ] **M2-F08** — Add deterministic grade and atomic full-reservoir→lot transfer with capacity rejection; prove opening + produced = ready + stored + sold + discarded using integer mL.
- [ ] **M2-F09** — Add game-tick freshness/grade ceilings, cooler paid-credit and no-funds behavior; no clock-based offline decay, grade restoration or free cooling.
- [ ] **M2-F10** — Headless deterministic comparison suite: adequate vs scarce water, feed, heat, hygiene; invariants/clock/seed repeatability.

**M2 gate:** milk output arises only from valid lactating cows + care + time, and grades obey causal model.

### M3 — Full playable first milk delivery & cashflow (9)

- [ ] **M3-F01** — One-time `cow.*` starter kit at first entry: 2 lactating cows, stand, limited supplies and pre-existing milk reservoir, preserving old wallet.
- [ ] **M3-F02** — Add FarmGirl `First Milk Delivery` mission, one objective at a time and no collision with crop/chicken/goat missions.
- [ ] **M3-F03** — Hook feed/refill/clean/inspect UI to real validated engine actions and negative/disabled feedback.
- [ ] **M3-F04** — Hook milking station to per-cow production/eligibility and lot creation, with friendly visual feedback.
- [ ] **M3-F05** — Add milk lots A/B/C to existing inventory and **Co-op delivery** to existing Market; accepted only if valid grade/freshness.
- [ ] **M3-F06** — Exact integer sale/ledger income with persisted fractional remainder, ordinary/contract lot selection and partial contract lots; no double-credit or mutation on invalid/stale/replayed orders.
- [ ] **M3-F07** — Add affordable first upgrade path (cooler/trough) with visible world change and measurable engine benefit.
- [ ] **M3-F08** — Add free cleaning/disposal and repeatable Co-op Care Jobs with time gate, source/capacity accounting, restricted ration and durable deduplication; prove a second independent zero-wallet recovery.
- [ ] **M3-F09** — **CRITICAL VERTICAL SLICE:** desktop/touch-mobile first entry → care → clean → milk → valid co-op sale → Coins → view upgrade goal, target ≤180 seconds in measured scenarios. Upgrade purchase is a separate balance test; all old farm loops pass.

**M3 gate:** end-to-end Dairy core gameplay functional. **Do not** add advanced features until this passes. **Do not deploy** without M4 save safety and M6/M7 release gates.

### M4 — Save migration, old-user safety and failure recovery (8)

- [ ] **M4-F01** — Read actual current save version, design latest→next upgrade without hardcoded version number and without losing old unknown/newer save.
- [ ] **M4-F02** — Migrate crop-only saves retaining every original crop/Coins/market/weather/ledger field semantically exact.
- [ ] **M4-F03** — Migrate Chicken-era saves retaining hens, egg lots, orders, upgrades, histories, rewards; test chicken regression.
- [ ] **M4-F04** — Migrate Goat-era saves if implemented; if not, document applicability and ensure future Goat integration uses shared migration chain.
- [ ] **M4-F05** — Serialize/validate cows, provenance-tagged supplies, lots, milk counters, production/sale remainders, cooling credit, recovery episodes, missions/grants, third-cow purchase, versions and ledger (§6.9).
- [ ] **M4-F06** — Test autosave/reload/return, import/export, cancel/invalid data, confirmed reset, rolling backup, quarantine corrupt/future saves.
- [ ] **M4-F07** — Two-tabs/stale-revision/double-click and time pause/hidden tab/system-clock tests; no dupe sale/milk/grant or softlock.
- [ ] **M4-F08** — 30+ game-day mixed farm endurance with save roundtrips, shared resource conservation, no negative balance and no storage bloat.

**M4 gate:** older players resume all existing content unharmed; no silent downgrade/reset. **Release blocker.**

### M5 — Strategy, progression and optional engineering depth (8)

- [ ] **M5-F01** — Upgrade cow water trough / modest automatic refill **from paid shared tank source**, to reduce chores without magic water.
- [ ] **M5-F02** — Implement shade/ventilation upgrade with measured effect on comfort/yield during hot weather and transparent cost.
- [ ] **M5-F03** — Implement optional cooling tank purchase, added capacity, toggle/status, prepaid energy ledger and slower decline only while actively cooled; verify no-funds/off/empty/reload cases.
- [ ] **M5-F04** — Implement milking stand sanitation upgrade/maintenance and traceable quality improvement; avoid meaningless decorative upgrades.
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
