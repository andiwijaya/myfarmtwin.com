# MYFARMTWIN.COM — UNIFIED 3D FARM WORLD & GRAPHICS QUALITY UPGRADE
## Master PRD V1.0 | Satu Peta Farm + 3D Sprite Animation + Unified Game UX

**Tanggal penyusunan:** 7 November 2026

**Status:** READY FOR DOT HANDOFF — PRD, bukan hasil implementasi / deployment

**Website:** https://myfarmtwin.com/

**Game:** https://myfarmtwin.com/play/

**Repository yang diperiksa:** `andiwijaya/myfarmtwin.com`, `main`

**Referensi produk/teknologi:** `andiwijaya/myzootwin.com` (look-and-feel permainan dan teknik Three.js, **bukan** instruksi menyalin repo mentah)

**Target path living PRD di repo:** `docs/PRD_MYFARMTWIN_UNIFIED_3D_WORLD_V1.md`

**Owner:** Product Owner MyFarmTwin

**Delivery:** Dot (orchestrator) + Codex (engineering)

**Kebijakan produk:** **Engineering is the engine. Gaming is the experience.**

**Kebijakan engineering:** **Functionality first — one tested, end-to-end micro-feature at a time.**

> **PERINTAH UNTUK DOT — 100% AUTONOMOUS.** Audit keadaan sebenarnya, lakukan desain teknis, implementasi, local build/test, debugging, unit/integration/E2E, white-box/black-box/dead-code, internal-browser desktop/mobile verification, asset audit, regression, dan production verification secara mandiri. Jangan meminta Product Owner untuk melakukan uji manual atau approve tiap fitur. Selesaikan satu micro-feature sampai bekerja dan terbukti, baru lanjut. Kirim update singkat setelah tiap micro-feature: `scope → tests/evidence → issues/fix → N/82 (%) → next`. Escalate hanya genuine blockers: credentials/2FA, hak/lisensi, otorisasi hosting, atau konflik produk yang tidak bisa diselesaikan aman. Patuhi larangan push/deploy khusus yang mungkin sedang berlaku pada sesi/tugas lain; jangan menimpa aktivitas Dot lain. Setelah semua release gate terpenuhi dan otorisasi rilis yang berlaku terkonfirmasi, deploy dengan pipeline existing dan lakukan live testing tanpa meminta pengujian manual rutin.
>
> **PRESERVE EVERYTHING IMPORTANT.** Ini **presentation/UX architecture upgrade**, bukan redesign formula engineering. Coins, growth, care, Market, inventories, all five areas, ledger, mission rewards, seeded weather/RNG, fixed time tick, upgrades, browser-local saves, original media, website articles, SEO, GA4, dan homepage **harus tetap aman**. Jangan reset progres pemain, jangan membuat game kedua, dan jangan mengubah model ekonomi untuk mengatasi masalah renderer.

---

## 0. Verified code baseline — facts and caveats

Audit repository GitHub terkoneksi pada **7 November 2026**:

1. MyFarmTwin **sudah punya lima subsystem**: `field/crops`, `chicken`, `goat`, `cow`, `fish`. `game/client/engine.js` menggabungkan command/tick tiap subsystem dalam satu reducer; `game/client/main.js` masih mengatur `activeArea='field'` dan tombol `area-field`, `area-chicken`, `area-goat`, `area-cow`, `area-fish` untuk memilih **renderer terpisah**.
2. `game/client/world.js` membuat dunia field menggunakan **SVG isometric projection**. Ada file view khusus untuk chicken/goat/cow/fish (`chicken-view.js`, `goat-view.js`, `cow-view.js`, `fish-view.js`). Jadi grafis existing **bukan native real-time 3D WebGL**, walaupun punya kesan 3D/isometric.
3. `game/client/camera.js` menyimpan **lima camera presentation states** (`field/chicken/goat/cow/fish`) dengan pan, 4-step rotation, zoom dan reset terpisah. Penggabungan harus mengubah sistem kamera menjadi **satu world camera**; jangan menerapkan lima camera independen di satu kanvas.
4. `CURRENT_SAVE_VERSION=5` pada `game/client/config.js` saat diperiksa. `save-schema.js` mengandung migrasi data lama ke V5 dan `storage.js` mempunyai backup/pre-migration archive serta stale-tab safety. **Versi aktual harus dicek ulang di awal eksekusi**, jangan hardcode V5 menjadi “versi selamanya”.
5. Build `npm run build` hanya menyiapkan game ke `dist/play/`; published site memakai `dist`, Cloudflare Pages menurut README. Local QA memiliki `npm run lint`, `typecheck`, `test`, `build`, `e2e`, `homepage`, `chicken`, `compat`, `balance`, `endurance`, `performance`, `seo`, `security`, `integrity` dan test baru sesuai repo. Jangan menghapus output `dist` atau editorial website.
6. `game/client/features.js` menandai chicken/cow/fish aktif; Goat terintegrasi dalam game. Homepage terbaru menampilkan crop, chicken, goat, cow dan fish dalam **satu kartu** `/play/`. Tidak boleh menambah lima kartu/route baru.
7. MyZooTwin `package.json` memakai **Three.js 0.187.0 + Astro**; README menyebut world tropical sanctuary playable. **Pelajaran yang boleh diadopsi**: continuous world, camera, interaksi habitat, visual hidup, optimasi. **Jangan** menyalin keseluruhan Astro stack/scene/assets ke MyFarmTwin tanpa audit kompatibilitas, provenance, dan performance.
8. Status PRD/release file historis bisa tertinggal dari kode live. Pada pemeriksaan, README dan beberapa PRD catatan masih mempunyai snapshot milestone lebih lama daripada yang ditunjukkan code. Dot **wajib rekonsiliasi** main/local/remote/production/current tasks sebelum memulai, dan tidak boleh mengklaim production state dari checklist lama.

**Kesimpulan teknis:** simulation engine saat ini justru aset yang wajib dipertahankan. Target PRD adalah **mengganti lapisan scene + UI navigation, bukan mengulang lima gameplay modules**.

---

## 1. Vision, success criteria, dan non-goals

### 1.1 Product vision

MyFarmTwin berubah menjadi **one living farm world**: pemain dapat melihat kebun, kandang ayam, goat ranch, cow barn, fish pond, Market, jalan, pohon dan lahan kosong dalam **SATU PETA KONTINU** seperti pengelolaan zoo di MyZooTwin. Kamera bisa pan/rotate/zoom/focus antar lokasi **tanpa mengganti halaman/scene dan tanpa reset state**. Semua hewan terlihat hidup dengan **animated 3D-looking directional sprites / optimized 3D assets**, dan seluruh tindakan yang tersedia sekarang tetap benar-benar berfungsi.

