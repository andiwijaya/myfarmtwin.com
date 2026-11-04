# Desktop homepage refinement and cached-client fix

Status: local candidate on `homepage-desktop-refinement`, based on `40295d2cf756f4724e8b6fc864125713a3bfb5ee`. This revision is not pushed or deployed. The user requested review before any further publication and wants to restart Codex before goat-farming work. No goat mechanics or other feature work was started.

## Existing deployment and observed problem

The previously approved `40295d2cf756f4724e8b6fc864125713a3bfb5ee` was deployed successfully as Cloudflare production `1a9bd8ca-f442-4073-bfd7-d0dca7bd318d`, completed 2026-11-04 04:44:20 UTC (11:44:20 WIB). Fresh-session production checks passed: 57 resource bodies matched source, 24 Chromium and six Firefox homepage cases, nine SEO routes, security, crop/chicken gameplay and four populated-farm preservation journeys. Evidence: task-2/qa/home-desktop/live, live-firefox and live-game.

However, the actual existing internal-browser page still rendered a 440px block card at a 1265px viewport, with the new WebP illustration but old “Play Farm”/“Grow crops and raise chickens…” copy. The current HTML still referenced unversioned /home.css and /home.js. This confirms a mixed retained-asset client state that fresh-profile tests had missed. No second deployment or settings change was attempted after the user's new feedback.

The supplied Library screenshot was resolved as `libfile_0168a439a7d88191a0f78a5dfb7bd81e`, image(20261104-044624).png, 1875×814. Library read returned metadata/OCR and an image pointer, not pixels. Supported materialization failed before installation because the current helper calls os.setxattr, unavailable on Windows; the destination file was absent. The helper was not modified or retried, and the signed transfer metadata was cleaned. As explicitly permitted, design decisions used direct inspection of the matching live browser pixels instead. Details: task-2/qa/home-desktop-v3/attachment-limitation.json.

## Revised composition

The desktop card now spans up to 1680px and starts about 104px from the top, with a broad uncropped farm illustration and large promotional headline. It fills the available desktop area rather than centering a narrow mobile card. The right panel explains the live loop in concise EN/ID copy, followed by the play action and a clear future-vision disclaimer. Three supporting columns below explain growing vegetables, caring for hens/trading eggs and saving progress locally. They are content inside the same one game card, with no extra offers or routes.

At 1875×814, the card is 1680px wide, about 711px high; the artwork panel is about 898px wide. At 1440px, the card is 1376px. Below 1024px, the existing stacked composition remains; mobile CTA stays above the first viewport, with concise supporting details below. Full-scene artwork and the original cream/green identity remain. English/Indonesian, one game link, keyboard access, no-account copy and explicit unplayable goat/cow/fish-pond labels are preserved.

## Reliable asset identity

Current HTML references new `home-promo-v3.css` and `home-promo-v3.js`, and has a non-visible desktop-promo-v3 data marker. The old /home.css and /home.js files remain unchanged for older HTML. Loading a new HTML document now requests the matching new stylesheet/script even when old paths remain fresh in browser cache. Future homepage releases should bump the stylesheet/script pair and HTML marker together.

There is no cache purge, storage clearing, service-worker change, forced reload loop or security/header change. Shared styles, artwork, gameplay, save logic and editorial/SEO assets are untouched. Existing generated WebP files are reused; their built-in imagegen provenance/full prompt remain in HOMEPAGE_DESKTOP_PROMO.md.

## Local verification

- `npm run homepage`: 24 Chromium 153 EN/ID surfaces from 320 to 1920px, including 600/601 and1023/1024 transitions. Wide desktop/top spacing, stacked mobile, one card, image decode, CTA size/visibility, keyboard game entry, locale and exact save preservation, no horizontal overflow, no-JS/reduced-motion/blocked-storage fallback pass.
- Firefox 155: ten equivalent EN/ID surfaces at 390/1023/1024/1440/1875px pass.
- Two additional EN/ID cases match the supplied 1875×814 size; direct browser inspection also reviewed that size, 1440×900 and390×844. Browser viewport overrides were reset. All three promotional areas were visually reviewed.
- `npm run homepage:cache`: two EN/ID warm-cache regressions seed old 440px CSS/script with 24-hour freshness, then load current HTML in the same browser context. The new card becomes 1376px at 1440px. Fetching old paths still uses their retained cache, proving no cache clearing occurred; primary-save sentinel remains identical.
- A 35-day populated farm with eight crop beds/two hens retains every serialized byte across homepage language changes/reload, keyboard CTA, both game areas and return to home, in four EN/ID desktop/touch contexts. Fixture tick 840, 2350 Coins; exact save SHA256 f1e45bd7477897a03694ecdcaa57f2ed3c577ef06440f2c15ec435587bdfb979. This is isolated QA data, not a user's live save.
- `npm run seo`: all nine routes and 15 editorial layout/navigation checks pass; canonical/OG/sitemap/robots/GA4 and source assets remain preserved.
- `npm run lint` and active homepage script syntax pass. No runtime dependency, GitHub Actions, hosting, nameserver or access changes.
- All 57 existing production assets other than index.html are protected against the deployed baseline. Windows checkout-only LF/CRLF conversions are recorded for text; binaries require exact bytes. Explicit staging preserves their original Git blobs. No new image asset is needed.

Evidence outside Git: task-2/qa/home-desktop-v3/homepage.json, firefox/homepage.json, warm-cache.json, populated-save/populated-save.json, user-size/homepage.json, seo-regression.json and EN/ID desktop/mobile screenshots. The source Library screenshot limitation remains documented; it is not an implementation blocker because live-pixel fallback was authorized.

## Review and next action

Preview: http://127.0.0.1:4177/. New local screenshots show the broad desktop and preserved mobile layout. Keep production at `40295d2` until the user approves this specific revision. If approved, integrate and publish once through the verified existing pipeline, then verify exact source/deployment and the actual retained-cache browser as well as fresh desktop/mobile sessions. Preserve saves and permissions; never clear site data to make the UI appear updated. Stop after homepage completion, before any goat implementation.
