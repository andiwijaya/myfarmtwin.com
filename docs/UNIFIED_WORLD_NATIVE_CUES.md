# Native stock and eligibility cues - M4-F10

7 November 2026: **46/82 = 56.1%.** Goat/Cow trough and milk-container capacities
now come from their original native selectors. Fill geometry and external milk
gauges show actual stored amounts rather than a full-looking fill for any
positive quantity. Chicken fills already use original coop capacity. Fish
feeding stations expose actual pending ration grams; automatic feeder settings
are described as settings, never fictitious grams. Pump enabled/shortage state,
paused clock, real aerator service and cooler state remain distinct.

Every accessible world object carries current detached native quantity/status/
stage/eligibility facts. Its ID/EN description reads the real stock and optional
capacity; only original eligibility adds Ready/Siap. Cow readiness uses the
existing milking selector, including hygiene/space/session restrictions, rather
than assuming any stored milk is immediately collectible. Snapshot revision/
tick diagnostics update only with the authoritative state. Camera work cannot
update them or create actions. No new engine, RNG, clock or save field.

Validation: **453/453 unit PASS**, lint/typecheck/build, seven frozen V0-V5
saves, original24 media/eight audited atlas PNGs, provenance/build/MIT PASS;
default core478,386 bytes. Eight EN/ID, desktop/touch, WebGL/Canvas journeys
PASS:56 accepted original commands and96 full truth checks. Actual mesh fill
height is checked independently against native stock/capacity; original Cow
eligibility, nests, pending Fish ration, service/cooler status and all owned
animal IDs/counts agree. Toggling pump/air alone never delivers water/oxygen.
Native milking into can/cooler, original next-day consumption and entire
serialized five-area state/ledger match after each accepted command.

Each journey then imports a validated empty farm: zero animal actors/shadows,
all four unstarted areas remain unstarted through camera focus. Restoring the
paid farm and reloading restores exact original progress/IDs/counts without
historical intake/milking effects. Imports use normal data tools and isolated
synthetic saves. Initial unit fixtures were corrected to use the intended
unvisited V3 Cow farm and actual native feeder setting; engine rejection of
duplicate entry/off settings was preserved.

Evidence: ignored `qa-artifacts/unified-m4-cues/cues.json`, actual stock captures,
owned/fresh synthetic inputs and `qa-artifacts/unified-m1/m4-cues-unit.log`.
Native engine/schema/storage/domain-runtime files remain unchanged. Full video/
30-minute animation gate and later performance/release gates remain pending.
Physical Android/iOS/Safari unavailable. No push/deploy or release authorization.
