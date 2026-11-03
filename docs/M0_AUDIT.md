# M0 audit — 3 November 2026

- Verified local repository: `C:\MyFarmTwin`, `main`, origin `https://github.com/andiwijaya/myfarmtwin.com.git`.
- Initial working tree clean; local and remote main both `31bbcedcc4a314c0562b2df0e08b0b58d4a53f13` (ls-remote during initial audit). No fetch/build/publication occurred during lookup.
- No applicable AGENTS.md found at drive/repo root, no repo .agents/.codex. No package.json or framework dependencies initially.
- Eight static editorial HTML pages, shared CSS, mobile-menu stylesheet, favicon, one approved FarmGirl PNG, sitemap, robots. `/play/` absent.
- Existing `.openai/hosting.json` retains Sites project `appgprj_6ab22e52908c819198a7f9e50cc9f876` and `static.directory=dist`. Sites reports active registered project, zero published versions, owner-only audience. Official source-open helper confirmed this checkout and baseline SHA without publication.
- Public domain uses Cloudflare Pages project `myfarmtwin-com`, verified via authenticated read-only Cloudflare API: domains myfarmtwin.com/www.myfarmtwin.com, GitHub source andiwijaya/myfarmtwin.com, production branch main, root directory empty, destination dist, build command empty, Git-triggered production enabled. Current public deployment 6475a81e-aedb-4ccb-8b05-0a48c8287514 matches initial 31bbced commit. Use one final gated GitHub push; no separate Sites deployment, nameserver or audience change.
- Existing subpages are placeholders with duplicated Learn title, description and canonical `/learn/`. Preserve their copy; fix only route metadata separately after baseline recorded.
- Existing homepage contains literal question marks/replacement characters in decorative glyphs. Do not rewrite editorial content as part of the game.
- PRD: verified complete Library read, 371 lines / 32,674 UTF-8 bytes. Exact initial repo copy SHA256 `A9671F07576B4C2DDF17C96080016D08DB96699707D53B15E3B11779A35E7134`. Official file-transfer helper failed because Windows Python lacks os.setxattr. Per follow-up authorization, document created from full supported Library read; original source remains authoritative.
- Hard stop: 10:00 UTC / 17:00 WIB. Checkpoint instead of publishing if release gates remain incomplete.

## Production baseline (M0-F02)

Automated Chromium 1.63 driver / Chromium 1243 on this Windows laptop, desktop 1440×1000 and touch mobile emulation 390×844. Homepage HTTP 200, correct homepage canonical, no horizontal overflow or uncaught page errors. Mobile navigation expanded successfully. All seven category routes, sitemap, robots and approved FarmGirl PNG returned 200. Category canonicals incorrectly all point at /learn/; preserve as recorded baseline until small safe SEO correction. Homepage retains GA4 G-VXB9Q1DG4W and existing OG metadata. Production screenshot evidence outside Git: task-2/qa/desktop-baseline.png and mobile-baseline.png; machine-readable route evidence baseline.json. These are emulation checks, not a physical Android test.

M7-F06 resolution: category canonical/title/description/OG corrected to their own routes and mobile menus repaired, while baseline main content and protected styles/robots/favicon/original image remain unchanged. Local route/link/layout tests pass; production verification follows deployment.
