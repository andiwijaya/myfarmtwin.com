# M6-F08 — camera input and HTML alternatives

The hidden unified preview now groups its original camera controls and object list in accessible HTML disclosures. Search and area filtering operate on stable existing object IDs. Choosing an object uses the original context action handlers. Keyboard, mouse drag, wheel and two-pointer pinch change only the single camera. A 7px drag threshold and pinch cancellation prevent an end-of-gesture tap from selecting an object. Focus returns to the canvas when the originating disclosure is closed. Camera instructions and empty/error states are available in Indonesian and English.

Evidence (local, isolated Chrome contexts; no personal saves):

- `qa-artifacts/unified-m6-input-final-all/input.json`: 18/18 profiles, desktop, portrait and landscape touch emulation, both languages, WebGL/Canvas and simulated absence of both graphics contexts; 90 original accepted gameplay commands, exact serialized native state/ledger, one clock and canvas. Actual keyboard, mouse and CDP touch input; filtered HTML alternatives and focus checks passed.
- `qa-artifacts/unified-m6-input-layout-final/responsive.json`: 16 viewport profiles, each with normal and simulated safe insets, 32 layout cases passed. Selecting from the fixed object popup initially scrolled the map beneath the care sheet; explicit map alignment and a reachable sticky toolbar fixed the regression.
- `qa-artifacts/unified-m6-input-missions/objectives.json`: 8/8 native tutorial/objective journeys, 192 original commands, once-only rewards and exact reload passed after the UI change.
- `qa-artifacts/unified-m1/m6-input-unit.log`: 112 unified unit tests passed, including gesture threshold, pinch, cancellation and bounded pointer storage.
- Typecheck, build, frozen seven-save verification and editorial/media/standalone bundle audit passed. Original 24 media and eight authored atlases preserved. Render-critical default bundle: 499,459 bytes.

Profile screenshots and ARIA snapshots are stored alongside the JSON reports outside tracked production content. The no-context case is deliberate capability simulation and uses the HTML object interface; it is not a rendered-map claim. Touch is emulation; physical devices and a screen-reader user study were not available. The classic default and rollback path remain available. No push or deployment occurred.
