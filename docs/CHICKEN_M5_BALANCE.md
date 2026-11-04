# M5 paid-economy balance gate

All92 headless tests pass. Matrix:7/30/60/90 game days for crop-only, mixed crop+two hens, and chicken-only under ideal/neglected/fixed-hot/fixed-hot+paid-shade care. Every resource/upgrade uses actual paid commands; daily V2 roundtrips, ledger/stock bounds and replay rejection remain active. Fixed-hot overrides climate only in the controlled simulation, not production behavior. Full JSON remains outside Git in task-2/qa/chicken/m5/balance.json.

|90-day strategy|Coins|Eggs sold/laid|Operating profit|Paid infrastructure|Save bytes|
|---|---:|---:|---:|---:|---:|
|Crop-only,8beds|7649|0|not attributed|not attributed|85547|
|Mixed,8beds+2hens|8204|142|not separately attributed|not separately attributed|104767|
|Chicken-only ideal,6hens|1199|384|1587|570|34148|
|Chicken-only hot,6hens|1139|374|1527|570|32374|
|Chicken-only hot+paid shade,6hens|1077|371|1535|640|32165|
|Neglected,2hens|204|11|49|0|14366|

Cash and infrastructure differ because strategies reinvest at different times. Ideal chicken cash at7days is45Coins after180Coins reinvestment; operating profit is55Coins and minimum cash27. This is a real early trade-off, not free upgrades. All cared scenarios remain solvent with positive operating profit and increasing cash+paid infrastructure. Chicken-only supports six hens later; the mixed strategy deliberately retains two hens while expanding crops, so this is a comparison of stated strategies rather than an equal-size yield claim.

Neglected production stops at11eggs:30/60/90-day Coins and egg totals stay identical, no feed purchases and no hen loss. Progress comes from care/supplies, not offline time. Automation still needs purchased feed and a service Coin, water is transferred from the shared tank, collection/sales remain actions, grants/order bonuses cannot repeat. Fixed-hot drinking averages0.45L per hen-day; paid shade reduces the90-day average to0.339L (includes pre-installation days). Its cost delays some flock growth, making the investment meaningful rather than universally dominant.

No real prices or husbandry forecasts are implied. Existing crop balance/config, routes and source media remain unchanged. M5 passes; production QA/release/live verification are still M6.
