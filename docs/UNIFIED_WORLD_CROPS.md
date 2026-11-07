# M2-F04 crop, pump and irrigation mapping

7 November 2026. **20/82 = 24.4%.** All eight owned plot IDs, their native
positions, actual soil/crop state and installed pump are mapped into the shared
world. Four real growth stages and both crop types retain their original
engine-derived values; the primitive art remains a later graphics task.

The main game supplies covered IDs through its existing `pumpCovers` selector.
The adapter/renderer never reimplements that formula or imports the economy
reducer. Pump position uses the original `PUMP` configuration. Without a coverage
provider the adapter reports coverage as unknown and draws no guessed network.
Only an owned pump produces plumbing; unknown/stale IDs are filtered out.

Installed pipe/nozzle geometry maps the six actual covered beds. Static colour
reflects the real switch setting; it is not animated water flow, and it cannot
add moisture, growth, time, costs or rewards. Pump/pipe selection uses the
existing pump context and validated controls. No new save fields or schema.

Verification:

- **8/8 targeted tests** pass, including native paid purchase/expansion to eight
  beds, exact command replay, all four simultaneous real stages, immutable
  coverage/ID mapping, no guessed/unowned pipes, and switch-only state cues.
- Strict typecheck, lint, build, frozen-save/editorial/media/license/hash and
  Git-filter byte audits pass. Typecheck caught an obsolete pump-colour branch
  after the dedicated pump shape was added; that unreachable branch was removed.
- **8/8 browser profiles**: desktop/touch emulation × EN/ID × Three/Canvas.
  Four headings and all eight IDs yield 256 real terrain picks. Coverage is
  exactly IDs 1,2,3,4,5,7 from the original selector.
- 152 accepted UI commands match the entire source-engine serialization,
  including all five areas, weather/RNG, inventories, Coins and ledger. With
  sufficient original supplies, 24 pump hours add exactly 18 mm to each covered
  plot and zero pump water elsewhere. Tomatoes reach readiness through five real
  `nextDay` commands, then harvest/sale/reload remain exact. Final tested balance
  is 1774 Coins in every renderer/locale profile. Default desktop/mobile E2E
  also passes original production/upgrades, homepage/editorial routes, recovery,
  import/export/reset, offline actions, real clock and stale-tab protections.
- One persistent canvas and one original simulation interval remain. The paid
  fixture itself is generated through original commands, with no inserted money,
  forced growth or fabricated elapsed time. QA captures were opened and reviewed.

Evidence: `qa-artifacts/unified-m2-crops/{crops.json,paid-native-fixture.json,
fixture-trace.json}`, stage/ready PNGs and `qa-artifacts/unified-m1/crop-*.log`.
These are ignored QA data, not personal saves or published art. No push/deploy;
physical-device, later animal/gameplay and final graphics/release gates remain.
