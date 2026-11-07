# M2-F06 Goat Ranch layout and native selection

The hidden unified world reads actual ownership, paddock biomass, active paddock,
shelter level/care equipment and every saved goat ID. The existing native
`goatSnapshot` supplies biological stages, sale eligibility and logical activity;
the renderer does not classify growth or implement welfare/sale formulas.
Unstarted land contains only an explicit starter footprint. Camera/selection
cannot enter the ranch or grant supplies. The original validated `enterGoat`
command remains the only entry action.

Two bounded paddock layouts keep up to eight actual goats outside the shelter
and inside the active grazing footprint. Original pasture, hay, water, cleaning,
platform, contract and individual animal targets open the existing native panel.
Rotation uses the original command and changes the displayed active paddock.
Source IDs, all five domain states, wallet, ledger and save schema remain intact.

Validation receipts and actual screenshots belong in ignored
`qa-artifacts/unified-m2-goat/`; logs are `qa-artifacts/unified-m1/goat-*.log`.
The first geometry-pick test targeted empty space between the horns; its failed
receipt is retained. The corrected test targets the visible head volume.
These are provisional owned-layout meshes, not M4 directional animation or M5
final art. Browser touch profiles are emulation, not physical-device evidence.

7 November 2026: **22/82 = 26.8%.** Full units **401/401 PASS**; lint,
typecheck, build, seven frozen V0-V5 fixtures and 24 editorial/media hashes PASS.
Browser **16/16 PASS**: unstarted/paid maximum x desktop/touch emulation x
EN/ID x Three/Canvas, four headings each. 96 original entry/care/paddock/
inspection/sale commands match full serialized engine state after every action;
no camera grants, duplicate tickers, canvas replacement or page overflow.
Native animal ID counts, original focus return and actual head geometry picking
pass. Reload is exact. Desktop Three and mobile Canvas captures were opened.
No push/deploy. Next: M2-F07 Cow Barn.
