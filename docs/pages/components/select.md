---
meta:
  title: Select
  description: Selects allow you to choose items from a menu of predefined options.
layout: component
---

```html:preview
<gd-select>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
  <gd-option value="option-4">Option 4</gd-option>
  <gd-option value="option-5">Option 5</gd-option>
  <gd-option value="option-6">Option 6</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
    <SlOption value="option-4">Option 4</SlOption>
    <SlOption value="option-5">Option 5</SlOption>
    <SlOption value="option-6">Option 6</SlOption>
  </SlSelect>
);
```

:::tip
This component works with standard `<form>` elements. Please refer to the section on [form controls](/getting-started/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Labels

Use the `label` attribute to give the select an accessible label. For labels that contain HTML, use the `label` slot instead.

```html:preview
<gd-select label="Select one">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect label="Select one">
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Help Text

Add descriptive help text to a select with the `help-text` attribute. For help texts that contain HTML, use the `help-text` slot instead.

```html:preview
<gd-select label="Experience" help-text="Please tell us your skill level.">
  <gd-option value="1">Novice</gd-option>
  <gd-option value="2">Intermediate</gd-option>
  <gd-option value="3">Advanced</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect label="Experience" help-text="Please tell us your skill level.">
    <SlOption value="1">Novice</SlOption>
    <SlOption value="2">Intermediate</SlOption>
    <SlOption value="3">Advanced</SlOption>
  </SlSelect>
);
```

### Placeholders

Use the `placeholder` attribute to add a placeholder.

```html:preview
<gd-select placeholder="Select one">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect placeholder="Select one">
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Clearable

Use the `clearable` attribute to make the control clearable. The clear button only appears when an option is selected.

```html:preview
<gd-select clearable value="option-1">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect placeholder="Clearable" clearable>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Filled Selects

Add the `filled` attribute to draw a filled select.

```html:preview
<gd-select filled>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect filled>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Pill

Use the `pill` attribute to give selects rounded edges.

```html:preview
<gd-select pill>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect pill>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Disabled

Use the `disabled` attribute to disable a select.

```html:preview
<gd-select placeholder="Disabled" disabled>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect placeholder="Disabled" disabled>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Multiple

To allow multiple options to be selected, use the `multiple` attribute. It's a good practice to use `clearable` when this option is enabled. To set multiple values at once, set `value` to a space-delimited list of values.

```html:preview
<gd-select label="Select a Few" value="option-1 option-2 option-3" multiple clearable>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
  <gd-option value="option-4">Option 4</gd-option>
  <gd-option value="option-5">Option 5</gd-option>
  <gd-option value="option-6">Option 6</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect label="Select a Few" value={["option-1", "option-2", "option-3"]} multiple clearable>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
    <SlOption value="option-4">Option 4</SlOption>
    <SlOption value="option-5">Option 5</SlOption>
    <SlOption value="option-6">Option 6</SlOption>
  </SlSelect>
);
```

:::tip
Note that multi-select options may wrap, causing the control to expand vertically. You can use the `max-options-visible` attribute to control the maximum number of selected options to show at once.
:::

### Setting Initial Values

Use the `value` attribute to set the initial selection.

When using `multiple`, the `value` _attribute_ uses space-delimited values to select more than one option. Because of this, `<gd-option>` values cannot contain spaces. If you're accessing the `value` _property_ through Javascript, it will be an array.

```html:preview
<gd-select value="option-1 option-2" multiple clearable>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
  <gd-option value="option-4">Option 4</gd-option>
</gd-select>
```

```jsx:react
import SlDivider from '@gesdisc/components/dist/react/divider';
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect value={["option-1", "option-2"]} multiple clearable>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Grouping Options

Use `<gd-divider>` to group listbox items visually. You can also use `<small>` to provide labels, but they won't be announced by most assistive devices.

```html:preview
<gd-select>
  <small>Section 1</small>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
  <gd-divider></gd-divider>
  <small>Section 2</small>
  <gd-option value="option-4">Option 4</gd-option>
  <gd-option value="option-5">Option 5</gd-option>
  <gd-option value="option-6">Option 6</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
    <SlOption value="option-4">Option 4</SlOption>
    <SlOption value="option-5">Option 5</SlOption>
    <SlOption value="option-6">Option 6</SlOption>
  </SlSelect>
);
```

### Sizes

Use the `size` attribute to change a select's size. Note that size does not apply to listbox options.

```html:preview
<gd-select placeholder="Small" size="small">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>

