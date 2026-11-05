# Fish economy acceptance (M5-F07)

All values are fictional game balance, not real aquaculture advice or investment returns. Evidence: external `qa/fish/M5-F07-final-current/report.json`; reproduce `QA_DIR=<outside-repo-dir> node tools/fish-economy.mjs`. Source hash: `82bbdf93d0cbd0ea7ae2047a16dc72f2da21b42720d0b969447b9199e2be87a3`.

26 profiles each sample7/30/60/90 logical days: twelve Fish-only and twelve actively cared mixed-farm strategies, a generous recovery-farming upper bound, and a zero-wallet/empty-field-tank path. The zero path is replayed twice with identical full serialized state (27 total runs). Every daily state roundtrips; mass/cash/capacity/history bounds are asserted. Hot is an explicit controlled hourly weather override, not new random draws. No owner save is used.

| Farm | Policy | Sold kg at90d | Operating margin after outstanding aid liability | Capital | Finite bonuses | Net Fish cash | Aid liability |
|---|---|---:|---:|---:|---:|---:|---:|
| fish | normal | 20 | 20 | 45 | 70 | 45 | 0 |
| fish | low-feed | 12 | 49 | 45 | 70 | 74 | 0 |
| fish | high-feed | 2 | -181 | 45 | 10 | -120 | 96 |
| fish | no-feed | 2 | -101 | 45 | 0 | -120 | 26 |
| fish | hot | 16 | -120 | 45 | 70 | -95 | 0 |
| fish | air-off | 2 | -308 | 45 | 0 | -118 | 235 |
| fish | basic | 20 | -79 | 0 | 0 | -79 | 0 |
| fish | night-air | 20 | 36 | 45 | 70 | 61 | 0 |
| fish | no-exchange | 20 | 87 | 45 | 70 | 112 | 0 |
| fish | filter | 24 | 219 | 145 | 70 | 144 | 0 |
| fish | feeder | 20 | 20 | 135 | 70 | -45 | 0 |
| fish | second | 24 | 219 | 145 | 70 | 144 | 0 |
| mixed | normal | 20 | 4 | 45 | 70 | 29 | 0 |
| mixed | low-feed | 12 | 43 | 45 | 70 | 68 | 0 |
| mixed | high-feed | 16 | -775 | 45 | 55 | -765 | 0 |
| mixed | no-feed | 2 | -120 | 45 | 0 | -165 | 0 |
| mixed | hot | 20 | 5 | 45 | 70 | 30 | 0 |
| mixed | air-off | 2 | -586 | 45 | 0 | -631 | 0 |
| mixed | basic | 20 | -175 | 0 | 0 | -175 | 0 |
| mixed | night-air | 20 | 94 | 45 | 70 | 119 | 0 |
| mixed | no-exchange | 20 | 87 | 45 | 70 | 112 | 0 |
| mixed | filter | 24 | 184 | 145 | 70 | 109 | 0 |
| mixed | feeder | 20 | 4 | 135 | 70 | -61 | 0 |
| mixed | second | 40 | 201 | 530 | 70 | -259 | 0 |
| fish | aid-upper | 7 | 116 | 0 | 0 | 184 | 68 |
| fish / zero | normal | 20 | 101 | 45 | 70 | 126 | 0 |

## Findings and acceptance

The initial measured balance failed: Fish-only could exhaust working capital and residual water/air aid blocked a different genuine feed shortage. Eligibility now uses actual net shortage, keeping16hour work and24hour cooldown, capped net supplies and no Coins. It never stacks credits above the shortage target. Used emergency feed/water/air are an interest-free operating advance valued at normal feed/water and efficient-air rates; unused supplies owe nothing. Existing source-used counters and repayment ledger prove this without new save fields. Cumulative rational valuation uses3000 units/Coin, rounded once. A Fish sale first repays any5Coin stock principal, then at most half its remaining gross repays used-supply liability, preserving working cash. Market displays gross, deductions and exact net before selling; Lab and shop disclose outstanding liability. No interest or wall-clock accrual. Genuine empty-stock work still reaches a real sale and repays its stock advance.

The recovery upper bound externally escrows all cash after sales to maximize shortage eligibility, while generously ignoring this sink in its Fish margin. This is an explicit test fixture, not a playable action. Its unpaid liability must be deducted from earned operating value; counting debt-funded cash as free profit produced a false comparison and is rejected. Well-equipped paid mixed care beats that liability-adjusted upper bound before capital and finite bonuses. All aid sources, work, fish growth, sales and deductions are actual reducer actions.

Fictional TAN growth penalty was reduced from100 to75 scaled units per mg/L, preserving causal stress ordering, bounded feed-to-growth and all physical budgets. No sale/feed/water price or existing wallet value changed. Paid biofilter service was tuned from six to24 useful hours perCoin; ledger prefixes distinguish historical6hour blocks from new24hour blocks so already recorded credit retains exact value. The filter's additional capital is recovered by day90 in both measured baseline policies. It lowers actual TAN with oxygen use and energy cost; no magic water reset.

An auto-feeder now unlocks after four genuine grown fish as well as the first chapter, avoiding premature convenience capex. In the fully funded comparison it changes click burden and90Coin capital, not output or operating production. It is not marketed as a profit multiplier. Overfeed creates actual waste and worse margin, no-feed produces no growth, aeration OFF fails to grow a comparable harvest, hot/density policies remain bounded. Night-only air and reduced water exchange show explicit quality/cost trade-offs rather than an all-upgrades-always-best rule.

Second-pond progression uses actual growth/sales and shared earned funds. The mixed expansion policy buys two efficient/filter-equipped ponds, expands harvest capacity and keeps independent water/cohorts, but does not repay all expansion capital within90days. Assets and live fish remain; no instant-profit or guaranteed ROI claim. Fish-only need not afford every optional expansion in the same horizon. The existing mixed farm provides alternate earned cashflow.

Support and loan regressions PASS, full unit regression359PASS before the final convenience-unlock assertion, then9focused feeder/support/Lab tests PASS. Browser evidence `qa/fish/M5-F07-ui/report.json`:4native zero-wallet recovery EN/ID desktop/touch profiles, exact net160−80=80, one sale, no duplicate collection, preserved save. Type/build/client audit PASS. Full M6 regression/performance/security and publication remain separate gates.
