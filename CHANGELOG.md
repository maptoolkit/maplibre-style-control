# @maptoolkit/maplibre-style-control

## 1.1.1

### Patch Changes

- 1079efe: Fix the `maplibre-gl` import in the README examples — it has no default
  export, so `import maplibregl from "maplibre-gl"` doesn't work. Use
  `import * as maplibregl from "maplibre-gl"` instead. Also document how to use
  the package without a bundler via an import map, per the note in the 1.1.0
  changelog entry. No code changes.

## 1.1.0

### Minor Changes

- a6cb96c: Drop the UMD/CJS build — the package is now ESM-only, and the
  `maplibre-gl` peer dependency now requires `>=6.0.0`.

  `maplibre-gl` v6 dropped its own UMD and CommonJS builds, and this package
  has only ever been developed and tested against v6. The UMD build's
  `globals: { "maplibre-gl": "maplibregl" }` and the CJS `require()` export
  never worked in practice, since `maplibre-gl` itself had nothing for them to
  resolve to. This just removes the dead build output and tightens the peer
  range to reflect what was already true.

  If you're loading this via a `<script>` tag without a bundler, resolve
  `maplibre-gl` via an import map instead — see the README.

## 1.0.2

### Patch Changes

- f3c9e0d: Add a live demo link to the README. No code changes.

## 1.0.1

### Patch Changes

- 35c844a: Add `repository`, `homepage`, and `bugs` fields so the npm package page links back to the GitHub repo.

## 1.0.0

### Major Changes

- 8d7aa16: First stable release, published under the `@maptoolkit` npm scope.
