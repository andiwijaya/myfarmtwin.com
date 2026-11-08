# Unified-world final local QA — M8-F07

> Current authorized preview release is **82/82**, source `a5c2e0e`, deployment `63067ffb-e4a4-41e0-8658-8ab2ea7a57a9`. Historical local acceptance snapshot before authorization follows. The later authorized preview publication and live results are recorded in [UNIFIED_WORLD_DEPLOYMENT.md](UNIFIED_WORLD_DEPLOYMENT.md).

Status: **80/82 (97.6%); M8-F07 local QA complete.** M8-F08/F09 remain release holds. No push/deploy occurred. Authoritative PRD: Library `libfile_457bd65eff208191ad529af638e759bb`; living checklist: `PRD_MYFARMTWIN_UNIFIED_3D_WORLD_V1.md`.

Application candidate: `ec7a9b5be34b6a5635953799e6118ab8323932a7`, branch `unified-world-v1`, `dist` tree `6d1d854fdfbfc20f42d7780a1eec29c181c074c5`. Documentation commits may refer to the same immutable application tree. The unified world remains hidden behind `/play/?world=unified-preview`; default visits retain the classic rollback.

## Current source and artifact checks

| Check | Verified outcome / evidence |
|---|---|
| Syntax / types / unit | `npm run lint`, `npm run typecheck`, `npm test`: **486/486**; `qa-artifacts/unified-m1/m8-last-{lint,typecheck,unit}.log` |
| Build | `npm run build` completed for the frozen JS candidate and again for the final scoped CSS correction; only `dist/play` owned output is built |
| Original domain / fixtures | `unified-domain-audit.mjs`: **126/129 original files unchanged**, only main/index/style are permitted original presentation changes; seven frozen V0–V5 fixtures exact, V5/key unchanged, one original interval; final `qa-artifacts/unified-m8-final-visible-domain/domain-audit.json` |
| Default entry identity | Eight of nine default-entry files (all except `style.css`) remain identical to `6818d79`; the final stylesheet adds only a selector scoped to the optional unified startup notice. Classic/engine code and behavior are unchanged |
| Editorial / media / provenance | 24 original files, eight generated atlases, bundle hashes and complete MIT notice pass; final `m8-ec7a9b5-build-audit.log`, manifest verification |
| Cleanup | Six exact receipt-owned vendor files, no raw core/maps or tracked QA, pinned Three.js0.187.0 and all six classic rollback readers retained; final `qa-artifacts/unified-m8-final-visible-cleanup/cleanup.json` |
| Canonical artifact integrity | **221/221 HTTP bodies, zero mismatches; 14/14 default/emitted receipt digests**, against final Git-materialized canonical bytes; `qa-artifacts/unified-m8-final-visible-package/package.json` |

Logs without an explicit directory above live in `qa-artifacts/unified-m1`. QA captures, fixtures and generated reports remain ignored, outside production tracking. No memory files or personal browser saves were modified.

## Full original-project regression and resolved failures

The complete original ten-script lane ran E2E, compatibility, balance, endurance, SEO, security, homepage, Chicken, homepage cache and client audit. Initial `unified-m8-regression/general.json` honestly contains seven passes and three failures; corrected runs supplement it without overwriting failures:

| Failure | Correction / verified rerun |
|---|---|
| Missing requested bundled Firefox executable | Reused the installed Firefox155 executable explicitly, no installation; Chrome matrix and actual Firefox classic vertical slice pass in `unified-m8-compat-repeat` |
| Balance source identity changed during a startup repair | Repeated with frozen source: 26 policies ×90 days pass in `unified-m8-balance-repeat/report.json` |
| Homepage compared an older game baseline without its game-change flag | Used existing `GAME_CHANGE_UNDER_TEST=1`; 24 surfaces and three fallbacks pass in `unified-m8-regression-repeat/homepage`; frozen editorial/media audit remains separate |

Classic async loading initially exposed locale before native handlers attached. The loader now makes the farm inert and locale unavailable until the real controller is ready, with a loading/error/reload message outside the inert farm. Held/HTTP503 desktop/touch cases and full classic E2E pass. Cow's full batch initially passed16/17 before the same locale race affected Lab; all four EN/ID desktop/touch Lab repeats pass (`unified-m8-cow-lab-repeat`). Goat's eight full suites, Fish's eight five-area suites and Chicken's eight release gates pass. Native balance/endurance/save/seeded-replay source files remain unchanged.

