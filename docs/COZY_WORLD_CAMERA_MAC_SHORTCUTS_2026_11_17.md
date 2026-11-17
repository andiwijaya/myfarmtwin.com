# Mac camera reset shortcuts — 17 November 2026

Cmd+Z invokes Undo reset and Cmd+Shift+Z invokes Redo reset for the active camera area. They share the existing toolbar actions and per-area reset pair with Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z. The implementation does not add farm commands or storage keys.

The dispatcher accepts exactly one of Ctrl or Meta, rejects Alt and unsupported combinations, and leaves Cmd+Y unhandled. Existing guards for editing, dialogs, placement, composition, repeats and previously handled events still apply. Native defaults are prevented only after an available action succeeds. Button shortcut metadata and bilingual tooltips include the Cmd aliases without changing visible labels or toolbar dimensions.

## Completed local checks

- Typecheck passed.
- All 54 camera tests passed, including three new Mac integrations using actual world commands and camera projection. They cover area/farm byte isolation, interiors, Ctrl interoperability, safe editing and modifiers, unavailable history in another area, readiness and failed commands.
- Build `app-D22JK6D3.js` emitted 937,181 JavaScript entry/chunk bytes.
- Four delivery/header tests passed.

## Official preview acceptance

Preview source is `6010f5810aeee6b0b3735bd23c589bf197633855` on `codex/glb-prototype-20261115`. It adds the isolated `/play/reset-camera-preview/` candidate and preview-only headers/attributes. All 274 existing primary `dist/play` Git blobs remain identical to active baseline `a70576dd0f05e2fd39f756d87eee39a0fc8a16b7`; only ten preview paths are added under `dist/play`. Implementation source is present but is not activated in the canonical page.

The internal browser could not reach the local preview. The CLI readiness path was stopped after automatic approval review rejected testing outside the internal browser. The user explicitly authorized official preview staging after automatic review required specific approval for the pre-test `main` update. Cloudflare production staging succeeded: check `133847361049`, deployment `ccbc9044-5d9e-46e8-bc01-dbdd4fb960de`. Primary activation follows candidate acceptance.

All 36 recorded preview checks passed in the Codex internal browser:

- Real Meta+Z and Meta+Shift+Z key events restore exact garden before/reset poses while the toolbar is collapsed. Ctrl+Y and Ctrl+Z/Ctrl+Shift+Z remain interoperable with the same history pair.
- Cmd+Y, mixed Ctrl+Cmd and unavailable Redo remain unhandled. Select focus, textarea focus and an open dialog's close-button focus leave camera history pending. Both Cmd directions are exercised in the textarea. Native Ctrl text Undo/Redo still work, and Cmd camera Redo resumes after the dialog closes.
- Pending Redo survives refresh. English feedback and shortcut metadata/tooltips are correct; the original Indonesian locale is retained afterward.
- Garden and cow-area reset pairs remain independent across navigation. Interior Cmd Undo/Redo restore exact position, target, FOV, zoom and room context; the exterior retains its independent camera.
- Measured desktop 1280×720 and phone 390×844 layouts keep labels within buttons, targets at least 44px, no overlap/horizontal overflow and the toolbar below the canvas. Cmd event handling also passes at the phone viewport.
- Farm exports remain byte-identical to the original in-memory comparator. Current warnings/errors are empty. SHA-256, byte count and MIME checks pass all 30 release resources, including 22 GLBs.

An initial original-camera comparison used the renderer's asynchronous diagnostic sample and differed on restoration. The retained canonical tab was not navigated during candidate testing. A synchronous Reset/Undo snapshot on that tab supplies the final restoration comparator; the preview restores it exactly through the shared pair. Initial and corrected poses are retained in `preview-oracle-note.json`. No source change was needed for this test-oracle correction.

Meta-key events are exercised through the internal browser, not a physical Mac or Safari. Phone evidence uses viewport emulation. Editing fixtures additionally assert that blocked shortcuts do not prevent native defaults; native Cmd text editing on macOS is not claimed as physical-device evidence. No gameplay, import, clipboard, upload or download test is performed. Farm exports stay in memory.

