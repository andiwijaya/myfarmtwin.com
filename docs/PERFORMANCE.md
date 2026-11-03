# V1 performance evidence

Measured locally 3 November 2026, Chromium 153.0.8010.12, Windows laptop / Intel i7-1255U (10 cores, 12 logical processors) / Intel Iris Xe / 23.7 GB RAM. No physical Android device was available; these are headless desktop and throttled viewport proxy results, not a claim of measured Android FPS.

19 game files including the guide thumbnail: **137,608 bytes raw**, **57,429 bytes gzip-equivalent** (sum of individually compressed files, not a promise of a particular CDN transfer encoding). Zero runtime dependencies. FarmGirl derivative is 192×288 WebP, **16,542 bytes**, technically resized/encoded from the approved existing PNG; the original **2,696,636-byte** media is unchanged and retained. Own geometric SVG art needs no additional world assets.

| Profile | Mode | First interaction | Average frame cadence | P95 frame interval |
|---|---|---:|---:|---:|
| Desktop | Full | 240 ms | 60.0 FPS | 16.9 ms |
| Desktop | Low | 216 ms | 60.0 FPS | 16.9 ms |
| 390×844, CPU 4×, 150 ms latency, 1.6 Mbps | Full | 1,668 ms | 44.3 FPS | 66.6 ms |
| Same proxy | Low | 1,650 ms | 50.4 FPS | 33.4 ms |

Cold load to first valid plot selection. Stress scene: imported 90-day save, eight beds, active pump, plot selections every 200 ms over ~2.4 seconds; requestAnimationFrame intervals recorded during those state/UI/storage operations. CDP CPU/network throttling is documented by [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). Local server sends uncompressed assets; production compression may differ. Frame callback cadence on a laptop cannot reproduce a phone's GPU, thermal or browser characteristics.

Desktop ≥50 and proxy ≥30 targets passed; low mode is available and persisted. Physical medium-Android performance remains an explicit verification limit under the PRD's environment fallback rule. Reproduce with `npm run performance`, configured existing Chromium binary via PLAYWRIGHT_CHROMIUM_EXECUTABLE. Raw evidence: task-2/qa/performance.json outside Git. No continuous rendering loop is needed between actions except small CSS effects; reduced motion removes them.
