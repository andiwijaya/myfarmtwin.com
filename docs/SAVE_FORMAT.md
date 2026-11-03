# Save V1

Versioned JSON envelope: `format=MyFarmTwin`, `saveVersion=1`, and the complete engine snapshot in `state`. It preserves sequential command revision, logical hour, weather seed/RNG/current weather, pause/speed, plots/crops/quality/water/history, tank, seeds, inventory lot IDs, complete ledger, one-time mission rewards, pump state/hours, completed orders, stats and expanded grid. Unlocks are derived deterministically from saved mission/pump/plot state, avoiding duplicate flags that can drift.

Validation precedes engine/UI access: exact fields, plain objects, finite bounded numbers, known crop/weather/order IDs, sequential configured plot positions, stage consistency, inventory totals, one-time reward/order keys, monotone history, unique transactions and ledger reconciliation. Unknown fields, prototype properties, invalid totals and >2 MB saves are rejected. No save text becomes HTML. No wall-clock timestamp or offline simulation is used.

Autosave/storage recovery and migration are the next M5 micro-features; this checkpoint establishes the tested portable schema only.

Storage now saves each validated command locally, with one rolling backup. Stale-tab writes are refused. An unreadable primary is recovered from a validated backup only after preserving the exact original in a separate quarantine slot; an occupied different quarantine prevents replacement. With no safe recovery, the game opens a fresh preview and refuses to overwrite the original. Future-version saves are never downgraded. A known pre-release v0 envelope (same fields, no plot history) migrates to V1 with the old bytes backed up; this is a tested compatibility fixture, not a claim of previous public save support. No source file or storage data is silently deleted.
