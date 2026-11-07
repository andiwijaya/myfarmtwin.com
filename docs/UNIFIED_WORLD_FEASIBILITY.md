# Two-zone renderer feasibility

M1-F02 verified engineering decision, 7 November 2026. Checklist **15/82 =
18.3%**. Measurement scopes, passing checks, retained failures and device limits
are recorded below. This does not complete the M1-F08 two-zone gameplay gate.

Use locally bundled, pinned Three.js 0.187.0 for the shared environment and
nearest-visible-mesh picking. Keep the same scene, camera and domain selection
adapter usable with Canvas 2D when WebGL2 is unsupported, a context is lost, or
the player selects Low Graphics. Canvas also provides the first usable map while
the WebGL driver loads. This avoids making the large driver a prerequisite for
camera or gameplay interaction. The default game remains behind the existing
hidden opt-in and fetches no optional renderer code.

Pinned esbuild 0.28.2 produces the default game entry separately, then splits the
optional CPU/math and WebGL code while sharing class identity. The upstream full
MIT notice stays published. Existing standalone modules remain for rollback;
performance reports distinguish actual default-entry resources, optional
graphics and retained modules. `build-info.json` records paths, hashes and the
lazy driver binding. See [build safety](BUILD_SAFETY.md) and [the upstream bundler
API](https://esbuild.github.io/api/).

The decision compares actual Three WebGL2 against an enhanced 2.5D rendering of
the same scene with Canvas, rather than equating the old independent SVG area
scenes with a unified fallback. Canvas projects visible box faces, sorts them and
picks the topmost painted polygon. It uses CPU work for every animated frame;
WebGL keeps scene geometry/materials allocated. Low Graphics and reduced motion
stop cosmetic animation and redraw for input/state/size changes.

## Measurement contract

- Disposable headless Chrome and Edge executables; no personal browser profile.
- Desktop 1440×1000 and touch-emulated 390×844 with CDP 4× CPU, 150 ms latency,
  1.6 Mbps download. The local QA server sends uncompressed, uncached bytes.
- Cold navigation records first successful map rendering and actual camera
  button completion separately from the later WebGL-ready time. Availability is
  the first successful render after the real input handlers are bound and game
  state is validated. Trusted pointer-up to resulting camera heading update is
  measured separately (≤100 ms). Playwright completion includes its scrolling,
  actionability waits and protocol overhead; that diagnostic remains reported
  and is not substituted for the PRD's availability deadline.
- Each renderer/profile observes 60 seconds of real successful render
  submissions, separate observer RAF cadence, frame intervals, CPU task time
  and post-GC heap growth. A frozen synthetic paused farm owns two visible hens
  with slight cosmetic breathing. This tests neither full directional animation
  nor five-zone maximum capacity.
- Exact complete save bytes/ledger, one original clock interval, reduced-motion
  stop/resume and actual renderer mode are asserted. This visual RAF never calls
  the simulation reducer, simulation RNG, wall-clock catch-up or storage.
- Budgets: input-bound rendered map available ≤5 seconds; ≥50 successful render
  submissions/sec desktop and ≥30 mobile emulation; <20 MiB heap growth; one
  original simulation interval; DPR clamped to 1.5. Metrics are headless cadence,
  not a claim about physical screen/GPU presentation rate.

Initial cold runs exceeded an additional self-imposed five-second Playwright
completion assertion (5.03–5.44 seconds) while the input-bound map was already
rendered within five seconds. Those failed receipts remain preserved. The
acceptance instrumentation now follows the PRD's availability wording and adds
the trusted-input response check; the end-of-automation timestamp is still
published. Startup changes also remove the redundant legacy map build and
unchanged-snapshot redraws. One cancellable 750 ms graphics startup delay gives
the usable Canvas map precedence over expensive WebGL context creation. It is a
one-shot UI delay, not a simulation ticker, and pending delay/context/import work
is covered by disposal and rapid-quality-change tests.

## Recorded measurements

Disposable Chrome **156.0.8078.80** and Edge **157.0.4341.42** on the audited
i7-1255U / 23.7 GiB Windows host. WebGL identifies its own backend as ANGLE,
Intel Iris Xe, Direct3D11. These contexts use DPR 1; high-DPR and physical-phone
performance remain separate work. The default game entry/resource manifest is
**475,249 raw bytes**. Three CPU/facade plus lazy driver total **541,951 bytes**,
replacing the earlier 2,133,699-byte raw upstream-module prototype. Full notice,
pin receipt and generated hashes are checked; Git filters preserve their bytes.

Eight cold availability checks after the startup changes:

| Browser | Profile | Renderer | Input-bound map ready (ms) | Playwright complete (ms, diagnostic) | Trusted-input response (ms) |
|---|---|---|---:|---:|---:|
| Chrome | Desktop | Three | 213 | 332 | 0.7 |
| Chrome | Desktop | Canvas | 163 | 272 | 0.8 |
| Chrome | Mobile 4× | Three | 4,486 | 5,030 | 8.5 |
| Chrome | Mobile 4× | Canvas | 4,554 | 5,096 | 10.3 |
| Edge | Desktop | Three | 188 | 263 | 0.8 |
| Edge | Desktop | Canvas | 150 | 239 | 1.4 |
| Edge | Mobile 4× | Three | 4,713 | 5,287 | 12.7 |
| Edge | Mobile 4× | Canvas | 4,455 | 5,067 | 8.2 |

All eight meet the input-bound availability and response budgets. The preceding
eight-profile, 60-second steady-state matrix observed **59.9–60.0 successful
submissions/sec**, ≤0.18 MiB post-GC growth and exact save bytes. Its three
additional Playwright-completion deadline failures remain in the receipt; they
are not relabelled as an overall passing run. That run preceded the cancellable
startup delay and canonical-text build fix; the scene and steady animation were
unchanged by those adjustments. Fresh post-adjustment 60-second mobile checks
also pass: Chrome/Three **60.0 submissions/sec**, +0.18 MiB, 20,712 ms CDP task
duration; Edge/Canvas **60.0**, +0.11 MiB, 34,228 ms. Each has two actual owned
breathing hens, one original interval, exact complete save/ledger, and tested
reduced-motion stop/resume. This is submission/RAF cadence, not presented FPS.

The earlier same-browser mobile comparison recorded Chrome task duration
20,856 ms for Three and 31,968 ms for Canvas over 60 seconds. Both maintained
cadence, but Canvas consumed more main-thread work for projection/painting.
This supports Three as the primary environment renderer with Canvas as a
usable fallback and Low Graphics stopping cosmetic frames.

Verification: 382/382 full unit tests; lint/typecheck/build; isolated canonical
build/provenance/Git-filter audits; default E2E; eight-profile preview, camera,
WebGL picking and no-WebGL picking; four-profile actual context-loss/retry/low
quality checks; and three startup lifecycle cases all pass. Lifecycle covers
disposal before context creation, disposal during a genuinely held driver
request, and rapid low/full changes leaving one live context, then none after
disposal. Seven frozen save fixtures and 24 editorial/media assets stay exact.
One initial lifecycle runner failed before assertions because bundled Chromium
was absent; it was rerun successfully with the explicit installed headless Chrome
path. No browser installation or personal profile was used.

Bundled-default performance regressions also pass for desktop Field and mobile
Fish at full graphics: cold interaction **464 / 4,215 ms**, RAF cadence **59.7 /
43.8 Hz**, two ordinary shared ticks and 50 five-area switches each, unchanged
listener/interval counts, and bounded heap/DOM. These two selected profiles are
not presented as a rerun of the entire 20-profile M0 matrix. Each process also
passed the existing paired 90-day/2,160-hour deterministic maximum-farm replay;
peak save remained 323,745 bytes. Production and physical-device gates are open.

Receipts and unmodified browser captures remain ignored:

- `qa-artifacts/unified-m1-availability/feasibility.json` — eight cold checks.
- `qa-artifacts/unified-m1-feasibility-final/feasibility.json` — prior 60-second
  matrix, including its extra deadline failures and frozen build receipt.
- `qa-artifacts/unified-m1-post-startup/{chrome-three,edge-canvas}/` — final
  long mobile samples and captures, opened for visual review.
- `qa-artifacts/unified-m1-startup-regression/` — actual loss/retry, no-WebGL
  interaction and pending-load lifecycle receipts.
- `qa-artifacts/unified-m1/` — complete command logs and result summaries.

The tall mobile element captures include an offscreen skip-link overlay. Later
[M1-F08 viewport/focus checks](UNIFIED_WORLD_TWO_ZONE_GATE.md) confirmed it stays
outside the normal viewport when unfocused. These captures establish
the actual map and fallback, not a polished layout. Primitive art and all-five
expansion are deliberately still pending.

## Release limits

Chrome/Edge share Chromium; their successful results do not establish Safari,
Firefox or physical Android/iOS compatibility. Physical touch ergonomics,
thermal behaviour, battery use and GPU-driver context loss remain unmeasured.
Full-farm population, directional atlases and production network/cache behaviour
must be measured again at their own gates. Placeholder geometry and breathing
do not complete M4/M5. The M1-F08 playable primary-map gate remains separate.
