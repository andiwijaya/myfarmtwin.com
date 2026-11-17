# Active-area camera reset keyboard shortcuts — 17 November 2026

**Ctrl+Z** invokes Undo reset and **Ctrl+Y** invokes Redo reset for the current camera area. They use the same active-area commands, view reflection and localized feedback as the existing toolbar buttons, including when the toolbar is collapsed. Other camera areas and farm progression are outside these commands.

## Keyboard behavior

- Commands run only when the matching active-area Undo/Redo is available. A missing record does not fall back to another area's history.
- Native behavior is prevented only after an available command succeeds. Failed or unavailable commands retain the browser's normal behavior.
- Input, textarea, select, editable content, custom text/combobox/spinbutton roles and document editing contexts are excluded. Open dialogs and an active placement editor also block camera shortcuts.
- Already handled events, held-key repeats and IME composition are ignored. Only plain Ctrl+Z/Ctrl+Y are handled; extra Alt/Meta/Shift modifiers are left alone. Caps Lock is accepted.
- Buttons advertise `Control+Z` and `Control+Y` through `aria-keyshortcuts`, with bilingual Ctrl shortcut tooltips. No stylesheet or toolbar geometry change is needed.
- Existing per-area camera persistence and reset-pair validation remain authoritative. No new save keys or farm commands are introduced.

`game/client/cozy-camera-shortcuts.js` contains the guarded dispatcher. `cozy-app.js` shares the history action between toolbar and key handling, computes editing/modal/placement context, and wires the availability checks. `cozy/index.html` supplies the accessibility metadata and tooltips.

## Local checks

- Typecheck passed.
- All 49 camera tests passed, including four new shortcut integrations: real garden commands preserving other camera/farm bytes; interior projection and exterior independence with Caps Lock; editing/modifier/repeat/composition guards; and unavailable/failed/readiness behavior preserving native defaults.
- Final build: `app-637GUJQ7.js`, 937,142 total emitted entry/chunk bytes.
- Four delivery/header tests passed again after final preview removal and rebuild.

The integration tests use the actual world methods and Three.js camera with in-memory storage. They do not launch a separate browser.

## Internal-browser preview acceptance

Candidate source `64e38469999bf89172d017403b694aa266332e02` was tested at the previously authorized official-domain `/play/reset-camera-preview/` route. Production staging check `133817126681` succeeded for deployment `581b1072-7b42-48db-a618-5e60cef8145f`.

All 37 protected primary blobs remain identical to baseline `aec302903c20094ce72003e578a1f6b8075a9b20`. Direct GitHub comparisons additionally verify 212 existing primary file/asset-tree entries. The observed canonical page still used `app-DY5IBTMK.js` and had no keyboard shortcut metadata during staging. Primary feature activation follows candidate acceptance.

All 39 recorded candidate checks passed in the final controlled acceptance:

- Native Ctrl+Z/Ctrl+Y restore exact garden before/reset position, target, FOV and zoom with the toolbar collapsed. Availability follows the action, and the toolbar stays collapsed.
- Plain Z/Y and Ctrl+Shift+Z do not trigger camera history. A second unavailable Undo or Redo is ignored.
- Focused quality/language selects preserve the camera. Synthetic text in the backup textarea keeps native text Undo and Redo while leaving the camera unchanged. Both camera-Undo-available and camera-Redo-available contexts are checked. A focused modal close button also blocks camera Undo. No import is invoked.
- Shortcuts resume after closing the dialog, produce English feedback, and retain Indonesian locale afterward.
- Pending Redo survives refresh and works through Ctrl+Y; a real tab close/reopen retains a working Ctrl+Z and the exact original pose.
- The cow-area camera remains exact, and an unavailable history in that area cannot use the garden record.
- Interior Ctrl+Z/Ctrl+Y restore exact poses and retain interior context. A controlled repeated reset/shortcut/navigation sequence preserves the exterior exactly. Returning to the garden retains its own exact Undo/Redo pair.
- Measured 1280×720 desktop and 320×844/390×844 phone layouts retain fitting labels, no overlap or horizontal overflow, targets at least 44px and the toolbar below the canvas.
- Tooltips and accessible shortcut metadata are correct; UTF-8 labels render correctly. Current candidate warning/error logs are empty.
- The full farm export stays byte-identical to the original in-memory comparator. SHA-256, byte-count and MIME checks pass 30 resources, including 22 GLBs.

An initial exterior comparison differed while multiple historical same-origin game tabs were open. Two idle, paused test tabs running the old reset and Undo builds were closed after checking that no dialog was open; the active canonical tab was retained. The same sequence was repeated without a source change and preserved the exterior exactly. Older-tab interference is an inference, not a proven browser-level cause. The initial mismatch, observed poses and successful controlled repeat are retained in `browser-diagnostics.json`; the successful repeat and real-command per-area unit tests are the acceptance evidence.

All interaction used the internal browser. Only short synthetic text was typed in the backup textarea; it was never imported. No farm clock, starter, purchase, planting, moving, clipboard, upload or download operation occurred, and no raw player save was written to disk. Actual interiors use the existing market because livestock areas are unstarted. Phone tests use viewport emulation. Held-key repeat and IME guards are covered by code fixtures, rather than physical keyboard/IME testing.

Evidence under `qa-artifacts/cozy-camera-shortcuts-20261117/`: `preview-browser.json`, `preview-integrity.json`, `browser-diagnostics.json`, staging safety proofs, `preview-desktop-ctrl-z.jpg` and `preview-phone-ctrl-z.jpg`. Geometry/projection comparisons use tolerance 0.001 with exact view IDs, excluding timestamps. The original whole-farm context, collapsed toolbar and locale are restored; owned preview/comparator tabs are closed, leaving the canonical tab.

## Reproducible production package

The final build receipt and emitted bytes match the tested candidate exactly. HTML is identical after changing only the preview asset prefix. Source implementation is unchanged after acceptance. Temporary preview files, header rules and Git attributes are removed.

Archive `myfarmtwin-camera-shortcuts-20261117.tar.gz`: 18,397,128 bytes, SHA-256 `1a9f7dd9f203cdbbdb67d6c25f780a2eea6babf32ef19f181e6a32addeae1403`. All 304 regular dist files match exactly; one normalized official hosting metadata file makes 305 verified archive files. No preview, QA/player data, symlink or unsafe path is included. Proofs: `promotion-parity.json` and `artifact.json`.

## Production acceptance

Primary activation and canonical production browser checks are pending in this release-preparation snapshot. The machine-readable companion will receive the final source, deployment and browser receipts.

## Checklist

- [x] Implement active-area shortcuts using the shared toolbar actions.
- [x] Preserve native editing, dialog/placement safety and unavailable-command behavior.
- [x] Add accessible shortcut metadata without expanding the toolbar.
- [x] Pass typecheck, 49 camera checks, build and four delivery checks.
- [x] Complete internal-browser candidate acceptance and record the controlled repeat.
- [x] Reproduce tested bytes, remove the preview and verify the archive.
- [ ] Activate the tested application and confirm production deployment success.
- [ ] Verify shortcuts on canonical production, capture screenshots and complete receipts.
