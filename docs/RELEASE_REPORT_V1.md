# MyFarmTwin V1 release report

Status: V1 complete, all 59 micro-features verified. Production https://myfarmtwin.com/play/ is live and the post-deploy release checks passed. The requested homepage cleanup is a separate subsequent local increment.

## Delivered

EN/ID isometric browser farm at /play/ alongside the retained editorial site. Three starting beds expand to eight; lettuce/tomato, fixed-hour water/crop/weather model, FarmGirl tutorial, harvest/inventory/Market ledger, manual irrigation and efficient motor, three neighbourhood orders and three follow-up missions. Local autosave, exact resume, backup/quarantine recovery, controlled migration, export/import, confirmed reset/restore. Optional Inspect explains current data, game estimates, 48-sample trends and model limitations.

## Local validation

- 45 unit/integration tests passed, including 2,500 mixed valid/invalid commands and a 90-day farm with daily save roundtrips and replay rejection.
- Desktop/touch-mobile complete first loop in 3 game days, then orders, expansion, all follow-up missions, reload/reopen and future-device-clock no-penalty checks.
- Corrupt/old/future save handling, exact exports, invalid/cancelled imports, confirmed replacements, no-funds recovery, double watering, actual interval pause, stale tabs and disabled storage passed.
- Chromium 153 and Firefox 155 passed the complete loop. Twelve size/language surfaces, keyboard/focus, reduced motion, target/contrast checks passed. Physical Android and human play timing were not measured.
- Performance: desktop ~60 FPS; CPU4/network mobile proxy 44.3 FPS full / 50.4 low; initial interaction 240/1668 ms. Game plus thumbnail 137,608 bytes raw; zero runtime dependencies. See PERFORMANCE.md for method/limits.
- CSP/security headers active in local tests, no external game requests/policy violations, malicious import rejected, zero dependency vulnerabilities. See SECURITY.md.
- Nine routes/canonical/OG/sitemap and all collected links passed; 15 editorial layouts passed. Category main content and original styles/robots/favicon/FarmGirl PNG remain baseline-identical; existing placeholder copy retained.

## Publication

Final production source: `c90072450cca37d7dbcff6bc53b0265da6e01236`. Cloudflare canonical production deployment: `d364b762-306e-4503-b73b-c733b333e550`, successful 2026-11-03 08:24:45 UTC (15:24:45 WIB). Live URL: https://myfarmtwin.com/play/; immutable deployment URL: https://d364b762.myfarmtwin-com.pages.dev/play/.

The initial source e621c5b38b7c17a9561fcebcbb9ba69544869860 deployed as a0893aa5-370d-4982-8e7e-fc3998200346. The live core loop passed, but edge-injected analytics caused a CSP violation. A documented game-only no-transform cache header fixed it without relaxing CSP or changing analytics/account settings elsewhere. Two code deployments were needed; final report/checklist-only commits use Cloudflare's documented `[CF-Pages-Skip]` prefix. No production assets change in those commits.

Public hosting: Cloudflare Pages myfarmtwin-com, GitHub main, dist, empty build command. No GitHub Actions, nameserver or audience change. Existing private Sites registration was audited but is not the live serving origin and was not published.

Post-fix public checks: 33 resource bodies exactly match Git source; nine routes, canonical/OG/sitemap/internal links and 15 editorial layout/menu surfaces pass. Desktop/touch-mobile game entry, both languages, full tutorial loop, order, expansion, all three follow-up missions, exact resume, corrupt/old/future saves, imports/exports/reset and black-box safety paths pass. First automated sale plus upgrade: 2.645 seconds desktop / 2.502 seconds mobile, three game days. These are automation timings, not human completion claims. Firefox 155 production full slice also passes (4.622 seconds to automated sale/upgrade). Actual game headers, no-transform, zero external requests, zero CSP/page errors, malicious import rejection and exact existing-save preservation pass on desktop/mobile.

Rollback: previous production deployment 6475a81e-aedb-4ccb-8b05-0a48c8287514 / source 31bbcedcc4a314c0562b2df0e08b0b58d4a53f13, or revert the release source and deploy dist again. Browser saves are separate local data and must be retained.

## Evidence / known limits

Evidence outside Git: task-2/qa local reports and task-2/qa/live/latest.json, vertical-slice.json, security.json, seo-regression.json, live-integrity.json, firefox/result.json and desktop/mobile/Firefox screenshots. Screenshots were visually reviewed. No QA screenshots/cache/node_modules are committed.

Physical Android performance, physical touch hardware and human enjoyment/completion timing remain unmeasured; automated Chromium touch emulation is the documented fallback. Model is educational, weather/prices are fictional, no offline simulation/PWA/backend/login. Editorial category copy remains an existing placeholder backlog. No known blocking issue in tested scenarios.

Checklist: 59/59 (100%). Each micro-feature has a local commit and evidence in PROGRESS.md. Owned failed-transfer helper/cache and empty scratch directory were removed; original PRD source, QA evidence and user files were retained. Main is synchronized to origin after report-only completion; production remains the verified c900724 source. Follow-on homepage work, if prepared, is isolated locally and is not included in this release or publication authorization.

## Subsequent approved homepage rollout

After V1 closure, the user refined and explicitly approved a separate homepage containing only one live-game card, with no FarmGirl imagery on that page. Source `def03f2846301d184691caefd73906e3ae90749a` deployed successfully as `fb9344f5-49a4-4284-ba96-42260809534d` at 2026-11-03 09:05:50 UTC. The original V1 release evidence above remains its historical snapshot. The current live homepage, both languages, desktop/mobile navigation, exact planted-save preservation, game regressions, 37-resource integrity, SEO/routes and unchanged security policy were verified after that approved rollout. See HOMEPAGE_INCREMENT.md for current production evidence and rollback.