<br />

<gd-select placeholder="Medium" size="medium">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>

<br />

<gd-select placeholder="Large" size="large">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <>
    <SlSelect placeholder="Small" size="small">
      <SlOption value="option-1">Option 1</SlOption>
      <SlOption value="option-2">Option 2</SlOption>
      <SlOption value="option-3">Option 3</SlOption>
    </SlSelect>

    <br />

    <SlSelect placeholder="Medium" size="medium">
      <SlOption value="option-1">Option 1</SlOption>
      <SlOption value="option-2">Option 2</SlOption>
      <SlOption value="option-3">Option 3</SlOption>
    </SlSelect>

    <br />

    <SlSelect placeholder="Large" size="large">
      <SlOption value="option-1">Option 1</SlOption>
      <SlOption value="option-2">Option 2</SlOption>
      <SlOption value="option-3">Option 3</SlOption>
    </SlSelect>
  </>
);
```

### Placement

The preferred placement of the select's listbox can be set with the `placement` attribute. Note that the actual position may vary to ensure the panel remains in the viewport. Valid placements are `top` and `bottom`.

```html:preview
<gd-select placement="top">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect placement="top">
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlDropdown>
);
```

### Prefix Icons

Use the `prefix` slot to prepend an icon to the control.

```html:preview
<gd-select placeholder="Small" size="small" clearable>
  <gd-icon name="house" slot="prefix"></gd-icon>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
<br />
<gd-select placeholder="Medium" size="medium" clearable>
  <gd-icon name="house" slot="prefix"></gd-icon>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
<br />
<gd-select placeholder="Large" size="large" clearable>
  <gd-icon name="house" slot="prefix"></gd-icon>
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2">Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <>
    <SlSelect placeholder="Small" size="small">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlOption value="option-1">Option 1</SlOption>
      <SlOption value="option-2">Option 2</SlOption>
      <SlOption value="option-3">Option 3</SlOption>
    </SlSelect>
    <br />
    <SlSelect placeholder="Medium" size="medium">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlOption value="option-1">Option 1</SlOption>
      <SlOption value="option-2">Option 2</SlOption>
      <SlOption value="option-3">Option 3</SlOption>
    </SlSelect>
    <br />
    <SlSelect placeholder="Large" size="large">
      <SlIcon name="house" slot="prefix"></SlIcon>
      <SlOption value="option-1">Option 1</SlOption>
      <SlOption value="option-2">Option 2</SlOption>
      <SlOption value="option-3">Option 3</SlOption>
    </SlSelect>
  </>
);
```

### Custom Tags

When multiple options can be selected, you can provide custom tags by passing a function to the `getTag` property. Your function can return a string of HTML, a <a href="https://lit.dev/docs/templates/overview/">Lit Template</a>, or an [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). The `getTag()` function will be called for each option. The first argument is an `<gd-option>` element and the second argument is the tag's index (its position in the tag list).

Remember that custom tags are rendered in a shadow root. To style them, you can use the `style` attribute in your template or you can add your own [parts](/getting-started/customizing/#css-parts) and target them with the [`::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) selector.

```html:preview
<gd-select
  placeholder="Select one"
  value="email phone"
  multiple
  clearable
  class="custom-tag"
>
  <gd-option value="email">
    <gd-icon slot="prefix" name="envelope"></gd-icon>
    Email
  </gd-option>
  <gd-option value="phone">
    <gd-icon slot="prefix" name="telephone"></gd-icon>
    Phone
  </gd-option>
  <gd-option value="chat">
    <gd-icon slot="prefix" name="chat-dots"></gd-icon>
    Chat
  </gd-option>
</gd-select>

<script type="module">
  const select = document.querySelector('.custom-tag');

  select.getTag = (option, index) => {
    // Use the same icon used in the <gd-option>
    const name = option.querySelector('gd-icon[slot="prefix"]').name;

    // You can return a string, a Lit Template, or an HTMLElement here
    return `
      <gd-tag removable>
        <gd-icon name="${name}" style="padding-inline-end: .5rem;"></gd-icon>
        ${option.getTextLabel()}
      </gd-tag>
    `;
  };
</script>
```

:::warning
Be sure you trust the content you are outputting! Passing unsanitized user input to `getTag()` can result in XSS vulnerabilities.
:::
