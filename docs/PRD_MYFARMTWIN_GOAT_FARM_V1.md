# Goat Ranch V1 — implementation checklist

This is project implementation documentation derived from the authoritative Library PRD, not a materialized Library file.

Source: `MYFARMTWIN_GOAT_FARM_MASTER_PRD_V1.md`, Library `libfile_fc76c0db920481918dad59d081068072`, file `file_000000007bb881f5a2dd743ed88be1ea`, source version 0, read completely (361 lines, no remaining pages). Original source size: 30,283 bytes. Windows transfer could not apply `os.setxattr`; no source copy was manufactured. Parent explicitly authorized using the complete Library read as the specification.

Scope: one shared farm/clock/Coins/Market/save, live-goat care/growth/sales. Starter once: one ready adult and two weaned goats; every sale leaves at least two. No milk, breeding or other expansions. Existing crops, chickens, homepage, EN/ID, SEO and deployment config must survive.

Publication restriction: local coding/testing only. No push or deployment without new explicit authorization; M7 publication/live items remain unchecked until then.

Baseline: `1e140428eba6743817e808676c689ce4ff7fffcf`; isolated branch `goat-ranch-v1`. QA logs/screenshots stay outside Git at `task-2/qa/goat/`.

Progress: **55/60 (91.7%)**.

## Checklist

