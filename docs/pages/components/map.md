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

Every entry also takes a required `name` (used for add/remove/update diffing and `getLayer()`/`removeLayer()`), an optional `position` (`'below-borders'` (default) or `'top'`, same as `addLayer()`'s options), and an optional `visible` (defaults to `true`) — set it to `false` to add the layer hidden, toggleable later with `getLayer(name).setVisible(true)`.

```html:preview
<terra-map
    layers='[{ "type": "gibs", "name": "gibs-imagery", "layer": "MODIS_Terra_CorrectedReflectance_TrueColor", "date": "2024-06-01" }]'
></terra-map>
```

Changing the attribute/property later diffs against what's currently applied, by `name`: entries removed from the array are removed from the map, unchanged entries are left alone, and entries whose config changed are rebuilt. If a GIBS entry's projection doesn't match the map's own `projection`, a console warning is logged (see above) rather than silently rendering distorted imagery. Each build attempt (success or failure) fires a `terra-map-layer-change` event — see below for GeoTIFF's `info`/`error` detail. For anything not expressible here — other layer types, or finer imperative control — use `addLayer()`/`removeLayer()` directly instead.

### Visualizing a CMR Collection's GIBS Imagery

Set `collection-id` to a CMR collection entry-id (e.g. `AIRS2RET_NRT_7.0`) or concept-id (e.g. `C1234567890-GES_DISC`) — either is accepted — to render every GIBS imagery product CMR has tagged for that collection, with no need to know individual GIBS layer names ahead of time:

```html:preview
<terra-map collection-id="GPM_3IMERGHH_07"></terra-map>
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

[component-metadata:terra-map]
