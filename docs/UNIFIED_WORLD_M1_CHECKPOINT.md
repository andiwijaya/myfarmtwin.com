# M1 read-only renderer checkpoint

7 November 2026. Initial read-only checkpoint `3a49a74`: **11/82 = 13.4%**.
Later camera, picking and fallback increments are tracked in the living PRD and
their dedicated evidence documents; pending statements below describe this
initial snapshot, not current completion.
Completed here: M1-F01, M1-F03 and M1-F04. M0 was completed at local commit
`58cbfc0`, following initial safety checkpoint `11328e6`.

## Verified scope

`/play/?world=unified-preview` explicitly opts into a read-only, single-terrain
Crop + Chicken experiment. One orthographic Three.js camera and shared ground
contain actual crop beds, actual visited coop/stations/hens and one Market.
Unvisited Chicken has only an available footprint, with no imaginary hens or
entry command. Four headings, fit/reset, zoom and camera-only focus are present.
Pan/gesture/picking work is not yet accepted as M1-F05/F06.

`unified-world-model.js` constructs detached immutable presentation values from
the validated existing state. Every plot retains its numeric command ID; hens
retain saved IDs via stable scene references. No renderer storage, command,
game RNG, fixed timer or visual RAF clock exists. This static feasibility scene
submits a frame on snapshot/camera/resize changes. It does not claim animation
or a measured Three render frame rate. Scene cleanup is idempotent and verified.

Default `/play/` does not mount or fetch the preview, its model/camera or vendor.
The legacy game remains below the explicit read-only preview and still provides
gameplay. That is a safety arrangement during development, **not** unified
interaction parity. The simulation, schema V5 and save key remain unchanged.

Three.js and its development types are pinned to 0.187.0 with lockfile integrity.
The builder rewrites the preview's single package import to the two local WebGL
modules and copies the full upstream MIT notice. It copies no Astro stack,
dependency directory, source maps, textures or reference art. See
`UNIFIED_WORLD_ASSETS.json` and `UNIFIED_WORLD_ASSET_PROVENANCE.md`.

## Tests and actual evidence

| Verification | Result / evidence |
|---|---|
| Syntax, strict typecheck | PASS; `qa-artifacts/unified-m1/lint.log`, `typecheck.log` |
| Full unit/integration | 376/376 PASS; `qa-artifacts/unified-m1/unit.log` |
| Model invariants | Fresh Chicken has no hens/grants; 100 repeated snapshots exact; V0–V5 fixture outputs and bytes remain exact |
| Camera math | Four-heading bounds at portrait/desktop aspects; invalid values bounded/rejected; fallback projection independently matches actual pinned Three camera |
| Isolated build | Existing retention test plus vendor allowlist, import rewrite, full notice copy and pin mismatch rejection PASS |
| Real build preservation | 24 editorial/original-media files byte-exact; full MIT notice exact; no source-map references in copied modules; `qa-artifacts/unified-m1/build-audit.json` |
| Preview browser | 8/8 fresh/mixed × desktop/touch emulation × EN/ID, 4 headings each, no page errors or overflow; save bytes exact through camera/locale/reload; only original simulation interval; cleanup tested |
| Default browser regression | PASS: desktop/mobile editorial, gameplay loop, missions, export/import/backup/corruption/future-version recovery, stale tabs, offline and blocked-storage behavior |
| Post-build default performance | Two targeted desktop/mobile field profiles PASS, including explicit core/optional/total asset budgets; not a new-world feasibility benchmark |

Authoritative corrected browser captures and receipt:
`qa-artifacts/unified-m1/corrected/preview.json` and 32 actual PNGs in that folder.
Representative desktop/mixed/EN heading 0, mobile/mixed/ID heading 1 and
desktop/fresh/EN heading 2 were visually inspected; the corrected mobile ID
status was inspected again. Initial capture found the status did not update
after changing locale; code and a browser assertion now cover that fix.
Primitives are visibly placeholder art, not a graphics-quality acceptance.

Default regression and performance receipts are under
`qa-artifacts/unified-m1/regression/` and `performance/`; command exits are in
`check-results.json`. All QA files are ignored and excluded from production.

## Asset budgets and remaining hard gates

All distributed game files together: 2,780,585 raw bytes; optional preview/vendor
2,149,482 bytes; default core 631,103 bytes. The existing 640KiB raw / 250KiB
per-file gzip-equivalent core budget remains enforced. The hidden assets are
disclosed separately and an additional 3,000,000-byte total raw cap is enforced.
Default no-preview-fetch is independently checked. Raw bytes/gzip equivalent are
not claimed as real compressed HTTP transfer. No old threshold was silently
raised to make the renderer pass.

M1-F02 remains **pending**: compare real Three-vs-enhanced unified fallback,
optimize/minify/tree-shake the optional payload, measure cold/throttled loading,
frame submissions/cadence and memory on named supported browsers. Legacy
mobile-emulated cold load already exceeds the new ≤5s target. Physical Android
GPU/touch/thermal/FPS and Safari remain unmeasured.

M1-F05/F06 remain pending: complete pan/drag/keyboard/picking and map existing
validated actions through the selected entity. M1-F07 remains pending: the
current WebGL-unavailable/context-lost message preserves access to the old game,
but is **not** the required usable unified-map fallback or recovery proof.

M1-F08 remains **not passed**: no claim that plant/water/harvest and
feed/collect/sell run from the unified scene. Complete that end-to-end proof
before any five-zone expansion. No M2 implementation, animated-atlas acceptance,
expensive polish, default rollout, push or deployment occurred here.

Next safe checkpoint: M1-F02 feasibility/size work, followed by the remaining
camera/input/fallback contracts and the hard two-zone playable gate. Keep this
opt-in hidden and retain all existing renderers/readers while implementing it.
