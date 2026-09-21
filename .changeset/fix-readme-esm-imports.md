---
"@maptoolkit/maplibre-style-control": patch
---

Fix the `maplibre-gl` import in the README examples — it has no default
export, so `import maplibregl from "maplibre-gl"` doesn't work. Use
`import * as maplibregl from "maplibre-gl"` instead. Also document how to use
the package without a bundler via an import map, per the note in the 1.1.0
changelog entry. No code changes.