Evidence is under `qa-artifacts/cozy-camera-mac-20261117/`: local/staging proofs, frozen candidate bytes, `preview-browser.json`, `preview-integrity.json`, `preview-oracle-note.json`, `preview-desktop-cmd.jpg` and `preview-phone-cmd.jpg`. Raw player saves are not written to evidence files. The owned local server has stopped. The preview and integrity tabs are closed after restoring the original whole-farm context, toolbar and locale; the canonical tab is retained.

## Production package

The final rebuild reproduces the tested build receipt, HTML and emitted file bytes exactly. Candidate HTML differs only in its preview asset prefix. Source code is unchanged since acceptance. Temporary preview files, header rules and Git attributes are removed, and four delivery/header tests pass again.

The official package helper produced `myfarmtwin-camera-mac-20261117.tar.gz`. All 304 regular dist files match the checkout exactly; one normalized hosting metadata file makes 305 regular archive files. Safe paths and file kinds are checked without extracting the archive. No QA/player data, preview files or symlinks are included. Size, SHA-256 and parity evidence are in the companion JSON, `artifact.json` and `promotion-parity.json`.

## Production acceptance

Application source `8587c4a1774a58e3d04e8fa0f3fff1117f55274f` is active on `main`. Cloudflare production deployment `5822c135-fb26-483e-a608-260a33648146` completed successfully under native GitHub check `133849945445`, independently of the branch preview. The canonical `/play/` page loads `app-D22JK6D3.js` with the Cmd aliases in shortcut metadata and tooltips.

All 37 recorded production browser checks passed:

- Real Meta+Z and Meta+Shift+Z events restore exact before/reset garden cameras with the toolbar collapsed. Unavailable Cmd Redo, Cmd+Y and mixed Ctrl+Cmd remain ignored. Ctrl+Y and Ctrl+Z/Ctrl+Shift+Z interoperate with the same pair.
- Both Cmd directions preserve pending camera Redo while typing in a textarea. Focused selects and a dialog's close button also block camera history. Native Ctrl text Undo/Redo still work. Cmd camera Redo resumes after closing the dialog.
- Pending Redo survives refresh and Cmd+Shift+Z reapplies the exact reset. Cow-area reset and before poses remain exact while the garden retains its independent history. Interior Cmd Undo/Redo restore exact geometry and room context without changing the exterior.
- Explicit 1280×720 desktop and 390×844 phone viewport measurements retain fitting labels, targets of at least 44px, no overlap/horizontal overflow and the toolbar below the canvas. Cmd event handling passes at the phone viewport too.
- Full farm exports remain byte-identical to the original in-memory comparator. Current warning/error logs are empty. Canonical `/play/integrity/` passes SHA-256, byte counts and MIME for 30 resources, including 22 GLBs.

The original canonical whole-farm camera is synchronously captured through its reset pair before reload. After clearing the temporary viewport override, that same untouched overview pair restores the original pose exactly. Toolbar and locale preferences are restored, owned test tabs are closed and the original canonical tab remains open. Desktop screenshots are recaptured after explicitly setting and measuring the desktop viewport; the default panel size is not used as desktop evidence.

The browser tests exercise Meta/Cmd key events inside the internal browser. A physical Mac, Safari and native macOS text editing were not tested. Editing fixtures cover native-default preservation while blocked, and the actual browser confirms no camera movement/history consumption in those contexts. Phone evidence uses viewport emulation. No gameplay or import is performed, and raw farm saves are not stored in evidence files.

Actual production captures are `qa-artifacts/cozy-camera-mac-20261117/production-desktop-cmd.jpg` and `production-phone-cmd.jpg`. The final browser, integrity and deployment JSON receipts are in the same directory and incorporated in the companion release JSON. An evidence-only documentation commit after activation does not alter the deployed runtime.

## Checklist

- [x] Add Cmd aliases using the guarded active-area dispatcher.
- [x] Preserve Ctrl aliases and editable-context protections.
- [x] Pass typecheck, 54 camera tests, build and four delivery tests.
- [x] Freeze the candidate and prove the primary files unchanged.
- [x] Obtain the required authorization to expose the official preview.
- [x] Complete internal-browser candidate acceptance.
- [x] Reproduce tested bytes and verify the official package.
- [x] Activate production and confirm deployment success.
- [x] Test canonical production and complete the release receipts.
