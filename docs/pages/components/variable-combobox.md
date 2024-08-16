---
meta:
    title: Variable Combobox
    description:
layout: component
---

```html:preview
<terra-variable-combobox></terra-variable-combobox>

<script type="module">
  const element = document.querySelector('terra-variable-combobox')

  element.addEventListener('terra-combobox-change', (e) => {
    console.log(e)
  })
</script>
```

## Examples

### Default Variable Combobox

```html:preview
<terra-variable-combobox></terra-variable-combobox>
```

### Configured Variable Combobox

```html:preview
<terra-variable-combobox placeholder="Search for Variables: e.g., albedo" hide-label hide-help></terra-variable-combobox>
```

[component-metadata:terra-variable-combobox]
