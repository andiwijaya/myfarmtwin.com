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

`tools/unified-animation-soak.mjs` ran the **original interval with no mocked clock**, native serialized-state/ledger comparison throughout, camera navigation, locale changes and four Low/High transitions per profile. Resource-continuity stress may overlap other isolated QA; it is separate from the controlled cadence windows above.

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
