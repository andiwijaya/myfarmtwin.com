# MyFarmTwin cozy visual upgrade

Date: 9 November 2026. Branch: `cozy-world-v1`, baseline local `d7fa65d446cd15ce3bb675baf3915ee9f3592854`, published runtime `ee47d531d145930c18fe046bd2b9b409ebb9d828`, dist tree `1c9cd1094f054d0242486d5228323a87d8f90823`.

Owner approved an autonomous stylized cozy upgrade, with deployment after all gates pass. This is a new visual-quality checklist; the prior 82/82 engineering and 6/6 camera checkpoints are historical, not evidence that the new art is complete. No objective 10/10 score is claimed. No asset purchases are authorized.

## Coordination and evidence

Zebra task `01a1bab6-585c-70be-96ef-a485f9e500d4` has priority on this laptop. MyFarmTwin uses only this repo, `qa-artifacts/cozy-world-v1/`, fresh synthetic-save browser contexts and OS-assigned loopback ports (`startServer(0)`). Never reuse Zebra's tabs, saves, ports or browser profile, inspect/stop its processes, or run heavy builds/browser automation/atlas rendering/soaks/CPU-GPU benchmarks concurrently. Parent coordination is required before each exclusive slot. The parent granted a 10-15 minute baseline slot on 9 November. Baseline capture finished and its browser/server were closed by 04:17:39 UTC; the slot was released to Zebra. Further exclusive work awaits coordination.

