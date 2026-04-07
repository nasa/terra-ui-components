---
meta:
    title: Map
    description:
layout: component
---

## Examples

### Default Map

```html:preview
<terra-map id="configurable-map" show-graticule show-mouse-coordinates show-bounding-box-selection show-polygon-selection show-point-selection show-circle-selection></terra-map>

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

[component-metadata:terra-map]
