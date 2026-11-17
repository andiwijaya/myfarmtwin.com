# Undo reset camera per active area â€” 17 November 2026

The camera toolbar now offers **Undo reset** beside **Reset kamera**. A meaningful reset saves that active area's previous position, orbit target, field of view and zoom. Undo restores that exact pose without changing another area's camera or any farm progress.

## Behavior and storage

- Each exterior, garden, overview, selected entity and building interior has its own latest undo record. An interior and its exterior remain independent.
- The control is disabled until that active area has a valid, useful reset to undo. Consuming the record disables it again. It is one reset undo per area.
- Repeating reset while already at the default pose preserves the useful earlier record.
- Pending undo survives navigation, refresh and actual tab close/reopen. A consumed record stays consumed.
- Storage events reconcile tabs. A newer record supersedes an older one; compare-and-set consumption plus a persisted tombstone prevents an old tab from reviving consumed undo.
- A moved or deleted subject invalidates its old context. Malformed or oversized optional preferences are ignored. Unavailable/quota-limited storage retains an in-session fallback.
- Reset and undo finish pending transitions and drain control inertia before applying a pose. Both synchronously save the active camera; only matching history entries are updated.
- The farm save, toolbar preference and other area's camera keys are unchanged by undo.

The new helper is `game/client/cozy-camera-reset-undo.js`. Integration is in `cozy-world.js` and `cozy-app.js`; the button and responsive layout are in `game/client/cozy/index.html` and `style.css`. Reset, Undo and Arrange share one compact row on phones, below the 3D canvas.

## Local verification

- Typecheck passed.
- All 33 camera checks passed: the 23 existing preference/reset checks plus 10 undo-specific cases. New cases cover exact scoped restoration and one-time consumption, independent areas, repeated default resets, fresh instances, interior projection, moved/deleted anchors, denied/quota storage, newer remote records, malformed input, tombstones and failed-consumption dirty-write protection.
- Build passed with entry `app-GZX3LKFS.js`, 934,172 total emitted bytes.
- All four delivery/header checks passed after final preview cleanup and rebuild.

These camera tests use the actual world methods and Three.js camera with in-memory storage and a minimal controls fixture. They do not launch another browser.

## Internal-browser preview acceptance

Candidate source `636af02b14b982ed83ae69c9d350d1754c396c0d` was tested at the explicitly authorized official-domain `/play/reset-camera-preview/` route. During staging, all 36 primary runtime/source/receipt files remained identical to baseline `92d025089809fa21a41412644ce16d2728f5d6fe`; the primary entry remained `app-TM5TBGTL.js`. Staging production check `133789962550` succeeded, deployment `23c17b3a-df17-4141-a77e-d2e95700059b`.

All recorded candidate checks passed:

- Initially disabled; meaningful reset enables Undo; repeated default reset keeps its useful undo.
- Exact garden position, target, FOV and zoom restored by native Enter; other cow-area camera remains exact.
- Pending undo survives refresh and actual tab close/reopen; consumed undo remains disabled after refresh.
- Existing market interior restores its exact independent pose and context; its exterior remains exact. English control/status feedback and keyboard activation work; Indonesian locale restored.
- Garden and interior keep independent pending records, and consuming either leaves the other available.
- A second tab consumes undo and closes immediately; the older tab disables its control, and a reopened tab retains the restored camera without resurrecting undo.
- Measured 320Ã—844 and 390Ã—844 phone viewports keep all three action buttons on one row at 46.67px height, with fitting labels, no overlap or horizontal overflow, and the toolbar below the canvas.
- Measured 1280Ã—720 desktop keeps the toolbar below the canvas, fitting labels and no overlap or overflow. No candidate console errors were observed.
- The complete farm export remains byte-identical to the pre-test in-memory comparator.
- Candidate integrity passes all 30 resources, including 22 GLBs, with SHA-256, byte-count and MIME verification.

Only camera controls, navigation, language and toolbar presentation were exercised. No clock, starter, purchase, planting, moving, import, clipboard or download action occurred. No raw player save was written to disk or the repository. The existing market supplied the actual interior journey because livestock areas were unstarted. Phone tests are viewport emulation; physical devices, full browser-process restart and native drag/pinch are outside the observed evidence.

Preview evidence is under `qa-artifacts/cozy-undo-reset-20261117/`: `preview-browser.json`, `preview-integrity.json`, `preview-phone-undo-available.jpg`, `preview-desktop.jpg` and `staging-safety-proof.json`. Camera comparisons use tolerance 0.001 for geometry/projection and exact context, excluding gesture timestamps. The original collapsed toolbar choice and whole-farm context were restored after testing; owned preview tabs were closed and viewport overrides reset.

## Final-build parity and artifact

The final build receipt is identical to the tested candidate. All emitted bytes match, and HTML is exact after changing only the candidate asset URL prefix. No source implementation changed after candidate acceptance. The temporary preview route, cache rules and Git attributes were removed before primary activation.

Archive: `myfarmtwin-camera-undo-reset-20261117.tar.gz`, 18,396,681 bytes, SHA-256 `7535dbc651e5fb2d44285adf6c5a9998973dc405fa79820fcf1ebdd6dad7db4d`. All 303 regular dist files match exactly; one normalized official hosting metadata file makes 304 verified archive files. No temporary preview, QA/player data, symlinks or unsafe paths are included. Evidence: `promotion-parity.json` and `artifact.json` in the same QA directory.

## Production acceptance

Application source `2fa8b45600005968daedf25a3ec56cad03223b14` is active on `main`. Cloudflare production deployment `86348d21-2e7f-4778-979f-3d2357c97941` reached completed/success under native GitHub check `133795538610`. The canonical `/play/` page loads `app-GZX3LKFS.js`; this production receipt is separate from the branch preview.

All 13 canonical production acceptance checks passed. The exact pre-reset garden position, target, FOV and zoom restore with native Enter; the control disables after consumption. Pending undo survives refresh and actual tab close/reopen, and consumed undo remains consumed after another refresh. The independently remembered cow-area camera stays exact, has no unrelated undo, and the garden's restored pose remains exact on revisit.

Measured desktop 1280×720 and phone 390×844 layouts keep the toolbar below the canvas, fitting labels and no button overlap or horizontal overflow. The phone Reset, Undo and Arrange controls share one row at 46.67px height. The complete farm export remains byte-identical to the original in-memory comparator. Current production warnings/errors are zero. The canonical `/play/integrity/` check passes SHA-256, byte count and MIME for all 30 resources, including 22 GLBs.

Actual production captures are `qa-artifacts/cozy-undo-reset-20261117/production-phone-undo-available.jpg` and `production-desktop-undo-available.jpg`. Machine-readable local evidence is `production-browser.json`, `production-integrity.json` and `production-deployment.json`. Phone evidence uses viewport emulation. The original collapsed toolbar and whole-farm context were restored, viewport overrides reset, and the canonical game tab retained as the deliverable. No farm actions or raw-player-data fixture were introduced.

The companion JSON contains the final acceptance and deployment receipts. Documentation-only commits after application activation do not change its live bundle.

## Checklist

- [x] Implement independent, validated and durable undo records.
- [x] Add an accessible button and compact phone/desktop toolbar layout.
- [x] Pass typecheck, 33 camera checks, build and four delivery checks.
- [x] Complete internal-browser candidate acceptance without changing farm progress.
- [x] Reproduce the tested bytes, remove temporary preview and verify the archive.
- [x] Activate the tested primary application and confirm production deployment success.
- [x] Test canonical production in the internal browser and capture actual screenshots.
