---
meta:
    title: Divider
    description: Dividers are used to visually separate or group elements.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-divider></terra-divider>
```

## Examples

### Width

Use the `--terra-divider-width` custom property to change the width of the divider.

```html:preview
<terra-divider style="--terra-divider-width: 4px;"></terra-divider>
```

### Color

Use the `--terra-divider-color` custom property to change the color of the divider.

```html:preview
<terra-divider style="--terra-divider-color: tomato;"></terra-divider>
```

### Spacing

Use the `--terra-divider-spacing` custom property to change the amount of space between the divider and its neighboring elements.

```html:preview
<div style="text-align: center;">
  Above
  <terra-divider style="--terra-divider-spacing: 2rem;"></terra-divider>
  Below
</div>
```

### Vertical

Add the `vertical` attribute to draw the divider in a vertical orientation. The divider will span the full height of its container. Vertical dividers work especially well inside of a flex container.

```html:preview
<div style="display: flex; align-items: center; height: 2rem;">
  First
  <terra-divider vertical></terra-divider>
  Middle
  <terra-divider vertical></terra-divider>
  Last
</div>
```

### Menu Dividers

Use dividers in [menus](/components/menu) to visually group menu items.

```html:preview
<terra-menu style="max-width: 200px;">
  <terra-menu-item value="1">Option 1</terra-menu-item>
  <terra-menu-item value="2">Option 2</terra-menu-item>
  <terra-menu-item value="3">Option 3</terra-menu-item>
  <terra-divider></terra-divider>
  <terra-menu-item value="4">Option 4</terra-menu-item>
  <terra-menu-item value="5">Option 5</terra-menu-item>
  <terra-menu-item value="6">Option 6</terra-menu-item>
</terra-menu>
```

[component-metadata:terra-divider]
