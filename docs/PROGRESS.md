# Verified micro-feature log

All times UTC. Only PASS entries complete checklist items. Screenshots stay outside Git.

## M0-F01 | PASS | 1/59 (1.7%)

2026-11-03T05:44:55+00:00 — Repository/remote/readme/deployment audit recorded in M0_AUDIT.md; no UI changes, browser N/A.

## M0-F02 | PASS | 2/59 (3.4%)

2026-11-03T05:46:06+00:00 — Production Chromium desktop/touch-mobile baseline: 10 routes HTTP 200, menu opens, zero page errors/overflow; canonical anomaly recorded.

## M0-F03 | PASS | 3/59 (5.1%)

2026-11-03T05:46:52+00:00 — Isolated builder integration test passed twice; homepage/styles/category/retained asset bytes unchanged; BUILD_SAFETY.md records rollback.

## M0-F04 | PASS | 4/59 (6.8%)

2026-11-03T05:47:36+00:00 — ADR_001 records zero-runtime-dependency SVG isometric architecture, typed headless engine, budgets/fallback/browser targets; documentation review passed.

## M0-F05 | PASS | 5/59 (8.5%)

2026-11-03T05:49:19+00:00 — Local syntax/typecheck/unit/smoke scripts passed: 1 build-safety test, desktop 1440/mobile 390 editorial regression, zero errors; dev audit 0 vulnerabilities.

## M0-F06 | PASS | 6/59 (10.2%)

2026-11-03T05:49:58+00:00 — Safety checkpoint: original editorial/media preserved, local rollback documented, cache/QA/build garbage ignored, clean checkpoint created.

## M1-F01 | PASS | 7/59 (11.9%)

2026-11-03T05:52:05+00:00 — Direct /play/ and refresh pass desktop/touch mobile; EN/ID preference resumes, home backlink/editorial routes intact; isolated build/typecheck/unit pass.

## M1-F02 | PASS | 8/59 (13.6%)

2026-11-03T05:53:00+00:00 — Homepage Play Farm CTA and all editorial nav links open /play/ on desktop/mobile; original brand/content/metadata preserved; full local checks pass.

## M1-F03 | PASS | 9/59 (15.3%)

2026-11-03T05:54:16+00:00 — 64-tile low-poly isometric scene renders 3 beds, well, Market and expansion space; desktop/touch-mobile scene/locale/regression checks pass with no page errors.

## M1-F04 | PASS | 10/59 (16.9%)

2026-11-03T05:55:28+00:00 — Pointer/keyboard plot selection fires once, zoom/reset transform verified desktop/touch-mobile, bounded pan and 44px alternate plot controls; full checks pass.

## M1-F05 | PASS | 11/59 (18.6%)

2026-11-03T05:56:57+00:00 — Plot selection/empty status, close/Escape and keyboard reopen verified desktop/mobile; invalid plot 999 ignored; full regression/typecheck/build pass.

## M1-F06 | PASS | 12/59 (20.3%)

2026-11-03T05:58:09+00:00 — Bilingual Day/Coins/Water/Mission/Inventory HUD and time controls visible; starter inventory opens/closes desktop/mobile without overflow; all checks pass.

## M1-F07 | PASS | 13/59 (22.0%)

2026-11-03T05:59:11+00:00 — Approved FarmGirl portrait loads, concise guide can hide/reopen without blocking plot input; EN/ID and desktop/mobile regression/typecheck/build pass.

## M1-F08 | PASS | 14/59 (23.7%)

2026-11-03T06:00:03+00:00 — Low mode toggles/persists and keeps plot actions usable; Chromium launched with WebGL disabled still renders/selects farm on desktop/mobile; all checks pass.

## M2-F01 | PASS | 15/59 (25.4%)

2026-11-03T06:03:07+00:00 — Headless seeded 480-hour replay identical, immutable input/stale command/pause tests pass; desktop/mobile Next Day updates HUD and clock/speed controls; full checks pass.

## M2-F02 | PASS | 16/59 (27.1%)

