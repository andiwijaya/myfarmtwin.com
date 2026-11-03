# V1 simulation contract

The model is an educational approximation for a game, not an agronomy prediction or advice. One tick is one game hour, one bed is 1 m², all soil/rain/irrigation/ET/drainage terms use mm; 1 mm over a bed equals 1 L taken from the tank. Soil capacity is 50 mm. All water values stay in [0, capacity]. Rain is applied each tick, ET follows crop config and weather, and drainage removes overflow plus 12%/hour of the amount above 90% capacity.

Growth/hour = 1 / crop.hours × waterFactor × weather.growth. Water factor: <20% moisture .2; 20–40% .65; 40–90% 1; >90% .65. Stage is derived from configured progress thresholds, never renderer time. Sunny/cloudy/rainy/hot change ET, growth and rain via config. Seeded daily RNG and forecast are deterministic.

Quality changes gradually each hour: -.004 for <20% or >90% moisture, +.003 otherwise; bounded [.35,1]. Crops never vanish after one mistake. Yield is at least one, floor(base yield × quality); Market later uses quantity × price × quality. All prices are fictional game balance. Manual watering adds at most 25 mm, costs 2 Coins, and cannot repeat on the same bed in the same game hour.

Clock starts paused. Next Day deliberately runs 24 ordinary ticks even when paused; play clock advances one hour/3 seconds (or 2×). Tab hiding pauses the clock. No wall-clock/offline degradation or timestamp-based rewards.

## Controlled headless comparison

`node tools/scenario-comparison.mjs`: same seed 6321, same initial lettuce bed, fixed sunny climate fixture to isolate watering. Dry: 10 days to maturity, 0 L manual water, 0 mm remaining soil, 35% quality, 1 produce, 0 care cost, sale 6 Coins. Watered: 3 days, 50 L, 26 mm remaining, 100% quality, 3 produce, 4 care cost, sale 48 Coins. Mission rewards are excluded from sale/care figures. Each command checks soil/economy bounds and repeated runs match exactly. The fixture overrides game weather identically for both scenarios; this is a causal model test, not a weather forecast or real-world recommendation.

Inspect displays up to 48 actual hourly moisture/growth samples. Care cost includes manual watering plus the equal share of pump energy charged to covered beds; tank refills remain a separate farm-wide ledger cost. Efficient motors halve energy frequency while preserving water delivery.