**Gameplay tidak berubah:** Mission → Build/Upgrade → Care → Produce/Grow → Sell → Earn → Expand. Yang berubah adalah presentasi, discoverability, dan kualitas grafis, sehingga pengalaman lebih seru dan mudah dibaca secara visual.

### 1.2 Target akhir yang bisa diuji

- **One map, not five scenes:** lima zone farm terlihat sebagai bagian satu terrain, tersambung jalan, di satu world coordinate system/camera. Pilih `Goat Ranch` via minimap/shortcut hanya **menggerakkan kamera ke lokasi**. Tidak render halaman Goat terpisah lagi.
- **Substantial quality jump:** terrain, bangunan, pagar, vegetasi, pond, shadow/light, prop depth, material/palette, dan sprite animasi terlihat konsisten dan lebih berkualitas daripada flat SVG sekarang. Tidak cukup mengubah warna/menambah dekorasi.
- **Animated life:** chicken, goat, cow, fish, crops/environment punya state-appropriate animation tanpa mengubah engine. Beberapa karakter boleh beraktivitas bersamaan.
- **All gameplay preserved:** klik objek yang benar di titik benar; pakan, air, cleaning, milking, egg collection, fish harvest, crop planting/harvesting, inventory, missions, Market, upgrades dan save tetap jalan.
- **Mobile-first playable:** overview dan focus zona mudah dipakai di Android Chrome/desktop modern, dengan graceful quality fallback.
- **Zero destructive data migration:** pure graphics state tidak perlu mengubah schema engine. Saat renderer berubah, **save lamanya tetap identik secara semantik**. Jika penyimpanan world placement kelak benar-benar perlu, versi schema harus bermigrasi aman; editor bebas tata letak **bukan** scope upgrade ini.

### 1.3 Anti-goals eksplisit

- **Tidak** rewrite gameplay/ledger/missions/physics farm; tidak refactor total website atau migrate seluruh Astro app hanya supaya “mirip MyZooTwin”.
- **Tidak** membuat lima mini-game atau menu yang memindahkan user ke lima scene; tidak ada reload game ketika berpindah area.
- **Tidak** membangun open-world bebas, editor city-builder granular, true fluid simulation, online multiplayer, login/cloud save, AI LLM runtime, atau server ekonomi.
- **Tidak** memberi animasi “acting” palsu yang bertentangan dengan state (ayam tampak bertelur padahal egg state kosong; sapi tampak diperah berkali-kali tanpa milk; aerator menyala saat off).
- **Tidak** mengartikan “3D sprite” sebagai high-poly 3D untuk semua karakter. Sprite adalah **gambar pra-render dengan kesan 3D**, bukan mesh 3D riil. Pertahankan kejelasan: lingkungan boleh memakai real 3D meshes, karakter boleh directional spritesheet untuk efisiensi.
- **Tidak** menduplikasi state saves atau membebankan kamera sebagai transaksi ekonomi.
- **Tidak** menambahkan aset berlisensi tidak jelas, file `node_modules`, build cache, video mentah, screenshot QA atau spritesheet source raksasa ke repo produksi.

---

## 2. Target layout satu peta — “broad, not endlessly long”

### 2.1 World diagram (konseptual, bukan koordinat final)

```text
                              NORTH
          ┌──────────────────────────────────┐
          │  CHICKEN YARD  │  GOAT RANCH      │
          │  coop / hens   │  shelter/browse  │
          │       ╲        │        ╱         │
          │        ╲  PATH TO MARKET          │
          │ CROP FIELD ── MARKET ── COW BARN │
          │ beds / pump     │   cows / dairy   │
          │                 │                   │
          │ ENTRY / POND PATH ─ FISH POND      │
          │     trees + spare future land      │
          └──────────────────────────────────┘
                              SOUTH
```

**Final positions are flexible** as long as the player can see all five visual districts in overview. Prioritaskan **peta melebar seimbang**, bukan garis panjang lurus. Sesuaikan collision/footprint dan level of detail untuk kamera orbit. Sisakan **lahan kosong untuk future farming features** (tidak perlu langsung dibangun). Tidak perlu memaksa semua hewan selalu tampak berukuran besar pada zoom-out.

### 2.2 Single-scene architecture

- `UnifiedWorldScene` memuat **satu terrain dan satu koordinat global**. Ada `ZoneRegistry` untuk tiap area: `zoneId`, bounding box/footprint, `cameraAnchor`, map icon/label, asset group, interaction IDs. ZoneRegistry hanya metadata presentasi.
- `WorldEntityRegistry` menghubungkan **stable existing simulation IDs** ke visible objects; contoh `field.plot.3`, `chicken.coop`, `chicken.hen.<id>`, `goat.<id>`, `cow.<id>`, `fish.pond.<id>`, `market.central`. Jangan mengganti existing IDs/commands.
- `readModelSnapshot(state)` memakai existing state machine; `render(snapshot)` **read-only**. Input world (`tap`) diadaptasi ke **existing validated dispatch**. Bila command ditolak, tampilkan alasan yang sama dengan UI lama.
- Menampilkan zone belum berarti mengklaim starter grant. **Visibility/focus hanya navigasi kamera**. Onboarding `enterYard/enterGoat/enterCow/enterFishPond` existing dipanggil **hanya dari tindakan player yang eksplisit**, dengan exactly-once semantics. Sebelum unlock, tampilkan bangunan/area “available to start” atau plot kosong yang nyata, tanpa hewan fiktif dari save.
- Fixed simulation clock, seeded weather, Coins, inventory, market dan ledger tetap **satu** di global state. Jangan membuat `tick` kedua dari `requestAnimationFrame`.
- **Global camera:** pan/zoom/rotate/reset/fit-world, `focusZone(zoneId)`, dan optional cinematic easing (visual saja). Camera bukan sumber ekonomi/mission.
- Batasi putaran kamera ke **4 sudut utama** bila memakai 4-direction atlases; tilt isometric nyaman, dengan rotasi tambahan hanya bila asset memenuhi 8-direction coverage. Default jangan memberi arbitrary 360° orbit yang memperlihatkan sprite datar/salah sisi.
- Scene streaming/LOD boleh ada sebagai **asset streaming dalam satu scene**, bukan pergantian menu/halaman. Semua zona tetap mempunyai representasi ketika overview.

### 2.3 Free area navigation ≠ forced unlock

- Player baru memulai dengan fokus Crop Field dan guided mission existing. Pan/zoom dapat melihat seluruh peta, tapi zone lain tidak otomatis memberikan starter pack hanya karena tersorot kamera.
- Clicking visible zone landmark → `Focus`/`Enter activity` dalam konteks yang sama; quick focus `Go to Chicken`, dll. hanyalah camera bookmarks, **bukan tab yang mengganti renderer**.
- Existing player farm: kelima area dengan status aktual dan asset aktual langsung ditampilkan setelah save tervalidasi. Bila area belum diaktifkan, jangan mendadak penuh hewan pada overview.
- Market ada **satu bangunan sentral**; player dapat membuka Market via bangunan dan global bottom navigation. Semua item tanaman, telur, kambing, susu dan ikan tetap dijual dalam satu sistem existing.
- Kamera tidak perlu disimpan ke core save; boleh persistent **separate non-critical UI preference** dan reset mudah.

