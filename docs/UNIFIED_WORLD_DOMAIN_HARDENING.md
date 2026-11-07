# M7-F01 — frozen domain and save contract

`node tools/unified-domain-audit.mjs` passed against the immutable pre-presentation checkpoint `0061b73b89eb5c13dc770ecd56c730fd38f73649`. Of its 129 original client files, 126 retain their original Git blobs (raw bytes or the existing checkout line-ending filter). The only allowed integration files are `main.js`, `index.html` and `style.css`; every original engine, economy/config, RNG/weather, domain command/runtime, mission, market, save validation, schema, lock and storage module is unchanged. Original renderers remain available for rollback.

The audit compares actual working files, not merely index entries, and fails on a changed frozen file. Windows mixed CRLF files required checking the raw hash as well as Git's normalized hash; the initial false alarm was diagnosed against byte-identical baseline content, without editing source or weakening the content check.

`qa-artifacts/unified-m7-domain/domain-audit.json` records the full 126-file identities, schema fingerprint, unchanged `myfarmtwin.save.v1` key and version 5, the one original simulation interval, and seven frozen V0–V5 fixture migration/round-trip results. Fixture input and expected-output bytes are checked against their original manifest. No save schema change, migration reset or second save namespace was introduced.

Current integration also passed all 480 unit tests and the M6 all-five-context native tutorial/reload oracle. Later M7 runtime replay, invalid preference, recovery and concurrency checks remain separately tracked; this source audit does not claim to replace those tests. No push/deploy.
