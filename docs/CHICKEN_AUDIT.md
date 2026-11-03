# Chicken Yard baseline audit

## M0-F01 — actual source and serving baseline

2026-11-03 12:43 UTC: repository `C:\MyFarmTwin`, origin `https://github.com/andiwijaya/myfarmtwin.com.git`. Main and remote main are `131133ba4597e4c4a031317dc9b1b679275a6110`, with clean working tree. Local `homepage-live-game` ends at `def03f2846301d184691caefd73906e3ae90749a`; it is already included in main. New work is isolated on `chicken-yard-v1`; no other uncommitted work was found. No applicable AGENTS.md or additional repository skills were found. The rg executable is unavailable; safe PowerShell/file reads are used instead.

Actual public host remains Cloudflare Pages `myfarmtwin-com`, GitHub main, static `dist`, empty remote build command. Canonical production is `fb9344f5-49a4-4284-ba96-42260809534d` / source `def03f2`, successful 09:05:50 UTC. The later report-only `131133b` was skipped. Current public integrity check matches all 37 resource bodies against that source. No deployment or configuration change has been made for Chicken Yard. The read-only Cloudflare session initially returned 403 because its OAuth session expired; the official existing Wrangler read command refreshed it, and current deployment inspection then succeeded. No access was broadened.

Baseline state is strict saveVersion 1, same `myfarmtwin.save.v1` storage key, logical hourly ticks, three initial beds, 120 Coins/120 L, crop weather RNG, shared ledger, orders/missions and exact validated JSON roundtrip. All fixtures use newly generated headless farm state; no personal browser save is read or copied.

Rollback before V2 release: retain the verified prior deployment above. After V2 release, prefer a Chicken-disabled build that retains the V2 reader/schema and state; never roll code back in a way that overwrites V2 data with V1. Existing V1 code explicitly rejects newer saveVersion and preserves its original bytes, which is required fallback behavior if infrastructure must serve it temporarily. Export/backup and redeploy forward before resuming such saves. No destructive reset is a migration or rollback strategy.

## Authoritative PRD provenance

Library item `libfile_8d98a75e8c4c819198823d58931a6d22`, version 3, `MYFARMTWIN_CHICKEN_FARM_PRD_V1(1).md`, 506 lines, metadata size 46,946 bytes, was read completely through the supported Library read route before implementation. The read text supplies 46,945 UTF-8 bytes without its final LF. The repo copy preserves all returned text exactly and adds that single terminal LF, yielding 46,946 bytes and SHA256 `305881ce5eaaad73526dbc306f1776c0328a68d9d5f23a4b71cc9879fa5d8d47` before checklist edits. This is the verified text-derived repo copy, not a claim that the previously incompatible Windows materialization helper ran successfully. Library version 3 remains authoritative; no Library file is overwritten. The older master PRD is preserved separately.

QA evidence is outside Git at `task-2/qa/chicken/baseline/`. Production assets, original media, one-card homepage, GA4, routes, SEO and user data are protected.

## M0-F02 — integration map and protected contracts

| Existing contract | Chicken extension point | Protection |
|---|---|---|
| engine.js dispatch clones state, requires id=revision+1, atomically validates before return | Additional namespaced Chicken commands in the same dispatch path; bounded module functions operate only on that cloned state | Rejected/replayed commands return original state. One shared revision/ledger; no DOM stock/economy writes |
| engine.js hour advances crops/pump, increments tick, seeded weather at day boundary | Consume chicken resources in this same hourly function; lay once per hen at a fixed game-day boundary | No second clock; read existing weather; egg samples are pure hash(seed,day,henId), never advance crop weather RNG |
| config.js controls crop costs/capacities/IDs | Small chicken-config module with explicit g/L/game-day and integer fictional Coins | No existing crop parameter change; independent chicken namespace for IDs/grants/stats |
| world.js builds isometric SVG then camera.js wires picking/controls | Separate Field/Yard presentation views inside /play/ and shared bounded rotate/zoom/pan/reset | No extra game/save. View operations are presentation only, distinct from crop select command/mission |
| main.js render()/send() owns state projection and SaveSession | Chicken view/panel projected from snapshot, using same send/save/error path | Area navigation/camera cannot advance time or trigger crop rewards. Only active area's mission/guide is shown |
| market.js receives snapshot and Send callback; engine transact() appends reconciled ledger | Egg lots/feed/coop/hen supplies in the existing Market; distinct transaction labels | Crop inventory/order/sale paths retained unchanged. Chicken totals tracked separately; no fake crop lots |
| missions.js advanceMission + FOLLOWUPS grant only namespaced existing checks | Independent chicken mission progress/grant IDs derived from real actions/state | Same guide slot switches by active area; no duplicate crop grants or simultaneous tutorial prompts |
| save-schema.js strict keys/types/IDs/bounds and SAVE_VERSION=1 | V2 adds one additive Chicken subtree; validate untrusted data and explicit migration chain | Preserve every crop scalar/nested field, RNG/seed, ledger, water, order/mission and revision. Starter kit only on entry, not migration |
| storage.js owns SAVE_KEY, backup, quarantine, compare-before-write and SaveSession | Retain key identity, exact old-version preservation before upgrade, schema-aware load/import/export | No wall-clock simulation. Quota/conflict/future/corrupt data fail closed; keep original bytes and offer safe recovery |
| data-tools.js confirms destructive import/reset; format guarded | Export/import/reset/backup must roundtrip complete V2 | Existing fixtures/replay outputs are oracles; personal storage is never used for QA |

Fresh synthetic V1 baseline roundtrip: 965 UTF-8 bytes, SHA256 `e6a725a0edf732c1fbb85a89e05814a59e303f34769ea07a4dd667327a5aa8d9`. Baseline renderer has zoom/pan/reset only; rotation is new work, not an existing true 3D/WebGL claim. All camera picking is DOM/SVG geometry-based, enabling consistent hit testing after projected orientation changes.

## M0-F03 — complete baseline commands and evidence

All existing commands were run locally before game changes: lint, typecheck, test (45/45), build, e2e, compat, balance, endurance, audit:client, performance, seo, security, homepage; public integrity also passed (37 exact resources). Chromium 153 and Firefox 155 full crop journeys pass. Twelve game viewport/locale accessibility surfaces and 16 single-card homepage surfaces pass; protected editorial content/assets match baseline. No uncaught errors, CSP violations or external game requests; malicious imports preserve saves.

Ninety-day endurance: 1,172 commands, 234 rejected replays, eight beds, all three orders/follow-ups, 528 harvested/sold, minimum52/end7649 Coins, peak85,196-byte save. Four60-day crop strategy outcomes are retained as oracles in logs. No runtime dependencies, debug statements or external module imports.

Performance is environment-sensitive: the initial unchanged-source mobile4x stress run measured13.9FPS while desktop was60FPS and stopped before low-mobile. An isolated rerun after other browser work finished passed all four profiles: desktop60FPS; mobile4x full55.8 / low53.3FPS; first interaction191 /1595ms. Both reports are preserved (`performance.json` and `performance-repeat/performance.json`); the failed sample is not erased. Release performance must be measured again on the completed feature with controlled workload; physical Android remains unmeasured. No game bug or code change was used to make the rerun pass.

There is no remaining baseline functional failure. QA evidence remains outside Git at `task-2/qa/chicken/baseline/`. The current public deployment remains unchanged.