- [x] **M0-F01** — Audit latest local/remote/live repo, active Dot tasks, branches/commits and uncommitted code; do not overwrite ongoing Chicken work.
- [x] **M0-F02** — Run baseline lint/typecheck/unit/build/e2e/homepage and available compatibility/security tests; document existing failures separately.
- [x] **M0-F03** — Verify exact Chicken status (implemented, ongoing, absent) and define safe prerequisite/integration gate.
- [x] **M0-F04** — Map engine/tick/weather/Market/ledger/UI/save APIs and actual schema version; identify reuse points.
- [x] **M0-F05** — Create safe checkpoint/branch, sanitized old-save fixtures and rollback strategy without touching user save.
- [x] **M0-F06** — Commit living PRD, technical acceptance contract and local test plan; no implementation before gate.
- [x] **M1-F01** — Add `Goat Ranch` area switch to `/play/`, preserving Field/Chicken state and keyboard/touch behavior.
- [x] **M1-F02** — Render enclosed yard/shelter/pasture with responsive geometry, no crop plot overlap or route split.
- [x] **M1-F03** — Render 3 starter goats from stable state (one adult and two weaned), visually distinguishable.
- [x] **M1-F04** — Add light state-driven idle/walk/browse/chew/climb animations and reduced-motion fallback.
- [x] **M1-F05** — Render/select hay rack, shared water trough, cleanable shelter, paddock and safe climb platform.
- [x] **M1-F06** — Add contextual actions Feed/Water/Clean/Inspect/Sell, with correct disabled state and human-readable reasons.
- [x] **M1-F07** — Mobile 320–390 and desktop interactions, pan/zoom/reset (rotate if applicable), keyboard/focus, low graphics.
- [x] **M1-F08** — EN/ID for every Goat view/control/status/error; seamless return to Crop/Chicken guide.
- [x] **M2-F01** — Define Goat/Herd/Shelter/Paddock config with bounded values, stable IDs, age-stage semantics and validators.
- [x] **M2-F02** — Wire goat commands into existing revision/idempotency/atomic engine transaction flow.
- [x] **M2-F03** — Hay purchase/store/refill/consumption with feed conservation and accurate ledger.
- [x] **M2-F04** — Water trough/refill/consumption from shared farm tank with volume conservation.
- [x] **M2-F05** — Pasture biomass, browse consumption and deterministic regeneration based on shared weather.
- [x] **M2-F06** — Shelter cleanliness/clean action and bounded maintenance cost/effect; prevent spam exploits.
- [x] **M2-F07** — Causal nutrition/hydration/space/weather → comfort/condition with gradual recovery, no offline degradation.
- [x] **M2-F08** — Growth stages `weaned→growing→market-ready` using game ticks and configurable compressed duration.
- [x] **M2-F09** — Herd capacity and social minimum-two sale rule, with rejection messages and recovery suggestions.
- [x] **M2-F10** — Unit/invariant tests seeded scenarios: no feed/water, good care, hot/rainy, overgrazing, pause, 24 ticks=Next Day.
- [x] **M3-F01** — Grant one-time starter shelter + three goats + bounded supplies when first entering Goat Ranch.
- [x] **M3-F02** — Implement `My First Goat Sale` chapter, FarmGirl guide, persisted progress and area-specific mission display.
- [x] **M3-F03** — Bind Feed/Water/Clean/Inspect buttons to real commands and causally correct visual feedback.
- [x] **M3-F04** — Integrate live-goat sale quote/contract into the **same** Market as crops/eggs.
- [x] **M3-F05** — Atomic sale ready adult → remove goat once, credit Coins/ledger once, leave two goats together.
- [x] **M3-F06** — Allow purchasing a weaned goat (capacity + Coins checks) and a viable non-exploitable recovery path.
- [x] **M3-F07** — Complete mission reward once and reveal next upgrade/goal without repeatable free grants.
- [x] **M3-F08** — **MVP GATE:** scripted desktop+touch mobile first entry→Feed→Water→Clean→Inspect→Sell→Coins→Next Goal; target automated ≤180s and Crop/Chicken regression green.
- [x] **M4-F01** — Audit newest real schema, implement safe `latest→next` Goat version migration (no hardcoded assumption).
- [x] **M4-F02** — Verify full V1 Crop save migration without altering Crop funds/history/missions/tank/ledger.
- [x] **M4-F03** — Verify Chicken-era save migration and exact preservation if Chicken exists; document evidence if not applicable.
- [x] **M4-F04** — Save/reload/import Goat herd, stock, pasture, growth, sale/grants, missions, visuals exactly.
- [x] **M4-F05** — Auto-save, paused/hidden tab, Next Day, system clock shifts: no phantom production or starvation.
- [x] **M4-F06** — Invalid/future/malicious save, recovery/backup/quarantine, storage blocked: protect original user data.
- [x] **M4-F07** — Two-tab concurrency/double-click/replay tests: one sale/grant/purchase, no wallet/growth dupes.
- [x] **M4-F08** — Mixed-farm 30+ game-day endurance with daily save roundtrip; bounds, ledger, clock consistent.
- [x] **M5-F01** — Unlock paddock #2 and implement actual rotational grazing/regrowth tradeoffs and visual switching.
- [x] **M5-F02** — Shelter upgrade costs Coins, improves capacity/comfort and visibly changes the scene.
- [x] **M5-F03** — Feeder/trough upgrade reduces repeated clicking **without** creating water/hay from nothing.
- [x] **M5-F04** — Buy extra weaned goats within capacity; stable IDs, stage and herd welfare rules maintained.
- [x] **M5-F05** — Follow-up missions: Healthy Herd, Growing Goat, Pasture Planner, Bigger Shelter, Livestock Contract.
- [x] **M5-F06** — Add optional Engineering Lab/Why? with real factors, feed/water/forage trends and goat P&L.
- [x] **M5-F07** — Balance 7/30/60/90 game days: good vs bad care, Goat/Crop/Chicken/mixed, sale economics and bounded wealth.
- [x] **M6-F01** — Black-box full E2E desktop/touch-mobile across Crop/Chicken/Goat, new & existing saves, Market, missions.
- [x] **M6-F02** — White-box deterministic growth/care/conservation/contract/ledger/min-two invariant tests.
- [x] **M6-F03** — Security tests for untrusted save, prototype keys, malformed state, stale revisions, duplicate commands.
- [x] **M6-F04** — EN/ID + keyboard/screen reader accessible labels/reduced motion; viewport 320/360/390/768/1024/1440 + landscape; Firefox if available.
- [x] **M6-F05** — Performance/memory/long-session tests; low-graphics retains all essential actions.
- [x] **M6-F06** — Dead-code/new-dependency/media audit; preserve existing assets, keep repo small, no QA junk/cache in Git.
- [x] **M6-F07** — Homepage single-game-card, editorial routes, metadata/sitemap/GA4, original Crop+Chicken tests all green.
- [x] **M7-F01** — Fresh clean local build, full test suite, release diff review and deployment/config comparison.
- [ ] **M7-F02** — Validate safe backup/migration/rollback; older client must not overwrite future-format saves.
- [ ] **M7-F03** — Push/deploy via **existing audited Cloudflare Pages/GitHub pipeline**; no force push or unnecessary GitHub Actions runs.
- [ ] **M7-F04** — Live desktop+touch-mobile browser smoke of Goat full first sale plus Crop/Chicken, use isolated test profiles.
- [ ] **M7-F05** — Verify exact live commit/assets, SEO/security/performance and rollback capability; rollback on genuine production regression.
- [ ] **M7-F06** — Final report with test evidence, screenshot/log locations outside Git, deployed URL/commit, known issues, living checklist completion.

