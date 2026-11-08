# M7-F08 - local security and asset audit

The production dependency is exactly pinned Three.js 0.187.0; all renderer code, fonts and assets load locally. `npm audit --json` reports zero vulnerabilities in all severities (`qa-artifacts/unified-m1/m7-package-audit.json`). No package installation or automatic dependency upgrade was performed.

`node tools/audit-client.mjs` passes: 171 source modules, 1 pinned production package, zero debug statements and zero external runtime imports. The audit now distinguishes five explicitly allowed source Three imports from delivered modules, which must resolve to bundled local files. It checks the installed package version too. The first audit found a retained standalone batches module still using a bare import. The build rewrite and an actual module identity regression test corrected that path; the active bundled renderer had already resolved correctly. Other bare/remote imports remain rejected.

Classic and unified `npm run security` both pass desktop and touch-emulated profiles. Real browser CSP/header checks, original crop commands, malicious import rejection and preservation of current saves produce zero CSP violations or external requests. Evidence: `qa-artifacts/unified-m7-security/security.json` and `qa-artifacts/unified-m7-security-unified/security.json` (the latter uses `UNIFIED_WORLD_QA=1`).

The build/provenance audit preserves all 24 frozen original editorial/media assets and verifies eight locally authored sprite atlases plus the bundled Three MIT notice and package hashes. No untrusted remote models or fonts were added. This is local evidence, not a claim about an unpublished production deployment. No push/deploy.
