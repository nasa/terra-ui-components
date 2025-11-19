---
meta:
    title: Input
    description: A text input component with consistent styling across the design system.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-input placeholder="Enter text..."></terra-input>
```

```jsx:react
import TerraInput from '@nasa-terra/components/dist/react/input';

const App = () => <TerraInput placeholder="Enter text..." />;
```

## Usage

The Input component provides a standardized text input field with support for labels, help text, and various input types.

Text fields are used in forms to capture short strings of text. Each field should include a clear label that explains what should be entered. If only some fields in a form are required, indicate required fields by adding "(required)" to the end of the field's label, or use the `required` prop which will show an asterisk.

The component supports help text, which can be used to provide guidance on what type of text is expected, character count limits, accepted characters, etc.

```html:preview
<terra-input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  help-text="We'll never share your email."
></terra-input>
```

## Properties

| Property       | Type                                                                                  | Default  | Description                                                   |
| -------------- | ------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------- |
| `type`         | `'text' \| 'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'url'`           | `'text'` | The type of input                                             |
| `name`         | `string`                                                                              | `''`     | The name of the input, submitted with form data               |
| `value`        | `string`                                                                              | `''`     | The current value of the input                                |
| `placeholder`  | `string`                                                                              | `''`     | Placeholder text to show when the input is empty              |
| `disabled`     | `boolean`                                                                             | `false`  | Disables the input                                            |
| `readonly`     | `boolean`                                                                             | `false`  | Makes the input read-only                                     |
| `required`     | `boolean`                                                                             | `false`  | Makes the input required (shows asterisk in label)            |
| `autocomplete` | `string`                                                                              | -        | HTML autocomplete attribute                                   |
| `minlength`    | `number`                                                                              | -        | Minimum length of text                                        |
| `maxlength`    | `number`                                                                              | -        | Maximum length of text                                        |
| `min`          | `number \| string`                                                                    | -        | Minimum value (for number inputs)                             |
| `max`          | `number \| string`                                                                    | -        | Maximum value (for number inputs)                             |
| `step`         | `number \| 'any'`                                                                     | -        | Step value (for number inputs)                                |
| `pattern`      | `string`                                                                              | -        | Regex pattern for validation                                  |
| `inputMode`    | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | -        | Virtual keyboard hint for mobile devices                      |
| `label`        | `string`                                                                              | `''`     | Label text displayed above the input                          |
| `hideLabel`    | `boolean`                                                                             | `false`  | Visually hides the label (still accessible to screen readers) |
| `helpText`     | `string`                                                                              | `''`     | Help text displayed below the input                           |

## Events

| Event          | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `terra-input`  | Emitted when the input receives input (fires on every keystroke) |
| `terra-change` | Emitted when the input value changes and focus is lost           |
| `terra-focus`  | Emitted when the input gains focus                               |
| `terra-blur`   | Emitted when the input loses focus                               |

## Slots

| Slot     | Description                                             |
| -------- | ------------------------------------------------------- |
| `prefix` | Content to prepend before the input (typically an icon) |
| `suffix` | Content to append after the input (typically an icon)   |

## Examples

### Basic Input

```html:preview
<terra-input label="Username" placeholder="Enter username"></terra-input>
```

### With Help Text

```html:preview
<terra-input
  label="Password"
  type="password"
  help-text="Must be at least 8 characters"
></terra-input>
```

### Required Field

```html:preview
<terra-input
  label="Full Name"
  required
  placeholder="John Doe"
></terra-input>
```

### Disabled State

```html:preview
<terra-input
  label="Disabled Input"
  value="Cannot edit this"
  disabled
></terra-input>
```

### Read-only State

```html:preview
<terra-input
  label="Read-only Input"
  value="This is read-only"
  readonly
></terra-input>
```

### With Prefix Icon

```html:preview
<terra-input label="Email" type="email" placeholder="you@example.com">
  <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
</terra-input>
```

### With Suffix Icon

```html:preview
<terra-input label="Search" type="search" placeholder="Search...">
  <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
</terra-input>
```

### Number Input

```html:preview
<terra-input
  label="Age"
  type="number"
  min="0"
  max="120"
  step="1"
  placeholder="Enter age"
></terra-input>
```

### Phone Number

```html:preview
<terra-input
  label="Phone"
  type="tel"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  placeholder="555-123-4567"
  help-text="Format: 555-123-4567"
></terra-input>
```

### Hidden Label

```html:preview
<terra-input
  label="Search"
  hide-label
  type="search"
  placeholder="Search..."
>
  <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
</terra-input>
```

## Methods

| Method                                                                    | Description                   |
| ------------------------------------------------------------------------- | ----------------------------- |
| `focus(options?: FocusOptions): void`                                     | Sets focus on the input       |
| `blur(): void`                                                            | Removes focus from the input  |
| `select(): void`                                                          | Selects all text in the input |
| `setSelectionRange(start: number, end: number, direction?: string): void` | Sets the text selection range |

## Best Practices

1. Always provide a `label` for accessibility - use `hide-label` if you need to hide it visually
2. Use `help-text` to provide additional context or validation requirements
3. Use appropriate input `type` for better mobile keyboard support
4. Add `required` prop for mandatory fields (shows asterisk indicator)
5. Use `placeholder` as a hint, not as a replacement for labels
6. Consider using prefix/suffix slots for icons to improve visual hierarchy
7. For compact fields (e.g., single email field), you can use `hide-label` and place the label text in the `placeholder`
8. If only some fields in a form are required, indicate required fields. If most fields are required, indicate optional fields with "(optional)" in the label

## Accessibility

-   Label is automatically associated with the input via `for` attribute
-   Required fields show a visual indicator (asterisk) and have the `required` attribute
-   Help text is associated with the input for screen readers
-   Disabled state is properly conveyed to assistive technologies
-   Hidden labels remain accessible to screen readers

[component-metadata:terra-input]
