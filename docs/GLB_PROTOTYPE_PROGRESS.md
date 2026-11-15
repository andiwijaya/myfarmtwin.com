# MyFarmTwin GLB prototype: progress and acceptance

Date: 15 November 2026 (WIB). Scope: P0-P2, garden and complete cow-barn prototype.

Owner instruction: implement autonomously from P0 through the prototype, update progress/checklists, avoid tests requiring owner approval, deploy when complete and test the public result.

## Current checkpoint

P0/P1 implementation and bounded P2 preview acceptance are complete. The owner explicitly approved public source/model publication. Preview source `b23a0c20fba276b27eb9acbdd7e48f541f3c2bea` is successfully deployed at `https://b9713469.myfarmtwin-com.pages.dev/play/glb/`; its served parsed build receipt matches the prepared artifact. **23 observed internal-browser check groups pass**, with explicit limits below. Production promotion and public verification are the remaining release steps. The prototype is a distinct `/play/glb/` entry; the complete existing farm remains `/play/`. Both use the same native V6 farm/economy, with a separate strict layout sidecar. The new scene contains only imported GLB model geometry.

## P0: product and foundation

- [x] Reconcile interview decisions and define bounded garden+cow scope; all-five-area migration is not presented as completed.
- [x] Confirm GitHub production source: `main` is `d4025da144ead1754119ae6e5a1839983838ebfd` via connected GitHub branch API. Local baseline `dbccee9` differs in documentation/evidence only.
- [x] Inventory renderer/camera/build limitations, current V6 schema and original 24-bed requirement.
- [x] Retain native domain state and commands for all areas; make view-only opening/camera non-mutating.
- [x] Define original GLB authoring, meter/Y-up conventions, templates and model manifest.
- [x] Define free transform sidecar, real native purchases, bounded explicitly free decorative kit, collision and owned bounds.
- [x] Define original-byte archives, strict import/export bundle, multi-tab conflicts and interrupted-save journal.
- [x] Reconcile public preview artifact and owning deployment. The successful Cloudflare GitHub check identifies source `b23a0c2` and deployment `b9713469-d74e-449a-b376-8e5866637c2e`; its parsed served receipt equals local. The registered Sites record is historical (version 0, no active native URL); hosting remains the existing GitHub/Cloudflare Pages pipeline.

Foundation documents: `GLB_PROTOTYPE_SAVE_CONTRACT.md`, `GLB_PROTOTYPE_ASSET_CATALOG.md` and the approved PRD.

## P1: GLB pipeline and visual reference

- [x] Author nine original GLB files with embedded original textures, named model templates, PBR materials and articulated cow clips.
- [x] Deterministic export, per-asset hashes and bounded structural/resource validation.
- [x] Bundle pinned Three.js GLTFLoader/OrbitControls locally; add GLB build copying and preview MIME.
- [x] Add isolated prototype build/receipt with content-addressed JS and scoped same-origin/blob asset policy.
- [x] Render actual GLB terrain, 24 beds, tropical vegetation, barn/interior and owned cows in the browser.
- [x] Correct embedded-texture CSP failure found during browser verification.
- [x] Complete closer local visual review and anatomy/material refinement: tapered limbs, beveled cloven hooves, refined head/withers/hips, smaller horn buds and less periodic original textures. The first toy-like capture remains separate.
- [x] Record canonical asset/entry hashes after refinements in model/build manifests. Final kit: nine GLBs, 3,496,116 bytes. These are transfer bytes, not decoded GPU memory.

## P2: playable garden and cow prototype

- [x] Native crop plant/water/harvest/sale adapter and actual native simulation-hour advance.
- [x] Explicit cow starter, feed/water/clean, milking and revision-bound quoted sale adapter.
- [x] Orbit, pan, zoom, area transitions, overview/back and barn roof cutaway; movement follows relocated structures.
- [x] Builder preview, confirm/cancel, move/rotate, native ownership/build and bounded decoration kits.
- [x] Local layout/save bundle UI with text export/import; no test downloads or uploads.
- [x] EN/ID interface, object/button alternatives, desktop and responsive layout implementation.
- [x] Initial offline-artifact browser smoke: 24 beds, opening/camera no writes, explicit two-cow starter, actual model/interior capture, no console/page/request errors.
- [x] Complete garden/cow economic journeys through the visible internal-browser UI: three crop families, lettuce harvest/sale, actual care, opening milk and subsequent production/sale.
- [x] Complete move/build/cancel/import/reload and actual stale-tab browser journeys; original complete farm resumes the same paused data exactly. Legacy V0-V5 mapping remains covered by native fixtures, not a claimed new browser matrix.
- [x] Review desktop and phone-size UI, with horizontal-overflow checks at 320x740, 390x844, 768x1024, 1024x768 and 1440x900. These are viewport checks, not five independent full gameplay profiles or physical devices.
- [x] Record observed scene counters (one interior sample: 453 submissions/draw calls and 391,798 triangles), nine loaded GLB URLs and zero new-origin console errors. No physical FPS/GPU-memory claim.
- [x] Prepare tested source/artifact and V6-compatible rollback plan. Native engine/storage/schema source is unchanged; the original full-farm runtime resumes the prototype's V6 data. Rollback uses an ordinary revert/fast-forward deployment, preserving sidecar and original archives.
- [ ] Deploy via the existing authorized public pipeline and verify public resources/behavior.

## Verification receipts and retained failures

