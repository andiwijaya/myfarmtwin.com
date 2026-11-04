# Goat Ranch V1 — implementation checklist

This is project implementation documentation derived from the authoritative Library PRD, not a materialized Library file.

Source: `MYFARMTWIN_GOAT_FARM_MASTER_PRD_V1.md`, Library `libfile_fc76c0db920481918dad59d081068072`, file `file_000000007bb881f5a2dd743ed88be1ea`, source version 0, read completely (361 lines, no remaining pages). Original source size: 30,283 bytes. Windows transfer could not apply `os.setxattr`; no source copy was manufactured. Parent explicitly authorized using the complete Library read as the specification.

Scope: one shared farm/clock/Coins/Market/save, live-goat care/growth/sales. Starter once: one ready adult and two weaned goats; every sale leaves at least two. No milk, breeding or other expansions. Existing crops, chickens, homepage, EN/ID, SEO and deployment config must survive.

Publication restriction: local coding/testing only. No push or deployment without new explicit authorization; M7 publication/live items remain unchecked until then.

Baseline: `1e140428eba6743817e808676c689ce4ff7fffcf`; isolated branch `goat-ranch-v1`. QA logs/screenshots stay outside Git at `task-2/qa/goat/`.

Progress: **27/60 (45.0%)**.

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
- [ ] **M3-F04** — Integrate live-goat sale quote/contract into the **same** Market as crops/eggs.
- [ ] **M3-F05** — Atomic sale ready adult → remove goat once, credit Coins/ledger once, leave two goats together.
- [ ] **M3-F06** — Allow purchasing a weaned goat (capacity + Coins checks) and a viable non-exploitable recovery path.
- [ ] **M3-F07** — Complete mission reward once and reveal next upgrade/goal without repeatable free grants.
- [ ] **M3-F08** — **MVP GATE:** scripted desktop+touch mobile first entry→Feed→Water→Clean→Inspect→Sell→Coins→Next Goal; target automated ≤180s and Crop/Chicken regression green.
- [ ] **M4-F01** — Audit newest real schema, implement safe `latest→next` Goat version migration (no hardcoded assumption).
- [ ] **M4-F02** — Verify full V1 Crop save migration without altering Crop funds/history/missions/tank/ledger.
- [ ] **M4-F03** — Verify Chicken-era save migration and exact preservation if Chicken exists; document evidence if not applicable.
- [ ] **M4-F04** — Save/reload/import Goat herd, stock, pasture, growth, sale/grants, missions, visuals exactly.
- [ ] **M4-F05** — Auto-save, paused/hidden tab, Next Day, system clock shifts: no phantom production or starvation.
- [ ] **M4-F06** — Invalid/future/malicious save, recovery/backup/quarantine, storage blocked: protect original user data.
- [ ] **M4-F07** — Two-tab concurrency/double-click/replay tests: one sale/grant/purchase, no wallet/growth dupes.
- [ ] **M4-F08** — Mixed-farm 30+ game-day endurance with daily save roundtrip; bounds, ledger, clock consistent.
- [ ] **M5-F01** — Unlock paddock #2 and implement actual rotational grazing/regrowth tradeoffs and visual switching.
- [ ] **M5-F02** — Shelter upgrade costs Coins, improves capacity/comfort and visibly changes the scene.
- [ ] **M5-F03** — Feeder/trough upgrade reduces repeated clicking **without** creating water/hay from nothing.
- [ ] **M5-F04** — Buy extra weaned goats within capacity; stable IDs, stage and herd welfare rules maintained.
- [ ] **M5-F05** — Follow-up missions: Healthy Herd, Growing Goat, Pasture Planner, Bigger Shelter, Livestock Contract.
- [ ] **M5-F06** — Add optional Engineering Lab/Why? with real factors, feed/water/forage trends and goat P&L.
- [ ] **M5-F07** — Balance 7/30/60/90 game days: good vs bad care, Goat/Crop/Chicken/mixed, sale economics and bounded wealth.
- [ ] **M6-F01** — Black-box full E2E desktop/touch-mobile across Crop/Chicken/Goat, new & existing saves, Market, missions.
- [ ] **M6-F02** — White-box deterministic growth/care/conservation/contract/ledger/min-two invariant tests.
- [ ] **M6-F03** — Security tests for untrusted save, prototype keys, malformed state, stale revisions, duplicate commands.
- [ ] **M6-F04** — EN/ID + keyboard/screen reader accessible labels/reduced motion; viewport 320/360/390/768/1024/1440 + landscape; Firefox if available.
- [ ] **M6-F05** — Performance/memory/long-session tests; low-graphics retains all essential actions.
- [ ] **M6-F06** — Dead-code/new-dependency/media audit; preserve existing assets, keep repo small, no QA junk/cache in Git.
- [ ] **M6-F07** — Homepage single-game-card, editorial routes, metadata/sitemap/GA4, original Crop+Chicken tests all green.
- [ ] **M7-F01** — Fresh clean local build, full test suite, release diff review and deployment/config comparison.
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
