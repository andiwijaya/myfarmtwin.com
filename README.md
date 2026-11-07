# MyFarmTwin.com

Practical growing, farm projects, useful gear, and food grown with intention. The editorial website stays static; **Play Farm** at `/play/` adds a bilingual EN/ID farm life game.

Plant lettuce and tomatoes, manage soil water and seeded weather, harvest/sell, fulfil neighbourhood orders, build irrigation, upgrade efficiency and expand to eight beds. FarmGirl guides the first loop. Browser-local save/resume, export/import, backup recovery and confirmed reset keep progress portable. The optional Engineering Lab explains the educational model; it is not an agronomy prediction.

## Local development

Node 22+; dependencies are locked. The default game loads no runtime packages. An internal opt-in world experiment uses locally bundled, pinned Three.js.

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

Preview: `http://127.0.0.1:4177/play/`. The build writes `game/client` plus the optional renderer's bounded vendor allowlist only under `dist/play`; it never empties `dist` or replaces editorial content. Keep the built game output committed because the audited Cloudflare Pages project publishes `dist` with no remote build command.

Internal world experiment: `/play/?world=unified-preview`. It is a Crop + Chicken prototype with one 3D terrain/camera; object picking and keyboard alternatives route to the existing action panels below. Chicken entry requires an explicit Start action. It is not the completed unified experience. Default visits do not fetch its modules or Three.js. The builder copies only its pinned local vendor modules and full MIT notice under `dist/play/vendor/three`; no CDN or source maps. See `docs/UNIFIED_WORLD_AUDIT.md` and the new living PRD. Do not enable a production default until the two-zone, all-five parity, fallback and release gates pass.

## Verification

`npm run e2e` covers desktop/touch-mobile game, editorial, persistence, corrupted saves, data tools, no-funds recovery, pause and concurrent tabs. Additional commands: `npm run compat`, `npm run performance`, `npm run seo`, `npm run audit:client`, `npm run balance`, `npm run endurance`. Browser runners accept `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, `PLAYWRIGHT_SECONDARY_MODULE`, `PLAYWRIGHT_FIREFOX_EXECUTABLE`, `QA_DIR` and (where supported) `BASE_URL` to reuse installed browsers and keep artifacts outside Git.

## Structure

- `dist/`: existing editorial pages/media and deploy-ready `/play/`.
- `game/client/`: headless deterministic engine, config, validated saves and DOM/SVG UI.
- `game/tests/`: local unit/integration/invariant/scenario tests.
- `tools/`: isolated builder, policy-aware preview and automated QA.
- `docs/PRD_MYFARMTWIN_MASTER_V1.md`: living acceptance checklist.
- `docs/M0_AUDIT.md`, `QA_MATRIX.md`, `SAVE_FORMAT.md`, `SIMULATION.md`, `BALANCE.md`, `PERFORMANCE.md`, `SECURITY.md`: decisions and evidence.

Public hosting is the audited Cloudflare Pages `myfarmtwin-com` project, GitHub `andiwijaya/myfarmtwin.com` branch `main`, output `dist`. See M0 audit and release report for the exact published commit and rollback. No GitHub Actions workflow is required. Retain the approved original FarmGirl PNG; the game uses its small WebP derivative.

The EN/ID homepage now contains one live-game card, without FarmGirl imagery, published as an approved follow-on after V1. `npm run homepage` verifies its layouts, language/keyboard behavior, save preservation, game entry and exact retained release assets. See `docs/HOMEPAGE_INCREMENT.md` for the exact production source/deployment, scope and live-test evidence.
