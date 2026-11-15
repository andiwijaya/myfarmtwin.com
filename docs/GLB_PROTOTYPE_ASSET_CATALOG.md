# GLB prototype asset catalog

Authoring date: 15 November 2026. Scope: the P0-P2 garden and cow-barn prototype.

## Source and status

All nine GLBs and their embedded textures are original repository authoring. No downloaded model, external texture, animal atlas, MyZooTwin content, paid asset, or remote runtime resource is used. The source is retained in `tools/art/glb-prototype-models.mjs`, with the deterministic GLB/PNG writer in `glb-prototype-export.mjs` and the export entry point in `glb-prototype-build.mjs`.

The models use custom lofted surfaces for the cow torso, neck, skull, articulated limbs, sacks and tree trunks; authored curved leaves, tubes, frames, fixtures, and corrugated roof geometry; and original embedded procedural hardwood, loam, turf, coat, zinc, and straw textures. Materials use glTF metallic/roughness PBR. Direct static meshes are baked together per material, while named template/articulation/cutaway groups remain intact. Small fixtures use fewer segments than close-up anatomy.

Structural/resource checks pass for 9/9 GLBs. Browser integration, actual close-up art review, picking, roof cutaway, animation playback, draw calls and physical-device performance are separate parent-owned checks. This catalog does not claim photorealism or completion of those checks. The cow is articulated with transform-node animation; it does not contain a skinned skeletal rig.

## Runtime catalog

Runtime files: `game/client/assets/models/prototype/`. Manifest: `game/client/assets/models/prototype-manifest.json`.

| File | Bytes | Unique geometry triangles | Templates / role |
| --- | ---: | ---: | --- |
| `terrain.glb` | 227,708 | 3,852 | Continuous 48 x 40 m turf and soil cross-section. Ground y=0 in the playable center; subtle outer-edge undulation. |
| `barn.glb` | 912,464 | 11,872 | 10 x 8 m barn foundation, timber frame/trusses/braces, ventilated local masonry/timber walls, stalls, rice-straw bedding, troughs, milk/wash fixtures, corrugated zinc roof. |
| `cow.glb` | 454,740 | 12,766 | Cream/charcoal dairy cow with lofted body/neck/skull/limbs, cloven hooves, muzzle, nostrils, eyes/eyelids/catchlights, ears/short horn buds/tag, collar, udder, tail and three animation clips. |
| `bed.glb` | 238,304 | 1,788 | Timber-edged 1.5 x 1.8 m cultivated bed and soil furrows. |
| `crops.glb` | 399,580 | 10,888 | 13 named lettuce/tomato/corn growth-stage templates. |
| `vegetation.glb` | 566,756 | 12,962 | Banana, coconut palm, grass clump and shrub templates. |
| `fence.glb` | 117,212 | 64 | Modular 2 m timber fence, posts, caps and rails. |
| `path.glb` | 114,476 | 1,212 | Modular 2 x 2 m compacted earth path with small stones. |
| `props.glb` | 464,876 | 2,348 | Feed/water trough, pail, crate, feed sack, pump and weathered rock templates. |
| **Total** | **3,496,116** | **57,752 unique triangles** | Scene instances determine actual rendered totals and draw calls. |

Numbers describe these exports, not a measured loaded scene. Texture data is embedded only where a model uses it; GPU decoded allocations differ from PNG transfer bytes.

## Coordinate and scene contract

- Units: meters; Y up. Top-level model root is at its floor pivot.
- Cow forward direction: +X. Approximate height 1.71 m and nose-to-tail length 2.87 m; exact bounds are in the manifest. Hooves touch y=0 within a small authored tolerance. The floor pivot, limb animation pivots and nominal occupancy remain unchanged after the close-up refinement.
- Barn front: +Z, nominal entrance z=+4; ridge y~4.7. Eave overhangs extend beyond the nominal 10 x 8 placement footprint; the manifest records full rendered bounds.
- Barn nodes: `roof`, `walls`, `frame`, `floor`, `stalls`, `equipment`. The `roof` group carries a `cameraCutaway` extra. Materials shared with other barn parts must be cloned before changing roof opacity.
- Cow articulation nodes: `head`, `tail`, `ear_left`, `ear_right`, `leg_front_left`, `leg_front_right`, `leg_rear_left`, `leg_rear_right`.
- Cow clips: `idle` (5 s), `walk` (1.2 s), `eat` (4 s). They animate node rotations and can be played with the normal glTF/Three animation mixer.
- Crop templates: `lettuce_0` through `lettuce_3`, `tomato_0` through `tomato_3`, and `corn_0` through `corn_4`.
- Vegetation templates: `banana`, `palm`, `grass`, `shrub`.
- Prop templates: `feed_trough`, `water_trough`, `milk_pail`, `crate`, `feed_bag`, `pump`, `rock`.
- Crop/vegetation/prop GLBs are template libraries: named children intentionally overlap at origin. Clone the selected child rather than rendering the entire library scene.

## Reproduction and validation

From the repository root:

```text
node tools/art/glb-prototype-build.mjs
node tools/art/glb-prototype-validate.mjs
```

The authoring build writes only its owned model directory and manifest. Resource validation checks GLB magic/version/chunk lengths, buffer alignment and bounds, finite accessor values, index ranges, material/texture references, embedded PNG signatures, and animation target/accessor correspondence. Its ignored receipt is `qa-artifacts/glb-upgrade/assets/resource-validation.json`.

This bounded validator is not a substitute for the complete Khronos validator. Full extension/skin conformance is not claimed; these exports use core glTF features without extension dependencies. Visual quality and runtime semantics require actual in-game review.

## Close-up refinement after browser capture

The initial real `desktop-id-cow-close.png` and `desktop-id-interior.png` captures exposed square hoof blocks, cylindrical limbs/round knee bands, an oversized muzzle, long horns, and directional stripe patterns in the bedding. The revised authored model replaces those parts with tapered front limbs, naturally offset rear hocks/fetlocks, rounded beveled cloven hoof halves with an actual gap, a continuous withers/hip contour, a thinner rising neck/dewlap, a narrower muzzle, smaller eyes and nostrils, short horn buds, and individual tapered tail fibers. Named animation targets and clips remain available.

Grass/soil/hardwood now use layered smoothly varying noise and fine nonuniform detail. Rice-straw bedding uses scattered short fiber segments with varied position, angle, length, and width. The source textures were opened and inspected as exported PNGs; they no longer contain the original long regular stripe construction. Renderer lighting/tint and the revised cow appearance still require the parent-owned in-game follow-up capture; no full realism or artist-quality certification is claimed.
