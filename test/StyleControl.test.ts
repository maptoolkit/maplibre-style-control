import { describe, expect, it, vi } from "vitest";
import type { Map as MaplibreMap } from "maplibre-gl";
import { StyleControl } from "../src/StyleControl";

function createMockMap(options: { styleLoaded?: boolean } = {}): MaplibreMap {
  const container = document.createElement("div");
  const locale: Record<string, string> = {};
  const loadListeners: Array<() => void> = [];
  return {
    on: () => {},
    off: () => {},
    once: (event: string, listener: () => void) => {
      if (event === "style.load") loadListeners.push(listener);
    },
    getContainer: () => container,
    setStyle: () => {},
    isStyleLoaded: () => options.styleLoaded ?? true,
    _controlPositions: {},
    _locale: locale,
    _getUIString: (key: string) => {
      const value = locale[key];
      if (value == null) throw new Error(`Missing UI string '${key}'`);
      return value;
    },
    _fireStyleLoad: () => loadListeners.forEach((listener) => listener()),
  } as unknown as MaplibreMap & { _fireStyleLoad: () => void };
}

describe("StyleControl", () => {
  it("creates a container element on add", () => {
    const control = new StyleControl();
    const container = control.onAdd(createMockMap());

    expect(container).toBeInstanceOf(HTMLElement);
    expect(container.classList.contains("maplibregl-ctrl")).toBe(true);
    expect(container.classList.contains("maplibre-style-control")).toBe(true);
  });

  it("sets the given active style on add", () => {
    const control = new StyleControl({ active: "Dark" });
    const container = control.onAdd(createMockMap());

    const name = container.querySelector(".maplibre-style-control-current-name");
    expect(name?.textContent).toBe("Dark");
  });

  it("defers the initial active style until the map's current style finishes loading", () => {
    const map = createMockMap({ styleLoaded: false }) as MaplibreMap & { _fireStyleLoad: () => void };
    const control = new StyleControl({ active: "Dark" });
    const container = control.onAdd(map);

    const name = () => container.querySelector(".maplibre-style-control-current-name");
    expect(name()?.textContent).toBeFalsy();

    map._fireStyleLoad();
    expect(name()?.textContent).toBe("Dark");
  });

  it("fires a style.set event when the active style changes", () => {
    const control = new StyleControl();
    control.onAdd(createMockMap());

    const listener = vi.fn();
    control.on("style.set", listener);
    control.setStyle?.("Winter");

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].style.id).toBe("Winter");
  });

  it("removes the container on remove", () => {
    const control = new StyleControl();
    const container = control.onAdd(createMockMap());
    document.body.appendChild(container);

    control.onRemove();

    expect(document.body.contains(container)).toBe(false);
  });

  it("defaults to the bottom-left position", () => {
    const control = new StyleControl();
    expect(control.getDefaultPosition()).toBe("bottom-left");
  });
});
