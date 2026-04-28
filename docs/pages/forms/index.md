---
meta:
    title: Forms Overview
    description: Learn how to build accessible, validated forms using Terra UI form components
layout: default
---

# Forms Overview

Forms are essential for collecting user input in web applications. Terra UI provides a comprehensive set of form components that work together seamlessly to create accessible, validated forms that follow the Horizon Design System guidelines.

## Form Components

Terra UI includes the following form components:

-   **[Input](/components/input)** - Text inputs, email, password, number, and more
-   **[Textarea](/components/textarea)** - Multi-line text input for longer content
-   **[Select](/components/select)** - Dropdown select fields with single or multiple selection
-   **[Checkbox](/components/checkbox)** - Checkboxes for multiple selections
-   **[Radio](/components/radio)** - Radio buttons for single selection from a group
-   **[Radio Group](/components/radio-group)** - Groups radio buttons together
-   **[Date Picker](/components/date-picker)** - Date and date range selection
-   **[File Upload](/components/file-upload)** - File upload with drag-and-drop support

## Basic Form Structure

All Terra form components integrate with native HTML forms and support standard form attributes like `name`, `required`, `disabled`, and `form`. Here's a basic example:

```html:preview
<form id="basic-form">
  <terra-input
    label="Full Name"
    name="fullName"
    required
    placeholder="Enter your full name"
  ></terra-input>

  <terra-input
    label="Email"
    name="email"
    type="email"
    required
    placeholder="you@example.com"
    help-text="We'll never share your email."
  ></terra-input>

  <terra-button type="submit" variant="primary">Submit</terra-button>
</form>
```

## Form Layouts

### Single Column Layout

The simplest layout stacks all form fields vertically in a single column. This works well for shorter forms and mobile devices.

```html:preview
<form style="max-width: 500px;">
  <terra-input
    label="First Name"
    name="firstName"
    required
  ></terra-input>

  <terra-input
    label="Last Name"
    name="lastName"
    required
  ></terra-input>

  <terra-input
    label="Email Address"
    name="email"
    type="email"
    required
  ></terra-input>

  <terra-input
    label="Phone Number"
    name="phone"
    type="tel"
    placeholder="(555) 123-4567"
  ></terra-input>

  <div style="margin-top: var(--terra-spacing-medium);">
    <terra-button type="submit" variant="primary">Submit</terra-button>
    <terra-button type="reset" variant="text" style="margin-left: var(--terra-spacing-small);">Reset</terra-button>
  </div>
</form>
```

### Two Column Layout

For longer forms, you can use a two-column layout on larger screens. This makes better use of horizontal space while maintaining readability.

```html:preview
<form style="max-width: 800px;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--terra-spacing-medium);">
    <terra-input
      label="First Name"
      name="firstName"
      required
    ></terra-input>

    <terra-input
      label="Last Name"
      name="lastName"
      required
    ></terra-input>
  </div>

  <div style="margin-top: var(--terra-spacing-medium);">
    <terra-input
      label="Email Address"
      name="email"
      type="email"
      required
    ></terra-input>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--terra-spacing-medium); margin-top: var(--terra-spacing-medium);">
    <terra-input
      label="Phone Number"
      name="phone"
      type="tel"
      placeholder="(555) 123-4567"
    ></terra-input>

    <terra-date-picker
      label="Date of Birth"
      name="dateOfBirth"
    ></terra-date-picker>
  </div>

  <div style="margin-top: var(--terra-spacing-medium);">
    <terra-button type="submit" variant="primary">Submit</terra-button>
    <terra-button type="reset" variant="text" style="margin-left: var(--terra-spacing-small);">Reset</terra-button>
  </div>
</form>
```

### Grouped Fields

Group related fields together using visual separators or fieldset elements for better organization.

```html:preview
<form style="max-width: 600px;">
  <fieldset style="border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium); padding: var(--terra-spacing-medium); margin-bottom: var(--terra-spacing-medium);">
    <legend style="font-weight: var(--terra-font-weight-semibold); color: var(--terra-color-carbon-80); padding: 0 var(--terra-spacing-small);">Personal Information</legend>

    <terra-input
      label="First Name"
      name="firstName"
      required
    ></terra-input>

    <terra-input
      label="Last Name"
      name="lastName"
      required
    ></terra-input>

    <terra-input
      label="Email"
      name="email"
      type="email"
      required
    ></terra-input>

    <terra-textarea
      label="Bio"
      name="bio"
      rows="3"
      placeholder="Tell us about yourself"
    ></terra-textarea>
  </fieldset>

  <fieldset style="border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium); padding: var(--terra-spacing-medium);">
    <legend style="font-weight: var(--terra-font-weight-semibold); color: var(--terra-color-carbon-80); padding: 0 var(--terra-spacing-small);">Preferences</legend>

    <terra-checkbox name="newsletter" value="subscribe">
      Subscribe to newsletter
    </terra-checkbox>

    <terra-checkbox name="updates" value="receive">
      Receive product updates
    </terra-checkbox>
  </fieldset>

  <div style="margin-top: var(--terra-spacing-medium);">
    <terra-button type="submit" variant="primary">Submit</terra-button>
  </div>
</form>
```

