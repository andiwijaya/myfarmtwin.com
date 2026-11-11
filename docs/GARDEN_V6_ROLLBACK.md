# Garden V6 rollback with 24 active beds

The corrected garden release provides 24 functional beds immediately. Schema
remains V6. The old public V5 release cannot resume V6 saves; the first garden
publication and its first fallback still started with three beds. Use the
matching active-bed fallback below if rollback is required.

Prepared branch: codex/garden-final-v6-rollback.
Prepared commit: 63fe192972f86f4317969c91bf8d572e9569d6c6.
Parent / corrected primary release: d4025da144ead1754119ae6e5a1839983838ebfd.
Fallback dist tree: d6b1b56608aa481d3aba7322fabc5fcf01540632.
Raw receipt SHA256:
d5c4ce1dbe1e9c21f22e8701896fa19f3610f6d288b106ee8b4ecca1110340a4.

The fallback rebuilds the earlier visual source 7503ca9 and includes the current
active-garden, engine, storage, main, game-session, locales and index modules. All 149 compared
native modules match the primary candidate after EOL normalization. The old
tracked V5 dist was not reused. Full enhanced animation/performance claims belong
to the primary release. The same deferred HTML entry fixes the streamed-page startup race; visible EN/ID guidance says 24 beds.

Verified Cloudflare preview: e4d33b2c-9889-467d-9550-1cbabeee133f, successful
2026-11-11T14:20:55.339466Z. [Immutable rollback preview](https://e4d33b2c.myfarmtwin-com.pages.dev).
The GitHub Cloudflare check completed successfully for this exact source and
deployment. All 245 served resources match canonical Git bytes (246 packaged
files, excluding the provider _headers control file).

Direct local rehearsal passes six entry profiles (fresh, V5 and published V6,
desktop EN/phone ID), 24 immediate beds, last-bed plant/water and exact reload.
Another two profiles perform 192 harvest/sell/buy/replant commands across all 24
corn beds, preserving the other four zones, clock, RNG and ledger. The identical
current native persistence code passes the primary 21-profile browser save-safety
matrix and all 555 native tests. Direct preview entry verification is recorded
under rollback-final-publication/entry. Downloads remain skipped.

## Activation if needed

The preview has not been activated on production. Preview deployments are not
Cloudflare production rollback targets. The prepared commit is a direct child
of the corrected primary release, allowing a normal fast-forward publication
of its already verified artifact while preserving V6 player data.

1. Recheck remote main, current provider state and the incident. The prepared
   fast-forward is valid only while main is exactly d4025da144ead1754119ae6e5a1839983838ebfd.
2. If that condition holds and rollback is needed, ordinary non-force push:
   git push origin 63fe192972f86f4317969c91bf8d572e9569d6c6:refs/heads/main
3. Observe the new production deployment and GitHub check for 63fe192972f8.
   Verify public/www/immutable receipts against the fallback SHA above, canonical
   resource integrity and native gameplay/save retention.
4. If main has advanced, prepare a new forward fallback from its actual head,
   retaining later schema/data changes and rehearsing again. Never force-push,
   downgrade saves, reset player data or restore Classic2D.

Evidence is ignored under qa-artifacts/garden: rollback-final-build.json,
rollback-final-entry/, rollback-final-loop/, rollback-final-publication/.
Task-owned browsers/servers close in their finalizers. No personal profile,
physical Android or download verification is claimed.
