# Goat Ranch baseline audit

Baseline source/remote main: `1e140428eba6743817e808676c689ce4ff7fffcf`. Local Goat branch: `goat-ranch-v1`. Original Chicken and homepage branches preserved. No other coding agent is active on this work. Initial working tree was clean. No push/deploy has occurred for Goat.

The live homepage was inspected read-only: `desktop-promo-v3`, one card, the correct `/play/` entry and promotional copy. Existing production identity is documented in prior `task-2/qa/home-desktop-v3/live/deployment.json`; hosting files have not changed. Cloudflare Pages production main/dist pipeline remains the existing release target, but publication of Goat is not authorized.

Chicken is implemented, enabled and stable. Fresh local real-button first-sale/cross-area crop tests pass on four EN/ID desktop/touch profiles. Current schema is V2, with strict allowed fields and validated Chicken economy. The new schema must be V3 and preserve older paths; source version is audited, not assumed. See GOAT_CONTRACTS.md for engine, storage, camera, economy, test and rollback integration.

## Baseline evidence

Logs and browser reports are outside Git: `task-2/qa/goat/baseline-fixed/`.

- `npm run lint`, `typecheck`, `test`, `build`: PASS; 96/96 unit tests.
- `npm run e2e`: PASS desktop/touch. Includes complete crop first-sale/upgrade/expansion/orders, save reload/offline recovery, corrupt/future protection, data import/export/reset confirmation, storage-disabled and stale-tab black-box checks.
- `npm run homepage`: PASS 24 EN/ID surfaces 320–1920px plus no-JS/reduced-motion/blocked-storage fallbacks and protected assets.
- `npm run compat`: PASS 12 EN/ID surfaces 320–1440px, keyboard/reduced motion and Firefox crop vertical slice. Uses the already-installed Firefox 1543 plus compatible existing Playwright module through supported environment variables; no browser/dependency installation.
- `npm run security`: PASS desktop/mobile, current CSP/security headers, rejected malicious import, preserved current save, no external game requests or policy violations.
- `node tools/chicken-flow-e2e.mjs slice`: PASS four EN/ID desktop/touch crop/chicken journeys.
- Synthetic V2 fixtures and exact V2 source reader/config/storage bytes: SHA256 and roundtrip validation PASS. Captured before schema changes, no user data. Existing V0/V1 fixtures retained.

## Pre-existing baseline issues resolved

1. Windows checkout converted two old immutable V1 reader fixtures LF→CRLF, failing exact SHA checks. Restored original Git bytes and pinned LF only for those paths. Expected hashes remain unchanged; no assertions removed.
2. Main E2E still searched for the obsolete pre-promo accessible link name `Play Farm`. Uses the actual `/play/` link with a nonempty accessible label and unchanged route assertion. Existing test CRLF style preserved, avoiding broad formatting changes.
3. Compatibility default expected an absent newer Firefox executable. Existing supported executable/module environment settings resolve it; no source change needed.

## Source access

Original Library PRD `libfile_fc76c0db920481918dad59d081068072` was read completely (361 lines, has_more=false). Supported Windows materialization failed twice at `os.setxattr`, installing no file. Parent explicitly directed continued implementation from that authoritative read. The project living checklist is documentation derived from the requirements, not a fabricated Library copy or metadata bypass.

M0 gate: safe baseline, Chicken prerequisite, save/engine APIs, synthetic recovery fixtures, acceptance/test contract and local-only publication boundary are documented and verified. Implementation may begin sequentially. No Goat simulation or save changes exist at this checkpoint.
