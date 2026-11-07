# M3-F02 crop, pump and upgrade interaction parity

Crop selection retains the original native tutorial/seed/water/harvest commands.
Selecting the pump now clears the stale selected Plot panel, so the visible
context matches the actual pump target. Pump coverage, hourly application and
motor economy remain the original engine selectors and fixed-tick simulation.

The new browser journey starts from the frozen earned mixed farm with three
plots and no pump. All seed purchases, initial harvest/sales, pump/motor purchases
and five bed expansions happen through the existing Market UI. It then grows
lettuce and tomato through actual watering/ordinary game days, harvests/sells
both products and compares the entire five-area serialized state after every
accepted command. Camera focus on Fish leaves the selected pump/field context
active. A real 24-hour pump run applies exactly native coverage/rates.

Every one of the eight actual bed geometries is picked at all four headings in
both renderers, and the final save reloads exactly. Captures/receipts live in
ignored `qa-artifacts/unified-m3-crop-parity/`; logs are
`qa-artifacts/unified-m1/crop-parity-*.log`. Touch is emulated. No new engine,
economy, save schema or production media changes. No push/deploy.

7 November 2026: **28/82 = 34.1%.** **8/8 browser profiles PASS**:
desktop/touch emulation x EN/ID x Three/Canvas. Each executes 46 accepted
commands over six real game days, exactly matching complete native state and
ledger: **368 commands**, 256 actual plot geometry picks at four headings,
final 1786 Coins per profile, exact reload and unique ledger IDs. Pump selection
hides the stale Plot panel; remote camera focus preserves pump/field context.
Both crops are actually grown/harvested/sold and all paid upgrades use Market UI.
Twelve affected model/selection/coverage unit tests, strict typecheck, lint,
build, frozen-save and original-content/provenance audits PASS. Last full suite
is 417/417 before this small panel fix; full M3 gate rerun follows. Actual desktop
Three/mobile Canvas captures were opened. No push/deploy. Next: M3-F03 Chicken.
