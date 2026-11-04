# Cow Farm M5 balance gate — local only

Source: original Library `libfile_af2b8f2e0db881918dcdc1e510040b4f`, V1.1. This is an implementation report, not a materialized copy of the PRD.

Current private balance is `cow.v1.1-b2`. All 47 fixed-seed scenarios plus one exact serialized replay passed: 7/30/60/90 days of dairy alone and dairy with crops, chickens, goats or all three; neglect; earned expansion; zero-wallet starts (three seeds); delayed sales with/without paid cooling; and a deliberately generous recovery policy. Real commands, shared hourly ticks, paid supplies, daily save round-trips and fixed RNG are used. No offline income or real-world yield/profit is implied.

| Days | Dairy Coins | Dairy + crops | Dairy + chickens | Dairy + goats | Four-area Coins |
|---|---:|---:|---:|---:|---:|
| 7 | 376 | 578 | 479 | 481 | 786 |
| 30 | 1384 | 2234 | 1650 | 1702 | 2797 |
| 60 | 2697 | 4447 | 3170 | 3367 | 5417 |
| 90 | 4009 | 6704 | 4671 | 4924 | 8198 |

These ending balances are actual whole-farm Coins, not dairy profit or a comparison at equal labor. The progression policy earns its third cow by day 30 (no gift); the 90-day ending balance is 4,255 Coins. All ordinary paid policies remain solvent without recovery jobs. Neglect earns no milk sales and causes neither death nor irreversible loss. Paid cold storage retains milk under a deliberately delayed 10-hour selling schedule where the uncooled route loses saleability.

## Recovery tuning and limits

The first private balance used 8 hours of job effort. In the matched funded 90-day benchmark normal paid care was only about 3.3% ahead of the generous recovery comparator. Job effort is now 16 ordinary game hours. The minimum 24-hour interval between completions, shortage recheck, tagged top-up cap, second independent episode, zero-wallet recovery and 8-hour milking spacing are unchanged.

| Days | Paid care score | Generous recovery score |
|---|---:|---:|
| 7 | 333.10800 | 240.93506 |
| 30 | 1340.88000 | 924.87306 |
| 60 | 2657.40000 | 1812.69506 |
| 90 | 3972.12000 | 2704.80106 |

Normal paid care beats this comparator by at least 15% at 30/60/90 days (about 46.9% at 90 days). The comparator includes an explicitly controlled external cash sweep, counts milk revenue without charging that external spending and thus favors recovery. It is a tested adversarial policy, not a playable cash-removal feature or proof over every possible strategy. Purchased input book value adjusts unused feed/water; restricted aid has no tradable value. Shared refill costs in mixed scenarios are conservatively charged, not falsely allocated solely to dairy. Capital purchases are reported separately from operating scores.

Evidence outside Git: `qa/cow/M5-F08-matrix/cow-balance.json`, its actual earned `cow-progressed-90.json`, the preliminary and b2 recovery benchmark JSON, and four EN/ID desktop/mobile recovery UI profiles. Peak save in this matrix was 160,868 bytes. Typecheck, build, client audit and all 262 unit tests pass with b2. Public pre-Cow schemas still migrate to an empty, unvisited Cow area; no public Cow save is being rewritten. The historical M3/M4 reports accurately describe their then-current 8-hour private balance; this report supersedes that effort value only.
