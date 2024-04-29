---
meta:
    title: Variable Combobox
    description:
layout: component
---

```html:preview
<edux-variable-combobox></edux-variable-combobox>

<script type="module">
  const element = document.querySelector('edux-variable-combobox')

  element.addEventListener('edux-combobox-change', (e) => {
    console.log(e)
  })
</script>
```

## Examples

### Default Variable Combobox

```html:preview
<edux-variable-combobox></edux-variable-combobox>
```

### Configured Variable Combobox

```html:preview
<edux-variable-combobox placeholder="Search for Variables: e.g., albedo" hide-label hide-help></edux-variable-combobox>
```

[component-metadata:edux-variable-combobox]