## Form Validation

Terra form components support native HTML5 validation and provide visual feedback for invalid states. Components automatically show error states when validation fails.

### Required Fields

Mark fields as required using the `required` attribute. Required fields show an asterisk (\*) next to the label.

```html:preview
<form>
  <terra-input
    label="Email"
    name="email"
    type="email"
    required
    placeholder="you@example.com"
  ></terra-input>

  <terra-button type="submit" variant="primary">Submit</terra-button>
</form>
```

### Validation Patterns

Use the `pattern` attribute to validate input against a regular expression.

```html:preview
<form>
  <terra-input
    label="Phone Number"
    name="phone"
    type="tel"
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    placeholder="555-123-4567"
    help-text="Format: 555-123-4567"
    required
  ></terra-input>

  <terra-button type="submit" variant="primary">Submit</terra-button>
</form>
```

### Custom Validation

You can implement custom validation logic using the `setCustomValidity()` method available on all form controls.

```html:preview
<form id="custom-validation-form">
  <terra-input
    id="username-input"
    label="Username"
    name="username"
    required
    placeholder="Enter username"
    help-text="Username must be at least 3 characters"
  ></terra-input>

  <terra-button type="submit" variant="primary">Submit</terra-button>
</form>

<script>
  const form = document.getElementById('custom-validation-form');
  const input = document.getElementById('username-input');

  input.addEventListener('terra-input', (e) => {
    const value = e.target.value;
    if (value.length > 0 && value.length < 3) {
      input.setCustomValidity('Username must be at least 3 characters');
    } else {
      input.setCustomValidity('');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      alert('Form is valid!');
    } else {
      form.reportValidity();
    }
  });
</script>
```

### Validation States

Form controls automatically receive data attributes that reflect their validation state:

-   `data-required` - The field is required
-   `data-optional` - The field is optional
-   `data-invalid` - The field is currently invalid
-   `data-valid` - The field is currently valid
-   `data-user-invalid` - The field is invalid and the user has interacted with it
-   `data-user-valid` - The field is valid and the user has interacted with it

These attributes can be used to style validation states:

```css
terra-input[data-user-invalid] {
    /* Custom invalid styling */
}
```

## Complete Form Example

Here's a complete example showing various form components working together:

```html:preview
<form id="complete-form" style="max-width: 600px;">
  <h3 style="margin-top: 0; margin-bottom: var(--terra-spacing-medium);">Contact Form</h3>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--terra-spacing-medium);">
    <terra-input
      label="First Name"
      name="firstName"
      required
    ></terra-input>

    <terra-input
      label="Last Name"
      name="lastName"
      required
    ></terra-input>
  </div>

  <terra-input
    label="Email"
    name="email"
    type="email"
    required
    help-text="We'll use this to contact you"
  ></terra-input>

  <terra-input
    label="Phone"
    name="phone"
    type="tel"
    placeholder="(555) 123-4567"
  ></terra-input>

  <terra-select
    label="Subject"
    name="subject"
    required
    help-text="What is this regarding?"
  >
    <terra-option value="">Choose a subject</terra-option>
    <terra-option value="general">General Inquiry</terra-option>
    <terra-option value="support">Support</terra-option>
    <terra-option value="feedback">Feedback</terra-option>
  </terra-select>

  <terra-textarea
    label="Message"
    name="message"
    rows="5"
    required
    help-text="Please provide details about your inquiry"
  ></terra-textarea>

  <terra-radio-group
    label="Preferred Contact Method"
    name="contactMethod"
    value="email"
    required
  >
    <terra-radio value="email">Email</terra-radio>
    <terra-radio value="phone">Phone</terra-radio>
    <terra-radio value="either">Either</terra-radio>
  </terra-radio-group>

  <terra-checkbox name="newsletter" value="subscribe">
    Subscribe to our newsletter
  </terra-checkbox>

  <div style="margin-top: var(--terra-spacing-large); display: flex; gap: var(--terra-spacing-small);">
    <terra-button type="submit" variant="primary">Submit</terra-button>
    <terra-button type="reset" variant="text">Reset</terra-button>
  </div>
</form>

<script>
  document.getElementById('complete-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log('Form data:', data);
    alert('Form submitted! Check the console for form data.');
  });
</script>
```

## Best Practices

1. **Always provide labels** - Every form field should have a clear, descriptive label
2. **Use help text** - Provide guidance on what's expected, especially for complex fields
3. **Mark required fields** - Use the `required` attribute and ensure the asterisk is visible
4. **Group related fields** - Use fieldsets or visual grouping for related information
5. **Provide validation feedback** - Show clear error messages when validation fails
6. **Use appropriate input types** - Choose the right input type (email, tel, number, etc.) for better mobile keyboard support
7. **Test accessibility** - Ensure forms work with screen readers and keyboard navigation
8. **Handle form submission** - Prevent default submission and validate before processing

## Accessibility

All Terra form components are built with accessibility in mind:

-   Labels are properly associated with inputs
-   Required fields are clearly indicated
-   Error states are announced to screen readers
-   Keyboard navigation is fully supported
-   Focus indicators are visible and clear

For more information on individual form components, see their respective documentation pages.
