# M7-F09 - full save protection and rollback readers

`tools/unified-save-protection-e2e.mjs` passes **21 isolated browser profiles**, with no uncaught errors. Its oracle uses the original `SaveSession` and memory store, comparing every protected `myfarmtwin.save.*` entry, not just coins or a selected area. Evidence: `qa-artifacts/unified-m7-save-protection/save-protection.json` and actual captures/downloads beside it.

Seven frozen V0 through V5 fixtures exercise the real browser migration/archive paths. Recovery, corrupt/future primary data, archive/quarantine name collisions and complete graphics unavailability are covered. Eleven camera/focus/heading actions per case preserve the complete protected store; original export and reload remain exact. Graphics unavailability intentionally returns null contexts and proves the HTML actions, not a rendered map.

Four desktop/touch-emulated WebGL/Canvas data journeys exercise original export, invalid import, cancelled import/reset, full all-five import, confirmed reset and backup restore. The actual classic rollback link opens all five original area readers and returns to preview without losing progress. Two injected primary-write quota failures verify the original durable backup/primary outcome and reload. Two real preview/classic tab races use concurrent trusted pointer releases: the original lock accepts exactly one harvest and the full native ledger agrees.

All tests use synthetic QA saves in disposable contexts. No personal profile, schema bump, new save key or engine changes. No push/deploy.
