# One shared Market — M3-F07

7 November 2026: **33/82 = 40.2%.** The existing Market modal is reused by
the global toolbar and the single actual Market building. Neither route creates
a second inventory, wallet, transaction handler or simulation clock.

`tools/unified-market-farm.mjs` stages five real saleable outputs from the frozen
V5 mixed fixture using 53 accepted original commands over nine native days:
three crop lots, two egg lots, 19,719 mL of newly collected milk, a harvested
2,000 g grade-A fish lot, and one actually grown eligible goat. Fish are harvested
on their actual first ready day, before the longer goat growth period. No money,
animal, growth, mission or inventory fields are inserted into the fixture.

`tools/unified-market-parity-e2e.mjs`: **8/8 PASS**, desktop/touch emulation ×
EN/ID × Three/Canvas. Each profile opens the same DOM dialog from the toolbar,
the actual roof at all four headings, and its accessible object alternative.
All five inventory families appear together. Eight sales per profile (64 total)
match the unchanged engine's complete serialized state after every transaction.
The shared balance moves from 2,108 to **2,437 Coins**; the goat sale leaves two
companions. The modal/canvas identity and sole interval persist, ledger IDs are
unique, and reload preserves the exact final state.

The first assertion read `innerText` from a closed ledger disclosure and got an
empty string. It now checks the existing hidden disclosure's `textContent`;
no transaction code changed. Initial log retained as
`qa-artifacts/unified-m1/market-first-failure.log`. Fixture preflight also caught
incorrect test-only field names before any browser execution; those were fixed
against the original native selectors. Lint/typecheck/frozen seven-save audit PASS.

Actual desktop inventory/mobile receipt captures were opened. QA receipts and
captures remain ignored under `qa-artifacts/unified-m3-market-parity/`, final log
at `qa-artifacts/unified-m1/market-parity.log`. Touch is emulated, not physical
Android evidence. No gameplay/schema change, push or deploy. Next: mission jump.
