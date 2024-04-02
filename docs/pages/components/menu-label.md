---
meta:
  title: Menu Label
  description: Menu labels are used to describe a group of menu items.
layout: component
---

```html:preview
<gd-menu style="max-width: 200px;">
  <gd-menu-label>Fruits</gd-menu-label>
  <gd-menu-item value="apple">Apple</gd-menu-item>
  <gd-menu-item value="banana">Banana</gd-menu-item>
  <gd-menu-item value="orange">Orange</gd-menu-item>
  <gd-divider></gd-divider>
  <gd-menu-label>Vegetables</gd-menu-label>
  <gd-menu-item value="broccoli">Broccoli</gd-menu-item>
  <gd-menu-item value="carrot">Carrot</gd-menu-item>
  <gd-menu-item value="zucchini">Zucchini</gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuLabel from '@gesdisc/components/dist/react/menu-label';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlMenu style={{ maxWidth: '200px' }}>
    <SlMenuLabel>Fruits</SlMenuLabel>
    <SlMenuItem value="apple">Apple</SlMenuItem>
    <SlMenuItem value="banana">Banana</SlMenuItem>
    <SlMenuItem value="orange">Orange</SlMenuItem>
    <SlDivider />
    <SlMenuLabel>Vegetables</SlMenuLabel>
    <SlMenuItem value="broccoli">Broccoli</SlMenuItem>
    <SlMenuItem value="carrot">Carrot</SlMenuItem>
    <SlMenuItem value="zucchini">Zucchini</SlMenuItem>
  </SlMenu>
);
```

{% endraw %}
