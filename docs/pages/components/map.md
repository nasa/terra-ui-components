---
meta:
    title: Map
    description:
layout: component
---

## Examples

### Default Map

```html:preview
<terra-map
    id="configurable-map"
    show-graticule
    show-mouse-coordinates
    show-bounding-box-selection
    show-polygon-selection
    show-point-selection
    show-circle-selection
></terra-map>

<form style="max-width: 600px;">
  <fieldset>
    <legend>Map Options</legend>

    <div>
        <terra-checkbox name="showGraticule" class="map-option">
        Show Graticule Layer
        </terra-checkbox>
    </div>

    <div>
        <terra-checkbox name="showMouseCoordinates" class="map-option">
        Show Mouse Coordinates
        </terra-checkbox>
    </div>

    <div>
        <terra-checkbox name="showBoundingBoxSelection" class="map-option">
        Show Bounding Box Selection
        </terra-checkbox>
    </div>

    <div>
        <terra-checkbox name="showPolygonSelection" class="map-option">
        Show Polygon Selection
        </terra-checkbox>
    </div>

    <div>
        <terra-checkbox name="showPointSelection" class="map-option">
        Show Point Selection
        </terra-checkbox>
    </div>

    <div>
        <terra-checkbox name="showCircleSelection" class="map-option">
        Show Circle Selection
        </terra-checkbox>
    </div>
  </fieldset>
</form>

<script>
    const map = document.getElementById('configurable-map')

    setTimeout(() => {
        document.querySelectorAll('.map-option').forEach(el => {
            el.setAttribute('checked', map[el.getAttribute('name')])

            el.addEventListener('terra-change', (e) => {
                map[e.target.name] = e.target.checked
            })
        })
    }, 250)
</script>
```

### Configured Map

```html:preview
<terra-map has-navigation has-shape-selector has-coord-tracker></terra-map>
```

### Map with No World Wrap

This example disables infinite horizontal scrolling, restricting the map to a single world view.

```html:preview
<terra-map has-navigation no-world-wrap></terra-map>
```

### Adding Custom Layers

Use `addLayer()`/`removeLayer()`/`getLayer()` to mount your own OpenLayers layers on the map (for example, a data overlay). By default a custom layer is inserted just above the base imagery layer and below the borders/labels layers, so borders/labels keep rendering on top of it; pass `{ position: 'top' }` to place it above everything else instead.

```html:preview
<terra-map id="custom-layer-map" has-navigation></terra-map>

<script type="module">
    import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js'
    import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js'
    import { Circle as CircleStyle, Fill, Style } from 'https://cdn.skypack.dev/ol/style.js'
    import Feature from 'https://cdn.skypack.dev/ol/Feature.js'
    import Point from 'https://cdn.skypack.dev/ol/geom/Point.js'
    import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js'

    const map = document.getElementById('custom-layer-map')

    const source = new VectorSource({
        features: [new Feature({ geometry: new Point(fromLonLat([0, 0])) })],
    })

    const layer = new VectorLayer({
        source,
        style: new Style({
            image: new CircleStyle({
                radius: 8,
                fill: new Fill({ color: 'red' }),
            }),
        }),
    })

    map.addEventListener(
        'terra-map-change',
        () => {}, // ensures the element is defined before we call into it
        { once: true },
    )

    customElements.whenDefined('terra-map').then(() => {
        map.addLayer(layer, { name: 'example-point' })
    })
</script>
```

### Filling a Container

Use the `fill` attribute to remove the map's default card chrome (padding, border, fixed aspect ratio) so it stretches to fill its container. This is useful when embedding `terra-map` inside another component.

```html:preview
<div style="height: 300px;">
    <terra-map fill has-navigation></terra-map>
</div>
```

[component-metadata:terra-map]