## Evidence

### M0-F01
Local/remote main both at baseline 1e14042, no unfinished Chicken changes. Chicken release branch retained; new isolated Goat branch. Live browser homepage confirms `desktop-promo-v3`, exactly one game card and `/play/` entry. Previous deployment evidence: `qa/home-desktop-v3/live/deployment.json`. No other coding agent delegated. Working tree initially clean. Only scoped immutable-fixture EOL baseline repair is underway.

### M0-F02
Baseline lint/typecheck, 96 unit tests, safe build, complete desktop/touch E2E incl crop vertical slice/save recovery/import/data/black-box, 24 homepage surfaces, 12 compatibility surfaces plus Firefox and security PASS. Fixed only two pre-existing issues: exact rollback fixtures LF-pinned with unchanged Git hashes, and obsolete pre-promo homepage link-name locator. Existing Firefox configured through supported environment variables. Evidence: task-2/qa/goat/baseline-fixed/.

### M0-F03
Chicken is implemented and feature-enabled at baseline 1e14042; 96 unit tests and a fresh real-button first-sale/crop-cross-area journey pass on EN/ID desktop and touch mobile. No ongoing Chicken changes or agent work to merge. Evidence: qa/goat/baseline-fixed/flow-slice.json. Dependency gate satisfied; preserve the existing V2 chicken subtree.

### M0-F04
Mapped current V2 schema and exact allowed fields; shared dispatch revision+clone/reject semantics, logical hour/weather/RNG, Coins/ledger, tank, Market, mission displays, per-area camera and locked SaveSession APIs. Safe build copies only dist/play. Technical acceptance/test/rollback contract recorded in GOAT_CONTRACTS.md.

### M0-F05
Isolated goat-ranch-v1 branch; immutable production/main checkpoint 1e14042 retained. Captured validated synthetic fresh V2 and 35-day mixed Crop/Chicken V2 saves (8 beds, 2 hens, tick 840, 2350 Coins), manifest hashes and exact original V2 save-schema/storage/config reader bytes. SHA256 and serialize/deserialize equality PASS; no real user save accessed. Existing V0/V1 fixtures remain available.

### M0-F06
M0 gate PASS: authoritative-source living checklist, GOAT_CONTRACTS acceptance/test/rollback plan and GOAT_AUDIT committed after all applicable baseline checks. Existing data/features preserved. Sequential implementation may begin; no gameplay or schema changes before this checkpoint.

### M1-F01
Goat area switch works via keyboard/touch EN/ID; Field planted crop, Chicken hens/guide and exact serialized save remain unchanged on roundtrip. No grant or schema mutation. lint/typecheck/build and four real-browser profiles PASS; test waits on the existing origin-write lock before assertions. Evidence: qa/goat/M1-F01/.

### M1-F02
Original lightweight isometric enclosed ranch rendered in the same /play view: 64 terrain cells, 4 fence edges, roofed shelter, leafy browse area and six stations. Four EN/ID desktop/touch geometry/overflow and exact Field/Chicken save regressions PASS, lint/typecheck/build PASS; desktop pixels reviewed. No simulation/economy claims. Evidence: qa/goat/M1-F02/.

### M1-F03
Three stable scene goats now visibly distinguish one large ready adult from two smaller weaned young, with unique goat.starter IDs and EN/ID accessible labels. Four browser cases verify stage counts, stable IDs across locale redraw and unchanged farm saves; lint/typecheck/build PASS. Scene-only snapshot is immutable; no first-entry grant before M3. Evidence: qa/goat/M1-F03/.

