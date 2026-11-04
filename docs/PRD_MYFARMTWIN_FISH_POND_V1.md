# MyFarmTwin Fish Pond V1 — implementation checklist

Authority: original Library `libfile_bf20a78771f88191a6fab144dffedf42`, MYFARMTWIN_FISH_POND_MASTER_PRD_V1.md, current version not supplied, modified2026-11-04T22:31:13.953616Z;495lines read fully and directly. This is derived project tracking, not a materialized Library attachment or an exact PRD export. Original Library text remains authoritative.

Session: user authorizes autonomous local coding until08:00WIB5November2026 /01:00UTC. Work deadline07:50WIB, automatic conservative checkpoint, cleanup deadline07:55WIB. Supervisor/watchdog stops only registered owned processes; no resume until fresh office instruction. No Fish push/deploy authorized. Homepage must continue saying Fish planned.

Progress: **20/64 (31.25%)**

## Dependency corrections, preserving all64 IDs

Model/config M2-F01 and save migration/archive/full data-boundary M4-F01–04 run before new persistent Fish actions. M1 view work is presentation-only until starter wiring; preview fixtures must be labelled and never grant player stock. Original IDs/scope below remain intact.

M2-F11 is the aggregate controlled-comparison gate and stays unchecked until a real biofilter exists at M5-F02. Its core feed/DO/TAN/density/hot/clock comparisons are tested alongside M2 mechanics before M3; the full aggregate including filter is rerun after M5-F02. M3/M4 vertical/data gates remain mandatory before M5 expansion. No fake filter comparison or broad scope reduction.

Implementation order: M0-F01 → M0-F02 → M0-F03 → M0-F04 → M0-F05 → M0-F06 → M0-F07 → M2-F01 → M4-F01 → M4-F02 → M4-F03 → M4-F04 → M1-F01 → M1-F02 → M1-F03 → M1-F04 → M1-F05 → M1-F06 → M1-F07 → M1-F08 → M2-F02 → M2-F03 → M2-F04 → M2-F05 → M2-F06 → M2-F07 → M2-F08 → M2-F09 → M2-F10 → M3-F01 → M3-F02 → M3-F03 → M3-F04 → M3-F05 → M3-F06 → M3-F07 → M3-F08 → M3-F09 → M4-F05 → M4-F06 → M4-F07 → M4-F08 → M5-F01 → M5-F02 → M2-F11 → M5-F03 → M5-F04 → M5-F05 → M5-F06 → M5-F07 → M6-F01 → M6-F02 → M6-F03 → M6-F04 → M6-F05 → M6-F06 → M6-F07 → M6-F08 → M7-F01 → M7-F02 → M7-F03 → M7-F04 → M7-F05 → M7-F06.

## Original64 feature scopes

