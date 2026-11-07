# Animation quality gate — M4-F11

7 November 2026: **47/82 = 57.3%.** The real 30-minute continuity gate passes.
The presentation still uses the original engine clock, RNG and save version.

The quality pass fixes three visible issues: Fish now face the tangent of their
bounded swimming ellipse; land animals stop their walk frames when their route
finishes; and empty Goat forage cannot trigger either browsing or chewing.
Stable per-animal cosmetic walking speeds spread doorway arrivals without
reading or advancing the simulation RNG. Route speed remains at most 2.4 world
units per second. Fish remain bounded representatives of real saved cohorts.

`tools/unified-animation-video.mjs` records the actual world canvas with browser
MediaRecorder. Its nominal captureStream(30) cap is not a measured frame rate.
Both WebGL and Canvas recordings contain at least three actually visible native
actions per species. Chicken: eat/drink/rest; Goat: walk/browse/rest (plus care
where applicable); Cow: walk/feed/milk; Fish: rest/feed/swim. Each profile uses
14 actual original-clock ticks and accepted paid care/milking commands, with an
independent original reducer comparison of the entire serialized save/ledger.
Reduced-motion and Low remain static and preserve the same save.

The actual WebM streams are independently decoded in an isolated browser by
`tools/unified-video-review.mjs`. Representative frames at 3, 21, 29, 41, 47,
56, 92 and 99 seconds are saved for visual inspection. Reviewed frames show
recognizable consistent species, feet and contact pads aligned to the ground,
separate care approaches and an unobscured pond selection outline. The existing
controller tests check bounded motion and intermediate crossfade samples;
screenshots alone do not establish frame rate or continuity.

Evidence stays outside tracked production files:

- `qa-artifacts/unified-m4-animation-video/animation-video.json`, both real
  `*-native-actions.webm` streams, their SHA-256 hashes and original final saves.
- `qa-artifacts/unified-m4-animation-video/decoded/review.json` and decoded PNGs.
- `qa-artifacts/unified-m4-animation-soak/` for real wall-time continuity.
  Actual elapsed 1,801,364 ms, 600 original-clock ticks, 169 camera moves and
  ten Low/High changes. Entire native save/ledger stays byte-exact, one Scene/
  camera/canvas/interval, no duplicate/historical actors and exact final reload.
  No browser errors. Post-GC used JS heap rises from 8,655,152 to 12,008,588 bytes
  (+3.20 MiB); backing storage rises from 51,573,739 to 64,178,334 bytes (+12.02
  MiB), including the cached Low atlas set. These are browser counters, not
  physical GPU memory or a frame-rate measurement. The actual final overview
  capture was opened and reviewed after completion.
- `qa-artifacts/unified-m4-animation-five-area-regression/` for eight full native
  five-area economic/Market journeys in EN/ID, desktop/touch and both renderers.
  All eight pass: 1,880 accepted original commands, exact entire native save
  after each command, one Scene/camera/canvas/interval and exact final reload.
- `qa-artifacts/unified-m4-quality-lifecycle/lifecycle.json`: all three disposal/
  startup-race cases pass with exact save, released contexts and no pending RAF.
- `qa-artifacts/unified-m1/m4-animation-unit.log`: 454/454 unit tests pass;
  lint/typecheck/build, frozen saves, asset provenance and original media pass.
- `qa-artifacts/unified-m4-quality-classic/`: original desktop/mobile vertical
  slice, backup/corruption/version recovery, import/export, stale-tab and blocked
  storage black-box cases pass. Original Goat and Fish all-area journeys pass
  eight profiles each; `unified-m4-quality-native-cow/cow-full.json` passes all
  17 original Cow suites. These use the classic interface kept for rollback.
- `qa-artifacts/unified-m4-quality-security/`: desktop/mobile CSP and malicious
  import rejection pass, no external requests or violations. Emulated 2048 GPU
  atlas cap passes both desktop/touch profiles in `unified-m4-quality-texture-cap/`.

The soak uses Chrome on the connected laptop with a Pixel 5 browser descriptor.
This is touch/viewport/DPR emulation, not physical Android or a controlled FPS
benchmark. Physical Android/iOS/Safari are unavailable. Mobile cold-load and
controlled long-session performance remain separate M7 release gates. The first
short soak diagnostic exposed a QA reload fixture reset; its init script now
seeds only the first load. A corrected 30-second diagnostic passed but does not
count as the 30-minute gate. No production push/deploy or release authorization.
