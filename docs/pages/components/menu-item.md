---
meta:
  title: Menu Item
  description: Menu items provide options for the user to pick from in a menu.
layout: component
---

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item>Option 1</gd-menu-item>
  <gd-menu-item>Option 2</gd-menu-item>
  <gd-menu-item>Option 3</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-item type="checkbox" checked>Checkbox</gd-menu-item>
  <gd-menu-item disabled>Disabled</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-item>
    Prefix Icon
    <gd-icon slot="prefix" name="gift"></gd-icon>
  </gd-menu-item>
  <gd-menu-item>
    Suffix Icon
    <gd-icon slot="suffix" name="heart"></gd-icon>
  </gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem>Option 1</SlMenuItem>
    <SlMenuItem>Option 2</SlMenuItem>
    <SlMenuItem>Option 3</SlMenuItem>
    <SlDivider />
    <SlMenuItem type="checkbox" checked>
      Checkbox
    </SlMenuItem>
    <SlMenuItem disabled>Disabled</SlMenuItem>
    <SlDivider />
    <SlMenuItem>
      Prefix Icon
      <SlIcon slot="prefix" name="gift" />
    </SlMenuItem>
    <SlMenuItem>
      Suffix Icon
      <SlIcon slot="suffix" name="heart" />
    </SlMenuItem>
  </SlMenu>
);
```

{% endraw %}

## Examples

### Prefix & Suffix

Add content to the start and end of menu items using the `prefix` and `suffix` slots.

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item>
    <gd-icon slot="prefix" name="house"></gd-icon>
    Home
  </gd-menu-item>

  <gd-menu-item>
    <gd-icon slot="prefix" name="envelope"></gd-icon>
    Messages
    <gd-badge slot="suffix" variant="primary" pill>12</gd-badge>
  </gd-menu-item>

  <gd-divider></gd-divider>

  <gd-menu-item>
    <gd-icon slot="prefix" name="gear"></gd-icon>
    Settings
  </gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem>
      <SlIcon slot="prefix" name="house" />
      Home
    </SlMenuItem>

    <SlMenuItem>
      <SlIcon slot="prefix" name="envelope" />
      Messages
      <SlBadge slot="suffix" variant="primary" pill>
        12
      </SlBadge>
    </SlMenuItem>

    <SlDivider />

    <SlMenuItem>
      <SlIcon slot="prefix" name="gear" />
      Settings
    </SlMenuItem>
  </SlMenu>
);
```

{% endraw %}

### Disabled

Add the `disabled` attribute to disable the menu item so it cannot be selected.

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item>Option 1</gd-menu-item>
  <gd-menu-item disabled>Option 2</gd-menu-item>
  <gd-menu-item>Option 3</gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem>Option 1</SlMenuItem>
    <SlMenuItem disabled>Option 2</SlMenuItem>
    <SlMenuItem>Option 3</SlMenuItem>
  </SlMenu>
);
```

{% endraw %}

### Loading

Use the `loading` attribute to indicate that a menu item is busy. Like a disabled menu item, clicks will be suppressed until the loading state is removed.

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item>Option 1</gd-menu-item>
  <gd-menu-item loading>Option 2</gd-menu-item>
  <gd-menu-item>Option 3</gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem>Option 1</SlMenuItem>
    <SlMenuItem loading>Option 2</SlMenuItem>
    <SlMenuItem>Option 3</SlMenuItem>
  </SlMenu>
);
```

{% endraw %}

### Checkbox Menu Items

Set the `type` attribute to `checkbox` to create a menu item that will toggle on and off when selected. You can use the `checked` attribute to set the initial state.

Checkbox menu items are visually indistinguishable from regular menu items. Their ability to be toggled is primarily inferred from context, much like you'd find in the menu of a native app.

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-item type="checkbox">Autosave</gd-menu-item>
  <gd-menu-item type="checkbox" checked>Check Spelling</gd-menu-item>
  <gd-menu-item type="checkbox">Word Wrap</gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuItem type="checkbox">Autosave</SlMenuItem>
    <SlMenuItem type="checkbox" checked>
      Check Spelling
    </SlMenuItem>
    <SlMenuItem type="checkbox">Word Wrap</SlMenuItem>
  </SlMenu>
);
```

{% endraw %}

### Value & Selection

The `value` attribute can be used to assign a hidden value, such as a unique identifier, to a menu item. When an item is selected, the `gd-select` event will be emitted and a reference to the item will be available at `event.detail.item`. You can use this reference to access the selected item's value, its checked state, and more.

```html:preview
<gd-menu class="menu-value" style="max-width: 200px;">
  <gd-menu-item value="opt-1">Option 1</gd-menu-item>
  <gd-menu-item value="opt-2">Option 2</gd-menu-item>
  <gd-menu-item value="opt-3">Option 3</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-item type="checkbox" value="opt-4">Checkbox 4</gd-menu-item>
  <gd-menu-item type="checkbox" value="opt-5">Checkbox 5</gd-menu-item>
  <gd-menu-item type="checkbox" value="opt-6">Checkbox 6</gd-menu-item>
</gd-menu>

<script>
  const menu = document.querySelector('.menu-value');

  menu.addEventListener('gd-select', event => {
    const item = event.detail.item;

    // Log value
    if (item.type === 'checkbox') {
      console.log(`Selected value: ${item.value} (${item.checked ? 'checked' : 'unchecked'})`);
    } else {
      console.log(`Selected value: ${item.value}`);
    }
  });
</script>
```

{% raw %}

```jsx:react
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => {
  function handleSelect(event) {
    const item = event.detail.item;

    // Toggle checked state
    item.checked = !item.checked;

    // Log value
    console.log(`Selected value: ${item.value}`);
  }

  return (
    <SlMenu style={{ maxWidth: '200px' }} onSlSelect={handleSelect}>
      <SlMenuItem value="opt-1">Option 1</SlMenuItem>
      <SlMenuItem value="opt-2">Option 2</SlMenuItem>
      <SlMenuItem value="opt-3">Option 3</SlMenuItem>
    </SlMenu>
  );
};
```

{% endraw %}
