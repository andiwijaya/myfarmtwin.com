# Native Goat atlas and stages — M4-F04

7 November 2026: **40/82 = 48.8%.** Original low-poly Goat rig and two RGBA
atlases now replace loaded primitive Goat bodies in the unified world. Both
LOD sheets contain112 actual frames: seven actions × four views × four frames.
High491,133 bytes, Low188,257 bytes; all cells are nonempty with transparent
two-pixel borders. Independent regeneration reproduces PNG/JSON/JS exactly.

The shared sprite manager caches per species/LOD and preserves stable actors
through native updates. Weaned/growing/market-ready scale is exactly the native
adapter's .62/.82/1, never a new growth model. Native idle/walk/browse/chew/rest/
climb selects corresponding art. Chewing is gated by actual feeder/paddock
forage. Drinking responds to an increase in the original consumed-water counter,
not merely a camera move or an image load. A save replacement resets transient
counter baselines, preventing imported historical intake from replaying a cue.
Per-species station routing and final transition/contact-shadow review remain
the shared-controller/animation-quality checkpoints; this is not final M4 QA.

GPU promotion now checks actual MAX_TEXTURE_SIZE. When High would exceed it,
the still-usable Canvas world remains until a fitting Low atlas is ready.
Cancellation epochs are rechecked before loading/promoting the driver. Smaller
safe sheets may remain High. Sprite frustum culling is disabled for the bounded
herd so a shifted foot pivot cannot incorrectly cull a visible head near an edge.

Validation: full unit **436/436 PASS**, typecheck/lint/build, seven frozen saves,
all24 original media plus four declared/hash-audited atlas PNGs, build/MIT and
original-source/metadata-binding provenance PASS. Default core478,366 bytes.

`tools/unified-goat-sprite-e2e.mjs`: **8/8 PASS**, desktop/touch emulation ×
EN/ID × Three/Canvas. Every profile replays **62 native commands** over nine
actual growth days (**496 commands total**), including care, inspection, the
real162-Coin eligible sale, minimum-two companion protection, paid herd8/
shelter/care upgrades, unlock, three paddock rotations and real rest regrowth.
Final balance1,419 Coins and every full five-area save/ledger byte match the
unchanged source engine. Duplicate sale accepts once and removed actors vanish.

All three native stages and all seven actions are observed on real scene
Sprites, with exact stage-scaled dimensions and one Sprite per actual Goat.
All eight IDs remain accessible at four camera headings; **32 opaque-pixel
pointer/touch picks** also select the real ID. Reload is exact. The shared
Chicken regression passed another **8/8 profiles**, 192 original commands and
192 actual picks, with the expanded species manager.

`tools/unified-texture-cap-e2e.mjs`: **2/2 PASS**, desktop/touch with2048 maximum
texture capability emulated. Every uploaded atlas fits, all eight Goats use
Low, and quality round trips preserve camera/save and one canvas. This is
capability emulation, not real2K-only GPU or physical mobile testing.

`tools/unified-sprite-import-e2e.mjs`: **2/2 PASS**, desktop Three/mobile Canvas.
A genuinely later save is produced through original water/pause/tick commands
and imported through the existing data UI. The larger historical water counter
does not trigger drinking. A subsequent accepted native day consumes real
water and still triggers the cue; imported/next states are exact. No new save
field, schema, clock, simulation RNG or economy rule was added.

Actual atlas, desktop stage/herd and mobile capability-fallback captures were
opened. Ignored QA: `qa-artifacts/unified-m4-goat/`,
`unified-m4-goat-atlas/`, `unified-m4-goat-texture-cap/`,
`unified-m4-goat-import/` and `unified-m4-goat-chicken-regression/`.
Logs are under `qa-artifacts/unified-m1/m4-goat-*`.

The last recorded cold-mobile timings remain the Chicken checkpoint, with
very thin first-map margin and progressive sprite readiness. No new loading
or FPS acceptance is claimed here; full-asset loading/soak optimization remains
required. All touch evidence is emulated; Android/iOS/Safari hardware and
thermal behaviour remain untested. No push/deploy. Next: M4-F05 Cow atlas and
accepted-milking cues.
