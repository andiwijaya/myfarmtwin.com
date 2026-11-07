# Ground, paths and farm boundaries — M5-F02

7 November 2026: **49/82 = 59.8%.** Shared world coordinates now support inset
paving/edge strips, timber crop-bed rims and moisture-coloured furrows, faceted
boundary tree canopies, restrained building/tree contact pads and owned Goat/
Cow perimeter fencing. Their real gate openings follow the existing connected
paths. Native paddocks, care stations and every animal remain in their original
layout. No new purchased building, animal, resource, route, ticker or save field.

`unified-world-environment.js` supplies finite original procedural parts. Paths
stay inside their audited footprints, tree canopies fit existing tree bounds,
beds fit native plots, and the reserved future land stays empty. Ranch fences
surround all care routes with body clearance, including a full-herd rest case.
They exist only for already-started native areas and disappear on empty import.
Existing shared BoxGeometry/material pooling also serves these additions;
transparent contact pads are pick-through and disposed by the same world owner.
No realtime shadow map, downloaded texture or external art dependency.

Validation: 82 affected world/layout tests pass, plus the added full-herd route
clearance case (6/6 footprint suite). Typecheck/lint/build, seven frozen V0-V5
saves, original24 media/editorial files, eight atlases, hashes/provenance/MIT pass.
The fence helper's too-narrow inferred literal gate type was widened to numeric
dimensions; its existing Chicken geometry and native gate remain unchanged.

Four actual browser profiles x four headings pass ownership/import/restore and
whole-save equality. Full overview has 552 meshes,23 sprites,95 pooled/material
instances and78 static landscape meshes plus38 ranch pieces. WebGL reports575
draw calls,6,670 triangles,3 GPU geometries and4 textures per full view. These
are actual counters, not a measured FPS or GPU-memory claim; subsequent LOD/
instancing and performance gates remain separate. All8 fit profiles pass32
overview checks and224 focus changes with one Scene/camera/canvas/original clock.
All8 contact profiles pass128 exact body picks and64 real20px touch reaches,
four species x four headings, with native save/ledger unchanged. Actual overview,
crop-bed, ranch and mobile captures were opened and reviewed.

Ignored evidence: `qa-artifacts/unified-m5-environment-environment/environment.json`
and captures, `unified-m5-environment-fit/fit.json`,
`unified-m5-environment-contact/contact.json`, and `unified-m1/m5-environment-*`.
Default core remains478,386 bytes. Touch is emulated; physical Android/iOS/Safari
remain unavailable. Hidden preview and classic rollback remain. No push/deploy.
