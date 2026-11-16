# MyFarmTwin remembered camera — 16 November 2026

Status: implemented, tested using only the Codex internal browser, deployed and verified at https://myfarmtwin.com/play/ .

## Behavior

The game restores the last camera position, orbit target, perspective FOV, zoom and selected view from the browser-local UI key `myfarmtwin.ui.camera.v1`. A view can be the whole farm, a farm area, an existing selected object or a supported building interior. This preference is separate from farm saves and toolbar expansion, and is shared by paths on the same browser origin. Clearing site storage clears it; it is not account or cross-device synchronization.

Restoration waits for models and the farm layout, then applies the saved pose without the default opening transition overwriting it. New user input while loading takes precedence. The care panel and selected area follow the restored camera context. Reapplying an unchanged interior during a farm revision preserves its FOV and zoom.

OrbitControls start/change/end events capture ordinary interaction with a short debounce and an end/settle flush. Explicit zoom, rotation and pan commands flush synchronously before scheduling a final damping settle pass. Visibility changes and renderer disposal also flush pending interaction. Finishing a navigation flush stores the destination rather than an intermediate transition. Back history includes FOV and zoom, and Home/Escape keep camera and application selection synchronized.

Stored presentation data is validated before use. Missing, malformed, unsupported or out-of-bounds values fall back safely. If a saved object's building anchor moved or rotated, the game refocuses that object using its current layout; if it disappeared, the game returns to the whole farm. Optional storage failures remain contained. Compare-before-write and a monotonic interaction time prevent an older tab's delayed save or close from replacing a newer camera choice. Existing open tabs retain their view until the user navigates or reloads.

Implementation: `game/client/cozy-camera-preference.js`, `game/client/cozy-world.js`, and `game/client/cozy-app.js`. The test file is `game/tests/cozy-world-camera-preference.test.mjs`. No simulation command, save-schema migration, asset model or visual-quality change is part of this release.

## Validation before activation

The final candidate was tested at the temporary official-domain route `/play/camera-preview/` while the primary game retained its preceding runtime. The final candidate source was `63737755987d2c7e60c4ba7287bb6b3a9fdedac6`, entry `app-KU5HXF2G.js`.

- Manual garden zoom, orbit and pan survive refresh and actual tab close/reopen.
- A supported interior, exercised using the existing market, retains its exact camera and interior context after refresh and tab reopening.
- Back restores the previous exact pose; collapsing the toolbar and refreshing preserves both the camera and collapsed choice.
- The latest gesture across two tabs survives immediately closing the changed tab and then the older tab. An earlier candidate exposed this failure; timestamp ordering plus synchronous explicit-command flushing fixed it, and the final candidate passed the same regression.
- Actual browser SHA-256, byte-count and MIME checks passed all 30 candidate resources, including 22 GLBs.
- Farm exports remained byte-identical. Raw player bytes were compared in memory only, never written to fixtures, reports, artifacts or the repository.

The final build reproduced the tested JavaScript, CSS, manifest and GLB bytes exactly. HTML matched the tested candidate with only the asset URL prefix changed. The temporary preview, cache rules, Git attributes and two verified obsolete generated bundles were removed before activation.

Source typecheck, nine focused camera tests and four delivery/header checks passed. The camera tests cover validation boundaries, projection roundtrips, object/interior anchor changes, removed targets, optional storage failure, cross-tab ordering, and projection preservation when the same interior syncs. These were local code checks; interactive acceptance used only the internal browser.

## Production verification

- Application source: `be5d95e68b6aee06de9b5cd28152e06ac9c0a99e`.
- Cloudflare production deployment: `c84c3870-0632-4284-b869-4d87a5306045`; GitHub Cloudflare Pages check `133360338973` reached completed/success. The separate branch-preview deployment is not the production receipt.
- Active entry: `app-KU5HXF2G.js`; total emitted entry/chunk bytes: 927,093.
- At a measured 390×844 phone viewport, garden zoom/orbit/pan survived refresh and actual tab close/reopen.
- At a measured 1440×900 desktop viewport, interior zoom/orbit survived refresh and actual tab close/reopen. A final whole-farm refresh also restored exactly.
- Both measured layouts kept the collapsed toolbar below the canvas without horizontal page overflow.
- The canonical `/play/integrity/` page passed 30/30 resources, including 22 GLBs, for the activated entry. Current production-tab warnings/errors: zero.
- All compared camera vectors, FOV and zoom matched within 0.001; context IDs matched exactly. Gesture timestamps were excluded from pose equality.
- The final complete farm export still matched the original exactly. No farm command, starter, purchase, planting, time advance, placement, import, clipboard or file-transfer test occurred.

Real screenshots are in `qa-artifacts/cozy-camera-20261116/`: `production-garden-after-reopen.jpg`, `production-interior-after-refresh.jpg`, and `production-overview-after-refresh.jpg`. The final test view is the whole farm with the toolbar collapsed. The temporary viewport override was reset and the canonical game tab was left available.

The phone check uses viewport emulation rather than physical-device evidence. Full browser-process restart, private-mode retention, native pinch/drag gestures and induced browser storage denial were not exercised. Ordinary OrbitControls handlers are connected in source; button camera operations, refresh and actual tab reopening were tested interactively. No desktop takeover or standalone browser occurred.

## Artifact and evidence

`myfarmtwin-camera-preference-20261116.tar.gz`: 18,390,395 bytes; SHA-256 `7bce45c61dd9a0cc38356760a8762873475b5179c2eb195ca29cbe7bc7891bc2`. All 302 regular static site files match final dist bytes; normalized official hosting metadata makes 303 verified files. No QA/player data or temporary preview is included.

The machine-readable release receipt is `COZY_WORLD_CAMERA_PREFERENCE_2026_11_16.json`. Local evidence includes `preview-browser.json`, `preview-integrity.json`, `promotion-parity.json`, `production-browser.json`, `production-integrity.json` and `artifact.json` under `qa-artifacts/cozy-camera-20261116/`. Documentation-only commits after the application activation do not change the live bundle.

## Checklist

- [x] Persist camera position, target, projection and view separately from farm saves.
- [x] Restore only a validated pose with a coherent current object/interior context.
- [x] Preserve the newest interaction across debounce, immediate close and multiple tabs.
- [x] Test refresh, actual tab reopening and interior restoration before primary activation.
- [x] Reproduce and deploy the exact tested runtime, removing temporary preview assets.
- [x] Verify the canonical production entry, 30 resources, phone/desktop layouts and farm-save equality.
- [x] Save real production screenshots and a machine-readable release receipt.