- [x] **M0-F01** — Audit local, remote, production release commit, current Dot tasks, uncommitted files/worktrees, deployment and rollback; find any Fish work not pushed.
- [x] **M0-F02** — Verify **Crop/Chicken/Goat/Cow actual status**, especially pending Cow 62/64 snapshot, and establish safe sequential integration without overwriting active task.
- [x] **M0-F03** — Read current headless engine/tick, renderer camera, Market, ledger, fish-relevant configs, storage and save migration; record actual version and integration seam.
- [x] **M0-F04** — Run available baseline local lint/typecheck/unit/build/E2E/chicken/cow/goat/homepage/security/SEO/compat tests; distinguish baseline issue vs new regression.
- [x] **M0-F05** — Create isolated branch/checkpoint, sanitized V1–latest save fixtures, preserve original media, record release rollback plan and ignored QA path.
- [x] **M0-F06** — Prototype lightweight isometric pond mock/layout, asset license inventory and mobile/desktop target; no new renderer dependency without evidence.
- [x] **M0-F07** — Add this PRD living checklist & architecture/test contract to `docs/`; set feature gate default OFF until vertical slice, no production changes.
- [x] **M1-F01** — Add `Fish Pond` area selector and navigation within `/play/`; no new save/game route, old views still work.
- [x] **M1-F02** — Draw one cohesive pond/water/edge/deck/inlet/outlet scene with correct isometric alignment; no world overlap or clipped picking.
- [x] **M1-F03** — Render fish cohorts in two size/stage variants based on actual state (or presentation fixture before M2); no mismatch between state and fish count label.
- [x] **M1-F04** — Add lightweight swim/surface/feeding visual animations, reduced-motion and low-graphics fallbacks, no simulation driven by frame rate.
- [x] **M1-F05** — Add interactive aerator bubbles, feed station, harvest net/dock, water-exchange station and real visual ON/OFF/status states.
- [x] **M1-F06** — Implement concise contextual controls `Feed`, `Aerate`, `Inspect`, `Harvest`, `Market` with disabled reasons; no inert buttons claiming success.
- [x] **M1-F07** — Validate camera controls, rotate/zoom/reset where supported, scene picking, keyboard and touch portrait/landscape; switch Field/Chicken/Goat/Cow ↔ Fish without save mutations.
- [x] **M1-F08** — Translate all UI EN/ID, aria labels, error/empty states, `Why?` and mission scaffolding; no inaccessible hover-only elements.
- [x] **M2-F01** — Define FishPond/Pond/FishCohort/FishHarvestLot data/config, bounded integer units, stable IDs and strict invariants.
- [ ] **M2-F02** — Add validated `fish.*` commands to existing dispatch/revision/transaction flow, atomic reject/replay behavior, seed determinism.
- [ ] **M2-F03** — Implement exactly-once starter pond/cohorts/feed/first entry, separate pond water from crop tank, safe zero-wallet tutorial allowance.
- [ ] **M2-F04** — Implement feed purchase/store/feed consumption + limited appetite, excess-waste and stock accounting; no feed/growth spam.
- [ ] **M2-F05** — Implement pond DO oxygen mass concentration, fish respiration/waste demand, surface replenishment, sensible game day/night variation.
- [ ] **M2-F06** — Implement paid/basic aerator state, energy cost, oxygen transfer bounds, out-of-Coins shutoff with truthful status.
- [ ] **M2-F07** — Implement TAN/waste accumulation, uneaten feed impact, bounded pH/temp/clarity estimates without conflating TAN and NH3.
- [ ] **M2-F08** — Implement paid water exchange with separate supply/source, 5% mass-balance/dilution and effluent accounting; protect crop water tank.
- [ ] **M2-F09** — Implement fish growth stages, biomass/density/water quality/growth trade-offs using shared logical ticks, weather and seeded reproducibility.
- [ ] **M2-F10** — Implement market readiness, grade, recoverable fish condition; hard capacity and safe stock purchase checks.
- [ ] **M2-F11** — Headless controlled tests compare fed/unfed, moderate/overfed, aerator ON/OFF, filter/no-filter, stocking density, hot weather; 24 ticks==Next Day, state/ledger/resource bounds.
- [ ] **M3-F01** — Wire pond entry and starter view to persisted engine state; show 4 market-ready + 8 fingerlings as separate cohorts where config permits.
- [ ] **M3-F02** — Add FarmGirl `My First Fish Harvest` chapter in context; mission progression depends only on accepted actions/state evidence, not rendering.
- [ ] **M3-F03** — Connect Feed/Aerate/Inspect buttons to real commands/ticks with state-driven water indicators and causal `Why?` text.
- [ ] **M3-F04** — Render accurate `Ready to Harvest` state and implement atomic actual harvest from eligible cohort → FishHarvestLot (count/weight/grade), no double-harvest.
- [ ] **M3-F05** — Add fish harvest lots to **existing shared Market/inventory** and correct grade/weight price with integer Coins, ledger sale exactly once.
- [ ] **M3-F06** — Add first paid **aerator efficiency upgrade** with visible state change and measurable DO-per-energy benefit; purchase atomic.
- [ ] **M3-F07** — Add fingerling restock/shop with valid density/stock constraints, affordability and actionable insufficient resources/no-water recovery.
- [ ] **M3-F08** — Mission completion & next objectives once only; first-harvest sale economics and upgrade feasible for fresh/zero-wallet/reused save.
- [ ] **M3-F09** — **FUNCTIONALITY-FIRST VERTICAL SLICE:** Chromium desktop/touch-mobile EN/ID first entry → Feed → Aerate/Why → Harvest → Sell → Upgrade/Restock and resume, target automated ≤180 sec; old Crop/Chicken/Goat/Cow flows pass.
- [x] **M4-F01** — Audit actual latest schema at execution and add additive Fish version/migration (if latest V4, V4→V5); no starter grant on parse/migration.
- [x] **M4-F02** — Verify migrators from original crop V1, Chicken V2, Goat V3, Cow V4 where supported; untouched subtree snapshots/ledger/RNG exact semantically.
- [x] **M4-F03** — Add safe `before-fish` archival original bytes with conflicts/quota blocked preview, preserve all earlier archives/backup/quarantine.
- [x] **M4-F04** — Validate persisted fish state/cohorts/DO/TAN/credits/lots/mission/reward, bounded histories and size, reject malformed/unknown/prototype input.
- [ ] **M4-F05** — Test save/reload/reopen/pause/hidden/system-clock shift; fish growth, energy, waste and events do not progress twice.
- [ ] **M4-F06** — Test export/import, confirmed reset, restore from backup, corrupt/quarantine/future schema, denied/quota storage; user data never silently deleted.
- [ ] **M4-F07** — Test parallel tabs/stale revisions, double harvest/sale/restock/upgrade/one-time grant, atomic wallet/stock and idempotency.
- [ ] **M4-F08** — Mixed farm endurance >=30 in-game days + roundtrips all four earlier areas + Fish; resource mass balance, ledger and bounded save pass.
- [ ] **M5-F01** — Add second pond expansion with independent water quality/cohorts, shared wallet/clock/weather, unlock/space and visual state.
- [ ] **M5-F02** — Add biofilter upgrade that lowers actual TAN or water exchange demand with real Coins/energy/maintenance cost; no magic clean button.
- [ ] **M5-F03** — Add auto-feeder scheduling upgrade that consumes purchased feed and uses tick, reduces clicking without producing free growth.
- [ ] **M5-F04** — Add `Healthy Water`, `Grow-Out`, `Fish Market Contract` chapters with reachable goals and one-time payouts.
- [ ] **M5-F05** — Add `Energy Saver`/efficient aeration challenge and compare real paid operation costs; explain benefits through visible outcome.
- [ ] **M5-F06** — Engineering Lab Fish: actual DO mg/L, TAN mg/L (not free NH3), pH/temp estimates, feed input/waste, biomass/density, growth trends, fish grade, FCR proxy, Coins/unit margins; disclosures and `Why?`.
- [ ] **M5-F07** — Balance simulations 7/30/60/90 game days for Fish-only, mixed, high/low feeding, hot weather, aeration strategies, supply constraint and upgrade ROI; no unbounded “fish money printer”.
- [ ] **M6-F01** — Black-box full UI E2E fresh/old save, first fish sale, second pond, crop/hen/goat/cow regressions, Market, upgrade, EN/ID.
- [ ] **M6-F02** — White-box engine/invariant/seed and property/fuzz tests for DO/TAN/feed/water/biomass/growth/grade/costs/commands.
- [ ] **M6-F03** — Security/adversarial tests: malicious save, poisoned object, excessive input, duplicate revision, stale tab, unsafe UI insertion, no secrets/network runtime.
- [ ] **M6-F04** — Browser/compat tests Chromium and Firefox if available, EN/ID, 320/360/390/768/1024/1440 landscape, keyboard, touch, focus, reduced motion.
- [ ] **M6-F05** — Performance/endurance slow/mobile and 90-game-day simulation; bounded SVG/timers, memory, event listeners, save size, fast area switching.
- [ ] **M6-F06** — Dead-code dependency/repo hygiene audit: remove obsolete **new** code only, preserve previous assets, keep artifacts/cache/screenshot outside Git.
- [ ] **M6-F07** — Snapshot regression homepage one-card design, game routes, GA4, canonical/OG/sitemap/editorial, existing assets/media and security headers.
- [ ] **M6-F08** — Clean release-candidate dry-run: all available `lint`, `typecheck`, `test`, `build`, `e2e`, `chicken`, Goat/Cow suites if present, Fish suite, homepage, security, SEO, compat, performance, balance, endurance, rollback reader.
- [ ] **M7-F01** — Verify current release permissions/holds, precise commit, diff, clean build output, compatible rollback and archived old-save original.
- [ ] **M7-F02** — Local final test/review and staged/no-force-push release using audited GitHub→Cloudflare pipeline, no GitHub Actions routine QA.
- [ ] **M7-F03** — Confirm production asset/commit/deployment ID integrity, security headers, canonical/OG and no unexpected deleted editorial content.
- [ ] **M7-F04** — Live isolated-browser desktop/mobile EN/ID Fish first loop + resume/import + full Crop/Chicken/Goat/Cow smoke, screenshots and console errors, owner saves untouched.
- [ ] **M7-F05** — **ONLY after Fish live verified**, revise existing homepage **single card** future/planned text to accurately say Fish playable; adjust EN/ID, alt/OG copy and cache busting without additional game cards, reverify production.
- [ ] **M7-F06** — Final report: 64/64 evidence, completed scope, tests, production URL/commit/deploy ID, perf/QA, known limits, safe rollback preserving Fish saves, next roadmap.

