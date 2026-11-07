# Truthful unstarted areas — M3-F09

7 November 2026: **35/82 = 42.7%.** Revalidated after native objective navigation.
Every unvisited livestock zone has an available footprint and explicit Start
action. No hens, goats, cows or fish are drawn before actual entry. Merely
selecting the available footprint does not enter the area.

`tools/unified-starter-e2e.mjs`: **8/8 PASS**, desktop/touch emulation × EN/ID ×
Three/Canvas. Before any entry, all four available objects are selected, labels
say “not started / belum dimulai”, and all owned counts and Started flags stay
zero/false. Eleven pan/zoom/rotation/fit/reset actions and two quality changes
leave exact source bytes, revision0, tick0 and empty ledger intact. Programmatic
clicks on retired hidden area buttons are inert. Four headings × seven bookmarks
then preserve the same full save.

Only the four explicit native entry commands grant the original two hens,
three goats, two cows and twelve fish. Five more camera bookmarks after each
entry retain current context and exact state. This is **384 bookmarks**, 88
extra camera actions, 16 quality switches and 32 accepted entry commands across
the eight profiles. The original sole interval remains the only clock, ledger
IDs remain unique, unstarted choices disappear only after entry, and reload is
byte exact. Existing M3 objective tests separately prove first-plot camera
navigation cannot select the plot or complete its mission.

Actual unstarted desktop Three and fully entered mobile Canvas captures were
opened. QA receipts/captures are ignored under
`qa-artifacts/unified-m3-unstarted/`; log:
`qa-artifacts/unified-m1/unstarted.log`. No product code change was needed.
Full unit suite remains 423/423 PASS from the immediately preceding source
checkpoint. Physical mobile testing remains unavailable; touch here is
emulated. No push/deploy. Next: M3 all-five hard gameplay gate.
