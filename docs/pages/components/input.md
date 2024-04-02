---
meta:
  title: Input
  description: Inputs collect data from the user.
layout: component
---

```html:preview
<gd-input></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput />;
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Labels

Use the `label` attribute to give the input an accessible label. For labels that contain HTML, use the `label` slot instead.

```html:preview
<gd-input label="What is your name?"></gd-input>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput label="What is your name?" />;
```

### Help Text

Add descriptive help text to an input with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<gd-input label="Nickname" help-text="What would you like people to call you?"></gd-input>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput label="Nickname" help-text="What would you like people to call you?" />;
```

### Placeholders

Use the `placeholder` attribute to add a placeholder.

```html:preview
<gd-input placeholder="Type something"></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput placeholder="Type something" />;
```

### Clearable

Add the `clearable` attribute to add a clear button when the input has content.

```html:preview
<gd-input placeholder="Clearable" clearable></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput placeholder="Clearable" clearable />;
```

### Toggle Password

Add the `password-toggle` attribute to add a toggle button that will show the password when activated.

```html:preview
<gd-input type="password" placeholder="Password Toggle" password-toggle></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput type="password" placeholder="Password Toggle" size="medium" password-toggle />;
```

### Filled Inputs

Add the `filled` attribute to draw a filled input.

```html:preview
<gd-input placeholder="Type something" filled></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput placeholder="Type something" filled />;
```

### Disabled

Use the `disabled` attribute to disable an input.

```html:preview
<gd-input placeholder="Disabled" disabled></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => <SlInput placeholder="Disabled" disabled />;
```

### Sizes

Use the `size` attribute to change an input's size.

```html:preview
<gd-input placeholder="Small" size="small"></gd-input>
<br />
<gd-input placeholder="Medium" size="medium"></gd-input>
<br />
<gd-input placeholder="Large" size="large"></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => (
  <>
    <SlInput placeholder="Small" size="small" />
    <br />
    <SlInput placeholder="Medium" size="medium" />
    <br />
    <SlInput placeholder="Large" size="large" />
  </>
);
```

### Pill

Use the `pill` attribute to give inputs rounded edges.

```html:preview
<gd-input placeholder="Small" size="small" pill></gd-input>
<br />
<gd-input placeholder="Medium" size="medium" pill></gd-input>
<br />
<gd-input placeholder="Large" size="large" pill></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => (
  <>
    <SlInput placeholder="Small" size="small" pill />
    <br />
    <SlInput placeholder="Medium" size="medium" pill />
    <br />
    <SlInput placeholder="Large" size="large" pill />
  </>
);
```

### Input Types

The `type` attribute controls the type of input the browser renders.

```html:preview
<gd-input type="email" placeholder="Email"></gd-input>
<br />
<gd-input type="number" placeholder="Number"></gd-input>
<br />
<gd-input type="date" placeholder="Date"></gd-input>
```

```jsx:react
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => (
  <>
    <SlInput type="email" placeholder="Email" />
    <br />
    <SlInput type="number" placeholder="Number" />
    <br />
    <SlInput type="date" placeholder="Date" />
  </>
);
```

### Prefix & Suffix Icons

Use the `prefix` and `suffix` slots to add icons.

```html:preview
<gd-input placeholder="Small" size="small">
  <gd-icon name="house" slot="prefix"></gd-icon>
  <gd-icon name="chat" slot="suffix"></gd-icon>
</gd-input>
<br />
<gd-input placeholder="Medium" size="medium">
  <gd-icon name="house" slot="prefix"></gd-icon>
  <gd-icon name="chat" slot="suffix"></gd-icon>
</gd-input>
<br />
<gd-input placeholder="Large" size="large">
  <gd-icon name="house" slot="prefix"></gd-icon>
  <gd-icon name="chat" slot="suffix"></gd-icon>
</gd-input>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => (
  <>
    <SlInput placeholder="Small" size="small">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlIcon name="chat" slot="suffix"></SlIcon>
    </SlInput>
    <br />
    <SlInput placeholder="Medium" size="medium">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlIcon name="chat" slot="suffix"></SlIcon>
    </SlInput>
    <br />
    <SlInput placeholder="Large" size="large">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlIcon name="chat" slot="suffix"></SlIcon>
    </SlInput>
  </>
);
```

### Customizing Label Position

Use [CSS parts](#css-parts) to customize the way form controls are drawn. This example uses CSS grid to position the label to the left of the control, but the possible orientations are nearly endless. The same technique works for inputs, textareas, radio groups, and similar form controls.

```html:preview
<gd-input class="label-on-left" label="Name" help-text="Enter your name"></gd-input>
<gd-input class="label-on-left" label="Email" type="email" help-text="Enter your email"></gd-input>
<gd-textarea class="label-on-left" label="Bio" help-text="Tell us something about yourself"></gd-textarea>

<style>
  .label-on-left {
    --label-width: 3.75rem;
    --gap-width: 1rem;
  }

  .label-on-left + .label-on-left {
    margin-top: var(--gd-spacing-medium);
  }

  .label-on-left::part(form-control) {
    display: grid;
    grid: auto / var(--label-width) 1fr;
    gap: var(--gd-spacing-3x-small) var(--gap-width);
    align-items: center;
  }

  .label-on-left::part(form-control-label) {
    text-align: right;
  }

  .label-on-left::part(form-control-help-text) {
    grid-column-start: 2;
  }
</style>
```
