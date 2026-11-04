# Goat Ranch local release gate

M7-F01 PASS. Gameplay source checkpoint: `e42c679df02e0e41befcbed4bf427e82acbc5d49` on `goat-ranch-v1`. Main/origin main remain production baseline `1e140428eba6743817e808676c689ce4ff7fffcf`; no remote write.

Fresh clean build passes lint, typecheck, **169 unit tests**, client audit and exact source/output identity. A final test improvement verifies the Lab growth rate against observed engine ticks, rather than restating the implementation formula. All 58 client files match `dist/play`; no dependency, runtime import, media, Cloudflare/security/workflow or non-game site-output change.

All **19 Goat browser suites / 154 scenarios** pass on the hardened application. They cover entry races, missions, care, shared Market quotes/sale/restocking, both paddocks, shelter/container upgrades, maximum herd, import/export, clock behavior, unavailable/corrupt/future/poisoned storage, two tabs, full three-area gameplay, EN/ID, keyboard, Chromium/Firefox, portrait/landscape, reduced motion, low graphics and camera/picking. Original full crop/data/recovery/black-box E2E passes again on this exact application. Original Chicken/site/homepage/SEO/cache/compatibility evidence remains valid; protected output is byte-identical.

Release review reproduced and fixed a malformed import containing a Goat chapter reward before the first visit, which could poison later ranch entry. Unvisited/unknown Goat reward ledger namespaces, paid pre-starter chronology and future transaction revisions now reject before entering gameplay. Original bytes remain protected. Dedicated model and fourteen actual browser storage scenarios verify the fix. Client-side validation is consistency protection, not cryptographic anti-cheat.

All 32 real-command 7/30/60/90-day balance scenarios pass after the fix. Final maximum-Goat stress recheck passes all four desktop/throttled-mobile standard/low-graphics profiles at 59.2–60 FPS; each also advances thirty browser game days with bounded memory. This is local headless/emulated testing, not physical-device FPS.

Final assets: **322,524 bytes raw / 122,011 summed per-file gzip bytes**, within the explicitly reviewed three-area 350KB/130KB caps. The asset-size growth from the Chicken baseline is documented in GOAT_PERFORMANCE.md; no new dependency or media was added.

Evidence outside Git:

- `task-2/qa/goat/M7-F01-core/`: fresh build, units, audit and balance.
- `M7-F01-browser-index.json`: nineteen suite reports, 154 scenarios.
- `M7-F01-entry/`, `M7-F01-progress/`, `M7-F01-resilience/`: complete final browser reruns.
- `M7-F01-hardening/`: reproduced/fixed import edge, storage and balance.
- `M7-F01-original/`: final original full E2E.
- `M7-F01-performance/`: final source performance/asset-size report.

Backup/rollback gate M7-F02 is next. Push, deploy, production live tests and deployed-release report remain unauthorized and unchecked.
