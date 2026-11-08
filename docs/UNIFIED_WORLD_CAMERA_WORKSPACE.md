# Farm camera workspace follow-up

Status: local work on `camera-layout-controls`, based on `49f53baf2bae761d3198dcebd00eeeca0455f370`. The owner explicitly requested no push or deployment for this follow-up. Production is unchanged. This checklist is separate from the historical 82/82 world PRD and the completed 10/10 3D-only release.

## Acceptance checklist

- [x] C01: Desktop farm uses the available width and viewport height, with a closer readable starting camera. Actual 1894x822 and 1440x900 browser captures; Fit still includes all terrain, Reset/Home restores 135%.
- [x] C02: Ten original desktop camera buttons are visible directly: zoom, four headings, four pan directions, Fit and Reset. Unique original callbacks, bilingual names, live readouts, zoom limits, keyboard focus and normal mouse wheel verified.
- [x] C03: Six 44px direct thumb controls, native drag/pinch and accessible secondary pan controls on touch. Six ID/EN input profiles execute real native care commands with exact full saves.
- [x] C04: Care sheets, selected objects, camera controls and global menus stay usable together across eight sizes in both languages and two simulated safe-inset conditions (32 cases). Original care buttons fit fully below the sticky heading after native scrolling; no selection-induced page scroll.
- [x] C05: Native gameplay/save/menu/lifecycle regression and preservation audits pass; see the test matrix below.
- [x] C06: Final visual evidence, measured loading limits and local reviewable checkpoint recorded; no push/deployment.

## Implementation

`unified-world-camera-dock.js` reparents the existing camera buttons rather than creating another camera or input command path. Desktop uses a compact rail outside the canvas; touch uses a bottom thumb row and moves directional pan alternatives into Help. The same canvas survives viewport changes. Only camera heading/zoom changes update the readouts; no extra timer or simulation loop is added.

The shell measures the available viewport, removes the 1600px width and 720px height caps, and places the desktop mission in the map toolbar. The initial camera is 1.35x; Fit remains 1x with the existing all-corner guarantee. Camera state is transient presentation state, without a new preference write or save schema change.

At the reference viewport, the actual canvas changes from x157/y239, 1580x501 to x10/y164, 1706x576: 24% more canvas area. Combined with the initial zoom, the same world units project about 55% larger. These are local browser measurements at 1894x822, not measurements taken from the inaccessible Library image.

Care focus retains the viewport position. The original cow resource summary is moved into Inventory, and original pond selection controls into the Fish care panel, preventing secondary controls from extending the page under the farm. Bounded camera reveal accounts for the actual free area around a care sheet.

Portrait phone HUD labels and time controls compact into one row while retaining full native text and 44px buttons. Landscape save success text remains accessible without adding page height; actual save warnings stay visibly overlaid. Weather content stays in the viewport and leaves its own toggle reachable. Care content remains scrollable with enough room for an entire native action button.

## Verified test matrix

- Unit: 480/480; lint, typecheck and build pass. Camera tests distinguish Fit from Reset/Home, reject invalid initial zoom and retain four-heading projection/bounds guarantees.
- Workspace: four viewport profiles, both languages, ten desktop/six touch direct buttons, four headings/readouts, zoom limits, normal mouse wheel, horizontal-wheel no-op, resize reparenting with the same canvas and byte-exact save.
- Responsive: eight sizes x ID/EN x normal/simulated safe area = 32 cases, including original fully reachable cow care actions and selected-object visibility.
- Trusted input: six ID/EN desktop/portrait/landscape profiles, actual drag/pinch, keyboard, search isolation and five native commands per profile with whole-save equality.
- Five-area parity: four profiles x235 commands across nine game days each, real care/production/sales and whole-save/weather/RNG/ledger equality. A final mobile-ID journey additionally checks the compact phone HUD.
- Menus: four profiles, all six original menu functions, exact export and native purchase/sale/harvest results.
- Objectives: four ID/EN desktop/touch profiles x24 native commands, 22 camera-only objective jumps and five real reward events, with exact save/ledger and no grants from looking.
- Save protection: 21 scenarios, frozen V0-V5 saves, recovery/quarantine/archive preservation, import/reset/restore cancellation, quota and same-origin cross-tab race.
- Lifecycle: four profiles, 20 full remount/disposal cycles, released observers/GPU, fatal bootstrap recovery and native harvest after reload.
- 3D-only entry: eight desktop/touch x ID/EN x normal/no-WebGL profiles, original bookmarks, Low remaining WebGL, context loss/retry and exact save. No Classic or Canvas fallback.
- Sprite contact: four ID/EN desktop/touch profiles, 64 exact alpha-aware picks across four headings and four species, plus 32 enlarged touch picks.
- Preservation: original 129-file audit retains 112 unchanged baseline files, the previously authorized renderer retirement/integrations and seven byte-exact save fixtures; one original simulation interval. Editorial/original media, pinned MIT notices, build hashes and stale chunk cleanup pass.

