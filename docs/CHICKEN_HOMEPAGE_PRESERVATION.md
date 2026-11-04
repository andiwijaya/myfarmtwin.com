# One-card homepage preservation

M6-F08 keeps exactly one link/card to the existing /play/ game. The original native SVG garden style now includes original vector cartoon hens, coop, goat, cow and fish pond; the matching1200x630 social PNG is reproducibly rendered by tools/render-home-preview.mjs. No raster generation service, dependency, external image or new playable animal mechanics were introduced.

EN/ID descriptions state that crops and chickens are playable. A separate short visible caption explicitly marks goats, cows and fish ponds as future vision and not playable yet. Both image alternatives describe the full illustration. Homepage code still touches only the locale preference and never reads/writes game saves.

The preservation guard compares every deployed baseline dist file from def03f2846301d184691caefd73906e3ae90749a, except the five authorized homepage files and expanded dist/play game. The original in-game FarmGirl guide is separately protected. Articles, shared styles, routes, robots, sitemap, favicon and original FarmGirl PNG remain byte-identical. SEO regression additionally compares editorial main content to31bbced, canonicals/OG, all internal links and GA4G-VXB9Q1DG4W.

Evidence outside Git: task-2/qa/chicken/m6-home/homepage.json, seo-regression.json and home-{en,id}-{390,1440}.png. Reviewed desktop EN and mobile ID artwork/layout; automated320-1440px EN/ID tests verify no overflow, one card,44px CTA above the first viewport, keyboard entry, locale persistence, unchanged sentinel/real save, no-JS/reduced-motion/blocked-storage fallback and game entry.