Library reference: `libfile_5aaff9188e348191a64f23fb12c539d3`, `image(20261109-031927).png`, native `file_00000000a68c821298005553448a6191`, 191453 bytes, 1900x741, current version 0. Metadata/OCR is available. The current official metadata-preserving copy failed on Windows; reference pixels are not installed and were not inspected. Do not download it by an alternate route. The [Library skill](skill://plugin_connector_1p_1b8ff8edfc1481918b252c8277e23125/library/SKILL.md) and materialization guidance require: “If the helper is unavailable, stop rather than producing a local file without its Library metadata.” Continue with actual application baselines in the coordinated slot.

Current source/fixture/art hashes, declared atlas storage and actual lighting function outputs are in ignored `audit/source.json`. Existing repository atlas pixels were inspected directly; no browser or GPU was used for this source audit. Previous-release captures and performance are historical evidence only, not new measurements for this upgrade.

## Art direction and hard gates

Warm, bright, rounded, handcrafted farm illustration with coherent silhouettes. Terracotta barn siding, muted teal/slate roofing, cream trim, honey wood, sage grass, ochre dirt and clear teal water. Cow coat stays high-contrast cream/charcoal with a larger readable muzzle and subtle pink accents. Use soft asymmetry and small grouped details; avoid an empty flat board, cubic foliage, detached coat blobs and visual noise. Preserve the four-view animal lighting convention.

Palette targets: ground `#97b866`, grass highlight `#b5c979`, path `#cdb07e`, soil `#94674a`, wood `#ba8a59`, barn `#b8644b`, trim `#fff0ce`, roof `#61797a`, cow `#f5efe0`, markings `#303b38`, muzzle `#d89c93`, water `#76b9bf`, contact shade `#314b38`. Final color-space/lighting calibration waits for the measured baseline. Current tick 0 and the mixed fixture tick 1224 both select the night palette; solar-phase semantics and initial readability require an explicit presentation-only decision, not a hidden fixture/time change.

Cow slice comes first: adult proportions and directional native poses; crafted barn with real owned upgrades, organic trees/fences, rounded care stations with actual supply levels, soil/path edges, grass/bedding and believable props, warm directional lighting and grounded contact shadows. A new isolated authoring prototype may be edited before a slot; it is not installed into the renderer or generated production atlases until verified. Do not mark it visually complete from CPU geometry checks.

Before/after must use the same canonical save bytes, viewport, heading, pan and normal 135% camera. Include 1900x741 reference-sized desktop, 1440x900, phone 390x844 and 568x320 landscape; four headings, normal framing and a separately labelled cow focus. Record native tick/weather, actual loaded art, quality/LOD and screenshot dimensions. Camera changes cannot substitute for art improvement. No clipping/floating, readable cow silhouette on phone, unobstructed actual care targets and exact save/ledger are mandatory. Critically inspect the result and iterate without routine owner testing. No expansion to other zones before this gate.

Original procedural models and geometry are preferred. Keep notices and provenance for any reused asset; do not copy MyZooTwin code/art. Cows/owned upgrades/stock quantities and animations come only from validated native selectors/events. Decorative bedding is not fake feed stock; trough fill and dirty/healthy/active cues must reflect actual state. Preserve stable IDs, all five areas, one simulation ticker, RNG/weather, missions, Market, inventories and all save migration/backup/quarantine/concurrency behavior. Keep `myfarmtwin.save.v1` and the current schema. No economy rewrite or 2D fallback.

The existing atlas contract declares exactly 60 MiB combined high+low RGBA storage, below 64 MiB; this is not measured VRAM. Cow high is 256px/cell (4096px-wide sheet), low 128px (2048px-wide sheet). Increasing atlas resolution cannot solve tiny normal-view silhouettes and must not silently exceed hardware/storage limits. Reuse geometry/materials, instance static decoration, cull fine detail and measure actual draw calls, triangles, textures, downloads, heap and successful render submissions. Contact/AO decals must be named honestly; do not claim dynamic physical shadows or physical-display FPS. Native-care and complete-art readiness stay separate from the <=5s core-map target under the existing mobile emulation.

## Living micro-feature checklist - 2/30 (6.7%)

- [x] A01 Source, art/license inventory and immutable baseline identity recorded; no GPU work or user changes disturbed.
- [x] A02 Fixed-camera actual baseline desktop/phone captures and renderer/download profile, in a parent-coordinated slot.
- [ ] A03 Calibrate and lock palette, silhouettes, solar/light/color-space and measurable budgets against that baseline.
- [ ] B01 Cow authoring rig: readable body/head/coat, six native actions, four directions, high/low atlases without edge/floor clipping.
- [ ] B02 Crafted barn shell/interior/roof and actual expanded/shade/sanitation upgrades; correct cutaway and selection.
- [ ] B03 Rounded cow care stations and equipment with truthful supply, cleanliness, milk/cooling states and actions.
- [ ] B04 Organic cow-area trees/fences and coherent scale, without blocking native paths or animal motion.
- [ ] B05 Ground/path edges, grass, bedding and meaningful cow-area props; grounded contact and bounded decoration.
- [ ] B06 Lighting/material/contact-shadow depth, all headings/weather/phases and quality levels; no floating/clipping.
- [ ] B07 HARD GATE: before/after cow slice clearly improves at the unchanged normal camera, phone animals readable, gameplay/save exact.
- [ ] C01 Apply the accepted style to crop beds/plants/stages/wet soil/irrigation.
- [ ] C02 Apply it to Chicken, including actual coop upgrades, care and native poses.
- [ ] C03 Apply it to Goat, including forage/stages/equipment and native poses.
- [ ] C04 Apply it to Fish, banks/water/owned equipment/cohorts and truthful activity.
- [ ] C05 Unify Market, connected paths, horizon and future empty land without fake unlocks.
- [ ] C06 Unify environment with measured LOD/instancing/material/texture/shadow budgets.
- [ ] D01 Four-view animation, alpha/contact/touch picking and grounding for every species.
- [ ] D02 Consistent native weather/solar presentation and reduced-motion/pause behavior.
- [ ] D03 Full five-area native production/care/sales/rewards/economy/weather/RNG/ledger parity.
- [ ] D04 V0-current saves/import/export/backups/quarantine/quota/concurrent tabs/reload protection.
- [ ] D05 Preserve direct camera controls, keyboard/HTML alternatives, drag/pinch and focus behavior.
- [ ] D06 Responsive compact HUD/menus/care, actual 44px controls and selected-object visibility.
- [ ] D07 Controlled loading/render/heap measurements and continuity soak in coordinated slots; explicitly no physical-device claim.
- [ ] D08 Homepage uses actual latest gameplay captures, accurate bilingual copy and direct 3D entry.
- [ ] D09 Final provenance/media/editorial/security/SEO/integrity checks.
- [ ] E01 Unit/lint/type/build, deterministic canonical package and all applicable local regressions pass.
- [ ] E02 Reconcile actual branch/remote/live/pipeline and current release authorization; publish only the tested artifact.
- [ ] E03 Live desktop/phone function, camera, data and gameplay verification with synthetic isolated saves.
- [ ] E04 Live cold/warm loading and actual encoding; distinguish map/care/art readiness and emulation/physical limits.
- [ ] E05 Close evidence/checklist, retain failures and a V5-capable 3D-only rollback; report exact source/deployment and limitations.

Current checkpoint: A01-A02 complete; art direction is drafted and the cow prototype is uninstalled. The new original authoring prototype paints coat patches on the actual rounded body surface, uses a larger muzzle, shorter articulated legs and grounded folded-rest poses. CPU checks pass 24 deterministic poses x four camera headings with the current high/low frame margins; these are geometry checks, not rendered alpha/pixel or art-quality acceptance. An initial bounds check counted invisible rest anatomy; the acceptance check now traverses actual visible vertices, keeping its floor/frame tolerance unchanged. Existing asset provenance and the Three MIT notice verify unchanged.

The baseline runner completed 32 actual PNG captures: four viewports x four headings x normal135%/separately labelled cow-focus220%. Frozen mixed fixture tick1224/weather hot was used throughout. All four contexts retained exact primary save bytes, one simulation interval and one canvas; all11 actors were ready. The successful report has no application errors and did not exceed its deadline. Evidence is ignored `qa-artifacts/cozy-world-v1/baseline/baseline.json` plus adjacent PNGs. Desktop normal, desktop cow-focus and phone normal pixels were inspected: an empty dark-green board, tiny normal-view animals, cubic foliage and little material depth confirm the art-direction problem. No new art acceptance is claimed.

| Viewport | Atlas | Normal draw calls / triangles | Cow-focus draw calls / triangles | Resource encoded bytes | Resource transfer bytes |
| --- | --- | --- | --- | --- | --- |
| 1900x741 | high | 415 / 6256 | 281 / 4712 | 1860532 | 1867132 |
| 1440x900 | high | 415 / 6256 | 277 / 4664 | 1877074 | 1883974 |
| 390x844 emulation | low | 370 / 5392 | 340 / 5064 | 910000 | 916900 |
| 568x320 emulation | low | 372 / 5416 | 242 / 3920 | 910000 | 916900 |

These are real `renderer.info` submissions for heading0, not FPS or physical-device results. Each reports four geometries, four textures and four shader programs, sRGB output and no tone mapping; texture counts are not VRAM bytes. Network totals sum the report's browser Resource Timing entries across capture navigation, not a controlled mobile loading benchmark or complete network/HAR accounting. A03 must set budgets from these measurements before increasing detail.

The first instrumentation attempt incorrectly hooked `WebGLRenderer.prototype.render`, while the renderer defines that method on each instance. Its timeout report is retained as `qa-artifacts/cozy-world-v1/baseline-instrumentation-failure.json`; cleanup closed its browser/server. The corrected public `Scene.onAfterRender` hook records the actual renderer after drawing; its rerun passed. The runner refuses launches without a parent-confirmed slot and explicit UTC deadline. No build, atlas generation, soak, push or deployment has been performed for this upgrade. Full regression, controlled loading/performance and physical Android testing remain unrun.
