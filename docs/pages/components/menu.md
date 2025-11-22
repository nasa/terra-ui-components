---
meta:
    title: Menu
    description: Menus provide a list of options for the user to choose from.
layout: component
---

# Menu

Menus provide a list of options for the user to choose from. They're typically used inside dropdowns, but can be used standalone as well.

## Examples

### Basic Menu

A simple menu with menu items.

```html:preview
<terra-menu>
  <terra-menu-item>Edit</terra-menu-item>
  <terra-menu-item>Duplicate</terra-menu-item>
  <terra-menu-item>Delete</terra-menu-item>
</terra-menu>
```

### Menu with Icons

Add icons to menu items using the `prefix` or `suffix` slots.

```html:preview
<terra-menu>
  <terra-menu-item>
    <terra-icon slot="prefix" name="pencil" library="system"></terra-icon>
    Edit
  </terra-menu-item>
  <terra-menu-item>
    <terra-icon slot="prefix" name="copy" library="system"></terra-icon>
    Duplicate
  </terra-menu-item>
  <terra-menu-item>
    <terra-icon slot="prefix" name="trash" library="system"></terra-icon>
    Delete
  </terra-menu-item>
</terra-menu>
```

### Checkbox Menu Items

Use checkbox menu items for multi-select scenarios.

```html:preview
<terra-menu>
  <terra-menu-item type="checkbox">Option 1</terra-menu-item>
  <terra-menu-item type="checkbox" checked>Option 2</terra-menu-item>
  <terra-menu-item type="checkbox">Option 3</terra-menu-item>
</terra-menu>
```

### Disabled Menu Items

Disable menu items to prevent selection.

```html:preview
<terra-menu>
  <terra-menu-item>Enabled Item</terra-menu-item>
  <terra-menu-item disabled>Disabled Item</terra-menu-item>
  <terra-menu-item>Another Enabled Item</terra-menu-item>
</terra-menu>
```

### Loading Menu Items

Show a loading state on menu items.

```html:preview
<terra-menu>
  <terra-menu-item>Normal Item</terra-menu-item>
  <terra-menu-item loading>Loading Item</terra-menu-item>
  <terra-menu-item>Another Normal Item</terra-menu-item>
</terra-menu>
```

### Menu in Dropdown

Menus are typically used inside dropdowns.

```html:preview
<terra-dropdown>
  <terra-button slot="trigger" caret>Actions</terra-button>
  <terra-menu>
    <terra-menu-item>Edit</terra-menu-item>
    <terra-menu-item>Duplicate</terra-menu-item>
    <terra-menu-item>Delete</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

### Handling Selection

Listen for the `terra-select` event to handle menu item selection.

```html:preview
<terra-menu id="select-menu">
  <terra-menu-item value="edit">Edit</terra-menu-item>
  <terra-menu-item value="duplicate">Duplicate</terra-menu-item>
  <terra-menu-item value="delete">Delete</terra-menu-item>
</terra-menu>

<script>
  const menu = document.getElementById('select-menu');
  menu.addEventListener('terra-select', (event) => {
    alert(`Selected: ${event.detail.item.value || event.detail.item.getTextLabel()}`);
  });
</script>
```

## Accessibility

The menu component follows accessibility best practices:

-   Uses proper ARIA attributes (`role="menu"`)
-   Supports keyboard navigation (Arrow keys, Home, End, Enter, Space)
-   Implements roving tabindex for focus management
-   Works with screen readers

## Keyboard Shortcuts

| Key                | Action                           |
| ------------------ | -------------------------------- |
| `Arrow Down`       | Moves focus to the next item     |
| `Arrow Up`         | Moves focus to the previous item |
| `Home`             | Moves focus to the first item    |
| `End`              | Moves focus to the last item     |
| `Enter` or `Space` | Selects the focused item         |

[component-metadata:terra-menu]