---

## 3. Graphics pipeline — 3D world + animated 3D-looking sprites

### 3.1 Recommendation: hybrid, progressive and benchmarked

**Preferred target:** gunakan lightweight Three.js scene (reuse **konsep** dan pengalaman renderer MyZooTwin), dengan low-poly terrain/buildings + carefully styled **directional sprite atlases** untuk karakter/aktivitas; bila beberapa fasilitas cocok dengan baked 3D meshes, gunakan meshes. **Jangan** migrasi seluruh Astro stack; bangun sebagai sub-app `/play/` yang terpisah, dengan dependency/version pinned dan bundle build yang tidak wipe `dist`.

**Decision gate:** pada M1 Dot harus membuktikan Three.js hybrid dapat menjalankan **Crop + Chicken satu scene** pada target perangkat dan performance budget. Jika proof buruk, lakukan minimisasi mesh, material, draw calls/texture memory, sprite LOD, dpr/camera constraints terlebih dahulu. Alternatif upgraded isometric Canvas/WebGL/SVG hanya boleh dipilih bila benar-benar mencapai lima zona satu world dan kualitas visual minimal yang setara dengan target screenshots. Penolakan engine karena “lebih cepat coding dengan lima scene lama” bukan acceptable shortcut.

### 3.2 Directional sprite animation specification

Untuk hewan (chicken/goat/cow/fish) Dot harus membuat **sprite 3D-looking** dengan style konsisten: volumetric shading/baked lighting, soft silhouette, correct shadow, contact ground, matching scale/footprint, no muddy background/white fringe, alpha transparency teruji.

- **Base atlas:** minimum **4 azimuth views** yang cocok dengan 4 quadrant camera rotation; **8** bila layak tanpa membengkakkan resource. Gunakan **4 directions** sebagai V1 target, tidak harus langsung 8.
- **Animations:** idle/breathing, moving, eating/feeding, drinking/rest, plus one unique state per animal. Prefer **4–8 frames** untuk loop utama pada fps terukur, bebas dari simulation time. Jika animasi atmosfer tidak mengubah produksi, boleh loop saat dunia sedang paused tetapi jangan membuat angka/hasil seolah bertambah.
- **Character identity:** stable `entityId` → selected variation, scale, stage, animation behavior seed; tidak membuat goat/hen/cow/ikan baru hanya karena render ulang.
- **Fish:** fish di kolam berenang sebagai school visual; jumlah visual dibatasi dan diberi label cohort/stock actual — jangan render 1 sprite per setiap ikan dalam stok ribuan. Water surface/underwater occlusion masuk akal.
- **Animation controller:** stable finite states (`idle`,`move`,`eat`,`drink`,`rest`,`special`), priority/transition, pause/resume, directional frame selection dari camera heading. Visual state update bisa semi-random seeded kosmetik (terpisah dari RNG domain; tidak dikirim ke engine/save).
- **Billboard behavior:** plane/sprite face near camera and world-ground contact; when camera rotates 90° choose matching directional frames, maintain correct left/right orientation and depth. Trees/fences/roofs must occlude animals logically. Jangan tampilkan goat melayang di atas atap atau fish menembus dinding kolam.
- **Atlas metadata:** `species`, `frameRects`, `animation`, `direction`, `durationMs`, `origin/pivot`, `worldScale`, `hitArea`, `sourceModel`, `license`, `checksum`, `LOD/variants`. Sediakan script reproducible export/preprocess, compressed deployed atlas (PNG/WebP or tested GPU-friendly format), **jangan mengejar GIF/video playback** untuk sprite.
- **Color consistency:** semua sprites/blender/procedural models memiliki satu art direction. Hindari gambar AI dengan style/perspektif berubah-ubah antar frame. Art/animation quality **wajib** lewat visual acceptance, bukan hanya test file exists.

### 3.3 Per-animal animation contract

| Entity | Animasi minimal | Kaitan state yang benar | Jangan tampilkan |
|---|---|---|---|
| Chicken | idle/walk/peck/eat, drink, nest/egg-ready cue | feeder/drinker/egg stock dari chicken state | egg spawn saat belum ada egg atau tanpa syarat laying |
| Goat | idle/walk/browse/chew, drink, rest/climb | herd ID, forage/hay, shelter, juvenile size/stage | kidding/milk (belum menjadi core feature) |
| Cow | idle/walk/ruminate/eat, drink, milk-station cue | owned cows, actual milk availability/session | “milking success” tanpa accepted command |
| Fish | school swimming, surface/feed response, splash | pond/water/stock/aerator/harvest states | 1000 entities per fish unit atau splash = free harvest |
| Crops | seedling→sprout→growing→harvest-ready visual stages, subtle breeze | existing growth stage/quality/water | visual growth via RAF independent of game tick |

Additional environmental animations: gentle grass sway (LOD-aware), pond ripples, aerator bubbles only ON, pump/sprinkler activity only ON, subtle birds/clouds far distance. Decorative loops should never charge or grant resources.

### 3.4 Environment and visual art direction

- **Cozy 3D stylized low-poly, premium and readable:** bright natural green, warm wood, soft shadows, recognizable forms, not dark realistic industrial simulation and not huge polygon counts.
- **Depth hierarchy:** terrain/fences/paths, farms, animals/props with accurate contact shadows, trees, mountains/horizon/sky. Tampilkan layer jelas untuk visual depth.
- **Buildings:** chicken coop + ramp/nests, goat shelter/foliage/climbing platform, cow barn + dairy station, tilapia fish pond + aerator/dock, crop beds + irrigation + central Market. Upgrade visually changes correct existing state.
- **Water:** readable pond geometry, surface highlight/ripples, fish visibility at sensible depth; no heavyweight fluid simulation.
- **Lighting:** coherent day/night ambience follows **existing game hour/weather** (pure render), optional gentle transitions and color adjustments. No new weather engine. Shadows quality scaled by device tier.
- **Interactable affordances:** selected object outline/ring, status cue, contextual action with readable labels and click target; use highlights sparingly, no sea of floating numbers.
- **Assets:** prioritize owned/procedural/clearly licensed. Create `ASSET_PROVENANCE.md`/manifest (authoring model, dates, license, source, file path, hash). Compare against MyZooTwin style, **do not copy third-party assets blindly**.

---

## 4. Redesigned menus & world interaction

### 4.1 Navigation before → after

