# MyFarmTwin V1 release report

Status: local release gates complete; production deployment and smoke checks pending.

## Delivered

EN/ID isometric browser farm at /play/ alongside the retained editorial site. Three starting beds expand to eight; lettuce/tomato, fixed-hour water/crop/weather model, FarmGirl tutorial, harvest/inventory/Market ledger, manual irrigation and efficient motor, three neighbourhood orders and three follow-up missions. Local autosave, exact resume, backup/quarantine recovery, controlled migration, export/import, confirmed reset/restore. Optional Inspect explains current data, game estimates, 48-sample trends and model limitations.

## Local validation

- 45 unit/integration tests passed, including 2,500 mixed valid/invalid commands and a 90-day farm with daily save roundtrips and replay rejection.
- Desktop/touch-mobile complete first loop in 3 game days, then orders, expansion, all follow-up missions, reload/reopen and future-device-clock no-penalty checks.
- Corrupt/old/future save handling, exact exports, invalid/cancelled imports, confirmed replacements, no-funds recovery, double watering, actual interval pause, stale tabs and disabled storage passed.
- Chromium 153 and Firefox 155 passed the complete loop. Twelve size/language surfaces, keyboard/focus, reduced motion, target/contrast checks passed. Physical Android and human play timing were not measured.
- Performance: desktop ~60 FPS; CPU4/network mobile proxy 44.3 FPS full / 50.4 low; initial interaction 240/1668 ms. Game plus thumbnail 137,608 bytes raw; zero runtime dependencies. See PERFORMANCE.md for method/limits.
- CSP/security headers active in local tests, no external game requests/policy violations, malicious import rejected, zero dependency vulnerabilities. See SECURITY.md.
- Nine routes/canonical/OG/sitemap and all collected links passed; 15 editorial layouts passed. Category main content and original styles/robots/favicon/FarmGirl PNG remain baseline-identical; existing placeholder copy retained.

## Publication

Candidate commit, deployment ID, verified live URL and production evidence will be recorded after the authorized one-code-release push. Public hosting: Cloudflare Pages myfarmtwin-com, GitHub main, dist, no remote build command. No GitHub Actions, nameserver or audience change.

Rollback: previous production deployment 6475a81e-aedb-4ccb-8b05-0a48c8287514 / source 31bbcedcc4a314c0562b2df0e08b0b58d4a53f13, or revert the release source and deploy dist again. Browser saves are separate local data and must be retained.

## Evidence / known limits

Local evidence outside Git: task-2/qa/latest.json, vertical-slice.json, compatibility.json, performance.json, seo-regression.json, security.json and desktop/mobile/Firefox screenshots. No QA screenshots/cache/node_modules are committed.

Physical Android performance, physical touch hardware and human enjoyment/completion timing remain unmeasured; automated Chromium touch emulation is the documented fallback. Model is educational, weather/prices are fictional, no offline simulation/PWA/backend/login. Editorial category copy remains an existing placeholder backlog. No known blocking issue in tested scenarios.

Final checklist and repository state will be recorded after production verification and cleanup.
