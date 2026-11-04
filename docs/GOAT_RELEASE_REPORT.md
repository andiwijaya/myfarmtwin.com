# Goat Ranch V1 production release

**Complete: 60/60 PRD items. Live at https://myfarmtwin.com/play/.**

Production source: `dd8184e1beb95685ded536dcef022eb4e7306f6f` on GitHub `andiwijaya/myfarmtwin.com`, branch `main`. Cloudflare Pages project `myfarmtwin-com`, final deployment **`1b28946e-6835-457e-a104-db217d9218d9`**, terminal **success** at **2026-11-04 10:01:56 UTC / 17:01:56 WIB**. Immutable deployment: https://1b28946e.myfarmtwin-com.pages.dev. Custom-domain aliases are MyFarmTwin.com and www.MyFarmTwin.com.

The tested Goat implementation first deployed as `9f19e7ba5321c4e3d657af57b5091928bba8ce57`, deployment `42982909-0cc0-4d82-aa2e-80834a0c45e5`, success at 09:42:19 UTC. The final follow-up corrects only stale EN/ID homepage availability/metadata and versions the promo-script URL. Every game source/output byte remains identical to that first tested release. Both pushes were non-force fast-forwards through the existing Git/Cloudflare pipeline. Cloudflare has a blank build command and publishes committed `dist`; local build/source identity was verified before publication. No pipeline, nameserver, permission, dependency or security setting was changed. No GitHub Actions were used.

## Verified behavior

Goat Ranch shares the farm, clock, weather/RNG, water tank, Coins, Market and save with crops and chickens. One starter adult and two weaned goats are granted once. Hay/water/care, gradual growth/condition, paid restocking, deterministic live-goat contracts, minimum two companions, two rotational paddocks, 4/6/8-capacity shelter and care-container upgrades, one-time missions and read-only explanations are complete. Camera pan/rotate/zoom/reset, keyboard/touch, EN/ID, reduced motion and low graphics remain usable. No milk or breeding mechanics were added.

Local gates passed 169 unit tests, 19 browser suites / 154 scenarios, 32 real-command 7/30/60/90-day balance scenarios, migration/backup/rollback, original crop/Chicken regressions, responsive homepage/SEO/cache and security. A final review reproduced and fixed a poisoned pre-visit Goat reward import before publishing it. Hay pricing was tuned to sustain a real zero-wallet first cycle; earlier recorded prices remain readable without repricing history.

Live verification passed:

- 56 core scenarios on production: new/existing synthetic saves, real crop/egg/goat sales, exact single payment/reward, two companions remaining, paid young purchases, upgrades, actual paddock rest/rotation, camera gestures/picking and locale switching.
- EN/ID desktop/touch export/import, cancelled/confirmed backup restore and byte-exact reload; first-entry two-tab races; exact V2 original archives and unaffected farm preservation. Original full crop/data/recovery/offline/stale-tab E2E also passed live.
- After the availability correction, eight three-area journeys passed again, along with four live desktop/mobile EN/ID homepage profiles, nine SEO routes, fifteen responsive route layouts and live security checks. The copy correction additionally passed 24 local homepage profiles and both legacy/previous-promo warm-cache scenarios without clearing saves or cache.
- All **80 deployed resources** match exact Git bytes for final source `dd8184e`; zero mismatches. The 58 game assets are unchanged from `9f19e7b`. Homepage layout/artwork, editorial content, GA4 and configuration remain preserved; only the two approved availability-copy assets changed outside the game.
- Four production Goat stress profiles (desktop and 390px touch emulation, standard/low graphics) retained 60 FPS in the measured run, bounded DOM and approximately 2.6→4.1MB retained heap after thirty additional browser game days. Mobile emulation used 4× CPU slowdown, 150ms latency and 1.6Mbps network. This is headless/emulated evidence, not physical Android/iOS FPS or Safari coverage.

Game release bytes are 322,524 raw; asset-size budgets and growth from the Chicken baseline are documented in GOAT_PERFORMANCE.md. Live identity compares HTTP bodies to Git blobs, avoiding Windows checkout EOL differences in local file-size measurements.

## Recovery and operational notes

The retained previous deployment https://4e9fdc73.myfarmtwin-com.pages.dev still serves the exact old config/storage/save reader. Its actual browser client was tested with a synthetic V3 Goat primary and V2 backup: it reports a newer save and leaves both byte-identical after a normal game action. Code rollback therefore cannot silently downgrade V3. Preserve the primary, rolling backup, pre-Goat V2 archive and pre-Chicken archive; prefer a forward reader fix over discarding later progress. No rollback was necessary or performed.

The existing Wrangler OAuth preflight `GET /accounts` returned HTTP 403 and was not retried or granted new access. Existing authorized Cloudflare dashboard UI verified repository, branch, output, exact commits and successful terminal deployments. One GitHub internal-server rejection occurred during the copy correction; remote main was confirmed unchanged before one successful retry. A local test-harness path error was corrected before the affected live tests ran. No unresolved production issue remains.

All production game tests used fresh isolated Playwright contexts and synthetic saves. No real user save/profile was opened, reset, imported into or cleared. No compulsory manual user testing is required.

## Evidence and handoff

Evidence is outside Git at `C:\Users\andi_\Documents\Codex\2026-11-03\task-2\qa\goat\release\`:

- `deployment.json`, `final-deployment.json`: directly observed Cloudflare dashboard facts and log timestamps.
- `live-game/`, `live-advanced/`, `live-camera/`, `live-starter/`: real gameplay/save/upgrade/camera reports and screenshots.
- `final-game/`, `final-site/`: final-source game journeys, exact 80-resource integrity, homepage, SEO and security reports.
- `home-availability-local/`, `home-availability-warm/`: local copy/layout and warm-cache proof.
- `performance/`, `rollback/`: production stress and retained-old-client data-protection evidence.
- `GOAT_PRODUCTION_RELEASE.json`: exact final source, deployment identity, test index and local evidence commit.

Screenshots: `live-advanced/herd/herd-desktop-en.png`, `final-game/full-new-mobile-id.png`, `final-site/home-id-1440.png`.

Local release-evidence/checklist commits remain on `goat-ranch-v1`; production `main` remains the verified `dd8184e` source. No documentation-only redeployment was triggered. Application scope is complete; no next expansion was started.