## Verified feature evidence


### M0-F01
Verified isolated checkout, remote main and115 exact production resources; no other active local writer or Fish publication. Deadline guard tested and running.

### M0-F02
Resolved stale Cow62/64 snapshot against actual64/64 release and exact production assets; all four prior areas preserved.

### M0-F03
Documented actualV4 seams, shared tick/spending/RNG order, future-mass capacity, tutorial budget and auditable repeat recovery design.

### M0-F04
Fresh lint/typecheck/build/client audit and262unit tests PASS; unchanged exact-source prior full regressions retained with provenance.

### M0-F05
Captured actual synthetic fresh/mixedV4 including earned3Cow farm; exact reader hashes and byte-preservation test PASS; isolated branch and rollback retained.

### M0-F06
Original code-native isometric SVG prototype visually inspected;12 EN/ID desktop/mobile layouts and four orientations PASS; no new dependency.

### M0-F07
Living64-feature checklist, architecture/test contract and default-OFF gate complete;264unit tests, strict types/build/client audit PASS.

### M2-F01
Standalone Fish model/config and strict conservation validator complete;270unit tests, types/build/audit PASS; mature-mass reservation covers every growth step.

### M4-F01
AdditiveV5 Fish migration with empty grants and exactV4 preservation PASS;273unit tests/types/build/audit PASS after explicit legacy projection updates.

