---
meta:
    title: Menu Item
    description: Menu items provide options for the user to pick from in a menu.
layout: component
sidebarSection: Hidden
---

# Menu Item

Menu items provide options for the user to pick from in a menu. They're used inside `<terra-menu>` components.

## Examples

### Basic Menu Item

A simple menu item with text.

```html:preview
<terra-menu>
  <terra-menu-item>Edit</terra-menu-item>
</terra-menu>
```

### Menu Item with Icon

Add icons to menu items using the `prefix` or `suffix` slots.

```html:preview
<terra-menu>
  <terra-menu-item>
    <terra-icon slot="prefix" name="pencil" library="system"></terra-icon>
    Edit
  </terra-menu-item>
  <terra-menu-item>
    <terra-icon slot="suffix" name="external-link" library="system"></terra-icon>
    Open in New Tab
  </terra-menu-item>
</terra-menu>
```

### Checkbox Menu Item

Use checkbox menu items for multi-select scenarios. Set `type="checkbox"` and use the `checked` attribute.

```html:preview
<terra-menu>
  <terra-menu-item type="checkbox">Option 1</terra-menu-item>
  <terra-menu-item type="checkbox" checked>Option 2</terra-menu-item>
  <terra-menu-item type="checkbox">Option 3</terra-menu-item>
</terra-menu>
```

### Disabled Menu Item

Disable menu items to prevent selection.

```html:preview
<terra-menu>
  <terra-menu-item>Enabled Item</terra-menu-item>
  <terra-menu-item disabled>Disabled Item</terra-menu-item>
  <terra-menu-item>Another Enabled Item</terra-menu-item>
</terra-menu>
```

### Loading Menu Item

Show a loading state on menu items.

```html:preview
<terra-menu>
  <terra-menu-item>Normal Item</terra-menu-item>
  <terra-menu-item loading>Loading Item</terra-menu-item>
  <terra-menu-item>Another Normal Item</terra-menu-item>
</terra-menu>
```

### Menu Item with Value

Set a `value` attribute to identify menu items when selected.

```html:preview
<terra-menu id="value-menu">
  <terra-menu-item value="edit">Edit</terra-menu-item>
  <terra-menu-item value="duplicate">Duplicate</terra-menu-item>
  <terra-menu-item value="delete">Delete</terra-menu-item>
</terra-menu>

<script>
  const menu = document.getElementById('value-menu');
  menu.addEventListener('terra-select', (event) => {
    alert(`Selected value: ${event.detail.item.value}`);
  });
</script>
```

### Submenu

Menu items can contain submenus using the `submenu` slot.

```html:preview
<terra-menu>
  <terra-menu-item>
    File
    <terra-menu slot="submenu">
      <terra-menu-item>New</terra-menu-item>
      <terra-menu-item>Open</terra-menu-item>
      <terra-menu-item>Save</terra-menu-item>
    </terra-menu>
  </terra-menu-item>
  <terra-menu-item>
    Edit
    <terra-menu slot="submenu">
      <terra-menu-item>Cut</terra-menu-item>
      <terra-menu-item>Copy</terra-menu-item>
      <terra-menu-item>Paste</terra-menu-item>
    </terra-menu>
  </terra-menu-item>
</terra-menu>
```

## Accessibility

The menu item component follows accessibility best practices:

-   Uses proper ARIA attributes (`role="menuitem"` or `role="menuitemcheckbox"`)
-   Supports keyboard navigation
-   Works with screen readers
-   Properly handles disabled and checked states

[component-metadata:terra-menu-item]
