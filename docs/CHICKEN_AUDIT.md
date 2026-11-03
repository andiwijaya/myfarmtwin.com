# Chicken Yard baseline audit

## M0-F01 — actual source and serving baseline

2026-11-03 12:43 UTC: repository `C:\MyFarmTwin`, origin `https://github.com/andiwijaya/myfarmtwin.com.git`. Main and remote main are `131133ba4597e4c4a031317dc9b1b679275a6110`, with clean working tree. Local `homepage-live-game` ends at `def03f2846301d184691caefd73906e3ae90749a`; it is already included in main. New work is isolated on `chicken-yard-v1`; no other uncommitted work was found. No applicable AGENTS.md or additional repository skills were found. The rg executable is unavailable; safe PowerShell/file reads are used instead.

Actual public host remains Cloudflare Pages `myfarmtwin-com`, GitHub main, static `dist`, empty remote build command. Canonical production is `fb9344f5-49a4-4284-ba96-42260809534d` / source `def03f2`, successful 09:05:50 UTC. The later report-only `131133b` was skipped. Current public integrity check matches all 37 resource bodies against that source. No deployment or configuration change has been made for Chicken Yard. The read-only Cloudflare session initially returned 403 because its OAuth session expired; the official existing Wrangler read command refreshed it, and current deployment inspection then succeeded. No access was broadened.

Baseline state is strict saveVersion 1, same `myfarmtwin.save.v1` storage key, logical hourly ticks, three initial beds, 120 Coins/120 L, crop weather RNG, shared ledger, orders/missions and exact validated JSON roundtrip. All fixtures use newly generated headless farm state; no personal browser save is read or copied.

Rollback before V2 release: retain the verified prior deployment above. After V2 release, prefer a Chicken-disabled build that retains the V2 reader/schema and state; never roll code back in a way that overwrites V2 data with V1. Existing V1 code explicitly rejects newer saveVersion and preserves its original bytes, which is required fallback behavior if infrastructure must serve it temporarily. Export/backup and redeploy forward before resuming such saves. No destructive reset is a migration or rollback strategy.

## Authoritative PRD provenance

Library item `libfile_8d98a75e8c4c819198823d58931a6d22`, version 3, `MYFARMTWIN_CHICKEN_FARM_PRD_V1(1).md`, 506 lines, metadata size 46,946 bytes, was read completely through the supported Library read route before implementation. The read text supplies 46,945 UTF-8 bytes without its final LF. The repo copy preserves all returned text exactly and adds that single terminal LF, yielding 46,946 bytes and SHA256 `305881ce5eaaad73526dbc306f1776c0328a68d9d5f23a4b71cc9879fa5d8d47` before checklist edits. This is the verified text-derived repo copy, not a claim that the previously incompatible Windows materialization helper ran successfully. Library version 3 remains authoritative; no Library file is overwritten. The older master PRD is preserved separately.

QA evidence is outside Git at `task-2/qa/chicken/baseline/`. Production assets, original media, one-card homepage, GA4, routes, SEO and user data are protected.
