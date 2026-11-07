# Unified world asset provenance

M0 inventory, 7 November 2026. At the M0 checkpoint no production art or runtime dependency had been added.
Exact existing asset hashes and byte sizes are recorded in ignored
`qa-artifacts/unified-m0/visuals/baseline-visuals.json`; all `dist/play` files are
inventoried there. Existing editorial/original media stay in place.

| Candidate | Origin / rights evidence | Distribution decision |
|---|---|---|
| Existing SVG farm/animal geometry | Repository-authored `world.js`, `*-view.js`, `fish-scene.js` | Retain for rollback; no new ownership claim |
| Existing FarmGirl derivative | Existing approved original, README / prior asset records | Preserve exact bytes; do not replace |
| New terrain/buildings/paths | To be authored procedurally within this repository | Record authoring source, date, SHA-256 and size before shipping |
| Directional atlases | Not produced yet | Require source model/author/license, reproducible export, checksum, species/direction/frame rects/timing/pivot/scale/hit areas/LOD; inspect actual alpha and poses |
| Three.js | Proposed pinned `0.187.0`, upstream MIT | When installed, retain full upstream notice and lockfile; bundle locally; no CDN |
| MyZooTwin source/art/audio | Reference read only, separate repository and provenance | Transfer concepts only; no scene, model, sprite, audio or historic media copied |

Acceptance checklist for every new asset: known author/license and permitted
distribution, exact path/hash/bytes, consistent lighting and scale, real browser
four-heading appearance, no hidden remote loaders, texture allocation and cold
transfer measurement, reduced-detail alternative, explicit source/production
separation. QA screenshots/traces/videos remain ignored and are never game assets.

M1 experiment: Three.js 0.187.0 installed from the pinned npm package (lockfile
retained, lifecycle scripts disabled), with its two WebGL ES modules, full MIT
notice and version receipt copied under `dist/play/vendor/three`. Exact deployed
paths, sizes and hashes are in `UNIFIED_WORLD_ASSETS.json`. Vendor bytes are
protected from checkout newline conversion. No CDN, source maps, external font,
texture, downloaded model, MyZooTwin source or media is included. The procedural
box geometry is original feasibility placeholder art and does not satisfy the
later directional-sprite or graphics-quality gates.
