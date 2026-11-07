# M7-F03 — repeated presentation changes cannot duplicate progress

Current global-menu UI journeys passed on 16 isolated profiles (fresh/earned farms, desktop/touch emulation, EN/ID and WebGL/Canvas). QA uses the visible Camera/Objects/Settings disclosures and actual native actions, without force-clicking hidden controls.

- `qa-artifacts/unified-m7-no-duplicate-starters/starters.json`: 8/8; 384 camera focuses, all four headings, pan/zoom/Low transitions and unstarted object selection never grant stock, advance time, or add ledger entries. All 32 explicit starter actions match original dispatch exactly and survive reload, with no replayed grants.
- `qa-artifacts/unified-m7-no-duplicate-owned/presentation.json`: 8/8; 280 focuses plus 160 rotations/locale switches while each of five contexts remains selected, six native compatibility selection events per profile, same-save import and reload retain the full original farm and ledger bytes. The original hidden area tabs remain inert in unified mode. Import clears selection without changing camera focus; closing panels clears the actual selection.

Every check uses the full serialized native save, not just coin totals. One original simulation interval and one persistent canvas are asserted. Fixture installation is guarded so reload cannot silently replace progress with the initial test save. Actual captures are stored in each QA directory. The preceding preference suite separately proves that even failing optional UI storage does not affect an accepted harvest. No push/deploy; physical-device testing remains unavailable.
