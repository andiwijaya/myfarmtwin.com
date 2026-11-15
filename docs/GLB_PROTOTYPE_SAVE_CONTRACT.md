# GLB prototype: native save and placement contract

Date: 15 November 2026. Scope: the P0-P2 garden and cow prototype.

## Decision

The prototype uses the existing V6 native engine and canonical save key. It does not fork an economy, change native schemas, fabricate crop yields, or reset a player's other areas. A separate layout sidecar holds presentation transforms. This gives the original game and prototype the same wallet, crop lots, animals, production accounting, revisions, and native import/export format.

`game/client/glb-prototype-state.js` owns the adapter. Existing engine, config, storage, schema, and fixtures remain unchanged.

## Public API

```js
const session = new PrototypeSession(storage, {writable: writeLockAvailable()});
// Or createPrototypeSession(storage, options).

session.state;                    // Complete native V6 State, including all areas.
session.layout;                   // Validated presentation-only placement data.
session.status;                   // Native save/resume/recovery status.
session.layoutStatus;             // Layout status.
session.readOnly;                 // Blocks all mutations when data/capability is unsafe.

session.command('plant', {plot: 0, crop: 'lettuce'});
session.command('water', {plot: 0});
session.advance(6);               // 1-24 actual native hours; restores prior pause state.
session.command('harvest', {plot: 0});
session.command('sell', {lot: lotId});
session.command('cleanCowStand');
session.command('milkCow', {cowId, cowStorage: 'can'});
session.command('sellCowMilk', {
  cowLots: ids, cowOrder: '', cowQuote: cowSaleQuote(session.state, ids)
});

session.previewPlacement({id, kind, x, z, rotation}); // Error code or ''. No writes.
session.move(id, {x, z, rotation});
session.build(kind, {x, z, rotation});
session.remove(id);              // Free decorative kit pieces only.

session.exportNative();         // Existing compatible native JSON text.
session.exportBundle();         // Native JSON plus full placement data.
session.importNative(text);     // Explicit replacement; root UI confirms first.
session.importBundle(text);     // Explicit replacement; root UI confirms first.
session.recoverPending();       // Finish a previously durable requested operation.
```

Every mutating call returns `{ok, error, events, id?}`. UI code must wrap each mutating call in the existing `withSaveLock()`; the lock name is shared with the original game. It must not mutate `.state` or `.layout` directly, dispatch `select` just to move a camera, or create a second authoritative clock. The adapter does not start an interval.

## Scene and placement data

Coordinates are metres, Y up. A transform is `{x, z, rotation}` with rotation in radians. All 24 beds are present from the first read; native plot coordinates remain untouched.

| Kind | Identity/initial transform | Footprint | Ownership and cost |
| --- | --- | --- | --- |
| bed | `bed.0` to `bed.23`; six columns/four rows: `x=-15+col*2`, `z=-7.5+row*2.4` | 1.5 x 1.8 | All 24 already owned, free to move. |
| barn | `barn`, `(7,-4)`, rotation 0 | 10 x 8 | Anchor always reserved; native `enterCow` must be explicitly confirmed before the initial two cows/facilities are granted. Native starter is free. |
| pump | `pump`, `(-3,3.5)`, rotation 0 | 1 x 1 | Native `buyPump` charges 60 and retains its sold-first requirement. |
| path | `path.N` | 2 x 2 | Bounded free layout kit, 40 pieces. |
| fence | `fence.N` | 2 x 0.16 | Bounded free layout kit, 40 pieces. |
| tree | `tree.N` | 2.2 x 2.2 | Bounded free layout kit, 8 pieces. |
| banana | `banana.N` | 1.8 x 1.8 | Bounded free layout kit, 8 pieces. |
| grass | `grass.N` | 0.7 x 0.7 | Bounded free layout kit, 24 pieces. |

Owned land is `x=-22..22`, `z=-18..18`. Placement validates the complete rotated footprint using oriented rectangle separation axes, land bounds, unique stable IDs, required native entities, and kit limits. Touching edges are allowed. Native barn/pump anchors stay reserved before ownership, preventing a later activation from colliding with kit decorations.

The free kit must be described as a free bounded kit in product UI, not a paid shop or another currency. P3 may introduce new native construction economics with a deliberate schema/economy decision. The P2 real paid building demonstration is the native pump purchase and native cow facility upgrades; moves never charge or create stock.

