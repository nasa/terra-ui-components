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

### Mobile Behavior

On mobile viewports (768px wide or smaller), the variable information popup is constrained to the available viewport space. When its content exceeds the available space, the content area becomes independently scrollable.

The popup automatically closes when its anchor element is scrolled completely outside the viewport. This prevents popup content from remaining visible when its associated element is no longer visible.

See the [Popup documentation](/components/popup) for more information about mobile viewport constraints, scrolling, and automatic dismissal.

### Configured Variable Combobox

```html:preview
<terra-variable-combobox placeholder="Search for Variables: e.g., albedo" hide-label hide-help></terra-variable-combobox>
```

[component-metadata:terra-variable-combobox]
