# Vegetable Farm Expansion and 3D Enhancement

Owner specification: pasted document of 11 November 2026, accepted for autonomous
implementation, testing and deployment in the current chat. The 17:00 WIB stop
was honored at checkpoint `ce555ae`. The owner resumed from home on 11 November
2026, authorizing autonomous completion through V6 rollback, deployment and live
verification, and explicitly confirmed immediate deployment when ready.
This replaces the earlier eight-bed/four-stage proposal. Functionality first.

Starting checkout: `C:\MyFarmTwin`, `cozy-world-v1`, `bda6fd1`.
Remote: `https://github.com/andiwijaya/myfarmtwin.com.git`; production `main`
verified read-only as `f2836be675bcde489617c8e354d01390be594546` at start.
Cloudflare Pages project remains `myfarmtwin-com`, output `dist`.

## Acceptance checklist

- [x] Audit initial layout, crop engine, strict saves, rendering and QA entry points.
      Three initial beds; eight maximum paid beds; two crop types; schema V5.
- [x] 1. Expand capacity to 24 paid functional beds, with proportional rows and paths.
- [x] 2. Preserve roads, market, other zones and collision-free placement.
- [x] 3. Verify every bed can be selected and used on desktop and touch emulation.
- [x] 4. Add corn seeds, inventory, prices, harvest and sale end to end.
- [x] 5. Implement five corn growth stages with mature height about 2–3 world units.
- [x] 6. Verify the full plant/care/grow/harvest/sell/replant loop.
- [x] 7. Improve real 3D lettuce/tomato/corn geometry and deterministic variation.
- [x] 8. Reusable simulation-driven growth and gentle wind/harvest animation.
- [x] 9. Honor pause, reduced motion, low graphics and hidden-tab behavior.
- [x] 10. Keep tall plants selectable without blocking adjacent care controls.
- [x] 11. Retain irrigation, water, economy, upgrades and original progression.
- [x] 12. Strict old-save migration with original-byte retention and quota safety.
- [x] 13. Unit/integration tests for placement, growth, actions and economy.
- [x] 14. Save/load, import/export, backup, recovery and stale-tab tests.
- [x] 15. Automated real-3D stage, animation, collision and picking harness.
- [x] 16. Camera/keyboard/mouse/touch and EN/ID responsive checks.
- [x] 17. Regress crop/chicken/goat/cow/fish native gameplay.
- [x] 18. Measure dense-garden loading/rendering; disclose emulation limits.
- [x] 19. Production build, dependency/security checks and editorial preservation.
- [x] 20. Capture actual before/after screenshots; update game homepage capture.
- [ ] 21. Deploy only after applicable acceptance and regression gates pass.
- [ ] 22. Verify live artifact, console/assets and gameplay; report deployment.

Check an item only after passing its relevant tests. Partial implementations and
failed attempts remain explicitly pending. No personal browser/profile/save access.
No physical Android FPS claim from desktop emulation. Original save bytes are
archived before migration; no reset or silent replacement is allowed.

## Evidence and progress

Initial sandbox baseline encountered `EACCES` on localhost test connections.
Unrestricted baseline retry passed 536/536. F1 native suite passed 541/541;
the final garden camera/registry follow-up passed 11/11 after recentering the
garden bookmark. Typecheck and source-pattern security audit passed.
F1 browser acceptance passed all four desktop/phone × EN/ID profiles, 396
native UI actions, 384 actual 3D bed picks across four headings, exact whole
state/ledger checks and four exact reloads. Evidence: `layout/layout.json`,
`layout-final.log`, 16 actual PNGs, `f1-full-tests.log`, `f1-camera.log` under
`qa-artifacts/garden/`. Failed harness attempts are retained separately.
Implementation, checks and evidence are recorded in `GARDEN_UPGRADE_PROGRESS.md`
and ignored `qa-artifacts/garden/`.

