# Single live-game card — production follow-on

Status: published and live-tested after the user's explicit deployment approval. The tested `homepage-live-game` candidate `def03f2846301d184691caefd73906e3ae90749a` was fast-forwarded into clean, synchronized main and pushed without force. V1 was completed and publicly verified before this follow-on began. The previous release/report main was `ddec51008a1fba48fb014744d525743a78cd01d3`.

## Result

The homepage displays exactly one game card linking to `/play/`, with the native game scene, live status, game title, one short description and a play action. The only surrounding controls are the brand/home link and EN/ID selector. There is no hero, guide portrait, how-to section, promotional grid, extra CTA, footer or hamburger menu. FarmGirl imagery and references are removed from the homepage, including description/social metadata. The original FarmGirl assets and the in-game guide are retained.

The entire card is one accessible link, usable by touch, mouse and keyboard. All card and accessible copy, metadata and image description support EN/ID. The homepage shares only the existing `myfarmtwin.locale` preference with the game. Valid stored preference wins; otherwise browser language is used. Storage disabled still permits browsing/language switching. Without JavaScript, the English card still links directly to the game.

## Preserved scope

- Existing articles/category files, routes, canonical URLs, sitemap, robots, shared editorial styles, original media and GA4 identity remain intact. Unavailable category promotions are removed from the homepage only.
- Existing game logic, save format/keys, data, economy, weather, input, configuration and security/header rules are untouched. Two game files have only the existing home link relabelled Back to home / Kembali ke beranda, with unchanged destination. Source/build copies agree.
- New homepage CSS/JS load only on `/`. Card artwork is a 14,193-byte noninteractive SVG derived from the existing game renderer. A separate 1200×630 PNG of the same native scene replaces FarmGirl in social metadata; it is not loaded as a homepage hero or additional card. The original game/site media are not deleted.
- No publishing, hosting/DNS/account/security changes, new dependencies, GitHub Actions or telemetry additions.

## Verification

- Syntax/typecheck/build and 45 existing unit/integration tests pass.
- Full Chromium desktop/touch-mobile game regression passes: core loop, order, expansion, three follow-ups, exact resume, corrupted/old/future data, export/import/reset/restore and black-box recovery/stale tabs/storage disabled.
- Nine-route canonical/OG/link/sitemap regression and 15 layout/navigation surfaces pass. Existing editorial menus still work; homepage navigation is directly through the single card. The new PNG social image returns the correct content type.
- `npm run homepage`: 16 surfaces (320, 360, 390, 768, 800, 801, 1024, 1440px × EN/ID), exactly one card, one game link, one scene image, no FarmGirl markup/metadata or extra sections; no overflow; play action above the fold; keyboard entry; locale switch/reload/game continuity; exact preservation of existing saves. Browser-default ID, storage disabled, reduced motion and no-JavaScript fallback pass. Zero uncaught page errors. This isolated UI runner blocks the unchanged external GA loader to avoid third-party timing dependencies; the full local game/SEO regression also passed with the normal homepage loader intact.
- Every existing dist file is compared against release main: 31 are byte-identical; two permit only the precise EN/ID back-link substitutions; the root document is the requested presentation change. Protected original media/content hashes still match the baseline.
- Desktop/mobile EN/ID screenshots visually reviewed. Physical Android and human play timing remain unmeasured, as recorded for V1.

Current evidence outside Git: `task-2/qa/homepage-card/homepage.json`, `home-{en,id}-{390,1440}.png`, `regression/latest.json` and `regression/seo-regression.json`. The original live audit is `task-2/qa/homepage/live-before.json`. No QA screenshots/cache are committed.

## Production publication and live tests

Live URL: https://myfarmtwin.com/. Exact canonical production source: `def03f2846301d184691caefd73906e3ae90749a`. Cloudflare deployment: `fb9344f5-49a4-4284-ba96-42260809534d`, successful 2026-11-03 09:05:50 UTC / 16:05:50 WIB. Immutable URL: https://fb9344f5.myfarmtwin-com.pages.dev/.

Live Chromium checks passed at desktop 1440×1000 and touch-mobile 390×844 in EN and ID. Exactly one card/game link/image; no FarmGirl markup, metadata or network request from the homepage; no overflow; play action above the fold; browser locale preference switch/reload; mouse/touch and keyboard entry; visible game scene; planted farm save byte-identical through homepage, language changes, reload, game re-entry and return home. Zero uncaught errors. These use new isolated browser contexts, never the user's real browser profile or stored farm.

All 37 public production resource bodies match the exact Git candidate. Nine routes, canonical/OG/sitemap/internal links, new social PNG and 15 homepage/editorial layout/navigation surfaces pass. The game security policy remains unchanged and active: actual headers and no-transform present; zero external game requests or policy errors; core actions/Inspect work; malicious import is rejected with existing save retained. Full production desktop/mobile game/save/recovery/data/black-box regression passed after this deployment. Physical Android/human timing remain unmeasured; mobile results are Chromium touch emulation.

Production evidence outside Git: `task-2/qa/homepage-live/homepage-live.json`, `desktop-{en,id}.png`, `mobile-{en,id}.png`, `deployment.json`, and `regression/{live-integrity,seo-regression,security,latest,vertical-slice}.json`. Public screenshots were visually reviewed. No user data, QA screenshots or caches are committed.

This rollout used the existing GitHub main → Cloudflare Pages pipeline with no GitHub Actions, force push, nameserver, hosting/account/security-setting change or additional runtime dependency. Final report-only synchronization uses the documented `[CF-Pages-Skip]` commit prefix and changes no production assets; it does not redeploy the site. There are no remaining technical blockers.

Rollback target: prior verified production `d364b762-306e-4503-b73b-c733b333e550` / source `c90072450cca37d7dbcff6bc53b0265da6e01236`, or revert homepage presentation files and deploy through the existing pipeline. Browser saves remain separate and must be retained.

For local review, run `npm run preview` in `C:\MyFarmTwin` and open http://127.0.0.1:4177/. Automated preview servers are stopped after verification.
