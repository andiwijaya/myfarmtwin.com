# Unified environmental style — M5-F01

7 November 2026: **48/82 = 58.5%.** The master environmental roles live in
`game/client/unified-world-style.js`: muted olive ground, warm sand paths,
earth/damp soil, existing honey wood/rust roof, pale stone and slate water.
They reuse the original authored atlas palette, lighting and projection without
changing its checksums or regenerating unrelated animal art. Current ground,
paths, beds, wood, roofs, stone and trunks consume these shared roles.

Keep one existing layout unit per world unit, .92-unit crop beds and adult
heights .73 Chicken / 1.3 Goat / 1.8 Cow. Stage scaling stays native. Structures
must fit the current four-unit camera height allowance. The same 35.264-degree
orthographic elevation and four 45/135/225/315-degree views apply throughout.
World key light remains at (-8,18,10), warm hemisphere/direct illumination from
the canonical art contract. Dark green text on the cream interface surface is
the style role for readable overlays; actual HUD restructuring is M6.

Canvas now derives visible scene light irradiance and linear Lambert diffuse
(`/ PI`) before sRGB output, matching the pinned WebGL material. It respects
actual hemisphere sky/ground direction, directional targets and ambient lights.
This replaces its earlier approximate face darkening, which visibly washed out
the fallback. No clock, weather forecast, state mutation or new texture asset.

Validation: 77/77 affected world/layout unit tests, strict typecheck, lint/build,
frozen seven saves, original24 editorial/media and eight atlas PNG preservation,
provenance/MIT/build hashes pass. Default core remains 478,386 bytes. Actual
GPU readPixels and Canvas readback match for ground and both visible barn walls
at all four headings, desktop/touch: 48 sampled surfaces in 16 views. All 23
owned visual actors remain available, full native save/ledger stays byte-exact,
and no page errors/overflow. Actual overview captures from both backends and
mobile were opened for review. Detailed geometry and whole-world final polish
are separate later M5 features.

The first standalone QA import exposed a missing AmbientLight CPU export.
The export is fixed, and the build audit now verifies every retained standalone
Three named import against actual CPU exports. The failed receipt remains in
`qa-artifacts/unified-m5-style/`; the complete passing surface matrix is
`qa-artifacts/unified-m5-style-all-surfaces/style.json` with actual captures.
Pixel testing validates rasterized surface consistency, not physical GPU memory
or frame rate. Physical Android/iOS/Safari remain unavailable. No push/deploy.
