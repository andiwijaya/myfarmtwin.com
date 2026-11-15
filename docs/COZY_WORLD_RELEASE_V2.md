# MyFarmTwin Cozy V2 — full tropical GLB release

Date: 15 November 2026 (WIB). Status at this source checkpoint: final candidate prepared; production promotion and live verification pending. The original P0–P2 production is `0f9dcb65fe39a82b5c88f87f1faa34bf668b4287`. This report is completed only after the new deployment and public checks.

## Delivered scope

The primary `/play/` and former `/play/glb/` entry share the same complete game, economy and integrated placement save. All visible world geometry comes from the original GLB library: 24 initial beds, 13 crop stage templates, chicken coop/hen, raised goat shelter/adult/kid, dairy barn/cow, tilapia pond/water/aerator/fish, market/interior, 88×68 m terrain, tropical vegetation and modular props/paths/fences. The manifest references 17 logical groups plus five far LODs: 22 runtime GLBs totaling 14,401,284 bytes after the final slab correction. Historical unused files do not enter the active renderer graph.

The new game has 18/30/42-hour crops, readable feed/water/cleanliness, mild care consequences, finite stock and production, graded sales, orders, progression, upgrades and automatic care. Multiple paid facilities, extra beds, free stocked-building moves/rotation, access/collision checks and two land expansions work through atomic domain transactions. All 24 original beds remain usable without another purchase. Starting a livestock area explicitly grants its finite first kit once; looking never starts an area or grants stock.

One perspective scene supports smooth area approach, continuous orbit, zoom and pan, contextual object selection, building-aware interiors and roof cutaway. Animal clips include idle/walk/eat/drink/rest; fish swim. GLB near/far roots use independent animation binding caches, with explicit disposal on harvest/sale/model replacement. Environment and crop instancing retain original GLB geometry; crop instance picking returns the stable bed ID. Water, wind and lighting are presentation effects, while one clock owns production.

Local Cozy V2 storage integrates progress and placement in one validated record. Native V0–V6 and P2 imports preserve exact source bytes, coins, 24 beds/crops, live animals/cohorts, supplies, graded lot value, ownership/upgrades, active/completed orders and old paid benefits. Fractional milk/service values use exact credits; fish advances remain explicit debt, and goat pasture keeps owned regrowth. No login or offline punishment was introduced. See `COZY_WORLD_SAVE_CONTRACT_V2.md` for every mapping and boundary.

## Verification already observed

- 576 retained non-network regressions passed. The local HTTP cache suite was separated; its updated static security-policy case also passed. Its actual local-server gzip case was not used as browser acceptance.
- Final foundation group: 52/52 passed, comprising 45 new domain/storage checks, two delivery checks, one animation lifecycle regression, two P2-journal recovery checks and two header checks. The header cases overlap with the 576 group; totals are not added as unique tests.
- Strict `npm run typecheck`, source syntax checks and the production build passed.
- Official Khronos `gltf-validator 2.0.0-dev.3.10`: all 22 runtime files, zero errors/warnings/infos and no issue suppression. Independent resource/hash checks and a second deterministic build passed. There are 1,694 walk/rest floor-contact samples across seven near/far animal models. Textures and models are original authored resources, with no external model/texture downloads.
- Browser acceptance uses only the Codex internal browser. No desktop takeover, standalone Playwright/Chrome, personal profile fixture, clipboard, upload or download test was used in P3–P7.
- Candidate `c64ab60` at `https://b7449934.myfarmtwin-com.pages.dev/play/` passed the broad gameplay/data journey: all three crops, livestock care/production/turnover, three cross-area orders, stock/graded cash conservation, paid extra facility without another kit, extra bed/land, stocked-building move/rotate, invalid placement/cancel, exact reload/import/recovery, V0–V6/P2 mapping, stale-tab protection and the renderer-independent V2 reader.
- Actual measured viewports were 320×740, 390×844, 768×1024, 844×390 and 1440×900 without horizontal overflow. A 390×844 canvas selection changed no progress. An initial override applied to another selected internal tab; checks were repeated after measuring the intended document dimensions. No physical touch claim follows from these viewport checks.
- Candidate `a791398` at `https://1057dbb9.myfarmtwin-com.pages.dev/play/` verified the final crop batches through harvest, planting, growth, stocked-bed movement and snapshot restoration. The phone navigation/picking check was repeated at measured390×844. Pump purchase and shared-water irrigation, recovery reader, language/homepage entry and repeated interior visits also passed.
- The candidate's `/play/integrity/` fetched and hashed the actual public bytes inside the browser: all 30 checked resources matched, including both game HTML entries, stylesheet, manifest, bundle/chunks and all 22 GLBs. This check never accesses farm storage. Model URLs include manifest checksum versions to protect upgrades from stale P2 caches.
- At the same1280×720 High profile and dense24-bed fixture, instancing reduced observed draw calls from1,811 to1,155 while retaining963,000 rendered triangles. The fixture has128 crop models and17 animal models and is created through100 valid commands. Warm repeated interior visits plateaued at397 geometries and58 textures in that observed session. These are renderer/browser observations, not physical GPU/VRAM or device FPS guarantees.

