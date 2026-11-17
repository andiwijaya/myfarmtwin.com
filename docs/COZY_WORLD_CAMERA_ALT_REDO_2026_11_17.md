# Ctrl+Shift+Z for active-area camera redo — 17 November 2026

**Ctrl+Shift+Z** now invokes the same active-area Redo reset action as **Ctrl+Y**. **Ctrl+Z** continues to Undo reset. Position, target, FOV and zoom are restored from the active area's existing validated reset pair, including inside buildings and while the toolbar is collapsed.

## Behavior and scope

- The shared keyboard dispatcher accepts Ctrl+Shift+Z alongside plain Ctrl+Y. Ctrl+Shift+Y remains ignored. No new camera storage or farm commands are introduced.
- Redo must be available in the active area. No history from another area is used. Native behavior is prevented only after an available command succeeds.
- Existing guards cover text inputs, textareas, selects, editable content, custom editing roles, dialogs and placement mode. Already handled events, held-key repeats, composition, and Alt/Meta combinations remain ignored.
- The Redo button advertises `Control+Y Control+Shift+Z` through `aria-keyshortcuts` and a bilingual tooltip. Visible labels and toolbar geometry are unchanged.

The implementation changes `game/client/cozy-camera-shortcuts.js` and `game/client/cozy/index.html`. Two integration cases in `game/tests/cozy-world-area-camera.test.mjs` exercise real world camera commands, active-area isolation, compatibility with Ctrl+Y and the editing/modifier/unavailable guards.

## Local verification

- Typecheck passed.
- All 51 camera tests passed, including the two alternate-redo cases.
- Production build: `app-KR6MZTXW.js`; 937,164 total emitted JavaScript entry/chunk bytes.
- Four delivery/header tests passed, including again after preview removal and the final rebuild.

These tests use the actual world methods and Three.js camera with in-memory storage. They do not launch another browser.

## Internal-browser preview acceptance

Candidate `c926f3d50d4417847381ac91fd62421e23b8c422` was tested on the explicitly authorized official-domain `/play/reset-camera-preview/` route. Cloudflare production staging completed successfully: check `133834142294`, deployment `0c08f464-8a8c-4213-9d83-68adf746ef2d`.

All 38 protected primary files remained byte-identical to baseline `0c53073c4cbe8ceb5dcbbc31825a40819dffb1ae` before acceptance. Native remote tree comparisons also verified 213 existing primary file/asset-tree entries. The canonical page continued to load `app-637GUJQ7.js` with only `Control+Y` Redo metadata during staging.

All 31 recorded preview checks passed:

- Ctrl+Z restores the exact pre-reset garden camera; Ctrl+Shift+Z reapplies the exact reset. The toolbar remains collapsed, and Ctrl+Y still performs the same Redo action.
- Ctrl+Shift+Y and unavailable Redo are ignored. Focused quality selects and open dialogs leave the camera alone.
- Native text Undo and Ctrl+Shift+Z text Redo work on short synthetic textarea text while camera Redo is available. Camera history remains pending; it resumes after closing the dialog.
- Pending Redo survives refresh and works through Ctrl+Shift+Z. English feedback is correct and Indonesian locale is restored afterward.
- Garden and cow-area reset pairs remain independent across navigation. Applying garden Redo leaves the cow area's own reset and pre-reset geometry exact.
- Interior Ctrl+Z/Ctrl+Shift+Z restore exact geometry and retain interior context. The corresponding exterior retains its exact independent pre-reset pose.
- Measured 1280×720 desktop and 390×844 phone layouts keep labels within their buttons, avoid overlap and horizontal overflow, retain targets of at least 44px and place the toolbar below the canvas. The alternate shortcut also works at the phone viewport.
- Full farm exports remain byte-identical to the original in-memory comparator. Current warning/error logs are empty. Release integrity passes byte counts, SHA-256 and MIME for 30 resources, including 22 GLBs.

The renderer publishes diagnostic camera state on its frame cadence. Early navigation samples could contain an intermediate pose. Final area comparisons use the same stored reset pair through synchronous Reset/Undo/Redo snapshots; no source modification was needed. An initial interior zoom expectation also exceeded the existing room bound; the actual clamped pose was captured before reset and compared exactly on Undo. These are test-oracle corrections, not application failures.

All interactive testing uses the Codex internal browser. No gameplay clock, starter, purchase, planting, moving, import, clipboard, upload or download action was used. Raw farm data stays in memory and is not written to evidence files. The existing market provides an interior without starting livestock gameplay. Phone evidence uses viewport emulation; modifier/repeat/composition fixtures do not claim physical keyboard or IME testing.

Preview artifacts are under `qa-artifacts/cozy-redo-alt-shortcut-20261117/`: `preview-browser.json`, `preview-integrity.json`, safety proofs, `preview-desktop-alt-redo.jpg` and `preview-phone-alt-redo.jpg`. Pose comparisons use tolerance 0.001 with exact view IDs, excluding timestamps. The original whole-farm pose, toolbar choice and locale are restored; owned test tabs close while the original canonical tab remains.

## Production package

The final build receipt, HTML and emitted bytes match the tested candidate exactly. Only the preview asset prefix differs in candidate HTML. Source code is unchanged after acceptance. Temporary preview files, headers and Git attributes are removed.

The official package helper produced `myfarmtwin-camera-alt-redo-20261117.tar.gz`. All 304 regular dist files match the checkout exactly; one normalized hosting metadata file makes 305 regular archive files. Paths and file kinds were validated without extracting the archive. No temporary preview, QA/player data or symlink is included. Exact archive size/hash and parity checks are in the companion JSON, `artifact.json` and `promotion-parity.json`.

## Production acceptance

Activation and canonical production browser verification are pending. This section and the companion JSON will be updated from the actual deployment and internal-browser receipts.

## Checklist

- [x] Add Ctrl+Shift+Z through the existing guarded active-area dispatcher.
- [x] Preserve Ctrl+Y, native editing and area isolation.
- [x] Advertise both Redo shortcuts without changing toolbar size.
- [x] Pass typecheck, 51 camera tests, build and four delivery checks.
- [x] Complete internal-browser preview acceptance and integrity checks.
- [x] Reproduce the tested bytes and verify the official package.
- [ ] Activate production and confirm Cloudflare success.
- [ ] Verify the canonical page in the internal browser and record final receipts.
