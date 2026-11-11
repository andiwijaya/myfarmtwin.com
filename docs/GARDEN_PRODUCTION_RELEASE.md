# Garden production release

Acceptance is complete: **22/22 (100%)**, audited 11 November 2026 at 21:40 WIB.
The final release provides **24 immediately active functional beds** for new and
existing players, five-stage corn, real 3D crops, shared geometry, visual growth,
wind and harvest feedback. Original crops, funds, seeds, inventory, ledger,
missions, clock, RNG and other areas survive the additive player-layout upgrade.
Exact original save bytes are retained before writing. Schema remains V6.

Production source: `d4025da144ead1754119ae6e5a1839983838ebfd`.
Cloudflare deployment: `e63311c4-295b-4117-b6d4-9d635f3f6ac4`, successful
2026-11-11T14:22:33.633382Z (**21:22 WIB**).
[Public game](https://myfarmtwin.com/play/) ·
[Immutable production](https://e63311c4.myfarmtwin-com.pages.dev).

Canonical dist tree: `424b4dfa5285377c0fea6228d6719f5a23b811b0`.
Raw build receipt SHA256:
`320923541ea6685deb157ea1193161a1191f722fb04e8f3da858104e63323770`.
All **247 packaged files** match the isolated final artifact and canonical Git
bytes. All **246 served resources per origin** match on public, www and immutable
origins. All twelve checked JS/CSS objects are compressed, and the successful
GitHub Cloudflare check identifies this exact source/deployment.

The existing GitHub-main-to-Cloudflare pipeline performs ordinary non-force
fast-forward deployments: empty build command/root and `dist` output. Provider
settings, DNS, security headers, dependencies, original editorial pages and older
assets remain unchanged. Homepage hero/social captures are actual unedited game
pixels; their original capture receipt and publication provenance are retained
in GARDEN_HOMEPAGE_CAPTURE.json.

## Accepted checks and evidence boundaries

The native suite passes **555/555**, with lint, typecheck, a 185-module source
security/import/locale audit, bounded long-session checks and pinned dependency
checks. The original V0–V5 fixtures and rollback-reader bytes stay unchanged.

Six retained successful live gameplay/data/render suites ran on `607808e`.
Final source differs from that release only in `game/client/index.html` and
`locales.js`: simulation, storage and renderer source bytes are unchanged, and
six of eight emitted modules remain byte-identical. The other eight suites
below ran against the exact final production receipt. This distinction avoids
claiming that every earlier native journey was repeated after a text/entry fix.

| Accepted suite | Scope | Evidence source |
| --- | --- | --- |
| Corn | 4 EN/ID desktop/phone profiles, 80 native commands, seven days, all five stages, harvest/sale/replant and exact reload | Retained live `607808e` |
| All beds | 2 profiles, 192 harvest/sell/buy/replant commands across all 24 beds, inventory-limit recovery and exact reload | Retained live `607808e` |
| Five areas | 2 live profiles, 470 native UI commands over nine days each; 4 local EN/ID desktop/phone profiles additionally pass 940 commands | Retained live `607808e` |
| Save safety | 21 profiles: strict migration/original archives, corrupt/future saves, quota/collisions, import/cancel/reset/recovery and real two-tab pointer races | Retained live `607808e`, unchanged persistence code |
| Tall picking | 192 actual first-hit visible-triangle picks, all 24 mature corn beds, four headings, desktop/phone | Retained live `607808e`, unchanged renderer |
| Growth and wind | 2 profiles, actual interpolation/wind/Low/reduced-motion/harvest-pop checks; 64 plants with 8 shared active plant geometries | Retained live `607808e`, unchanged renderer |
| Immediate beds | 6 profiles: fresh, V5 and published V6, desktop EN/phone ID; all 24 owned immediately, last-bed plant/water, original values/archives and reload exact | Final live |
| Entry | 8 profiles: normal/WebGL failure/retry, old bookmarks, one original scene/camera/canvas/interval and protected save | Final live |
| Responsive | 16 EN/ID portrait/landscape/tablet/desktop profiles, two safe-inset cases each, all six native care panels | Final live |
| Security | 2 profiles, actual CSP, rejected malicious imports, no unexpected runtime external requests | Final live |
| Homepage | 24 bilingual width surfaces, 3 fallback cases, keyboard entry, save retention and 24 protected prior assets | Final live |
| SEO | 9 routes and 15 layouts, canonical/OG/sitemap/internal links, real 1200×630 social PNG | Final live |
| Performance | 2 dense-garden controlled profiles, cold/warm loading, 20-second render/memory measurements and exact paused saves | Final live |
| Guide copy | 2 visible EN/ID profiles, correct 24-bed guidance and unchanged native save | Final live |

The first responsive attempt exposed a real streamed-HTML startup race:
`async` module execution could mount the shell/controller before parsing reached
`market-dialog`. A deterministic four-second delayed HTML tail reproduced the
same missing-interface console error. Normal deferred module execution fixes
it; four EN/ID desktop/phone streamed-page regression profiles pass with usable
market controls and exact saves. Final local entry 8 / responsive 16 and final
live entry 8 / responsive 16 pass. No raised timeout or retry hides the bug.

The initial publication had retained three starting beds and only raised paid
capacity; owner feedback exposed the incorrect interpretation. The correction
provides all 24 beds immediately. Later homepage test attempts still expected
three plot buttons; only that obsolete assertion changed before the accepted
24-surface rerun. Failed/partial attempts are retained and excluded from totals.

## Controlled live performance

| Measurement | Desktop | Phone emulation |
| --- | ---: | ---: |
| Cold / warm map ready | 1.238 / 0.435 s | 4.906 / 1.918 s |
| Cold / warm full art ready | 2.318 / 0.897 s | 10.047 / 2.829 s |
| Render submissions/s, 20 s sample | 60.01 | 60.02 |
| Maximum triangles | 28,024 | 23,038 |
| Maximum draw calls | 256 | 189 |
| Post-GC heap change | +0.486 MiB | +0.314 MiB |

Phone conditions: 390×844, DPR 2.75, CDP CPU 4×, 150 ms latency,
200,000 B/s down and 93,750 B/s up. This is one cold/warm sample per profile,
measuring render submissions on a laptop, not physical Android/display FPS,
VRAM, thermal behavior or a guarantee of network loading time. Complete animal
art can arrive after the interactive map. Paused native saves stay byte-exact.

## Matching rollback

V6 rollback source: `63fe192972f86f4317969c91bf8d572e9569d6c6`, branch
`codex/garden-final-v6-rollback`, direct child of the final production source.
Successful preview: `e4d33b2c-9889-467d-9550-1cbabeee133f`.
[Immutable rollback preview](https://e4d33b2c.myfarmtwin-com.pages.dev).

All 245 served rollback resources match canonical Git bytes. All 149 compared
native modules match after EOL normalization. Direct rehearsal passes six
local entry profiles, 192 all-bed commands and two bilingual guide profiles;
six preview entry profiles pass too. It includes the same 24-bed upgrade and
startup fix. Advanced visual/performance claims belong to the primary release.
The old tracked V5 dist was not reused.

[GARDEN_V6_ROLLBACK.md](GARDEN_V6_ROLLBACK.md) contains the activation checks and
ordinary fast-forward push. A preview is not a provider production rollback
target. Recheck actual main/provider state; never downgrade/reset V6 data or
force-push history. Earlier fallback branches are historical and superseded.

## Records and cleanup

Authoritative ignored proof: `qa-artifacts/garden/final-acceptance.json`.
Canonical/pre-push proof: `final-pre-push.json`, `artifact-proof.json`.
Final publication: `deployment-final/`, `live-final-http/`, `live-final-transport/`.
Final browser phases: `live-final/` (four accepted suites before the obsolete
homepage assertion) and `live-final-tail-accepted/` (four accepted remaining
suites). Retained native suites: `live-active/`. Streamed-page regression:
`startup-race-reproduced/` and `startup-fixed/`. Matching fallback evidence:
`rollback-final-build.json`, `rollback-final-entry/`, `rollback-final-loop/`,
`rollback-final-copy/` and `rollback-final-publication/`.

Internal-browser spot checks confirmed the live 24-plot object list, actual
field, corn in Market and final visible 24-bed guidance with no console errors.
Only owned tabs/contexts/servers are closed; the user's preview at port 4177
and personal desktop/browser profiles are preserved. Download tests remain
**skipped by owner instruction**. The 17:00 stop was honored at `ce555ae` and
explicitly resumed by the owner at home. Final evidence/checklist commits stay
separate from production source, avoiding a documentation-only production deploy.
