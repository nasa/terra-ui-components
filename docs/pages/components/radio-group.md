---
meta:
  title: Radio Group
  description: Radio groups are used to group multiple radios or radio buttons so they function as a single form control.
layout: component
---

```html:preview
<gd-radio-group label="Select an option" name="a" value="1">
  <gd-radio value="1">Option 1</gd-radio>
  <gd-radio value="2">Option 2</gd-radio>
  <gd-radio value="3">Option 3</gd-radio>
</gd-radio-group>
```

```jsx:react
import SlRadio from '@gesdisc/components/dist/react/radio';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="1">
    <SlRadio value="1">Option 1</SlRadio>
    <SlRadio value="2">Option 2</SlRadio>
    <SlRadio value="3">Option 3</SlRadio>
  </SlRadioGroup>
);
```

## Examples

### Help Text

Add descriptive help text to a radio group with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<gd-radio-group label="Select an option" help-text="Choose the most appropriate option." name="a" value="1">
  <gd-radio value="1">Option 1</gd-radio>
  <gd-radio value="2">Option 2</gd-radio>
  <gd-radio value="3">Option 3</gd-radio>
</gd-radio-group>
```

```jsx:react
import SlRadio from '@gesdisc/components/dist/react/radio';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" help-text="Choose the most appropriate option." name="a" value="1">
    <SlRadio value="1">Option 1</SlRadio>
    <SlRadio value="2">Option 2</SlRadio>
    <SlRadio value="3">Option 3</SlRadio>
  </SlRadioGroup>
);
```

### Radio Buttons

[Radio buttons](/components/radio-button) offer an alternate way to display radio controls. In this case, an internal [button group](/components/button-group) is used to group the buttons into a single, cohesive control.

```html:preview
<gd-radio-group label="Select an option" help-text="Select an option that makes you proud." name="a" value="1">
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

### Disabling Options

Radios and radio buttons can be disabled by adding the `disabled` attribute to the respective options inside the radio group.

```html:preview
<gd-radio-group label="Select an option" name="a" value="1">
  <gd-radio value="1">Option 1</gd-radio>
  <gd-radio value="2" disabled>Option 2</gd-radio>
  <gd-radio value="3">Option 3</gd-radio>
</gd-radio-group>
```

```jsx:react
import SlRadio from '@gesdisc/components/dist/react/radio';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => (
  <SlRadioGroup label="Select an option" name="a" value="1">
    <SlRadio value="1">Option 1</SlRadio>
    <SlRadio value="2" disabled>
      Option 2
    </SlRadio>
    <SlRadio value="3">Option 3</SlRadio>
  </SlRadioGroup>
);
```

### Sizing Options

The size of [Radios](/components/radio) and [Radio Buttons](/components/radio-buttons) will be determined by the Radio Group's `size` attribute.

```html preview
<gd-radio-group label="Select an option" size="medium" value="medium" class="radio-group-size">
  <gd-radio value="small">Small</gd-radio>
  <gd-radio value="medium">Medium</gd-radio>
  <gd-radio value="large">Large</gd-radio>
</gd-radio-group>

<script>
  const radioGroup = document.querySelector('.radio-group-size');

  radioGroup.addEventListener('gd-change', () => {
    radioGroup.size = radioGroup.value;
  });
</script>
```

```jsx react
import { useState } from 'react';
import SlRadio from '@gesdisc/components/dist/react/radio';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';

const App = () => {
  const [size, setSize] = useState('medium');

  return (
    <>
      <SlRadioGroup
        label="Select an option"
        size={size}
        value={size}
        class="radio-group-size"
        onSlChange={event => setSize(event.target.value)}
      >
        <SlRadio value="small">Small</SlRadio>
        <SlRadio value="medium">Medium</SlRadio>
        <SlRadio value="large">Large</SlRadio>
      </SlRadioGroup>
    </>
  );
};
```

