# Fish final QA

## M6-F01: actual local candidate, all five areas

Fish is now ON only in the local release candidate, after complete M3/M4/M5 gates. No push/deploy has occurred and the homepage still truthfully marks Fish planned pending live verification. Explicit OFF rollback remains tested separately and preserves all saved Fish while old-area hours continue.

Evidence outside Git: `qa/fish/M6-F01-five-area/five-area.json` (8fresh/actualV2mixed ×desktop/mobile ×EN/ID); `qa/fish/M6-F01-*/` (36Fish profiles); `qa/fish/M6-F01-crop/` (original crop complete E2E, data/recovery/offline/stale-tab and9editorial routes). Native five-area paths complete crop, egg, goat, milk and Fish sales in the same save/Market/wallet, then Fish upgrade/restock. Paused Fish transactions preserve every old subtree/water/clock/RNG exactly. Reload preserves saved state and all companion IDs; zero page errors/overflow. Actual browser runtime uses the local gateON (no Fish interception in the integrated path).

Reproduce `node tools/fish-five-area-e2e.mjs` with external QA_DIR and configured Playwright executable, plus the individual Fish tools. Type/build/client audit and7real ON/explicit OFF/core integration unit tests PASS. Additional legacy Chicken/Goat and the17suite Cow black-box matrix run as broader final regression; they are not claimed passed here before results complete. M6-F02 onward and publication remain pending.

## M6-F02: deterministic property testing

`node --test game/tests/fish-fuzz.test.mjs` PASS2 (external `qa/fish/M6-F02/test.txt`).2400generated actions across fresh, entered, paid two-pond/filter/feeder and genuine zero-resource recovery states, replayed with the same local test seed. Each first replay accepted342 and rejected858 actions. Every rejection returns the untouched source; every accepted state preserves cash/mass/capacity/history bounds and roundtrips. Fish-only commands preserve all older subtrees/water/clock/RNG; pond2 care leaves pond1 exact, feed clicks cannot grow mass. Seeded replays produce identical full state. Deeply frozen state/command input remains untouched and replayed revisions cannot duplicate resources. Randomness is test-local; the game has no new RNG draw.
