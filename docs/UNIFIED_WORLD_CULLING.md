# M7-F05 — bounded projections, culling and resource ownership

Canvas now conservatively rejects wholly offscreen faces/sprites and caches each live mesh's latest projection in a WeakMap. Cache keys include camera/projection/viewport, native light rig, world transform, geometry version, material/color/opacity, ownership and paint/pick flags. Partially visible objects remain paintable/pickable. Removed meshes are not retained by the cache; renderer disposal explicitly clears it. An uncached/unculled reference remains available for diagnostics/rollback. WebGL sprites now use Three's actual frustum culling.

The existing shared geometry/materials, 12 static instance batches (144 originals), stable actor pool, capped local atlas set, per-actor texture replacement/disposal and Auto/High/Low pixel-ratio caps remain in place. Sprite readiness summaries are immutable and recalculated only when membership/loading changes, avoiding diagnostic array allocation every cosmetic frame. None of these operations owns a domain clock or mutates the farm.

Evidence:

- `qa-artifacts/unified-m7-projection-final/projection.json`: 4 desktop/touch-emulated WebGL/Canvas profiles × eight actual live-scene views (four headings, overview/Cow focus). Cached+culled Canvas is pixel-identical to uncached+unculled reference across **16,020,160 pixels**. Stable scenes reuse 615–749 mesh projections per frame with zero misses. Timing records are actual offscreen Canvas work, not display FPS; controlled cadence/loading and long-session memory are M7-F06.
- `qa-artifacts/unified-m7-contact/contact.json`: 8/8 ID/EN desktop/touch profiles, 128 real body picks plus 64 actual 20px expanded touch picks; all four species/headings, marker/feet/contact alignment, native-save equality and one clock/canvas passed. An inherited report label said 22px; helper/assertion radius was 20px throughout and the label is corrected.
- `qa-artifacts/unified-m7-quality/quality.json`: 4/4 quality round trips, native save unchanged, bounded pixel ratio/LOD. High batching reduced actual calls 772→640 with zero changed pixels; mobile Auto measured 553 calls/7,600 triangles (includes the native goal marker). These are draw counters, not FPS.
- `qa-artifacts/unified-m7-roofs/roofs.json`: 96 actual roof pixel samples agree with the shared Lambert light calculation on both backends.
- All 114 unified unit tests passed (`qa-artifacts/unified-m1/m7-culling-final-unit.log`), including exact cache invalidation and partial-viewport ownership tests. Typecheck, build and frozen editorial/media/bundle audit passed. Runtime disposal/quality-race evidence is recorded in M7-F04; current long-session profiling follows separately.

Actual stage captures accompany the reports. No physical device/GPU-memory measurement or push/deployment is claimed.
