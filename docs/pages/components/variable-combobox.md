---
meta:
    title: Variable Combobox
    description:
layout: component
---

```html:preview
<gd-variable-combobox></gd-variable-combobox>

<script type="module">
  const element = document.querySelector('gd-variable-combobox')

  element.addEventListener('gd-combobox-change', (e) => {
    console.log(e)
  })
</script>
```

## Examples

### Default Variable Combobox

```html:preview
<gd-variable-combobox></gd-variable-combobox>
```

### Configured Variable Combobox

```html:preview
<gd-variable-combobox placeholder="Search for Variables: e.g., albedo" hide-label hide-help></gd-variable-combobox>
```

[component-metadata:gd-variable-combobox]
