# Cow Farm V1.1 baseline audit

## M0-F01 — source, production and isolation

Read-only audit 4 November 2026: repository `C:\MyFarmTwin`, origin `https://github.com/andiwijaya/myfarmtwin.com.git`. Initial branch `goat-ranch-v1`, clean at `c77f78adc7e5c847b99912023cd467e0cbef5abe`. Local and remote main `dd8184e1beb95685ded536dcef022eb4e7306f6f`; direct `git ls-remote` verified the remote. The local branch differs from main only in five Goat evidence/checklist documents. No other active checkout or uncommitted application work was found. A dedicated `cow-farm-v1` branch preserves those documents and the full released application.

Production baseline: Cloudflare Pages project `myfarmtwin-com`, deployment `1b28946e-6835-457e-a104-db217d9218d9`, previously directly verified terminal success. Fresh public HTTP audit compares every deployed file to Git main: **80 resources, zero mismatches** (`qa/cow/M0-F01/live-integrity.json`, outside Git). This verifies actual runtime asset identity without opening the owner's saved game. Existing project configuration publishes committed `dist`, blank cloud build command; local build copies client files into `dist/play` without deleting editorial files. No configuration, credentials or permissions were changed or queried anew. Prior API 403 is documented in Goat release report and is not retried.

Rollback baseline is immutable source dd8184e / deployment 1b28946e. Cow release remains local: no push/deployment authorized. Keep prior read-only schema readers, the exact old save and all earlier migration archives. A code rollback must block newer saves instead of downgrading them. Prefer a forward reader repair when necessary.

## M0-F02 — completed prior areas

Chicken checklist is present in source and production includes its full client. Goat checklist/report records 60/60, production dd8184e, 169 unit tests and 56 live scenarios, followed by exact final asset verification. New baseline tests will revalidate all areas; prior release claims are not substitutes for Cow integration regression. Safe integration starts after completed Goat, preserves its docs and its V3 schema, and adds one module to the same app. No user profile is used for tests.

## M0-F03 — shared contracts

`engine.js` is the only reducer/clock. Integer command revision increases only on accepted actions; invalid actions return original state. Next Day executes 24 ordinary hours. A seeded RNG drives shared weather; animation, locale and camera do not mutate the simulation. Pause/hidden tab stop ticks, with no offline catch-up. `transact` updates one wallet and ledger; costs/income must reconcile from starter 120 Coins. Tank capacity 240 L, refill 100 L/6 Coins, shared between crops/hens/goats. Cow water uses integer mL at this boundary, never a second wallet/tank.

Current actual schema is **V3**, not the PRD's earlier V2 audit. `save-schema.js` strictly validates exact root keys and subsystem structures; `invariants.js` checks resources and ledger. V0/V1/V2 migrate additively to V3 without Goat grants. Cow schema will be V4 after capturing V3 fixtures. Module is empty after migration; first explicit entry alone grants the kit. `SaveSession` archives original bytes, compare-and-swaps primary, retains backup/quarantine, rejects newer version before backup fallback. Origin `navigator.locks` serializes commands across tabs. Cow needs a separate pre-Cow V3 archive, never overwrite pre-Chicken or pre-Goat.

DOM/SVG renderer is isometric, not WebGL/true 3D. World/camera keep separate per-area views; all production/economy stays headless. Main owns area selection and calls renderer snapshots. Market and inventory reuse the existing dialog; new milk lots must remain separate from crop/egg lots. FarmGirl guides only in-game. English/Indonesian locale is persisted separately from game state. Low graphics/reduced motion are cosmetic only.

## Balance assumptions to test

Cow baseline yield 6000 mL/day, normal/hot demand 30/45 L and 8000 g feed per cow/day. Shared water at 6 Coins/100 L means two cows cost 3.6–5.4 Coins/day for ordinary water, with 12 L ideal milk/day worth up to 72 Coins before feed/energy/grade. Fix one feed-price config and test paid progression against existing crops, eggs and growing goats; do not assume first 16-Coin opening sale buys a 90-Coin trough. Starter water is a separately accounted Cow-only entitlement and must not refill the shared tank. Preserve all V1.1 limits, exact arithmetic, recovery gates and no-offline-punishment rules.

## M0-F04 — clean baseline gates

All 15 npm tasks passed: lint, typecheck, test (169/169), build, e2e (full original crop/data/recovery flows), chicken (complete release runner), balance, endurance, audit:client, homepage, homepage:cache, seo, security, compat and performance. An additional Goat full browser suite passed eight new/existing desktop/touch EN/ID mixed three-area journeys. Evidence is outside Git at qa/cow/M0-F04/results.json and per-task logs/reports.

Homepage passed 24 widths/languages plus no-JS/blocked-storage/reduced-motion checks; nine SEO routes and fifteen layouts passed. Existing locale audit and dependency/security guards passed. Twelve performance profiles passed: desktop 60 FPS, 4x-CPU/150ms/1.6Mbps mobile emulation 56.7–60 FPS. This is measured local/headless evidence, not physical mobile/Safari coverage. Client is 58 assets, 322987 local checkout bytes / 122187 summed per-file gzip; exact production comparison uses Git bytes to avoid Windows CRLF differences. No pre-existing application failure found. A local read-only reporting one-liner had a syntax typo and was corrected; it never changed repository data.
