---
meta:
    title: Select
    description: Select fields are a form field used to select one option from a list.
layout: component
sidebarSection: Elements
---

# Select

Select fields are a form field used to select one option from a list.

## Examples

### Basic Select

```html:preview
<terra-select label="Profession">
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### With Selected Value

```html:preview
<terra-select label="Profession" value="astronaut">
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### With Placeholder

```html:preview
<terra-select label="Profession" placeholder="Choose a profession">
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### Required Field

```html:preview
<terra-select label="Profession" required>
  <terra-option value="">Choose a profession</terra-option>
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### With Help Text

```html:preview
<terra-select
  label="Profession"
  help-text="Select your primary profession or role.">
  <terra-option value="">Choose a profession</terra-option>
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### Disabled State

```html:preview
<terra-select label="Profession" disabled value="astronaut">
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### Multiple Selection

```html:preview
<terra-select label="Select Multiple" multiple>
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2" selected>Option 2</terra-option>
  <terra-option value="option3">Option 3</terra-option>
  <terra-option value="option4" selected>Option 4</terra-option>
</terra-select>
```

### With Clear Button

```html:preview
<terra-select label="Profession" clearable value="astronaut">
  <terra-option value="astronaut">Astronaut</terra-option>
  <terra-option value="engineer">Engineer</terra-option>
  <terra-option value="scientist">Scientist</terra-option>
</terra-select>
```

### Sizes

```html:preview
<terra-select label="Small" size="small" value="option1">
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2">Option 2</terra-option>
</terra-select>

<terra-select label="Medium" size="medium" value="option1" style="margin-top: 1rem;">
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2">Option 2</terra-option>
</terra-select>

<terra-select label="Large" size="large" value="option1" style="margin-top: 1rem;">
  <terra-option value="option1">Option 1</terra-option>
  <terra-option value="option2">Option 2</terra-option>
</terra-select>
```

### With Prefix Icon

```html:preview
<terra-select label="Search Category">
  <terra-icon slot="prefix" name="outline-magnifying-glass" library="heroicons"></terra-icon>
  <terra-option value="">Choose a category</terra-option>
  <terra-option value="articles">Articles</terra-option>
  <terra-option value="features">Features</terra-option>
  <terra-option value="press-releases">Press Releases</terra-option>
</terra-select>
```

### Form Integration

```html:preview
<form id="example-form">
  <terra-select name="profession" label="Profession" required>
    <terra-option value="">Choose a profession</terra-option>
    <terra-option value="astronaut">Astronaut</terra-option>
    <terra-option value="engineer">Engineer</terra-option>
    <terra-option value="scientist">Scientist</terra-option>
  </terra-select>
  <br>
  <terra-button type="submit">Submit</terra-button>
</form>
```

## Usage

Select fields are used in forms to choose one option from a list. Each field should include a clear label that explains what should be selected. Select fields are particularly useful when there are 7 or more options to choose from, as they take up less space than radio buttons.

## Best Practices

-   **Labels**: Always include a clear and concise label for each select field.
-   **Placeholder option**: Include a default option (e.g., "Choose an option") as the first option with an empty value to guide users, or use the `placeholder` attribute.
-   **Number of options**: For lists with less than 7 options, consider using Radio buttons instead of a Select Field for better usability.
-   **Required fields**: If only some fields in a form are required, indicate required select fields by adding "(required)" to the end of the field's label. If most fields in a form are required, indicate optional fields by adding "(optional)" to the end of the label.
-   **Help text**: Use the `help-text` attribute to provide additional guidance on what should be selected or any constraints.
-   **Multiple selection**: Use the `multiple` attribute sparingly, as it can be less intuitive for users. Consider using checkboxes for multiple selections instead.
-   **Clear button**: Use the `clearable` attribute when users may need to quickly reset their selection.

## Accessibility

-   The `terra-select` component is built with accessibility in mind, using proper ARIA attributes and keyboard navigation.
-   Labels are properly associated with the select control using `aria-labelledby`.
-   Required fields are indicated with an asterisk.
-   Help text is provided below the select field for additional context.
-   The component supports keyboard navigation (arrow keys, type-to-select, Enter/Space to select).
-   Focus states are clearly visible with a focus ring.
-   Screen readers are properly notified of value changes.

[component-metadata:terra-select]
