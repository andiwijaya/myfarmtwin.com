# Native Cow atlas and accepted milking - M4-F05

7 November 2026: **41/82 = 50.0%.** Original rounded low-poly dairy rig,
shared palette/lighting/projection and96 RGBA frame cells per LOD now replace
loaded Cow primitives. High4096x1536 is767,969 bytes; Low2048x768 is289,033.
Both atlases regenerate byte-for-byte, including metadata and CSP-safe bindings;
every rendered frame has a nonempty silhouette and transparent two-pixel border.

The existing Cow snapshot selects idle/walk/feed/drink/rest, including its native
resource/comfort gates and lactation stage. Idle/feed has restrained jaw motion.
Only an accepted positive `cowMilked` domain event addresses the actual stable
Cow ID and starts its short milk pose; selection, failed commands and reload
do not manufacture milk or events. Save replacement clears transient effects.
Shared-controller station routing and final transition/shadow/touch-size review
remain M4-F08/F09; this is not the final animation quality gate.

Validation: **439/439 unit PASS**, lint/typecheck/build, seven frozen V0-V5
saves, all24 original media plus six declared/hashed atlas PNGs, build receipts,
MIT and source provenance PASS. Default core478,386 bytes. Eight EN/ID,
desktop390px-touch-emulation/1440px, WebGL/Canvas journeys PASS:328 accepted
native commands,32 actual opaque-pixel sprite picks across four headings,
all six Cow actions observed, positive accepted milking cues, original
production32,694mL, collected15,420mL, final coins1,026 on every profile.
Third paid Cow starts with zero milk; double milking/sale accepts once;
movement/cooling/delivery/upgrades conserve original lots. Entire serialized
five-area engine/ledger matches after every command and reload. One clock,
Scene/camera and live canvas persist. No schema or engine edit.

Evidence (ignored, outside production files):
`qa-artifacts/unified-m4-cow/cow-sprites.json`, four-heading/native-milking
screenshots, `qa-artifacts/unified-m4-cow-atlas/{generate,regenerate}.json`,
`qa-artifacts/unified-m1/m4-cow-unit.log`. Actual atlas and mobile gameplay
captures were opened for review. Physical Android/iOS/Safari remain untested;
loading/performance and final animation review are still pending gates.
No push or deployment; release authorization remains absent.