**BEFORE:** `[Field] [Chicken] [Goat] [Cow] [Fish]` acts like 5 separate scene tabs.

**AFTER:** one always-on world + compact global controls:

```text
  ┌───────────────────────────────────────────────────────────────────┐
  │ MyFarmTwin   Day 12   ☀ Sunny    Coins 450    Water 120 L  [⚙]    │
  ├───────────────────────────────────────────────────────────────────┤
  │                                       [Minimap]                    │
  │             ONE CONTINUOUS 3D FARM WORLD                          │
  │  chicken ◀─ paths ─► goats       cows      fish pond              │
  │               crop beds ─ MARKET                                  │
  │                                                                   │
  │  [selected: Coop] [Feed] [Water] [Clean] [Inspect]                 │
  ├───────────────────────────────────────────────────────────────────┤
  │ [Missions] [Build/Upgrade] [Market] [Inventory] [Lab] [Settings]  │
  └───────────────────────────────────────────────────────────────────┘
```

**Bottom navigation is functional, not a new feature to create unrelated economy:**

- **Missions:** one relevant current mission with jump-to-object, other quest categories in collapsible list; completion tied to engine.
- **Build / Upgrade:** existing upgrades for selected object/zone, placement preview for already-supported buildings only; **no new sandbox editor**.
- **Market:** existing shared Market modal/sheet, accessible from toolbar or central Market building.
- **Inventory:** existing combined supplies/products, grouped by item; no fake stocks.
- **Engineering Lab:** existing Inspect/Why? routed to selected zone/object, advanced data optional; no engineering-first HUD takeover.
- **Settings:** sound if present, language ID/EN, Quality Auto/High/Low, reduced motion accessibility, camera reset, save/export/import; retain current tools.

**Zone shortcuts** may appear as minimap markers or a small `Go to` dropdown (Crop/Chicken/Goat/Cow/Fish). Mereka **HANYA** memindahkan kamera ke lokasi; jangan pernah mengganti scene/UI menjadi full-page farm lain. Selected object drives contextual panel. A zone can be brought into focus from the mission card.

### 4.2 Camera / input

- Desktop: drag-to-pan or controlled orbit/pan mode, wheel zoom only over canvas with non-disruptive page scroll, visible rotate left/right, zoom, `Fit Whole Farm`, `Reset`, shortcuts W/A/S/D or arrow keys, click to select. Avoid accidental interactions after drag.
- Mobile: one-finger pan; pinch zoom **if reliably supported**; visible zoom/rotate/reset buttons for gesture-free access, tap select, compact bottom sheet. Prevent page scrolling only for intentional map gestures; avoid hijacking vertical scroll elsewhere.
- Camera `Focus` moves to anchor with short interruptible animation (<~0.5s guideline) rather than scene transitions; when player taps other area, selection moves and prior selection closes safely.
- **Accessible backup:** searchable/scrollable object list for each zone and shortcuts to important facilities, playable by keyboard/screen reader even without relying solely on canvas pixels. Screen readers get labels, focus return and state messages.
- Page does not open five dialogs on first visit; tutorial highlights first useful action (plant crop or inspect animals) and lets player explore.

### 4.3 First-time 3-minute experience target

1. 0–30s: world overview loads and shows five districts with clearly readable shortcuts; focus crops, current mission visible.
2. 30–75s: tap a plot, plant/water, see visual response and remaining farm in surroundings.
3. 75–120s: camera focuses Chicken (or a previously activated farm) **without scene load**; select animal/object and perform a real existing action.
4. 120–180s: visit Market at center, use inventory/sell if available, mission/reward and next upgrade clearly shown. No forced completion of a long biological cycle merely to demonstrate navigation.

The 180s is an **automated tutorial target**, not a proven human metric; log exact timed scripted journey and record limitations.

---

## 5. Architecture, versioning, and non-destructive behavior

### 5.1 Recommended boundaries

```text
 Existing Engine (unchanged core)
  state + commands + seeded ticks + saves + market + missions
                        │  read-only snapshot / validated dispatch
                        ▼
  Scene Adapter / WorldEntityRegistry / ZoneRegistry
                        │
             Unified Render Layer
       terrain 3D + buildings + sprites
                        │
                One Global Camera
                        │
          contextual HUD + global menus
```

- `RendererAdapter`/`SceneController` owns WebGL resources, texture atlases, camera, hit-testing, and only translates selected IDs to existing actions. Domain reducers never import Three.js or renderer modules.
- Use a **single `requestAnimationFrame` loop** for visuals, separate from fixed simulated time (currently 1 game-hour/tick). Do not call `dispatch('tick')` per visual frame or duplicate scheduled timers.
- **No full DOM rebuild per visual frame**; apply incremental scene updates from state differences. Allow asset pooling and instancing for grass/fences/trees.
- Asset loading/on-demand streaming and `fitWorld` must be deterministic visually, with reliable offline fallback once cached if existing app supports it. No runtime CDN dependency as default; copy licensed Three.js notice and pin version.
- Existing localStorage save `myfarmtwin.save.v1` key must **not** be renamed or overwritten merely because renderer changed. Do not create additional farm save under `v3d` and fork player progress.
- UI-only prefs (camera, graphics quality, last focused zone) may be stored under separate, non-authoritative key(s) with safe defaults; invalid preferences cannot corrupt simulation.
- If new editable building placements ever introduced in a **future** PRD, only then migrate schema using a versioned validated layout; this V1 uses **fixed zone layout** derived from existing ownership/progress, not permanent player-authored placement.

### 5.2 Feature switch and rollout safety

- Keep old SVG renderer as **temporary tested fallback** behind internal feature detection/flag while migrating, not as five permanent player-visible tabs.
- Core gate: validated old save loads, snapshot → new scene, actions → same dispatch → same result; camera/animation/renderer changes cannot modify saved bytes if no domain action occurs.
- If WebGL unavailable/context lost, show a usable **low-graphics unified-map fallback** (prefer same zone layout with 2D scene, not regress to five independent navigations) or a clearly explained fallback only if retaining full unified functionality impossible; this is a release blocker and must be resolved, not hidden.
- Do not switch production default to new renderer until real `Field + Chicken` vertical slice and remaining five-area regression pass; rollback must not wipe newer save data.
- GitHub Actions quota is constrained: run local test/build, no unnecessary pushes, no force-push, no tracked QA artifacts.

### 5.3 Minimum performance budgets (provisional **gates to measure**, not claims)

Dot records actual baseline and tested hardware/browser; thresholds can be tuned with documented evidence but **must not be silently abandoned**:

