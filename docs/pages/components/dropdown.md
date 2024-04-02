---
meta:
  title: Dropdown
  description: 'Dropdowns expose additional content that "drops down" in a panel.'
layout: component
---

Dropdowns consist of a trigger and a panel. By default, activating the trigger will expose the panel and interacting outside of the panel will close it.

Dropdowns are designed to work well with [menus](/components/menu) to provide a list of options the user can select from. However, dropdowns can also be used in lower-level applications (e.g. [color picker](/components/color-picker)). The API gives you complete control over showing, hiding, and positioning the panel.

```html:preview
<gd-dropdown>
  <gd-button slot="trigger" caret>Dropdown</gd-button>
  <gd-menu>
    <gd-menu-item>Dropdown Item 1</gd-menu-item>
    <gd-menu-item>Dropdown Item 2</gd-menu-item>
    <gd-menu-item>Dropdown Item 3</gd-menu-item>
    <gd-divider></gd-divider>
    <gd-menu-item type="checkbox" checked>Checkbox</gd-menu-item>
    <gd-menu-item disabled>Disabled</gd-menu-item>
    <gd-divider></gd-divider>
    <gd-menu-item>
      Prefix
      <gd-icon slot="prefix" name="gift"></gd-icon>
    </gd-menu-item>
    <gd-menu-item>
      Suffix Icon
      <gd-icon slot="suffix" name="heart"></gd-icon>
    </gd-menu-item>
  </gd-menu>
</gd-dropdown>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlDropdown>
    <SlButton slot="trigger" caret>
      Dropdown
    </SlButton>
    <SlMenu>
      <SlMenuItem>Dropdown Item 1</SlMenuItem>
      <SlMenuItem>Dropdown Item 2</SlMenuItem>
      <SlMenuItem>Dropdown Item 3</SlMenuItem>
      <SlDivider />
      <SlMenuItem type="checkbox" checked>
        Checkbox
      </SlMenuItem>
      <SlMenuItem disabled>Disabled</SlMenuItem>
      <SlDivider />
      <SlMenuItem>
        Prefix
        <SlIcon slot="prefix" name="gift" />
      </SlMenuItem>
      <SlMenuItem>
        Suffix Icon
        <SlIcon slot="suffix" name="heart" />
      </SlMenuItem>
    </SlMenu>
  </SlDropdown>
);
```

## Examples

### Getting the Selected Item

