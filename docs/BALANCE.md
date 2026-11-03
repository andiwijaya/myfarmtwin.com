# Crop balance — 60 simulated game days

Deterministic seed 6321, 3 beds, manual care below 55% soil moisture, harvest/sell/replant as available. No pump, market-order bonuses or expansion. Every command checks non-negative economy, ledger and soil invariants. These are simulated strategies, not player metrics or real farming prices.

| Strategy | Net Coins | Harvested beds | Water used (L) | Lowest Coins |
|---|---:|---:|---:|---:|
| Lettuce, normal refill | 1,777 | 57 | 1,860 | 107 |
| Tomato, normal refill | 2,530 | 33 | 2,763 | 35 |
| Lettuce, refill at most weekly | 950 | 42 | 972 | 107 |
| Tomato, refill at most weekly | 340 | 16 | 1,000 | 61 |

Tomato yields more per harvest and more profit with plentiful water, with ~49% greater water use, slower turnover and a smaller cash buffer. Lettuce outperforms under limited supply. Both remain profitable and neither dominates every scenario. Growth is linear with bounded beds, not exponential. Weekly supply is a test constraint, not a restriction imposed on players. Keep crop values in config; retune from future consent-aware play feedback rather than pretending these numbers are universal.

Reproduce: `node tools/balance.mjs`. Regression assertions cover positive progress, non-negative minimum balance, bounded return and the reversal under water constraints. Initial values remain unchanged after this audit.

## Mixed-farm endurance

`node tools/long-session.mjs`: 90 game days, 1,172 validated commands, 234 stale replay attempts rejected, daily exact save/deserialize equality. Eight beds, all three orders and all three follow-up missions completed; 503 pump hours, 528 produce harvested/sold, minimum balance 52, ending balance 7,649. Peak save 85,107 bytes. The bot's pump decisions are test-player commands, not runtime sensor automation. Browser tests also import the full 90-day state on desktop/mobile and select the eighth bed without overflow.
