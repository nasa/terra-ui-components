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
    show-layer-picker
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

    <div>
        <terra-checkbox name="showLayerPicker" class="map-option">
        Show Layer Picker
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
<terra-map has-navigation has-shape-selector show-mouse-coordinates></terra-map>
```

### Map with No World Wrap

This example disables infinite horizontal scrolling, restricting the map to a single world view.

```html:preview
<terra-map has-navigation no-world-wrap></terra-map>
```

### Adding Custom Layers

Use `addLayer()`/`removeLayer()`/`getLayer()` to mount your own OpenLayers layers on the map (for example, a data overlay). By default a custom layer is inserted just above the base imagery layer and below the borders/labels layers, so borders/labels keep rendering on top of it; pass `{ position: 'top' , title: 'My Custom Layer'}` to place it above everything else instead and to specify the display label shown in UI controls.

```html:preview
<terra-map id="custom-layer-map" has-navigation></terra-map>

<script type="module">
    import VectorLayer from 'https://esm.sh/ol@10.11.0/layer/Vector.js'
    import VectorSource from 'https://esm.sh/ol@10.11.0/source/Vector.js'
    import Feature from 'https://esm.sh/ol@10.11.0/Feature.js'
    import Point from 'https://esm.sh/ol@10.11.0/geom/Point.js'
    import { fromLonLat } from 'https://esm.sh/ol@10.11.0/proj.js'

    const map = document.getElementById('custom-layer-map')

    const source = new VectorSource({
        features: [new Feature({ geometry: new Point(fromLonLat([0, 0])) })],
    })

    const layer = new VectorLayer({
        source,
        style: { 'circle-radius': 8, 'circle-fill-color': 'red' },
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

### Adding GIBS Imagery

Use `GibsLayer` to load [NASA GIBS](https://www.earthdata.nasa.gov/data/tools/gibs) imagery for a collection, scoped to a bounding box. `new GibsLayer({ layer, date })` requests Web Mercator (EPSG:3857) imagery directly — no network call needed to build the layer. Pass `extent` (as `[west, south, east, north]` in EPSG:4326) to clip the imagery to a bounding box, and call `fitToExtent()` to pan/zoom the map to it.

```html:preview
<terra-map id="gibs-map" has-navigation></terra-map>

<script type="module">
    import { GibsLayer } from '/dist/components/map/layers/gibs.layer.js'

    const map = document.getElementById('gibs-map')
    const bbox = [-130, 20, -60, 55] // west, south, east, north

    customElements.whenDefined('terra-map').then(() => {
        const gibsLayer = new GibsLayer({
            layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
            date: '2024-06-01',
            extent: bbox,
        })

        map.addLayer(gibsLayer, { name: 'gibs-imagery' })
        map.fitToExtent(bbox, { projection: 'EPSG:4326', padding: [50, 50, 50, 50] })
    })
</script>
```

Some GIBS collections are only published in EPSG:4326 (Geographic) or a polar projection (EPSG:3413 Arctic / EPSG:3031 Antarctic) rather than Web Mercator. For those, use the async `GibsLayer.forProjection()` factory, which fetches that projection's capabilities and builds the imagery layer from it:

```ts
const polarLayer = await GibsLayer.forProjection({
    layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    date: '2024-06-01',
    projection: 'EPSG:3413',
})

map.addLayer(polarLayer, { name: 'gibs-imagery' })
```

**Important:** `forProjection()` builds imagery in that projection's tile grid, but `terra-map`'s view still defaults to EPSG:3857 (Web Mercator). OpenLayers will silently reproject the layer into that view, which looks severely distorted for polar imagery — Web Mercator can't represent the poles. Set the map's own `projection` attribute/property to match (e.g. `<terra-map projection="EPSG:3413">`) so the view itself renders in that projection, same as [NASA's own GIBS examples](https://github.com/nasa-gibs/web-examples) do. `projection` is a construction-time setting, like `no-world-wrap` — it has no effect if changed after the map has rendered.

```html:preview
<terra-map
    projection="EPSG:3413"
    layers='[{ "type": "gibs", "name": "gibs-imagery", "layer": "MODIS_Terra_CorrectedReflectance_TrueColor", "date": "2024-06-01", "projection": "EPSG:3413" }]'
></terra-map>
```

### Declaring Layers in HTML

If you don't need to write JS, the `layers` attribute/property lets you declare layers directly, as a JSON array. Each entry's `type` picks what kind of layer it builds:

- `"type": "gibs"` mirrors `GibsLayer`'s options (`layer`, `date`, `projection`, `format`, `tileMatrixSet`, `extent`, `noWorldWrap`). Non-EPSG:3857 projections are resolved asynchronously under the hood via `GibsLayer.forProjection()`, same as the imperative API above.
- `"type": "gibs-vector"` declares a [GIBS vector tile layer](#adding-gibs-vector-imagery) — see that section for its fields.
- `"type": "geotiff"` declares a [standalone GeoTIFF layer](#adding-geotiff-layers) — see that section for its fields.

Every entry also takes a required `name` (used for add/remove/update diffing and `getLayer()`/`removeLayer()`), an optional `title` (a human-readable label displayed in controls like the layer picker; defaults to `name` or the layer's source title), an optional `position` (`'below-borders'` (default) or `'top'`, same as `addLayer()`'s options), and an optional `visible` (defaults to `true`) — set it to `false` to add the layer hidden, toggleable later with `getLayer(name).setVisible(true)`.

```html:preview
<terra-map
    show-layer-picker
    layers='[{ "type": "gibs", "name": "gibs-imagery", "title": "MODIS Terra True Color", "layer": "MODIS_Terra_CorrectedReflectance_TrueColor", "date": "2024-06-01" }]'
></terra-map>
```

Changing the attribute/property later diffs against what's currently applied, by `name`: entries removed from the array are removed from the map, unchanged entries are left alone, and entries whose config changed are rebuilt. If a GIBS entry's projection doesn't match the map's own `projection`, a console warning is logged (see above) rather than silently rendering distorted imagery. Each build attempt (success or failure) fires a `terra-map-layer-change` event — see below for GeoTIFF's `info`/`error` detail. For anything not expressible here — other layer types, or finer imperative control — use `addLayer()`/`removeLayer()` directly instead.

### Visualizing a CMR Collection's GIBS Imagery

Set `collection-id` to a CMR collection entry-id (e.g. `AIRS2RET_NRT_7.0`) or concept-id (e.g. `C1234567890-GES_DISC`) — either is accepted — to render every GIBS imagery product CMR has tagged for that collection, with no need to know individual GIBS layer names ahead of time:

```html:preview
<terra-map collection-id="GPM_3IMERGHH_07" show-layer-picker></terra-map>
```

Under the hood, this reads the collection's GIBS layers from CMR, which can list many products for a single collection (day/night variants, pressure levels, etc.) — every one of them available in the map's current `projection` is added as its own layer, named `` `${collectionId}:${product}` ``. Layers not published in the map's current projection are skipped.

NOTE: Only the first resolved layer is visible by default to avoid painting every product in the collection on top of each other.

### Adding **GeoTIFF** Layers

Use a `"type": "geotiff"` entry in `layers` to load any standalone GeoTIFF or Cloud-Optimized GeoTIFF by URL. Each entry needs a `name` and a `url`; a colormap-based style is computed automatically from the raster's actual data range. The example below loads a small GeoTIFF from a relative path, but any GeoTIFF URL works the same way:

```html:preview
<terra-map
    layers='[{ "type": "geotiff", "name": "my-data", "url": "/assets/examples/giovanni.tif", "colorMapName": "viridis", "fitView": true }]'
></terra-map>
```

Once built, the layer's computed data range, colormap stops, and legend entries are available via `getGeoTiffLayerInfo(name)` — handy for rendering a legend:

```ts
map.addEventListener('terra-map-layer-change', event => {
    const { name, type, info, error } = event.detail
    if (type !== 'geotiff') return
    if (error) {
        console.error(`Failed to load GeoTIFF layer "${name}":`, error)
        return
    }
    // info.min, info.max, info.legendValues - build a legend from these
})
```

To read the raw value under the cursor (e.g. for a hover readout), combine `getGeoTiffValueAtPixel(name, pixel)` with the `terra-map-pointer-move` event:

```ts
map.addEventListener('terra-map-pointer-move', event => {
    const value = map.getGeoTiffValueAtPixel('my-data', event.detail.pixel)
    // value is a typed array of band value(s) at that pixel, or undefined
})
```

### Adding GIBS Vector Imagery

Some GIBS collections are published as vector data (e.g. `GRanD_Dams`, `VIIRS_NOAA20_Thermal_Anomalies_375m_All`) rather than raster imagery. Use `buildGibsVectorLayer()` to load these as Mapbox Vector Tiles. Without a `style`, a simple default circle style is applied:

```html:preview
<terra-map id="gibs-vector-map" has-navigation projection="EPSG:4326"></terra-map>

<script type="module">
    import { buildGibsVectorLayer } from '/dist/components/map/layers/gibs-vector.layer.js'

    const map = document.getElementById('gibs-vector-map')

    customElements.whenDefined('terra-map').then(async () => {
        const damsLayer = await buildGibsVectorLayer({
            layer: 'GRanD_Dams',
            date: '2020-03-18',
        })

        map.addLayer(damsLayer, { name: 'dams' })
    })
</script>
```

Pass `style` (a Mapbox GL style JSON object, e.g. the one GIBS publishes alongside a layer's GetCapabilities) and `styleSourceId` (the key under that style's `sources`) to render with a custom style instead of the default:

```ts
const damsLayer = await buildGibsVectorLayer({
    layer: 'GRanD_Dams',
    style: mapboxStyleJson, // see GIBS' `mapbox-gl-style` metadata for a layer
    styleSourceId: 'GRanD_Dams',
})
```

For hover/click feature interactions (e.g. showing a dam's properties on hover), use `getFeaturesAtPixel()` with the `terra-map-pointer-move` event's `pixel`:

```ts
map.addEventListener('terra-map-pointer-move', event => {
    const features = map.getFeaturesAtPixel(event.detail.pixel)
    // features[0]?.getProperties() has the hovered feature's attributes, if any
})
```

### Adding a Custom XYZ Tile Layer

For any other tile service that serves `{z}/{y}/{x}` tiles, use `XYZLayer` instead of hand-rolling an OpenLayers `TileLayer`/`ImageTile` pair:

```ts
import { XYZLayer } from '/dist/components/map/layers/xyz.layer.js'

const layer = new XYZLayer({
    urlTemplate: 'https://example.com/tiles/{z}/{y}/{x}.png',
    attributions: ['Example Provider'],
    extent: [-130, 20, -60, 55], // optional bbox clip, [west, south, east, north] in EPSG:4326
})

map.addLayer(layer, { name: 'example-tiles' })
```

### Filling a Container

Use the `fill` attribute to remove the map's default card chrome (padding, border, fixed aspect ratio) so it stretches to fill its container. This is useful when embedding `terra-map` inside another component.

```html:preview
<div style="height: 300px;">
    <terra-map fill has-navigation></terra-map>
</div>
```

### Map Navigation

Drive the view imperatively with `setCenter(lon, lat, options?)`, `getCenter()`, `setZoom(zoom, options?)`, `getZoom()`, `zoomIn(options?)`, `zoomOut(options?)`, `fitBounds(bounds, options?)`, `getBounds()`, `resetView(options?)`, `setRotation(radians, options?)`, and `getRotation()`. Every method that changes the view accepts an optional `{ duration }` (milliseconds) — pass it to animate the change; omit it to jump immediately. `fitBounds()` is a thin wrapper around `fitToExtent()` that takes a `LatLngBounds` instance (EPSG:4326) instead of a raw extent - if you don't need a full `LatLngBounds` (e.g. for `getSouthWest()`/`toBBoxString()`/etc.), pass a `[west, south, east, north]` array to `fitToExtent()` directly instead.

```html:preview
<terra-map id="navigation-map" has-navigation zoom="3"></terra-map>

<div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
    <terra-button id="nav-set-center">Fly to Tokyo</terra-button>
    <terra-button id="nav-zoom-in">Zoom In</terra-button>
    <terra-button id="nav-zoom-out">Zoom Out</terra-button>
    <terra-button id="nav-fit-bounds">Fit to Western US</terra-button>
    <terra-button id="nav-reset">Reset View</terra-button>
</div>

<script type="module">
    import { LatLngBounds } from '/dist/components/map/models/LatLngBounds.js'

    const map = document.getElementById('navigation-map')

    customElements.whenDefined('terra-map').then(() => {
        document.getElementById('nav-set-center').addEventListener('click', () => {
            map.setCenter(139.6917, 35.6895, { duration: 500 })
        })

        document.getElementById('nav-zoom-in').addEventListener('click', () => {
            map.zoomIn({ duration: 250 })
        })

        document.getElementById('nav-zoom-out').addEventListener('click', () => {
            map.zoomOut({ duration: 250 })
        })

        document.getElementById('nav-fit-bounds').addEventListener('click', () => {
            const westernUS = new LatLngBounds([-125, 32, -114, 42]) // west, south, east, north
            map.fitBounds(westernUS, { duration: 500, padding: [20, 20, 20, 20] })
        })

        document.getElementById('nav-reset').addEventListener('click', () => {
            map.resetView({ duration: 500 })
        })
    })
</script>
```

### Layer Management

Beyond `addLayer()`/`removeLayer()`/`getLayer()`/`getAllLayers()`, a fuller set of methods manage layers added through the imperative API: `setLayerVisibility(name, show)`, `setLayerOpacity(name, opacity)`, `setLayerOrder(names)`, `fitToLayer(name, options?)`, `getLayers()`, `clearLayers()`, and `refreshLayer(name)`.

**`getLayers()` and `clearLayers()` only see consumer-added layers** - layers added through `addLayer()`. The map's built-in layers (base imagery, borders, labels, graticule, shapes, draw) are never included or touched, unlike `getLayer()`/`getAllLayers()`, which see every layer. `setLayerOrder()` follows the same rule: it only reorders consumer-added layers relative to each other, leaving built-in layers at their existing position.

**Caveat:** mixing imperative `removeLayer()`/`clearLayers()` calls with the declarative `layers` property for the same layer `name` is the consumer's responsibility - it isn't auto-synced. If you imperatively remove a layer whose `name` is still present in `layers`, the next time `layers` is diffed (e.g. any other change to the array) that entry will be treated as newly added and rebuilt.

```html:preview
<terra-map id="layer-management-map" has-navigation></terra-map>

<div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
    <terra-button id="layers-toggle">Toggle Visibility</terra-button>
    <terra-button id="layers-opacity">Set Opacity 50%</terra-button>
    <terra-button id="layers-order">Send to Back</terra-button>
    <terra-button id="layers-clear">Clear Custom Layers</terra-button>
</div>

<script type="module">
    import { GibsLayer } from '/dist/components/map/layers/gibs.layer.js'

    const map = document.getElementById('layer-management-map')
    const bbox = [-130, 20, -60, 55] // west, south, east, north

    customElements.whenDefined('terra-map').then(() => {
        // two dates of the same proven-good imagery layer, stacked so
        // toggling/opacity/order on the top one has a visible effect
        const june = new GibsLayer({
            layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
            date: '2024-06-01',
            extent: bbox,
        })
        const january = new GibsLayer({
            layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
            date: '2024-01-01',
            extent: bbox,
        })

        map.addLayer(june, { name: 'june', position: 'top' })
        map.addLayer(january, { name: 'january', position: 'top' })
        map.fitToExtent(bbox, { projection: 'EPSG:4326', padding: [20, 20, 20, 20] })

        document.getElementById('layers-toggle').addEventListener('click', () => {
            const layer = map.getLayer('january')
            map.setLayerVisibility('january', !layer?.getVisible())
        })

        document.getElementById('layers-opacity').addEventListener('click', () => {
            map.setLayerOpacity('january', 0.5)
        })

        document.getElementById('layers-order').addEventListener('click', () => {
            map.setLayerOrder(['january', 'june'])
        })

        document.getElementById('layers-clear').addEventListener('click', () => {
            map.clearLayers() // removes june/january; built-in layers are untouched
        })
    })
</script>
```

[component-metadata:terra-map]
