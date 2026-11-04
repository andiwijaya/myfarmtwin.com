# Chicken Yard release candidate — local gates passed, publication blocked

Status:56/58 (96.6%). M6-F09 and M6-F10 remain unchecked because deployment and post-deploy live verification are not complete. This report is a checkpoint, not a release-success claim. Branch:chicken-yard-v1. Last feature/served-asset checkpoint:03d99c83c6610a8cdbf4d1c841a1d473d0c3fc78 (M6-F08). The candidate adds same-world adult hens, care/welfare/graded eggs/commerce, paid progression, safe V2 migration/rollback detection, Lab, camera controls and a bilingual one-card future-vision homepage.

## Verified local evidence, 2026-11-04

All npm release commands pass:lint,typecheck,test(96/96),build,audit:client,e2e,chicken,compat,security,balance,endurance,seo,homepage. Logs and JSON/screenshots are outside Git in task-2/qa/chicken/release-local. Modern Chicken tests include EN/ID desktop/actual touch emulation, complete chicken and cross-area crop journeys, paid upgrades/order/Lab, stockout aid, four-angle camera/picking, exact reload/new-context saves, V1 preservation/migration, export/import/cancel/reset/backup/quarantine/archive collision and eight two-tab races. Quota/blocked storage/no Web Locks/rejected locks preserve stored data. Interval/visibility/system-clock scenarios pass.

Additional task-2/qa/chicken/release-extra evidence:24care/balance cases at7/30/60/90days; shared90-day farm1415commands,283replay rejections,minimum53Coins,final8204Coins,142eggs,peak save104767bytes; Chromium153/Firefox155 keyboard/ARIA/reduced-motion/low-graphics EN/ID desktop/touch viewport checks; full Firefox chicken/crop journey EN/ID desktop/touch.

Performance:8/8 profiles, desktop60FPS/mobile49.6-60FPS with4xCPU,150ms/1.6Mbps throttling; stable DOM,heap growth<0.4MB;226780raw/87291per-filegzip bytes. See CHICKEN_PERFORMANCE.md and task-2/qa/chicken/m6/performance.json. Earlier failures remain as honest diagnostic evidence. Owned disposable before/after benchmark copies were removed after path validation.

Homepage:16width/language cases, one card/noFarmGirl, CTA above fold, locale and save preservation, no-JS/blocked-storage fallback. Original vector cartoon depicts vegetables/chickens/goat/cow/fishpond; visible EN/ID text marks future mechanics as not playable. Four desktop/mobile EN/ID screenshots reviewed. Nine SEO routes, internal links, canonicals/OG/sitemap/robots/GA4 and deployed editorial/media baseline pass. See CHICKEN_HOMEPAGE_PRESERVATION.md.

The five release runners now accept BASE_URL and close their optional local server safely. All five external-origin paths passed against a separate local preview (task-2/qa/chicken/release-external-local and external-origin.log); this is not production Chicken QA.

## Production state and denied action

Origin main remains131133ba4597e4c4a031317dc9b1b679275a6110 after fetch. No Chicken push/deployment was performed. Read-only production integrity against deployed source def03f2846301d184691caefd73906e3ae90749a confirms all37resources byte-identical (task-2/qa/chicken/production-baseline/live-integrity.json). The last known successful deployment is fb9344f5-49a4-4284-ba96-42260809534d; a successful official Wrangler deployment-list read still shows the existing project/main history. No production configuration or security setting changed.

The read-only python cf_preflight.py request to Cloudflare accounts/project metadata returned HTTP403. The official existing-auth Wrangler deployment-list read subsequently succeeded. A further attempt to run the API preflight was rejected by automatic approval review before execution:the reviewer regarded it as repeating the HTTP403 permission-blocked operation without materially new authorization and explicitly prohibited workaround/indirect execution. That rejected retry is known not to have executed. No further Cloudflare API attempt was made.

Blocked target:Cloudflare Pages myfarmtwin-com read-only source/build/canonical metadata verification. No pending or uncertain mutation exists. Required next step:explicit approval for one read-only project preflight retry, then continue already-authorized non-force integration/push/deploy only after verifying the existing pipeline and candidate. If permitted, verify exact canonical deployment/source SHA, run isolated live desktop/touch EN/ID chicken/crop/save/camera/homepage/security/SEO checks and full resource integrity; only then check M6-F09 and publish the final evidence report/M6-F10. Do not bypass the rejection or claim current Chicken live tests passed.

## Data, rollback and limits

Original V1 bytes are immutable in the pre-Chicken archive before migration; rolling backup/quarantine remain separate. Old deployed V1 reader refuses V2 without downgrade. A rollback that keeps V2 readers and disables the Chicken build flag preserves its subtree; never automatically reset/downgrade user saves. Prior production/source above is the publication fallback, with forward-compatible readers preferred for existing V2 data.

No physical Android FPS/touch hardware or human enjoyment/timing measurement is claimed. Chromium touch emulation and Firefox touch viewports are the documented fallback. Goats/cows/fishpond are illustration only. No new runtime dependencies, GitHub Actions, nameserver, hosting/security setting changes or user-save modifications.
