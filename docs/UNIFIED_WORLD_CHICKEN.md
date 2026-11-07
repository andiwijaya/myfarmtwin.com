# M2-F05 owned Chicken Yard layout

7 November 2026. **21/82 = 25.6%.** Actual visited state now controls the yard
fence, coop, nest, feeder/drinker and flock. An unstarted yard has no owned fence,
coop, care stock or phantom hens. The existing explicit starter action remains.

Coop level changes its real footprint; shade adds the owned canopy, automatic
feeder adds installed equipment, and trays show actual stocks/capacities. Nest
slots use original configuration and only actual pending eggs are drawn. Hen
entities preserve each saved ID. Maximum-level slots are moved outside the
larger coop/shade footprints; the initial two hen positions remain compatible.
The bounded fence has an open gate and uses 19 meshes, plus five for owned shade.

Evidence:

- **397/397 full unit tests**, lint, strict typecheck, build and byte/provenance
  audits pass. New layout tests replay every paid upgrade, preserve source saves,
  verify six exact IDs/capacities, real gate/bounds and no coop/shade penetration.
- **16/16 browser profiles**: unstarted/paid maximum × desktop/touch emulation
  × EN/ID × Three/Canvas, each at four camera headings.
- Eight unstarted profiles execute no domain commands and preserve exact save
  bytes: zero hens and zero yard geometry, despite camera navigation.
- Eight maximum profiles display six saved hens, level 2, shade and automatic
  equipment. All individual HTML selections/focus restoration work; actual hen
  geometry is picked too. Original feed/clean/collect/Market sales execute 48
  total commands with exact complete all-five-area engine/ledger comparison.
- Reload retains actual ownership and count; one original interval and one
  persistent canvas remain. Paid QA fixtures contain only original commands,
  no inserted resources, animals or upgrade flags.

Captures/receipts: `qa-artifacts/unified-m2-chicken/`; logs:
`qa-artifacts/unified-m1/chicken-*.log`. Actual desktop Three and mobile Canvas
maximum-yard captures were opened. Roof occlusion/art/directional motion remain
later gates; the HTML alternatives remain usable from every camera direction.
This is owned-layout acceptance, not final visual-quality or physical-device QA.

Frozen V0-V5 fixtures and 24 editorial/media files stay exact. No engine formula,
save schema/key, economy or original media changed. No push/deploy. Next: Goat
Ranch layout and original selection/grazing integration.
