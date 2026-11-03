# ADR 001 — buildless isometric sub-app

Status: accepted after M0 repository/production audit, 3 November 2026.

## Decision

Use modern JavaScript ES modules with JSDoc/checkJs for the game, Node's built-in test runner, and a local copy-only build. Render a low-poly isometric 8×8 farm with SVG polygons and native HTML controls. SVG is supported without WebGL and scales to touch/mobile while preserving keyboard controls. The PRD permits a 3D/isometric world and leaves technology to the audit; Three.js/Vite are recommendations. For this small fixed scene, a 3D renderer would add download and context-loss failure modes without improving the required crop/care/market loop.

Runtime dependencies: zero. Development only: TypeScript for checking typed commands/state; Playwright for repeatable local browser checks. No framework, backend, login, third-party game script, new telemetry, Actions or paid services.

Engine owns state; validated commands return new snapshots and domain events. Fixed one-hour logical ticks, seeded weather, integer Coin ledger, bounded mm water balance, idempotent command IDs. UI translates labels and sends commands; renderer never owns economy/agronomy. Storage adapter validates versioned saves and preserves corrupt originals.

## Budgets and compatibility

- Initial game JS+CSS+HTML target <150 KB uncompressed, no game asset download except approved FarmGirl thumbnail. Existing full FarmGirl PNG is reused initially and measured; make a compact derivative only if justified, preserve original.
- ≤64 ground tiles, ≤8 active crop beds; redraw only on command/tick. Small CSS animation honors reduced motion. Low mode removes decoration/motion; interactive plot list always available.
- Latest installed Chromium desktop, mobile touch emulation, Firefox when available; no claim of physical Android testing. Target ≥50 desktop FPS / ≥30 medium Android. Measure browser frame timing locally; record hardware and emulation limitations explicitly.
- Native buttons ≥44 px, keyboard/focus, text alongside icons, readable high-contrast HUD, no hover-only information, no automatic destructive storage reset.
- EN homepage remains EN. Game locale saved preference → browser language → EN. No change to audience, nameservers, analytics or existing editorial content.

## Trade-offs

No perspective camera or walking avatar. Pan/zoom/reset manipulate the isometric map. This matches the fixed-farm scope and provides a usable fallback on low-power devices. A future Three.js renderer can consume the same engine snapshot without migrating game rules or saves.
