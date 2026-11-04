# Cow Farm save migration and rollback contract

The M0 audit read the real released `dd8184e` configuration and captured byte/hash-verified **V3** synthetic fresh/mixed fixtures before Cow changes. The local branch's configuration and exported `SAVE_VERSION` now identify **V4**, exactly one additive version. This is a V3→V4 release, not a second bump inferred from a later local checkout. The authoritative PRD remains original Library `libfile_af2b8f2e0db881918dcdc1e510040b4f` V1.1.

V0/V1 crop, V2 Chicken and V3 Goat data are validated against their actual historical structures, then receive only legitimately absent empty animal modules and the current envelope version. Migration, reading, rendering and autosaving cannot grant cows, milk, supplies, money or completed missions. Only an explicit revision-safe first Cow entry receives the one-time starter.

Primary/rolling-backup keys remain unchanged. Exact pre-migration primary bytes are preserved under `myfarmtwin.save.before-cow.v3`; when upgrading directly from an older era the archive holds that actual original version, not a fabricated intermediate V3. Existing pre-Chicken and pre-Goat archives are retained. A conflicting archive or failed archive write produces a read-only migration preview. Missing fields in an already-current V4 save are corruption, not permission to refill/default Cow assets.

Tests discover the source version from immutable original data and the target from the current exported configuration. A future-version primary is protected before backup recovery and cannot be overwritten by normal save; even a valid older/current backup does not permit silent fallback. Malformed current data follows corruption/quarantine rules. Confirmed import/reset is a separate explicit user action that must preserve replaced bytes first.

The exact released V3 reader refuses a new V4 primary with a valid V3 backup and leaves both untouched. Application rollback and farm-data rollback are separate: preserve/export current V4 bytes, use the retained exact V3 original only with the compatible older application, and keep the V4 export for returning to the new application. No automatic downgrade/merge is supported. Dedicated archive export controls and full failure/race tests are M4-F06/F07.

Cow V4 remains private local development; no published Cow V4 data or public compatibility with intermediate branch snapshots is claimed. M4-F05 will freeze/verify final Cow economic fields, receipts, recovery provenance and upgrade source rules before release.
