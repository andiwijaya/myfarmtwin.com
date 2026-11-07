# M1-F08 playable two-zone gate

7 November 2026. **PASS — 16/82 = 19.5%.** M1 is complete; five-zone expansion
may now begin. The new world remains opt-in at `?world=unified-preview`.
This does not authorize production release or claim five-area parity.

The preview owns the original `#world` container and one persistent canvas.
Crop beds, actual owned hens/coop, care stations and the shared Market occupy
one continuous terrain/camera. Legacy area tabs are hidden on this mode,
including during startup. Selecting objects changes the existing action/mission
context and does not mount an old area scene. The original renderers remain
available through a labelled classic-map link using the same save and locale.
Default visits retain their existing five-area game.

Chicken startup still requires an explicit accepted `enterYard`. After that
command the actual new coop becomes the selected object; closing its panel
returns keyboard focus to its HTML object alternative. Camera-only shortcuts,
rotation and overview do not dispatch commands or alter saved state. The renderer
does not own a simulation clock or new save schema.

## Verified end-to-end behavior

`tools/unified-vertical-e2e.mjs` passes **16/16** combinations of fresh/mixed
synthetic V5 saves × desktop/touch emulation × EN/ID × real Three/forced-no-WebGL
Canvas. The source engine predicts every accepted UI command independently;
the complete serialized state is compared after each, including weather/RNG,
Coins, inventories, ledgers, missions and the three other farm systems.

- **512 accepted commands**, plus two original-interface commands in the
  deliberately failed-module rollback case, all match exactly.
- Every profile plants and waters a new crop, advances three original game
  days, harvests and sells it through the original Market. No injected funds,
  shortcut growth, replacement economy or fake elapsed time is used.
- Every profile feeds, waters and cleans the coop; actual new egg production
  is collected and sold. Five new eggs are laid in each tested timeline. The
  mixed farm also sells its two pre-existing pending eggs.
- Fresh farms end at tick 72 / 226 Coins; mixed farms at tick 1296 / 2247 Coins,
  exactly as the unchanged engine predicts. Other farm areas progress through
  their original `nextDay` rules while off camera.
- Actual terrain picking, accessible object selection, one persistent canvas,
  zero world SVGs, zero required legacy tabs and one original interval are
  asserted. Explicit double-click starter entry grants only once.
- Reload preserves exact complete save bytes. The classic-map link restores
  the retained interface and chosen locale without changing that save.
- Deliberately returning HTTP 404 for the optional preview module restores the
  classic interface automatically. Its original plot selection and planting
  remain playable with exact expected state; no uncaught page errors.
- All profiles have no horizontal overflow. Normal viewport/focus checks put
  the unfocused skip link outside the viewport. Its appearance on earlier tall
  element clips was a capture artifact; viewport PNGs were opened and reviewed.

Full **382/382** unit tests, lint, strict typecheck, build and bundle/provenance
audits pass. Default desktop/mobile E2E and four-profile actual WebGL context
loss/retry/quality/reload regression pass after the primary-container change.
All seven frozen save inputs/outputs and 24 editorial/original-media assets
remain exact. The current default resource manifest is 475,862 raw bytes.

Evidence: `qa-artifacts/unified-m1-vertical/vertical.json`, per-profile world and
viewport PNGs, `module-failure-legacy-rollback.png`, and
`qa-artifacts/unified-m1/vertical-*.log`. Regression receipts are under
`qa-artifacts/unified-m1-vertical-regression/`. Captures/logs are ignored and not
published as game assets. Representative mobile Three, desktop Canvas and
automatic legacy rollback captures were inspected.

Remaining work: five-zone layout and action parity, directional sprites,
graphics/UI polish and hardening. Touch here is emulated, not physical Android
or iOS validation. No push, deployment or production default change occurred.