| Metric | Initial target |
|---|---|
| Mid-range Android Chrome, overview + ≥2 animated animals | ≥30 FPS median in 60s controlled test, no persistent freeze |
| Desktop mid-range Chrome, all zones | ≥50 FPS median in 60s controlled test |
| Simulated mobile 4G / CPU throttling | core map interaction available ≤5s, with visible progress/fallback; compare baseline |
| Initial downloadable render-critical content | target ≤3 MB transferred, lazy-load nonvisible detail; document measured cold/warm |
| All-zone resource | record total network bytes, texture allocation, JS heap and GPU impacts; no runaway growth in 15–30min navigation |
| Camera transitions | aim visually smooth; target ≤500ms for normal focus; always interruptible |
| Resize/landscape/context loss | recover interaction without regrant, double tick, data loss or broken click targets |

- Default adaptive quality: clamp device pixel ratio, use pixel ratio ~1–1.5 on mid/low devices rather than uncontrolled high-DPR canvas, simplify shadows/effects, reduce distant sprite frames, cull offscreen meshes, disable nonessential particles and pause RAF when hidden.
- Compress textures/atlases; don't create 2048–4096 textures blindly, use profiling. Optimize for memory and draw calls, not just desktop screenshot beauty.
- Respect `prefers-reduced-motion`; selecting Low Quality may reduce frame detail but **never** remove essential object/menu affordances or commands.
- Quality must remain appealing at 390px portrait, not be desktop-only showcase.

---

## 6. Master micro-feature checklist — **82 micro-features**

**Execution status: 48/82 = 58.5% (7 November 2026).** Evidence: [M0 audit](UNIFIED_WORLD_AUDIT.md), [M1 checkpoint](UNIFIED_WORLD_M1_CHECKPOINT.md), [global camera](UNIFIED_WORLD_CAMERA.md), [picking](UNIFIED_WORLD_PICKING.md), [fallback](UNIFIED_WORLD_FALLBACK.md), [feasibility](UNIFIED_WORLD_FEASIBILITY.md), [two-zone gate](UNIFIED_WORLD_TWO_ZONE_GATE.md), [zone registry](UNIFIED_WORLD_REGISTRY.md), [terrain](UNIFIED_WORLD_TERRAIN.md), [paths](UNIFIED_WORLD_PATHS.md), [crops/pump](UNIFIED_WORLD_CROPS.md), [Chicken Yard](UNIFIED_WORLD_CHICKEN.md), [Goat Ranch](UNIFIED_WORLD_GOAT.md), [Cow Barn](UNIFIED_WORLD_COW.md), [Fish Pond](UNIFIED_WORLD_FISH.md), [footprints/occlusion](UNIFIED_WORLD_COLLISIONS.md), [full-farm fit/M2 gate](UNIFIED_WORLD_FIT.md), [selection/focus](UNIFIED_WORLD_PRESENTATION.md), [crop gameplay](UNIFIED_WORLD_CROP_PARITY.md), [Chicken gameplay](UNIFIED_WORLD_CHICKEN_PARITY.md), [Goat gameplay](UNIFIED_WORLD_GOAT_PARITY.md), [Cow gameplay](UNIFIED_WORLD_COW_PARITY.md), [Fish gameplay](UNIFIED_WORLD_FISH_PARITY.md), [shared Market](UNIFIED_WORLD_SHARED_MARKET.md), [native objectives](UNIFIED_WORLD_OBJECTIVES.md), [unstarted safety](UNIFIED_WORLD_UNSTARTED.md), [all-five hard gate](UNIFIED_WORLD_ALL_FIVE_GATE.md), [art specification](UNIFIED_WORLD_ART_SPEC.md), [atlas pipeline](UNIFIED_WORLD_ATLAS_PIPELINE.md), [Chicken sprites](UNIFIED_WORLD_CHICKEN_SPRITES.md), [Goat sprites](UNIFIED_WORLD_GOAT_SPRITES.md), [Cow sprites](UNIFIED_WORLD_COW_SPRITES.md), [Fish sprites](UNIFIED_WORLD_FISH_SPRITES.md), [crop art](UNIFIED_WORLD_CROP_ART.md), [animation controller](UNIFIED_WORLD_ANIMATION_CONTROLLER.md), [sprite contacts](UNIFIED_WORLD_SPRITE_CONTACT.md), [native cues](UNIFIED_WORLD_NATIVE_CUES.md), [animation quality gate](UNIFIED_WORLD_ANIMATION_QUALITY.md), [environmental style](UNIFIED_WORLD_STYLE.md). The original planning status was 0/82. This is a NEW PRD. Dot must mark `[x]` **only after code + automated tests + any required screenshot evidence**. Do not pre-mark because legacy tools exist; a feature passes only when its **new unified-world contract** is verified. Percent = checked/82×100. Each item is individually testable.

### M0 — Audit and irreversible-risk prevention (8)

- [x] **M0-F01** — Audit latest local/remote/main/production, commits, uncommitted files and active Dot tasks (especially Fish and Cow release); secure clean isolated branch and non-destructive checkpoint.
- [x] **M0-F02** — Inventory five renderer modules, `main.js activeArea` handling, per-area cameras, object IDs, zone-specific input, and all existing action/mission/Market/Inspector contracts.
- [x] **M0-F03** — Inspect MyZooTwin's Three.js scene, camera, asset practices, licensing, deployed build constraints; document transferable patterns, not blind repo copy.
- [x] **M0-F04** — Run baseline `lint`, `typecheck`, unit, build, full e2e plus area QA suites actually available; distinguish existing failures from new ones.
- [x] **M0-F05** — Capture deterministic baseline screenshots/video evidence and interaction traces for all five current zones on desktop/mobile/EN+ID; inventory assets and current art inconsistencies.
- [x] **M0-F06** — Freeze sanitized V0–current save fixtures and full crop/chicken/goat/cow/fish ledger/mission snapshots; write byte/semantic comparison scripts; no personal saves copied.
- [x] **M0-F07** — Profile current total bytes, FPS, load, CPU/heap and UI actions on mid mobile/desktop; specify quality target reference captures from MyZooTwin **as inspiration only**. Local laptop + throttled mobile emulation measured; physical-device performance remains an explicit release limit.
- [x] **M0-F08** — Add living PRD, design rationale, world schema + asset provenance checklist, feature switch and rollback/release plan to repo; baseline must remain production-safe.

**M0 gate:** no game behavior touched; audit and safe implementation route documented.

### M1 — New renderer feasibility & end-to-end vertical slice (8)

