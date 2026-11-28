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

On mobile viewports (768px wide or smaller), the variable information popup uses tap-based interactions instead of the desktop hover behavior.

- **Open:** Tap an information icon to open its associated popup.

- **Toggle:** Tap the same information icon again to close the popup.

- **Switch:** Tap a different information icon to display its associated information.

- **Dismiss:** Tap anywhere outside the information icon and popup to close it.

- **Automatic dismissal:** The popup automatically closes when its anchor element (the information icon) is scrolled completely outside the viewport.

The variable information popup is constrained to the available viewport space. When its content exceeds the available space, the content area becomes independently scrollable.

The popup automatically closes when its anchor element is scrolled completely outside the viewport. This prevents popup content from remaining visible when its associated element is no longer visible.

See the [Popup documentation](/components/popup) for more information about mobile viewport constraints, scrolling, and automatic dismissal.

#### Variable Information Popup Positioning

The variable information popup uses different anchor elements depending on the viewport size to provide a better positioning experience.

- **Desktop viewports (wider than 768px):** The popup is anchored to the `terra-variable-combobox` component.
- **Mobile viewports (768px wide or smaller):** The popup is anchored to the information icon that triggers it.

Using the information icon as the anchor on mobile allows the popup to be positioned relative to the icon rather than the entire combobox. This helps keep the popup visible within the available viewport space.

The popup also uses the mobile positioning behavior described in the [Popup documentation](/components/popup), including automatic flipping and shifting to keep it within the viewport.

### Configured Variable Combobox

```html:preview
<terra-variable-combobox placeholder="Search for Variables: e.g., albedo" hide-label hide-help></terra-variable-combobox>
```

[component-metadata:terra-variable-combobox]
