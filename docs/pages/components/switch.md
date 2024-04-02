---
meta:
  title: Switch
  description: Switches allow the user to toggle an option on or off.
layout: component
---

```html:preview
<gd-switch>Switch</gd-switch>
```

```jsx:react
import SlSwitch from '@gesdisc/components/dist/react/switch';

const App = () => <SlSwitch>Switch</SlSwitch>;
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Checked

Use the `checked` attribute to activate the switch.

```html:preview
<gd-switch checked>Checked</gd-switch>
```

```jsx:react
import SlSwitch from '@gesdisc/components/dist/react/switch';

const App = () => <SlSwitch checked>Checked</SlSwitch>;
```

### Disabled

Use the `disabled` attribute to disable the switch.

```html:preview
<gd-switch disabled>Disabled</gd-switch>
```

```jsx:react
import SlSwitch from '@gesdisc/components/dist/react/switch';

const App = () => <SlSwitch disabled>Disabled</SlSwitch>;
```

### Sizes

Use the `size` attribute to change a switch's size.

```html:preview
<gd-switch size="small">Small</gd-switch>
<br />
<gd-switch size="medium">Medium</gd-switch>
<br />
<gd-switch size="large">Large</gd-switch>
```

```jsx:react
import SlSwitch from '@gesdisc/components/dist/react/switch';

const App = () => (
  <>
    <SlSwitch size="small">Small</SlSwitch>
    <br />
    <SlSwitch size="medium">Medium</SlSwitch>
    <br />
    <SlSwitch size="large">Large</SlSwitch>
  </>
);
```

### Help Text

Add descriptive help text to a switch with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<gd-switch help-text="What should the user know about the switch?">Label</gd-switch>
```

```jsx:react
import SlSwitch from '@gesdisc/components/dist/react/checkbox';

const App = () => <SlSwitch help-text="What should the user know about the switch?">Label</SlSwitch>;
```

### Custom Styles

Use the available custom properties to change how the switch is styled.

```html:preview
<gd-switch style="--width: 80px; --height: 40px; --thumb-size: 36px;">Really big</gd-switch>
```

{% raw %}

```jsx:react
import SlSwitch from '@gesdisc/components/dist/react/switch';

const App = () => (
  <SlSwitch
    style={{
      '--width': '80px',
      '--height': '32px',
      '--thumb-size': '26px'
    }}
  />
);
```

{% endraw %}
