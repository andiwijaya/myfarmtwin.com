# Goat Ranch deterministic husbandry gate

M2-F01–F10 verified locally; 130/130 unit tests, lint/typecheck and game-only build pass. Evidence: `task-2/qa/goat/M2-F01` through `M2-F10`, outside Git. Model is not a finished playable/released Goat expansion yet: the UI is still the M1 presentation gate until M3 wires ownership, real care and shared Market transactions.

The existing farm owns one clock, one seeded weather/RNG, one wallet/ledger and one water tank. Goat simulation runs only from its logical hour. Next Day is exactly 24 ticks after excluding only differing command revision counts. Paused commands and system-clock shifts cannot change the Goat simulation. Frozen original crop replay and Chicken tests remain green.

Goat state is strict and additive: finite bounded values, stable registry identities across live/sold goats, social group of at least two, capacities, unique grants, derived maturity, owned-time age/growth checks and bounded history. Unvisited state is empty. Engine commands validate exact keys/revisions and reject atomically. The prerequisite V3 reader/archives and exact V2 rollback protection are documented separately; M4 remains pending.

Resource chain:

- Stored hay is bought with shared integer Coins, transferred into the rack and consumed; store+rack+used matches granted+bought grams.
- Trough ml transfer from the shared litres tank, then are consumed by actual drinking. No transfer charge or generated water. Hot weather increases demand.
- Leafy browse is consumed before hay. Paddock initial+regrown biomass equals remaining+consumed. Rain/rest improves bounded regeneration; heat/active pressure reduces it. A second paddock/rotation is implemented later in M5.
- Shelter gets dirty during used logical hours. Cleaning adds at most 20, caps at 100 and has a six-game-hour cooldown, with no repeatable currency reward.
- Actual intake updates recent nutrition/hydration, derived cleanliness/space/weather comfort and gradual body condition. No instant healing, disease/death or absence penalty. Body condition has a validated 0.2 floor.
- Juveniles mature using actual care factors over compressed game hours (base 16 days). Paid care in an earned mixed farm reaches maturity in the specified 12–20-day range; equally elapsed shortage remains far behind. First starter adult is already mature. Care clicks alone never advance growth.
- Sale policies require maturity, adequate condition and two goats remaining; capacity/Coins checks reject purchases. Deterministic integer live-livestock quotes read shared tick and condition. Actual sales/purchases and mission rewards are M3/M5 work.

Security/coherence checks reject unknown/prototype fields, duplicated IDs/stock, nonfinite values, impossible owned-time consumption/regrowth/healthy progress, cleaning spam and too-fast juvenile growth. Supplies and histories remain bounded; these are educational game approximations, not real husbandry predictions.

M3 next: first-entry starter supply voucher and real saved scene, one-time guide, actual Feed/Water/Clean/Inspect, shared Market contract, atomic ready-adult sale, restocking/reward, <=180s desktop/touch EN/ID vertical slice and old-game regression. No push/deploy is authorized.
