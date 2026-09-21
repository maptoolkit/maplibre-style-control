---
"@maptoolkit/maplibre-style-control": minor
---

Drop the UMD/CJS build — the package is now ESM-only, and the
`maplibre-gl` peer dependency now requires `>=6.0.0`.

`maplibre-gl` v6 dropped its own UMD and CommonJS builds, and this package
has only ever been developed and tested against v6. The UMD build's
`globals: { "maplibre-gl": "maplibregl" }` and the CJS `require()` export
never worked in practice, since `maplibre-gl` itself had nothing for them to
resolve to. This just removes the dead build output and tightens the peer
range to reflect what was already true.

If you're loading this via a `<script>` tag without a bundler, resolve
`maplibre-gl` via an import map instead — see the README.
