# MyFarmTwin Chicken Yard V1 release

Completed 2026-11-04T04:01:07+00:00. PRD v3 scope: 58/58 verified items after the report checkpoint is committed. Chicken Yard expands the existing /play/ farm and save; crops, shared resources/weather/clock, editorial routes and source media remain preserved.

## Publication

Production source: `7e5879fd471005628ace7dc0d20d5f4fb5782b75`. Cloudflare canonical production deployment: `e4e31644-1fca-4e50-add4-0bfea25255c9`, successful 2026-11-04 03:50:13 UTC (10:50:13 WIB). Public URLs: https://myfarmtwin.com/ and https://myfarmtwin.com/play/. Immutable deployment: https://e4e31644.myfarmtwin-com.pages.dev/play/.

Verified pipeline: Cloudflare Pages myfarmtwin-com, GitHub andiwijaya/myfarmtwin.com, production main, dist output, empty build command/root. Fast-forward integration and ordinary non-force push triggered the existing pipeline. No GitHub Actions, nameserver, hosting/access/security setting changes. The earlier 403/approval-review blocker was resolved by the user's explicit authorization for one read-only retry, which succeeded; no bypass occurred.

The release candidate's served files are byte-identical to `03d99c83c6610a8cdbf4d1c841a1d473d0c3fc78`; game files are unchanged from the measured c71bac8 performance checkpoint. All 55 public resource bodies match release Git bytes. Final evidence/checklist/QA-tool commits use the existing documented [CF-Pages-Skip] mechanism and change no dist assets. Their final remote/canonical verification is recorded in the final handoff and QA JSON.

## Behavior delivered

One world and one save now support the vegetable field and adult laying hens: feed, shared-tank drinking water, cleaning, welfare, seeded causal graded eggs, collection, sales, one-time missions/order, paid coop tiers/additional hens, optional paid automation/shade, and an optional read-only Engineering Lab. No breeding, death, offline depletion, goat/cow/fish mechanics or new backend/runtime dependencies.

Both areas have quarter-turn rotation, zoom, pan/reset, desktop keyboard and touch controls; camera changes do not advance the model or alter saves. The homepage remains one live-game card with original cartoon vegetables, chickens, goat, cow and fishpond. EN/ID descriptions state crops/chickens are playable and explicitly label goats, cows/fishpond as future vision.

## Verification

|Gate|Verified result|
|---|---|
|Local release commands|lint, typecheck, 96/96 unit tests, build, audit:client, e2e, Chicken, compatibility, security, balance, endurance, SEO, homepage all pass|
|Gameplay live|EN/ID desktop and actual Chromium touch emulation: starter care/egg/collection/sale/upgrade, cross-area crop harvest/sale, paid progression/order/Lab and stockout aid pass|
|Camera live|Six-hen large coop and expanded field: four orientations, picking, zoom/pan/reset;desktop and touch pass with no camera model/save mutation|
|Persistence live|Pending/collected/sold/upgraded exact reload, new browser context, future clock;V1 migration preserves the entire crop projection and original bytes|
|Data live|Exact export/import, cancel, invalid/future rejection, reset, backup restore, corrupt quarantine and archive-collision exports pass|
|Concurrent writes live|Eight tab pairs: kit/purchase once, stale tab cannot overwrite, winner continues;four storage/lock failure scenarios preserve bytes;24 ticks equal Next Day and hidden/system-clock scenarios cause no loss|
|Rapid actions/navigation|Four EN/ID desktop/touch surfaces locally and live: collection/sale/reward once, upgrade funds safe, two feed purchases charged twice, back/forward preserves exact save and kit once|
|Cross-browser|Chromium 153 / Firefox 155 local keyboard/ARIA/reduced-motion/low-graphics checks;full Firefox chicken/crop flow EN/ID desktop/touch viewports also passes live|
|Homepage live|16 width/language combinations, one card, no FarmGirl, CTA above fold, keyboard entry, locale/save preservation, no-JS/blocked-storage fallback pass|
|SEO/security live|Nine routes, 15 editorial layouts, canonicals/OG/sitemap/internal links/GA4 pass;zero game external requests, CSP violations or page errors;malicious imports preserve data|
|Source integrity|55production resources exactly match the release source;original editorial content/shared styles/robots/favicon/FarmGirl media remain protected|
|Performance local|8/8 profiles;desktop 60 FPS, mobile 49.6–60 FPS at 4x CPU / 150ms / 1.6Mbps, stable DOM and<0.4MB heap growth;226780 raw / 87291 per-file gzip bytes|
|Balance/endurance|24 cases at 7/30/60/90 days;shared90-day farm: 1415 commands, 283 replay rejections, minimum 53 Coins, 142 eggs, peak save104767 bytes;full deterministic replay exact|

Additional live rapid-action/back-forward and production-origin concurrency checks are retained in the release QA tools. The rapid-navigation test harness initially waited for a save lock through a page navigation;using the native navigation locator corrected that test-context issue, then all local/live cases passed. No product change or second code deployment was needed.

## Save preservation and rollback

V2 retains the existing primary key. Before additive V1/V0 migration writes, the exact original bytes must be archived at myfarmtwin.save.before-chicken.v1;normal rolling backup and corrupt quarantine remain separate. Collision/quota/blocked/rejected-lock cases preserve originals and permit read-only preview/export. First-yard entry grants the kit exactly once. Old deployed V1 readers detect V2 as future data and never downgrade/reset it.

Previous production: source def03f2846301d184691caefd73906e3ae90749a, deployment fb9344f5-49a4-4284-ba96-42260809534d. No rollback was needed. If a true regression emerges, preserve browser saves and prefer forward-compatible V2-reader code with Chicken disabled through its tested build flag;never automatically downgrade a V2 farm to run old code. See CHICKEN_SAVE_POLICY.md.

## Evidence and limits

Evidence stays outside Git under task-2/qa/chicken: release-local, release-extra, m6, m6-home, release-external-local, release-live, release-live-firefox, navigation-local, navigation-live and skiplink-live. deployment.json records exact source/canonical ID;live-integrity.json records all 55resource hashes. Screenshots include EN/ID desktop/mobile homepage, game, Labs and rotated camera views and were reviewed.

Full-page Chromium snapshots can place a fixed offscreen skip link at the previous scroll offset. A real live viewport probe confirms it remains above the viewport (top −100, bottom −51, not focus-visible) during touch Lab use;the normal viewport screenshot has no overlay. Keyboard skip-link visibility/activation remains tested. This is a screenshot artifact, not an observed player-facing obstruction.

No physical Android FPS/touch hardware or human enjoyment/completion timing is claimed. Automated Chromium touch emulation and Firefox touch viewports are the documented coverage. No known blocking issue in the tested scenarios. User saves, original assets and QA evidence were preserved;owned disposable benchmark copies were cleaned after path checks. Runtime processes/previews close after testing.
