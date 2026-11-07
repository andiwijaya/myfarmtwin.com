# M2-F03 connected paths, plaza and wayfinding

7 November 2026. **19/82 = 23.2%.** Eleven registered path segments and one
central Market plaza now share the existing single ground. Small overlaps at
junctions prevent gaps; paths/plaza avoid actual plot, pump, coop and Market
body footprints. The original Market building and transactions are retained.

Seven signposts mark registered entries. Picking a sign or its labelled HTML
camera alternative only changes camera focus, preserving heading and the
current farm save. A single active-zone caption follows its real world sign
position in Three and Canvas; using one caption avoids stacking seven mobile
labels. It ignores pointer input and has accessible focus controls. Area names
do not imply an unstarted farm owns animals or buildings. Other farm geometry
and all-five gameplay parity remain pending their own features.

Evidence:

- **13/13 targeted unit tests**, strict typecheck, lint and build pass. New
  geometry tests check connected endpoints, bounds, Market plaza connection,
  nonoverlap with owned structures/plots, immutable definitions and bilingual
  registered sign positions.
- **8/8 browser profiles**: fresh/mixed × desktop/touch emulation × Three/
  Canvas. Four headings each, 224 named focus operations, 32 actual sign picks
  and 32 actual Market roof picks. Every camera operation preserves complete
  save/ledger bytes and one persistent canvas/clock. EN→ID caption changes pass.
- Real scene inspection finds 12 path/plaza meshes and seven posts, then zero
  after disposal. Overview captures show a connected road network on one terrain.
- Full production/sale/reload/classic rollback pass again on fresh desktop
  EN/Three and mixed mobile ID/Canvas (29 / 35 original commands, three days).
- Seven frozen save fixtures, 24 editorial/media files, notice, generated hashes
  and Git-filter byte checks remain exact. Default entry resources: 476,146 B.

Receipts/captures: `qa-artifacts/unified-m2-paths/`; command logs/results:
`qa-artifacts/unified-m1/path-*.log`, `path-results.json`. Actual desktop Three
and mobile Canvas overview captures were opened for review. These are navigation
and geometry checks, not final art or physical-device acceptance.

No push/deploy. Next: complete crop/pump visual mapping using the original
coverage selector, preserving all stable plot IDs and validated actions.