When dropdowns are used with [menus](/components/menu), you can listen for the [`gd-select`](/components/menu#events) event to determine which menu item was selected. The menu item element will be exposed in `event.detail.item`. You can set `value` props to make it easier to identify commands.

```html:preview
<div class="dropdown-selection">
  <gd-dropdown>
    <gd-button slot="trigger" caret>Edit</gd-button>
    <gd-menu>
      <gd-menu-item value="cut">Cut</gd-menu-item>
      <gd-menu-item value="copy">Copy</gd-menu-item>
      <gd-menu-item value="paste">Paste</gd-menu-item>
    </gd-menu>
  </gd-dropdown>
</div>

<script>
  const container = document.querySelector('.dropdown-selection');
  const dropdown = container.querySelector('gd-dropdown');

  dropdown.addEventListener('gd-select', event => {
    const selectedItem = event.detail.item;
    console.log(selectedItem.value);
  });
</script>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => {
  function handleSelect(event) {
    const selectedItem = event.detail.item;
    console.log(selectedItem.value);
  }

  return (
    <SlDropdown>
      <SlButton slot="trigger" caret>
        Edit
      </SlButton>
      <SlMenu onSlSelect={handleSelect}>
        <SlMenuItem value="cut">Cut</SlMenuItem>
        <SlMenuItem value="copy">Copy</SlMenuItem>
        <SlMenuItem value="paste">Paste</SlMenuItem>
      </SlMenu>
    </SlDropdown>
  );
};
```

Alternatively, you can listen for the `click` event on individual menu items. Note that, using this approach, disabled menu items will still emit a `click` event.

```html:preview
<div class="dropdown-selection-alt">
  <gd-dropdown>
    <gd-button slot="trigger" caret>Edit</gd-button>
    <gd-menu>
      <gd-menu-item value="cut">Cut</gd-menu-item>
      <gd-menu-item value="copy">Copy</gd-menu-item>
      <gd-menu-item value="paste">Paste</gd-menu-item>
    </gd-menu>
  </gd-dropdown>
</div>

<script>
  const container = document.querySelector('.dropdown-selection-alt');
  const cut = container.querySelector('gd-menu-item[value="cut"]');
  const copy = container.querySelector('gd-menu-item[value="copy"]');
  const paste = container.querySelector('gd-menu-item[value="paste"]');

  cut.addEventListener('click', () => console.log('cut'));
  copy.addEventListener('click', () => console.log('copy'));
  paste.addEventListener('click', () => console.log('paste'));
</script>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => {
  function handleCut() {
    console.log('cut');
  }

  function handleCopy() {
    console.log('copy');
  }

  function handlePaste() {
    console.log('paste');
  }

  return (
    <SlDropdown>
      <SlButton slot="trigger" caret>
        Edit
      </SlButton>
      <SlMenu>
        <SlMenuItem onClick={handleCut}>Cut</SlMenuItem>
        <SlMenuItem onClick={handleCopy}>Copy</SlMenuItem>
        <SlMenuItem onClick={handlePaste}>Paste</SlMenuItem>
      </SlMenu>
    </SlDropdown>
  );
};
```

### Placement

The preferred placement of the dropdown can be set with the `placement` attribute. Note that the actual position may vary to ensure the panel remains in the viewport.

```html:preview
<gd-dropdown placement="top-start">
  <gd-button slot="trigger" caret>Edit</gd-button>
  <gd-menu>
    <gd-menu-item>Cut</gd-menu-item>
    <gd-menu-item>Copy</gd-menu-item>
    <gd-menu-item>Paste</gd-menu-item>
    <gd-divider></gd-divider>
    <gd-menu-item>Find</gd-menu-item>
    <gd-menu-item>Replace</gd-menu-item>
  </gd-menu>
</gd-dropdown>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlDropdown placement="top-start">
    <SlButton slot="trigger" caret>
      Edit
    </SlButton>
    <SlMenu>
      <SlMenuItem>Cut</SlMenuItem>
      <SlMenuItem>Copy</SlMenuItem>
      <SlMenuItem>Paste</SlMenuItem>
      <SlDivider />
      <SlMenuItem>Find</SlMenuItem>
      <SlMenuItem>Replace</SlMenuItem>
    </SlMenu>
  </SlDropdown>
);
```

### Distance

The distance from the panel to the trigger can be customized using the `distance` attribute. This value is specified in pixels.

```html:preview
<gd-dropdown distance="30">
  <gd-button slot="trigger" caret>Edit</gd-button>
  <gd-menu>
    <gd-menu-item>Cut</gd-menu-item>
    <gd-menu-item>Copy</gd-menu-item>
    <gd-menu-item>Paste</gd-menu-item>
    <gd-divider></gd-divider>
    <gd-menu-item>Find</gd-menu-item>
    <gd-menu-item>Replace</gd-menu-item>
  </gd-menu>
</gd-dropdown>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlDropdown distance={30}>
    <SlButton slot="trigger" caret>
      Edit
    </SlButton>
    <SlMenu>
      <SlMenuItem>Cut</SlMenuItem>
      <SlMenuItem>Copy</SlMenuItem>
      <SlMenuItem>Paste</SlMenuItem>
      <SlDivider />
      <SlMenuItem>Find</SlMenuItem>
      <SlMenuItem>Replace</SlMenuItem>
    </SlMenu>
  </SlDropdown>
);
```

### Skidding

The offset of the panel along the trigger can be customized using the `skidding` attribute. This value is specified in pixels.

```html:preview
<gd-dropdown skidding="30">
  <gd-button slot="trigger" caret>Edit</gd-button>
  <gd-menu>
    <gd-menu-item>Cut</gd-menu-item>
    <gd-menu-item>Copy</gd-menu-item>
    <gd-menu-item>Paste</gd-menu-item>
    <gd-divider></gd-divider>
    <gd-menu-item>Find</gd-menu-item>
    <gd-menu-item>Replace</gd-menu-item>
  </gd-menu>
</gd-dropdown>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlDropdown skidding={30}>
    <SlButton slot="trigger" caret>
      Edit
    </SlButton>
    <SlMenu>
      <SlMenuItem>Cut</SlMenuItem>
      <SlMenuItem>Copy</SlMenuItem>
      <SlMenuItem>Paste</SlMenuItem>
      <SlDivider />
      <SlMenuItem>Find</SlMenuItem>
      <SlMenuItem>Replace</SlMenuItem>
    </SlMenu>
  </SlDropdown>
);
```

### Submenus

To create a submenu, nest an `<gd-menu slot="submenu">` element in a [menu item](/components/menu-item).

```html:preview
<gd-dropdown>
  <gd-button slot="trigger" caret>Edit</gd-button>

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
</gd-dropdown>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const css = `
  .dropdown-hoist {
    border: solid 2px var(--gd-panel-border-color);
    padding: var(--gd-spacing-medium);
    overflow: hidden;
  }
`;

const App = () => (
  <>
    <SlDropdown>
      <SlButton slot="trigger" caret>Edit</SlButton>

      <SlMenu style="max-width: 200px;">
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
    </SlDropdown>
  </>
);
```

:::warning
As a UX best practice, avoid using more than one level of submenu when possible.
:::

### Hoisting

Dropdown panels will be clipped if they're inside a container that has `overflow: auto|hidden`. The `hoist` attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. In this case, the panel will be positioned relative to its [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#Identifying_the_containing_block), which is usually the viewport unless an ancestor uses a `transform`, `perspective`, or `filter`. [Refer to this page](https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed) for more details.

```html:preview
<div class="dropdown-hoist">
  <gd-dropdown>
    <gd-button slot="trigger" caret>No Hoist</gd-button>
    <gd-menu>
      <gd-menu-item>Item 1</gd-menu-item>
      <gd-menu-item>Item 2</gd-menu-item>
      <gd-menu-item>Item 3</gd-menu-item>
    </gd-menu>
  </gd-dropdown>

  <gd-dropdown hoist>
    <gd-button slot="trigger" caret>Hoist</gd-button>
    <gd-menu>
      <gd-menu-item>Item 1</gd-menu-item>
      <gd-menu-item>Item 2</gd-menu-item>
      <gd-menu-item>Item 3</gd-menu-item>
    </gd-menu>
  </gd-dropdown>
</div>

<style>
  .dropdown-hoist {
    position: relative;
    border: solid 2px var(--gd-panel-border-color);
    padding: var(--gd-spacing-medium);
    overflow: hidden;
  }
</style>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const css = `
  .dropdown-hoist {
    border: solid 2px var(--gd-panel-border-color);
    padding: var(--gd-spacing-medium);
    overflow: hidden;
  }
`;

const App = () => (
  <>
    <div className="dropdown-hoist">
      <SlDropdown>
        <SlButton slot="trigger" caret>
          No Hoist
        </SlButton>
        <SlMenu>
          <SlMenuItem>Item 1</SlMenuItem>
          <SlMenuItem>Item 2</SlMenuItem>
          <SlMenuItem>Item 3</SlMenuItem>
        </SlMenu>
      </SlDropdown>

      <SlDropdown hoist>
        <SlButton slot="trigger" caret>
          Hoist
        </SlButton>
        <SlMenu>
          <SlMenuItem>Item 1</SlMenuItem>
          <SlMenuItem>Item 2</SlMenuItem>
          <SlMenuItem>Item 3</SlMenuItem>
        </SlMenu>
      </SlDropdown>
    </div>

    <style>{css}</style>
  </>
);
```
