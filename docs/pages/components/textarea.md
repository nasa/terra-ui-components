---
meta:
    title: Textarea
    description: A textarea component with consistent styling across the design system.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-textarea placeholder="Enter text..."></terra-textarea>
```

## Usage

The Textarea component provides a standardized multi-line text input field with support for labels, help text, and validation. Textareas are used when users need to enter longer text content, such as comments, descriptions, or messages.

```html:preview
<terra-textarea
  label="Message"
  placeholder="Enter your message here..."
  help-text="Please provide as much detail as possible."
></terra-textarea>
```

## Properties

| Property       | Type                                             | Default      | Description                                                   |
| -------------- | ------------------------------------------------ | ------------ | ------------------------------------------------------------- |
| `name`         | `string`                                         | `''`         | The name of the textarea, submitted with form data            |
| `value`        | `string`                                         | `''`         | The current value of the textarea                             |
| `placeholder`  | `string`                                         | `''`         | Placeholder text to show when the textarea is empty           |
| `disabled`     | `boolean`                                        | `false`      | Disables the textarea                                         |
| `readonly`     | `boolean`                                        | `false`      | Makes the textarea read-only                                  |
| `required`     | `boolean`                                        | `false`      | Makes the textarea required (shows asterisk in label)         |
| `autocomplete` | `string`                                         | -            | HTML autocomplete attribute                                   |
| `minlength`    | `number`                                         | -            | Minimum length of text                                        |
| `maxlength`    | `number`                                         | -            | Maximum length of text                                        |
| `rows`         | `number`                                         | -            | Number of visible text lines                                  |
| `cols`         | `number`                                         | -            | Visible width of the textarea (in characters)                 |
| `resize`       | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | `'vertical'` | Controls whether the textarea can be resized                  |
| `label`        | `string`                                         | `''`         | Label text displayed above the textarea                       |
| `hideLabel`    | `boolean`                                        | `false`      | Visually hides the label (still accessible to screen readers) |
| `helpText`     | `string`                                         | `''`         | Help text displayed below the textarea                        |

## Events

| Event           | Description                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `terra-input`   | Emitted when the textarea receives input (fires on every keystroke)                              |
| `terra-change`  | Emitted when the textarea value changes and focus is lost                                        |
| `terra-focus`   | Emitted when the textarea gains focus                                                            |
| `terra-blur`    | Emitted when the textarea loses focus                                                            |
| `terra-invalid` | Emitted when the form control has been checked for validity and its constraints aren't satisfied |

## Slots

| Slot        | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `help-text` | Text that describes how to use the textarea. Alternatively, you can use the `help-text` attribute. |

## Examples

### Basic Textarea

```html:preview
<terra-textarea label="Comments" placeholder="Enter your comments..."></terra-textarea>
```

### With Help Text

```html:preview
<terra-textarea
  label="Description"
  placeholder="Describe your issue..."
  help-text="Please provide a detailed description of the issue you're experiencing."
></terra-textarea>
```

### Required Field

```html:preview
<terra-textarea
  label="Feedback"
  required
  placeholder="Your feedback is important to us"
></terra-textarea>
```

### Disabled State

```html:preview
<terra-textarea
  label="Disabled Textarea"
  value="This textarea cannot be edited"
  disabled
></terra-textarea>
```

### Read-only State

```html:preview
<terra-textarea
  label="Read-only Textarea"
  value="This textarea is read-only"
  readonly
></terra-textarea>
```

### With Rows

```html:preview
<terra-textarea
  label="Message"
  rows="5"
  placeholder="Enter a longer message..."
></terra-textarea>
```

### Resize Options

```html:preview
<div style="display: flex; flex-direction: column; gap: var(--terra-spacing-medium);">
  <terra-textarea
    label="Resize: Vertical (default)"
    resize="vertical"
    placeholder="Can only resize vertically"
  ></terra-textarea>

  <terra-textarea
    label="Resize: Both"
    resize="both"
    placeholder="Can resize both ways"
  ></terra-textarea>

  <terra-textarea
    label="Resize: None"
    resize="none"
    placeholder="Cannot be resized"
  ></terra-textarea>
</div>
```

### With Character Limit

```html:preview
<terra-textarea
  label="Bio"
  maxlength="200"
  placeholder="Tell us about yourself (max 200 characters)"
  help-text="200 characters remaining"
></terra-textarea>
```

### Form Integration

```html:preview
<form>
  <terra-textarea
    name="message"
    label="Message"
    required
    minlength="10"
    placeholder="Enter at least 10 characters"
    help-text="Please enter at least 10 characters"
  ></terra-textarea>
  <br>
  <terra-button type="submit">Submit</terra-button>
</form>
```

## Methods

| Method                                                                    | Description                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------ |
| `focus(options?: FocusOptions): void`                                     | Sets focus on the textarea                             |
| `blur(): void`                                                            | Removes focus from the textarea                        |
| `select(): void`                                                          | Selects all text in the textarea                       |
| `setSelectionRange(start: number, end: number, direction?: string): void` | Sets the text selection range                          |
| `checkValidity(): boolean`                                                | Checks for validity without showing validation message |
| `reportValidity(): boolean`                                               | Checks for validity and shows validation message       |
| `setCustomValidity(message: string): void`                                | Sets a custom validation message                       |
| `getForm(): HTMLFormElement \| null`                                      | Gets the associated form, if one exists                |

## Best Practices

1. **Always provide a label** - Every textarea should have a clear, descriptive label
2. **Use help text** - Provide guidance on what's expected, especially for character limits
3. **Set appropriate rows** - Use the `rows` attribute to set a reasonable initial height
4. **Consider resize behavior** - Use `resize="none"` if you want a fixed size, or `resize="vertical"` (default) for flexible height
5. **Set character limits** - Use `maxlength` for textareas that have character restrictions
6. **Mark required fields** - Use the `required` attribute for mandatory fields
7. **Use placeholder as a hint** - Placeholder text should provide an example, not replace the label

## Accessibility

-   Label is automatically associated with the textarea via `for` attribute
-   Required fields show a visual indicator (red asterisk) and have the `required` attribute
-   Help text is associated with the textarea for screen readers
-   Disabled state is properly conveyed to assistive technologies
-   Hidden labels remain accessible to screen readers
-   Validation states are announced to screen readers

[component-metadata:terra-textarea]
