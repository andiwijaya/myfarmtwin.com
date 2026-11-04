# Cow Farm V1.1 — local model gate

Authoritative specification: Library `libfile_af2b8f2e0db881918dcdc1e510040b4f`, original V1.1. This is derived verification documentation, not a materialized Library copy.

All M2 features are implemented in the shared ordinary-hour reducer. No wall-clock advance, independent Cow currency, RNG calls, or animal death was added. Two existing adult, post-calving, mid-lactation cows persist in one V4 farm save. Actual V3 migration and archives remain protected.

Controlled 24 seeds × 6 conditions × 24 ordinary hours produced these aggregate admitted mL:

| Condition | Produced mL |
| --- | ---: |
| Adequate feed/water, clean barn | 247488 |
| No feed supplied | 19152 |
| No drinking water supplied | 19152 |
| Dirty barn | 193920 |
| Hot, basic shelter | 229680 |
| Hot, paid shade fixture | 247488 |

These are controlled causal fixtures with fixed weather, not a forecast of live earnings or real farming yields. Each seed repeats exactly. Feed uses 16000 g per two-cow ordinary day; water uses 60000 mL normally and 90000 mL hot. Reservoir limits suppress overflow rather than accumulating a hidden backlog. Integer opening/produced/ready/collected/stored/discarded mass balances and save roundtrips pass.

The same initial B milk at hour 9 is rejected in an uncooled can (freshness100) and remains B in a paid cooler (775), costing2 operating Coins. Cooling buys6 active hours for1 Coin, never restores grade/age and cannot create debt. UI tests prove real movement, fees, decay, disposal and reload in EN/ID desktop/touch layouts. Exact capacity3999/4000 mL boundary and rejected-stock occupancy are covered headlessly and in the browser.

This gate does **not** claim first-sale onboarding, recovery, final economics, full V4 economic validation or production readiness. Those remain in M3–M7. No Cow push/deploy is authorized.
