# Four-view atlas pipeline and timer-free player — M4-F02

7 November 2026: **38/82 = 46.3%.** This checkpoint proves the asset pipeline
and player. Native-world Chicken replacement belongs to M4-F03; the browser
calibration gallery is explicitly labelled as QA, not game UI.

Original offline low-poly authoring rig: `tools/art/chicken.mjs`. It uses rounded
body/head forms, fixed feet, separate neck/wing/leg pivots, beak/comb/eyes and
four actual camera bearings. No pack, MyZooTwin content, image-generation
service or external artwork is used. The pinned local Three.js package renders
transparent RGBA with the shared art projection/light. The generator serves
only its minimal copied authoring inputs on127.0.0.1 in an ignored QA directory;
it never serves the repository or opens a user browser profile.

`tools/generate-world-atlas.mjs` produces High/Low PNGs and versioned metadata
under `game/client/assets/world/`. Both contain **96 actual frames**: six actions
× four views × four frames. Every cell is nonempty and all two-pixel borders
have alpha0. High is224,386 bytes/2048×768; Low79,846 bytes/1024×384. A second
isolated render with `--verify` produces byte-identical PNGs and metadata.
This is reproducibility on the recorded Chrome/Three/backend, not a claim that
different GPU drivers generate identical pixels. Source/model hashes, browser
version and actual render backend remain in metadata and asset provenance.

`game/client/unified-world-atlas.js` validates the strict schema, canonical
dimensions/poses/pivot, local image name, SHA/provenance and four-view layout.
Unknown fields, external/traversal URLs, invalid numbers/actions and getters
are rejected before texture loading. The detached immutable player receives
visual time from its caller, resolves camera/actor headings, uses stable-ID
phase variation, and returns bounded120ms transitions. It owns no RAF/timer,
simulation RNG, reducer, save or resources. Static accessibility sampling fixes
frame0. Actual native activity/state gating is the next per-species integration.

The build now copies PNGs as unchanged binary bytes. Generated JSON retains LF
across checkouts. The original 24 editorial/media baseline is unchanged. Its
audit initially counted new atlas PNGs as old media; it now permits only a
declared known-species atlas path with exact byte length/hash, while requiring
all frozen originals unchanged. Adversarial tests reject missing/changed old
files, reclassification, undeclared/duplicate additions and altered atlas
bytes. Baseline creation uses exclusive writes and cannot silently overwrite
an existing freeze. No baseline was regenerated.

Validation: full unit **429/429 PASS**, plus the newly added preservation-audit
test **1/1 PASS**; strict typecheck, lint, build, seven frozen-save checks,
original24+audited2 media hashes, bundle/license and provenance audits PASS.
`tools/unified-atlas-e2e.mjs` passed **8/8 profiles**, desktop/touch emulation ×
EN/ID × Three/Canvas primary game. A separate same-origin QA gallery loads
the real production assets, observes all96 poses, switches High/Low, samples
transition mixes0/.5/1, stops its visual RAF in static mode, and has no overflow.
Original game save bytes and sole native interval remain exact. Actual atlas,
desktop gallery and mobile static gallery captures were opened.

QA: `qa-artifacts/unified-m4-atlas/{generate,regenerate}.json`,
`qa-artifacts/unified-m4-atlas-player/atlas-player.json` and PNG captures.
Full unit log: `qa-artifacts/unified-m1/m4-atlas-unit.log`.

## Mobile loading diagnostic — real unresolved budget miss

Before live sprite integration, cold Chrome156.0.8078.80 was measured with
390×844 touch viewport, CDP4× CPU and1.6Mbps/150ms network. Three mode's input-
bound first rendered map was **5,035.3ms**, missing the5,000ms budget by35.3ms;
forced Canvas was **4,867.7ms**. Trusted camera responses were27.6/35.1ms.
Three became ready at8,192ms. The local server is uncompressed/no-store.
The generated atlas is not yet requested by the primary world, so these are
pre-integration measurements. The diagnostic reports FAIL honestly; the limit
was not relaxed and no FPS acceptance is inferred from its one-second sample.

Full resource traces and actual laptop render backend are retained in
`qa-artifacts/unified-m4-loading-before-sprites/feasibility.json` and
`qa-artifacts/unified-m1/m4-loading-before-sprites.log`. Core loading and
optional-graphics readiness need margin before release; this will be measured
again with live assets and addressed in loading/hardening work. These are
emulated browser conditions on a laptop, **not physical Android/iOS/Safari or
thermal/mobile-GPU evidence**. It does not block further local art integration.

No engine/economy/schema changes, push or deploy. Classic remains the default,
with the unified renderer behind the existing hidden preview switch. Next:
M4-F03, actual Chicken sprite integration with native state/identity/actions.
