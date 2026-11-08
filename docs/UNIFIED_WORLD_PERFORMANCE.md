# M7-F06 — measured startup and long navigation

The preview now prepares its map from **one validated native save session** before downloading the larger gameplay UI entry. Both entries share the actual session module. Camera/Objects work while care controls are explicitly disabled and labelled as loading. Native control attachment preserves the existing Scene/camera; it starts the single original three-second simulation interval after initialization. Atlas downloads and cosmetic animation wait for control attachment so they do not compete with that entry. Visible progress distinguishes control loading, animal art and a failed UI download; HTTP503 leaves an honestly labelled read-only map with a reload link.

The native load/migration/lock behavior was moved unchanged into `game-session.js`; schema V5 and `myfarmtwin.save.v1` remain unchanged. A freshness check catches another tab writing during the presentation/UI handoff. Original gameplay commands, economy and domain sources are unchanged. The default classic entry fetches no optional Three renderer. Build receipts include transitive native chunks and retain safe, hash-verified pruning; standalone graphics helpers resolve the same pinned local CPU classes.

## Controlled 60-second windows

`qa-artifacts/unified-m7-controlled/feasibility.json`, Chrome 156.0.8078.80 on the connected laptop. Each profile uses a new disposable context. Mobile uses Pixel 5 UA/touch/DPR 2.75, CPU **4×**, 150ms latency and 200,000 B/s download (1.6Mbps); Auto rendering caps pixel ratio at 1.25. HTTP bodies are uncompressed, matching the observed live `no-transform` transport. All owned sprites finish loading before the cadence window. No other assistant QA ran during these controlled windows.

| Profile | Interactive core map | Native controls | Actual render submissions/s | Observer RAF p95 |
|---|---:|---:|---:|---:|
| Desktop WebGL | 206ms | 300ms | 60.0 | 17.0ms |
| Desktop Canvas | 211ms | 296ms | 60.0 | 16.9ms |
| Mobile emulation WebGL | 3,492ms | 5,252ms | 60.0 | 16.8ms |
| Mobile emulation Canvas | 3,499ms | 5,257ms | 48.9 | 33.4ms |

Core map meets the 5,000ms budget; trusted camera pointer-up→heading response measured 38.6/42.4ms on mobile. Mobile animal art completed around 8.5s; WebGL driver readiness around 10.8s. These are separate phases: **the completed animated WebGL scene is not claimed ready within five seconds**. The local cadence proxies exceed 50/s desktop and 30/s mobile. They are successful submissions and RAF observations, **not measured physical-display FPS**. Total observed HTTP resource transfers were 2.71MB desktop WebGL and 1.76MB mobile WebGL (plus the small HTML document), within the 3MB target.

Initial uncompressed startup failed: 5,237ms WebGL / 5,847ms Canvas. Priority hints alone did not fix it. The progressive shared-session entry and gated atlas loading address that failure; care UI readiness improved from roughly 8s in the first progressive attempt to 5.3s. Initial one-second diagnostics and CPU-profiler runs are retained as diagnostics, not FPS acceptance evidence.

## Actual 15-minute profiles

`tools/unified-animation-soak.mjs` ran the **original interval with no mocked clock**, native serialized-state/ledger comparison throughout, camera navigation, locale changes and four normal/Low transitions per profile. Resource-continuity stress may overlap other isolated QA; it is separate from the controlled cadence windows above.

| Profile | Measured wall duration | Accepted real ticks | Camera moves | Post-GC JS heap growth | Post-GC backing growth |
|---|---:|---:|---:|---:|---:|
| Desktop | 900,758ms | 300 | 85 | 2.96MiB | 12.01MiB |
| Mobile emulation, CPU4×/4G | 901,578ms | 301 | 86 | 2.77MiB | 0.01MiB |

Both profiles retained one Scene/camera, one canvas at a time, one simulation interval and at most one owned cosmetic RAF. Full original state/RNG/weather/ledger and final reload matched exactly; no historical/duplicate animals, leaked context, uncaught error or runaway growth. Final WebGL counters reported four geometries, four textures and four programs; **these are object counts, not VRAM bytes**. Desktop backing growth reflects the bounded additional Low atlas cache. Reports and actual final captures: `qa-artifacts/unified-m7-soak-{desktop,mobile}/animation-soak.json`. Both profiles verified the unchanged build receipt `41404722979eaee46527cb7d84a2c86b08cd88f26fd45179d889473f229b07c8`.

## Safety regression and limits

- `qa-artifacts/unified-m7-startup-final-all/startup.json`: 12/12. Eight held-controller handoffs prove the original HUD/state, no grants/primary writes, same camera/Scene and zero→one native clock. Two HTTP503 cases remain read-only. Two actual cross-tab harvests during handoff are detected before accepting a stale action; reload keeps the new revision.
- `qa-artifacts/unified-m7-startup-preferences/preferences.json`: 12/12 invalid/read-denied/write-denied UI preferences preserve a native harvest and reload.
- All 482 unit tests and the classic full E2E (tutorial, data, archives, invalid/future saves, concurrency, unavailable storage, homepage/editorial routes) passed. The miniature bundler fixture was updated to include the new entry and prove actual shared-session identity, transitive receipt coverage and retained local helper imports.
- Frozen 126 original files, seven V0–V5 fixtures, editorial/24 original media/eight atlas and build audits passed. The feature remains hidden behind `?world=unified-preview`; no push/deploy.