### M1-F04
Light idle/walk/browse/chew/rest/short-climb SVG motions are derived from the shared logical tick snapshot; CSS cannot mutate growth/Coins/save. Full unit suite (97 tests), lint/typecheck/build and four EN/ID desktop/touch motion/reduced-motion/low-graphics plus exact-save regression cases PASS. Evidence: qa/goat/M1-F04/.

### M1-F05
Seven stations/shelter and three goats selectable with shared per-area camera picking and accessible shortcuts. Real SVG trough tap/click and hay keyboard picking, all shortcut selections, Escape/close focus restoration, invalid selection rejection and exact saves PASS on four EN/ID desktop/touch profiles. Fixed a real mobile overlay found by painted-object testing: Goat shortcuts now flow below SVG; non-overlap asserted. Crop/Chicken first-sale regression four profiles, lint/typecheck/build PASS. Evidence: qa/goat/M1-F05/.

### M1-F06
Context panels now provide working Inspect disclosures and shared Market entry. Feed/water/clean/sell controls show explicit visible EN/ID reasons and aria-describedby while M1 is presentation-only; no fake economy operation or grant. Four desktop/touch profiles verify disabled reasons, accessible expanded inspection, Market navigation and exact old-save/guide preservation. lint/typecheck/build PASS. Evidence: qa/goat/M1-F06/.

### M1-F07
Goat camera/accessibility gate PASS on 10 EN/ID profiles: 320/360/390 portrait, 844x390 landscape and 1440 desktop. Real touch/mouse drag never picks accidentally; all four rotations preserve painted trough picking; zoom clamps, reset, independent per-area cameras, keyboard/focus, >=44px controls, low graphics and below-world panel verified without save mutation. Existing full six-hen Chicken plus rotated Field picking/expansion camera regressions PASS on desktop/touch. Evidence: qa/goat/M1-F07/.

### M1-F08
Full current ranch EN/ID labels/actions/errors/disclosures and locale redraw verified; active selection and exact saves preserved, Crop/Chicken guides restored. lint/typecheck, 97 unit tests, build, full original E2E/data/recovery/black-box/crop flow, 24 homepage surfaces and nine-route/15-layout SEO PASS. GOAT_M1_GATE documents presentation limits and later model/save gates. Homepage preservation scope excludes only intentionally edited game output under explicit test flag. Evidence: qa/goat/M1-F08/.

### M2-F01
Defined bounded herd/shelter/paddock/supply configuration, stable identities, derived age stages and strict unknown/prototype/finite/unique/capacity validators. Empty additive state grants nothing. Synthetic kit has one ready adult/two weaned; juvenile growth cannot exceed owned game age. Hay/water/browse accounting rejects duplicated supplies. 101 full unit tests including adversarial cases, lint/typecheck/build PASS; no engine/save coupling yet. Evidence: qa/goat/M2-F01/.

### M2-F02
Strict Goat commands now share atomic clone/revision dispatch, ledger and clock. Replays/stale/polluted payloads reject unchanged; enter/inspect work headlessly, other husbandry commands remain unavailable until their own gates. Added required V3 empty-state reader and separate pre-Goat original archive before persisting any new field; old Chicken archive and unaffected V1/V2 subtrees preserved. 105 unit tests incl exact production V2 rollback, lint/typecheck/build, Chicken save/data, original full E2E/data/recovery/black-box/crop, security and Goat UI preservation PASS. M4 remains pending. Evidence: qa/goat/M2-F02/; GOAT_SAVE_POLICY.md.

### M2-F03
Hay purchase charges 24 shared Coins for 6kg exactly once, storage->rack transfer preserves quantity, existing logical hours consume hay without negative stock, paused tick rejects unchanged. Capacity/no-Coins/replay/empty-rack paths are atomic; Crop/Chicken inventory and funds unaffected by transfers; V3 roundtrip exact. 108 full unit tests, lint/typecheck/build PASS. EN/ID events/rejection/ledger labels added. Evidence: qa/goat/M2-F03/.

