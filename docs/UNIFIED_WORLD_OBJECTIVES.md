# Native objectives, camera-only navigation — M3-F08

7 November 2026: **34/82 = 41.5%.** Hidden-preview guides now offer bilingual
“View objective / Lihat tujuan”. The button reads the existing crop guide target
or native Chicken/Goat/Cow/Fish objective. A pure resolver finds an actual current
entity, including current pond and stable animal IDs. Unknown/missing targets
produce no jump. The renderer moves its existing camera to that entity; it never
selects it, opens Market, grants an area, inspects, advances time or dispatches.
Heading, selected object and native context remain unchanged. Default classic
players retain the existing guide.

`tools/unified-objective-e2e.mjs`: **8/8 PASS**, desktop/touch emulation × EN/ID ×
Three/Canvas, **24 actual commands and 22 camera-only jumps per profile** (192
commands, 176 jumps). First-plot objective navigation leaves revision and mission
at zero, with all four unstarted modules unvisited. Actual selection, planting,
watering, three native growth days, harvest, sale and pump purchase complete the
original crop chapter. Its existing celebration appears while the camera is at
Cow. Native Chicken care/production/collection/sale completes the original
chapter and pays its reward once while the camera is elsewhere. Each profile
observes five original reward events overall and ends at **150 Coins**. Goat,
Cow and Fish first native objectives also resolve to their actual owned feed
stations after explicit entry. Full serialized engine/ledger state is exact
after every action; camera jumps leave it untouched. One canvas, one interval,
unique ledger IDs and exact reload persist.

Full unit suite **423/423 PASS**, including three new pure objective tests;
lint, strict typecheck, build, seven frozen-save checks, all 24 editorial/media
hashes and graphics provenance PASS. Default bundle is 478,333 bytes. No
simulation/economy/schema change. Native snapshots are supplied to unit tests,
matching the production adapter contract rather than inventing animal views.

The first browser run completed crop/Chicken but used the Chicken-only start
selector for Goat; QA now uses the existing zone-specific start attribute. The
failed log is retained at `qa-artifacts/unified-m1/objectives-first-failure.log`.
Final receipt and actual captures are in ignored
`qa-artifacts/unified-m3-objectives/`; final log at
`qa-artifacts/unified-m1/objectives.log`. Desktop celebration, mobile Canvas
initial navigation and prior Fish growth captures were opened. Touch is
emulation, not physical-device evidence. No push/deploy. Next: unstarted safety.
