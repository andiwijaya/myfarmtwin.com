# MyFarmTwin.com

Practical growing, farm projects, useful gear, and food grown with intention. The editorial website stays static; **Play Farm** at `/play/` adds a bilingual EN/ID farm life game.

Plant lettuce, tomatoes and corn across 24 immediately active beds, manage soil water and seeded weather, harvest/sell, fulfil neighbourhood orders, build irrigation and upgrade efficiency. FarmGirl guides the first loop. Browser-local save/resume, export/import, backup recovery and confirmed reset keep progress portable. The optional Engineering Lab explains the educational model; it is not an agronomy prediction.

## Local development

Node 22+; dependencies are locked. The normal game uses locally bundled, pinned Three.js for one continuous 3D farm. WebGL 2 is required for the map.

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

Local preview: `http://127.0.0.1:4177/play/`. The build writes `game/client` and bounded generated vendor output only under `dist/play`; it never empties `dist` or replaces editorial content. Keep the built game output committed because the audited Cloudflare Pages project publishes `dist` with no remote build command.

Normal game: `/play/`, directly from the updated homepage. One continuous terrain and camera connects Crop, Chicken, Goat, Cow, Fish and the shared Market. Directional animated animal atlases, searchable HTML object alternatives, responsive original action/menu controls and camera-only shortcuts operate the existing engine. Entering an unstarted area requires an explicit Start action; simply looking never grants animals or supplies. The original save key/schema, fixed simulation clock and deterministic economics are retained.

The owner authorized 3D as the sole experience and removal of Classic/Canvas world rendering. No query flag is needed; old query bookmarks open the same 3D game. A pinned esbuild bundle content-addresses entry modules, preloads critical graphics and retains the full Three MIT notice without a CDN. Low Graphics remains WebGL. Missing WebGL or context loss shows a bilingual error and visible retry without opening a 2D map or resetting progress. Shared HTML care, data tools, charts and texture-alpha processing remain. Rollback uses a prior Git/Pages deployment.

The original 82-feature checkpoint is in `docs/PRD_MYFARMTWIN_UNIFIED_3D_WORLD_V1.md`; its later owner-directed 3D-only release is tracked in `docs/UNIFIED_WORLD_3D_ONLY_RELEASE.md`. Both distinguish headless/mobile emulation from physical-device testing. Production history is in `docs/UNIFIED_WORLD_DEPLOYMENT.md`. Existing editorial pages and shared media are preserved; homepage updates are explicitly audited separately.

Cozy visual-refresh acceptance and release readiness are tracked in [the living visual checklist](docs/PRD_MYFARMTWIN_COZY_VISUAL_V1.md). Actual homepage capture provenance is in [COZY_HOMEPAGE_CAPTURE.json](docs/COZY_HOMEPAGE_CAPTURE.json); the older deployment documents describe historical releases. Local source-pattern checks can run without a browser with `node tools/security-source-audit.mjs`. They do not replace browser CSP, dependency-advisory or release checks.

The cozy upgrade is published and verified at **30/30**, production source `f2836be`, Cloudflare deployment `85946a2a`. [The production report](docs/COZY_WORLD_PRODUCTION_RELEASE.md) records canonical integrity,100 live cases, actual desktop/phone-emulated loading, retained failed attempts and the V5-capable3D-only rollback. Physical Android/display FPS/VRAM are not claimed. Live cozy QA uses explicit `COZY_LIVE_RELEASE=parent-authorized`, a fresh coordinated slot and a matching public receipt; ordinary local acceptance remains isolated.

## Verification

The desktop camera rail exposes zoom, four angles, pan, Fit and Reset directly. Mouse wheel over the farm zooms; drag pans. Touch uses drag/pinch and six direct thumb buttons. Help retains keyboard and HTML camera alternatives. Fit shows all terrain; Reset/Home restores the closer 135% starting view. See [camera workspace acceptance](docs/UNIFIED_WORLD_CAMERA_WORKSPACE.md) for the camera follow-up and evidence.

