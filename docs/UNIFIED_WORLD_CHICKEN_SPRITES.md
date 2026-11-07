# Native-world Chicken atlas — M4-F03

7 November 2026: **39/82 = 47.6%.** The hidden unified world now displays the
original generated Chicken atlas, with actual four-view images, native activity
poses and bounded cosmetic walk/idle variation. Loaded actors have one Sprite
child and no remaining primitive body parts. Temporary primitive bodies remain
as the safe loading/failure fallback, and classic SVG rollback is preserved.

The read-only adapter receives the existing `chickenSnapshot` from main. It
uses actual hen IDs and native activity, without duplicating care/production
rules. Native closed-door state places hens on bounded indoor roost points and
uses rest poses. Daytime positions retain the owned-yard layout. Food/water
pose selection follows native peck/drink/walk activity; missing activity stays
idle. Actual pending eggs drive the nest cue. No new animal, starter grant,
resource transfer, clock, RNG, economy field or schema is introduced.

`unified-world-sprites.js` owns cached local assets and per-ID players, with no
timer or RAF. The existing sole world cosmetic RAF samples the players; hidden,
Low Graphics and reduced motion stop it and use static poses. Both renderers
use the same Sprite scene/camera and frame rectangles. Canvas draws projected
RGBA quads; WebGL uses prelit SRGB Sprite materials. Picking samples actual
bilinear alpha, so transparent corners pass through to the real object behind.
Raycast/Canvas agreement is tested at all four headings. Per-species movement
routing/priority, transitions and contact shadows remain later M4-F08/F09 work;
this checkpoint does not claim the final animation/graphics quality gate.

The original CSP has `connect-src 'none'`. It remains unchanged. Metadata loads
as generated same-origin static JS modules, and PNGs as local images, instead
of broadening fetch permissions. JSON remains the canonical metadata artifact;
the generator/build/provenance audit verifies its exact JS binding and PNG
hash. Both LOD bindings regenerate identically with the original images.

Validation: **433/433 full unit tests PASS**, strict typecheck/lint/build,
seven frozen V0–V5 saves, original24+audited2 media preservation, bundle/MIT and
updated atlas/module provenance PASS. Full classic E2E passed desktop/mobile
tutorial, homepage/nine editorial routes, recovery/import/export, offline,
clock/stale-tab and blocked-storage checks. Default bundle total478,348 bytes.

`tools/unified-chicken-sprite-e2e.mjs`: **8/8 PASS**, desktop/touch emulation ×
EN/ID × Three/Canvas. Six paid native hens retain their exact identities. Each
profile performs **24 native commands**, including **eight genuine shared-
interval ticks** (no mocked clock), six explicit game days until feed/water
are actually empty, native care/collection and three egg-lot sales. All complete
serialized five-area state, weather, RNG, resources and ledger match the source
engine after every action. Final balance1,535 Coins in every profile.

All six IDs are selected through actual opaque sprite pixels at four headings:
**192 trusted pointer/touch picks** total. Night roost, real daytime eat/drink,
empty-stock walk, static Low and exact reload are verified. One actual Scene,
camera and original simulation interval persist. A deliberate WebGL-to-Canvas
quality switch replaces its context-specific canvas element while retaining
one canvas and the same Scene/camera/save. No area navigation creates a scene.

Preflight failures were test assumptions: one day was insufficient to consume
the native ration, and canvas DOM identity cannot remain unchanged when its
context type changes. Tests now wait for real depletion and assert the correct
quality-switch contract. Logs remain at
`qa-artifacts/unified-m1/m4-chicken-first-failure.log` and
`qa-artifacts/unified-m1/m4-chicken-quality-assertion.log`. A unit fixture also
had genuinely depleted feed and correctly selected walk, rather than the test's
assumed eat pose; its assertion now follows the native activity.

Actual night/day, empty-stock and mobile Canvas captures were opened. Ignored
QA receipts/PNGs: `qa-artifacts/unified-m4-chicken/chicken-sprites.json` and
neighbouring captures. Full/classic logs: `qa-artifacts/unified-m1/m4-chicken-*`.

## Cold mobile loading after live Chicken integration

Chrome156, touch390×844, CDP4× CPU/1.6Mbps/150ms, isolated/no-store/uncompressed:
input-bound first map **4,955.3ms Three / 4,867.5ms Canvas**; trusted camera
response58.9/42.6ms. Actual sprites ready7,592/6,630ms, full Three ready9,029ms.
This single run meets the5s first-map threshold but has too little margin;
the preceding pre-integration run missed it at5,035.3ms. **No loading fix or
robust performance acceptance is claimed.** Trace both results through
`qa-artifacts/unified-m4-loading-chicken/feasibility.json` and the previous
loading receipt. Optional assets remain progressive over the playable base map.
The one-second diagnostic is not FPS/soak acceptance, and laptop emulation is
not physical Android/iOS/Safari/thermal/mobile-GPU evidence. Loading margin and
asset readiness remain explicit hardening work before release.

No push/deploy. Next: M4-F04 Goat atlas and native stage/activity integration.