:::tip
[Radios](/components/radio) and [Radio Buttons](/components/radio-button) also have a `size` attribute. This can be useful in certain compositions, but it will be ignored when used inside of a Radio Group.
:::

### Validation

Setting the `required` attribute to make selecting an option mandatory. If a value has not been selected, it will prevent the form from submitting and display an error message.

```html:preview
<form class="validation">
  <gd-radio-group label="Select an option" name="a" required>
    <gd-radio value="1">Option 1</gd-radio>
    <gd-radio value="2">Option 2</gd-radio>
    <gd-radio value="3">Option 3</gd-radio>
  </gd-radio-group>
  <br />
  <gd-button type="submit" variant="primary">Submit</gd-button>
</form>

<script>
  const form = document.querySelector('.validation');

  // Handle form submit
  form.addEventListener('submit', event => {
    event.preventDefault();
    alert('All fields are valid!');
  });
</script>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlRadio from '@gesdisc/components/dist/react/radio';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';
const App = () => {
  function handleSubmit(event) {
    event.preventDefault();
    alert('All fields are valid!');
  }

  return (
    <form class="custom-validity" onSubmit={handleSubmit}>
      <SlRadioGroup label="Select an option" name="a" required onSlChange={handleChange}>
        <SlRadio value="1">
          Option 1
        </SlRadio>
        <SlRadiovalue="2">
          Option 2
        </SlRadio>
        <SlRadio value="3">
          Option 3
        </SlRadio>
      </SlRadioGroup>
      <br />
      <SlButton type="submit" variant="primary">
        Submit
      </SlButton>
    </form>
  );
};
```

### Custom Validity

Use the `setCustomValidity()` method to set a custom validation message. This will prevent the form from submitting and make the browser display the error message you provide. To clear the error, call this function with an empty string.

```html:preview
<form class="custom-validity">
  <gd-radio-group label="Select an option" name="a" value="1">
    <gd-radio value="1">Not me</gd-radio>
    <gd-radio value="2">Me neither</gd-radio>
    <gd-radio value="3">Choose me</gd-radio>
  </gd-radio-group>
  <br />
  <gd-button type="submit" variant="primary">Submit</gd-button>
</form>

<script>
  const form = document.querySelector('.custom-validity');
  const radioGroup = form.querySelector('gd-radio-group');
  const errorMessage = 'You must choose the last option';

  // Set initial validity as soon as the element is defined
  customElements.whenDefined('gd-radio').then(() => {
    radioGroup.setCustomValidity(errorMessage);
  });

  // Update validity when a selection is made
  form.addEventListener('gd-change', () => {
    const isValid = radioGroup.value === '3';
    radioGroup.setCustomValidity(isValid ? '' : errorMessage);
  });

  // Handle form submit
  form.addEventListener('submit', event => {
    event.preventDefault();
    alert('All fields are valid!');
  });
</script>
```

```jsx:react
import { useEffect, useRef } from 'react';
import SlButton from '@gesdisc/components/dist/react/button';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlRadio from '@gesdisc/components/dist/react/radio';
import SlRadioGroup from '@gesdisc/components/dist/react/radio-group';
const App = () => {
  const radioGroup = useRef(null);
  const errorMessage = 'You must choose this option';

  function handleChange() {
    radioGroup.current.setCustomValidity(radioGroup.current.value === '3' ? '' : errorMessage);
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert('All fields are valid!');
  }

  useEffect(() => {
    radio.current.setCustomValidity(errorMessage);
  }, []);

  return (
    <form class="custom-validity" onSubmit={handleSubmit}>
      <SlRadioGroup ref={radioGroup} label="Select an option" name="a" value="1" onSlChange={handleChange}>
        <SlRadio value="1">Not me</SlRadio>
        <SlRadio value="2">Me neither</SlRadio>
        <SlRadio value="3">Choose me</SlRadio>
      </SlRadioGroup>
      <br />
      <SlButton type="submit" variant="primary">
        Submit
      </SlButton>
    </form>
  );
};
```