`npm run e2e` runs 3D entry/error/retry, all-five gameplay, menus, missions and save-protection suites through visible UI. `npm run compat` checks eight portrait/landscape sizes in both languages with safe-inset emulation and fully reachable native care buttons; `node tools/unified-camera-workspace-e2e.mjs` checks direct camera controls and resize without remounting. `npm run chicken` covers paid chicken upgrades, care, feeder service, orders and sales. `npm run performance` measures actual WebGL readiness and submissions, with explicit mobile CPU/network emulation. Separate commands include `npm run homepage`, `npm run homepage:cache`, `npm run seo`, `npm run security`, `npm run audit:client`, `npm run balance`, and `npm run endurance`. Earlier Classic/Canvas diagnostic scripts are historical and are not release gates for the removed renderer. Browser runners accept `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, `QA_DIR` and (where supported) `BASE_URL`; secondary-browser homepage checks also accept `QA_BROWSER`, `PLAYWRIGHT_SECONDARY_MODULE` and `PLAYWRIGHT_FIREFOX_EXECUTABLE`.

The current cozy release matrix and artifact-rebuild requirements are declared in [COZY_RELEASE_E01_PLAN.json](docs/COZY_RELEASE_E01_PLAN.json). Its phases require coordinated exclusive slots while the shared laptop is testing another project; a prepared plan or byte-equality rehearsal does not count as completed release tests.

## Structure

- `dist/`: existing editorial pages/media and deploy-ready `/play/`.
- `game/client/`: deterministic engine, validated saves, WebGL world, native HTML care and Lab charts.
- `game/tests/`: local unit/integration/invariant/scenario tests.
- `tools/`: isolated builder, policy-aware preview and automated QA.
- `docs/PRD_MYFARMTWIN_MASTER_V1.md`: living acceptance checklist.
- `docs/M0_AUDIT.md`, `QA_MATRIX.md`, `SAVE_FORMAT.md`, `SIMULATION.md`, `BALANCE.md`, `PERFORMANCE.md`, `SECURITY.md`: decisions and evidence.

Public hosting is the audited Cloudflare Pages `myfarmtwin-com` project, GitHub `andiwijaya/myfarmtwin.com` branch `main`, output `dist`. See M0 audit and release report for the exact published commit and rollback. No GitHub Actions workflow is required. Retain the approved original FarmGirl PNG; the game uses its small WebP derivative.

The EN/ID homepage now contains one live-game card, without FarmGirl imagery, published as an approved follow-on after V1. `npm run homepage` verifies its layouts, language/keyboard behavior, save preservation, game entry and exact retained release assets. See `docs/HOMEPAGE_INCREMENT.md` for the exact production source/deployment, scope and live-test evidence.

## Garden expansion release

Garden acceptance is **22/22 (100%)**. Production source is d4025da, deployed
11 November 2026 at 21:22 WIB. New and existing players receive 24 active beds
immediately, with exact original-save retention and preserved native progress.
Corn has five stages; real 3D crops share geometry and support growth/wind and
harvest feedback. The streamed-HTML startup race and old three-bed guide text
are fixed.

555/555 native tests pass. Final entry, 16 responsive profiles, security,
homepage/SEO, controlled performance and bilingual guidance pass live; retained
native gameplay/data/render suites apply through verified unchanged source. All
247 packaged files and 246 served resources per public/www/immutable origin match
the canonical artifact. Download tests stay skipped; mobile results are emulation.

See [the production report](docs/GARDEN_PRODUCTION_RELEASE.md),
[completed checklist](docs/GARDEN_EXPANSION_ACCEPTANCE.md),
[progress checkpoint](docs/GARDEN_UPGRADE_PROGRESS.md) and
[V6 rollback runbook](docs/GARDEN_V6_ROLLBACK.md). The matching fallback is
63fe192 on codex/garden-final-v6-rollback; earlier V5/three-bed targets are superseded.
