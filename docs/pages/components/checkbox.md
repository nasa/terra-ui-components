---
meta:
    title: Checkbox
    description: Checkboxes are a form field used when there are multiple options to select from a list.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-checkbox>Articles</terra-checkbox>
```

## Examples

### Basic Checkbox

Checkboxes always include a label and are stacked vertically to form a list of options.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox>Articles</terra-checkbox>
  <terra-checkbox>Features</terra-checkbox>
  <terra-checkbox>Press Releases</terra-checkbox>
</div>
```

### Checked State

Use the `checked` attribute to set the initial checked state.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox checked>Articles</terra-checkbox>
  <terra-checkbox>Features</terra-checkbox>
  <terra-checkbox checked>Press Releases</terra-checkbox>
</div>
```

### Sizes

Checkboxes come in three sizes: `small`, `medium` (default), and `large`.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox size="small">Small</terra-checkbox>
  <terra-checkbox size="medium">Medium</terra-checkbox>
  <terra-checkbox size="large">Large</terra-checkbox>
</div>
```

### Indeterminate State

The indeterminate state is useful for "select all/none" scenarios when associated checkboxes have a mix of checked and unchecked states.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox indeterminate>Select All</terra-checkbox>
  <terra-checkbox checked>Articles</terra-checkbox>
  <terra-checkbox>Features</terra-checkbox>
  <terra-checkbox checked>Press Releases</terra-checkbox>
</div>
```

### Required Field

Use the `required` attribute to mark a checkbox as required. The label will display an asterisk.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox required>I agree to the terms and conditions</terra-checkbox>
  <terra-checkbox>Subscribe to newsletter (optional)</terra-checkbox>
</div>
```

### Disabled State

Use the `disabled` attribute to disable a checkbox.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox disabled>Disabled unchecked</terra-checkbox>
  <terra-checkbox disabled checked>Disabled checked</terra-checkbox>
</div>
```

### Help Text

Use the `help-text` attribute or slot to provide additional guidance.

```html:preview
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  <terra-checkbox help-text="Select all content types you want to see">
    Content Types
  </terra-checkbox>
  <terra-checkbox>
    Articles
    <span slot="help-text">Published articles and blog posts</span>
  </terra-checkbox>
</div>
```

### Form Integration

Checkboxes work seamlessly with native HTML forms.

```html:preview
<form id="filter-form">
  <fieldset>
    <legend>Filter by Content Type</legend>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
      <terra-checkbox name="content-type" value="articles">Articles</terra-checkbox>
      <terra-checkbox name="content-type" value="features">Features</terra-checkbox>
      <terra-checkbox name="content-type" value="press-releases">Press Releases</terra-checkbox>
    </div>
  </fieldset>
</form>
```

## Best Practices

-   **Always include labels**: Checkboxes should always have a clear, descriptive label that explains what the option does.
-   **Stack vertically**: When multiple checkboxes are used together, stack them vertically to form a clear list of options.
-   **Use for multiple selections**: Checkboxes allow users to select zero, one, or multiple options. For mutually exclusive choices, use Radio Buttons instead.
-   **Group related options**: Use a fieldset and legend to group related checkboxes, especially in forms.
-   **Indicate required fields**: If only some fields in a form are required, indicate required checkbox fields with an asterisk. If most fields are required, indicate optional fields by displaying "(optional)" next to the label.
-   **Provide help text when needed**: Use help text to clarify what selecting an option will do, especially for filtering or settings.

## Accessibility

-   Checkboxes are keyboard accessible and can be activated with the Space key
-   The component properly associates labels with the checkbox input
-   Focus states are clearly visible with a focus ring
-   Required fields are indicated with an asterisk
-   Help text is properly associated with the checkbox using `aria-describedby`

[component-metadata:terra-checkbox]
