# V1 simulation contract

The model is an educational approximation for a game, not an agronomy prediction or advice. One tick is one game hour, one bed is 1 m², all soil/rain/irrigation/ET/drainage terms use mm; 1 mm over a bed equals 1 L taken from the tank. Soil capacity is 50 mm. All water values stay in [0, capacity]. Rain is applied each tick, ET follows crop config and weather, and drainage removes overflow plus 12%/hour of the amount above 90% capacity.

Growth/hour = 1 / crop.hours × waterFactor × weather.growth. Water factor: <20% moisture .2; 20–40% .65; 40–90% 1; >90% .65. Stage is derived from configured progress thresholds, never renderer time. Sunny/cloudy/rainy/hot change ET, growth and rain via config. Seeded daily RNG and forecast are deterministic.

Quality changes gradually each hour: -.004 for <20% or >90% moisture, +.003 otherwise; bounded [.35,1]. Crops never vanish after one mistake. Yield is at least one, floor(base yield × quality); Market later uses quantity × price × quality. All prices are fictional game balance. Manual watering adds at most 25 mm, costs 2 Coins, and cannot repeat on the same bed in the same game hour.

Clock starts paused. Next Day deliberately runs 24 ordinary ticks even when paused; play clock advances one hour/3 seconds (or 2×). Tab hiding pauses the clock. No wall-clock/offline degradation or timestamp-based rewards.
