---
meta:
    title: Slider
    description:
layout: component
---

```html:preview
<terra-slider></terra-slider>
```

## Examples

### Single value

```html:preview
<terra-slider min="0" max="100" step="5" value="25" has-tooltips></terra-slider>
```

### Range

```html:preview
<terra-slider mode="range" min="0" max="1000" step="10" start-value="200" end-value="800" has-pips has-tooltips></terra-slider>
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
<terra-slider mode="range" min="0" max="1000" start-value="200" end-value="800"></terra-slider>
```

### Range with Input Fields

```html:preview
<terra-slider mode="range" min="0" max="1000" start-value="200" end-value="800" show-inputs></terra-slider>
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
