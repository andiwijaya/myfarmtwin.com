# Isolated build and rollback

`node tools/build.mjs` copies approved web-file extensions from `game/client` into `dist/play` only. It does not delete directories, process editorial HTML, or clean dist. Source symlinks are rejected. The integration test builds twice into a temporary fixture, confirming byte-identical homepage, shared styles and category content. This test runs before a real game source is introduced.

Before release, hash all editorial assets and compare against the M0 baseline, allowing only explicitly reviewed homepage/nav/sitemap/canonical changes. Rollback is a Git revert of the release commit followed by the same audited deployment route. Preserve browser saves; do not remove storage during deployment. Never change nameservers or audience.
