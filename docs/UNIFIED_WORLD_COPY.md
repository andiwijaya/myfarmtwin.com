# M6-F09 — native goal and bilingual navigation

The current native mission title now appears above the map as a real button opening the original Missions sheet. Its title follows the original goal after every accepted action and context change; it adds no quest, reward or game state. The compact landscape layout exposes the same goal through the Missions button description and a keyboard-focusable task shortcut. The map region name, camera instructions, object search, menus, context panels, status and fallback help are localized in ID/EN. The blue-outline legend is grouped with camera help.

Local isolated-browser evidence:

- `qa-artifacts/unified-m6-copy-objectives/objectives.json`: 8/8 desktop/touch-emulated × ID/EN × WebGL/Canvas journeys; 192 original accepted commands, current-goal equality after every command, all five contexts, exact save/ledger/reload and once-only native rewards. Scripted first harvest/sale/pump purchase took 10,617–15,372 ms, below 180 seconds. This measures automated execution with known steps, **not** a human comprehension study.
- `qa-artifacts/unified-m6-copy-menus/menus.json`: 8/8 profiles; all six menu labels, localized map name, original menu functions, purchase/sale/export and focus passed.
- `qa-artifacts/unified-m6-copy-layout/responsive.json`: 16 viewport profiles × normal/simulated-safe-inset cases, 32/32 passed; actual viewport captures saved. Portrait map/HUD/task rendering visually reviewed. No physical-device or virtual-keyboard hardware claim.
- Lint, typecheck, build and all 480 unit tests passed. Logs: `qa-artifacts/unified-m1/m6-copy-{lint,unit}.log`. The frozen domain/save audit also passed (126 original files, seven fixtures); M7 records its dedicated contract.

No push/deploy. The feature remains behind `?world=unified-preview`; the classic default is retained.
