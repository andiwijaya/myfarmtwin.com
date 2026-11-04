# Desktop promotional homepage — local candidate

Status: implemented and verified locally on `homepage-desktop-promo`, based on `44242cd1e10fdad0a579a8f97233d6dbdb2c42e1`. Not pushed or deployed. Publication requires the user's approval of this revised scope; no previously denied publication action was retried.

The production inspection showed a 440px single-column card on a 1265px desktop viewport. The new homepage uses a wide, balanced two-column game card above 900px, with a large original farm illustration beside concise promotional copy. The card grows to 1180px on desktop. Tablet/mobile remain stacked with the complete artwork visible. Header and card edges align on large screens; existing cream/forest-green identity, one game link/card and rounded styling remain.

## Content and availability

English: “A little farm. A lot to grow.” / “Grow vegetables, care for chickens, and make this little farm your own.”

Indonesian: “Farm kecil. Harapan besar.” / “Tanam sayur, rawat ayam, dan bangun farm yang terasa milikmu sendiri.”

The live tag explicitly names crops/chickens or sayur/ayam. A visible EN/ID paragraph states goats, cows and fish ponds are not playable yet. The card's accessible name includes its play action and references the description/future paragraph. Canonical, title metadata, GA4 and existing OG image/metadata remain preserved.

## Original artwork

Generated with the built-in image_gen tool, without CLI/API keys, then inspected at full resolution and in desktop/mobile composition. One cohesive cartoon scene includes a vegetable garden, coop/hens, two goats, cow and visible fish pond. No FarmGirl or people, text, logo, watermark or new animal mechanics.

|Project asset|Dimensions|Bytes|
|---|---|---:|
|`dist/assets/farm-vision-hero-v2.webp`|1536×1024|503730|
|`dist/assets/farm-vision-hero-v2-small.webp`|768×512|152468|

`srcset`/`sizes` select an appropriate image for viewport and pixel density. Both versions preserve the whole scene; no important subject is cropped. Optimization used WebP encoding and a proportional resize only. Old SVG/PNG and game guide media are untouched. Uncompressed source `qa/home-desktop/hero-original.png` and asset SHA256/provenance remain in the task workspace outside Git.

## Verification

- `npm run homepage`: 24 Chromium 153 EN/ID surfaces, widths 320–1920 including 900/901px transition, desktop two-column width and mobile stacking, no horizontal overflow, 44px+ CTA above the first viewport, keyboard entry, locale persistence, exact sentinel/real-save preservation and game entry. No-JS, reduced-motion and blocked-storage fallback pass.
- Firefox 155: EN/ID at 390/901/1440px, the same responsive/function/data checks pass (six surfaces).
- `npm run seo`: all nine routes, canonical/OG/internal links/sitemap/robots/GA4 and 15 editorial layout/navigation checks pass; original content/styles/media remain protected.
- `npm run lint`: syntax checks pass. No game source, game assets, shared styles, headers, save logic or security/config changes.
- The strengthened preservation guard protects all 53 existing non-homepage-presentation files from the current baseline. Existing Windows checkout LF/CRLF differences are recorded separately for text only; binary assets must match exact bytes. No gameplay/editorial content difference was found. Staging is restricted to the seven owned homepage/art/test/doc files, preserving the actual baseline Git blobs for all other production assets.
- Real browser review inspected production before, then the local layout at its natural desktop size, 1440×900 EN/ID and 390×844 ID. At 390px the CTA bottom is about 650px with no overflow. Temporary viewport overrides were reset. Desktop/mobile screenshots were visually reviewed.

Evidence outside Git: task-2/qa/home-desktop/homepage.json, firefox/homepage.json, seo-regression.json, asset-provenance.json and home-{en,id}-{390,900,901,1024,1280,1440,1920}.png. The guard's initial false differences caused by mixed Windows checkout line endings are retained in the earlier evidence; assertions now distinguish line endings from real changes. All final checks pass.

No user save/reset/migration was performed in the user's production browser; automated game-entry/save checks used isolated QA contexts. This is a homepage presentation/art increment only. Production remains unchanged pending approval.

## Final image generation prompt

Built-in image_gen, original generation, opaque background:

```text
Use case: ads-marketing. Asset type: original large landscape homepage hero illustration for MyFarmTwin, a friendly browser farming game. Create a polished, beautiful cohesive cartoon farm final-vision scene: a lush vegetable garden with distinct rows of lettuce, carrots and ripe tomatoes; a charming wooden chicken coop with several healthy white and golden hens nearby; two friendly goats; one gentle black-and-white dairy cow; and a clear blue fish pond with visible small orange fish, aquatic plants and a simple natural stone edge. All these subjects must be clearly recognizable and belong in one thoughtfully arranged farm landscape, not separate panels. Premium cozy storybook / softly rendered 3D cartoon illustration with appealing rounded forms, subtle natural textures, excellent lighting, pleasing depth and precise animal anatomy. Warm soft daylight, sage/leaf greens, cream, natural wood and terracotta, quiet countryside backdrop. Landscape composition suitable for a large desktop website artwork and legible when reduced on mobile; keep every required subject within the central 85 percent so no important animal or pond detail sits at the edge. Art fills the canvas elegantly with a little breathing room, harmonious visual hierarchy, no excessive checkerboard or empty areas. No people, no FarmGirl, no text, no labels, no logo, no watermark, no UI, no promotional typography, no photorealism. This is an aspirational future farm illustration; actual availability explanations will be added in webpage HTML. Generate one high-resolution landscape illustration, approximately 3:2 aspect ratio.
```