### M2-F04
Shared tank litres transfer to trough ml exactly; real shared-hour drinking conserves volume, hot weather raises demand, partial/empty/full tanks and replay reject safely. No extra Coin charge for transfers; existing paid farm refill remains recovery. Crop/Chicken state preserved; paused clock/dry trough never creates water or underflows. 111 unit tests, lint/typecheck/build PASS; EN/ID feedback added. Evidence: qa/goat/M2-F04/.

### M2-F05
Actual paddock browse is consumed before hay. Bounded regrowth uses existing shared weather and resting/active grazing pressure without another RNG/clock; biomass and lifetime consumed/regrown terms conserve mass. Seeded 20-day save/replay shows overgrazing shortages without negative stocks; rain/rest/heat and cap scenarios tested. 114 full unit tests, lint/typecheck/build PASS. Earlier feed assertions now include actual browse plus hay, preserving total demand/accounting. Evidence: qa/goat/M2-F05/.

### M2-F06
Shelter use lowers cleanliness only in shared logical hours. Free cleaning improves cleanliness by at most 20, caps at 100, obeys six-game-hour cooldown and does not directly recover body condition or grant Coins/items/rewards. Pause, 30-day neglect, full shelter, cooldown and 20-click spam cases preserve bounds and atomically reject; 117 unit tests, lint/typecheck/build PASS. Evidence: qa/goat/M2-F06/.

### M2-F07
Actual consumed browse/hay and water drive gradual adequacy, derived shelter/space/weather comfort, and bounded body condition recovery/decline. Same-seed paid 10-day good care beats shortages with conserved supply cost, identical shared RNG/weather and no death. Refilling/cleaning cannot instantly heal; one-hour effects, dirty/hot/room terms and immutable derived snapshots tested. No offline wall-clock effect. 120 unit tests, lint/typecheck/build PASS. EN/ID causal reasons added. Evidence: qa/goat/M2-F07/.

### M2-F08
Young goats grow only on the existing logical hour using actual nutrition/hydration/body condition; derived weaned->growing->marketReady stages never regress or exceed one. Real paid care in an earned mixed farm matures both young within 12-20 owned game days; identical elapsed shortage stays below 10%. Starter adult is ready at entry and care clicks do not advance growth. 123 unit tests, lint/typecheck/build PASS; compressed-game labels and growing size/label added. Evidence: qa/goat/M2-F08/.

### M2-F09
Model policies require mature stage, adequate condition and at least two goats after sale. Every attempted quote from a valid two-goat group rejects with a recovery explanation; full shelter/no Coins disallow purchases and strict capacity rejects overcrowding with valid distinct IDs. Shared tick/condition gives deterministic integer live-livestock quotes without state mutation. Actual sale/purchase UI transactions remain in M3. 126 unit tests, lint/typecheck/build PASS; EN/ID reasons and honest adult-vs-sale-ready labels added. Evidence: qa/goat/M2-F09/.

### M2-F10
M2 gate PASS: 130 unit tests cover seeded good/no-feed/no-water/hot/rain/overgrazing scenarios, exact 24-tick vs Next Day semantics, pause and system-clock shifts, mass conservation, care/growth and immutable inputs. Import now rejects below-floor condition and impossible owned-time consumption/regrowth/health/cleaning counts. Existing Crop/Chicken replay/rollback tests remain green; lint/typecheck/build PASS. GOAT_M2_GATE documents model/presentation boundary and next M3 vertical slice. Evidence: qa/goat/M2-F10/.

### M3-F01
Real UI first entry now atomically grants the saved shelter/one mature+two weaned herd/6kg hay once, with at most 12L shortage-only starter water voucher (zero Coins) to avoid empty-tank/zero-wallet softlock. Removed the presentation-only herd; renderer snapshots actual ownership. 133 unit tests, lint/typecheck/build, eight new/existing V2 EN/ID desktop/touch first-entry/reload/locale cases and two parallel-tab grant races PASS. Older farm subtrees/archives preserved; actual Goat UI roundtrip PASS. Evidence: qa/goat/M3-F01/.

### M3-F02
First live-goat-sale chapter now persists evidence-driven progress only from accepted commands; reordered real care is remembered, guide reads/rejected spam cannot grant progress/rewards. Existing FarmGirl displays separate EN/ID Goat objectives/progress/targets and restores Crop/Chicken guides. Forged mission completion rejects. 136 unit tests, lint/typecheck/build and 12 desktop/touch/bilingual existing-progress guide/reload/save profiles PASS. Care controls are wired in the next feature. Evidence: qa/goat/M3-F02/.

