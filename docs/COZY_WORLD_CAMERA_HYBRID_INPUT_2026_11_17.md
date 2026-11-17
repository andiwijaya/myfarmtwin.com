# Last-input gesture hints on hybrid devices — 17 November 2026

Gesture hints follow the last observed input in the page. Touch selects drag/pinch/tap wording; a mouse click, actual mouse movement, wheel or trackpad scroll selects drag/scroll/click wording. The existing primary-pointer query is only an initial fallback, until an explicit interaction is observed. Language and viewport changes retain that choice. It is held in memory and does not add a storage key; a new page starts with its primary-pointer fallback.

`watchCameraGestureInput` observes document Pointer Events and wheel events with passive capture listeners. It never prevents defaults, stops propagation, captures pointers or invokes camera/farm commands. Zero-motion layout events, unsupported pointers, legacy mouse compatibility events and touch-derived mouse/wheel events are ignored. Client-coordinate deltas support browsers without useful movement deltas. Pointer end/cancel clears coordinate tracking, repeated same-mode events do not repaint, and disposal removes all observers.

The observer uses Pointer Events to distinguish device input, following the [W3C compatibility mapping model](https://www.w3.org/TR/pointerevents3/#compatibility-mapping-with-mouse-events). No elapsed-time suppression delays genuine mouse input immediately after touch.

The gesture formatter, keyboard formatter/dispatcher, visible labels and stylesheet are byte-identical to the preceding release. Existing text remains short in ID/EN. A hidden diagnostic source marker distinguishes the initial primary fallback from the last observed input.

## Local verification

- Typecheck passed.
- All 60 input/camera tests passed, including six new observer cases exercising fallback ownership, touch/mouse/touch transitions, compatibility and idle events, wheel/trackpad, localization, unsupported input, pointer reuse and disposal.
- Four delivery/header tests passed.
- Build `app-ERUJD5D5.js` emitted 939,463 JavaScript entry/chunk bytes.

## Official preview acceptance

Candidate `395ecfd49c2b28e54d44991eb40dd0590e77c71b` is published on `codex/glb-prototype-20261115`. All 274 existing primary `dist/play` blobs remain identical to live baseline `97a4180417268b4afb781b7c798c08e4ae9c941d`. Only 14 isolated preview paths are added.

The isolated `/play/reset-camera-preview/hybrid-gesture/` fixture imports the exact production input observer and formatter with actual toolbar markup/CSS. A separate EventTarget keeps simulated device streams independent of the mouse used to operate fixture controls. It does not load a game session/world or access farm storage. UI buttons emit touch, mouse movement/click, wheel, compatibility and idle events; a coarse-pointer checkbox emits fallback changes; language, reset and disposal controls exercise state retention and lifecycle.

The user explicitly authorized official staging after automatic review required specific approval. Cloudflare staging completed successfully under check `133908828461`, deployment `81a82470-f3d7-47c0-a95b-fc17824380c8`. No alternate route bypassed the gate.

Four fixture scenarios (ID/EN × 1280px/390px) passed all 68 transition observations. They exercise fallback changes before first activity, touch → mouse movement → touch, legacy/touch-derived compatibility events, idle moves, wheel, primary-pointer changes after activity, language changes, mouse clicks and disposal. No event is consumed. Callback counts stay unchanged for ignored compatibility/idle/media events. Toolbar height and all action-button dimensions/labels remain unchanged at every observation.

All 26 candidate game checks passed. Native document mouse input switches the diagnostic source from primary fallback to last input. A new observer handles mouse input again after refresh. Four actual page viewport/language combinations preserve the input choice, hint text, toolbar height and action-button dimensions. Keyboard hints remain correct. Ctrl/Cmd Undo/Redo retain exact before/reset camera poses while collapsed, the editing guard keeps Redo pending and Ctrl+Shift+Z works after reload.

The existing whole-farm width-resize listener (`cozy-world.js:46`, unchanged in this release) intentionally refits overview. An initial combined language/resize camera comparison was therefore invalid. Final camera-preservation checks isolate language changes at a fixed viewport and verify independently calculated zoom poses in both languages. No source change was needed. An initial viewport read also preceded reflow; final measurements await responsive brand visibility and assert the requested `innerWidth`.

Farm exports remain byte-identical to the original in-memory comparator. Current warnings/errors are empty. SHA-256, byte counts and MIME pass for 30 release resources, including 22 GLBs. Original whole-farm pose, toolbar and locale are restored; temporary viewport overrides clear, owned preview tabs close and the canonical tab remains.

Evidence is under `qa-artifacts/cozy-hybrid-gesture-20261117/`: local/staging proofs, frozen candidate bytes, fixture sources, `baseline-layouts.json`, `fixture-browser.json`, `fixture-hybrid-mouse.jpg`, `fixture-hybrid-touch.jpg`, `preview-browser.json`, oracle notes, `preview-integrity.json` and candidate captures. Save comparisons remain memory-only. No download, upload, clipboard, import, gameplay or external-browser test is used. Touch/mixed-device streams are explicit event fixtures with the production observer; physical hybrid-device pinch/drag is not tested. Actual browser mouse activity is verified separately.

## Production package

The final build receipt, HTML and emitted files reproduce the accepted candidate exactly. Preview HTML differs only in its asset prefix. Source plus fixture observer/formatter bytes are unchanged after acceptance. Temporary preview/fixture paths, header rules and Git attributes are removed. Four delivery/header tests pass again after the rebuild.

The official package helper produces `myfarmtwin-hybrid-gesture-20261117.tar.gz`. All 305 regular dist files match the checkout exactly; one normalized hosting metadata file makes 306 regular archive files. Safe paths and file kinds are verified without extracting. No preview/fixture, QA/player data or symlink is included. Exact size/hash and parity evidence are in the companion JSON, `artifact.json` and `promotion-parity.json`.

## Production acceptance

Application source `a12d9aab7cc61fe9bbfb2e629b39faefcd07007a` is active on `main`. Cloudflare production deployment `705feaa6-9d48-4ba4-915d-5f57bf728d02` completed successfully under native GitHub check `133915392103`, independently of the branch preview. Canonical `/play/` loads `app-ERUJD5D5.js`.

All 26 recorded production browser checks passed. The initial input/source marker and hint are valid, document mouse activity reports the last observed pointer, and a new observer handles native mouse input after reload. ID/EN rendering and four actual viewport/language layouts retain the input choice and match pre-change toolbar/button dimensions. Heights remain 259.83px at 1280×720 and 306.17px at 390×844, with a 13.5px hint line and no horizontal overflow.

Fixed-viewport language changes preserve camera geometry through independently calculated zoom comparisons. Ctrl/Cmd Undo and Redo restore exact before/reset camera poses while collapsed. Editing keeps camera Redo pending, and Ctrl+Shift+Z remains functional after refresh. The keyboard formatter/dispatcher and camera-world source bytes match the preceding release. Primary-pointer fallback restarts on a new page; last observed input is intentionally in-memory and adds no storage key.

Farm exports remain byte-identical to the original in-memory comparator. Current warnings/errors are empty. Canonical `/play/integrity/` passes SHA-256, byte counts and MIME for 30 resources, including 22 GLBs. Temporary viewport overrides are cleared, the original whole-farm pose is restored through its unchanged history pair and original toolbar/locale choices are retained. Only the original canonical tab remains open.

The accepted preview's four stateful scenarios cover 68 explicit touch/mouse/fallback/localization/disposal observations using observer/formatter bytes identical to production. Physical hybrid hardware, native touch/pinch and real-device switching are not tested. Native mouse activity is verified separately on the actual production document. No download, upload, clipboard, import or gameplay test is used; raw farm exports stay in memory.

Production viewport captures are `qa-artifacts/cozy-hybrid-gesture-20261117/production-desktop-hybrid.jpg` and `production-phone-viewport.jpg`. The input fixture has paired mouse/touch captures. An additional full-page diagnostic capture is retained separately and is not used for viewport dimension comparisons. Final browser, integrity and deployment JSON receipts are in the same directory and incorporated in the companion release JSON. The subsequent evidence-only documentation commit does not change the live runtime.

## Checklist

- [x] Follow the last touch/mouse activity while retaining an initial primary-pointer fallback.
- [x] Ignore compatibility/idle events and avoid repeated UI writes.
- [x] Keep text, labels, CSS, keyboard dispatcher and farm storage unchanged.
- [x] Pass typecheck, 60 input/camera tests, build and four delivery checks.
- [x] Freeze the candidate and prove existing primary blobs unchanged.
- [x] Obtain authorization for official preview staging.
- [x] Verify hybrid sequences and toolbar dimensions in the internal browser.
- [x] Reproduce tested bytes, remove fixtures and verify the official package.
- [x] Deploy production and verify the canonical page without file-transfer tests.
