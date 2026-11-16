# MyFarmTwin toolbar layout — 16 November 2026

Status: implemented, deployed and verified in the Codex internal browser only.

## User-visible change

The farm view is now a dedicated canvas viewport. Title/subtitle sit above it. Resources, seven area destinations, seven camera controls, Arrange farm, expanded pan controls, gesture/location text and action status sit in a normal-flow panel below it on phones and desktops. The in-progress placement editor also lives below the canvas instead of floating over the scene; opening it from the care panel reveals it once without committing an operation. Modern desktop retains the independent care sidebar; smaller screens use normal page flow. Phone area buttons wrap to a four-column grid, and all measured toolbar buttons have at least 44 CSS pixels of height.

The branding and quality/language/data settings stay in the page header, outside the canvas. Explicit data/catalog dialogs retain their modal behavior. No model, simulation, balance, placement validation rule or storage schema was changed. The frontend behavior change is limited to revealing the inline placement editor with scrollIntoView when opened.

## Source and deployment

- Application source: `139eac9262925ee2dbd2dbf801abdebbef58046a`; game entry `app-S342P2LL.js`.
- Preview: `4fa9d1ca-9bc3-46d4-bdfe-a814534c3def`, https://4fa9d1ca.myfarmtwin-com.pages.dev/play/ .
- Production: `dee3daaa-39a6-4e57-a4ca-9c432bb77070`, terminal completed/success in native GitHub Cloudflare Pages check-run 133070633421.
- Canonical URL: https://myfarmtwin.com/play/ ; immutable production URL: https://dee3daaa.myfarmtwin-com.pages.dev/play/ .
- The same tested candidate was promoted to main using an expected-SHA lease, without force. Later evidence-only documentation does not alter the production application.

## Verification

- Build and strict typecheck passed. All four existing delivery/header checks passed. No implementation-mirroring test was added for this reversible style change.
- Actual measured viewports: 320×740, 390×844, 768×1024, 844×390, 1024×768 and 1440×900. None had horizontal overflow, toolbar/canvas intersections or overlapping toolbar buttons.
- Nine internal-browser preview groups passed: six responsive sizes, seven-area read-only navigation, zoom/orbit/expanded pan, valid build preview with exact cancel, inline move editor revealed from care with exact cancel, interior/keyboard return, English phone layout, exact reload preservation and actual public resource integrity.
- Live immutable production was inspected at 390×844 and 1440×900, with the expanded camera tools and navigation checked again. The complete synthetic save export stayed identical across those actions.
- Canonical production was inspected at 390×844 with existing player progress. Camera/navigation exports were byte-identical. No synthetic data, starter grant or gameplay action was applied on that origin, and no actual player save was written to receipts or screenshots.
- Both actual public origins passed all 30 browser-computed SHA-256/MIME resource checks, including 22 active GLBs. Current-origin error/warning logs were zero on both production game origins.
- Actual screenshots from the isolated production origin: `qa-artifacts/cozy-toolbar-20261116/production-phone.jpg` and `production-desktop.jpg`. The developed farm is a synthetic fixture, not the player's farm or default starting state.
- Exact layout geometry and all public resource hashes are retained in `COZY_WORLD_TOOLBAR_LAYOUT_2026_11_16.json`.

Local HTTP preview started but could not be reached by the internal browser. It was stopped. Actual browser acceptance therefore used the Cloudflare preview and production; no standalone browser, desktop takeover, clipboard, upload or download test was used. A stale error tab was already absent during cleanup; no settings or computer permissions were changed to repair routing.

These are desktop-browser viewport tests, not physical phone, native touch/pinch, Safari, thermal or hardware-FPS measurements. The screenshot supplied by the user served as the problem reference; the final screenshots came from the actual deployed game.

## Artifact

`myfarmtwin-toolbar-layout-20261116.tar.gz`, 18,384,964 bytes; SHA-256 `150d5d7bb0f5cabb0093676fe3bab61fb8e0c9da806b8b7cfe824e29aad1079d`. All 301 static game files match the final local dist bytes. The official Sites packager adds one normalized hosting metadata file (302 total); 23 static GLBs remain in the package with 22 active runtime GLBs, as in the preceding release.

## Release checklist

- [x] Move all persistent scene HUD/control groups outside the canvas.
- [x] Apply to phone, tablet, landscape and desktop layouts.
- [x] Keep camera, navigation, interior, build/move/cancel, language and keyboard controls functional.
- [x] Verify read-only navigation and exact save preservation.
- [x] Verify actual preview and live production, exact source and public resource hashes.
- [x] Save real phone/desktop screenshots and publish the bounded evidence report.