2026-11-03T06:04:06+00:00 — Data-driven lettuce/tomato duration/water/seed/yield/price/stages validated; crop selector and ID/EN descriptions verified desktop/mobile; full checks pass.

## M2-F03 | PASS | 17/59 (28.8%)

2026-11-03T06:05:21+00:00 — Plant consumes one seed and renders sprout; invalid bed/crop/no-seed/occupied cases rejected headless; browser no-seed message and successful plant verified desktop/mobile.

## M2-F04 | PASS | 18/59 (30.5%)

2026-11-03T06:06:28+00:00 — Fixed ticks progress seedling/growing/mature stages with bounded progress; crop geometry/stage labels update from state on desktop/mobile; all tests/typecheck/build pass.

## M2-F05 | PASS | 19/59 (32.2%)

2026-11-03T06:09:05+00:00 — Millimetre water balance dry/wet/overflow/invalid-unit bounds and dry-vs-watered growth tests pass; moisture/state-driven stages visible desktop/mobile; full checks pass.

## M2-F06 | PASS | 20/59 (33.9%)

2026-11-03T06:10:36+00:00 — Water applies 25mm/25L, debits 2 Coins once and darkens actual soil; duplicate-hour/no-water/no-Coins/wet/invalid-bed tests pass; desktop/mobile feedback and full checks pass.

## M2-F07 | PASS | 21/59 (35.6%)

2026-11-03T06:12:02+00:00 — Seeded forecast matches next day without mutation; 4 weather types replay, rain/hot change actual mm/growth rationally; desktop/mobile forecast and full checks pass.

## M2-F08 | PASS | 22/59 (37.3%)

2026-11-03T06:13:27+00:00 — Harvest creates quality/quantity lot once and frees bed; premature/full-inventory/invalid/double harvest rejected without loss; desktop/mobile inventory feedback and all checks pass.

## M2-F09 | PASS | 23/59 (39.0%)

2026-11-03T06:14:54+00:00 — Dry/waterlogged quality degrades gradually and recovers, never kills crop; 100-day bounds test passes; actual quality shown visually/textually; full desktop/mobile checks pass.

## M3-F01 | PASS | 24/59 (40.7%)

2026-11-03T06:17:00+00:00 — Guided objectives/highlights advance select-plant-water-grow-harvest to Sell; unrelated actions do not skip steps; headless and desktop/mobile paths pass (full sell gate M3-F08 pending). 

## M3-F02 | PASS | 25/59 (42.4%)

2026-11-03T06:18:14+00:00 — Mission rewards ledgered once with unique transaction IDs; replay/JSON-roundtrip/rapid repeat selection cannot duplicate Coins; browser/regression/headless checks pass.

## M3-F03 | PASS | 26/59 (44.1%)

2026-11-03T06:20:11+00:00 — Market sale removes one lot and adds quality-weighted ledger revenue exactly once; invalid/repeated sale rejected; desktop/mobile harvest-to-sale dialog/HUD/mission checks pass.

## M3-F04 | PASS | 27/59 (45.8%)

2026-11-03T06:22:21+00:00 — All costs/revenue/rewards reconcile to Coins via unique ledger IDs; seed/refill bounds/no-funds/drift tests pass; shop and visible balance verified desktop/mobile; all checks pass.

## M3-F05 | PASS | 28/59 (47.5%)

2026-11-03T06:24:59+00:00 — First sale unlocks 60-Coin pump; builds once, visible range and ON/OFF affect covered soil/tank/energy ledger; desktop/mobile end-to-end upgrade and all tests pass.

## M3-F06 | PASS | 29/59 (49.2%)

2026-11-03T06:27:12+00:00 — Zero-resource aid restores seed/water/one care voucher without cash or immediate repeat; one wasted purchase still reaches pump; objective catch-up and browser aid restrictions pass.

## M3-F07 | PASS | 30/59 (50.8%)

2026-11-03T06:28:39+00:00 — Chapter completion celebrates without modal/login, shows reward and actionable tomato objective; dismiss continues play without extra reward; desktop/mobile/full checks pass.

