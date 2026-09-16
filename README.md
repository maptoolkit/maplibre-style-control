# maplibre-style-control

A [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) control plugin to switch between different styles.

## Install

```bash
npm install @maptoolkit/maplibre-style-control maplibre-gl
```

## Usage

```js
import maplibregl from "maplibre-gl";
import { StyleControl } from "@maptoolkit/maplibre-style-control";
import "@maptoolkit/maplibre-style-control/style.css";

const map = new maplibregl.Map({ container: "map", style, center, zoom });
map.addControl(new StyleControl());
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

## Events

The control extends MapLibre's `Evented`, so you can subscribe like you would on the map itself:

```js
const control = new StyleControl();
control.on("style.set", (e) => console.log(e.style.id));
```

| Event       | Payload                            | Fired when...             |
| ----------- | ---------------------------------- | ------------------------- |
| `style.set` | `{ style: StyleDefSpecification }` | the active style changes. |

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

**maplibre-style-control** is open-source under the [BSD 3-Clause License](LICENSE).
