import { Map, IControl, ControlPosition, StyleSpecification, Evented, Event as MapLibreEvent } from "maplibre-gl";

/**
 * Options for configuring the {@link StyleControl}.
 */
export type StyleControlOptions = {
  styles?: Array<StyleDefSpecification>;
  active?: string;
};

/**
 * A style definition for use with the {@link StyleControl}.
 */
export type StyleDefSpecification = {
  id: string;
  value: string | StyleSpecification;
  image?: string;
};

type StyleGroupClickEvent = {
  originalEvent: MouseEvent;
  style: StyleDefSpecification;
};

type CreateGroupOptions = {
  id: string;
  styles: StyleDefSpecification[];
  onClick: (event: StyleGroupClickEvent) => void;
  isCollapsed?: boolean;
};

/**
 * Fired via `control.on("style.set", ...)` whenever the active style changes.
 */
type StyleControlEventType = {
  "style.set": MapLibreEvent<"style.set"> & { style: StyleDefSpecification };
};

// `_locale`/`_getUIString` are undocumented on Map; cast here so `StyleControl.*`
// keys work with the same `new Map({ locale })` table as built-in controls.
function getMapLocale(map: Map): Record<string, string> {
  return (map as unknown as { _locale: Record<string, string> })._locale;
}

function getUIString(map: Map, key: string): string {
  return (map as unknown as { _getUIString(key: string): string })._getUIString(key);
}

export const defaultStyleControlOptions: StyleControlOptions = {
  styles: [
    { id: "Summer", value: "https://styles.maptoolkit.org/summer.json", image: "https://styles.maptoolkit.org/summer.webp" },
    { id: "Winter", value: "https://styles.maptoolkit.org/winter.json", image: "https://styles.maptoolkit.org/winter.webp" },
    { id: "Light", value: "https://styles.maptoolkit.org/light.json", image: "https://styles.maptoolkit.org/light.webp" },
    { id: "Dark", value: "https://styles.maptoolkit.org/dark.json", image: "https://styles.maptoolkit.org/dark.webp" },
    { id: "Cycling", value: "https://styles.maptoolkit.org/cycling.json", image: "https://styles.maptoolkit.org/cycling.webp" },
    { id: "Hiking", value: "https://styles.maptoolkit.org/hiking.json", image: "https://styles.maptoolkit.org/hiking.webp" },
    { id: "Street", value: "https://styles.maptoolkit.org/street.json", image: "https://styles.maptoolkit.org/street.webp" },
  ],
  active: "Summer",
};

/**
 * Provides a style switcher control for the map.
 */
export class StyleControl extends Evented<StyleControlEventType> implements IControl {
  options: StyleControlOptions;
  /**
   * Switches to the style with the given id. Only set once the control has been added to a map.
   */
  setStyle?: (styleId: string) => void;
  private _map?: Map;
  private _container?: HTMLElement;
  private _groups?: HTMLElement;
  private _currentStyleId: null | string;

  constructor(options?: StyleControlOptions) {
    super();
    this._currentStyleId = null;
    this.options = Object.assign({}, defaultStyleControlOptions, options);
  }

  getDefaultPosition(): ControlPosition {
    return "bottom-left";
  }

