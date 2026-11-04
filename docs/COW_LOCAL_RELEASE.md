# Cow Farm V1.1 — local release candidate

**Local-ready: 60/64. Not pushed or deployed.** Source is original Library `libfile_af2b8f2e0db881918dcdc1e510040b4f` (full V1.1 read directly; this report/checklist is derived project documentation, not a materialized attachment). Branch `cow-farm-v1`; application-code checkpoint `67a059b4a1ec77425b367143dec27dee7933b8e8`. Final Git HEAD can include later test/report-only commits. Canonical committed `dist` tree: `59b3e3d2344b6dc57026f899809a6d825e59b9ac`.

## Implemented

- One farm/world, clock, seeded weather, wallet and Market with crops, Chicken, Goat and Cow areas. Original isometric SVG cows/barn/equipment, independent camera rotation/zoom/pan/reset, desktop/touch controls, keyboard/focus and EN/ID.
- One-time two adult post-calving mid-lactation cows; separately accounted4L opening milk and restricted32kg/180L starter ration. Paid normal feed/shared-water transfers, bounded troughs, gradual nutrition/hydration/comfort/condition and free basic cleaning; no death/offline punishment.
- Individual reservoir production, strict two/day and8-hour milking spacing, hygiene/grade, fresh/aging lots, exact integer mL and fractional Coin carry. Selected/FIFO partial Co-op deliveries, three one-time contracts and separate bonuses, rejected milk disposal, no duplicated purchase/sale/grant across stale/replayed actions/tabs.
- Paid trough/shade/cooler/sanitation/expansion, genuine cooling energy and credit persistence, exactly one optional third adult after capacity plus24kg/135L owned-supply checks; no fourth cow, free milk/rations, live-cow resale or breeding.
- Causal first-sale guide, four cosmetic goals, optional read-only Engineering Lab and repeatable restricted zero-wallet Co-op care jobs. Private balance `cow.v1.1-b2` uses16ordinary job hours and minimum24hours between completions; measured normal paid care meaningfully outperforms a generous controlled recovery comparator. Milking spacing remains8hours.
- Additive V0/V1/V2/V3→V4 migration, exact original-era archives, strict save/source/ledger validation and safe export/import/backup/reset/recovery. Previous farm values, IDs, progress and source bytes are preserved.

## Verified locally

| Gate | Evidence |
|---|---|
| Unit/type/build/lint/audit | 262unit tests;819 locale keys; zero runtime dependencies/debug imports;93 exact source/built files |
| Cow journeys | 17 suites/84 EN/ID desktop/touch profiles, including native-clock zero-wallet first sale and save/reload |
| Visual/accessibility | 28 advanced three-cow profiles, Chromium153/Firefox155,320–1440px and landscape; actual pixels reviewed |
| Performance | 16 four-area normal/low profiles;59.6–60FPS, worst cold interaction5578ms under4×CPU/150ms/1.6Mbps emulation; one interval and96 Cow history samples |
| Payload | Final488866B raw/179328B summed per-file gzip; matrix peak save160868B at90days; stress browser save125408B after30more days |
| Economy/endurance | 47 Cow cases plus exact repeated serialization at7/30/60/90days;35-day old/fresh four-area deterministic endurance;32 standalone/mixed legacy balance cases |
| Data/security | Malicious/unknown/prototype/future/corrupt data, storage quota/disabled/lock failures, exact downloads and confirmed/cancelled restore/import/reset;40 command races+8 third-purchase races, retuned completion rechecked4profiles; no external game requests |
| Old areas/site | Full crop E2E, complete eight-suite Chicken runner, eight mixed journeys plus15 Goat suites (including16 races),24 homepage profiles,two warm-cache cases,nine SEO routes/15layouts,GA4 and protected original assets |
| Final compatibility | 12 original EN/ID contrast/touch/layout profiles plus Firefox crop slice, keyboard/reduced motion; no issues |

All reports/screenshots are outside Git at `C:\Users\andi_\Documents\Codex\2026-11-03\task-2\qa\cow`. Key folders are M5-F08-matrix, M6-F01, M6-F03-*, M6-F04-verified, M6-F05-final, M6-F06, M6-F07-*, M7-F01* and M7-F02. M7-F02 contains exact advanced/active-job saves and rollback report; final committed-dist archive/manifest is generated there after the final local checkpoint. Existing EOL checkout conversion can differ from canonical Git bytes; future production integrity must compare exact committed blobs. Protected homepage/editorial/dependency/deploy/security files and legacy fixture hashes are unchanged from released baseline.

## Rollback and preservation

The actual released V3 schema/storage readers refuse real advanced V4 (three cows, partial delivery, five prepaid cooling ticks) and an active-job V4 even with a valid V3 backup. Load and attempted older-client save leave primary, backup and archive bytes untouched. The current reader resumes both exact snapshots. Tests operate on isolated stores only.

Baseline production source is `dd8184e1beb95685ded536dcef022eb4e7306f6f`, Cloudflare project `myfarmtwin-com`, last audited immutable deployment `1b28946e-6835-457e-a104-db217d9218d9`. No production action is performed here. If a later authorized release needs rollback, preserve/export V4 first and prefer a forward reader repair. An older client cannot play Cow data; it must refuse it, never downgrade, clear storage, automatically fall back to an older backup or merge grants. Any deliberately restored older snapshot replaces the whole farm after confirmation and retained backup. Prior pre-Chicken/pre-Goat/pre-Cow archives remain independent.

Display histories are bounded while authoritative economic counters/ledger are retained and validated. Payload/runtime results describe the measured scenarios, not forever-constant storage or a guarantee on every device. Physical mobile, Safari and assistive-technology user trials were unavailable. All farm values/grades/lactation scenarios are fictional gameplay; visible EN/ID caveats explain finite real lactation and no direct raw-milk consumption/real husbandry advice.

## Pending publication authorization

M7-F03 push/deploy, F04 exact-production/live smoke, F05 accurate Cow availability on the existing homepage card only after verified live, and F06 final production report remain unchecked. They require separate explicit authorization for this Cow release. No implementation blocker remains. Do not claim64/64 or Cow live. Current homepage continues advertising only the previously verified live crops/chickens/goats. No GitHub Actions, new access/security settings or nameserver changes were used.
