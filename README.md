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

Internal unified-world preview: `/play/?world=unified-preview`. One continuous terrain and camera now connects Crop, Chicken, Goat, Cow, Fish and the shared Market. Directional animated animal atlases, searchable HTML object alternatives, responsive original action/menu controls and camera-only shortcuts operate the existing engine. Entering an unstarted area requires an explicit Start action; simply looking never grants animals or supplies. The original save key/schema, fixed simulation clock and deterministic economics are retained.

The preview is hidden behind the query flag; default visits keep the original interface and do not fetch Three.js. A local pinned esbuild bundle splits the optional Three CPU/math and asynchronous WebGL driver, retains its complete MIT notice and uses no CDN. Canvas fallback uses the same scene/camera; complete graphics failure retains usable HTML actions. WebGL loss/retry and Low Graphics preserve state. The classic-map link remains the rollback reader until an explicitly authorized release is deployed and verified live.

Local parity, graphics, startup, save and QA evidence is tracked per micro-feature in `docs/PRD_MYFARMTWIN_UNIFIED_3D_WORLD_V1.md`. It distinguishes desktop headless testing and mobile emulation from physical-device tests. The authorized preview publication, exact production source/deployment and live results are recorded in `docs/UNIFIED_WORLD_DEPLOYMENT.md`; default visits remain classic. See also `docs/BUILD_SAFETY.md` and `docs/UNIFIED_WORLD_PERFORMANCE.md`. Build only owns `dist/play`; original editorial/media and rollback assets must remain.

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
