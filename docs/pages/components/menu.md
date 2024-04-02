---
meta:
  title: Menu
  description: Menus provide a list of options for the user to choose from.
layout: component
---

You can use [menu items](/components/menu-item), [menu labels](/components/menu-label), and [dividers](/components/divider) to compose a menu. Menus support keyboard interactions, including type-to-select an option.

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item value="undo">Undo</gd-menu-item>
  <gd-menu-item value="redo">Redo</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-item value="cut">Cut</gd-menu-item>
  <gd-menu-item value="copy">Copy</gd-menu-item>
  <gd-menu-item value="paste">Paste</gd-menu-item>
  <gd-menu-item value="delete">Delete</gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem value="undo">Undo</SlMenuItem>
    <SlMenuItem value="redo">Redo</SlMenuItem>
    <SlDivider />
    <SlMenuItem value="cut">Cut</SlMenuItem>
    <SlMenuItem value="copy">Copy</SlMenuItem>
    <SlMenuItem value="paste">Paste</SlMenuItem>
    <SlMenuItem value="delete">Delete</SlMenuItem>
  </SlMenu>
);
```

{% endraw %}

:::tip
Menus are intended for system menus (dropdown menus, select menus, context menus, etc.). They should not be mistaken for navigation menus which serve a different purpose and have a different semantic meaning. If you're building navigation, use `<nav>` and `<a>` elements instead.
:::

## Examples

### In Dropdowns

Menus work really well when used inside [dropdowns](/components/dropdown).

```html:preview
<gd-dropdown>
  <gd-button slot="trigger" caret>Edit</gd-button>
  <gd-menu>
    <gd-menu-item value="cut">Cut</gd-menu-item>
    <gd-menu-item value="copy">Copy</gd-menu-item>
    <gd-menu-item value="paste">Paste</gd-menu-item>
  </gd-menu>
</gd-dropdown>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlDropdown>
    <SlButton slot="trigger" caret>Edit</SlButton>
    <SlMenu>
      <SlMenuItem value="cut">Cut</SlMenuItem>
      <SlMenuItem value="copy">Copy</SlMenuItem>
      <SlMenuItem value="paste">Paste</SlMenuItem>
    </SlMenu>
  </SlDropdown>
);
```

### Submenus

To create a submenu, nest an `<gd-menu slot="submenu">` in any [menu item](/components/menu-item).

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item value="undo">Undo</gd-menu-item>
  <gd-menu-item value="redo">Redo</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-item value="cut">Cut</gd-menu-item>
  <gd-menu-item value="copy">Copy</gd-menu-item>
  <gd-menu-item value="paste">Paste</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-item>
    Find
    <gd-menu slot="submenu">
      <gd-menu-item value="find">Find…</gd-menu-item>
      <gd-menu-item value="find-previous">Find Next</gd-menu-item>
      <gd-menu-item value="find-next">Find Previous</gd-menu-item>
    </gd-menu>
  </gd-menu-item>
  <gd-menu-item>
    Transformations
    <gd-menu slot="submenu">
      <gd-menu-item value="uppercase">Make uppercase</gd-menu-item>
      <gd-menu-item value="lowercase">Make lowercase</gd-menu-item>
      <gd-menu-item value="capitalize">Capitalize</gd-menu-item>
    </gd-menu>
  </gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem value="undo">Undo</SlMenuItem>
    <SlMenuItem value="redo">Redo</SlMenuItem>
    <SlDivider />
    <SlMenuItem value="cut">Cut</SlMenuItem>
    <SlMenuItem value="copy">Copy</SlMenuItem>
    <SlMenuItem value="paste">Paste</SlMenuItem>
    <SlDivider />
    <SlMenuItem>
      Find
      <SlMenu slot="submenu">
        <SlMenuItem value="find">Find…</SlMenuItem>
        <SlMenuItem value="find-previous">Find Next</SlMenuItem>
        <SlMenuItem value="find-next">Find Previous</SlMenuItem>
      </SlMenu>
    </SlMenuItem>
    <SlMenuItem>
      Transformations
      <SlMenu slot="submenu">
        <SlMenuItem value="uppercase">Make uppercase</SlMenuItem>
        <SlMenuItem value="lowercase">Make lowercase</SlMenuItem>
        <SlMenuItem value="capitalize">Capitalize</SlMenuItem>
      </SlMenu>
    </SlMenuItem>
  </SlMenu>
);
```

:::warning
As a UX best practice, avoid using more than one level of submenus when possible.
:::

{% endraw %}
