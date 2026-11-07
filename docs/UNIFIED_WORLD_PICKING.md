# M1-F06 picking and existing actions

7 November 2026, hidden preview only. Checklist **13/82 = 15.9%**.

Actual Three raycasts use the nearest visible mesh and walk its ownership to a
stable scene entity. Nonselectable geometry occludes objects behind it. Only
current snapshot IDs resolve to plot, coop/station, animal, pump, Market or
unstarted-yard selection. Hen identity remains available while its care actions
route to the existing coop-wide panel. Unknown/stale IDs are rejected.

Object selection reaches the existing HTML panels and original validated `send`
boundary. Market uses the same existing dialog. First plot selection preserves
the original mission command; subsequent selection remains presentation-only.
The unstarted Chicken marker only reveals an explicit Start button. Camera focus
and marker selection cannot dispatch `enterYard`; the explicit button disables
while pending and the existing engine applies the single grant.

HTML object buttons are keyboard/screen-reader alternatives with readable EN/ID
labels and selection state. Matching Crop/Chicken panels return focus to their
world object on close; legacy selection retains its existing fallback focus.
The list is keyed so ordinary state updates do not destroy its focused button.
Mouse/touch uses a 7px drag threshold, pointer cancellation/lost capture cleanup,
and no pick after drag. Mesh selection preserves the one existing simulation
clock. Renderer callbacks execute only for explicit input, never `sync`/render.

Verification:

- Full unit/integration **379/379 PASS**, strict typecheck PASS, build PASS.
- `unified-world-selection.test.mjs`: current/stale IDs, no grant on selection,
  original hen identity and immutable routing tested.
- `tools/unified-picking-e2e.mjs`: **8/8** new/mixed × desktop/touch emulation ×
  EN/ID profiles. Actual plot meshes picked at all four headings, plus Market,
  feeder and hen geometry. Keyboard object choices and focus return pass.
- Each accepted UI command is replayed through the unchanged engine and the
  **entire serialized state** is compared immediately: select/plant/harvest/
  water, explicit entry, feedHens and waterHens. IDs, RNG, weather, ledger,
  inventories, all five subsystems and mission effects therefore match exactly.
- Double-clicked explicit start gives one grant; looking/selecting gives none.
  Drag leaves selection and saved state unchanged. No page errors/overflow.
- Post-integration default desktop/mobile E2E and the complete eight-profile
  camera regression PASS. Seven frozen V0–V5 inputs/expected outputs remain exact;
  24 editorial/original-media files and full MIT notice remain byte-preserved.

Evidence: `qa-artifacts/unified-m1-picking/picking.json`, eight sibling PNGs;
`default/` and `camera/` receipts. Logs:
`qa-artifacts/unified-m1/picking-{unit,typecheck,default,camera}.log` and
`picking-run.log`. Representative fresh/touch/ID and mixed/mouse/EN captures were
opened and inspected. Touch is emulated, not a physical device claim.

The scene remains an internal prototype above the existing renderer. This is
input/command mapping proof, not M1-F08 acceptance of a primary unified world.
Full care/production/collection/sale journeys and removing required legacy scene
navigation from the preview are still pending. Next: a genuinely usable unified
no-WebGL/context-loss fallback and the remaining feasibility/two-zone gate.
No five-zone expansion, push or deployment.
