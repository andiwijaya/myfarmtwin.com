# Device-specific camera shortcut hints — 17 November 2026

The Undo/Redo tooltip and accessible shortcut hint show Cmd on Mac and Ctrl on Windows/Linux. Tooltips use the currently selected Indonesian or English language, removing duplicated bilingual text and the other platform's aliases. Visible labels and stylesheet bytes remain unchanged.

`cameraResetShortcutHints` prefers `navigator.userAgentData.platform`, falls back to `navigator.platform` for browsers such as Safari, and uses a desktop Macintosh user-agent only when platform data is absent. Unknown platforms use Ctrl. `translate()` refreshes hints at startup and after a language change. Static loading-state buttons have a short action title until the platform-specific hints are applied.

The keyboard dispatcher is byte-identical to the previous release. Ctrl and Cmd actions, active-area history and editing protections remain unchanged. This is presentation-only work and introduces no camera/farm storage key, device tracking or network request.

## Completed checks

- Typecheck passed.
- All 54 existing camera regression tests passed.
- Four delivery/header tests passed.
- Build `app-6BFFCBNV.js` emitted 937,849 JavaScript entry/chunk bytes.
- Source and emitted CSS plus visible Undo/Redo labels are unchanged.

## Preview preparation

Candidate source `3c2864e2e24c44a6fbeb8a693021c03d36596263` is published on `codex/glb-prototype-20261115`. All 274 existing primary `dist/play` Git blobs remain identical to production source `8587c4a1774a58e3d04e8fa0f3fff1117f55274f`. Only 14 isolated preview paths are added under `/play/reset-camera-preview/`.

The preview includes a read-only `shortcut-hints/` page that imports the exact production formatter source and renders six explicit platform contexts: current Mac/Windows platform API, legacy Linux platform, Safari Mac platform, Macintosh user-agent fallback and unknown-platform Ctrl fallback. This allows both platform families and both languages to be verified in the internal browser without changing its navigator or editing farm data. The fixture is excluded from the final production package.

The user explicitly authorized this official preview after automatic review required specific approval for pre-test `main` staging. Cloudflare staging succeeded under check `133854311218`, deployment `a4810d60-2415-47a2-84d7-c72bd3f18713`. No alternate publishing path was used to bypass the gate. No new CLI HTTP or external-browser test was attempted.

## Internal-browser acceptance

All 12 fixture scenarios passed: six platform contexts in Indonesian and English, each checking both titles, accessible shortcut metadata, visible labels and the rendered hint text. The fixture imports source bytes identical to the production formatter; it does not override navigator. These are explicit platform fixtures, not physical Mac/Safari tests.

All 25 candidate game checks passed. The actual internal-browser device family renders only Ctrl hints, changes to English on language selection and returns to Indonesian. Both titles are shorter than the previous duplicated bilingual/all-platform hints. Hints persist after refresh. Ctrl+Z/Ctrl+Y, Ctrl+Shift+Z and Cmd aliases retain the same exact camera history while collapsed, and the typing guard leaves camera Redo pending.

The widths, heights and visible labels of all four toolbar action buttons match the previous live version within 0.01 CSS pixel at both 1280×720 and 390×844. The toolbar remains below the canvas with no overlap or horizontal overflow. Language changes leave the camera unchanged. Farm exports remain byte-identical to the original in-memory comparator, current warning/error logs are empty, and SHA-256/byte-count/MIME integrity passes 30 resources including 22 GLBs.

The initial metadata comparison used JSON serialization and encountered object property-order differences despite matching field values. The final check compares title, shortcut metadata and label fields explicitly. No source change was needed. An initial attempt to open the original collapsed toolbar with Enter did not expose it; a fresh DOM snapshot and normal summary click resolved the test setup.

