# Three-area performance gate

Twelve local headless Chromium runs PASS: Field/Chicken/Goat × desktop/throttled-mobile × standard/low graphics. Stress state has eight crop beds, six hens, eight goats, two paddocks, care upgrades, large shelters, pump and 96 Goat history samples. Goat runs additionally advance 30 browser game days after the selection/frame benchmark; DOM and garbage-collected heap remain bounded.

- Desktop: 59.6–60 FPS; first interaction 229–389ms.
- Mobile emulation (390px, CPU ×4 slowdown, 150ms latency, 1.6Mbps): 43.4–59.2 FPS across all areas. Goat is 47.3 FPS standard / 57.5 FPS low graphics; first interaction 4.517s / 4.378s.
- Goat DOM 708→713 nodes after 30 browser days. Retained heap about 2.6→4.1MB. Existing limits remain ≥50 desktop / ≥30 emulated-mobile FPS, bounded DOM and <20MB retained growth.
- 58 client assets: 320,753 bytes raw, 121,460 bytes summed per-file gzip equivalent. No new runtime dependency or media asset.

The existing Chicken-only asset budgets (240KB raw / 95KB summed gzip) were explicitly reviewed for the third area rather than silently reported as passing. Production baseline is 226,780 bytes raw and approximately 87KB summed gzip. Goat adds about 94KB raw / 34KB gzip for the model, migration, bilingual UI, SVG world and optional explanations. New three-area caps are **350KB raw / 130KB summed gzip**; frame, latency, memory and functionality requirements were retained. Existing Cloudflare compression/settings were not changed. This is an asset-size increase, not a claim of zero performance cost.

The 7–90-day deterministic balance/endurance matrix also passed with bounded serialization. These are local laptop/headless and emulation measurements; physical Android/iOS FPS is not measured. Evidence: `task-2/qa/goat/M6-F05/performance.json` and `performance.log`.
