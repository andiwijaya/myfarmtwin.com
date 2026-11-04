# Goat quality gate

M6-F01–F07 PASS locally. 167 unit tests, real shared-world crop/egg/goat sale journeys, malicious-save/replay checks, preserved migrations/rollback, responsive/keyboard EN/ID, reduced motion, low graphics and measured performance are documented in the individual evidence entries.

Final original-game/site regressions on gameplay code `b46c821`:

- Original full E2E: crop first sale/pump/expansion/orders/follow-ups; save recovery, import/export/restore/reset in isolated profiles; offline/paused clock, low funds and stale tabs.
- Original Chicken data/save and four EN/ID desktop/touch crop-cross-area slices; future clock shifts and V1 migration preserve progress.
- Homepage: 24 width/language profiles (320–1920), exactly one card, no homepage FarmGirl, responsive artwork/promo copy, keyboard CTA and game-save preservation. JavaScript-disabled and blocked-storage cases pass.
- Nine SEO/editorial routes and 15 responsive route layouts; metadata, sitemap/robots/GA4-protected assets unchanged.
- Warm legacy homepage-cache regression passes EN/ID without clearing cache or saves.
- Original compatibility: 12 Chromium profiles plus Firefox full crop slice.
- Exact byte audit confirms every `dist/` file outside `dist/play/` unchanged from production baseline `1e14042`; current 58 client files exactly match build output. Dependencies, Cloudflare/security configuration and GitHub workflows unchanged.

Evidence outside Git: `task-2/qa/goat/M6-F07-game/`, `M6-F07-site/`, `M6-F07-compat/`. Remote main was read-only verified still `1e140428eba6743817e808676c689ce4ff7fffcf`; no push/deploy.

M7 fresh local build/release checks and backup/rollback verification remain to be checkpointed. Publication/live verification requires new explicit approval and remains unchecked.
