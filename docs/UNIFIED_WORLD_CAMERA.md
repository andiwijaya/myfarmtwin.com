# M1-F05 global camera

7 November 2026, local hidden preview. Checklist **12/82 = 14.6%**.
The earlier read-only foundation checkpoint remains documented separately.

One target, zoom and four-heading camera is shared by Crop, Chicken and Market
bookmarks. Bounded pan, zoom, rotation, fit and reset never accept a farm state
or dispatch callback. A common ground projection/inverse maps pixels correctly
at every heading and is available for the future unified fallback.

Map-only input: mouse drag, emulated one-finger touch drag, focused-map arrows /
WASD, +/- zoom, brackets to rotate and Home/0 reset. Visible 44px camera/pan
buttons provide gesture-free alternatives. Ctrl/Meta wheel zoom is limited to
the map; ordinary wheel remains page scrolling. Keys outside the focused map
do not operate the camera. Pointer cancellation clears the drag and movement
uses a 7px threshold. Pinch is not claimed.

`node --test game/tests/unified-world-camera.test.mjs`: 4/4 PASS, including
four-heading bounds, invalid values, independent agreement with the actual
pinned Three projection and exact inverse pixel displacement. Strict typecheck,
syntax, build, editorial/original-media preservation and vendor/notice checks
PASS. No default-game or domain module changed in this camera increment.

`tools/unified-camera-e2e.mjs`: 8/8 fresh/mixed × desktop/touch emulation × EN/ID,
four headings each. Mouse and CDP touch drag, keyboard pan/zoom, scoped wheel,
fit/reset, no horizontal overflow, exact saved bytes and zero starter grants
PASS; no page errors. Receipt and 32 real screenshots:
`qa-artifacts/unified-m1-camera/camera.json` and sibling PNGs. Representative
mouse/EN and touch/ID captures were opened and inspected. Mobile is emulation,
not physical touch/GPU/thermal proof. The legacy focused skip-link capture
artifact noted in M0 remains for later UI/accessibility work.

New handlers are owned by the existing preview AbortController. This increment
adds no timer or storage. Geometry remains placeholder proof art. Picking,
unified fallback, Three-vs-fallback feasibility and the hard two-zone gameplay
gate remain pending. No five-zone expansion, push or deployment.
