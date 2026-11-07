# All-five gameplay gate — M3-F10

7 November 2026: **36/82 = 43.9%. M3 HARD GATE PASSED.** All eight browser
profiles completed 235 accepted commands each (**1,880 total**) over nine
native days each, with no browser errors. Every profile finishes at 2,708 Coins
and the exact same full source state. Actual desktop Three and mobile Canvas
first-day/overview/Cow/Goat captures were opened.

`tools/unified-five-area-journey.mjs` uses the frozen V5 mixed fixture and
unchanged source engine to produce one simultaneous care/production/sale
journey. It advances nine actual native days through **235 accepted commands**,
without inserting funds, animal stages, milk, biomass, eggs or crops. The
browser gate replays those commands through existing actionable HTML panels
reached from real world-object choices and the shared Market. It never calls
the engine inside the browser test or uses retired area tabs.

The original engine oracle yields six harvested/sold crop units, **15 new eggs**
(17 sold including two previously pending), **144,603 mL newly produced milk**
(164,322 mL sold including opening reservoirs), **2,000 g actual harvested/sold
fish**, and one real grown eligible goat sold while retaining two companions.
Coins move from **2,219 to 2,708**. Every seed, ration, water refill, cleaning,
inspection, collection, production tick and sale uses original native commands.

`tools/unified-five-area-gate-e2e.mjs` observes the actual production Three
`Scene` and `OrthographicCamera` classes through their existing update methods;
it checks identity after every accepted action. The same scene/camera/canvas
and sole original simulation interval must persist across all five contexts.
Complete serialized source state, RNG, weather, missions, inventories, wallet
and ledger must match after every command. Four final overview headings and
all five zone views are captured; reload must be exact.

The eight profiles are desktop/touch emulation × EN/ID × actual Three/forced
no-WebGL Canvas. Touch emulation is not physical Android evidence. Screenshots
and receipts are ignored under `qa-artifacts/unified-m3-five-area-gate/`;
run log: `qa-artifacts/unified-m1/five-area-gate.log`.

The first run asserted a repeated Cow feed purchase was enabled immediately,
before the original 300 ms double-gesture guard elapsed. The gate now uses
Playwright's normal actionable-button wait. It does not bypass the guard or
change any native production code. Initial failure remains at
`qa-artifacts/unified-m1/five-area-gate-first-failure.log`.

The directly preceding complete unit run is **423/423 PASS**. The final gate
lint passed. Native default-interface `tools/e2e.mjs` passed desktop/mobile
homepage/editorial, tutorial, recovery/data and black-box storage/concurrency
checks; `tools/fish-five-area-e2e.mjs` passed all eight fresh/mixed ×
desktop/touch × EN/ID profiles. Their ignored receipts are in
`qa-artifacts/unified-m3-gate-classic-e2e/latest.json` and
`qa-artifacts/unified-m3-gate-classic-fish-five-area-e2e/five-area.json`.

Strict typecheck/build, seven frozen V0–V5 fixtures, all 24 editorial/media
hashes, receipt/bundle/license and source provenance checks passed at the
immediately preceding product-source checkpoint. The gate adds QA only.
`git diff 0061b73` confirms no changes to engine/config/save-schema/storage or
Chicken/Goat/Cow/Fish simulation runtimes. No schema bump, economy rewrite,
release-flag promotion, push or deploy. M4 may now begin. M4–M8 quality, hardening and release acceptance remain
pending; the classic rollback and hidden `?world=unified-preview` remain
available. Physical Android/iOS/Safari testing is unavailable in this lab,
and current explicit release authorization has not been verified. These do not
block the next local animation/art micro-features.
