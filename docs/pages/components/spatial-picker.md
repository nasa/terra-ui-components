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
    <terra-spatial-picker initial-value="-100, -50, 30, 50"></terra-spatial-picker>
</div>
```

### Configured Spatial Picker

```html:preview
<div style="height: 300px;">
<terra-spatial-picker has-navigation has-shape-selector></terra-spatial-picker>
</div>
```

### Closable Spatial Picker

```html:preview
<div style="height: 300px;">
    <terra-spatial-picker initial-value="-100, -50, 30, 50" closable></terra-spatial-picker>
</div>
```

### Spatial Picker with No World Wrap

This example disables infinite horizontal scrolling on the map.

```html:preview
<div style="height: 300px;">
<terra-spatial-picker has-navigation></terra-spatial-picker>
</div>
```

[component-metadata:terra-spatial-picker]


### Spatial Picker with spatial constraint

```html:preview
<div style="height: 300px;">
    <terra-spatial-picker initial-value="-56.18, 57.44, -34.48, 68.12" spatial-constraints="[[-180, -90, 180, -39.23], [-180, 30.98, 180, 90]]"></terra-spatial-picker>
</div>
```
