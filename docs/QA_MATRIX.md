# V1 release QA matrix

All tests run locally; no GitHub Actions. Test artifacts stay outside Git. Automated touch/mobile emulation is explicitly not a physical Android test.

## White-box

- Seeded RNG/forecast/fixed ticks, immutable input snapshots, pause and sequential command IDs.
- Crop configuration/stages, dry/wet/overflow water bounds, gradual quality stress/recovery, causal crop/weather comparisons.
- Plant/harvest/inventory bounds, exact sales, complete ledger reconciliation, seed/water/facility limits, mission/order/follow-up exactly-once rewards.
- Pump coverage/ON/OFF/missing facility/partial-water/no-energy interlocks; efficient motor same irrigation at half energy.
- Versioned untrusted save validation, prototype/unknown/size/number/grid/stage/total rejection; legacy migration, backup/quarantine, quota and stale-tab protection.
- 60-day crop trade-off scenarios; 90-day mixed farm with daily exact save roundtrip, eight beds and all missions/orders.
- 2,500 seeded mixed valid/invalid commands audit input immutability, non-negative state, stale replays and serialization throughout.

## Black-box and regression

Chromium, desktop 1440×1000 and touch/mobile emulation 390×844: new-player full loop, actual map and keyboard input, contextual guidance, Market/order/upgrade, eight-bed farm, reload/reopen, future device clock, EN/ID, no horizontal overflow or uncaught errors. Explicit tests cover no-funds recovery, double watering, already-loaded game actions offline, real interval pause, two live tabs, disabled browser storage, corrupt/old/future saves, exact export, invalid/cancelled import, confirmed reset/import/backup restore.

First-harvest sale + pump is instrumented under 180 seconds in fresh contexts (normal lettuce care 3 game days). This is automated local task timing, not measured human completion time. All editorial routes/menu/canonical baseline and original FarmGirl asset remain regression targets. Cross-browser/accessibility/performance/security/SEO publication gates are recorded separately as completed.

## Dead-code / dependency checkpoint

Removed the unused initial type scaffold, internal-only renderer/camera exports, obsolete mission-number CSS and unused pending-dialog data. Enabled TypeScript noUnusedLocals/noUnusedParameters. Client audit checks debug statements, external runtime imports and referenced EN/ID key parity. Runtime dependencies remain zero; fixed development tools are Playwright 1.64.1 and TypeScript 7.0.2. `npm audit` reported 0 vulnerabilities across all severities. Original approved FarmGirl PNG Git blob remains `14c39ccbe566ef666fb8f6e3fb5527e545da619c`, matching baseline 31bbced. Local Git objects ~4.19 MiB at this checkpoint; no QA screenshots/cache or node_modules tracked. Existing publish.zip is user-owned/ignored and retained.
