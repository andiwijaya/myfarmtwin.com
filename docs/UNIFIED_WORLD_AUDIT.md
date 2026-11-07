# Unified world M0 audit

7 November 2026. This is a local implementation checkpoint, not a release.
Authoritative input: Library `libfile_457bd65eff208191ad529af638e759bb`,
`MYFARMTWIN_UNIFIED_3D_WORLD_GRAPHICS_MASTER_PRD_V1.md`, 52,727 bytes, all 490
lines read in windows 1–170, 171–340 and 341–490. The living repository copy is
`PRD_MYFARMTWIN_UNIFIED_3D_WORLD_V1.md`; the Library source was not replaced.

## Reconciled state

- Clean initial branch `fish-pond-v1`, HEAD `0061b73b89eb5c13dc770ecd56c730fd38f73649`.
- One local worktree. Created isolated branch `unified-world-v1` at that HEAD.
  Non-destructive local M0 checkpoint: `11328e6` (no push).
- Local main and cached origin/main: `fffc13516c1e8e19c5131d9c26b808eb51f6ed20`.
  Fresh read-only `git ls-remote` confirms that exact current remote main SHA.
- Public `/play/` observed in a new isolated browser context: HTTP 200, all five
  area buttons, save V5, no page errors. HTML and all 127 loaded JS/CSS resources
  match committed local source. This is runtime/resource proof, not a fresh
  Cloudflare deployment dashboard receipt. Historical release is documented in
  `FISH_PRODUCTION_RELEASE.json`; reverify hosting binding at actual release.
- Fish handoff says complete/live, QA processes stopped and Android cache issue
  resolved. Recent room history confirms this new autonomous task; earlier
  release consent concerned MyZooTwin Giraffe and is not reused here. No other
  worktree or concurrent MyFarmTwin edit was observed. Recheck before release.
- No `AGENTS.md`, `.agents` or `.codex` instruction directory found within this
  repo; README, package scripts and relevant Fish handoff/release docs read.
- Current `CURRENT_SAVE_VERSION=5`, storage key `myfarmtwin.save.v1`, original
  backup/quarantine and pre-V2/V3/V4/V5 archives retained. No domain files changed.

## Baseline and an existing checkout defect

Initial run before implementation: lint PASS, typecheck PASS, build PASS;
unit 367/368 PASS, 1 FAIL. `fish-baseline.test.mjs` found the V4 fresh/mixed fixture
bytes changed by Windows checkout CRLF conversion. Both committed Git blobs
exactly match their original manifest. Added the missing Fish fixture `-text`
attribute and restored only those two working files from their unchanged Git
blobs. No fixture hash or test expectation was weakened. Targeted integrity test
PASS, then full unit 369/369 PASS including the new baseline comparison test.

Initial browser processes were sandbox-blocked on localhost with
`ERR_NETWORK_ACCESS_DENIED`, before gameplay assertions. The authorized retry
uses the same headless Chrome executable and temporary Playwright profiles,
with permitted local networking. E2E main, Chicken aggregate and Goat full
journeys PASS. Cow aggregate PASS (17 sub-suites), all-five Fish journeys PASS
(8 fresh/existing × desktop/mobile × EN/ID profiles, including all five sales,
shared wallet/ledger, IDs and exact reload). No gameplay/domain code changed
during baseline. A detached model/camera substrate was prepared and unit-tested
while long baseline suites ran; it was not loaded by the baseline build.

Evidence is ignored, never production content:

- `qa-artifacts/unified-m0/baseline-results.json`: original attempts and logs.
- `qa-artifacts/unified-m0/authorized-network/baseline-results.json`: authorized
  isolated browser rerun and individual logs/receipts.
- `qa-artifacts/unified-m0/unit-after-fixture-fix.log`: full 369-test pass.
- `qa-artifacts/unified-m0/visuals/baseline-visuals.json`: 20 screenshot profiles,
  complete asset hashes/sizes, and four browser trace archives.
- `qa-artifacts/unified-m0/reference-world/reference-audit.json`: current public
  source/resource comparison and actual MyZooTwin canvas reference capture.

## Visual baseline

20 profiles cover 1440×1000 desktop and 390×844 touch emulation, EN/ID, every
existing zone, using the same earned synthetic five-area farm. Every profile
has no overflow, an accessible object shortcut and exact saved bytes across
visited-area/object navigation. No page errors. Representative actual PNGs
inspected for Crop, Chicken, Goat, Cow and Fish in both language/device groups.
Four traces contain screenshots, DOM snapshots and action timelines.