### M3-F03
Feed/Water/Clean/animal Inspect now invoke real atomic commands, advance saved guide evidence and show actual kg/L/condition/growth/comfort. Rack hay, trough water and shelter dirt reflect actual model stocks/cleanliness; inspection remains open across redraw and keyboard focus is restored. 136 unit tests, lint/typecheck/build and 12 real-button new/existing/zero-Coins-empty-tank EN/ID desktop/touch care/reload profiles PASS, including protected Crop/Chicken state and no instant growth/healing. Legacy locale regression PASS; retired obsolete M1 disabled-care test branch. Mobile pixels reviewed. Evidence: qa/goat/M3-F03/.

### M3-F04
Live-goat quotes/requirements now appear in the same Market as real crop/egg inventory and shared supplies. Read-only contract review displays integer price, live-animal wording, condition/growth and herd-after-sale; first contract requires actual care/adult inspection. Panel contract entry and EN/ID requirements work without changing save/Coins; eight desktop/touch new/stocked-farm quote/reload cases plus four original crop/egg commerce journeys PASS, alongside 137 unit tests/lint/typecheck/build. Atomic fulfillment follows next. Mobile Market pixels reviewed. Evidence: qa/goat/M3-F04/.

### M3-F05
Quote-checked atomic live adult sale removes one goat, credits one shared ledger payment and keeps two. First-care/readiness/social/stale-price/forged-value/replay/accessor payloads reject without mutation. Market fulfillment is busy-protected; actual receipt gets accessible focus, and remaining animal coats/ordinals retain identity. 141 unit tests, lint/typecheck/build and 12 new/existing/zero-wallet EN/ID desktop/touch sale/double-click/reload/protected-old-farm cases PASS. Chapter reward/next investment are subsequent features; M4 historical-import hardening remains scheduled. Evidence: qa/goat/M3-F05/.

### M3-F06
Paid weaned-goat restocking and hay Market shop preserve the shared wallet and old farm. Capacity/no-Coins/replay checks, double-click guard, four distinct stable sprites, immature-sale rejection and exact reload pass. 144 unit tests, lint/typecheck/build and four EN/ID desktop/touch browser profiles pass. Evidence: qa/goat/M3-F06/.

### M3-F07
One-time 20-Coin chapter reward shares the atomic sale transaction and persists a unique grant/ledger row. Reload/replay/inspection cannot repeat it; next restocking goal unlocks and completed investment reaches step eight. 146 unit tests, lint/typecheck/build and twelve new/existing/zero-wallet desktop/touch EN/ID sales pass. Evidence: qa/goat/M3-F07/.

### M3-F08
MVP stop-and-fix gate PASS: twelve EN/ID desktop/touch new/existing/zero-wallet real first-sale journeys, next guide, payment/reward once, two remain and return to Field/Chicken. Four restocking profiles, complete original E2E/data/recovery/black-box/crop and four original Chicken/crop slices pass. Evidence: qa/goat/M3-F08/ and GOAT_M3_GATE.md; release persistence gates remain pending.

### M4-F01
Audited actual deployed Chicken V2 to current Goat V3 chain. Focused migration and exact V2 rollback-reader tests pass: original pre-Goat archive written before primary, no starter on migration, resume idempotent; conflicting archives and archive/backup/primary quota failures preserve original bytes and block writes. Existing separate pre-Chicken archive retained.

### M4-F02
Frozen fresh and progressed V1 crop saves preserve every unaffected subtree, funds, RNG, tank, ledger, missions and irrigation through V3 migration, first Goat entry and reload. Both original archives and fixture SHA256 stay exact. Legacy V0 stays readable with only documented additive defaults. Three focused migration tests pass.

### M4-F03
Captured real-format fresh and 35-day mixed Chicken V2 fixtures preserve complete hens/coop/eggs/history/grants and every crop field on additive migration and Goat first entry/reload. Existing pre-Chicken archive remains byte-identical and separate pre-Goat original is exact. Three focused preservation/policy tests pass; existing-save browser entry/sale already covered at M3 gate.

