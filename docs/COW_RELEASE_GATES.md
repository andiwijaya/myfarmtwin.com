# Cow Farm local release gates

Authority: original Library `libfile_af2b8f2e0db881918dcdc1e510040b4f`, Cow PRD V1.1. This derived evidence report does not imply publication.

## M6-F01

The final b2 build passes 17 black-box suites / 84 isolated browser profiles. Fresh and actual old farms complete the first sale and upgrade goal at native 1x clock with zero wallet/tank. EN/ID desktop/touch profiles cover all care and tagged supply routes, individual milk eligibility, integer sales and exact contracts, freshness/cooling/discard, restricted recovery, every equipment purchase, third-cow capacity/supply gate, Lab and save/reload. The area-selection suite switches all four areas and checks prior farm data, preserved IDs and zero incidental simulation writes. No owner profile or production save is opened. Evidence: `qa/cow/M6-F01/cow-full.json` and the per-suite JSON/screenshots. This is local/headless evidence; physical mobile and Safari are not claimed.

## M6-F02

All 262 tests pass on b2 (`qa/cow/M6-F02/unit.log`), with typecheck, build and runtime audit. Meaningful invariant coverage includes 24 seeds × six matched care conditions, shared weather/RNG with Math.random/Date.now disabled, exact 24-tick/NextDay equivalence for all four areas, post-calving/lactating eligibility and fixed lactation scenarios, 90-day paid care, admitted-only reservoir production/fractions, exact feed/water source conservation, collection grade/freshness, two/day and absolute milking spacing, one-rounding sale carry/partial FIFO contracts, paid energy accounting, protected command objects/replays and durable grants. The 47-case economic gate additionally exercises 7–90-day command traces, daily serialization and exact repeated whole-state SHA. Existing tests are reused rather than adding assertions that merely mirror implementation. Boundary details remain in COW_V4_VALIDATION.md and the focused game/tests/cow-*.test.mjs files.

## M6-F03

Current b2 security gate passes: 16 desktop/touch storage-resilience profiles, eight EN/ID confirmed/cancelled data-management profiles, four EN/ID two-tab races for the retuned 16-hour job completion, and two actual browser CSP/malicious-import profiles. The earlier complete 40-command and eight third-purchase races remain applicable; the only changed timing was additionally rechecked. An optional race-mode selector enables that focused rerun while retaining the default 40-case gate and strict expected counts.

Quota, blocked storage, absent/denied mocked Web Locks, corrupt data, future primary plus valid backup and poisoned namespaces preserve original data/read-only status as appropriate. These are test-mocked browser failures, not infrastructure access denials. Downloads preserve current partial contracts/prepaid credit or active jobs and both original-era archives exactly. Invalid/cancelled imports do not write; confirmed reset/backup restore retain full backups. All 262 unit tests include forged balanced costs, quantities, grants, freshness, prototype/getter/symbol/unknown fields and stale revisions. Client CSP/security audit has zero external requests or uncaught errors and does not change any permission or security setting. Evidence: qa/cow/M6-F03-{resilience,data,race,security}.