Evidence under `qa-artifacts/cozy-shortcut-hints-20261117/` contains local/staging proofs, frozen candidate bytes, fixture sources, `fixture-browser.json`, `fixture-device-hints.jpg`, `preview-browser.json`, `preview-integrity.json` and candidate desktop/phone captures. Raw saves remain memory-only. No download, upload, clipboard, import or gameplay test is used. Phone layout evidence uses viewport emulation. Original whole-farm pose, toolbar and locale are restored, owned preview tabs close, and the canonical tab is retained.

## Production package

The final build receipt, HTML and emitted file bytes reproduce the tested candidate exactly. Preview HTML differs only in its asset prefix. Source is unchanged after acceptance, including the exact fixture formatter bytes. Temporary preview/fixture files, header rules and Git attributes are removed. Four delivery/header tests pass again after the final rebuild.

The official package helper produces `myfarmtwin-device-shortcut-hints-20261117.tar.gz`. All 304 regular dist files match the checkout exactly; one normalized hosting metadata file makes 305 regular archive files. Safe paths and file kinds are verified without extracting. No preview/fixture, QA/player data or symlink is included. Exact size/hash and byte-parity evidence are in the companion JSON, `artifact.json` and `promotion-parity.json`.

## Production acceptance

Application source `21fa1c815c1fa7d29b65dca446a7001a05f4c7f7` is active on `main`. Cloudflare production deployment `691a9786-9737-4f36-b49e-9735c022566c` completed successfully under native GitHub check `133857058595`, independently of the branch preview. The canonical `/play/` page loads `app-6BFFCBNV.js`.

All 25 recorded production browser checks passed. The actual browser renders Ctrl-only Indonesian hints and correct English hints after changing language, then returns to Indonesian. Both hints are shorter than the old duplicated bilingual/all-platform titles. Device-specific accessible shortcut metadata and visible labels are correct. Hints persist after refresh.

All four action-button widths, heights and labels remain identical to the pre-change live baseline within 0.01 CSS pixel at 1280×720 desktop and 390×844 phone viewports. Buttons remain below the canvas without overlap or horizontal overflow. The phone actions measure 78.33px wide and 46.67px high; desktop action heights remain 44/44/44/46px. No CSS change or visible shortcut badge increases the toolbar.

Ctrl+Z/Ctrl+Y and Cmd+Z/Cmd+Shift+Z restore the exact active camera before/reset poses while collapsed, the editing guard preserves pending camera Redo, and Ctrl+Shift+Z still works after refresh. Language changes leave camera geometry unchanged. The keyboard dispatcher remains byte-identical to the previous release; all 54 camera regression checks also pass.

Full farm exports remain byte-identical to the original in-memory comparator. Current warning/error logs are empty. Canonical `/play/integrity/` passes SHA-256, byte counts and MIME for 30 resources, including 22 GLBs. Temporary viewport overrides are reset before restoring the original whole-farm pose through its untouched overview history pair; original toolbar and locale choices are restored. Only the original canonical tab remains open.

The accepted preview's 12 explicit platform/language fixtures cover both device families using formatter bytes identical to production. Physical Mac/Safari testing is not claimed. Phone evidence uses viewport emulation. No download, upload, clipboard, import or gameplay test was used. Raw player saves are never written to evidence files.

Actual production captures are `qa-artifacts/cozy-shortcut-hints-20261117/production-desktop-hints.jpg` and `production-phone-hints.jpg`. Final browser, integrity and deployment JSON receipts are in the same directory and incorporated in the companion release JSON. The subsequent evidence-only documentation commit does not change the deployed runtime.

## Checklist

- [x] Render short platform-specific, localized hints without changing toolbar labels or CSS.
- [x] Preserve the keyboard dispatcher and active-area protections.
- [x] Pass typecheck, 54 camera regressions, build and four delivery checks.
- [x] Freeze the candidate and prove all primary blobs unchanged.
- [x] Obtain authorization to expose the official preview.
- [x] Verify actual page hints plus both platform families in the internal browser.
- [x] Reproduce tested bytes, remove fixtures and verify the official package.
- [x] Deploy production and verify the canonical page.
