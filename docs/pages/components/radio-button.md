---
meta:
  title: Radio Button
  description: Radios buttons allow the user to select a single option from a group using a button-like control.
layout: component
---

Radio buttons are designed to be used with [radio groups](/components/radio-group). When a radio button has focus, the arrow keys can be used to change the selected option just like standard radio controls.

```html:preview
<gd-radio-group label="Select an option" name="a" value="1">
  <gd-radio-button value="1">Option 1</gd-radio-button>
  <gd-radio-button value="2">Option 2</gd-radio-button>
  <gd-radio-button value="3">Option 3</gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="1">
    <SlRadioButton value="1">Option 1</SlRadioButton>
    <SlRadioButton value="2">Option 2</SlRadioButton>
    <SlRadioButton value="3">Option 3</SlRadioButton>
  </SlRadioGroup>
);
```

## Examples

### Checked States

To set the initial value and checked state, use the `value` attribute on the containing radio group.

```html:preview
<gd-radio-group label="Select an option" name="a" value="1">
  <gd-radio-button value="1">Option 1</gd-radio-button>
  <gd-radio-button value="2">Option 2</gd-radio-button>
  <gd-radio-button value="3">Option 3</gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="1">
    <SlRadioButton value="1">Option 1</SlRadioButton>
    <SlRadioButton value="2">Option 2</SlRadioButton>
    <SlRadioButton value="3">Option 3</SlRadioButton>
  </SlRadioGroup>
);
```

### Disabled

Use the `disabled` attribute to disable a radio button.

```html:preview
<gd-radio-group label="Select an option" name="a" value="1">
  <gd-radio-button value="1">Option 1</gd-radio-button>
  <gd-radio-button value="2" disabled>Option 2</gd-radio-button>
  <gd-radio-button value="3">Option 3</gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="1">
    <SlRadioButton value="1">Option 1</SlRadioButton>
    <SlRadioButton value="2" disabled>
      Option 2
    </SlRadioButton>
    <SlRadioButton value="3">Option 3</SlRadioButton>
  </SlRadioGroup>
);
```

### Sizes

Use the `size` attribute to change a radio button's size.

```html:preview
<gd-radio-group size="small" label="Select an option" name="a" value="1">
  <gd-radio-button value="1">Option 1</gd-radio-button>
  <gd-radio-button value="2">Option 2</gd-radio-button>
  <gd-radio-button value="3">Option 3</gd-radio-button>
</gd-radio-group>

<br />

<gd-radio-group size="medium" label="Select an option" name="a" value="1">
  <gd-radio-button value="1">Option 1</gd-radio-button>
  <gd-radio-button value="2">Option 2</gd-radio-button>
  <gd-radio-button value="3">Option 3</gd-radio-button>
</gd-radio-group>

<br />

<gd-radio-group size="large" label="Select an option" name="a" value="1">
  <gd-radio-button value="1">Option 1</gd-radio-button>
  <gd-radio-button value="2">Option 2</gd-radio-button>
  <gd-radio-button value="3">Option 3</gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup size="small" label="Select an option" name="a" value="1">
    <SlRadioButton value="1">Option 1</SlRadioButton>
    <SlRadioButton value="2">Option 2</SlRadioButton>
    <SlRadioButton value="3">Option 3</SlRadioButton>
  </SlRadioGroup>

  <br />

  <SlRadioGroup size="medium" label="Select an option" name="a" value="1">
    <SlRadioButton value="1">Option 1</SlRadioButton>
    <SlRadioButton value="2">Option 2</SlRadioButton>
    <SlRadioButton value="3">Option 3</SlRadioButton>
  </SlRadioGroup>

  <br />

  <SlRadioGroup size="large" label="Select an option" name="a" value="1">
    <SlRadioButton value="1">Option 1</SlRadioButton>
    <SlRadioButton value="2">Option 2</SlRadioButton>
    <SlRadioButton value="3">Option 3</SlRadioButton>
  </SlRadioGroup>
);
```

### Pill Buttons

Use the `pill` attribute to give radio buttons rounded edges.

