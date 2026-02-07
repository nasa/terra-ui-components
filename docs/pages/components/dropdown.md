---
tag: terra-dropdown
---

# Dropdown

Dropdowns expose additional content that "drops down" in a panel when activated. They're perfect for organizing actions and navigation items.

## Examples

### Basic Dropdown

A simple dropdown with a menu of items.

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

### Placement

The `placement` attribute controls where the dropdown panel appears relative to the trigger.

```html:preview
<div style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem;">
  <terra-dropdown placement="top-start">
    <terra-button slot="trigger" caret>Top Start</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
    </terra-menu>
  </terra-dropdown>

  <terra-dropdown placement="top">
    <terra-button slot="trigger" caret>Top</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
    </terra-menu>
  </terra-dropdown>

  <terra-dropdown placement="top-end">
    <terra-button slot="trigger" caret>Top End</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
    </terra-menu>
  </terra-dropdown>

  <terra-dropdown placement="bottom-start">
    <terra-button slot="trigger" caret>Bottom Start</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
    </terra-menu>
  </terra-dropdown>

  <terra-dropdown placement="bottom">
    <terra-button slot="trigger" caret>Bottom</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
    </terra-menu>
  </terra-dropdown>

  <terra-dropdown placement="bottom-end">
    <terra-button slot="trigger" caret>Bottom End</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
    </terra-menu>
  </terra-dropdown>
</div>
```

### Distance and Skidding

Use the `distance` attribute to set the distance between the trigger and panel, and `skidding` to offset along the trigger.

```html:preview
<terra-dropdown distance="20" skidding="10">
  <terra-button slot="trigger" caret>With Distance</terra-button>
  <terra-menu>
    <terra-menu-item>Item 1</terra-menu-item>
    <terra-menu-item>Item 2</terra-menu-item>
    <terra-menu-item>Item 3</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

### Hover Trigger

By default, dropdowns open on click. Use the `hover` attribute to open the dropdown on mouse hover instead.

```html:preview
<terra-dropdown hover>
  <terra-button slot="trigger" caret>Hover to Open</terra-button>
  <terra-menu>
    <terra-menu-item>Item 1</terra-menu-item>
    <terra-menu-item>Item 2</terra-menu-item>
    <terra-menu-item>Item 3</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

### Hoisting

When a dropdown is inside a container with `overflow: auto` or `overflow: scroll`, the panel might get clipped. Use the `hoist` attribute to render the panel using fixed positioning, which prevents it from being clipped.

```html:preview
<div style="height: 200px; overflow: auto; border: 1px solid var(--terra-color-carbon-20); padding: 1rem;">
  <p>Scroll down to see the dropdown...</p>
  <div style="height: 300px;"></div>
  <terra-dropdown hoist>
    <terra-button slot="trigger" caret>Hoisted Dropdown</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
      <terra-menu-item>Item 3</terra-menu-item>
    </terra-menu>
  </terra-dropdown>
</div>
```

### Stay Open on Select

By default, dropdowns close when an item is selected. Use the `stay-open-on-select` attribute to keep it open for multiple interactions.

```html:preview
<terra-dropdown stay-open-on-select>
  <terra-button slot="trigger" caret>Multiple Actions</terra-button>
  <terra-menu>
    <terra-menu-item>Copy</terra-menu-item>
    <terra-menu-item>Cut</terra-menu-item>
    <terra-menu-item>Paste</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

### Disabled State

Use the `disabled` attribute to prevent the dropdown from opening.

```html:preview
<terra-dropdown disabled>
  <terra-button slot="trigger" caret disabled>Disabled</terra-button>
  <terra-menu>
    <terra-menu-item>Item 1</terra-menu-item>
    <terra-menu-item>Item 2</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

### Sync Width/Height

Use the `sync` attribute to match the dropdown panel's width or height to the trigger element.

```html:preview
<terra-dropdown sync="width">
  <terra-button slot="trigger" caret style="width: 200px;">Wide Dropdown</terra-button>
  <terra-menu>
    <terra-menu-item>Item 1</terra-menu-item>
    <terra-menu-item>Item 2</terra-menu-item>
    <terra-menu-item>Item 3</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

### Checkbox Menu Items

You can use checkbox menu items for multi-select scenarios.

```html:preview
<terra-dropdown stay-open-on-select>
  <terra-button slot="trigger" caret>Select Options</terra-button>
  <terra-menu>
    <terra-menu-item type="checkbox">Option 1</terra-menu-item>
    <terra-menu-item type="checkbox" checked>Option 2</terra-menu-item>
    <terra-menu-item type="checkbox">Option 3</terra-menu-item>
  </terra-menu>
</terra-dropdown>
```

## Accessibility

The dropdown component follows accessibility best practices:

-   Uses proper ARIA attributes (`aria-haspopup`, `aria-expanded`)
-   Supports keyboard navigation (Arrow keys, Home, End, Escape, Tab)
-   Focuses the trigger when the dropdown closes
-   Closes when clicking outside or pressing Escape
-   Works with screen readers

## Keyboard Shortcuts

| Key                | Action                              |
| ------------------ | ----------------------------------- |
| `Space` or `Enter` | Opens/closes the dropdown           |
| `Arrow Down`       | Moves focus to the next item        |
| `Arrow Up`         | Moves focus to the previous item    |
| `Home`             | Moves focus to the first item       |
| `End`              | Moves focus to the last item        |
| `Escape`           | Closes the dropdown                 |
| `Tab`              | Closes the dropdown and moves focus |

[component-metadata:terra-dropdown]
