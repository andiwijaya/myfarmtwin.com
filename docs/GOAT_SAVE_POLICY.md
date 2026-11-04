# Goat save integration — prerequisite reader boundary

The audited baseline envelope was V2 with Chicken. Current envelope is V3. V2 is validated using its original strict field set, then receives only an empty unvisited Goat subtree and the version bump; V0/V1 retain their earlier validated crop migration path and add empty Chicken/Goat states. No migration/read/render grants animals or changes funds, water, weather/RNG, crops, Chicken, inventory, ledger or missions.

This additive reader was required at M2-F02 before any Goat command could persist a new field. It does not complete M4: exhaustive Goat import/export/recovery/concurrency/endurance gates remain pending until later features exist.

Existing primary/backup/quarantine keys stay unchanged. `myfarmtwin.save.before-chicken.v1` remains the immutable pre-Chicken archive. New `myfarmtwin.save.before-goat.v2` stores the exact prior primary before upgrading to V3. Migrating V2 does not read/overwrite the pre-Chicken archive. Migrating V0/V1 preserves both applicable original archives before writing primary. A conflicting archive, quota failure or changed primary returns a blocked migration preview; it does not overwrite the old primary. Future versions are detected before backup recovery.

The original-data exporter can recover the pre-Goat original; the existing pre-Chicken exporter remains available. No automatic deletion or site-data clearing. Browser writes remain under the same origin lock, with primary compare-before-write and rolling backup.

Engine Goat commands use the same revision+1 check, strict plain-object/payload validation and private-clone atomic dispatch. M2-F02 integrates first-entry/inspection plus shared-clock age; unimplemented husbandry commands reject without mutation until their sequential features. Starter transaction has zero Coins and a stable one-time ID. All Goat wallet entries are checked against model stock/purchase/sale/grant counters, independently of crop/Chicken ledger entries. The UI does not invoke real first-entry until M3.

M2-F02 evidence outside Git: `task-2/qa/goat/M2-F02/`. Lint/typecheck/build, 105 unit tests, original Chicken save/data browser gates, complete original E2E recovery/import/black-box/crop flow, four bilingual Goat UI/save-preservation cases and security pass. Frozen V1 crop replay hashes are unchanged after excluding only additive animal subtrees. Exact captured production V2 config/reader/storage hashes are verified; that old client refuses V3 before reading its valid V2 backup, and neither primary nor backup bytes can be overwritten. Existing V1 rollback remains tested.

No remote push, deployment or production save migration has occurred for Goat.