F2 corn acceptance: **544/544 native tests PASS**, typecheck PASS. The original
V0–V5 fixture and rollback-reader bytes/hashes remain immutable. Legacy semantic
projections assert the new `corn` seed count is exactly zero before comparing
every original field; strict legacy input still rejects corn/new fields.
Four browser profiles each pass 20 native UI actions over seven simulation days,
all five stages, real rendered 2–3-unit mature height, harvest/sale/replant, exact
whole save/ledger, mature reload and byte-exact exported JSON (80 actions,
20 stage PNGs). Receipts: `corn/corn.json`, `corn-e2e.log`, `f2-accepted-tests.log`.
Actual mature desktop pixels were inspected. An additional **Codex internal
browser** (IAB) fresh-farm flow verified buying corn, selecting it, planting,
watering and Next day: visible `Corn · Sprout · 20%`, harvest disabled. No native
Windows input, personal Chrome attachment or personal save was used.

F3 visual/growth acceptance: **549/549 native tests PASS**, strict typecheck PASS.
Rounded lettuce hearts/curled leaves, supported tomatoes with green/ripe fruit,
and broader corn leaves retain real closed 3D geometry. Stable-ID variations
change transforms without game RNG. Native progress is eased for 320 ms on the
existing RAF; elapsed renderer time can never advance native progress. Whole
plants sway with a bounded angle. Shared plant buffers are reference-counted;
the last owner alone disposes them, verified by tests.
Desktop and phone browser profiles pass actual intermediate scale/wind samples,
reduced-motion and Low static poses, resume, accepted harvest pop, exact native
save/other-area state, one original interval/canvas, and confirmed dense-save
import with exact prior backup. **64 plants / eight unique plant geometries**
were observed in the actual scene. Eight dense mixed-garden PNGs and receipts
are in `growth/`; unit/full logs include `f3-growth-unit.log`, `f3-final-tests.log`.
Actual desktop/phone dense pixels were inspected. Dense picking, comprehensive
regression and controlled loading remain separate pending acceptance gates.

F4 tall picking accepted: `picking/picking.json` verifies **192 trusted picks**
(24 fully mature corn beds × four headings × desktop/phone), actual first-hit
visible 3D triangles, reachable native harvest controls and exact unchanged saves.
No invisible target proxy. Eight actual all-corn PNGs and empty page/console/
request error arrays are retained. The automated stage/growth/placement/picking
harness gate is accepted. Main checklist is **13/22 (59.1%)** at this checkpoint.

F4 broader checks: 16 bilingual viewport/safe-inset profiles cover all six care
panels; four camera-workspace profiles cover controls/wheel/pan/resize; six
trusted keyboard/mouse/CDP-touch input profiles pass. Visibility profiles pass
real fixed ticks, actual CDP freeze/resume and reduced-motion stop/resume;
`document.hidden` is explicitly simulated for handler coverage, not physical
background-tab hardware proof. All-five native journeys pass **940 UI commands**
(235/profile × desktop/phone × EN/ID), nine days/profile, care/production/sales,
whole-save/RNG/weather/ledger checks after every command and reload. Six-menu
and objective navigation regressions also pass four profiles each. Startup
normal/WebGL-unavailable/retry checks pass eight profiles.
Evidence: `responsive/responsive.json`, `camera/workspace.json`, `input/`,
`visibility/visibility.json`, `regression-v6/`. Main checklist **16/22 (72.7%)**.
Security/CSP/malicious-import checks pass desktop/phone. SEO verifies nine routes
and 15 responsive editorial cases. npm advisory audit reports zero vulnerabilities;
raw output including npm notices and parsed result are retained separately.

F4 data matrix accepted: **21/21 browser profiles** cover original V0–V5
migration/archive bytes, corrupt/future saves, archive/quarantine collision,
no graphics, confirmed/cancelled/invalid import, reset/backup/restore, storage
quota failure and real two-tab pointer races. Whole protected save maps match
the native `SaveSession` oracle. Receipt: `save-protection-final/`.
Earlier V5-only quota expectation failed after legitimate V6 migration; its log
is retained and the corrected entire matrix passed without application changes.

**Owner update: skip browser download tests from now on.** They must be labelled
skipped, never counted as passing or required for routine approval. Serialization,
validation and in-memory roundtrips remain required. Prior completed download
evidence is historical only. New corn/data runners skip downloads by default;
explicit owner reauthorization is required to enable them. Do not use internal-
browser file chooser/download paths that can suspend autonomous execution.
Main checklist is **17/22 (77.3%)**, excluding the initial audit.


## Pre-17:00 WIB handoff

