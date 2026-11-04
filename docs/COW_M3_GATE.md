# Cow Farm V1.1 — critical vertical slice

Authoritative source: Library `libfile_af2b8f2e0db881918dcdc1e510040b4f`, original V1.1. Derived local project evidence; no Library materialization is claimed.

M3 core gameplay passes locally. The eight automated fresh/actual-Goat-era × desktop/touch × EN/ID scenarios start with0 Coins and an empty shared tank, run the real standard1x clock (one ordinary shared hour per3000ms), then feed, water, clean the stand, inspect Cow A, milk, deliver and view the upgrade goal. No synthetic clock override, Cow-only fast-forward or disabled decay was used. Network loading is excluded.

Measured automation:5723–5891ms from interactive Barn,2 ordinary ticks,4289mL sold,17Coins plus156/1000 carried, one receipt, zero welcome bonus. Each scenario reached mission8 and displayed90Coin price,100→150L capacity benefit and73Coin shortfall. The purchase was not required. These timings describe the automated fixtures, not a promise about human completion speed. Pausing/reload preserved the exact saved farm.

Other M3 evidence:

-227 full units at first-upgrade checkpoint,230 after bounded recovery/disposal.
-16 combinations of fresh/actual crop/Chicken/Goat saves, existing/zero wallet and full/empty tank preserve all previous farm assets on starter entry.
- Four-profile real UI checks cover each mission, care, station, ordinary delivery,1500mL partial/FIFO contract, one separate8Coin bonus, upgrade and restricted recovery.
- Valid subCoin sales retain their full fractional revenue; combined/split sales agree. Stale/replayed/forged/getter/duplicate inputs make zero changes.
- Five ordinary paid-care days from a zero-wallet opening sale afford the trough through actual feed purchases, shared-water refills and dairy sales without contracts/rewards.
- Two independent recovery episodes require genuine shortages, source-aware restricted supplies,8 ordinary hours of work, at least24 hours between completions and repeated eligibility checks. Deliberate stock/milk disposal in the second shortage fixture is explicit; sustainable paid-versus-recovery economics remain M5.

Existing-loop gate passed: full `tools/e2e.mjs` (crop tutorial/expansion/orders/followups, both surfaces, data/recovery/offline/clock/conflicts and homepage+9 routes), complete `tools/chicken-e2e.mjs` release runner (including progression, cameras, navigation, save/data and8 races/four storage failure modes), and8 fresh/existing EN/ID desktop/touch `tools/goat-full-e2e.mjs` profiles.

Evidence is outside Git under workspace `qa/cow/M3-F09*` and per-feature folders. The source/client build, screenshots and localization were reviewed. M4 save/economic validation, advanced M5 progression, M6 quality/performance and M7 release gates remain. **No Cow push/deploy is authorized.**
