# MyFarmTwin camera memory per area — 17 November 2026

Status: implemented, tested in the internal browser, deployed and verified at https://myfarmtwin.com/play/ .

## Behavior

The whole farm, garden, chicken/goat/cow areas, pond, market, individual objects and supported building interiors each retain their own camera position, orbit target, FOV and zoom. Leaving a view flushes its pending camera before changing context. Returning through area navigation restores its last valid pose; exterior and interior views use separate IDs. Back follows the latest remembered view while retaining a local history fallback when optional storage is unavailable.

Each view uses the browser-local UI key prefix `myfarmtwin.ui.camera.view.v1:` followed by its validated view ID. Separate keys avoid replacing a shared map when two tabs change different areas. The existing `myfarmtwin.ui.camera.v1` key still records the last active view for refresh/reopening. Its existing saved camera remains readable and is retained in per-view storage on first departure. Toolbar expansion continues to use its existing independent key.

This is browser-local presentation data. It does not change farm progress, simulations, save schemas, models or asset quality. Clearing site data clears these preferences; there is no cross-device account synchronization.

Stored poses retain the existing numeric, schema, ID and anchor validation. Moved/rotated buildings refocus from the current layout; removed history targets fall back to the whole farm. Missing or corrupt optional preferences use the existing default view. A newer gesture in the same area wins over an older pending write. A different area's storage event does not discard a pending local area camera, and that delayed area write cannot replace a newer global last-view choice.

Source: `game/client/cozy-camera-preference.js` and `game/client/cozy-world.js`. The new focused tests are in `game/tests/cozy-world-area-camera.test.mjs`.

## Local checks

- Typecheck passed.
- Eighteen camera tests passed: nine existing preference tests and nine new per-view tests. The new integration checks call actual CozyWorld navigation/camera methods with a real Three.js PerspectiveCamera, synthetic in-memory storage and a minimal renderer-free fixture.
- Coverage includes independent projections, legacy migration on first departure and a fresh world, garden/barn/interior roundtrips, Back, rapid transitions, cross-tab ordering, unavailable/invalid storage, moved buildings and removed targets.
- Production build passed for candidate `app-EGVGKWVV.js`, 928,536 total emitted entry/chunk bytes.
- Four delivery/header checks passed, including manifest-bound GLBs and restrictive response-policy merging.

## Observed internal-browser acceptance

The candidate was staged at the temporary official-domain route `/play/area-camera-preview/`. Staging source: `b9ce7c4f1dfd5bd0aa40da1c36f74b82c179082b`. All 30 primary runtime resource bytes, the primary receipts and raw camera sources remained identical to application source `be5d95e68b6aee06de9b5cd28152e06ac9c0a99e`, entry `app-KU5HXF2G.js`, until activation of the tested candidate.

The following were confirmed through actual internal-browser UI actions at a measured 390×844 viewport, comparing camera vectors, FOV and zoom within 0.001 and view IDs exactly:

- The previously saved global view restored correctly.
- Garden zoom/orbit/pan survived garden → cow area → garden.
- The cow area's independently changed zoom/orbit returned correctly.
- The market exterior retained its own camera independently of its interior.
- The market interior retained its camera after leaving and returning.
- Refresh restored the same interior pose and selected interior context.

The player farm had unstarted livestock areas; the existing market supplied the actual interior journey. No starter, purchase, planting, time advance, placement, import, clipboard or file-transfer action was issued. Raw player save bytes were captured in memory only and never written to a fixture, artifact or repository.

The browser session temporarily stopped responding and reset during a longer additional desktop-area loop. The user reactivated the chat and the internal preview recovered. Remaining journeys then passed in shorter recorded batches: chicken/goat/pond roundtrips on desktop, repeated garden/cow-area roundtrips on phone, garden refresh, actual tab close/reopen retaining both garden and cow-area cameras, independent changes in two tabs with immediate close, and newest-gesture ordering when both tabs changed the same area. Overview and exterior/interior return journeys also passed. The internal-browser resource check passed all 30 resources, including 22 GLBs, for `app-EGVGKWVV.js`.