### M4-F04
Actual browser export/import/cancel/confirm/reload preserves an eight-day cared ranch with young growth, pasture stocks, paid purchase, completed sale/reward/mission and old mixed farm. Export bytes, restored bytes, all goat visual attributes and replaced-save backup are exact on EN/ID desktop/touch. Import preview now includes herd count; lint/typecheck/build pass. Evidence: qa/goat/M4-F04/.

### M4-F05
Four EN/ID desktop/touch browser profiles verify one shared auto-saved hour, hidden-tab automatic pause, unchanged paused resources, forward/backward system clock shifts and reload without catch-up. Next Day exactly equals headless dispatch over all farm fields and advances 24 hours. Evidence: qa/goat/M4-F05/.

### M4-F06
Historical price, paid acquisition, chronological capacity/social rules and impossible juvenile sales now validate at the untrusted-save boundary. 153 unit tests, lint/typecheck/build and twelve desktop/touch storage cases pass: quota, denied locks, blocked storage, future/corrupt saves and backup quarantine protect originals with no uncaught errors. Evidence: qa/goat/M4-F06/.

### M4-F07
Sixteen real two-tab races cover sale/reward, young-goat purchase, hay purchase and Next Day on EN/ID desktop/touch. Exactly one revision/transaction/hour advance wins, stale tab reports conflict, reload does not replay. Prior parallel first-entry and double-click/revision-replay tests cover one starter and gesture duplication. Evidence: qa/goat/M4-F07/.

### M4-F08
35-day real-command mixed-farm endurance passes daily save/session roundtrips, all invariants and complete deterministic replay. 430 commands, 39 replay rejections; four goat sales, four paid replacements, 93 crop units and 55 eggs sold; three goats remain, minimum wallet 120, final 1549, peak save 32837 bytes. M4 persistence gate documented; evidence qa/goat/M4-F08/.

### M5-F01
Paid second paddock and actual rotation now alter deterministic browse/rest/regrowth. Clicking alone creates no forage or growth; same/locked/duplicate/poor-wallet actions reject. 155 unit tests, lint/typecheck/build and four EN/ID desktop/touch browser profiles pass; two physical paddocks show current grazing selection and restore exactly after reload. Evidence: qa/goat/M5-F01/.

### M5-F02
Paid shelter upgrades raise actual capacity 4-to-6-to-8, increase shade and visibly enlarge the roof/building without creating goats or supplies. 156 unit tests, lint/typecheck/build and four desktop/touch EN/ID browser profiles pass, including double-click safety, exact stage costs and reload. Evidence: qa/goat/M5-F02/.

### M5-F03
Paid care-container upgrade doubles real feeder/trough capacity and visibly enlarges both objects. Installation preserves all hay/water/herd; later refill moves exact existing store/shared-tank quantities, never creates supplies. 157 unit tests, lint/typecheck/build and four EN/ID desktop/touch upgrade/reload profiles pass; scene pixels reviewed. Evidence: qa/goat/M5-F03/.

### M5-F04
Actual paid young-goat purchases fill each 4/6/8 capacity, reject overflow, retain unique sequential IDs and never instant-grow animals. Focused upgrade model tests and four EN/ID desktop/touch eight-goat browser profiles pass: distinct rendered positions, every shortcut selectable, correct total price and exact reload. Reviewed eight-goat scene. Evidence: qa/goat/M5-F04/.

### M5-F05
Five follow-up goals now use real healthy hours, juvenile growth, rested grazing/rotations, paid larger shelter/herd and a second valid live-goat contract. Every reward has one persisted grant and ledger row; repeat inspection/reload cannot farm rewards. Historical evidence validates on save. 159 unit tests, lint/typecheck/build and EN/ID desktop/touch progressed-save browser flows pass. Evidence: qa/goat/M5-F05/.

### M5-F06
Optional read-only Why/Engineering Lab explains real care terms, actual lifetime hay/browse/water use, deterministic quotes, direct ranch P&L and explicit equal cost allocation per goat. Bounded six-hour trends follow the shared clock and survive export/import. 161 unit tests, lint/typecheck/build and four EN/ID desktop/touch Lab/data profiles pass without save mutation on reads. Evidence: qa/goat/M5-F06/.