**20/22 accepted (90.9%), local candidate only. No push/deployment occurred.**
Final native suite: **550/550 PASS** after the distant-view optimization and
24-bed/three-crop 90-day save/reload/endurance scenario. Strict typecheck,
client/import/locale audit and focused moving-LOD lifetime/geometry tests pass.
The first dense-render attempt failed the unchanged 30,000 triangle gate at
41,172; closed distant plant variants and subpixel bed posts reduce it to 28,024.
Full close-up geometry and native quantities are retained; shared full/overview
buffers dispose only when their last owner releases them. Final actual 192
mature-corn picks and growth/wind/Low/reduced-motion/harvest-pop profiles pass.

Controlled local desktop cold/warm map: 0.602/0.350s, full art 1.157/0.806s,
60.0 submissions/s, 28,024 triangles, 256 calls, +0.485MiB post-GC heap.
Phone emulation cold/warm map: 4.359/2.973s, full art 8.803/4.659s,
55.7 submissions/s, 23,038 triangles, 189 calls, +0.337MiB heap. Samples are
20 seconds each, local gzip, phone DPR2.75/CPU4x/150ms/200000Bps down.
These are render submissions, not physical Android display FPS. Original
save bytes stay exact during measurement; error/console/request arrays are empty.

Canonical dist now contains the local candidate. **All 246 files match the
accepted isolated artifact byte-for-byte**, with eight emitted modules, twelve
default-core objects and exact Three MIT license. Build receipt raw SHA256:
`98ec95ee922da15ada966b55bbb2c66c4757c3a1c3de1f8fca091108a0cd3aa5`.
`artifact-proof.json` retains the check. Original editorial/media files remain;
only the intentional homepage/game changes were made. Current actual homepage
captures replace the hero/social URLs under new names, retaining older assets.
`GARDEN_HOMEPAGE_CAPTURE.json` records unedited pixels, hashes and provenance.
Homepage passes **24 bilingual surfaces plus three fallback cases**, save
preservation, keyboard/game entry and 24 protected prior-release assets. Final
SEO checks preserve nine routes and 15 editorial layouts with the new social PNG.

Remaining: checklist items **21 and 22** (production preflight/deploy and live verification). The
previous public V5 deployment is not a playable rollback for V6 saves. Before
publishing, prepare/verify a V6-compatible rollback using the native-compatible
corn checkpoint `7503ca9` or a forward fix; never downgrade/reset saves. Owner's
publication authority persists, but the 17:00 WIB stop takes precedence. Resume
only on a new owner instruction at home. Browser download tests stay skipped;
no routine approval/download/file-chooser flow is to be triggered.

### Home resume and V6 rollback preparation

Resumed from clean `ce555ae`; remote main freshly verified as `f2836be`.
The previous stop is superseded by explicit owner resumption. No new deadline
was requested. Download checks remain skipped; no desktop takeover.

Rebuilt checkpoint `7503ca9` from its source into an isolated V6 fallback:
its old tracked V5 dist was not reused. All 148 compared native modules match
current source after EOL normalization. Rehearsal passes desktop EN/phone ID:
192 commands, harvest/sell/buy/replant all 24 corn beds and exact reload/save,
other zones, clock and RNG. The complete 21-profile save-protection matrix
also passes on that fallback, including original-byte migration, future/corrupt
saves, quota/collision handling and true two-tab pointer races. Downloads skipped.
Evidence: `rollback-build.json`, `rollback-v6-rehearsal/`, `rollback-v6-data/`.

Production native bytes/receipt are unchanged from accepted local candidate.
107 working-copy text files had CRLF only; both root and QA copies are now
canonical Git bytes. All 246 files still match and receipt SHA remains `98ec95ee...`.
Existing Cloudflare OAuth refreshed noninteractively. Authenticated provider
inspection confirms GitHub `main`, automatic production/preview deployments,
empty build command/root and `dist` output; no provider settings changed.
Preview rollback publication and primary deployment/live verification remain pending.

Remote main was read-only verified at 16:53 WIB as
`f2836be675bcde489617c8e354d01390be594546`. Nothing was pushed. Both owned
internal-preview ports 59269 and 62193 return ECONNREFUSED at closing check.
Browser QA contexts and task-owned servers close in their finalizers. The
user's browser/profile/save and unrelated preview resources were not taken over.
