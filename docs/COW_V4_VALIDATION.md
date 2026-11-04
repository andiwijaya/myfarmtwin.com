# Cow V4 consistency boundary

Cow V4 now serializes exact units, source-tagged feed/water, all production/session fractions, milk lots, sale remainder, credit, receipts, disposal reasons, recovery state, mission evidence, transaction counters and the third-cow purchase prerequisites. The current public production save is V3; intermediate private branch snapshots are not a supported published format.

Canonical source rows:

| Type | ID suffix | Required amount/source |
| --- | --- | --- |
| Starter | `cow.starter.v1` | One zero-Coin row at first entry |
| Feed | `revision:cow.feed` | One configured paid8kg bag |
| Trough/cooler/shade/sanitation/barn | `revision:cow.trough/cooler/shade/sanitation/barn` | One exact configured debit per owned upgrade |
| Third cow | `revision:cow.purchase.1` | One exact240Coin debit, prior expansion and matching acquisition/proof |
| Cooling | `revision:cow.energy:tick` |1Coin per6 prepaid active hours, unique absolute tick, ownership first |
| Milk sale | `revision:cow.sale:sequence` | Exact cumulative integer revenue and receipt chain |
| Contract | `revision:cow.order:orderID` | Separate configured bonus, one completed order and same-revision sale |
| Recovery | `cow.recovery.episode` | Zero Coins, bounded herd-specific source totals, durable effort/cooldown |

Validation cross-checks every owned paid flag against those rows; starter and purchased IDs/acquisition times; global and per-cow milk mass; dense plain arrays and own data properties; live session spacing; possible freshness age and paid cooled-hour bounds; source entitlements/intake; whole-Coin revenue/remainder and ordered receipt tails; contract completion/bonus source;16-hour job effort and24-hour completion intervals; and causal mission/grant evidence. Display histories can be cleared/compacted without resetting lifetime accounting or deduplication. Receipts/disposals remain bounded.

The third-cow proof stores the actual purchase hour, feed/water capacities and available quantities checked at purchase; current care continues consuming stocks normally afterward. A purchase must not refill supplies or create opening milk. Final purchase execution is M5; its V4 boundary is already defined here.

Cooler status is derived after accepted commands so other farm income/expenses are reflected without buying energy outside ordinary ticks. Fees still run after existing pump and Chicken service. A zero wallet pauses cooling without debt; sale arithmetic refuses amounts above the supported shared-wallet bound before mutation.

242 full unit tests and12 native-clock/recovery browser profiles pass at M4-F05. Controlled tests cover coherent wallet-preserving forgeries as well as simple corrupt counters; successful V4 roundtrips include partial contract milk, energy credit, missions/upgrades and active/completed recovery. Exact V0/V1/V2/V3 source readers/fixtures remain compatible.

This local consistency boundary does not authenticate user-controlled files or replace server-side security. Whole older legitimate backup restoration restores the whole snapshot; it never merges resources into a newer save. No production publication has occurred.

M5-F08 balance revision `cow.v1.1-b2` changes care-job effort from8 to16 ordinary game hours after the initial90-day generous recovery benchmark left paid care only3.3% ahead. Ration quantities and24-hour completion cooldown are unchanged. Earlier M3/M4 reports retain their historical8-hour evidence; final tests use the configured b2 effort. Cow has never been published, so no public CowV4 data migration is implied; actual V0–V3 players still receive the empty module normally.
