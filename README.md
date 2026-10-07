# maplibre-style-control

[![NPM](https://img.shields.io/npm/v/@maptoolkit/maplibre-style-control?style=for-the-badge&logo=npm&logoColor=white&labelColor=CB3837&color=555)](https://www.npmjs.com/package/@maptoolkit/maplibre-style-control)
[![License](https://img.shields.io/npm/l/@maptoolkit/maplibre-style-control?style=for-the-badge)](https://github.com/maptoolkit/maplibre-style-control/blob/HEAD/LICENSE)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/maptoolkit/maplibre-style-control)

A [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) control plugin to switch between different styles.

**[Live demo](https://maptoolkit.github.io/maplibre-style-control/)**

## Install

```bash
npm install @maptoolkit/maplibre-style-control maplibre-gl
```

Built and tested against `maplibre-gl` v6.

## Usage

```js
import * as maplibregl from "maplibre-gl";
import { StyleControl } from "@maptoolkit/maplibre-style-control";
import "@maptoolkit/maplibre-style-control/style.css";

const map = new maplibregl.Map({ container: "map", style, center, zoom });
map.addControl(new StyleControl());
```

### Without a bundler

The package is ESM-only (no UMD/CJS build). Loading it straight from a CDN via
a `<script>` tag works with an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap)
to resolve the bare `maplibre-gl` specifier:

```html
<link href="https://unpkg.com/maplibre-gl@^6.0.0/dist/maplibre-gl.css" rel="stylesheet" />
<link href="https://unpkg.com/@maptoolkit/maplibre-style-control@^1.1.0/dist/maplibre-style-control.css" rel="stylesheet" />

<script type="importmap">
  {
    "imports": {
      "maplibre-gl": "https://unpkg.com/maplibre-gl@^6.0.0/dist/maplibre-gl.mjs"
    }
  }
</script>
<script type="module">
  import * as maplibregl from "maplibre-gl";
  import { StyleControl } from "https://unpkg.com/@maptoolkit/maplibre-style-control@^1.1.0/dist/maplibre-style-control.js";

  const map = new maplibregl.Map({ container: "map", style, center, zoom });
  map.addControl(new StyleControl());
</script>
```

## Options

```ts
new StyleControl({
  styles: [{ id: "Summer", value: "https://styles.maptoolkit.org/summer.json", image: "..." }],
  active: "Summer",
});
```

| Option   | Type                      | Default                         | Description                            |
| -------- | ------------------------- | ------------------------------- | -------------------------------------- |
| `styles` | `StyleDefSpecification[]` | the 7 default maptoolkit styles | Styles shown in the control.           |
| `active` | `string`                  | `"Summer"`                      | `id` of the style selected by default. |

`StyleDefSpecification`:

| Field   | Type                           | Description                           |
| ------- | ------------------------------ | ------------------------------------- |
| `id`    | `string`                       | Unique id, also used as the i18n key. |
| `value` | `string \| StyleSpecification` | Style URL or an inline style spec.    |
| `image` | `string?`                      | Thumbnail shown for the style.        |

The built-in styles are exported as `defaultStyleControlOptions`, so you can extend rather than replace them:

```js
import { StyleControl, defaultStyleControlOptions } from "@maptoolkit/maplibre-style-control";

new StyleControl({
  styles: [...defaultStyleControlOptions.styles, { id: "Custom", value: "..." }],
});
```

### Localization

UI strings are read from the map's `locale` option, using the same table as MapLibre's built-in controls. Each style's label comes from `StyleControl.Style.<id>`, and the group heading comes from `StyleControl.Group.Styles`. The built-in styles and groups ship with English defaults, and any key you pass overrides them. A custom style without a matching key falls back to its `id` (a `Missing UI string` warning is logged):

```js
const map = new maplibregl.Map({
  container: "map",
  style,
  center,
  zoom,
  locale: {
    "StyleControl.Group.Styles": "Styles",
    "StyleControl.Style.Summer": "Summer",
    "StyleControl.Style.Custom": "My Style",
  },
});
```

## Events

The control extends MapLibre's `Evented`, so you can subscribe like you would on the map itself:

```js
const control = new StyleControl();
control.on("style.set", (e) => console.log(e.style.id));
```

| Event       | Payload                            | Fired when...             |
| ----------- | ---------------------------------- | ------------------------- |
| `style.set` | `{ style: StyleDefSpecification }` | the active style changes. |

## Methods

```js
const control = new StyleControl();
map.addControl(control);

control.setStyle("Winter");
control.open();
control.close();
```

| Method              | Description                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setStyle(styleId)` | Switches to the style with the given `id`, same as clicking it in the UI. Fires `style.set`. Only available once the control has been added to a map via `map.addControl()` — it's `undefined` before that. |
| `open()`            | Opens the style panel.                                                                                                                           |
| `close()`           | Closes the style panel.                                                                                                                           |

## Styling

Appearance is controlled via CSS custom properties on `.maplibre-style-control`, defined in `style.css`. Override them in your own stylesheet to theme the control:

```css
.maplibre-style-control {
  --style-control-radius: 4px;
  --style-control-color-primary: #0074d9;
}
```

See `src/style.css` for the full list of `--style-control-*` variables.

## License

**maplibre-style-control** is open-source under the [BSD 3-Clause License](https://github.com/maptoolkit/maplibre-style-control/blob/HEAD/LICENSE).
