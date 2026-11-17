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

Activation and canonical production browser verification are pending; final receipts will update this section and the companion JSON.

## Checklist

- [x] Add short touch/desktop hints and refresh them when language/input changes.
- [x] Keep stylesheet, toolbar labels, keyboard dispatcher and farm state unchanged.
- [x] Pass typecheck, 54 camera regressions, build and four delivery checks.
- [x] Freeze the candidate and prove existing primary blobs unchanged.
- [x] Obtain specific authorization for official preview staging.
- [x] Verify hint text and toolbar dimensions in the internal browser.
- [x] Reproduce tested bytes, remove fixtures and verify the official package.
- [ ] Activate production and verify the canonical page without file-transfer tests.
