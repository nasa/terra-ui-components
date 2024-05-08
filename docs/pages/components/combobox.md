---
meta:
    title: Combobox
    description:
layout: component
---

```html:preview
<edux-combobox searchable-list='[{"name":"Amos group","items":[{"name":"Item 1","title":"Title 1","value":"Value 1"},{"name":"Item 2","title":"Title 2","value":"Value 2"}]},{"name":"Ben group","items":[{"name":"Item 3","title":"Title 3","value":"Value 3"},{"name":"Item 4","title":"Title 4","value":"Value 4"}]},{"name":"Jon group","items":[{"name":"Item 5","title":"Title 5","value":"Value 5"},{"name":"Item 6","title":"Title 6","value":"Value 6"}]},{"name":"Krupa group","items":[{"name":"Item 7","title":"Title 7","value":"Value 7"},{"name":"Item 8","title":"Title 8","value":"Value 8"}]}]'></edux-combobox>

<script type="module">
  const element = document.querySelector('edux-combobox')

  element.addEventListener('edux-combobox-change', (e) => {
    console.log(e)
  })
</script>
```

## Examples

### Default Combobox

```html:preview
<edux-combobox></edux-combobox>
```

### Configured Variable Combobox

```html:preview
<edux-combobox placeholder="Search for items: e.g., albedo" hide-label hide-help></edux-combobox>
```

[component-metadata:edux-combobox]