Physical Android/iOS, Safari, thermal/battery behavior, a physical display FPS measurement and a screen-reader user study are unavailable. The measured GPU is the laptop's Intel Iris Xe through ANGLE, **not an Android GPU**. Optional `Win32_Processor` CIM utilization access was unavailable; that query was stopped without retry. Host utilization/thermal state is therefore uncontrolled. These limits must accompany local readiness and future release review.


## Current M8 candidate: controlled cold/reload and cadence

The current measured build uses canonical receipt SHA256 `d11fe12b51b791cade5599fc7e7afe121185e24d376a788010dcecbe5d09eac0`. These 60-second and 15-minute measurements belong to application `aef4b78d487b2426afd9785457990c79aa27e704`, tree `d690946ecfddf19f37507444b69b434a31f19a63`. Final candidate `ec7a9b5be34b6a5635953799e6118ab8323932a7`, tree `6d1d854fdfbfc20f42d7780a1eec29c181c074c5`, adds only the scoped visible-startup CSS correction described below; renderer/engine JavaScript is byte-identical. Old reports retain their actual receipt identity. `qa-artifacts/unified-m8-render-critical-controlled/feasibility.json` passes four sequential60-second Chrome156 profiles, followed by same-context reloads, with no concurrent assistant QA. The receipt is checked again at completion to reject mixed builds. Mobile uses Pixel5 UA/touch/DPR2.75 on the laptop, CDP CPU4×,150ms latency and200,000B/s download; it is not Android hardware.

| Profile | Cold map | Reload map | Cold/reload trusted heading response | Mean / median actual render submissions/s |
|---|---:|---:|---:|---:|
|Desktop WebGL|207ms|262ms|9.5 /17.2ms|60.0 /60.0|
|Desktop Canvas|214ms|288ms|7.2 /17.2ms|59.2 /59.0|
|Mobile emulation WebGL|3879ms|3878ms|96.6 /61.1ms|55.1 /56.0|
|Mobile emulation Canvas|4037ms|3827ms|63.6 /68.8ms|38.4 /38.4|

The5,000ms core-map,100ms heading,50/s desktop and30/s mobile gates all pass. Median is the median of approximately one-second actual-submission buckets in a60-second window. RAF cadence and successful render calls are browser proxies, **not physical display FPS**. Each profile retains exact native save/ledger, one original interval and reduced-motion stop/resume. Post-GC JS growth is0.15–0.37MiB in these windows.

| Mobile profile | Cold care controls | Cold all-owned art | Observed WebGL ready | Reload care / art / WebGL |
|---|---:|---:|---:|---:|
|WebGL|5960ms|9334ms|12190ms|5967 /9355 /12120ms|
|Canvas|5994ms|9383ms|n/a|5809 /9121 /n/a|

The completed graphics/care experience is **not** claimed ready within5s. The usable input-bound map precedes care attachment and art/driver completion, with honest loading, disabled care controls and failure/reload messages. Reload means repeat navigation in the same disposable context, preserving the validated primary save. No fresh fixture is written on reload. The local server honors the unchanged `max-age=0, must-revalidate, no-transform` policy and lacks ETag responses; zero browser-cache resource hits were observed. Thus these are repeat-navigation measurements with full response bodies, **not a claimed CDN/cache-hit speedup**. Reload total transfers are2,746,169/2,388,677/1,779,083/1,421,591bytes in the first table's order, each below3MB.

## Changes and retained failures

Final QA originally regressed below50/s desktop Canvas and30/s mobile Canvas, and repeated cold/reload heading responses reached139–197ms. Earlier passes such as `unified-m8-release-controlled` and `unified-m8-final-controlled-v2` do not supersede the later failures. All failed/diagnostic reports remain ignored in QA, including `unified-m8-{controlled,median-controlled,warm-mobile-detail,phase-debug,complete-controlled}`. One superseded `surface-input` run began after a typecheck stopped its intended build; its `SUPERSEDED.txt` explicitly excludes it from acceptance. One-second/profiler runs are diagnostic, not animation acceptance.

The final implementation caches stable projected faces/Path2D objects, world-space normals/shades and renderer-owned sprite blend/tint buffers. One bounded opaque static prefix retains original depth order. Camera/dimensions/light, geometry/material/ownership and transforms invalidate the relevant caches; picking still uses all painted faces. Exact color/normal memoization and direct scalar projection avoid redundant work while original per-stage depth arithmetic preserves coplanar ties. Auto Canvas caps backing ratio at1x and stills nonessential crop wind/water ripples; actual owned animals and native production/weather continue. Explicit High retains its selected detail.

