# Vegetable Farm Expansion and 3D Enhancement

Owner specification: pasted document of 11 November 2026, accepted for autonomous
implementation, testing and deployment in the current chat. Work stops at
**17:00 WIB (10:00 UTC) on 11 November 2026**, with a resumable checkpoint.
This replaces the earlier eight-bed/four-stage proposal. Functionality first.

Starting checkout: `C:\MyFarmTwin`, `cozy-world-v1`, `bda6fd1`.
Remote: `https://github.com/andiwijaya/myfarmtwin.com.git`; production `main`
verified read-only as `f2836be675bcde489617c8e354d01390be594546` at start.
Cloudflare Pages project remains `myfarmtwin-com`, output `dist`.

## Acceptance checklist

- [x] Audit initial layout, crop engine, strict saves, rendering and QA entry points.
      Three initial beds; eight maximum paid beds; two crop types; schema V5.
- [x] 1. Expand capacity to 24 paid functional beds, with proportional rows and paths.
- [x] 2. Preserve roads, market, other zones and collision-free placement.
- [x] 3. Verify every bed can be selected and used on desktop and touch emulation.
- [ ] 4. Add corn seeds, inventory, prices, harvest and sale end to end.
- [ ] 5. Implement five corn growth stages with mature height about 2–3 world units.
- [ ] 6. Verify the full plant/care/grow/harvest/sell/replant loop.
- [ ] 7. Improve real 3D lettuce/tomato/corn geometry and deterministic variation.
- [ ] 8. Reusable simulation-driven growth and gentle wind/harvest animation.
- [ ] 9. Honor pause, reduced motion, low graphics and hidden-tab behavior.
- [ ] 10. Keep tall plants selectable without blocking adjacent care controls.
- [ ] 11. Retain irrigation, water, economy, upgrades and original progression.
- [ ] 12. Strict old-save migration with original-byte retention and quota safety.
- [ ] 13. Unit/integration tests for placement, growth, actions and economy.
- [ ] 14. Save/load, import/export, backup, recovery and stale-tab tests.
- [ ] 15. Automated real-3D stage, animation, collision and picking harness.
- [ ] 16. Camera/keyboard/mouse/touch and EN/ID responsive checks.
- [ ] 17. Regress crop/chicken/goat/cow/fish native gameplay.
- [ ] 18. Measure dense-garden loading/rendering; disclose emulation limits.
- [ ] 19. Production build, dependency/security checks and editorial preservation.
- [ ] 20. Capture actual before/after screenshots; update game homepage capture.
- [ ] 21. Deploy only after applicable acceptance and regression gates pass.
- [ ] 22. Verify live artifact, console/assets and gameplay; report deployment.

Check an item only after passing its relevant tests. Partial implementations and
failed attempts remain explicitly pending. No personal browser/profile/save access.
No physical Android FPS claim from desktop emulation. Original save bytes are
archived before migration; no reset or silent replacement is allowed.

## Evidence and progress

Initial sandbox baseline encountered `EACCES` on localhost test connections.
Unrestricted baseline retry passed 536/536. F1 native suite passed 541/541;
the final garden camera/registry follow-up passed 11/11 after recentering the
garden bookmark. Typecheck and source-pattern security audit passed.
F1 browser acceptance passed all four desktop/phone × EN/ID profiles, 396
native UI actions, 384 actual 3D bed picks across four headings, exact whole
state/ledger checks and four exact reloads. Evidence: `layout/layout.json`,
`layout-final.log`, 16 actual PNGs, `f1-full-tests.log`, `f1-camera.log` under
`qa-artifacts/garden/`. Failed harness attempts are retained separately.
Implementation, checks and evidence are recorded in `GARDEN_UPGRADE_PROGRESS.md`
and ignored `qa-artifacts/garden/`.
