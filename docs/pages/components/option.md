---
meta:
    title: Option
    description: Options define the selectable items within various form controls such as select.
layout: component
sidebarSection: Elements
---

# Option

Options define the selectable items within various form controls such as `terra-select`.

## Examples

### Basic Option

```html:preview
<terra-select label="Choose an option">
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2">Option 2</terra-option>
  <terra-option value="option3">Option 3</terra-option>
</terra-select>
```

### Selected Option

```html:preview
<terra-select label="Choose an option">
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2" selected>Option 2 (Selected)</terra-option>
  <terra-option value="option3">Option 3</terra-option>
</terra-select>
```

### Disabled Option

```html:preview
<terra-select label="Choose an option">
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2" disabled>Option 2 (Disabled)</terra-option>
  <terra-option value="option3">Option 3</terra-option>
</terra-select>
```

### With Prefix and Suffix Icons

```html:preview
<terra-select label="Choose an option">
  <terra-option value="option1">
    <terra-icon slot="prefix" name="outline-check" library="heroicons"></terra-icon>
    Option 1
    <terra-icon slot="suffix" name="outline-arrow-right" library="heroicons"></terra-icon>
  </terra-option>
  <terra-option value="option2">
    <terra-icon slot="prefix" name="outline-star" library="heroicons"></terra-icon>
    Option 2
  </terra-option>
</terra-select>
```

## Usage

Options are used within `terra-select` components to define the available choices. Each option must have a unique `value` attribute and can include text content or slotted content for more complex labels.

## Best Practices

-   **Unique values**: Each option must have a unique `value` attribute. Values cannot contain spaces.
-   **Clear labels**: Use clear, descriptive text for option labels that help users understand their choices.
-   **Disabled options**: Use the `disabled` attribute to prevent selection of options that are currently unavailable, rather than hiding them.
-   **Selected state**: Use the `selected` attribute to set the default selected option, or let the `terra-select` component manage selection via its `value` property.

## Accessibility

-   Options automatically receive proper ARIA attributes (`role="option"`, `aria-selected`, `aria-disabled`).
-   Keyboard navigation is fully supported (arrow keys to navigate, Enter/Space to select).
-   Screen readers are properly notified of option states and selections.
-   Disabled options are clearly indicated to assistive technologies.

[component-metadata:terra-option]
