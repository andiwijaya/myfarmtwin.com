# Goat Ranch V1 — implementation checklist

This is project implementation documentation derived from the authoritative Library PRD, not a materialized Library file.

Source: `MYFARMTWIN_GOAT_FARM_MASTER_PRD_V1.md`, Library `libfile_fc76c0db920481918dad59d081068072`, file `file_000000007bb881f5a2dd743ed88be1ea`, source version 0, read completely (361 lines, no remaining pages). Original source size: 30,283 bytes. Windows transfer could not apply `os.setxattr`; no source copy was manufactured. Parent explicitly authorized using the complete Library read as the specification.

Scope: one shared farm/clock/Coins/Market/save, live-goat care/growth/sales. Starter once: one ready adult and two weaned goats; every sale leaves at least two. No milk, breeding or other expansions. Existing crops, chickens, homepage, EN/ID, SEO and deployment config must survive.

Publication restriction: local coding/testing only. No push or deployment without new explicit authorization; M7 publication/live items remain unchecked until then.

Baseline: `1e140428eba6743817e808676c689ce4ff7fffcf`; isolated branch `goat-ranch-v1`. QA logs/screenshots stay outside Git at `task-2/qa/goat/`.

Progress: **5/60 (8.3%)**.

## Checklist

- [x] **M0-F01** — Audit latest local/remote/live repo, active Dot tasks, branches/commits and uncommitted code; do not overwrite ongoing Chicken work.
- [x] **M0-F02** — Run baseline lint/typecheck/unit/build/e2e/homepage and available compatibility/security tests; document existing failures separately.
- [x] **M0-F03** — Verify exact Chicken status (implemented, ongoing, absent) and define safe prerequisite/integration gate.
- [x] **M0-F04** — Map engine/tick/weather/Market/ledger/UI/save APIs and actual schema version; identify reuse points.
- [x] **M0-F05** — Create safe checkpoint/branch, sanitized old-save fixtures and rollback strategy without touching user save.
- [ ] **M0-F06** — Commit living PRD, technical acceptance contract and local test plan; no implementation before gate.
- [ ] **M1-F01** — Add `Goat Ranch` area switch to `/play/`, preserving Field/Chicken state and keyboard/touch behavior.
- [ ] **M1-F02** — Render enclosed yard/shelter/pasture with responsive geometry, no crop plot overlap or route split.
- [ ] **M1-F03** — Render 3 starter goats from stable state (one adult and two weaned), visually distinguishable.
- [ ] **M1-F04** — Add light state-driven idle/walk/browse/chew/climb animations and reduced-motion fallback.
- [ ] **M1-F05** — Render/select hay rack, shared water trough, cleanable shelter, paddock and safe climb platform.
- [ ] **M1-F06** — Add contextual actions Feed/Water/Clean/Inspect/Sell, with correct disabled state and human-readable reasons.
- [ ] **M1-F07** — Mobile 320–390 and desktop interactions, pan/zoom/reset (rotate if applicable), keyboard/focus, low graphics.
- [ ] **M1-F08** — EN/ID for every Goat view/control/status/error; seamless return to Crop/Chicken guide.
- [ ] **M2-F01** — Define Goat/Herd/Shelter/Paddock config with bounded values, stable IDs, age-stage semantics and validators.
- [ ] **M2-F02** — Wire goat commands into existing revision/idempotency/atomic engine transaction flow.
- [ ] **M2-F03** — Hay purchase/store/refill/consumption with feed conservation and accurate ledger.
- [ ] **M2-F04** — Water trough/refill/consumption from shared farm tank with volume conservation.
- [ ] **M2-F05** — Pasture biomass, browse consumption and deterministic regeneration based on shared weather.
- [ ] **M2-F06** — Shelter cleanliness/clean action and bounded maintenance cost/effect; prevent spam exploits.
- [ ] **M2-F07** — Causal nutrition/hydration/space/weather → comfort/condition with gradual recovery, no offline degradation.
- [ ] **M2-F08** — Growth stages `weaned→growing→market-ready` using game ticks and configurable compressed duration.
- [ ] **M2-F09** — Herd capacity and social minimum-two sale rule, with rejection messages and recovery suggestions.
- [ ] **M2-F10** — Unit/invariant tests seeded scenarios: no feed/water, good care, hot/rainy, overgrazing, pause, 24 ticks=Next Day.
- [ ] **M3-F01** — Grant one-time starter shelter + three goats + bounded supplies when first entering Goat Ranch.
- [ ] **M3-F02** — Implement `My First Goat Sale` chapter, FarmGirl guide, persisted progress and area-specific mission display.
- [ ] **M3-F03** — Bind Feed/Water/Clean/Inspect buttons to real commands and causally correct visual feedback.
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
