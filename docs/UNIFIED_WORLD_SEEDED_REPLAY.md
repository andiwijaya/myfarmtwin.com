# M7-F07 — original interface versus unified map

`tools/unified-five-area-gate-e2e.mjs` now supports both the original SVG/HTML interface (`UNIFIED_INTERFACE=classic`) and the unified map. It uses actual visible original area/HTML controls or the new Camera/Objects/context UI; no forced hidden clicks, engine replacement or injected economy state after fixture installation.

Four original-interface profiles and eight unified profiles (desktop/touch emulation, ID/EN, WebGL/Canvas) completed the same **235 accepted native commands over nine game days**. All five care/production/sale flows, shared Market, native missions/rewards and reload passed. Every command checked the complete serialized native state including weather/RNG, inventories, coins and ledger. Total: **2,820 actual UI commands**. Every paired result ended at 2,708 coins with identical milk/egg/fish/goat outcomes.

`tools/unified-replay-compare.mjs` passed all eight paired trace comparisons against the original command timeline. `qa-artifacts/unified-m7-replay-comparison/comparison.json` records the pairs and the final oracle digest `1ee2b86740c554af79f7bf9f2d5ec6d9bc2645dc968ce9b7b382b8f372c98c88`. Actual original/unified JSON traces and captures are in `qa-artifacts/unified-m7-replay-{original,unified}`. The original path correctly retains its old area tabs; only the unified path asserts one Scene/camera/canvas and no old tabs. Both retain the single original interval.

The original engine/domain/save files remain identical to the frozen pre-upgrade checkpoint. These are local isolated-browser comparisons, not physical-device or live-release evidence. No push/deploy.
