---
meta:
    title: Radio
    description: Radio buttons are a form field used when only a single selection can be made from a list.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-radio>Option 1</terra-radio>
```

## Examples

### Basic Radio Buttons

Radio buttons always include a label and are stacked vertically or horizontally to form a list of options. Any list of radio buttons should appear with a default selection already made.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-radio checked>Option 1</terra-radio>
  <terra-radio>Option 2</terra-radio>
  <terra-radio>Option 3</terra-radio>
</div>
```

### Horizontal Layout

Radio buttons can also be arranged horizontally.

```html:preview
<div style="display: flex; gap: 1.5rem;">
  <terra-radio checked>Yes</terra-radio>
  <terra-radio>No</terra-radio>
</div>
```

### Sizes

Radio buttons come in three sizes: `small`, `medium` (default), and `large`.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-radio size="small" checked>Small</terra-radio>
  <terra-radio size="medium" checked>Medium</terra-radio>
  <terra-radio size="large" checked>Large</terra-radio>
</div>
```

### Disabled State

Use the `disabled` attribute to disable a radio button.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-radio disabled>Disabled unchecked</terra-radio>
  <terra-radio disabled checked>Disabled checked</terra-radio>
</div>
```

### Radio Groups

Radio buttons are typically used within a radio group to ensure only one option can be selected at a time. Use the `terra-radio-group` component to group related radio buttons together. The radio group automatically syncs the `name` attribute to all child radio buttons.

```html:preview
<terra-radio-group name="content-type" value="articles" label="Content Type">
  <terra-radio value="articles">Articles</terra-radio>
  <terra-radio value="features">Features</terra-radio>
  <terra-radio value="press-releases">Press Releases</terra-radio>
</terra-radio-group>
```

When using radio buttons within a radio group, you don't need to set the `name` attribute on individual radio buttons - the group will automatically sync it.

### Form Integration

Radio buttons work seamlessly with native HTML forms.

```html:preview
<form id="content-form">
  <fieldset>
    <legend>Select Content Type</legend>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
      <terra-radio name="content-type" value="articles" checked>Articles</terra-radio>
      <terra-radio name="content-type" value="features">Features</terra-radio>
      <terra-radio name="content-type" value="press-releases">Press Releases</terra-radio>
    </div>
  </fieldset>
</form>
```

## Best Practices

-   **Always include labels**: Radio buttons should always have a clear, descriptive label that explains what the option does.
-   **Stack vertically or horizontally**: Radio buttons can be arranged vertically (most common) or horizontally for simple yes/no choices.
-   **Default selection**: Any list of radio buttons should appear with a default selection already made.
-   **Use for single selection**: Radio buttons allow users to select only one option from a list. For multiple selections, use Checkboxes instead.
-   **Limit options**: When there are 7 or more options to choose from, use a Select Field instead of radio buttons.
-   **Group related options**: Use a fieldset and legend to group related radio buttons, especially in forms.
-   **Mutually exclusive**: Radio buttons are for mutually exclusive choices. If choices are not mutually exclusive, use checkboxes.

## Accessibility

-   Radio buttons are keyboard accessible and can be activated with the Space or Arrow keys
-   The component properly associates labels with the radio input
-   Focus states are clearly visible with a focus ring
-   Radio buttons are properly grouped using `aria-checked` and `role="radio"`
-   When used in a radio group, keyboard navigation between options is handled automatically

[component-metadata:terra-radio]