Cold painting remained the expensive phase. Initial read-only loading now keeps actual owned facilities, stock fill volumes, paths, soil/crop bodies and two major shapes per owned animal/cohort. Secondary scenery, small leaves, timber/grass detail and container rims wait until native controls attach, then restore. The sprite adapter replaces primitive animal geometry with the actual loaded owned actors. Enhanced startup checks verify early ownership, zero grants/writes, restored detail, and zero duplicate primitive meshes. This is a progressive map stage, not a static-placeholder animation pass. Full-art cadence is measured only after all owned sprites are ready.

Cue content/visibility changes are batched before size reads, then positions are written together. Raw transform/opacity inputs are memoized so browser CSS serialization does not cause repeated equal writes. GPU driver creation waits for native control attachment. Closed/open toolbar stacking is event-driven; an alternating `:has` A/B **did not** establish a causal performance gain, so that selector is not credited for it. Private inspector CPU-phase elapsed times describe own-browser JS-wall phases, not host utilization or GPU execution time.

Cache/reference offscreen surfaces use the same explicit readback backend; production main Canvas retains its default backend. Earlier unmatched readback/backend heuristics produced false differences even with caches disabled and are recorded as controls. The unculled mesh reference flag was corrected and genuinely retains offscreen polygons. Cached versus uncached same-painter pixels require zero changed channels. The separate legacy projection/perimeter/move-line painter permits at most2/255 on at most0.01% edge channels (minimum allowance16 for tiny buffers); the measured preceding full matrix differed in at most four channels. Numeric positions agree within1e-8 CSS pixels; original depth, hit ownership and native save/ledger remain independently exact. No economy tolerance is introduced.

## Original performance and publication budget

`npm run performance` passes20/20 profiles in `qa-artifacts/unified-m8-classic-performance/report.json`: five areas ×desktop/mobile emulation ×normal/Low, with two ordinary ticks and50 switches per profile. The native maximum-capacity fixture and paired90-day/2160-hour replay pass, peak save323,745bytes. Minimum original-script observer RAF cadence40.5/s, maximum cold/warm interaction4,903/4,222ms, maximum switch p95464ms; no error, external request or budget failure. These6,400ms original-script RAF windows are separate from unified60-second cadence.

The prototype's all-files3MB cap is explicitly revised to5MiB for retained two-LOD art/renderer/rollback publication. Actual initial HTTP transfer still must remain below3MB, default entry below640KiB raw/250KiB gzip-equivalent; cadence, timing, memory, save and switch limits are unchanged. The original performance run measured the preceding default entry at503,886bytes raw/161,569bytes gzip-equivalent, observed initial HTTP transfer507,164bytes. Final canonical default entry after the scoped CSS correction is504,005bytes raw/161,583bytes gzip-equivalent; final game publication is199files/4,019,147bytes. Gzip-equivalent sums are not wire bytes. Canonical final publication totals and receipt/HTTP integrity are recorded in the release-readiness/final QA documents.

## Current real-clock continuity

Both current runs pass in `unified-m8-final-soak-{desktop,mobile}`, with raw receipt SHA256 `acb6fcbb34622f85ae36fe39f078658edb1f7aa0948886221b839a26e446da09` (canonical JSON form `d11fe12b51b791cade5599fc7e7afe121185e24d376a788010dcecbe5d09eac0`).

| Profile | Actual wall duration | Accepted native ticks | Camera moves | Normal/Low transitions | Post-GC JS change | Post-GC backing change |
|---|---:|---:|---:|---:|---:|---:|
| Desktop WebGL |900,338ms|300|85|4|+2.90MiB|+12.01MiB|
| Mobile CPU4×/4G, forced Canvas |905,205ms|303|69|4|−1.62MiB|−0.50MiB|

Each retains23 actual owned actor/cohort representatives, one Scene/camera/canvas/clock, at most one owned cosmetic RAF, exact full native state/RNG/weather/ledger throughout, and exact final reload. Negative deltas are measured post-GC decreases, not zero allocation. Backing storage is a browser counter, not VRAM. Resource stresses overlap other isolated QA and are not controlled FPS. There is no observed runaway growth in this15-minute interval; indefinite/physical thermal behavior is not inferred.

A final CSS-only correction makes the already-created loading/error notice actually visible instead of inheriting the clipped general-status style. No renderer/engine JavaScript changes followed these runs. The rule matches only the startup notice, which is removed before full-art cadence/resource baselines. Final phone cold/reload checks pass again in `unified-m8-visible-progress-loading`: WebGL map4,429/4,080ms, heading64.3/63.7ms; Canvas map3,835/3,955ms, heading65.0/84.7ms. These loading-only runs do not replace the60-second cadence measurements. Final visible-box startup assertions pass12/12, current layout passes16profiles/32normal-and-inset cases, and actual touch loading/error captures were visually inspected. Canonical final HTTP integrity passes221/221 bodies and14receipt digests in `unified-m8-final-visible-package`.


Physical Android/iOS, Safari, thermal/battery tests, display FPS and assistive-technology user trials are unavailable. The GPU is the laptop's Intel Iris Xe through ANGLE, not Android hardware. An optional Win32_Processor CIM-utilization query failed with a client-access error and was stopped without retry; host utilization/thermal state is not claimed. No push/deploy occurred.
