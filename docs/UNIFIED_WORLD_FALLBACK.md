# M1-F07 unified low-graphics and context recovery

7 November 2026. Checklist **14/82 = 17.1%**, internal two-zone preview only.

The low-graphics renderer paints visible polygons from the **same Three scene,
entities and camera** into Canvas2D. It is one continuous Crop + Chicken map,
not five legacy screens and not a second farm model. It retains the same camera,
selection, HTML object list, entry safeguard, Market and original action panels.
Canvas polygon ownership follows actual paint order; nonselectable faces block
input behind them. Independent four-heading unit comparisons agree with real
Three raycasts, including an occluder.

No WebGL2 context immediately chooses this map. Actual context loss disposes the
old WebGL renderer, replaces only the canvas and keeps snapshot/selection/camera.
Retry creates a new owned WebGL context without a domain command. The existing
Low Graphics preference can switch either way and survive reload; invalid UI
preferences use safe defaults. Pointer/key/wheel handlers belong to the stable
stage, so canvas replacement does not multiply listeners or lose controls.
Neither renderer owns a timer or advances the simulation. The original fixed
clock and save/backup/quarantine readers remain unchanged.

Subsequent M1-F02 loading work adds a cosmetic visual RAF and a cancellable
one-shot 750 ms WebGL startup delay after the Canvas map is usable. Neither
advances the simulation. The measurements and lifecycle tests for that later
change are recorded separately in `UNIFIED_WORLD_FEASIBILITY.md`.

Evidence and verification:

- **381/381** full unit/integration PASS; lint, strict typecheck and build PASS.
- `unified-world-canvas.test.mjs`: actual polygon boundary/concavity and
  independent mesh-raycast ownership checks at four headings PASS.
- `UNIFIED_NO_WEBGL=1 node tools/unified-picking-e2e.mjs`: **8/8** fresh/mixed ×
  desktop/touch emulation × EN/ID. Real Canvas picking, original Crop/Chicken
  commands, explicit entry once and complete engine/ledger equality PASS.
- `UNIFIED_NO_WEBGL=1 node tools/unified-camera-e2e.mjs`: **8/8**, all four
  headings, actual mouse/emulated touch drag, keyboard, scoped wheel and reset;
  saved bytes exact, no grants, no page errors or overflow.
- `tools/unified-context-e2e.mjs`: **4/4** desktop/mobile × EN/ID. Actual
  `WEBGL_lose_context` injection, one replacement canvas, retained camera,
  accepted harvest in fallback with exact engine result, new 3D retry,
  three low/full cycles, low-preference reload and invalid-preference reload
  PASS. Exactly one original interval observed; no page errors or save drift.
- WebGL picking **8/8** and full default desktop/mobile E2E regression PASS.
- Seven frozen V0–V5 fixtures and 24 editorial/original-media files stay exact;
  pinned vendor/full MIT notice and no-source-map checks PASS.

Receipts/captures: `qa-artifacts/unified-m1-fallback/{no-webgl,camera,context-low-resume,three,default}/`.
Command logs/results: `qa-artifacts/unified-m1/fallback-*.log` and
`fallback-results.json`. Actual no-WebGL mobile/ID, context-lost desktop/EN and
recovered mobile/ID PNGs were opened and inspected. This is injected headless
failure/touch emulation, not a physical Android GPU or touchscreen test.

Art remains placeholder. Canvas fine attachment/face ordering (for example a
door detail) requires the later occlusion/graphics review; no polished rendering
claim is made. The fallback currently still imports Three's CPU geometry/math
alongside the renderer package; payload/lazy loading and timed feasibility are
M1-F02 work. Total distributed raw game bytes at this checkpoint: 2,796,824,
below the explicit 3MB cap. No new five-zone geometry, rollout, push or deploy.

Remaining M1 gates: M1-F02 measured renderer/loading feasibility and M1-F08 full
primary two-zone production/collection/sale proof without required old-scene
navigation. World expansion remains blocked until that hard gate passes.