  onAdd(map: Map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group", "maplibre-style-control", "maplibre-style-control-bottom-left");

    // style-groups
    this._groups = document.createElement("div");
    this._groups.classList.add("maplibregl-ctrl-group", "maplibre-style-control-groups");

    const locale = getMapLocale(map);
    locale["StyleControl.Group.Styles"] ??= "Styles";
    locale["StyleControl.Group.Layers"] ??= "Overlays";
    locale["StyleControl.Style.Summer"] ??= "Summer";
    locale["StyleControl.Style.Winter"] ??= "Winter";
    locale["StyleControl.Style.Light"] ??= "Light";
    locale["StyleControl.Style.Dark"] ??= "Dark";
    locale["StyleControl.Style.Cycling"] ??= "Cycling";
    locale["StyleControl.Style.Hiking"] ??= "Hiking";
    locale["StyleControl.Style.Street"] ??= "Street";

    this.setStyle = function (styleId: string) {
      if (this.options.styles) {
        for (const style of this.options.styles) {
          if (style.id === styleId) {
            this._currentStyleId = style.id;
            this._map?.setStyle(style.value);

            // update active style image
            $styleImage.style.removeProperty("background-image");
            if (style.image) $styleImage.style.setProperty("background-image", `url(${style.image})`);
            $styleName.textContent = getUIString(map, `StyleControl.Style.${style.id}`) || style.id;

            // update active style highlighting
            const $styleGroupItems = this._groups?.querySelectorAll<HTMLLIElement>("li[data-style]");
            $styleGroupItems?.forEach(($li) => {
              if ($li.dataset.style === style.id) $li.classList.add("maplibre-style-control-group-list-item-active");
              else $li.classList.remove("maplibre-style-control-group-list-item-active");
            });

            this.fire("style.set", { style });
          }
        }
      }
    };

    // close button
    const $closeButton = document.createElement("button");
    $closeButton.classList.add("maplibre-style-control-close");
    $closeButton.addEventListener("click", () => this.close());
    this._groups.appendChild($closeButton);

    // control button - display current style
    const $styleButton = document.createElement("button");
    $styleButton.classList.add("maplibre-style-control-current");

    const $styleImage = document.createElement("div");
    $styleImage.classList.add("maplibre-style-control-current-image");
    $styleButton.appendChild($styleImage);

    const $styleName = document.createElement("label");
    $styleName.classList.add("maplibre-style-control-current-name");
    $styleButton.appendChild($styleName);

    const _createGroup = ({ id, styles, onClick, isCollapsed }: CreateGroupOptions) => {
      const $group = document.createElement("div");
      $group.classList.add("maplibre-style-control-group");
      if (isCollapsed) $group.classList.add("maplibre-style-control-group-collapsed");

      const $groupName = document.createElement("h2");
      $groupName.classList.add("maplibre-style-control-group-name");
      $groupName.textContent = getUIString(map, `StyleControl.Group.${id}`) || id;
      $group.appendChild($groupName);

      const $groupList = document.createElement("ul");
      $groupList.classList.add("maplibre-style-control-group-list");
      styles.forEach((groupStyle) => {
        const $groupItem = document.createElement("li");
        $groupItem.classList.add("maplibre-style-control-group-list-item");
        $groupItem.dataset.style = groupStyle.id;

        const $groupItemButton = document.createElement("button");

        const $groupItemImage = document.createElement("div");
        $groupItemImage.classList.add("maplibre-style-control-group-list-item-image");
        if (groupStyle.image) $groupItemImage.style.setProperty("background-image", `url(${groupStyle.image})`);
        $groupItemButton.appendChild($groupItemImage);

        const $groupItemName = document.createElement("label");
        $groupItemName.classList.add("maplibre-style-control-group-list-item-name");
        $groupItemName.textContent = getUIString(map, `StyleControl.Style.${groupStyle.id}`) || groupStyle.id;
        $groupItemButton.appendChild($groupItemName);

        $groupItemButton.addEventListener("click", (ev) => {
          onClick({ originalEvent: ev, style: groupStyle });
        });

        $groupItem.appendChild($groupItemButton);
        $groupList.appendChild($groupItem);
      });
      $group.appendChild($groupList);
      return $group;
    };

    // styles group
    const $group = _createGroup({
      id: "Styles",
      styles: this.options.styles ?? [],
      onClick: (ev) => {
        if (ev.style) {
          if (this._map && ev.style.value && this._currentStyleId !== ev.style.id) {
            this.setStyle?.(ev.style.id);
          }
        }
      },
    });
    this._groups.appendChild($group);

    // expand button
    const $expandButton = document.createElement("button");
    $expandButton.classList.add("maplibre-style-control-expand");
    $expandButton.textContent = getUIString(map, "StyleControl.Group.Layers");
    $expandButton.addEventListener("click", () => {
      $group.classList.remove("maplibre-style-control-group-collapsed");
      if (this._resize) this._resize();
    });
    this._groups.appendChild($expandButton);

    // control button - click handler
    $styleButton.addEventListener("click", () => {
      if (this._groups?.classList.contains("maplibre-style-control-groups-active")) {
        this.close();
      } else {
        this.open();
      }
    });

    this._resize();
    this._map.on("resize", this._resize);

    this._container.appendChild($styleButton);
    this._container.appendChild(this._groups);

    if (this.options.active) {
      const activeId = this.options.active;
      if (map.isStyleLoaded() === false) {
        // avoid racing the map's initial style load (would log a "style diff" warning)
        map.once("style.load", () => {
          if (this._map === map) this.setStyle?.(activeId);
        });
      } else {
        this.setStyle(activeId);
      }
    }

    return this._container;
  }

  onRemove() {
    this._map?.off("resize", this._resize);
    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }

  open() {
    if (this._groups) {
      this._groups.classList.add("maplibre-style-control-groups-active");
      if (this._container && this._container.parentElement) {
        this._container.classList.add("maplibre-style-control-active");
        this._container.parentElement.style.zIndex = "99";
      }
      if (this._resize) {
        this._resize();
      }
    }
  }

  close() {
    if (this._groups) {
      this._groups.classList.remove("maplibre-style-control-groups-active");
      if (this._container && this._container.parentElement) {
        this._container.classList.remove("maplibre-style-control-active");
        this._container.parentElement.style.zIndex = "";
      }
    }
  }

  // set max-width and max-height for mobile compatibility on window resize
  private _resize = () => {
    if (this._map && this._container) {
      const mapRect = this._map.getContainer().getBoundingClientRect();
      const ctrlRect = this._container.getBoundingClientRect();
      const ctrlPosition = {
        top: ctrlRect.top - mapRect.top,
        bottom: mapRect.bottom - ctrlRect.bottom,
        left: ctrlRect.left - mapRect.left,
        right: mapRect.right - ctrlRect.right,
      };
      const ctrlStyle = window.getComputedStyle(this._container);
      let maxWidth = mapRect.width;
      let maxHeight = mapRect.height;
      for (const position in this._map._controlPositions) {
        if (this._map._controlPositions[position as ControlPosition]?.contains(this._container)) {
          // accounts for sibling controls stacked in the same corner
          if (/^top/.test(position)) maxHeight -= ctrlPosition.top + parseFloat(ctrlStyle.marginTop);
          if (/^bottom/.test(position)) maxHeight -= ctrlPosition.bottom + parseFloat(ctrlStyle.marginBottom);
          if (/left$/.test(position)) maxWidth -= ctrlPosition.left + parseFloat(ctrlStyle.marginLeft);
          if (/right$/.test(position)) maxWidth -= ctrlPosition.right + parseFloat(ctrlStyle.marginRight);
          break;
        }
      }
      // on desktop the panel sits beside the button (style.css), so exclude its width
      if (!window.matchMedia("only screen and (max-width: 768px)").matches) maxWidth -= ctrlRect.width;
      if (this._groups) {
        this._groups.style.setProperty("max-width", `${maxWidth}px`);
        this._groups.style.setProperty("max-height", `${maxHeight}px`);
      }
    }
  };
}
