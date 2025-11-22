---
meta:
    title: Radio Group
    description: Radio groups are used to group multiple radio buttons so they function as a single form control.
layout: component
sidebarSection: Hidden
---

```html:preview
<terra-radio-group name="example" value="option-1">
  <terra-radio value="option-1">Option 1</terra-radio>
  <terra-radio value="option-2">Option 2</terra-radio>
  <terra-radio value="option-3">Option 3</terra-radio>
</terra-radio-group>
```

## Examples

### Basic Radio Group

Radio groups are used to group multiple radio buttons so they function as a single form control. All radio buttons in a group share the same `name` attribute.

```html:preview
<terra-radio-group name="content-type" value="articles">
  <terra-radio value="articles">Articles</terra-radio>
  <terra-radio value="features">Features</terra-radio>
  <terra-radio value="press-releases">Press Releases</terra-radio>
</terra-radio-group>
```

### With Label

Use the `label` attribute or slot to provide a label for the radio group. Labels are required for proper accessibility.

```html:preview
<terra-radio-group name="priority" value="medium" label="Priority Level">
  <terra-radio value="low">Low</terra-radio>
  <terra-radio value="medium">Medium</terra-radio>
  <terra-radio value="high">High</terra-radio>
</terra-radio-group>
```

### Sizes

The radio group's size will be applied to all child radio buttons.

```html:preview
<terra-radio-group name="size-small" value="option-1" size="small">
  <terra-radio value="option-1">Small</terra-radio>
  <terra-radio value="option-2">Small</terra-radio>
</terra-radio-group>

<terra-radio-group name="size-medium" value="option-1" size="medium" style="margin-top: 1rem;">
  <terra-radio value="option-1">Medium</terra-radio>
  <terra-radio value="option-2">Medium</terra-radio>
</terra-radio-group>

<terra-radio-group name="size-large" value="option-1" size="large" style="margin-top: 1rem;">
  <terra-radio value="option-1">Large</terra-radio>
  <terra-radio value="option-2">Large</terra-radio>
</terra-radio-group>
```

### Required Field

Use the `required` attribute to ensure a selection is made before form submission.

```html:preview
<terra-radio-group name="required-example" required label="Select an Option">
  <terra-radio value="option-1">Option 1</terra-radio>
  <terra-radio value="option-2">Option 2</terra-radio>
  <terra-radio value="option-3">Option 3</terra-radio>
</terra-radio-group>
```

### Help Text

Use the `help-text` attribute or slot to provide additional guidance.

```html:preview
<terra-radio-group
  name="help-text-example"
  value="option-1"
  label="Content Type"
  help-text="Select the type of content you want to filter">
  <terra-radio value="option-1">Articles</terra-radio>
  <terra-radio value="option-2">Features</terra-radio>
  <terra-radio value="option-3">Press Releases</terra-radio>
</terra-radio-group>
```

### Form Integration

Radio groups work seamlessly with native HTML forms.

```html:preview
<form id="content-form">
  <terra-radio-group name="content-type" value="articles" label="Content Type" required>
    <terra-radio value="articles">Articles</terra-radio>
    <terra-radio value="features">Features</terra-radio>
    <terra-radio value="press-releases">Press Releases</terra-radio>
  </terra-radio-group>
</form>
```

## Best Practices

-   **Always include labels**: Radio groups should always have a clear, descriptive label that explains what the selection is for.
-   **Default selection**: Any list of radio buttons should appear with a default selection already made (set the `value` attribute).
-   **Use for single selection**: Radio groups allow users to select only one option from a list. For multiple selections, use Checkboxes instead.
-   **Limit options**: When there are 7 or more options to choose from, use a Select Field instead of radio buttons.
-   **Group related options**: Use a fieldset and legend (or radio-group with label) to group related radio buttons, especially in forms.
-   **Provide help text when needed**: Use help text to clarify what selecting an option will do, especially for filtering or settings.

## Accessibility

-   Radio groups are keyboard accessible and support arrow key navigation between options
-   The component properly associates labels with the radio group using `aria-labelledby`
-   Focus states are clearly visible with a focus ring
-   Required fields are indicated with an asterisk
-   Help text is properly associated with the radio group using `aria-describedby`
-   Radio groups use `role="radiogroup"` for proper ARIA semantics

[component-metadata:terra-radio-group]
