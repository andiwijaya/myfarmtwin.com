# Goat Ranch V1 — acceptance contract and local test plan

Authoritative requirements: original Library item `libfile_fc76c0db920481918dad59d081068072`. The project checklist records its identity and all 60 acceptance items. This document is an implementation plan, not a downloaded source copy.

## Safe baseline

Branch `goat-ranch-v1` starts at `1e140428eba6743817e808676c689ce4ff7fffcf`, the verified homepage production release. Chicken is fully implemented and enabled. No pending Chicken changes exist. Keep all existing branches and user data. Existing homepage has one game card, `desktop-promo-v3`, `/play/` entry and EN/ID copy. No homepage work is required for this expansion unless needed for truthful live content after a separately authorized release.

Engine state is V2. `dispatch` validates a command revision, clones input, applies commands, then checks invariants. Rejections retain the identical original object. Transactions use the same integer Coins and ledger. `hour` is one game hour; Next Day invokes 24 hours. Seeded weather/RNG, crop/Chicken simulation and shared water remain the single world. Goat rendering/animation must never advance the clock or mutate gameplay.

## Integration contract

- M1 is a presentation gate: area switching and a stable read-only scene can be verified before husbandry is wired. Scene-only starter animals are not a persisted grant; no save schema is changed by rendering. Context actions explain unavailability until their actual model exists. M2 provides tested headless state/commands. M3 binds the first-entry grant and full first-sale loop. Never claim a staged UI is the completed game.
- First real Goat entry atomically grants one adult and two weaned goats with `goat.starter.*` IDs, shelter and bounded supplies once. Reading/migration/language/view rendering never grants animals. No second clock or wall-clock hunger.
- Commands use existing revision ordering, strict key/ID validation and the browser save-write lock. Same Market, Coins, water tank, calendar and ledger. Sales atomically remove a qualifying live goat, credit one quote and leave at least two. Double-click, stale tab and replay cannot duplicate value.
- Inputs and histories are finite, bounded and uniquely identified. Hay store+feeder+consumed amounts balance; trough inflow equals shared tank outflow; purchased supply quantities match integer-cost transactions. Browse regeneration is bounded and driven by shared weather.
- Care changes recent food/water adequacy and condition gradually. Good care grows juveniles over 12–20 game days; label this compressed educational model. No death, milk, breeding or biological/medical advice.
- M4 migrates actual V2 to V3, retaining all unaffected subtrees semantically. Existing V0/V1 migration remains supported. Keep original pre-Chicken archive and a separate pre-Goat archive. Future saves must be blocked before backup recovery, and older readers must not overwrite V3. Never inspect or reset a user's real browser save for QA.
- Reuse DOM/SVG, isometric geometry and per-area camera pan/rotate/zoom/reset. Preserve cropping/picking and camera preferences in other areas. Visible controls >=44 CSS px; keyboard/focus, EN/ID, reduced motion, low graphics, portrait/landscape and clear unavailable-action reasons.
- Build copies only `game/client` into `dist/play`; never empties `dist`. Editorial, homepage, SEO, analytics and Cloudflare configuration are protected. No new dependency is planned. QA files remain outside Git; small synthetic migration fixtures are test inputs, not user data.

## Tests and gates

Baseline: existing lint/typecheck/96 unit tests/build/full e2e/homepage/compatibility/security. Record pre-existing issues separately. Exact rollback-reader fixtures are LF-pinned only for those paths; hashes remain those of original Git blobs. Navigation E2E uses the real `/play/` link with a nonempty accessible label rather than the obsolete pre-promo link name.

For each feature: focused behavior tests, applicable crop/Chicken/save regression, checklist evidence and a local checkpoint before starting the next feature. No tests that merely restate constants. Headless model tests must compare seeded scenarios, resource conservation, 24 ticks vs Next Day, rejection immutability, wallet/ledger identities and growth differences under care. Browser tests must exercise real buttons/commands, not inject finished mission/Coins state.

M3: desktop/touch EN/ID first entry → feed → water → clean → inspect ready adult → quote/contract → live sale → payment/next goal, <=180s automated; crop/Chicken regression green.

M4: V0/V1 and synthetic V2 fixtures, unaffected-subtree equality, exact reload/import/export, backup/quarantine/quota, future/malicious saves, two tabs/replay and 30-day mixed-farm roundtrips. Preserve rollback-reader byte provenance.

M5/M6: causal two-paddock rotation, meaningful upgrades, follow-up rewards once, optional Why/Lab from actual state; 7/30/60/90-day paid mixed-farm balance. Desktop/mobile EN/ID at 320/360/390/768/1024/1440 and landscape; Firefox if available; keyboard/reduced motion/low graphics, security, long-session/memory/performance. Re-run original game and homepage/SEO gates.

M7 local preparation is permitted. Push/deploy/live Goat verification is explicitly unauthorized until the user approves this release, so those checklist items cannot be checked now. No GitHub Actions or configuration/security changes. Final local report must name exact source commit, test evidence, pending publication gates and remaining issues.

## Recovery

Original production/source remains `1e14042`; no remote mutation is permitted. Local checkpoints are reversible commits. V2 fresh/mixed fixtures are synthetic, captured before schema changes with SHA256 manifests. Capture exact V2 reader/config/storage source for a future-reader rollback test before implementing V3. Backups and migration archives use separate keys and preserve existing bytes before any primary write. A quota/archive collision returns a read-only preview, never an overwrite. Low/unavailable storage permits memory play/export with a clear warning. No automatic destructive reset.
