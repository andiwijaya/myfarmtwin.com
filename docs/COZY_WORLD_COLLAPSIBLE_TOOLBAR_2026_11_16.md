# MyFarmTwin compact collapsible toolbar — 16 November 2026

Status: implemented, tested in the internal browser, deployed and verified on the main game.

## Result

The bottom controls now start collapsed as one compact bar on phone and desktop. The bar keeps current farm day/time and coins visible, with translated Buka/Tutup or Show/Hide labels. Native details/summary supplies pointer and Enter/Space interaction. Expanded controls use tighter spacing and one navigation row; at the narrowest width the area row can scroll horizontally instead of forcing page overflow. All controls stay below the 3D viewport.

Placement and live status are siblings outside the disclosure. Folding does not hide or cancel a placement draft. The camera's ResizeObserver now updates projection/render dimensions without resetting orbit/zoom; the actual window-width listener retains overview refitting for a real width/orientation change. Height-only changes preserve the pose. That listener belongs to the renderer's existing AbortController lifecycle.

No simulation, balance, model, storage schema, save key or game command changed. The mini day/coin values read current state through render(), and labels translate with the rest of the UI. The toolbar defaults closed after reload; its open state is presentation state rather than saved economic progress.

## Measured internal-browser layouts

| Viewport | Collapsed farm height | Expanded farm height | Additional height when closed |
| --- | ---: | ---: | ---: |
| 320×740 | 499.2 px | 309.5 px | 189.8 px |
| 390×844 | 603.2 px | 353.1 px | 250.1 px |
| 768×1024 | 755.4 px | 546.9 px | 208.5 px |
| 844×390 | 258.7 px | 258.7 px | 0.0 px |
| 1024×768 | 499.4 px | 318.7 px | 180.7 px |
| 1440×900 | 631.4 px | 422.9 px | 208.5 px |

Both states passed on every measured size with no horizontal page overflow, canvas/control intersections or overlapping toolbar buttons. Short landscape retains the minimum scene height and benefits from less page scrolling. These are CSS viewport measurements in the internal browser, not physical-phone benchmarks.

## Actual acceptance

Nine preview groups passed: the six closed/open layouts; native Enter/Space; manual overview orbit/zoom/pan retained across close/reopen; height-only viewport pose retention; active placement preserved outside the disclosure with exact cancel; English/Indonesian and mini-value equality; reload closed with exact save; all seven destinations plus market interior; and actual resource parity for both candidate and preserved primary game.

The internal browser displayed a lookalike-domain warning for the Cloudflare preview hostname. Ignore was never selected. Its recommended Go to myfarmtwin.com action opened the legitimate site. A temporary /play/toolbar-preview/ route then hosted the exact candidate JS/CSS while the normal game retained all 13 restored primary resource files from the prior release. Both actual browser integrity pages passed 30 resources, with old entry app-S342P2LL.js still serving the normal game during preview acceptance. After acceptance, the normal build restored the new entry and the temporary route/header rules were removed. Final candidate JS/CSS byte parity was checked, and HTML body parity differed only by preview asset URL prefixes.

All preview and final UI acceptance used the official canonical origin in read-only mode. Existing player exports were compared only in memory; no raw player bytes were written to fixtures, archives, documentation or receipts. There was no import, time advance, area starter, purchase, sale, planting or placement commit. Actual local screenshots show the existing farm and were not published as repository assets.

Production was checked again at 390×844 and 1440×900 in both states. Enter/Space, camera pose retention and exact save equality passed. The actual canonical integrity page fetched and SHA-256/MIME-checked all 30 final resources, including 22 GLBs; production-bundle error/warning logs were zero. Build, strict typecheck and the four existing delivery/header checks passed. No broad domain regression rerun or implementation-mirroring test was added for this layout change.

## Release identity

- Tested candidate source: `373133adad0e94565a2f786f04bd9695d598bbe1`.
- Official-domain staging source: `b33ef2cbc673f9e9c74898c75661146a0ce2cb0a`, deployment `6aa438bf-c978-487a-a533-a37ade27dfbc`.
- Final production source: `ec5672789c60f0c1e89e3fbe6d2feb486c5d24c0`.
- Final Cloudflare deployment: `e226287d-12d1-4068-a628-59d2b4f13e8a`; native GitHub Cloudflare Pages check 133323947545 reached completed/success.
- Game entry: `app-4EV74STN.js`; URL: https://myfarmtwin.com/play/ .
- Actual public hashes and bounded results: `COZY_WORLD_COLLAPSIBLE_TOOLBAR_2026_11_16.json`.
- Real captures: `qa-artifacts/cozy-collapse-20261116/production-phone-collapsed.jpg`, `production-phone-expanded.jpg`, `production-desktop-collapsed.jpg`, `production-desktop-expanded.jpg`.
- Archive: `myfarmtwin-collapsible-toolbar-20261116.tar.gz`, 18,386,283 bytes; SHA-256 `06dee28bf7aec2f77411bed7a6a144497266750277d440d900064a8a1d549830`. All 301 static game files are byte-identical to final dist; the official packager adds one normalized hosting metadata file. No temporary preview route or QA/player save is included.

Evidence-only documentation commits after the production commit do not change the released application. Physical phones, Safari, native touch/pinch or virtual keyboard/browser chrome, spoken screen readers, thermal/battery and hardware FPS/VRAM were not measured. No desktop takeover, standalone browser, clipboard, upload, download or warning-bypass test was used.

## Checklist

- [x] Compact initial toolbar on phone and desktop.
- [x] Native accessible collapse/expand with current day/coin summary.
- [x] Larger farm viewport with every control outside the image.
- [x] Camera and active draft preserved through folding.
- [x] Internal-browser preview and final production checks completed.
- [x] Exact final resource hashes, package verification and save equality recorded.
