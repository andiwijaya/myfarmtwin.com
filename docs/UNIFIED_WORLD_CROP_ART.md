# Native-stage crop geometry - M4-F07

7 November 2026: **43/82 = 52.4%.** Original compact 3D leaves replace crop
cubes: layered lettuce heads, branching tomato stems/leaves, mature red fruit
and small supports. Type/stage come exclusively from the original engine.
Art does not advance growth, infer a new yield or persist presentation fields.
Shared box geometry/materials work through the same WebGL/Canvas camera and
pick ownership. Each bed stays bounded; maximum32 lightweight crop parts.

Subtle leaf sway is bounded to .022 radians and sampled by the single existing
world RAF. A planted crop can keep that RAF active even without owned animals.
Low/reduced/hidden modes draw static poses. Browser testing found a real edge
case: reduced-motion `matches` changed without a MediaQueryList change event.
The RAF guard now draws one final static frame before stopping. This needs no
new timer/polling and also protects sprite poses. Animated-count diagnostics
now report zero in static modes and include actually moving leaves.

Validation: full unit443/443 PASS; after the final static-frame correction,
10 targeted crop/animal unit tests plus typecheck/lint/build PASS. Seven frozen
saves, all24 original media/eight declared atlases, provenance/build hashes/MIT
PASS. Default core478,386 bytes. Eight EN/ID/desktop/touch/WebGL/Canvas
journeys PASS:422 native commands,256 actual plot picks/four headings, native
stages0-3/both species, real harvest/Market/pump/motor/eight-bed upgrades and
entire serialized five-area engine/ledger exact after every command/reload.
Two profiles use32 actual shared-clock ticks in total; final balances1,756
for those clock-advanced journeys and1,778 for the other six.

Four additional desktop/mobile vegetation checks (frozen legacy fixture and
native-command-replayed two-species mature fixture) measure changing leaf
angles while the exact source save remains unchanged. Reduced-motion/Low
stop RAF and return all leaves to rest. QA originally attempted a final
replant after exhausting seeds; it now buys another seed through native Market.
The rejection and missing-media-event diagnostic remain in ignored QA evidence.

Evidence: `qa-artifacts/unified-m4-crop-art/crop-art.json`, native-stage images,
`unified-m4-{vegetation-motion,mature-vegetation}/vegetation-motion.json`,
`unified-m1/m4-crop-art-unit.log`. Mature save/trace were derived only from
accepted original commands, never resource edits. Actual stage/foliage captures
were opened. Mobile usability/final visual/performance gates remain pending;
physical Android/iOS/Safari unavailable. No push/deploy or release authorization.
