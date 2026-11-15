# Tropical GLB prototype: P0-P2 release

Date: 15 November 2026 (WIB). Owner authorized autonomous implementation, public source/GLB publication to the existing GitHub repository, deployment and tests. Visual/interaction tests use only the Codex internal browser after the owner's steering.

## Release behavior

New entry: `https://myfarmtwin.com/play/glb/`. The original complete farm remains `/play/` and links to the preview. This release is the garden and cow-barn prototype; P3/P4 gameplay redesign and all-five-area GLB conversion remain future work.

Every visible model in the new scene originates from the nine original GLBs: continuous terrain, 24 beds, thirteen crop stage templates, articulated cow, complete tropical barn/interior, props, vegetation, paths and fencing. Total GLB transfer files: 3,496,116 bytes, with embedded original textures. Cow animation is transform-node articulation, not a skinned rig.

Area focus, continuous orbit, pan, zoom, overview/back and roof cutaway use one scene. Native plant/water/growth/harvest/sale and cow starter/care/milking/quoted sales share the existing V6 domain state. Player-controlled six-hour advancement uses real native ticks. Placement has bounded footprints, preview/confirm/cancel, move/rotate, real native facility ownership/purchases and explicitly free bounded decoration kits.

The save schema and native engine are unchanged. All 24 beds, other farm areas, inventory, native accounting, livestock and progress remain present. Layout transforms use a strict sidecar. Original bytes, backups, two-key import/build journaling, invalid imports, quota and cross-tab conflicts have separate protections. The pump's relocated model retains original native irrigation coverage, disclosed in its panel.

## Accepted evidence

- 575/575 non-network native tests pass (`native-final.log`); the negotiated-localhost HTTP/cache case was excluded because loopback networking is denied.
- 25/25 targeted foundation tests passed before the final header fix; two additional Pages header merge/detach regressions pass.
- Strict typecheck, structural/resource validation for all nine GLBs, deterministic exports, source syntax and exact staged runtime bytes pass at the recorded checkpoints.
- Actual Cloudflare preview source: `b23a0c20fba276b27eb9acbdd7e48f541f3c2bea`; deployment `b9713469-d74e-449a-b376-8e5866637c2e`; URL `https://b9713469.myfarmtwin-com.pages.dev/play/glb/`.
- Codex internal browser: 23 observed check groups, recorded in ignored `qa-artifacts/glb-upgrade/internal-browser/preview-report.json`. These cover real garden/cow economics, placement/cancellation, paid pump/free kit, exact reload/import round trips, invalid import, real stale tabs, full rotation/back, five viewport overflow checks, nine GLB loads and unchanged paused data in the original full farm.
- The served parsed build receipt equals local `dist/play/glb/build-info.json`. JavaScript entry: `app-DSVEGTGX.js`, 981,655 bytes, SHA-256 `552368734023e9d00acc5a9e663b7717c3aeb004d913751dd6033da12eb059a2`.

The first real preview exposed combined CSP inheritance; a scoped detach fixes it without changing native route policy. Earlier browser failures, the touch pointerup click-through and the CSS newline staging mismatch are retained in the progress log. Picking now runs on the final click; phone-size internal-browser selection leaves the complete exported farm unchanged.

## Rollback and limits

The previous production source `d4025da144ead1754119ae6e5a1839983838ebfd` uses the same V6 engine/schema. Preserve the exact native save, backups and GLB layout sidecar when rolling back. Use a normal revert or forward commit through the existing pipeline; do not force-push or downgrade/reset user data. The original complete farm runtime was opened on the preview with the prototype's data and retained the exact paused native/layout bundle.

Viewport checks are not physical Android/iOS validation; the internal browser does not establish native hardware touch/pinch, display FPS, thermal/battery, GPU memory, Safari or spoken screen-reader behavior. This pass does not claim injected-model-404 or deliberate context-loss testing. Scene counters are a bounded observation, not a benchmark guarantee. Full artistic realism and all-farm conversion are not claimed for this prototype.

## Production status

Pending promotion of the tested artifact and public internal-browser verification. This document must be updated with the actual production source/deployment after success; the preview is not proof of production publication.
