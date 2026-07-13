---
meta:
    title: Colormap Picker
    description: A colormap picker for selecting scientific data color scales.
layout: component
---

```html:preview
<terra-colormap-picker value="viridis" id="main-picker"></terra-colormap-picker>
<p style="margin-top: 0.5rem;">Selected: <code id="main-output">viridis</code></p>

<script>
  const picker = document.getElementById('main-picker');
  const output = document.getElementById('main-output');
  picker.addEventListener('terra-colormap-change', e => {
    output.textContent = e.detail.value;
  });
</script>
```

```jsx:react
import { useState } from 'react';
import TerraColormapPicker from '@nasa-terra/components/dist/react/colormap-picker';

const App = () => {
  const [value, setValue] = useState('viridis');
  return (
    <>
      <TerraColormapPicker value={value} onTerraColormapChange={e => setValue(e.detail.value)} />
      <p>Selected: <code>{value}</code></p>
    </>
  );
};
```

## Examples

### Disabled

Add the `disabled` attribute to prevent interaction.

```html:preview
<terra-colormap-picker value="plasma" disabled></terra-colormap-picker>
```

### Setting Value Programmatically

Set the `value` property in JavaScript to update the selection.

```html:preview
<terra-colormap-picker value="viridis" id="picker-prog"></terra-colormap-picker>
<div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
  <terra-button id="btn-viridis">viridis</terra-button>
  <terra-button id="btn-plasma">plasma</terra-button>
  <terra-button id="btn-rdbu">RdBu</terra-button>
  <terra-button id="btn-tab10">tab10</terra-button>
</div>

<script>
  const picker = document.getElementById('picker-prog');
  document.getElementById('btn-viridis').addEventListener('click', () => picker.value = 'viridis');
  document.getElementById('btn-plasma').addEventListener('click', () => picker.value = 'plasma');
  document.getElementById('btn-rdbu').addEventListener('click', () => picker.value = 'RdBu');
  document.getElementById('btn-tab10').addEventListener('click', () => picker.value = 'tab10');
</script>
```

## Usage

Use the filter buttons to narrow the list to **Sequential**, **Diverging**, or **Qualitative** colormaps:

- **Sequential** — ordered data with a natural progression (temperature, elevation, reflectance)
- **Diverging** — deviation from a midpoint (anomalies, differences from a baseline)
- **Qualitative** — categorical data with no inherent order (land cover classes, sensor types)

Listen for `terra-colormap-change` to get the selected name. The event detail contains `{ value: string }`.

## Accessibility

- Swatch grid uses `role="listbox"` with each swatch as `role="option"` and `aria-selected`.
- Filter bar uses `role="tablist"` with `role="tab"` on each button.
- All interactive elements support keyboard navigation and `Enter` / `Space` to select.