## M3-F08 | PASS | 31/59 (52.5%)

2026-11-03T06:32:56+00:00 — VERTICAL SLICE PASS: desktop 1.297s/mobile 1.280s automated sale+upgrade, 3 game days, sale48/final140, ledger matches, pump2 beds, 0 errors; 24 tests and screenshots reviewed.

## M4-F01 | PASS | 32/59 (54.2%)

2026-11-03T06:34:32+00:00 — Actual-moisture care badges and Why explanations cover dry/thirsty/good/wet bounds; desktop/mobile optional panel and full vertical-slice regression pass.

## M4-F02 | PASS | 33/59 (55.9%)

2026-11-03T06:35:56+00:00 — Farm-level manual pump ON/OFF/status and exact covered-bed count verified desktop/mobile; existing range/resource/energy tests and full vertical-slice regression pass.

## M4-F03 | PASS | 34/59 (57.6%)

2026-11-03T06:36:55+00:00 — Missing-pump/empty/partial-water/no-energy interlocks stop safely without negative resources or extra costs; desktop/mobile depletion shows exact reason and rejects restart; full checks pass.

## M4-F04 | PASS | 35/59 (59.3%)

2026-11-03T06:40:47+00:00 — Four 60-day strategies show tomato profit/water/capital trade-off and lettuce winning limited water; no negative/softlock/extreme returns; base-care labels and full browser regression pass.

## M4-F05 | PASS | 36/59 (61.0%)

2026-11-03T06:43:27+00:00 — Three persistent feasible orders consume exact portions and pay market+bonus once; locked/missing/repeated/invalid paths tested; browser second crop delivers salad order on desktop/mobile.

## M4-F06 | PASS | 37/59 (62.7%)

2026-11-03T06:45:22+00:00 — Optional current-weather advice explains actual rain/hot effects and selects a relevant bed; hot-care counts only real watering; desktop/mobile and full slice/order regression pass.

## M4-F07 | PASS | 38/59 (64.4%)

2026-11-03T06:47:09+00:00 — Expansion charges bounded scaling costs, unique grid cells and max8; roundtrip retains farm; desktop/mobile build fourth bed and plant it; full slice/order regression pass (browser save in M5).

## M5-F01 | PASS | 39/59 (66.1%)

2026-11-03T06:50:15+00:00 — Complete versioned state JSON roundtrips identically after 30 days; strict untrusted schema/size/prototype/bounds/ledger/grid validation rejects corrupt inputs; existing UI/slice/order/expansion pass.

## M5-F02 | PASS | 40/59 (67.8%)

2026-11-03T06:53:08+00:00 — Autosave/rolling backup roundtrip and stale-tab/quota/corrupt-preservation tests pass; desktop/mobile reload+reopen retain complete expanded farm/ledger/mission/weather/produce identically without duplicate rewards.

## M5-F03 | PASS | 41/59 (69.5%)

2026-11-03T06:56:38+00:00 — Corrupt-primary backup recovery preserves exact original; missing backup/future saves remain untouched; known v0 migrates once with backup; 8 desktop/mobile recovery cases and full regression pass.

## M5-F04 | PASS | 42/59 (71.2%)

2026-11-03T07:00:13+00:00 — Returning players see saved farm totals and next objective, dismiss without reward/state changes; reload/reopen with future device clock retains identical state/no offline costs on desktop/mobile.

## M5-F05 | PASS | 43/59 (72.9%)

2026-11-03T07:03:43+00:00 — Three post-tutorial missions deliver order/care in heat/upgrade motor once; motor halves energy with same water; desktop/mobile complete all three and reload exact flags/rewards; full checks pass.

## M5-F06 | PASS | 44/59 (74.6%)

2026-11-03T07:07:40+00:00 — Exact export, invalid/cancelled import preservation, confirmed import/reset and backup restore verified desktop/mobile; replacements preserve valid/corrupt originals and refuse stale writes; full tests pass.
