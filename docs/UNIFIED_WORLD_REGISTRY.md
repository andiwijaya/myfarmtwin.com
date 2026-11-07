# M2-F01 fixed world registry

7 November 2026. **17/82 = 20.7%.** The immutable registry defines one world,
five farm zones, central Market, reserved future land and eleven connected
axis-aligned path segments. Coordinates are illustrative presentation units;
they do not change engineering measurements or authoritative save fields.

| Area | X range | Z range | Camera anchor |
|---|---|---|---|
| Field | -10…0 | 1…8 | (-4, 4) |
| Chicken | -10…0 | -11…-2 | (-4, -6) |
| Goat | 9…25 | -18…-6 | (17, -12) |
| Cow | 12…27 | 3…14 | (19, 8.5) |
| Fish | -2…10 | 11…25 | (5, 18) |
| Market | 3.5…6.5 | -1.5…1.5 | (5, 0) |
| Future land | -18…-4 | 12…23 | (-12, 17) |

World bounds are X -20…30 / Z -25…25, centered on the Market anchor.
All zone bounds are nonoverlapping and inside the world; anchors and entries
fit their own zones. Explicit path junctions connect all five entries, Market
door and future land without routing through the Market building. The registry
also supplies immutable coordinate transforms and footprint/overlap helpers.

The existing snapshot adapter now derives Crop, Chicken and Market positions
from that registry. Their proven positions, stable domain IDs and two-zone
framing are preserved. Other zones are registered data at this checkpoint;
their geometry/gameplay is not yet rendered or claimed complete. Terrain and
path installation follow as separate M2 features.

Verification: **13/13 targeted tests** for registry, model, camera and selection;
strict typecheck and build; exact frozen saves/editorial/media/notice/bundle
audits. Four new tests verify deep immutability, nonoverlap/containment,
axis-aligned connected graph, safe transforms/footprints and unchanged fresh/
mature all-area saves. Browser production flows pass again on desktop EN/Three
and mobile ID/Canvas: three days, 29 accepted commands, full engine/ledger
equality, save/reload and classic rollback each. No new domain grants or clocks.

The headless engineering layout capture was opened and checked. Labels are
layered above the paths so all zones remain readable. It is explicitly a
coordinate plan, not evidence that five zones are already rendered in the game.
Receipts: `qa-artifacts/unified-m2-registry/`; command logs:
`qa-artifacts/unified-m1/registry-*.log`. All QA output remains ignored.

No push/deploy. Physical-device and later gameplay/visual/release gates remain.
