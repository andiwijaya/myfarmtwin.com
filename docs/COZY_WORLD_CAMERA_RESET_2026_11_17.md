# MyFarmTwin reset for the active camera — 17 November 2026

Status: implemented; local checks and official-domain internal-browser acceptance pass. Primary activation is pending.

## Behavior

The expanded toolbar has a visible `Reset kamera` / `Reset camera` button with the bilingual accessible name `Reset kamera area ini / Reset this area's camera`. It remains in normal flow below the canvas. On phones the reset and arrange buttons share one row beneath the seven existing camera controls; collapsed toolbar behavior is preserved. The button has a minimum 44px height and becomes enabled only after the renderer/model initialization succeeds.

Reset keeps the active area or supported interior selected and restores its original camera position, target, FOV and zoom using the current farm layout. It drains pending orbit/pan inertia, cancels the in-progress navigation transition, then applies the initial destination. The result is written synchronously as the active view's camera and the global last-active camera. It is a replacement of that one saved pose, rather than a storage-wide deletion. Every other area/interior key remains untouched, along with the toolbar preference and farm progress.

Only history entries for the reset view receive the new default pose, so Back cannot revive its old camera through the local history fallback. Other history entries are retained. Reset inside a building preserves that interior; a removed selected entity falls back to the whole farm. Optional storage errors do not escape, and the operation is guarded before camera readiness or after disposal. The existing newer-gesture ordering protects reset from older delayed writes.

Source changes are in `game/client/cozy-world.js`, `game/client/cozy-app.js`, `game/client/cozy/index.html` and `game/client/cozy/style.css`. Five reset-specific integration tests extend `game/tests/cozy-world-area-camera.test.mjs`.

## Checks completed

- Typecheck passed.
- All 23 camera tests passed, including five new reset cases: scoped default replacement and a fresh world, interior/exterior independence, pending transition/inertia handling, stale-writer protection, and readiness/unavailable-storage fallback.
- Production build passed: `app-TM5TBGTL.js`, 929,836 total emitted entry/chunk bytes.
- Four delivery/header checks passed, covering shipped manifest-bound GLBs and response-policy merging.

The renderer-free tests use actual CozyWorld camera/navigation methods and a Three.js PerspectiveCamera with synthetic in-memory preference storage. The pending-inertia case uses a minimal controls fixture. They are local code checks rather than interactive browser evidence.

## Prepared preview and access limits

Preview candidate source is `66f65e8ad0afd8c2c790a52ea66576336892e1fd`, entry `app-TM5TBGTL.js`. It was tested at `/play/reset-camera-preview/` on the official domain. During staging the primary runtime remained identical to source `2e08967ed138f80ee96b7c38bbe295a3222a5bda`, entry `app-EGVGKWVV.js`.

An immutable GitHub tree comparison verified that all 36 primary runtime, raw source and receipt blobs are identical between these commits. Those include all 30 primary resources, all three active HTML aliases, the primary receipts, CSS, world manifest and all 22 runtime GLBs. Main HTML and its bundle have no reset control. The only added header rules apply to `/play/reset-camera-preview/` and its children. Proofs are under `qa-artifacts/cozy-reset-camera-20261117/`: `staging-safety-proof.json` and `remote-staging-safety-proof.json`.

Automatic approval review rejected moving `main` to the staged commit, treating even the isolated preview addition as a deployment before the requested browser test. A second review after immutable-byte proof retained that restriction. No alternate publishing channel or force update was used.

The separate Cloudflare branch deployment completed successfully (`e96685f0-1a9b-436b-ba77-1d9e70c7612c`, check `133699864975`). The internal browser displayed its lookalike-domain warning at the supplied preview URL, and the warning was not bypassed. A loopback preview was also attempted with the existing workspace server, but both the HTTP health check and the internal browser timed out. The owned local server was stopped. No standalone browser or desktop automation was used.

The user explicitly granted the limited official-domain preview exception on 17 November 2026: expose that route through `main` with the 36 primary blobs unchanged, then run browser acceptance before activating the primary control. Staging succeeded afterward (`9d3af370-5c35-41f1-a6c7-66f87f83ca7a`, completed/success check `133704766347`). The original test-before-primary-activation order was retained.

## Completed internal-browser acceptance

Fifteen recorded groups passed on the official-domain candidate:

- Garden reset matches its original target, position, FOV and zoom, derived in memory from the exported bed layout, while retaining the selected garden context.
- The independently remembered cow-area camera remains exact after resetting the garden, including after tab reopening and the multi-tab test.
- Reset poses survive leaving/revisiting the area, refresh, and actual tab close/reopen.
- The existing market interior resets to the original building-relative pose and retains interior context; its independent exterior camera remains exact. The interior oracle uses the exported building transform and the existing preset's collision bounds.
- English labeling, English status feedback and native Enter activation work; the original Indonesian locale was restored.
- Reset during an in-progress area transition reaches the initial pose, and a reset survives immediate tab close while an older tab cannot overwrite it.
- Measured 390×844 and 320×844 phone layouts keep the 44px reset button below the canvas, its label within the button, and reset/arrange in the same row without horizontal overflow. Row alignment compares vertical centers because the two buttons have different heights.
- The measured 1280×720 desktop layout also keeps the reset button and toolbar below the canvas without overflow.
- The complete farm export remains byte-identical to the in-memory pre-test comparator. No farm command, starter, import, clipboard or file-transfer action occurred, and no raw player bytes were written to files or the repository.
- Actual internal-browser SHA-256, byte-count and MIME checks pass 30/30 candidate resources, including 22 GLBs. A separate primary check still passes all 30 resources for the old `app-EGVGKWVV.js` before primary activation.

Evidence: `preview-browser.json`, `preview-integrity.json`, `primary-preserved-integrity.json` and actual capture `preview-desktop-reset.jpg` under `qa-artifacts/cozy-reset-camera-20261117/`. Camera-vector/FOV/zoom comparisons use tolerance 0.001 with exact context IDs; gesture timestamps are excluded. The original collapsed toolbar choice was recovered from the untouched original tab and restored after preview testing.

Phone checks use viewport emulation. Physical phones, full browser-process restart and native pointer drag/pinch were not exercised. The pending-inertia case was checked with the renderer-free controls fixture described above. Livestock areas were unstarted in this player farm, so the actual market supplied the interior journey.

## Remaining acceptance

- [x] Open an approved preview in the internal browser.
- [x] Change two area cameras, reset one to its initial pose, and verify the other remains exact.
- [x] Verify reset through refresh, actual tab reopening and revisiting the area.
- [x] Verify an interior reset preserves its independent exterior camera.
- [x] Check language/keyboard access and phone/desktop layout below the canvas.
- [x] Compare farm exports in memory only and verify candidate resource integrity.
- [ ] Reproduce the tested bytes, remove the temporary preview and activate the primary control.
- [ ] Verify the canonical production page and record actual screenshots and the release receipt.
