# M3-F01 independent world selection, focus and panel context

The unified world now owns an immutable presentation model with three separate
values: `selectedEntity`, `focusZone` and `contextZone`. Selection accepts only
stable IDs resolved from the current read-only world snapshot. Camera focus
preserves the selected object and panel context; Market preserves the current
district context. Available land cannot activate care panels or grant ownership.
Closing/removing the selected object clears its ID. Import clears selection and
context, while retaining camera-only focus.

`main.js` reads unified context through `uiArea()`. Its old `activeArea` variable
is now confined to the classic rollback and compatibility guards; it no longer
chooses the unified scene or its context. Hidden legacy area tabs are inert in
preview. Original HTML object events route to the same actual world entities,
including pond-specific Fish selections; the first Plot selection still uses
the original native tutorial command exactly once. Explicit entry callbacks
send original commands, then select the resulting owned object.

The native care panels, missions, save transaction queue and economy remain the
existing implementations. There is no scene replacement, extra ticker, hidden
starter grant, alternate save or frame-driven simulation. Full gameplay parity
and the M3 hard gate remain separate checkpoints; this feature establishes the
selection/focus architecture.

Evidence directories: ignored `qa-artifacts/unified-m3-presentation/`,
`unified-m3-starters/`, `unified-m3-vertical-regression/`, and
`unified-m3-default-regression/`. Logs use
`qa-artifacts/unified-m1/presentation-*.log`. All browser contexts are disposable;
touch is emulated, not physical-device testing. No push/deploy.

7 November 2026: **27/82 = 32.9%.** Full **417/417 unit tests PASS**;
lint, strict typecheck, build/provenance, seven frozen V0-V5 fixtures and
24 editorial/media hashes PASS. Eight selection profiles prove 280 independent
focuses, correct closure, same-save import, all legacy object event bridges and
inert legacy area tabs. Eight fresh profiles prove 384 further focuses with
zero look/hidden-tab grants and exactly 32 original explicit starter commands.
Sixteen full fresh/mixed Crop+Chicken vertical profiles replay 512 native
commands with exact full all-five save/ledger comparison, reload and rollback.
Deliberate module404 restores classic gameplay and two native actions exactly.
Original full desktop/mobile E2E (game/editorial/data/recovery/offline/pause/
stale-tab/blocked-storage) PASS. Actual desktop Three/mobile Canvas captures
were opened. No push/deploy. Next: M3-F02 crop and pump interaction parity.
