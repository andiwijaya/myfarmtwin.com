# Input-specific camera gesture hints — 17 November 2026

The camera hint uses the primary input capability. Touch/coarse pointer devices show drag/pinch/tap instructions; mouse/trackpad devices show drag/scroll/click instructions. Narrow desktop windows retain desktop instructions. The `(pointer: coarse)` media query is observed for changes, and the hint refreshes on startup, language changes and primary-input changes. Its listener is removed on pagehide.

Indonesian touch text: `Seret: putar · Cubit: zoom · Ketuk objek`.
Indonesian desktop text: `Drag: putar · Scroll: zoom · Klik objek`.
English touch text: `Drag: orbit · Pinch: zoom · Tap objects`.
English desktop text: `Drag: orbit · Scroll: zoom · Click objects`.

`cameraGestureHint` is a presentation-only formatter in the existing camera-shortcut module. No camera command, farm command or save key is added. The keyboard dispatcher remains byte-identical to the previous release. Stylesheet and visible toolbar button labels are unchanged.

## Completed local checks

- Typecheck passed.
- All 54 existing camera regression tests passed.
- Four delivery/header tests passed.
- Build `app-4MRNRDYA.js` emitted 938,174 JavaScript entry/chunk bytes.

## Official preview acceptance

Candidate `4d9ede1332d58a0d6269c0e085634456ca993ce4` is published on `codex/glb-prototype-20261115`. All 274 existing primary `dist/play` blobs remain identical to live baseline `21fa1c815c1fa7d29b65dca446a7001a05f4c7f7`; only 13 isolated preview paths are added.

The isolated `/play/reset-camera-preview/gesture-hints/` fixture uses the candidate's actual toolbar markup, exact stylesheet and exact formatter source. It does not import the game application or initialize the world, session or farm storage. Normal UI controls select touch/pointer, ID/EN and previous/candidate text so toolbar height can be compared with the old combined hint at desktop and phone widths. Input capability is simulated explicitly in this fixture; a physical phone's pinch/drag is not claimed.

The user explicitly authorized official staging after automatic review required specific approval for the pre-test `main` update. Cloudflare staging completed successfully under check `133877303440`, deployment `e6521aa6-0d06-47bb-9e82-bcabc98b3d70`. No alternate route was used to bypass the gate.

All eight fixture comparisons passed: touch/pointer × ID/EN × 1280px/390px widths. Toolbar heights stayed exactly 259.83px on desktop and 306.17px at phone width, with a 13.5px hint line in every case. All action-button dimensions/labels remained identical, with no horizontal overflow. These fixtures import the exact production formatter, stylesheet and toolbar markup without initializing game/session/world code.

All 25 candidate game checks passed. The actual browser's primary pointer remains `pointer` at both widths, and the game correctly keeps drag/scroll/click wording in a narrow desktop window. ID/EN language changes, initial load and refresh show the expected short text. All four live page layout/language combinations retain the previous toolbar height and button dimensions. Language/resize checks leave camera geometry unchanged.

Ctrl and Cmd Undo/Redo retain exact before/reset poses while collapsed. The typing guard preserves pending Redo and Ctrl+Shift+Z works after refresh. Keyboard tooltip behavior is retained. Farm exports remain byte-identical to the original in-memory comparator, and current warning/error logs are empty. SHA-256, byte-count and MIME integrity passes 30 resources, including 22 GLBs. Original whole-farm pose, toolbar and locale are restored, temporary viewport overrides clear and owned preview tabs close while the canonical tab remains.

Evidence is under `qa-artifacts/cozy-gesture-hints-20261117/`: local/staging proofs, frozen candidate bytes, fixture sources, `baseline-layouts.json`, `fixture-browser.json`, `fixture-phone-touch.jpg`, `preview-browser.json`, `preview-integrity.json` and candidate desktop/phone viewport captures. Save comparisons stay memory-only. No download, upload, clipboard, import, gameplay or external-browser test is used.