- [x] **M1-F01** — Prototype a lightweight isolated Three.js/optimized hybrid scene inside `/play/` build with 3D terrain and one camera; existing website/engine unaffected.
- [x] **M1-F02** — Run measured Three.js-vs-enhanced-2.5D feasibility on actual supported browsers; document renderer choice, device budgets and no-unsupported-WebGL fallback plan.
- [x] **M1-F03** — Pin runtime dependency, bundle only game assets (no Astro migration), distribute license and source map policy; verify `dist` editorial unchanged.
- [x] **M1-F04** — Implement a read-only `State→Scene` adapter with stable entity references and scene cleanup; snapshot rendering doesn't change revision or save.
- [x] **M1-F05** — Implement one global isometric camera with bounded pan/zoom/four-angle rotate/reset/fit-world and deterministic coordinate projection.
- [x] **M1-F06** — Add mesh/sprite picking that maps 3D hit to existing action ID; distinguish drag vs tap and provide keyboard alternatives.
- [x] **M1-F07** — Add no-WebGL/low-quality recoverable pathway with usable scene controls, safe context-loss handling and no secondary simulation ticker.
- [x] **M1-F08** — **HARD VERTICAL-SLICE GATE:** one continuous crop + chicken terrain in one canvas; plant/water/harvest and feed/collect/sell remain functional through existing Market, exact save/economy, desktop/mobile/EN+ID tests.

**M1 gate:** Do not continue world expansion while two-zone playable proof fails. Stop and fix; no cosmetic-only pass.

### M2 — Layout all farms on ONE terrain (10)

- [x] **M2-F01** — Define fixed `ZoneRegistry` world coordinates/bounds/anchors/collisions for five zones, central Market, path network and reserved empty future land.
- [x] **M2-F02** — Build one seamless terrain/ground with coherent perspective, world bounds and no visual seams/accidental disconnected floating islands.
- [x] **M2-F03** — Add connected path/entry/central Market geometry, signposts and overview framing; no impassable terrain or severe overlaps from all four cameras.
- [x] **M2-F04** — Convert existing Crop Field plots, irrigation/pump and crop growth visuals to unified coordinate/picking; preserve every stable plot ID.
- [x] **M2-F05** — Locate Chicken Yard/coop/fence/nest/feeder on unified map; render actual visited/state and owner upgrades, not duplicate starter hens.
- [x] **M2-F06** — Locate Goat Ranch/paddock/shelter/animals on unified map; maintain true herd stages and grazing object selection.
- [x] **M2-F07** — Locate Cow Barn/feeder/milk station/co-op objects on unified map; preserve actual cow states and milking actions.
- [x] **M2-F08** — Locate Fish Pond/water/aerator/feeding dock/harvest stations on same terrain with true water/equipment status.
- [x] **M2-F09** — Resolve all object footprint, z-order, light/shadow and click-collision issues; define empty land, future expansion safe boundaries and camera occlusion rules.
- [x] **M2-F10** — Verify full farm visible from `Fit Whole Farm`; `Focus Zone` moves camera across all five without component/scene switch and without simulation/save changes.

**M2 gate:** five zones genuinely share one map. Zone shortcuts may move camera, never hide other zones by mounting another world.

### M3 — Five-area gameplay interaction parity on shared scene (10)

- [x] **M3-F01** — Refactor `activeArea` scene-tabs into presentational `selectedEntity` + `focusZone`; preserve temporary compatibility until release gates.
- [x] **M3-F02** — Crops: tap/select plot, seed, water, harvest, pump and upgrades through original headless dispatch; exact resource/ledger parity.
- [x] **M3-F03** — Chicken: feed/water/clean/collect eggs/buy supplies and coop upgrades via unified scene and existing UI response.
- [x] **M3-F04** — Goat: hay/water/clean/paddock/select/sell/buy/upgrade remain usable from world selection; protect social-herd constraints.
- [x] **M3-F05** — Cow: feed/water/clean/inspect/milk/cooling/coop delivery and cow upgrades remain usable; no duplicate milk/sales.
- [x] **M3-F06** — Fish: feed/aerate/water-quality/harvest/sell and pond upgrades remain usable; no phantom biomass/oxygen.
- [x] **M3-F07** — One shared Market building launches existing Market transactions for crop, egg, goat, milk, fish; global toolbar opens the same content.
- [x] **M3-F08** — Context mission progression and reward celebration follow engine events even when player camera is elsewhere; navigate to objective without auto-completing it.
- [x] **M3-F09** — Before a zone is visited, show truthful unstarted/available state; camera pan/focus must NEVER execute a starter grant, tick, transaction, upgrade or unlock.
- [x] **M3-F10** — **HARD GAMEPLAY GATE:** scripted complete care/production/sale flows in all five zones, and cross-zone Market + save/reload; zero required old-area tabs.

**M3 gate:** all original gameplay functional. Do not start expensive cosmetic polish before this passes.

### M4 — 3D-looking sprite atlas production & life animation (11)

- [x] **M4-F01** — Establish one art/animation specification (style sheet, pixel density, angle, lighting, alpha, pivot, shadow, species scale, license manifest, low/hi atlas LOD).
- [x] **M4-F02** — Implement reproducible 4-direction animated atlas pipeline + metadata parser/player, state transitions and deterministic cosmetic variants (not game RNG).
- [x] **M4-F03** — Chicken atlas & behavior: idle, walk, peck/eat, drink, nest cue and stage/coop state gating; remove static-only replacement once proven.
- [x] **M4-F04** — Goat atlas & behavior: idle, walk, browse/chew, drink/rest/climb with size/stage matching saved herd.
- [x] **M4-F05** — Cow atlas & behavior: idle, walk, rumination/feed, drink/rest, milking-station cue matching actual lactation & accepted milking.
- [x] **M4-F06** — Fish school atlas & behavior: swim, feed response, surface/ripples; render bounded visual cohorts rather than one sprite per individual fish count.
- [x] **M4-F07** — Upgrade crop meshes/sprites across growth stages with subtle vegetation animation; underlying growth is exclusively engine-driven.
- [x] **M4-F08** — Build one animation controller for per-entity state priority, direction-dependent frames, scene pooling, pause/hidden/low-quality behavior.
- [x] **M4-F09** — Correct sprite billboard facing, all 4 camera azimuths, world-scale, cast/contact shadow, depth sorting/roof/pond occlusion and tap hitbox per pose.
- [x] **M4-F10** — Drive state cues solely from engine snapshots: feeders, troughs, nest, milk, pond, pump/aerator; reject fake status or duplicated visual animals after save/reload.
- [x] **M4-F11** — **ANIMATION QUALITY GATE:** actual browser screenshots/video of all species in ≥3 actions, smooth transitions, consistent art direction, reduced-motion fallback and zero simulation/ledger drift at 30-minute emulated runtime.

**M4 gate:** moving animals look alive, remain recognizable from every allowed rotation and never lie about state.

### M5 — World graphics and environmental polish (8)

