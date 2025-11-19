---
meta:
    title: Toggle
    description: Togglees allow the user to toggle an option on or off.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-toggle>Toggle</terra-toggle>
```

```jsx:react
import TerraToggle from '@nasa-terra/components/dist/react/toggle';

const App = () => <TerraToggle>Toggle</TerraToggle>;
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Checked

Use the `checked` attribute to activate the toggle.

```html:preview
<terra-toggle checked>Checked</terra-toggle>
```

```jsx:react
import TerraToggle from '@nasa-terra/components/dist/react/toggle';

const App = () => <TerraToggle checked>Checked</TerraToggle>;
```

### Disabled

Use the `disabled` attribute to disable the toggle.

```html:preview
<terra-toggle disabled>Disabled</terra-toggle>
```

```jsx:react
import TerraToggle from '@nasa-terra/components/dist/react/toggle';

const App = () => <TerraToggle disabled>Disabled</TerraToggle>;
```

### Sizes

Use the `size` attribute to change a toggle's size.

```html:preview
<terra-toggle size="small">Small</terra-toggle>
<br />
<terra-toggle size="medium">Medium</terra-toggle>
<br />
<terra-toggle size="large">Large</terra-toggle>
```

```jsx:react
import TerraToggle from '@nasa-terra/components/dist/react/toggle';

const App = () => (
  <>
    <TerraToggle size="small">Small</TerraToggle>
    <br />
    <TerraToggle size="medium">Medium</TerraToggle>
    <br />
    <TerraToggle size="large">Large</TerraToggle>
  </>
);
```

### Help Text

Add descriptive help text to a toggle with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<terra-toggle help-text="What should the user know about the toggle?">Label</terra-toggle>
```

```jsx:react
import TerraToggle from '@nasa-terra/components/dist/react/checkbox';

const App = () => <TerraToggle help-text="What should the user know about the toggle?">Label</TerraToggle>;
```

### Custom Styles

Use the available custom properties to change how the toggle is styled.

```html:preview
<terra-toggle style="--width: 80px; --height: 40px; --thumb-size: 36px;">Really big</terra-toggle>
```

{% raw %}

```jsx:react
import TerraToggle from '@nasa-terra/components/dist/react/toggle';

const App = () => (
  <TerraToggle
    style={{
      '--width': '80px',
      '--height': '32px',
      '--thumb-size': '26px'
    }}
  />
);
```

{% endraw %}
