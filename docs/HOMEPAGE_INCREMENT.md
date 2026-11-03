# Game-focused homepage — local follow-on

Status: locally implemented and verified, not pushed or deployed. Branch `homepage-live-game`, based on completed release/report main `ddec51008a1fba48fb014744d525743a78cd01d3`. This increment started only after V1 reached 59/59, public checks passed and release main was synchronized. It follows the user's request to show only the live game on the homepage. The publication authorization for V1 does not automatically publish this follow-on.

## Observed problem and resulting behavior

The public homepage audited at 2026-11-03 08:34 UTC promoted Grow, Farm, Kitchen, Projects, a journal, gear and About alongside the live game. Those category routes currently contain placeholder content. The homepage is now a focused introduction to the available farm game, with a direct Play Farm / Mainkan Farm CTA, an actual-renderer vector preview and three short steps describing existing plant/care, harvest/sell and expansion/irrigation features. It advertises no unavailable feature or category. The main CTA appears within the first 844px viewport in all tested sizes/languages.

EN/ID includes all homepage copy, accessible names, image description and dynamic metadata. It shares only the existing `myfarmtwin.locale` preference with the game. Browser language is the default when no valid preference exists. Storage failure remains usable; HTML contains an English fallback and working game links when JavaScript is disabled. The mobile menu supports click, link-close and Escape with focus return. The game's existing home link is relabelled Back to home / Kembali ke beranda; its destination is unchanged.

## Preserved scope

- Existing category pages/articles and route files, sitemap, robots, canonicals, original media, shared editorial styles and GA4 identity are retained. Removing homepage promotions does not delete or redirect their destinations.
- Existing game logic, save format/storage keys, data, economy, weather, input, configuration and security/header rules are untouched. Two existing game files have only the back-link text substitutions; source/build copies agree.
- New homepage CSS/JS are separate files loaded only by the homepage. The static 14,193-byte SVG preview is derived from the existing renderer with three healthy lettuce beds and a built pump; it is an illustration, not an interactive game or a claim that new players start with a pump. The caption explicitly says to start with three beds. Text labels/interactions were removed from the illustration, and its accessible description is translated.
- FarmGirl uses the existing optimized 16,542-byte game portrait. The original PNG remains intact and remains the existing OG image.
- No publishing, hosting/DNS/account/security-setting changes, dependency additions, GitHub Actions or telemetry additions.

## Verification

- Syntax/typecheck/build and all 45 existing unit/integration tests pass.
- Full local Chromium desktop/touch-mobile game regression passes: core loop, order, expansion, three follow-up missions, save/reload, corrupt/old/future data, export/import/reset/restore and black-box recovery/stale tabs/storage unavailable.
- Existing nine-route SEO/link/sitemap regression and 15 editorial layout/menu surfaces pass; protected original content/assets pass baseline checks.
- `npm run homepage`: 16 surfaces (320, 360, 390, 768, 800, 801, 1024, 1440px × EN/ID), no overflow, CTA above fold, menu behavior, locale switch/reload/game continuity, exact preservation of a preexisting save, successful entry to the game. Browser-default ID, storage disabled, reduced motion and no-JavaScript fallback pass. Zero uncaught page errors.
- A strict comparison against release main verifies every preexisting dist file byte-for-byte, allowing only the new root document and exact EN/ID back-link substitutions. Game source and security rules are unchanged apart from those presentation labels.
- Desktop EN and mobile ID screenshots visually reviewed, with counterparts retained. Physical Android and human play timing remain outside the measured environment, as documented for V1.

Local evidence: `task-2/qa/homepage/live-before.json`, before screenshot, `homepage.json`, `home-{en,id}-{390,1440}.png` and `regression/{latest,seo-regression}.json`. Evidence is outside the repository. No QA images/cache are tracked.

## Review and publication boundary

Run `npm run preview` in C:\MyFarmTwin and open http://127.0.0.1:4177/ to review; the preview is stopped after automated verification. All changes are committed locally on `homepage-live-game`. Production remains the verified V1 deployment d364b762-306e-4503-b73b-c733b333e550 / c900724 source, with main at the report-only ddec510 commit. Publication of this separate homepage increment is pending the parent/user's decision. There is no technical blocker and no publication attempt has been made.

Rollback of the local increment: switch to clean `main` (or revert this branch's commit). Existing browser saves remain independent of the checkout and are not deleted.