- [x] **M5-F01** — Create cohesive master palette, lighting direction, camera tilt, scale guide, color contrast and style consistency across farms.
- [ ] **M5-F02** — Improve ground material, paths, farm beds, fencing, contact/baked shadows, trees/foliage in a shared coordinate system with bounded draw calls.
- [ ] **M5-F03** — Upgrade chicken coop, goat shelter, cow barn, crop infrastructure and central Market low-poly geometry with recognizable real upgrades.
- [ ] **M5-F04** — Improve pond water color/reflections/ripples/underwater fish visibility without heavyweight fluid/shader cost.
- [ ] **M5-F05** — Tie weather/ambient lighting to existing day/hour/weather snapshot, with no secondary forecast/time engine.
- [ ] **M5-F06** — Add restrained VFX for water/pump/aerator, egg-ready, milk-ready, harvest and accepted sales; no flashy economy-confusing particles.
- [ ] **M5-F07** — Optimize texture atlases/material reuse/instancing/shadow detail and implement attractive high/auto/low quality presets.
- [ ] **M5-F08** — **VISUAL REVIEW GATE:** screenshot matrix of all five zones, whole-world overview, 4 angles and mobile/desktop; review depth, clipping, UI occlusion, style mismatch and genuinely improved quality versus baseline.

**M5 gate:** screenshot/camera quality feels like one polished game, not five pasted dioramas.

### M6 — Navigation & menu redesign for unified map (9)

- [ ] **M6-F01** — Replace 5 primary area switching tabs with ONE global HUD and new world-first layout; no legacy tabs visible in shipping UI.
- [ ] **M6-F02** — Implement global bottom/side menu `Missions`, `Build/Upgrade`, `Market`, `Inventory`, `Engineering Lab`, `Settings` wired to original functionality.
- [ ] **M6-F03** — Implement contextual object action sheet `Select → Inspect/Care/Build/Trade` with correct enabled/disabled engine reasons and focus restoration.
- [ ] **M6-F04** — Add small clickable minimap/zone landmarks and `Go to` shortcuts to the five zones; map stays present and visible during camera navigation.
- [ ] **M6-F05** — Connect current and next missions to world targets via highlights/focus; do not trigger grants/missions on mere camera movement.
- [ ] **M6-F06** — Render clear status indicators for unvisited/locked/needs-care/ready-to-collect zones without overwhelming full map.
- [ ] **M6-F07** — Mobile responsive HUD, thumb-reachable tools, scrollable bottom sheets, safe insets, landscape, no overlapping minimap/game actions.
- [ ] **M6-F08** — Full desktop/touch/keyboard/mouse camera control instructions and accessible object-list alternatives; prevent tap vs drag false positives.
- [ ] **M6-F09** — Verify all global navigation & context copy in Indonesian/English, first 3-minute task clarity, error/help labels and no UI translation regressions.

**M6 gate:** focus/navigation selects locations **within** a world instead of switching game scenes; user can use every existing tool on small screen.

### M7 — Stability, data invariants, performance and fallback (9)

- [ ] **M7-F01** — Confirm engine/save schema unchanged for pure presentation upgrade; if changed, document necessity and test safe migration with full old fixtures, no reset shortcut.
- [ ] **M7-F02** — Separate optional UI preferences (graphics, camera, focus) from authoritative save; invalid preferences cannot block load or corrupt game.
- [ ] **M7-F03** — Test repeated camera focus, 4-angle rotation, reload, locale switch and selection change cannot duplicate grants/actions/ledger entries.
- [ ] **M7-F04** — Test resize, tab hidden, WebGL context loss/restoration, low-memory fallback and no-WebGL path; full simulation time only from original game clock.
- [ ] **M7-F05** — Implement viewport-frustum culling, scene/sprite pooling, texture disposal and pixel-ratio/quality adaptation; no unbounded object/timer growth.
- [ ] **M7-F06** — Profile 15–30-minute world navigation on mid-tier mobile/desktop and simulated 4G; address 30/50 FPS targets or document justified measurable thresholds and fixes.
- [ ] **M7-F07** — Headless seeded replay comparison `original interface path` vs `unified map path` for all five areas: same commands → same simulation, weather, inventory, Coins and ledger.
- [ ] **M7-F08** — Security/asset audit: no untrusted remote fonts/models, appropriate CSP and static asset loading, source license provenance, package audit, no unneeded dependencies.
- [ ] **M7-F09** — Verify reload/import/export/backups/quarantine/invalid data/concurrent tabs and rollback readers preserve full all-five-area player progress.

**M7 gate:** performance and data protection are release blockers, not cosmetic afterthoughts.

### M8 — Full QA, release and live verification (9)

- [ ] **M8-F01** — Automated **black-box** five-zone E2E journeys with exact Market/mission/save outcomes, including new player and legacy save player.
- [ ] **M8-F02** — Automated **white-box** tests for renderer/domain separation, dispatch ID mapping, camera-only no-mutation, clock and no double event/RAF.
- [ ] **M8-F03** — Mixed-farm 30/60/90 game-day economic/endurance regression against previous known-good engine baselines; identical deterministic results.
- [ ] **M8-F04** — Keyboard/ARIA/reduced-motion/low-graphics/accessibility checks, meaningful fallback and screen-reader object access; no inaccessible canvas-only actions.
- [ ] **M8-F05** — Visual/camera regression at 320/360/390/768/1024/1440px, portrait/landscape, EN/ID, 4 headings, zoom min/max; manually inspect actual captured screenshots via internal browser.
- [ ] **M8-F06** — Dead-code / dependency / media cleanup: safely remove retired presentation switches **after** replacement verified; preserve all old source and assets needed for rollback; keep QA outside Git.
- [ ] **M8-F07** — Run project lint/typecheck/unit/build/area-specific e2e/security/SEO/homepage/performance and cold-start + long-session gates; record commands, failures, fixes and evidence.
- [ ] **M8-F08** — Review diff and exact production permissions, feature flag/fallback and rollback plan; non-force push/deploy through **current approved pipeline** once all gates pass, respecting any explicit hold from active task.
- [ ] **M8-F09** — **LIVE RELEASE GATE:** isolated browser live desktop/mobile EN/ID, screenshot quality, one-world 5-zone interaction, economic actions, save/reload/import sanity, no uncaught errors; commit+deployment+URLs+rollback logged; final report and 82/82 only after proof.

**M8 gate:** publication is NOT complete merely because local build succeeded. Public live tests + source/asset integrity + save protection must pass.

---

## 7. Detailed QA evidence and acceptance matrix

### 7.1 Five-zone interaction journeys