### M5-F07
32 real-command 7/30/60/90-day crop/Chicken/Goat/mixed good-vs-bad scenarios pass, including zero-wallet recovery. Fixed reproduced first-cycle cash-flow failure by tuning 6kg hay 24-to-12 Coins, preserving original historical prices. Zero-wallet Goat ends 90 days with 917 Coins/13 sales; no negative or unbounded states. 162 unit tests, lint/typecheck/build and four real purchase UI profiles pass. GOAT_BALANCE.md and qa/goat/M5-F07/.

### M6-F01
Eight real full-game black-box journeys cover new/existing mixed farms on EN/ID desktop/touch. Each plays Goat first sale/restock, actual crop grow/harvest/sale, Chicken care/lay/collect/sale, then returns to care the same goats; shared ledger unique, companion IDs preserved, no overflow/errors and exact reload. Evidence: qa/goat/M6-F01/.

### M6-F02
164 full unit tests pass. Added entire mixed-world Next Day-vs-24-hour equivalence for three seeds including goats/hens/crops/weather/history and exact roundtrip. Equal paid two-paddock 30-day comparison proves actual rotation improves browse intake, juvenile growth and condition without buying extra hay; all mass/social/economy invariants hold. Evidence: qa/goat/M6-F02/.

### M6-F03
Adversarial Goat envelopes reject identity/XSS/prototype/resource/growth/history/grant/ledger attacks; paid actions reject stale, hidden and inherited payloads without input mutation. Focused security/rollback tests and existing desktop/touch browser CSP/header/import suite pass; 57 client files scanned, no unsafe HTML/eval/credential patterns, external requests or policy violations. Evidence: qa/goat/M6-F03/.

### M6-F04
18 Chromium/Firefox EN/ID profiles at 320/360/390/768/1024/1440 and landscape pass maximum-eight-goat keyboard/labels/44px targets/reduced-motion/low-graphics/read-only Lab/overflow checks. Ten actual camera/touch profiles also pass all four rotations, drag picking, zoom/reset and per-area state. Fixed observed excess mobile SVG whitespace; repeated both suites pass and pixels reviewed. Unfocused skip link is genuinely offscreen and focused navigation works. Evidence: qa/goat/M6-F04/ and M6-F04-camera/.

### M6-F05
Twelve maximum-farm local browser performance runs pass at 59.6-60 desktop FPS and 43.4-59.2 FPS with 4xCPU/150ms/1.6Mbps mobile emulation. Goat low graphics 57.5 FPS; 30 extra browser days retain bounded DOM/heap. Asset growth and explicit three-area 350KB/130KB budgets documented honestly; unchanged frame/memory requirements, no runtime deps/media. Evidence: qa/goat/M6-F05/ and GOAT_PERFORMANCE.md.

### M6-F06
Final audit: 58 exact source/build files, zero runtime dependencies, new media, debug/eval imports or tracked QA/cache; homepage/editorial, dependency and deployment/security config unchanged. Fixed missing Goat return-summary progress and explicit Lab forage utilization/regrowth/current growth terms using the identical simulation helper. 167 unit tests, lint/typecheck/build/client audit and four actual data/Lab browser profiles pass. Evidence: qa/goat/M6-F06/.

### M6-F07
Original full crop/Chicken game/data/save/regression suites pass; homepage 24 responsive EN/ID profiles, warm-cache tests, nine SEO routes/15 layouts and Chromium/Firefox compatibility pass. Exact non-game dist/GA4/editorial and config/dependency bytes remain unchanged from production baseline. Remote main unchanged; no publication. Evidence: qa/goat/M6-F07-* and GOAT_M6_GATE.md.

### M7-F01
Fresh clean final build, lint/typecheck, 169 units, client/exact-byte/config audit and 32 balance scenarios pass. Fixed reproduced poisoned pre-visit Goat reward import; complete 19 browser suites/154 scenarios and original full E2E pass again. Final four Goat stress profiles pass at 59.2-60 FPS; assets 322524B raw/122011B summed gzip within documented caps. Evidence: qa/goat/M7-F01-* and GOAT_LOCAL_RELEASE_GATE.md.
