# Single live-game card — local follow-on

Status: locally implemented and verified; not pushed or deployed. Branch `homepage-live-game`, based on completed release/report main `ddec51008a1fba48fb014744d525743a78cd01d3`. V1 was completed and publicly verified before this increment began. Publication of this follow-on remains pending an explicit decision.

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

## Review and publication boundary

Run `npm run preview` in `C:\MyFarmTwin` and open http://127.0.0.1:4177/. Automated preview servers stop after verification. All changes are committed locally on `homepage-live-game`. Production remains the verified V1 source `c900724` / deployment `d364b762-306e-4503-b73b-c733b333e550`, with remote main at report-only `ddec510`.

The prior request for deployment approval has not been answered. The user's refinement requested a simpler card; it did not approve publishing. No homepage push/deployment has been attempted. There is no technical blocker. To return to the published source locally, switch to clean `main`; browser saves remain independent and are retained.