```html:preview
<gd-radio-group size="small" label="Select an option" name="a" value="1">
  <gd-radio-button pill value="1">Option 1</gd-radio-button>
  <gd-radio-button pill value="2">Option 2</gd-radio-button>
  <gd-radio-button pill value="3">Option 3</gd-radio-button>
</gd-radio-group>

<br />

<gd-radio-group size="medium" label="Select an option" name="a" value="1">
  <gd-radio-button pill value="1">Option 1</gd-radio-button>
  <gd-radio-button pill value="2">Option 2</gd-radio-button>
  <gd-radio-button pill value="3">Option 3</gd-radio-button>
</gd-radio-group>

<br />

<gd-radio-group size="large" label="Select an option" name="a" value="1">
  <gd-radio-button pill value="1">Option 1</gd-radio-button>
  <gd-radio-button pill value="2">Option 2</gd-radio-button>
  <gd-radio-button pill value="3">Option 3</gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup size="small" label="Select an option" name="a" value="1">
    <SlRadioButton pill value="1">Option 1</SlRadioButton>
    <SlRadioButton pill value="2">Option 2</SlRadioButton>
    <SlRadioButton pill value="3">Option 3</SlRadioButton>
  </SlRadioGroup>

  <br />

  <SlRadioGroup size="medium" label="Select an option" name="a" value="1">
    <SlRadioButton pill value="1">Option 1</SlRadioButton>
    <SlRadioButton pill value="2">Option 2</SlRadioButton>
    <SlRadioButton pill value="3">Option 3</SlRadioButton>
  </SlRadioGroup>

  <br />

  <SlRadioGroup size="large" label="Select an option" name="a" value="1">
    <SlRadioButton pill value="1">Option 1</SlRadioButton>
    <SlRadioButton pill value="2">Option 2</SlRadioButton>
    <SlRadioButton pill value="3">Option 3</SlRadioButton>
  </SlRadioGroup>
);
```

### Prefix and Suffix Icons

Use the `prefix` and `suffix` slots to add icons.

```html:preview
<gd-radio-group label="Select an option" name="a" value="1">
  <gd-radio-button value="1">
    <gd-icon slot="prefix" name="archive"></gd-icon>
    Option 1
  </gd-radio-button>

  <gd-radio-button value="2">
    <gd-icon slot="suffix" name="bag"></gd-icon>
    Option 2
  </gd-radio-button>

  <gd-radio-button value="3">
    <gd-icon slot="prefix" name="gift"></gd-icon>
    <gd-icon slot="suffix" name="cart"></gd-icon>
    Option 3
  </gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="1">
    <SlRadioButton value="1">
      <SlIcon slot="prefix" name="archive" />
      Option 1
    </SlRadioButton>

    <SlRadioButton value="2">
      <SlIcon slot="suffix" name="bag" />
      Option 2
    </SlRadioButton>

    <SlRadioButton value="3">
      <SlIcon slot="prefix" name="gift" />
      <SlIcon slot="suffix" name="cart" />
      Option 3
    </SlRadioButton>
  </SlRadioGroup>
);
```

### Buttons with Icons

You can omit button labels and use icons instead. Make sure to set a `label` attribute on each icon so screen readers will announce each option correctly.

```html:preview
<gd-radio-group label="Select an option" name="a" value="neutral">
  <gd-radio-button value="angry">
    <gd-icon name="emoji-angry" label="Angry"></gd-icon>
  </gd-radio-button>

  <gd-radio-button value="sad">
    <gd-icon name="emoji-frown" label="Sad"></gd-icon>
  </gd-radio-button>

  <gd-radio-button value="neutral">
    <gd-icon name="emoji-neutral" label="Neutral"></gd-icon>
  </gd-radio-button>

  <gd-radio-button value="happy">
    <gd-icon name="emoji-smile" label="Happy"></gd-icon>
  </gd-radio-button>

  <gd-radio-button value="laughing">
    <gd-icon name="emoji-laughing" label="Laughing"></gd-icon>
  </gd-radio-button>
</gd-radio-group>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlRadioButton from '@gesdisc/components/dist/react/radio-button';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="neutral">
    <SlRadioButton value="angry">
      <SlIcon name="emoji-angry" label="Angry" />
    </SlRadioButton>

    <SlRadioButton value="sad">
      <SlIcon name="emoji-frown" label="Sad" />
    </SlRadioButton>

    <SlRadioButton value="neutral">
      <SlIcon name="emoji-neutral" label="Neutral" />
    </SlRadioButton>

    <SlRadioButton value="happy">
      <SlIcon name="emoji-smile" label="Happy" />
    </SlRadioButton>

    <SlRadioButton value="laughing">
      <SlIcon name="emoji-laughing" label="Laughing" />
    </SlRadioButton>
  </SlRadioGroup>
);
```