Touch capability is an explicit fixture; physical phone pinch/drag and actual primary-device switching are not exercised. Phone layouts use viewport emulation. The primary-pointer change listener is implemented, while startup and language/refresh behavior are verified on the actual browser.

## Production package

The final build receipt, HTML and emitted file bytes reproduce the accepted candidate exactly. Candidate HTML differs only in its asset prefix. Source and fixture formatter bytes are unchanged after acceptance. Temporary preview/fixture files, headers and Git attributes are removed. Four delivery/header checks pass again after the final rebuild.

The official package helper produces `myfarmtwin-gesture-hints-20261117.tar.gz`. All 304 regular dist files match the checkout exactly; one normalized hosting metadata file makes 305 regular archive files. Safe paths and file kinds are verified without extracting. No preview/fixture, QA/player data or symlink is included. Exact size, SHA-256 and parity evidence are in the companion JSON, `artifact.json` and `promotion-parity.json`.

## Production acceptance

Application source `97a4180417268b4afb781b7c798c08e4ae9c941d` is active on `main`. Cloudflare production deployment `c4b1753f-1963-481b-9a75-50dd8cc63809` completed successfully under native GitHub check `133880653803`, independently of the branch preview. The canonical `/play/` page loads `app-4MRNRDYA.js`.

All 25 recorded production browser checks passed. The live primary-pointer classification is valid, the expected short hint renders on initial load and after refresh, and ID/EN changes update correctly. A narrow fine-pointer viewport retains desktop drag/scroll/click instructions. The existing device-specific keyboard hints are preserved.

All four actual production viewport/language comparisons retain the exact pre-change toolbar heights: 259.83px at 1280×720 and 306.17px at 390×844, with the same 13.5px hint line. Action-button labels, widths and heights are unchanged. No horizontal overflow is present. The accepted preview additionally verifies touch/pointer versions through eight baseline/candidate fixture comparisons using identical production formatter/markup/CSS bytes.

Language and viewport changes leave camera geometry unchanged. Ctrl/Cmd Undo and Redo restore exact before/reset camera poses while collapsed, the editing guard retains pending Redo, and Ctrl+Shift+Z still works after refresh. The keyboard dispatcher remains byte-identical to the previous release and all 54 existing camera regressions pass.

Farm exports remain byte-identical to the original in-memory comparator. Current warning/error logs are empty. Canonical `/play/integrity/` passes SHA-256, byte counts and MIME for 30 resources, including 22 GLBs. Temporary viewport overrides are cleared before restoring the original whole-farm pose through its untouched overview history pair; toolbar and locale choices are restored. Owned test tabs close and only the original canonical tab remains.

All interactive testing uses the internal browser without download, upload, clipboard, import or gameplay tests. Touch input is simulated in a read-only fixture; physical phone pinch/drag and live switching of the primary device are not tested. Actual phone-width layout evidence uses viewport emulation with a fine pointer.

Production captures are `qa-artifacts/cozy-gesture-hints-20261117/production-desktop-gesture.jpg` and `production-phone-viewport.jpg`; `fixture-phone-touch.jpg` shows the explicitly simulated touch wording. Browser, integrity and deployment JSON receipts are in the same directory and incorporated in the companion release JSON. The subsequent evidence-only documentation commit does not alter the deployed runtime.

## Checklist

- [x] Add short touch/desktop hints and refresh them when language/input changes.
- [x] Keep stylesheet, toolbar labels, keyboard dispatcher and farm state unchanged.
- [x] Pass typecheck, 54 camera regressions, build and four delivery checks.
- [x] Freeze the candidate and prove existing primary blobs unchanged.
- [x] Obtain specific authorization for official preview staging.
- [x] Verify hint text and toolbar dimensions in the internal browser.
- [x] Reproduce tested bytes, remove fixtures and verify the official package.
- [x] Activate production and verify the canonical page without file-transfer tests.