### M4-F02
Nine actualV0-V4 fixtures preserve every legacy field; exactV4 rollback reader blocksV5; released reducer differential replay matches RNG/spending/all four areas.

### M4-F03
Independent beforeFish archive preserves exact actual-source bytes; conflict/quota/future/recovery tests PASS;280units and4 EN/ID browser export/reload profiles PASS.

### M4-F04
StrictFish model/ledger/source/mission/recovery validation PASS including hundreds of hostile numeric mutations and getter/prototype rejection;286units plus lint/types/build/audit PASS.

### M1-F01
Gated Fish Pond preview navigation works in existing play route;8 EN/ID desktop/mobile gate/old-area profiles preserve exact primary save.

### M1-F02
Cohesive original isometric pond/water/edge/deck/inlet/outlet scene passes8 gate/navigation profiles; desktop/mobile pixels inspected, no overlap or save mutation.

### M1-F03
Read-only Fish snapshots render two school sizes with actual count/ready labels; validated partial-harvest10/2 fixture and8 EN/ID browser profiles preserve saves.

### M1-F04
Decorative swim/surface/feed motion uses CSS only;2 browser profiles verify movement/pause/reduced-motion/low-graphics without loading engine; types/build/audit PASS.

M1-F04 correction: final surfacing rule initially overrode reduced-motion by CSS specificity. Strong fallback override now disables every Fish animation; final two browser profiles PASS at qa/fish/M1-F04-fixed/report.json. No later feature started before repair.

### M1-F05
Six interactive stations, feed/net/water/aerator visuals and actualON/OFF bubbles PASS8 EN/ID browser profiles;44px shortcuts, keyboard/focus restore, exact saves.

### M1-F06
Contextual Feed/Aerate/Inspect/Harvest/Market controls have truthful preview disabled reasons; actual inspect/Why and shared Market dialog PASS8 EN/ID profiles.

### M1-F07
Existing camera now supportsFish;12 EN/ID portrait/landscape320-1440 profiles verify4rotations, touch picking, keyboard pan, zoom/reset and all old-area/save preservation.

### M1-F08
EN/ID UI/aria/Why/error/empty coverage complete;289units,4empty+8station profiles,12compat surfaces/Firefox crop and full original gameplay/data/recovery E2E PASS after bounded legacy-fixture/harness fixes.
