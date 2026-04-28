---
meta:
    title: Spatial Picker
    description:
layout: component
---

## Examples

### Default Spatial Picker

```html:preview
<div style="height: 300px;">
    <terra-spatial-picker initial-value="-100, -50, 30, 50" ></terra-spatial-picker>
</div>
```

### Configured Spatial Picker

```html:preview
<div style="height: 300px;">
<terra-spatial-picker has-navigation has-shape-selector has-coord-tracker></terra-spatial-picker>
</div>
```

### Spatial Picker with No World Wrap

This example disables infinite horizontal scrolling on the map.

```html:preview
<div style="height: 300px;">
<terra-spatial-picker has-navigation no-world-wrap></terra-spatial-picker>
</div>
```

[component-metadata:terra-spatial-picker]
