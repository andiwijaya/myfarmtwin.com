# Goat V1 balance gate

32 deterministic real-command scenarios PASS at 7/30/60/90 game days: original crop strategy, original cared/neglected Chicken strategies, cared/neglected Goat-only and mixed farms, plus a Goat-only start whose wallet is reduced to zero by real seed purchases. Each day roundtrips the save and reopens SaveSession; complete accepted-command replay matches. No injected money, resources, RNG or extra clock.

The initial 24-Coin/6kg hay price failed the zero-wallet second-sale assertion. Tuned to **12 Coins/6kg**. The starter adult still sells once, young goats still cost 65, growth remains about 19 game days with consistent care, and social minimum two remains mandatory. Historical 24-Coin hay entries remain valid at their original recorded amounts; imports never reprice history. Original crop/Chicken balance values are unchanged.

| Days | Cared Goat wallet | Zero-wallet Goat wallet | Goat sales | Mixed wallet |
|---|---:|---:|---:|---:|
| 7 | 231 | 111 | 1 | 473 |
| 30 | 444 | 324 | 4 | 1,554 |
| 60 | 906 | 786 | 10 | 3,228 |
| 90 | 1,037 | 917 | 13 | 4,454 |

At 90 days, cared Goat condition is 91.3%; neglected is 22.3% and has no sale beyond the one starter adult. Neglect cannot print ongoing revenue. All cared zero-wallet daily nutrition stays at least 75%; no negative wallet/resources, herd under two, duplicate reward or over-capacity state. Peak saves remain below 87KB across this matrix, with Goat history capped at 96 entries.

The wallet includes shared farm transactions and one-time missions; Lab P&L separately labels direct ranch costs and allocated per-goat figures. This is fictional educational game balance, not real husbandry or financial advice. It is a verified strategy, not a guarantee that every spending choice is optimal. Crop/egg commerce and the existing crop recovery seed remain available.

162 unit tests, lint/typecheck/build, and four real EN/ID desktop/touch purchase profiles pass after tuning. Evidence outside Git: `task-2/qa/goat/M5-F07-before/balance.log` (reproduced failure), `M5-F07/goat-balance.json`, `M5-F07/goat-purchase.json`. Full release QA remains pending; no push/deploy.
