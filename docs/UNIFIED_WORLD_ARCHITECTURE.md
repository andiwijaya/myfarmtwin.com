# Unified world implementation contract

Status: M0 design, 7 November 2026. Implementation acceptance remains in
[the living PRD](PRD_MYFARMTWIN_UNIFIED_3D_WORLD_V1.md). A design is not a renderer pass.

## Existing contracts to preserve

`main.js` owns one validated `State`, one queued `send()` using the existing origin
write lock and `SaveSession`, and one 3000ms interval. Tick speed is a domain
preference; document visibility pauses the original clock. A visual RAF must never
call `tick`, `nextDay`, `pause`, a grant, or `SaveSession.save()`.

| Area | Existing renderer / projection | Existing selection and command boundary |
|---|---|---|
| Crop | `world.js`, plot `{id,x,y}`, `isometric.js` | `plotselect` numeric stable plot ID; `plant`, `water`, `harvest`, `buyPump`, `togglePump`, `upgradeEfficiency`, `expand`; Inspect/Why uses `inspect.js` and `care.js` |
| Chicken | `chicken-view.js`, `chicken-layout.js`, `chickenSnapshot()` | `chickenobjectselect`: `coop,nest,feeder,drinker,clean`; saved hen IDs; `enterYard`, `feedHens`, `waterHens`, `cleanCoop`, `collectEggs`; complete validated command list in `chicken-commands.js`; existing panel/Lab/mission modules |
| Goat | `goat-view.js`, `goatSnapshot()` | `goatobjectselect`: `shelter,hay,water,clean,pasture,platform,contract` and actual herd IDs; `validGoatSelection`; existing command validator, care/sale/minimum-herd, missions, Lab and market policy |
| Cow | `cow-view.js`, `cowSnapshot()` | `cowobjectselect` facilities and actual cow IDs; `validCowSelection`; `cow-commands.js` strict field sets including storage destinations, lot lists and sale quote; milk, cooler, orders, recovery, welfare and upgrades stay in existing modules |
| Fish | `fish-view.js`, `fishSnapshot()`, selected numeric pond ID | `fishobjectselect` uses `FISH_STATIONS`, `fishpondselect` uses `chooseFishPond`; `fish-commands.js` validates `fish.*`, cohort/lot IDs and pond; existing quality/oxygen/harvest/sale/contracts/Lab remain authoritative |

`camera.js` currently holds five independent views. All renderers replace the
`#world` children. Current area buttons both select renderer and execute an
unvisited-area entry command. These entry effects must be separated from camera
focus in the new path. The first crop selection can advance the existing mission;
camera movement cannot dispatch that selection automatically.

`market.js` is one shared transaction UI. Keep its seed/produce/egg/Goat/dairy/Fish
sections and exact validators. `renderMission`, `chickenObjective`, `goatObjective`,
`cowObjective` and `fishObjective` remain the mission authorities. Existing
Inspector/Lab functions remain HTML; the canvas must not become the sole action UI.

## Scene boundary and proposed layout

`readWorldSnapshot(validatedState)` will return detached presentation values and
stable references. It must not return mutable domain objects or consume the game
RNG. `WorldEntityRegistry` links a presentation ID to the unchanged domain ID;
clicking a mesh selects that reference and existing HTML actions call `send()`.
Never fabricate an animal for an unvisited area. No renderer imports from
`storage.js`, and no domain reducer imports Three.js.

One right-handed ground coordinate plane (X/Z, Y up), four camera headings and one
orthographic camera. Provisional broad layout: Crop southwest, Chicken northwest,
Goat northeast, Cow east, Fish southeast, central Market at origin, connecting
paths and southwest/south reserved land. Coordinates, collision tests and full
five-zone registry are M2 work; M1 contains only Crop + Chicken and Market proof.
One camera controller owns bounded target/zoom/heading, fit, reset and focus;
no per-zone camera stores. No camera field enters the V5 save.

## Renderer feasibility and build

Preferred experiment: pinned Three.js, locally served modules, simple original
procedural terrain/buildings, shared materials, orthographic camera and later
directional sprite atlases. Do not import Astro, MyZooTwin simulation, art, audio,
save formats or clock code. Benchmark against an enhanced Canvas unified-map
fallback with the same entity model and camera, including real context loss.
First prove Crop + Chicken end to end before adding Goat/Cow/Fish meshes.

Default `/play/` keeps the current renderer. Proposed hidden opt-in is
`?world=unified-preview`; no homepage link and no persisted rollout preference.
Load optional preview code/assets only when explicitly opted in. Preview failure
must offer a working unified low-graphics map or an exit to the tested legacy
path with the same save, never reset progress. A release needs the unified
fallback; a legacy exit alone is not M1-F07 acceptance.

The builder may write only `dist/play`. Preserve editorial paths, original media,
homepage, canonical, SEO, GA4 and headers. Pin dependency versions and ship MIT
notice locally. Production source maps are omitted unless separately reviewed.
Original renderers/assets stay available until all-five parity and rollback QA.

## Reference audit: MyZooTwin

Connected GitHub README/package inspected 7 November: Three.js `0.187.0`, Astro
`7.4.4`, static output. Read the local reference modules `foundation-scene.ts`,
`frame-loop.ts`, `isometric-camera.ts`, `scene-picking.ts`, `webgl-cleanup.ts`,
`astro.config.mjs`, asset manifest and Three MIT notice. The reference has an
orthographic bounds fit, triangle-owned raycasting, a generation-guarded single
RAF, explicit disposal/context-loss handling and shared procedural geometry.
These are transferable concepts. Its simulation integration advances its own
clock from the frame loop; do not transfer that clock coupling to MyFarmTwin.
Its static CSP keeps processed scripts external. No whole-repo or asset copy.

MyZooTwin's manifest distinguishes original procedural assets from historical
unverified media. Neither its old journal image nor any reference scene art is
authorized as a new MyFarmTwin asset. MyFarmTwin's existing original FarmGirl and
media remain byte-preserved. See `UNIFIED_WORLD_ASSET_PROVENANCE.md`.

## Rollback and release

Local starting checkpoint `0061b73b89eb5c13dc770ecd56c730fd38f73649`; remote main
verified `fffc13516c1e8e19c5131d9c26b808eb51f6ed20`. Retain all V5 readers. Never
deploy a pre-Fish V4 reader over V5 progress. Before rollout, run existing data,
backup/quarantine/migration/archive/concurrency suites and compare frozen V0–V5
inputs plus complete expected migrated outputs. Disable the preview or return
to the retained V5-compatible renderer without touching browser storage.

No push/deploy in this checkpoint. Before a future release, recheck exact active
task instructions, current release authorization, remote/source/deployment,
asset integrity, fallback, all-five gameplay, visual/accessibility/performance
and live gates. Past MyZooTwin release consent does not authorize this release.
No CI churn or deployment to demonstrate an unfinished prototype.
