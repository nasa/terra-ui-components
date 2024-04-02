---
meta:
  title: Option
  description: Options define the selectable items within various form controls such as select.
layout: component
---

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
  <SlSelect>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2">Option 2</SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

## Examples

### Disabled

Use the `disabled` attribute to disable an option and prevent it from being selected.

```html:preview
<gd-select label="Select one">
  <gd-option value="option-1">Option 1</gd-option>
  <gd-option value="option-2" disabled>Option 2</gd-option>
  <gd-option value="option-3">Option 3</gd-option>
</gd-select>
```

```jsx:react
import SlOption from '@gesdisc/components/dist/react/option';
import SlSelect from '@gesdisc/components/dist/react/select';

const App = () => (
  <SlSelect>
    <SlOption value="option-1">Option 1</SlOption>
    <SlOption value="option-2" disabled>
      Option 2
    </SlOption>
    <SlOption value="option-3">Option 3</SlOption>
  </SlSelect>
);
```

### Prefix & Suffix

Add icons to the start and end of menu items using the `prefix` and `suffix` slots.

```html:preview
<gd-select label="Select one">
  <gd-option value="option-1">
    <gd-icon slot="prefix" name="envelope"></gd-icon>
    Email
    <gd-icon slot="suffix" name="patch-check"></gd-icon>
  </gd-option>

  <gd-option value="option-2">
    <gd-icon slot="prefix" name="telephone"></gd-icon>
    Phone
    <gd-icon slot="suffix" name="patch-check"></gd-icon>
  </gd-option>

  <gd-option value="option-3">
    <gd-icon slot="prefix" name="chat-dots"></gd-icon>
    Chat
    <gd-icon slot="suffix" name="patch-check"></gd-icon>
  </gd-option>
</gd-select>
```