The latest seven original-interface groups **all pass** in `unified-m8-current-general/general.json`: full E2E, Chrome/installed Firefox compatibility, SEO, security, homepage, homepage cache and client audit. Firefox coverage is the classic interface; unified rendering is tested in Chrome. Original `npm run performance` also passes20/20 capacity-stress profiles, with genuine shared ticks and50 area switches each (`unified-m8-classic-performance/report.json`). Publication budget changes and exact measurement scope are explicit in `UNIFIED_WORLD_PERFORMANCE.md`.

## Unified gameplay, graphics and accessibility

The full five-area UI journey passes **8/8 profiles, 1,880 actual UI commands, nine game days per profile**, identical native state/ledger and final2,708coins. It covers all-area care, real original-clock work, production, original Market sales and one scene/camera/canvas/interval (`unified-m8-current-regression/five-area`). The final follow-up only changes optional presentation during loading and cue painting; native/default-entry code remains identical. Targeted browser checks were rerun on that final build.

| Final presentation check | Verified result / evidence |
|---|---|
| Progressive startup | **12/12** in final `unified-m8-visible-progress-startup`: readable/unclipped loading and error notice, held-controller map/HUD, truthful disabled care controls, early owned bodies, restored detail, no duplicate primitive meshes, zero to one native clock, HTTP503 recovery, other-tab harvest and stale action rejection |
| Final responsive layout | **16 profiles /32 normal and simulated-safe-inset cases**, `unified-m8-visible-progress-layout/responsive.json`; actual care/menu reachability, 44px targets, one canvas/clock and exact native saves |
| Input / HTML alternatives | **18 profiles /90 original commands** in `unified-m8-frozen-followup/input`, desktop/portrait/short landscape, EN/ID, WebGL/Canvas/all-graphics-unavailable simulation, keyboard/drag/pinch, close focus and usable original care |
| Cache / original projection | **64 views +80 pose/tint/visibility/camera/geometry/background cases** in `unified-m8-frozen-followup/projection`; zero cache/reference changed channels. Legacy path rounding is separately bounded; numeric positions agree within1e-8CSSpx, original depth and saves remain exact |
| Quality / context / visibility | Four profiles each pass in `unified-m8-frozen-followup/{quality,context,visibility}`; actual WebGL loss/Low/retry and same-scene Canvas preserve state |
| Shell lifecycle |20 remounts +2 injected failures pass, `unified-m8-frozen-followup/lifecycle` |
| Picking | Eight current WebGL profiles pass in `unified-m8-frozen-followup/picking`; the earlier final-renderer validation also passes eight WebGL-disabled Canvas profiles in `unified-m8-picking-canvas-current` |
| Native stock / import cues | Eight profiles pass in `unified-m8-frozen-followup/cues`; actual native amounts/eligibility/fill geometry, no delivery merely from toggling, import clearing/restoring and exact reload |
| Actual native effects | Four profiles pass in `unified-m8-frozen-followup/effects`; accepted receipts and original shared-tick pump/aerator work, no work from looking/toggling, no replay after import |
| Menus | Eight profiles pass in `unified-m8-frozen-followup/menus`; original six menu functions, export, focus return,44px targets and exact commands |
| Animal contacts | Eight profiles /128 actual sprite picks /64 expanded touch points pass in `unified-m8-current-regression/contact`; actual poses, feet/shadows, roofs/water and four headings |
| Full visual matrix |48 profiles /384 views and48 reviewed contact sheets in `unified-m8-visual`; current targeted stage/care/loading captures supplement it. Animal atlas art is unchanged |

All browser profiles use synthetic isolated saves. Touch/safe-inset/orientation cases are emulation. Actual current short-landscape care Close and portrait world captures were visually rechecked. Pixel reference controls are genuine offscreen renders; labelled synthetic mutation fixtures are not represented as production gameplay or physical-device screenshots.

Older picking/cue/effect scripts initially addressed controls now inside closed disclosures. They were updated to use actual visible user paths, with no force clicks or application workaround. An intermediate hen pixel was behind another real hen; the repaired picking test clears prior selection and finds an independently frontmost opaque pixel via Three raycast before trusted input. Initial failed aggregates remain retained (`unified-m8-current-regression`, `unified-m8-ui-path-repeat`); later targeted passes are not falsely described as green original aggregates.