| Test | Steps / expected |
|---|---|
| Single world | overview shows Crop, Chicken, Goat, Cow, Fish simultaneously; focus any marker only changes camera |
| Crop | plant → water → next day → harvest → sell; no missing plot hitbox after rotate |
| Chicken | feeder→water→egg ready→collect→market, consistent with saved hen states |
| Goat | feed/water→paddock→select adult→valid sale; min-herd/condition logic unchanged |
| Cow | feed/water→milking when valid→cool storage/co-op sale; no phantom milk |
| Fish | stock/feeding/aerator→growth→harvest→sale; DO/quality causal core unchanged |
| Global Market | select Market on map **or** toolbar, same inventory/ledger, no price change |
| No-switch invariant | user never loads another full-scene screen nor loses visual context when visiting 5 areas |
| No-grant-on-look | orbit/zoom/pan across never-visited zones does not gift hens/goats/cows/fish/supplies |
| Save | existing V0–latest synthetic saves open without changing Coins/tick/ledger; unrelated camera movement does not dirty core save |
| Multi-tab | two tabs attempting action with stale revisions do not double collect/sell/upgrade |
| Low quality | same actions/missions accessible even if motion, shadows and sprite detail reduced |

### 7.2 Graphic-quality tests (human visual review by Dot with isolated internal browser)

- **All five zones** recognizable from default global overview; no one site disproportionately large, no game extending endlessly like a strip.
- **All four headings:** fences, barns, fish water, sprites and shadows remain coherent; no flat cardboards from wrong viewpoint, rotated labels, massive intersecting props, missing back faces.
- **Sprite sheets:** no duplicate limbs, morphing bodies, changing art style across frames, transparency halos, flicker, teleporting feet, shadow separation, or wrong species dimensions.
- **Animated behaviors:** at least idle + locomotion + care/reactive interaction for each required species, actually visible in browser; a static placeholder does not pass.
- **Responsive** touch sizes >=44 CSS px, no horizontal page overflow, minimap/buttons do not cover key 3D assets on mobile, selected object remains readable.
- **Visual upgrade verified** side-by-side with frozen old renderer screenshots at same logical state. Document which aspects genuinely improved, not self-approval solely by model output.

### 7.3 Invariant tests (must preserve old engine)

1. No change to `CURRENT_SAVE_VERSION` solely for new camera/renderer; if version changes, migration tests for all old envelopes/archives remain mandatory.
2. `state/revision/tick/coins/water/inventory/ledger/missions` identical before and after `focusZone`, camera rotate/zoom, opening minimap, change graphics quality, or choosing language (except intentionally persisted **UI-only** preferences).
3. Same engine action timeline yields identical farm state regardless of 3D framerate (20 vs 60 FPS), browser tab visibility, graphics quality or selected zone.
4. One action accepted once: exact resource deductions, stock/animal ID and income; no event listeners multiplied after scene redraw/memory recreation.
5. No cache/scene cleanup deletes validated browser save, quarantine, original pre-migration archives, or site media.
6. No actual domain tick from Three `setAnimationLoop`/RAF; do not multiply simulation time by frame rate.
7. Restart after WebGL context loss keeps same state and resumes safe interaction; no double ticket/sale/milk/egg from reconstruction.

---

## 8. Implementation approach & release sequence

**Mandatory order:** `M0 → M1 (2-zone end-to-end) → M2 (all zones in one map) → M3 (five-zone game parity) → M4 (animal sprites) → M5 (graphics polish) → M6 (menu redesign) → M7 (hardening) → M8 (QA/live release)`.

**Allowed dependency inversion only if evidence supports it:** technical substrate (save compatibility tests or scene registry) may precede UI micro-features, but maintain IDs and checkpoints. Do not mark an incomplete milestone done because a prettier mock exists.

**Rollout guardrails:**

- Never replace existing `/play/` default with a nonfunctional graphic prototype. Use local preview/isolated branch/hidden feature flag until working all-five vertical slice.
- If new graphics engine fails on target Android, optimize/fallback rather than forcing users onto broken WebGL. The default shipping renderer must work.
- Keep original SVG renderers *temporarily* for rollback until new experience is verified. Remove dead code only after proof of full parity and source saved in Git history.
- Each milestone requires targeted unit/regression + browser test and **user-visible change review**. Attach evidence paths in local ignored QA dir, not in Git.
- Recheck project-specific push/deploy consent in active Dot task. The user wants autonomous end-to-end work, but **explicit existing no-deploy instruction in another task takes priority** until superseded. Routine technical approvals are not needed.
- Post-deploy homepage remains **one live game card**; update its preview/copy to accurately reflect unified world only after new world passes live tests. Preserve SEO/canonical/GA4 identity.

### Reporting format to Product Owner

```text
MyFarmTwin Unified 3D World — Mx-Fyy
Feature: [short description]
Status: DONE / BLOCKED
Evidence: [test commands + PASS/FAIL + screenshot path]
World: [unified scene change]
Domain regression: [Crop/Chicken/Goat/Cow/Fish + save status]
Issues/fixes: [...]
Checklist: N/82 = XX.X%
Next: Mx-Fyy
Production: not yet / commit + deployment + live URL when verified
```

**No fabricated screenshots, claims of hardware tests, runtime metrics or production release.** Label emulated touch browser as emulation and local preview as local.

---

## 9. Definition of Done — overall release gate

Chicken/Goat/Cow/Fish/Crop game logic and history preserved, five zones genuinely visible in one map, camera operates as camera (not tab switching), directional animated sprites genuinely animate in browser, realistic-looking world geometry/lighting, original actions/Market/mission flow all work, save data safe, mobile/desktop EN/ID accessible, performance acceptable, screenshots reviewed, all 82 micro-feature checkboxes evidenced, production deployed only through authorized pipeline, live verification & rollback recorded.

The **source of truth for completion** is actual tests and live evidence, **not** a visually attractive preview or a checklist that simply says `[x]`.

**Final promise to users:** “My Farm is one place; my crops, chickens, goats, cows and fish really live together. I can see, care for, and grow the entire farm without hopping between disconnected mini-games.”

---

## 10. Technical references (guidance, not implementation dependencies)

- MyFarmTwin current code (connected GitHub): `game/client/main.js`, `world.js`, `camera.js`, `engine.js`, `save-schema.js`, `storage.js`, `features.js`, and all four livestock/one fish view modules; actual source revision must be re-audited.
- MyZooTwin current code (connected GitHub): `README.md`, `package.json`, `docs/MYZOOTWIN_MASTER_PRD_V1.md`, and its existing Three.js scene; use as **visual and interaction reference only**.
- Three.js documentation: https://threejs.org/docs/pages/WebGLRenderer , https://threejs.org/docs/pages/Raycaster , https://threejs.org/docs/pages/GLTFLoader.html . Refer to chosen pinned version's API at implementation time.
- Accessibility: https://www.w3.org/WAI/WCAG22/quickref/ — use usable HTML alternatives to direct 3D canvas-only interaction.
- Static asset copyright: verify sources/licenses/attribution; use original procedural art and locally controlled authored sprites where possible.

**PRD purpose:** comprehensive, controlled redesign of visuals and navigation only. The existing **engineering remains the engine, the unified animated world becomes the experience**.
