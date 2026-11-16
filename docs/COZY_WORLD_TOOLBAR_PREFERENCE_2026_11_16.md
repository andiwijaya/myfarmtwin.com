# MyFarmTwin remembered toolbar choice — 16 November 2026

Status: implemented, tested in the internal browser, deployed and verified on https://myfarmtwin.com/play/ .

## Behavior and scope

The native toolbar disclosure restores the last expanded/collapsed choice from the browser-local UI key `myfarmtwin.ui.toolbar-expanded.v1`. Only the explicit `expanded` value opens it; a missing or unsupported value keeps the collapsed default. The preference is shared by paths on the same origin, including `/play/` and `/play/glb/`. Existing open tabs retain their current visual state; refreshing reads the latest stored choice.

Restoration happens before renderer initialization. The last-observed boolean is initialized from the restored DOM state before binding native toggle. That skips the queued restoration event and avoids overwriting a newer choice from another tab. Each actual state transition writes the current open state. There is no unconditional pagehide write. Optional storage read/write errors are contained so the native control continues working.

The change is in `game/client/cozy-app.js`. No farm key, economic state, save schema, simulation, model, camera behavior or toolbar layout was changed. The new UI key is ignored by existing farm-conflict listeners and excluded from farm exports. Storage-failure fallback is source-reviewed; no browser quota or storage-denial injection was performed.

## Actual internal-browser acceptance before activation

Eleven recorded groups passed through a temporary path on the official domain, while all 30 primary public resources and the primary receipt remained byte-identical to the preceding release:

- Expanded choice survives refresh.
- Collapsed choice survives refresh.
- Expanded choice survives closing the owned test tab and reopening a page.
- Collapsed choice survives closing/reopening a page.
- Reload follows the newest choice made in another tab.
- Closing an untouched older tab does not overwrite a newer choice.
- Rapid toggles preserve the final state after reload.
- Language rendering and reload preserve the choice.
- All compared farm exports stay byte-identical.
- Measured 390×844 phone and 1440×900 desktop checks restore the chosen state, with controls below the canvas and no horizontal page overflow.
- Actual browser SHA-256/MIME checks pass all 30 candidate resources and all 30 preserved-primary resources, including 22 GLBs each.

The preview used `https://myfarmtwin.com/play/toolbar-preference-preview/` to avoid the already-observed Cloudflare lookalike-domain warning. No warning was bypassed. Automatic approval initially rejected staging because it interpreted the reference move as activating untested primary-game code. A fresh proof showed all 30 primary bytes and receipt unchanged, the active primary bundle contained no new preference code, and only the isolated preview contained it; the staging action was then approved. No alternate execution channel bypassed that rejection. All eleven required browser groups passed before the actual primary activation.

The final build reproduced the tested JS/CSS bytes exactly and the same HTML body with only asset URL prefixes changed. The temporary preview files, cache rules and Git attributes were removed from the final artifact.

## Production verification

- Source: `a1268cc22167ba8b695919db48180b2685db356e`.
- Cloudflare deployment: `d149cde0-6065-4471-8856-15ab6e482066`; native GitHub Cloudflare Pages check 133333478091 reached completed/success.
- Game entry: `app-4PURYOGI.js`.
- Live expanded/collapsed refresh, expanded/collapsed same-route tab reopen, desktop expanded refresh, shared alias preference and final collapsed reload passed.
- The actual canonical integrity page passed 30/30 SHA-256/MIME resources, including 22 GLBs. Current production-bundle errors/warnings: zero.
- Original player farm export comparison remained exact. No farm command, starter, import, purchase, planting, time advance or placement commit occurred. Raw player save bytes were compared in memory only and never written to a fixture, artifact, report or repository.
- Real captures: `qa-artifacts/cozy-toolbar-preference-20261116/production-expanded-after-refresh.jpg` and `production-collapsed-after-refresh.jpg`.
- Source build/typecheck and four existing delivery/header checks passed. The preference change did not justify repeating unrelated gameplay regressions or adding implementation-mirroring unit tests.

The final test choice is collapsed, matching the prior initial presentation. Browser-local UI choice persists separately from farm progress. Physical phones, full browser-process restart, private-mode retention, spoken screen readers and induced unavailable storage were not tested. Refresh and actual tab close/reopen were tested using only the internal browser. No desktop takeover, standalone browser, clipboard or file-transfer test occurred.

## Artifact and record

`myfarmtwin-toolbar-preference-20261116.tar.gz`, 18,386,137 bytes; SHA-256 `e29c7d864525546e823bdb332d204268900b08197ab8c6bbe459eb755090a4cc`. All 301 static game files match final dist bytes; one normalized official hosting metadata file makes 302 total. No temporary preview or QA/player save is included.

The machine-readable receipt is `COZY_WORLD_TOOLBAR_PREFERENCE_2026_11_16.json`. Evidence-only documentation commits after the production application commit do not change the live bundle.

## Checklist

- [x] Restore and store the final native disclosure choice per browser/origin.
- [x] Keep UI preference separate from farm progress and conflict detection.
- [x] Verify both choices through refresh and actual tab reopening before activation.
- [x] Verify last-choice ordering across tabs and rapid toggles.
- [x] Deploy the tested exact bundle and verify the canonical live page.
- [x] Record exact save equality, public hashes and actual screenshots.
