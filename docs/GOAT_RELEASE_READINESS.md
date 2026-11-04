# Goat Ranch V1 — locally ready, not published

Historical prepublication/local-gate record. The user later approved publication and all release gates passed; see [GOAT_RELEASE_REPORT.md](GOAT_RELEASE_REPORT.md) and the current living checklist for the completed production release.

**56/60 checklist items complete.** All coding and applicable local gates pass. M7-F03–F06 remain unchecked because pushing/deploying this Goat release has not been authorized. No production Goat claim is made.

Repository: `C:\MyFarmTwin`; branch `goat-ranch-v1`; origin `https://github.com/andiwijaya/myfarmtwin.com.git`. Application source checkpoint: `e42c679df02e0e41befcbed4bf427e82acbc5d49`. Later local commits contain test/documentation checkpoints. Exact final handoff commit and client hashes are recorded outside Git in `task-2/qa/goat/GOAT_LOCAL_RELEASE.json` after this checkpoint. Main/origin main were verified unchanged at `1e140428eba6743817e808676c689ce4ff7fffcf`.

## Implemented

- One shared world, clock, weather/RNG, tank, Coins, Market and V3 save; one-time adult + two weaned starter goats.
- Real hay/water/care, gradual condition/growth, quoted atomic live-goat sales, two companions minimum and paid young restocking.
- Two paid paddocks with actual resting/regrowth/rotation; shelter capacity 4/6/8 and larger care containers without free resources.
- Independent camera pan/rotate/zoom/reset, eight stable selectable goats, EN/ID desktop/touch/keyboard, reduced motion and low graphics.
- First-sale chapter and five outcome-based one-time follow-up rewards; optional read-only Why/Lab, actual trends/quotes/direct ranch accounting with explicit cost allocation; Goat progress in return summary.
- V0/V1/V2 compatibility and protected originals, malformed/future/poisoned-save protection, atomic two-tab transactions. No milk, breeding or unrelated mechanics.

## Local evidence

Fresh lint/typecheck/build, **169 unit tests**, client/source-output/config audit; **19 browser suites / 154 scenarios** repeated after final import hardening; original complete crop/Chicken/data/recovery/compatibility regressions; 24 homepage profiles, nine SEO routes, 15 route layouts and warm-cache tests. All pass. The final source also passes the original full E2E again.

32 real-command 7/30/60/90-day balance scenarios pass, including zero-wallet Goat recovery. Hay was tuned to 12 Coins/6kg after reproducing the initial cash-flow failure; earlier recorded 24-Coin entries remain readable without repricing. Neglected goats produce no ongoing sale income. No negative resources or social/capacity breach.

Final Goat performance recheck: four desktop/throttled-mobile standard/low profiles, 59.2–60 FPS, bounded retained heap about 2.6→4.1MB after thirty additional browser days. Across the earlier twelve three-area runs all retained ≥50 desktop / ≥30 throttled-mobile FPS. These are laptop/headless/emulated measurements; physical Android/iOS and Safari were not tested.

58 exact source/build assets: **322,524 bytes raw / 122,011 summed gzip bytes**. Three-area caps were explicitly reviewed at 350KB/130KB versus the older Chicken-only caps; see GOAT_PERFORMANCE.md. No added runtime/development dependency or media asset. Homepage/editorial/GA4/configuration/security/workflows remain byte-identical to the audited baseline outside intended game output.

Detailed evidence is in `task-2/qa/goat/M7-F01-*`, `M7-F01-browser-index.json`, and `M7-F02/`. Preview examples:

- `M7-F01-progress/herd/herd-desktop-en.png`
- `M7-F01-resilience/accessibility/chromium-320x780-id.png`
- `M7-F01-entry/sale/sold-new-mobile-id.png`

## Backup and rollback gate

M7-F02 PASS: fifteen focused exact-old-reader/migration/archive/storage tests, plus four real EN/ID desktop/touch backup flows. Each browser flow exports a progressed ranch, cancels replacement safely, imports/restores exact state and visuals, cancels backup restore without mutation, confirms actual backup restore and reloads byte-identically. The replaced primary is retained as the rolling backup. No real user save was inspected or changed.

Migration preserves exact V2 original at `myfarmtwin.save.before-goat.v2`, independently of `myfarmtwin.save.before-chicken.v1`. Archive collisions/quota failures block overwrite and retain original bytes. Corrupt recovery quarantines the original before replacing the primary; future-version primary never falls back to an older backup.

The exact deployed V2 reader refuses V3 before backup recovery and cannot save over it. Rolling code back to `1e14042` therefore **does not downgrade a V3 farm**. Preserve both the V3 primary and archived V2 original. Prefer a forward fix using the newer reader; restoring a pre-Goat export would discard later progress and must never happen silently. The Data tools require explicit confirmation for import/reset/backup replacement and retain replaced bytes.

## Pending publication

After explicit approval, reverify the existing authorized Cloudflare Pages `myfarmtwin-com` / Git-main pipeline and exact target; safely integrate the approved local candidate without overwriting other work, non-force push, verify the exact successful deployment and run isolated live desktop/touch EN/ID crop/Chicken/Goat/save/camera checks. Preserve V3 saves during any code rollback. No GitHub Actions, nameserver, permission or security-setting changes are part of this release.

No known local P0/P1 issue remains. Publication authorization and production verification are the remaining gates; local success is not a substitute for live testing.
