# M7-F08 - local security and asset audit

The production dependency is exactly pinned Three.js 0.187.0; all renderer code, fonts and assets load locally. `npm audit --json` reports zero vulnerabilities in all severities (`qa-artifacts/unified-m1/m7-package-audit.json`). No package installation or automatic dependency upgrade was performed.

`node tools/audit-client.mjs` passes: 171 source modules, 1 pinned production package, zero debug statements and zero external runtime imports. The audit now distinguishes five explicitly allowed source Three imports from delivered modules, which must resolve to bundled local files. It checks the installed package version too. The first audit found a retained standalone batches module still using a bare import. The build rewrite and an actual module identity regression test corrected that path; the active bundled renderer had already resolved correctly. Other bare/remote imports remain rejected.

Classic and unified `npm run security` both pass desktop and touch-emulated profiles. Real browser CSP/header checks, original crop commands, malicious import rejection and preservation of current saves produce zero CSP violations or external requests. Evidence: `qa-artifacts/unified-m7-security/security.json` and `qa-artifacts/unified-m7-security-unified/security.json` (the latter uses `UNIFIED_WORLD_QA=1`).

The build/provenance audit preserves all 24 frozen original editorial/media assets and verifies eight locally authored sprite atlases plus the bundled Three MIT notice and package hashes. No untrusted remote models or fonts were added. This is local evidence, not a claim about an unpublished production deployment. No push/deploy.


## Cozy refresh preparation,10 November2026 - source-only, browser gate pending

The preceding M7 figures/runs are historical engineering-release evidence. Current cozy source verification is recorded in the visual checklist and ignored d09-light/preparation.json:182client modules,1exactly pinned Three0.187.0 runtime dependency,1028matching EN/ID locale keys,296static key references,0debug statements/remote runtime imports. The narrow Three import allowlist now names all10actual renderer modules already rewritten by the builder; other bare packages and remote imports remain rejected.

A shared read-only security-source-audit.mjs scans195project-owned client text files for the existing unsafe HTML/eval and credential-like patterns, reporting0matches without printing potential credential content on a failure. This static pattern scan is NOT a dependency-advisory check or penetration test. It starts no server/browser/network/build. Existing Three MIT/pinned bundle/source/atlas provenance verifies; its audited date is updated to the actual10November source check. All117native modules and six accepted D08homepage assets remain byte-identical, and seven original editorial main sections match31bbced.

Security/SEO/Fish/package runners are prepared with optional coordinated local slot/cutoff and cleanup for the cozy workflow. Basic security adds a fixed paused native fixture and whole protected-storage-map equality after malicious import. Fish security now enters current3D Settings/camera rather than retired area selectors, retaining8current/future xwidth/language cases,32malformed import attempts, native supply-debt disclosure and exact primary/backup/archive/reload protection. SEO checks the actual declared cozy1200x630 social PNG instead of a preserved old illustration. Local canonical-package verification retains raw Git byte checks, with per-file deadline validation and cleanup restricted to its own HTTP server/child.

These prepared browser/HTTP suites have NOT run for D09 yet; current advisory scan, canonical package, full release suite and live policy/header verification remain pending. No source/economy/save/schema/production header or dependency change, browser/build/heavy test, push or deploy occurred in this preparation checkpoint. Daily stop remains17:00WIB/10:00UTC10November; next exclusive verification slot must be coordinated with Zebra.


## Cozy D09 local verification accepted,10 November2026

Current evidence supersedes the preceding preparation-only status: desktop/mobile core CSP/HTML-import/whole-save-map checks pass;8Fish current/future xEN/ID x320/1440 cases pass with32malformed imports and exact primary/backup/archive/reload preservation. No external game requests or observed page/CSP violations.9SEO routes/15responsive navigation checks and actual1200x630 cozy social PNG pass.

Committed dist tree f848fadfc227c03e750cfe87a41f1ceb5dbea3c4 from79492b7 validates242files/14receipt entries, with241actual local HTTP objects matching Git SHA256 exactly (_headers serves only as policy). Read-only registry npm audit snapshot2026-11-10T08:04:48.9738902Z exits0 with0advisories across all severities; no dependency update/install/fix. Current provenance/MIT/pins/source patterns pass. See ignored d09-proof.json and the cozy visual checklist for full hashes/scope.

D09 is accepted25/30; full E01 release regressions and E02-E05 pipeline/release/live/rollback gates remain open. All local test resources closed by08:06:13UTC. No push/deploy or physical-device/live/penetration-test claim.
