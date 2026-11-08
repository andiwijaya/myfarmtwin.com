# M8-F03 - 30/60/90 game-day native economic replay

`tools/unified-endurance.mjs` passes 2,480 attempted original commands over 90 elapsed game days: 2,322 accepted and 158 legitimately rejected. Care, inventory sales, crops, eggs, milk and fish flows are compared after every attempt to the original Git baseline `0061b73b89eb5c13dc770ecd56c730fd38f73649`, loaded as a separately materialized, byte-verified module graph inside ignored QA. No reference source is modified; no economy formulas or RNG are reimplemented.

| Elapsed days | Tick | Revision | Coins | Ledger entries | Entities |
|---|---:|---:|---:|---:|---:|
| 30 | 1944 | 2855 | 1892 | 963 | 39 |
| 60 | 2664 | 3618 | 1868 | 1288 | 39 |
| 90 | 3384 | 4380 | 2117 | 1608 | 39 |

Complete serialized weather/RNG, save, inventories, mission state and every event/error match the old engine. Read-only world snapshots/status derivation preserve serialization and unique stable IDs at every attempt. All five visited/progress states survive.

Six actual browser checkpoints load days 30/60/90 in desktop WebGL and touch-emulated Canvas, visit all five areas and four headings, retain exact full saves and one original clock/canvas, with zero uncaught errors. Actual screenshots, snapshots and report: `qa-artifacts/unified-m8-endurance/endurance.json` and neighboring files. This accelerates explicit native `nextDay` commands; it is not 90 wall-clock days or physical-device endurance. Real 15-minute soaks are reported separately. No push/deploy.