One concurrent-stress startup run passed11/12, then timed out waiting for control attachment in the return-from-another-tab case. The repeat explicitly foregrounds the isolated test tab before input and passes12/12 with exact other-tab save/stale rejection. The successful repeat recorded `document.hidden=false` at return; the isolated timeout's exact scheduling cause is not claimed proven. No stale economic write was accepted. The failed log remains in `unified-m8-frozen-followup/startup`.

## Performance and continuity

The four sequential60-second profiles plus same-context reloads on application commit `aef4b78` (before the scoped CSS-only correction described below) pass in `unified-m8-render-critical-controlled`. Desktop mean/median submissions per second: WebGL60.0/60.0, Canvas59.2/59.0. Mobile CPU4×/4G: WebGL55.1/56.0, Canvas38.4/38.4. Cold map3.88/4.04s, reload map3.88/3.83s; cold heading96.6/63.6ms, reload61.1/68.8ms. Each preserves one interval, exact primary save/ledger and reduced-motion stop/resume.

Care controls are ready around6.0s cold, owned art around9.3s, WebGL observed around12.2s: **completed graphics are not claimed ready inside5s**. Reload used the unchanged revalidation policy and observed zero browser-cache resource hits; it is repeat navigation, not a CDN cache-hit benchmark. Successful render/RAF cadence is not physical-display FPS. Detailed failures, cold/reload phases, adaptive loading and explicit whole-publication/core/transfer budgets are in `UNIFIED_WORLD_PERFORMANCE.md`.

The frozen desktop and CPU4×/4G forced-Canvas15-minute runs on `aef4b78` (before that CSS-only correction) both pass in `unified-m8-final-soak-{desktop,mobile}`:900,338ms/300 ticks/85 moves and905,205ms/303 ticks/69 moves, four normal/Low transitions each. Full state/RNG/weather/ledger and final reload match exactly, with one Scene/camera/canvas/clock and at most one owned cosmetic RAF. JS/backing changes are+2.90/+12.01MiB desktop and−1.62/−0.50MiB mobile; negative values are measured post-GC decreases. Raw receipt remains`acb6fcbb34622f85ae36fe39f078658edb1f7aa0948886221b839a26e446da09` throughout. These continuity stresses are not controlled FPS measurements.

## Release boundary and unrun scope

Remote main was rechecked read-only at `fffc13516c1e8e19c5131d9c26b808eb51f6ed20`. An earlier candidate/public equality crawl failed as expected for unpublished output; it is not a live release pass. Provider binding/current pipeline and explicit release authorization remain unverified holds for M8-F08/F09. No force push, push, deployment, Actions run, DNS/credential change or alternate publishing path was used. Default remains classic; rollback retains V5 saves/backups/archives/quarantine and original assets.

Physical Android/iOS, Safari, thermal/battery/display-FPS measurements and assistive-technology user trials were not run. Optional host CIM CPU-utilization access was unavailable and stopped without retry; host utilization is not claimed. See `UNIFIED_WORLD_RELEASE_READINESS.md` for the concrete release/rollback plan.


### Final visible-progress correction

Visual review found the loading/error paragraph inherited the general status clipping rule. A narrowly scoped CSS exception now gives it a real readable flow box. It does not alter renderer/engine JavaScript, and the notice is removed before the full-art cadence/soak baselines. Final phone loading-only repeats pass in `unified-m8-visible-progress-loading`: cold/reload maps4.43/4.08s WebGL,3.83/3.95s Canvas; headings64.3/63.7ms and65.0/84.7ms. No cache-hit speedup is claimed. Final startup checks assert width/height and unclipped positioning; all 16 layout profiles /32 inset cases pass, and the actual touch loading and injected-error/reload captures were visually reviewed. The prior15-minute and60-second artifacts keep their actual earlier receipt identity; they are not relabelled as measurements of a later tree.

Final canonical publication: **199 game files /4,019,147 bytes**; default entry **504,005 bytes raw /161,583 gzip-equivalent** (gzip-equivalent is not observed wire transfer). The default entry remains below 640KiB/250KiB and measured initial transfers below 3MB. The immutable candidate above is the application/source commit; this documentation completion does not rebuild or change its dist tree.
