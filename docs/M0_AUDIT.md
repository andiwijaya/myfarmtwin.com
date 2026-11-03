# M0 audit — 3 November 2026

- Verified local repository: `C:\MyFarmTwin`, `main`, origin `https://github.com/andiwijaya/myfarmtwin.com.git`.
- Initial working tree clean; local and remote main both `31bbcedcc4a314c0562b2df0e08b0b58d4a53f13` (ls-remote, 05:48 UTC). No fetch/build/publication occurred during lookup.
- No applicable AGENTS.md found at drive/repo root, no repo .agents/.codex. No package.json or framework dependencies initially.
- Eight static editorial HTML pages, shared CSS, mobile-menu stylesheet, favicon, one approved FarmGirl PNG, sitemap, robots. `/play/` absent.
- Existing `.openai/hosting.json` retains Sites project `appgprj_6ab22e52908c819198a7f9e50cc9f876` and `static.directory=dist`. Sites reports active registered project, zero published versions, owner-only audience. Official source-open helper confirmed this checkout and baseline SHA without publication.
- Public domain may use separate Cloudflare Pages deployment. Audit actual local authentication/configuration before release; do not assume Sites registration hosts the public domain and never change nameservers/audience.
- Existing subpages are placeholders with duplicated Learn title, description and canonical `/learn/`. Preserve their copy; fix only route metadata separately after baseline recorded.
- Existing homepage contains literal question marks/replacement characters in decorative glyphs. Do not rewrite editorial content as part of the game.
- PRD: verified complete Library read, 371 lines / 32,674 UTF-8 bytes. Exact initial repo copy SHA256 `A9671F07576B4C2DDF17C96080016D08DB96699707D53B15E3B11779A35E7134`. Official file-transfer helper failed because Windows Python lacks os.setxattr. Per follow-up authorization, document created from full supported Library read; original source remains authoritative.
- Hard stop: 10:00 UTC / 17:00 WIB. Checkpoint instead of publishing if release gates remain incomplete.
