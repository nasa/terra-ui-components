---
meta:
    title: Slider
    description:
layout: component
sidebarSection: Elements
---

```html:preview
<terra-slider label="Year" min="1920" max="2020" mode="range"></terra-slider>
```

## Examples

### Default Behavior (Selected Values Display)

By default, the slider displays the selected values in the top right corner of the component. This is the recommended HDS pattern.

```html:preview
<terra-slider label="Year" min="1920" max="2020" mode="range"></terra-slider>
```

### Single Value

```html:preview
<terra-slider min="0" max="100" step="5" value="25" label="Temperature"></terra-slider>
```

### Range

```html:preview
<terra-slider mode="range" min="0" max="1000" step="10" start-value="200" end-value="800" label="Range"></terra-slider>
```

### With Tooltips

Use the `has-tooltips` prop to show tooltips on the slider handles instead of displaying values in the top right. When tooltips are enabled, they automatically merge when handles get close together (e.g., "23-24" instead of two overlapping tooltips).

```html:preview
<terra-slider min="0" max="100" step="5" value="25" label="Temperature" has-tooltips></terra-slider>
<terra-slider mode="range" min="0" max="100" step="1" start-value="23" end-value="24" label="Close Range" has-tooltips></terra-slider>
```

### With Label

```html:preview
<terra-slider min="0" max="100" value="50" label="Temperature (°C)"></terra-slider>
```

### Hidden Label (Accessible)

```html:preview
<terra-slider min="0" max="100" value="50" label="Volume Control" hide-label></terra-slider>
```

### With Input Fields

```html:preview
<terra-slider min="0" max="1000" value="250" show-inputs></terra-slider>
```

### Range with Default Values

```html:preview
<terra-slider mode="range" min="0" max="1000" start-value="200" end-value="800" label="Range"></terra-slider>
```

### Range with Input Fields

```html:preview
<terra-slider mode="range" min="0" max="1000" start-value="200" end-value="800" label="Range" show-inputs></terra-slider>
```

### Decimal Steps

```html:preview
<terra-slider min="0" max="10" step="0.2" value="2.4" show-inputs></terra-slider>
```

### Custom Step Size

```html:preview
<terra-slider min="0" max="100" step="5" value="25" show-inputs></terra-slider>
```

### Disabled

```html:preview
<terra-slider min="0" max="10" value="4" disabled></terra-slider>
```

### Display Modes

The slider supports two display modes for showing selected values:

**Default (Selected Values in Header):**

-   Selected values are displayed in the top right corner of the component
-   This is the recommended HDS pattern and provides a clean, unobtrusive display
-   Example: `<terra-slider label="Year" min="1920" max="2020" mode="range"></terra-slider>`

**Tooltips:**

-   Use the `has-tooltips` prop to show tooltips on the slider handles
-   Tooltips automatically merge when handles get close together (within 15% proximity)
-   Example: `<terra-slider has-tooltips mode="range" min="0" max="100"></terra-slider>`

### Default Values

**Single Mode:**

-   If no `value` is provided, defaults to `min` value
-   Example: `<terra-slider min="0" max="100"></terra-slider>` starts at 0

**Range Mode:**

-   If no `start-value` is provided, defaults to `min` value
-   If no `end-value` is provided, defaults to `max` value
-   Example: `<terra-slider mode="range" min="0" max="100"></terra-slider>` starts at [0, 100]

### Listen for changes

```html
<terra-slider id="s1" min="0" max="100" value="40"></terra-slider>
<script>
  const s1 = document.getElementById('s1');
  s1.addEventListener('terra-slider-change', (e) => {
    // Single mode: e.detail.value
    // Range mode: e.detail.startValue, e.detail.endValue
    console.log('slider change', e.detail);
  });
<\/script>
```

[component-metadata:terra-slider]
