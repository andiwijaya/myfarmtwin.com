# Redo reset camera per active area — 17 November 2026

The below-canvas toolbar now includes **Redo reset** beside Reset and Undo. After Undo, Redo reapplies that area's recorded reset pose. Undo becomes available again, allowing the same reset/undo pair to alternate without changing another area's camera or farm progress.

## Behavior and implementation

- Each area, selected object and interior retains its own most recent reset pair. Exterior and interior records are independent.
- Redo is disabled until a valid reset has been undone. After Redo it disables, and Undo enables again.
- Pending Redo and the resulting camera persist through navigation, refresh and actual tab close/reopen.
- A fresh reset replaces only the active area's pair. Repeating reset at its default pose preserves useful Undo; an explicit reset after Undo ends the pending Redo state, including when the camera was manually returned to its default.
- Version 2 records store before/reset snapshots and a reset/undone state under the existing per-area UI key. Version 1 pending Undo and consumed tombstones remain readable. A legacy Undo upgrades only when used; because old records lack a reset snapshot, its Redo computes the default for that same valid view.
- Record writes advance a monotonic gesture time and check the expected stored value for Undo/Redo. Storage events reconcile tabs. Older records cannot replace a newer observed state; unavailable optional storage keeps an in-session fallback.
- Validated coordinates, projections, record shape, subject and building anchors prevent restoring a corrupt or obsolete view. Moved/deleted anchors disable Redo. Neither action writes farm-domain data.
- Reset/Undo/Redo finish pending transitions, drain control inertia and synchronously save the active camera. Only matching history entries change.

Source changes are in `game/client/cozy-camera-reset-undo.js`, `cozy-world.js`, `cozy-app.js`, `cozy/index.html` and `cozy/style.css`. Four compact action buttons share one phone row, with at least 44px targets and the toolbar remaining below the canvas. Existing collapse/expand behavior is retained. Original UTF-8 locale strings are preserved.

## Local verification

- Typecheck passed.
- All 45 camera tests passed, including 12 new Redo cases: exact repeated cycles; separate area records; fresh-world persistence; interior projection/exterior/history independence; new-reset branching; legacy compatibility; moved/deleted anchors; denied/quota storage; newer remote state; invalid schemas; readiness/failed-write cleanup; and transition/inertia handling.
- Final build: `app-DY5IBTMK.js`, 936,451 total emitted entry/chunk bytes.
- Four delivery/header tests passed again after final preview cleanup and rebuild.

Camera tests use the actual world methods and Three.js camera with synthetic in-memory storage and minimal controls, without launching another browser.

## Internal-browser preview acceptance

The user explicitly authorized the official-domain `/play/reset-camera-preview/` route before browser testing. The corrected candidate source is `e965cafdfbf37d6b07fcd27753e81a449e5b98a4`; staging production check `133804658834` succeeded, deployment `6bbaefeb-57a7-442b-b1d9-b7ecafd19293`.

All 37 primary runtime/source/receipt blobs remain identical to baseline `2fa8b45600005968daedf25a3ec56cad03223b14` during staging. Direct GitHub resource comparisons also confirm unchanged primary pointers and asset trees. The observed canonical primary entry remained `app-GZX3LKFS.js`, with no Redo control. Only the isolated preview used the new entry.

All 33 recorded candidate browser checks passed, with additional measured layout checks:

- Meaningful Reset enables Undo while Redo stays disabled; repeating the default Reset retains the useful original Undo.
- Undo enables Redo; Redo restores the exact reset position, target, FOV and zoom. Undo after Redo restores the exact original pose. Native Enter activation and English status text work; the original Indonesian locale is restored.
- Pending Redo survives refresh, area revisit and actual tab close/reopen. The post-Redo availability state also persists through refresh.
- The independently remembered cow-area camera remains exact; it has no unrelated Redo. It remains exact at the end of the complete journey.
- Existing market interior Undo/Redo preserves exact poses and interior context. Its exterior remains exact and has no interior Redo. Garden Redo remains pending after consuming interior Redo, then independently restores its own reset.
- Redo in one tab disables the older tab's Redo. After that older tab closes and reopens, the latest reset camera remains exact with Redo disabled.
- A new Reset after Undo clears the old Redo and retains the latest pre-reset pose for Undo.
- Measured 1280×720 desktop and 320×844/390×844 phone viewports keep all four actions in one row, fitting labels, no overlap or horizontal overflow, and the toolbar below the canvas. The 320px phone is also measured in English. Targets are 45.33px high at 320px, 46.67px at 390px, and at least 44px on desktop.
- UTF-8 gesture labels render correctly. Candidate warnings/errors are zero.
- The complete farm export remains byte-identical to the original in-memory comparator. Candidate integrity passes SHA-256, byte count and MIME for all 30 resources, including 22 GLBs.

Only internal-browser camera/navigation, toolbar and language controls were used. No farm clock, starter, purchase, planting, moving, import, clipboard or download action occurred. Raw player bytes remain in memory only. The existing market supplies the actual interior journey because livestock areas are unstarted. Phone checks use viewport emulation; physical devices, a full browser-process restart and native pointer drag/pinch were not exercised.

Evidence is in `qa-artifacts/cozy-redo-reset-20261117/`: `preview-browser.json`, `preview-integrity.json`, `staging-safety-proof.json`, `immutable-staging-proof.json`, `remote-staging-safety-proof.json`, `preview-phone-redo-available.jpg`, `preview-desktop-redo-available.jpg` and `preview-desktop-interior-redo.jpg`. Geometry/projection comparisons use tolerance 0.001 with exact view IDs, excluding gesture timestamps. Original whole-farm context and collapsed toolbar are restored; temporary viewport overrides and owned preview tabs are cleaned up.

## Final-build parity and archive

The final receipt and emitted bytes match the observed candidate exactly. HTML is identical after changing only the candidate asset prefix. No source implementation changed after acceptance. Temporary preview files, header rules and Git attributes are removed before primary activation.

Archive `myfarmtwin-camera-redo-reset-20261117.tar.gz`: 18,397,606 bytes, SHA-256 `cc0289dbefb7c31672a744d2a5199ad9b498b8ff61ff2bd756d8cb7b38a3c398`. All 303 regular dist files match exactly; one normalized official hosting metadata file makes 304 verified archive files. No preview, QA/player data, symlinks or unsafe paths are included. Proofs: `promotion-parity.json` and `artifact.json`.

## Production acceptance

Primary activation and canonical production browser verification are pending in this release-preparation snapshot. The companion JSON will receive the final source, deployment and browser receipts.

## Checklist

- [x] Implement durable, validated Redo per active area and legacy Undo compatibility.
- [x] Add accessible bilingual controls while preserving the compact below-canvas toolbar.
- [x] Pass typecheck, 45 camera tests, build and four delivery checks.
- [x] Complete 33 internal-browser preview checks plus phone/desktop layout and resource integrity.
- [x] Reproduce the tested bytes, remove the temporary preview and verify the archive.
- [ ] Activate the tested primary application and confirm production deployment success.
- [ ] Test canonical production in the internal browser and capture actual screenshots.