The reset lost the initial in-memory camera samples and raw farm comparator. The untouched preceding-runtime production tab remained available with its original farm state, so its export was recaptured in memory and compared byte-for-byte with the candidate export. They matched exactly. Only equality results were written to evidence; raw player bytes remained in memory. The earlier partial record is retained as history, and the completed `preview-browser.json` records twelve passing groups and the recovered interruption. No failed or unobserved batch was counted as passing without subsequent confirmation.

The records are under `qa-artifacts/cozy-area-camera-20261117/`: `preview-browser.json`, historical `preview-browser-partial.json`, `preview-integrity.json`, `farm-equality.json`, and the exact primary-byte preservation proof `staging-safety-proof.json`. No desktop takeover or alternate browser automation was used. Tests used measured viewport emulation at 390×844 and 1440×900; physical phones, native pinch/drag and a full browser-process restart were not exercised.

## Release record

Application source: `2e08967ed138f80ee96b7c38bbe295a3222a5bda`. Cloudflare production deployment: `6de8146d-6696-47d0-8599-5c2fae89ac84`; GitHub Cloudflare Pages check `133658460999` reached completed/success. The active entry is `app-EGVGKWVV.js`. The separate branch preview is not the production receipt.

Thirteen production browser groups passed. At a measured 390×844 viewport, independently modified garden and cow-area cameras returned correctly, garden refresh retained its exact pose, and closing/reopening the actual test tab retained both areas. At a measured 1440×900 viewport, the market exterior and interior returned to their separate poses and interior refresh retained its exact pose and context. Both layouts kept the collapsed toolbar below the canvas without horizontal page overflow. Camera-vector, FOV and zoom comparisons used tolerance 0.001 and exact view IDs; gesture timestamps were excluded.

The canonical `/play/integrity/` page passed SHA-256, byte-count and MIME checks on all 30 resources, including 22 GLBs, for the activated entry. Production-tab warnings/errors were zero. The final production farm export remained byte-identical to the untouched original preceding-runtime tab. No raw player bytes were written to disk or the repository.

Actual screenshots: `qa-artifacts/cozy-area-camera-20261117/production-phone-garden-return.jpg` and `production-desktop-interior-return.jpg`. The final test view is the whole farm with the toolbar collapsed. Temporary viewport overrides were reset, owned preview/integrity tabs were closed, and the canonical production tab was left available.

The archive `myfarmtwin-area-camera-20261117.tar.gz` is 18,391,436 bytes, SHA-256 `ebf576d2cf0df61dbdee231216135bc634458c2a1a39c91b47115c60563296aa`. All 302 regular static site files match final dist bytes; normalized official hosting metadata makes 303 verified files. Temporary preview routes/rules are removed from the artifact, and no QA/player data is included. Production activation uses the exact JavaScript/CSS/manifest/model bytes of the observed candidate, with only the HTML asset path prefix changed.

The machine-readable companion `COZY_WORLD_AREA_CAMERA_2026_11_17.json` records the completed release. Local receipts include `promotion-parity.json`, `artifact.json`, `production-browser.json`, `production-phone-browser.json` and `production-integrity.json` under `qa-artifacts/cozy-area-camera-20261117/`. Documentation-only commits after the application activation do not change the deployed bundle.

## Checklist

- [x] Keep independent validated cameras for each area and supported interior.
- [x] Preserve the previous global camera and toolbar choice.
- [x] Flush outgoing views and protect independent multi-tab area writes.
- [x] Pass local type/build and focused camera/delivery checks.
- [x] Confirm the primary garden/cow-area and market/interior roundtrips in the internal browser.
- [x] Recover and complete additional-area, actual tab reopen, multi-tab and candidate-integrity checks.
- [x] Verify the activated canonical production page.
- [x] Record the final production deployment and artifact receipt.