Actual local mobile measurement, with every other browser suite closed: Chrome headless, 4x CPU, 150ms latency, 1.6Mbps and real local gzip. First successful input-bound WebGL map 2155ms; native care UI 2845ms; all owned animal art 6640ms. Warm map 1795ms, native care 2192ms and art 3763ms. Over 60032ms, 3112 actual successful WebGL submissions average 51.8/s (one-second median 53.1/s); trusted cold camera response 10.1ms and post-GC sample growth +0.38MiB. Initial camera response is measured while owned animal art is still loading; care/art readiness is reported separately. Save bytes remain exact; one interval; reduced-motion stop/resume passes. This is a local transport/emulation result on the laptop GPU, not a public-network or physical-phone/display FPS measurement.

Evidence roots: `before/`, `final-stable/`, `final-responsive/`, `verified-care/unified-input-e2e/`, `parity/`, `final-five-area-mobile/`, `contact/`, `objectives/`, `verified/unified-menu-e2e/`, `verified/unified-save-protection-e2e/`, `audit/`, `performance-final/`, and `unit-final.log` beneath `qa-artifacts/camera-layout/`. Final desktop, portrait and landscape captures were visually inspected. Earlier failed layout attempts are retained: they exposed focus-induced page scrolling, clipped weather content and insufficient care content space; those assertions now pass. One earlier overlapping-build lifecycle run failed its context-loss assertion; stable-build reruns pass. The cause of that isolated failure was not established.

Canonical committed-dist HTTP verification and the consolidated, receipt-matched checkpoint are recorded separately in `package/package.json` and `acceptance.json` under that same ignored QA root. These are local checks and do not publish any files.

Full homepage/SEO/security, long balance/endurance and the previous 15-minute production renderer soak were not repeated for this bounded camera/layout follow-up. Their production code is unchanged; local artifact preservation is verified. Live testing and release remain excluded by the owner's current instruction.

## Evidence and limitations

All QA is under ignored `qa-artifacts/camera-layout/`, outside production files. Browser contexts are disposable and seeded only with repository synthetic fixtures. No user's desktop, browser profile or personal farm save is accessed.

Reference screenshot identity: Library `libfile_a43331d2eea08191a6021249f8abb4ad`, `image(20261108-115812).png`, native file `file_00000000962481f5a96f63e79c534f25`, 1894x822, 238382 bytes. Library text/OCR and dimensions were read. The official metadata-preserving materializer failed on Windows with `AttributeError: module 'os' has no attribute 'setxattr'`; no installed image copy exists. Transfer was stopped; no alternate download or metadata bypass was used. The reference pixels could not be inspected. Local before/after captures reproduce its viewport size.

The [Library skill](skill://plugin_connector_1p_1b8ff8edfc1481918b252c8277e23125/library/SKILL.md) and its [materialization guidance](skill://plugin_connector_1p_1b8ff8edfc1481918b252c8277e23125/library/references/materialization.md) require: “If the helper is unavailable, stop rather than producing a local file without its Library metadata.” This limits only the reference-image transfer; independent repository work and local visual testing continue.

Physical Android, touch hardware, browser chrome, GPU/display frame rate, notch and thermal behavior are not tested. Touch and safe areas are browser simulations. Live tests, push and deployment are explicitly out of scope for this follow-up.