- Domain/storage/placement suite: **21/21 PASS**, including V0-V5 fixtures, native garden and cow economics, archives, OBB collision, bounds, two-key interrupted commits, future/corrupt data, quota and stale tabs.
- Targeted builder/domain/preservation rerun: **25/25 PASS**, `qa-artifacts/glb-upgrade/foundation-tests.log`.
- Strict typecheck PASS at the integration checkpoints.
- Final non-network native suite: **575/575 PASS**, `qa-artifacts/glb-upgrade/native-final.log`. One negotiated-localhost HTTP/cache test was excluded because the environment denies loopback networking; no approval was requested for that test.
- Before the internal-browser-only steering, desktop ID and EN each passed **16 visible journey groups**: complete native garden/cow economics, seed/pump purchases, builder collision/cancel/move/rotate, free kits, text export/import and reload; no page/console/request errors. `qa-artifacts/glb-upgrade/journeys/report.json` retains these results and the failed phone portion.
- The phone run exposed a real touch compatibility click-through: selecting a bed from pointerup immediately scrolled the new Plant button under the pending touch click. Picking now occurs on the completed canvas click. Internal-browser confirmation of this fix is pending; the failed phone run is not counted as acceptance.
- Owner steering: from this point onward use **only the Codex internal browser** for visual/interaction testing, never a personal browser or desktop control. Standalone headless browser runners were closed and will not be relaunched in this task.
- Transient ghost/selection materials, removed crop objects, animation mixers and unused cached GLB resources now have explicit ownership/disposal. Back navigation restores its matching location/context.
- Successful internal-browser receipt: `qa-artifacts/glb-upgrade/internal-browser/preview-report.json`, 23 observed groups on the actual Cloudflare preview. `preview-interior-en.jpg` is an actual internal-browser capture. Phone-size canvas/object selection preserved the exact exported bundle; actual hardware touch/pinch remains untested.
- The first Cloudflare preview `798d8ad` failed GLB fetch because Pages combines CSP values from matching rules. The prototype now explicitly detaches the broad CSP before setting its own scoped self/blob policy. Native routes retain `connect-src 'none'`. Two new header regression tests pass; local header handling now models Pages merge/detach semantics. The failed deployment is retained as history, not accepted visual evidence.
- Initial browser smoke PASS, `qa-artifacts/glb-upgrade/browser-secure/report.json`, one desktop ID profile. This is not the final full browser matrix.
- Initial ordinary headless localhost run failed with `ERR_NETWORK_ACCESS_DENIED`; the internal-browser localhost attempt also timed out. No elevated test run or owner approval was requested. Offline browser integration uses actual dist files through Playwright request fulfilment at a secure synthetic origin, with the prototype CSP. This does not measure server/CDN transport.
- First offline browser attempt used an insecure origin (Web Locks unavailable) and exposed a real blob-texture CSP issue. Retained failure: `qa-artifacts/glb-upgrade/browser/report.json`; corrected secure-origin smoke is separate.
- The first full legacy unit attempt preceded a builder fixture compatibility fix and encountered the localhost cache/HTTP restriction. Targeted and final non-network reruns pass; the excluded HTTP case remains separate.
- The optional external 3D-generation capability returned unavailable-tool errors; no paid generation, external model or texture was used. Original local authoring continues independently.

## Limits and product boundaries

- The prototype reuses the complete native V6 simulation. The broader simplified-economy redesign and all-five-area GLB conversion belong to P3/P4.
- Moving the pump changes presentation; the prototype keeps native irrigation coverage based on original plot coordinates, explicitly disclosed in its panel.
- Decorative kits are free and bounded; native pump and cow upgrades retain their actual coin prices. The prototype does not invent a second currency.
- Cow clips use articulated transform nodes, not a skinned rig. Review animation quality in-game before acceptance.
- No physical-device FPS, thermal/battery, Safari or spoken screen-reader claim. Emulator/renderer observations must be labelled accurately.
- Source registration alone is not proof that the existing public custom domain has deployed. Publication must be verified against the actual owning provider and artifact.

## Publication checkpoint and explicit approval

The source publication helper is `tools/publish-glb-preview.mjs`. Its reviewable operation verifies the existing Git origin `https://github.com/andiwijaya/myfarmtwin.com.git`, validates the selected artifact hashes, creates `codex/glb-prototype-20261115`, stages only the declared release files, commits, and pushes that preview branch. It does not move production `main`. The prepared path/asset/hash list is in ignored `qa-artifacts/glb-upgrade/release/files.json`.

GitHub's connected repository metadata confirms that this repository is public. Publishing its source branch makes the new implementation, authoring scripts and original GLB assets publicly accessible, in addition to the ordinary served runtime files. This disclosure is the specific action that automatic approval review blocked. The user's general deployment instruction remains recorded, but the tool requires more explicit payload/destination consent. No alternate upload path is used to bypass that rejection.

The owner answered the specific disclosure question: **"Ya, publikasikan source dan GLB ke repository itu, lalu lanjut sampai deploy dan test"**. Public source and model publication to that repository/branch is now explicitly authorized; do not ask the same permission again.

Prepared deployable TAR.GZ: `C:/Users/andi_/.codex/visualizations/2026/11/15/01a1dd60-e3b2-75c2-9c7c-a2d08361b7c6/myfarmtwin-glb-prototype.tar.gz`. SHA-256: `1c9b481aa53d8eae32d1980072da486780122d594f9d8c5daa98409c0b72d53c`. The official Sites packaging helper created this local artifact; it is not a deployed version. Archive inspection confirms the existing editorial site, all nine GLB models, hosting manifest and the new `/play/glb/` prototype output.

Resume the same preview publication, verify the prototype through only the Codex internal browser, confirm the mobile tap-through fix, review the remaining responsive/legacy/conflict/error scenarios that are available through that browser, then promote the tested artifact to production and verify its public receipt/resources. Do not count the current prototype as deployed or its final browser matrix as complete.
