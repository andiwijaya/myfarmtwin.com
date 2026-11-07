# M2-F02 continuous full-world ground

7 November 2026. **18/82 = 22.0%.** The preview now has one 50×50 ground box,
centered at (5, 0) with top Y=0, covering the registered world exactly. Four
boundary trees remain on that same ground. There are no separate farm islands
or area-scene mounts. Goat/Cow/Fish geometry is still pending later M2 features;
the newly available ground is intentionally empty at this checkpoint.

The renderer instantiates one full-world camera control and one Three camera.
Its bounds and anchors come from the registry, zoom is bounded at 1…8, and
framing includes four-unit roof height. The old two-zone projection factory
remains for compatibility tests; it is not a second mounted world camera.
Camera pose stays presentation-only and is never serialized in the farm save.

Evidence:

- **15/15 targeted tests** pass: full-world ground/roof corners fit every
  heading and portrait/desktop aspect; malformed camera configuration is
  rejected; existing camera projection/pan, registry, snapshots and Canvas
  geometry checks remain passing. Strict typecheck/build pass.
- Preview browser matrix passes **16 profiles × four headings**: fresh/mixed,
  desktop/touch emulation, EN/ID, Three/no-WebGL Canvas. Real scene inspection
  asserts exactly one ground mesh with center (5,0), width/depth 50, top 0,
  and no ground remaining after disposal. Saved bytes stay exact and only the
  original simulation interval exists. Default visits fetch no preview modules.
- Full production/Market/reload/classic rollback flows pass again on fresh
  mobile ID/Canvas and mixed desktop EN/Three (29 / 35 accepted commands,
  three days each), with complete all-five-area engine/ledger equality.
- Frozen saves, 24 editorial/media files, generated hashes/Git byte filters
  and full pinned MIT notice remain exact. No schema or economy changes.

Captures/receipts: `qa-artifacts/unified-m2-terrain/{three,canvas}/` and the two
production-profile subfolders; command logs/results:
`qa-artifacts/unified-m1/terrain-*.log`, `terrain-results.json`. Representative
desktop Three and mobile Canvas captures were opened; all world edges fit.
Tall element clips retain the already diagnosed offscreen skip-link capture
artifact; the M1 normal-viewport checks remain separately recorded.

Next: install the registered path network/plaza/signposts. This is geometric
ground acceptance, not five-zone gameplay or final graphic-quality acceptance.
No push/deploy; physical-device and release gates remain open.