Observed limitations to improve: five disconnected terrain islands/screens,
per-zone fit and scale, flat animals always facing a similar direction, dense
vertical mobile HUD above the map, very small Fish world framing, and a focused
skip link visible in baseline captures. These are observations, not newly fixed
items. Existing care/status feedback and object shortcut access are useful
contracts to retain. Source and asset architecture is detailed in
`UNIFIED_WORLD_ARCHITECTURE.md` and `UNIFIED_WORLD_ASSET_PROVENANCE.md`.

The 3D reference capture is MyZooTwin's empty new-player world, one actual canvas
opened via Explore in a disposable context. It grounds continuous terrain,
coherent depth, lighting and compact scene controls; no mature owner zoo or
borrowed save was used. It is inspiration, not acceptance of MyFarmTwin graphics.

## Frozen saves and comparison

`game/tests/fixtures/unified-world/manifest.json` freezes seven sanitized fixtures:
V0 fresh; V1, V2, V3 and V4 mixed; V5 fresh and an earned V5 five-area farm.
Each has exact input SHA/size and a complete expected V5 serialized projection,
including every crop/animal/fish field, RNG/weather, coins, inventory, ledger,
missions and history. V5 mixed has tick 1224, revision 2058, 2219 coins and 613
ledger entries. No personal browser data was copied.

`node tools/unified-save-baseline.mjs` and
`node --test game/tests/unified-baseline.test.mjs` verify all original bytes and
complete migrated semantic outputs. `--freeze` is an explicit maintainer-only
regeneration step; routine tests never rewrite expectations. The frozen source
commit and original older-version fixtures remain recorded.

## Measurement limits and release hold

Hardware: Intel Core i7-1255U, 23.7 GiB memory; headless Chrome 156.0.8078.80.
Raw baseline game content is 629,571 bytes across 129 files; summed per-file gzip
equivalent is 229,293 bytes. Gzip equivalent is not actual wire transfer.
Performance measured separately after the other browser suites: 20/20 legacy
profiles PASS, no failures/page errors/external requests, one original interval
before and after 50 area switches per profile. Each RAF-cadence sample is 6.4s,
includes at least two ordinary shared ticks and repeated object selections.
This is browser frame cadence, not a claim of Three renderer submissions.

| Available lab profile | FPS range | Cold first interaction | Largest switch p95 | Largest sampled heap growth |
|---|---|---|---|---|
| Desktop, ten zone/quality profiles | 59.1–59.7 | 489–562ms | 150ms | 1.85 MiB |
| 390px touch + 4× CPU + 150ms / 1.6Mbps, ten profiles | 42.7–55.0 | 7089–7785ms | 500ms | 1.85 MiB |

The old runner permits 20s cold start. The new PRD target is ≤5s: emulated legacy
cold load already exceeds that new target. Do not treat the old-runner PASS as a
new-world loading gate pass. Optimize and remeasure at M1/M7. Short samples do
not establish a 15–30-minute soak or a physical-device frame rate.

The paired native max-farm 90-day endurance replay is exact over 2160 logical
hours; peak serialized save 323,745 bytes, IDs and daily roundtrips exact.
Full receipts: `qa-artifacts/unified-m0/performance/report.json` and original
`performance-run.log`. Baseline runtime build hash is
`9877fd05d7441f7b2d881ca5880f5973334d1b508f6e07785b8d93af5251dbb6`.

Additional CDP CPU profiles use ten Chicken camera rotations and a 5s idle
window: desktop 162.8ms main-thread TaskDuration over 5894ms; 4× CPU emulation
814.4ms over 6214ms. Paused saved bytes remain exact. Actual `.cpuprofile` files
and heap/sample summaries are in `qa-artifacts/unified-m0/cpu/`. TaskDuration
is main-thread task time, not total machine CPU percentage.

Touch viewport/CPU/network emulation does not establish physical Android FPS,
GPU memory, thermal behavior, actual touch or Safari compatibility. Those remain
explicit release risks. Do not invent hardware measurements. M1 renderer choice
and M7 resource/soak gates must name their actual method and sampled window.

M0 audit gate complete for the available local lab, with the physical-device
limits above explicitly retained for release. No gameplay behavior was changed
in the baseline build. M1 substrate work stayed unmounted during these tests.

No push/deploy. Preview remains hidden until the two-zone proof, all-five parity
and release gates pass. Preserve the existing renderer, original assets and V5
readers for a save-preserving rollback. Do not expand to five-zone geometry
before M1-F08 passes or start expensive polish before M3-F10 passes.