Local receipts and actual captures are in `qa-artifacts/cozy-world/internal-browser/`; canonical synthetic fixture inputs are committed under `game/tests/fixtures/cozy-world/`. The dense QA recipe is `tools/cozy-world-showcase.mjs`. The homepage image is a capture of an explicitly developed synthetic farm, not an illustration or the default fresh farm.

## Fixed findings retained in the evidence

The first full-world preview exposed a Three `AnimationObjectGroup.uncacheRoot` failure after a valid conserved fish harvest. Per-root mixers fixed cleanup; lifecycle tests and repeated harvest/sale/import checks then passed. Stall anchors/dividers and trough orientation were corrected for six cows, eleven goats and twelve hens. Mobile automatic panel navigation now scrolls directly to avoid controls moving during a rapid follow-up click. Readable stock quality, overview framing and ready-harvest hints were corrected.

The final interior review found coplanar slab/terrain flicker. Only the barn, coop and market foundation surfaces were raised to0.006 m; bedding, drains and animal anchors stayed unchanged. The final candidate must recheck these three models and all public resource hashes before production promotion. No other model or gameplay change followed this correction.

## Compatible rollback and limitations

`node tools/prepare-cozy-rollback.mjs` creates a bounded QA release with the tested renderer-independent V2 reader as the default game entry. It retains all assets and storage keys, supports exact V2 and original-archive export, and offers explicit validated P2-journal completion when needed. The normal reader route is `/play/recovery/`. Reverting to V6 code alone would show the original migration-point farm and cannot interpret later V2 progress; no reverse simulation or silent merge is claimed.

Modern WebGL2 is required for the map; writable saves require the shared Web Lock. Graphics failures keep HTML data controls and the recovery reader available. Unsupported graphics do not reset progress. Missing storage/quota, corrupt/future data and conflicting writers are protected rather than replaced with a new farm.

Physical Android/iOS/Safari, native pinch/multitouch, thermal/battery behavior, spoken screen readers, physical GPU VRAM and hardware-specific60-FPS targets were not measured. The internal browser's RAF values are stated only as observations. Upload/download/clipboard flows requiring owner permission were skipped as requested. Models are an artistic interpretation, not a zoological, architectural or agronomic fidelity claim.

## Production record

- Production source: pending.
- Cloudflare deployment: pending.
- Public resource hashes: pending final live run.
- Canonical player-origin check: read-only; no synthetic import or production save mutation is permitted on that origin.
- Functional live journey: use the new deployment's previously unused immutable origin with synthetic QA data.
- Artifact and final evidence: pending.
