# Shared art and animation specification — M4-F01

7 November 2026: **37/82 = 45.1%.**

Canonical executable contract: `game/client/unified-world-art.js`. Both the
Three environment and its Canvas fallback now consume its existing lighting
direction/background. This establishes the common style before atlas creation;
it does not claim completed animal atlases or animation quality acceptance.

## Form, projection and lighting

Warm, restrained low-poly farm forms, readable species silhouettes, soft cream
and earth colours, gentle local contrast. Preserve the chicken beak/comb,
goat horns/muzzle, cow muzzle/patches and fish tail. Use the contract palette;
avoid text baked into images so gameplay stays bilingual. Texture art and
world environment must share the same apparent light direction. Key light is
world `(-8,18,10)`, warm `#fff4dc`, intensity 2; hemisphere sky `#fff5de`,
ground `#68835d`, intensity 2.6; background `#e5eddc`. These are the already
verified scene values, centralized without changing the economy or current look.

One world unit remains one existing layout unit. Elevation is
35.264389682754654 degrees, matching the actual single orthographic camera.
Four views are camera azimuths **45/135/225/315 degrees**, with model forward
along `+z`. Relative view is `(cameraHeading - cosmeticActorHeading) mod 4`.
Headings are safe integer quarter-turns. Never flip a single image and call it
four-direction art: front/back anatomy and light must remain correct.

## Scale, pivot and safe frame space

| Species | Native adult height | High/low cell px | Frame world units | Ground pivot, top-origin UV | Contact radius | Required actions |
|---|---:|---:|---:|---|---:|---|
| Chicken | .73 | 128/64 | 1.6 | (.5,.82) | .28 | idle, walk, eat, drink, nest, rest |
| Goat | 1.3 | 192/96 | 2.6 | (.5,.82) | .45 | idle, walk, browse, drink, rest, climb, chew |
| Cow | 1.8 | 256/128 | 3.8 | (.5,.82) | .65 | idle, walk, feed, drink, rest, milk |
| Fish | .12 | 96/48 | 1.25 | (.5,.5), water plane .27 | 0 | swim, feed, surface, rest |

High art density is **64–80 pixels per world unit**, low half that. Native Goat
scales are .62 weaned/.82 growing/1 adult; Cow stages/scale and fish mass cues
remain snapshot-owned. The pivot is the projected actual foot/ground contact,
not the middle of a bounding box. Fish pivot sits on its water plane. Plant
roots remain anchored to their real beds.

At every view, projected native height plus width/depth and **10% pose
allowance** must fit above the pivot with two pixels of clear padding. The Cow
frame uses 3.8 units: a smaller candidate would clip projected anatomy. Pose
translations must stay within the validated cell; climbing onto an actual
platform moves the world anchor, rather than pushing art beyond its texture.
Keep transparent padding free of unrelated colours. Foot position must remain
stable through frame changes, stage scaling, turns and low/high transitions.

## Atlas, playback, shadow and LOD

PNG, straight RGBA, transparent clear, linear sampling, no baked background,
no mipmaps initially. Reserve two pixels of edge padding. Sixteen columns;
action-major rows contain four relative views × four frames. Initial target
is 6 art frames/sec within the one cosmetic RAF, with readable loops and smooth
motion/transitions. Actual cadence and visual acceptance are later gates.

The complete four-species layout calculates to **48 MiB high / 12 MiB low**
uncompressed RGBA; both during a transition total 60 MiB, under a 64 MiB reserved
atlas budget. These are calculated allocations, **not measured GPU memory**.
Low sheets fit 2048 textures; High requires 4096. Capability checks must choose
usable art, and old textures must be disposed after a transition. Compressed
transfer/decoded memory/performance remain measured M4/M7 checks, not promises.

Contact shadows are separate world-ground shapes, never baked into a billboard:
`#344b38`, opacity .18, capped .24. Fit species radius/stage to the ground,
respect roofs/ponds and avoid double shadows. Fish has no land contact shadow.
Depth/alpha/picking and shadow implementation are verified in later M4/M5 items.

Reduced motion uses one static pose for the real native state; low graphics and
hidden documents stop cosmetic playback. One animation controller must own all
visual time. Stable-ID hashing may choose cosmetic variants/phases; simulation
RNG, clock, care/production rates and original IDs must never change. Available
zones contain no animals. Cues must reflect actual stocks/ownership and accepted
actions; clicking an unavailable action cannot fabricate activity or production.

## Provenance and verification

All new design/configuration is original repository-authored work for this task.
No MyZooTwin art/source or external sprite pack is used. Project-controlled art
origin and normalized source hashes are recorded in `UNIFIED_WORLD_ASSETS.json`;
the pinned Three.js MIT notice remains intact. Do not assign an unverified
external license or replace original site media. Future generated atlases must
record generator/version/input hashes and reproducible frame metadata.

Validation: **11/11 affected unit tests PASS**, including three new art-contract
tests; strict typecheck, lint and build PASS. The full-farm browser fit matrix
passed **8/8 profiles**, desktop/touch emulation × EN/ID × Three/Canvas:
**32 whole-farm views and 224 zone focuses**, 471 visible meshes, 66 native
objects, one actual Scene/camera/canvas/interval, exact source save and stable
world positions. Actual scene light objects match the canonical contract in
every view. All projected vertices fit the viewport/clipping bounds.

Seven frozen V0–V5 fixture, all 24 editorial/media, build/license and updated
original-source provenance audits PASS. Full engine/unit run at M3 remains
423/423 PASS; this feature adds three passing targeted tests and changes no
simulation source. Two initial strict-type errors (generic helper annotation
and array-to-tuple spread) were corrected before the passing build.

Actual desktop Three/mobile Canvas reference captures were opened. Ignored
QA: `qa-artifacts/unified-m4-art-contract/fit.json` and PNGs; logs:
`qa-artifacts/unified-m1/m4-art-contract.log`. Touch is emulated. Atlas budgets
are calculated only; the receipt explicitly records `allocated:false`. No
completed atlas, measured GPU allocation or animation-quality claim is made.
No push/deploy. Next: reproducible four-direction atlas pipeline and player.
