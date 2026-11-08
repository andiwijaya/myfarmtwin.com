# M7-F04 — renderer, visibility and UI lifecycle

The world shell now owns an abortable listener scope and ResizeObserver. Its idempotent `dispose()` restores the original live DOM nodes and attributes, releases tools, removes generated sheets/navigation and restores body layout. Construction is transactional: partial setup restores native UI before rethrowing. The main preview failure path disposes both shell and renderer before returning to the classic map. Original gameplay handlers and save storage are retained.

Verified local evidence:

- `qa-artifacts/unified-m7-context-final/context.json`: 4/4 desktop/touch-emulated EN/ID profiles inject the actual `WEBGL_lose_context` extension on their temporary canvas. Fallback accepts an original harvest with exact native save/ledger, camera survives retry and three Low/High cycles, one clock/canvas, invalid preference and reload passed. A real regression placed Retry beneath the care sheet; Retry now lives in Camera tools and is reached through visible disclosure clicks.
- `qa-artifacts/unified-m7-shell-lifecycle-final/shell-lifecycle.json`: 20 remount/dispose cycles across desktop/touch plus two injected constructor failures. Native node identities and sibling order restored, all owned signals aborted, observers released, no residual sheets, and original classic harvest/Market work with exact save and one clock.
- `qa-artifacts/unified-m7-visibility/visibility.json`: 4/4 WebGL/Canvas desktop/touch profiles run two or more real three-second native interval ticks, verify the original hidden-tab pause handler, resize, reduced-motion stop/resume, Low static frames and actual CDP frozen/active lifecycle. Entire engine state remains exact. `document.hidden` is explicitly simulated; freezing uses the actual browser lifecycle API. No physical background-tab, thermal or device claim.
- `qa-artifacts/unified-m7-texture-cap/texture-cap.json`: desktop/touch 2048px GPU-limit simulation selects fitting existing atlas LODs and preserves camera/save through graphics round trips.
- `qa-artifacts/unified-m7-renderer-lifecycle/lifecycle.json`: dispose before context creation, dispose while driver is pending and repeated quality races release every acquired real WebGL context; no pending RAF/startup callback or duplicate live context.
- The prior 18-profile input suite includes both WebGL/Canvas absent: the HTML object interface still accepts native gameplay. This is capability simulation, not a graphical hardware claim. Current typecheck/build, editorial/media/bundle audit and frozen-domain/seven-save audit passed.

Physical Android/iOS, Safari and low-memory hardware are unavailable. Context loss and texture limits are test injections, not fabricated hardware tests. Hidden preview/rollback remain; no push/deploy.