## Persistence and preservation

| Key | Purpose |
| --- | --- |
| `myfarmtwin.save.v1` | Existing canonical native save, unchanged V6 envelope. |
| `myfarmtwin.glb.layout.v1` | Strict versioned placement sidecar. |
| `myfarmtwin.glb.layout.backup.v1` | Previous layout bytes. |
| `myfarmtwin.save.before-glb-prototype.v1` | Earliest native source bytes before a prototype mutation/replacement. |
| `myfarmtwin.glb.layout.before-import.v1` | Original sidecar before a paired replacement. |
| `myfarmtwin.glb.transaction.v1` | Durable before/after images for native-plus-layout operations. |

Opening, viewing, camera changes, placement previews, and exports perform no writes. Legacy V0-V5 sources are deserialized and expanded to 24 active beds in memory; source bytes and applicable existing migration archives are preserved before the first accepted write. A fresh visitor's native save is created only after a real accepted command.

All changes preflight the exact native, layout, and pending-transaction bytes. If another tab writes either native progress or placement, the stale session becomes read-only and requests a reload. It does not merge guesses or overwrite newer data.

Native-only commands retain `SaveSession.save()` backup and conflict behavior. Layout-only moves/build-kit changes write the previous layout to its backup before replacing it; storage failure keeps in-memory and canonical progress unchanged.

## Paired operations and interruption

Importing a bundle or building a native facility at a selected transform writes a durable journal before the two data keys change. The journal contains strictly validated native/layout postimages and their exact preimages. Original source archives precede replacement.

If interrupted after one data key changes, the result is `saveImportPending`. The journal remains. On reload the constructor only reads the intended postimage and exposes the pending status; it performs no repair writes. `recoverPending()` or the next explicit mutation finishes that already requested transaction without replaying commands, costs, or starter grants. If a data key differs from both journal pre/postimages, recovery blocks as `saveConflict` and retains all evidence. It must not silently drop the journal in that case.

If storage is full even for the journal or archive, no purchase/replacement is started. If full after the native key changes, the native purchase remains recorded and recovery finishes its intended placement after storage becomes usable. This is crash recovery across localStorage keys, not a claim that localStorage supports database transactions.

Corrupt/newer native data, corrupt/newer sidecars, malformed pending journals, and unsupported browser write-lock capability block mutations. Valid native data remains visible where possible; no source is reset to a fresh farm. Native and layout statuses are independent: malformed layout JSON reports `layoutInvalid` while the valid native save can remain `saveResumed`; newer layout reports `layoutNewer`. Storage access failure reports `saveUnavailable`. A malformed transaction reports `saveImportPending` and remains preserved/read-only. UI notices should use the invalid layout status when applicable. Recovery of a corrupt native primary through its existing backup remains available in the original game's data tools.

## Import/export and validation

The bundle format is `{format:'MyFarmTwinGLBPrototype',version:1,native:<native JSON string>,layout:<layout object>}`. The native member uses the existing strict `deserialize/serialize` boundary; layout checks keys, IDs, counts, coordinates, rotations, overlap, and bounds. Extra fields, unsupported versions, oversized payloads, missing beds, and invalid data reject before writing archives or backups.

UI code owns explicit replacement confirmation. Tests operate on JSON text and synthetic stores; no browser download, upload, or personal save is required. Physical file-download behavior is a separate check and can stay skipped under the owner's testing constraint.

## Validation performed for this module

`node --test game/tests/glb-prototype-state.test.mjs`: 21/21 pass.

The cases cover read-only opening, frozen V0-V5 fixtures, full-state preservation on placement, rotated footprints/bounds, authored 2 x 2 metre path boundaries, strict sidecar validation, independent corruption/unavailable/journal statuses, corrupt/future data, actual garden production and paid pump purchase, native time equivalence, native cow care/milking/quoted sale, no duplicate starters, bounded/free kit accounting, native/layout cross-tab conflicts, quota failures, bundle roundtrip and rejection, interrupted paired writes/recovery, unrelated-write recovery blocking, and unavailable write capability.

Strict `tsc -p jsconfig.json` passed after this module was added. These are domain/storage checks; browser interaction, actual renderer, physical devices, deployment, and live integrity remain the owner agent's separate work.
