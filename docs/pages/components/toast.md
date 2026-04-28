---
meta:
    title: Toast
    description: Toasts are used to display brief, non-intrusive notifications that appear temporarily.
layout: component
---

## Toast

Toasts are used to display brief, non-intrusive notifications that appear temporarily. They are perfect for confirming actions, showing status updates, or providing feedback without interrupting the user's workflow.

Toasts automatically appear in a fixed position (top-right by default) and stack vertically when multiple toasts are shown. They can be dismissed by clicking the close button or will automatically hide after a specified duration.

```html:preview
<terra-toast variant="primary" closable>
  <terra-icon slot="icon" name="solid-information-circle" library="heroicons"></terra-icon>
  This is a toast notification.
</terra-toast>

<script type="module">
  await customElements.whenDefined('terra-toast');

  const toast = document.querySelector('terra-toast');
  await toast.updateComplete;
  toast.toast();
</script>
```

## Examples

### Variants

Set the `variant` attribute to change the toast's variant.

```html:preview
<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
  <terra-button id="toast-primary">Primary</terra-button>
  <terra-button id="toast-success">Success</terra-button>
  <terra-button id="toast-neutral">Neutral</terra-button>
  <terra-button id="toast-warning">Warning</terra-button>
  <terra-button id="toast-danger">Danger</terra-button>
</div>

<terra-toast id="toast-primary-toast" variant="primary" closable>
  <terra-icon slot="icon" name="solid-information-circle" library="heroicons"></terra-icon>
  <strong>This is super informative</strong><br />
  You can tell by how pretty the toast is.
</terra-toast>

<terra-toast id="toast-success-toast" variant="success" closable>
  <terra-icon slot="icon" name="solid-check-circle" library="heroicons"></terra-icon>
  <strong>Your changes have been saved</strong><br />
  You can safely exit the app now.
</terra-toast>

<terra-toast id="toast-neutral-toast" variant="neutral" closable>
  <terra-icon slot="icon" name="solid-cog-6-tooth" library="heroicons"></terra-icon>
  <strong>Your settings have been updated</strong><br />
  Settings will take effect on next login.
</terra-toast>

<terra-toast id="toast-warning-toast" variant="warning" closable>
  <terra-icon slot="icon" name="solid-exclamation-triangle" library="heroicons"></terra-icon>
  <strong>Your session has ended</strong><br />
  Please login again to continue.
</terra-toast>

<terra-toast id="toast-danger-toast" variant="danger" closable>
  <terra-icon slot="icon" name="solid-x-circle" library="heroicons"></terra-icon>
  <strong>Your account has been deleted</strong><br />
  We're very sorry to see you go!
</terra-toast>

<script type="module">
  // Wait for custom elements to be defined
  await customElements.whenDefined('terra-toast');

  ['primary', 'success', 'neutral', 'warning', 'danger'].forEach(async (variant) => {
    const button = document.querySelector(`#toast-${variant}`);
    const toast = document.querySelector(`#toast-${variant}-toast`);
    button.addEventListener('click', async () => {
      await toast.updateComplete;
      toast.toast();
    });
  });
</script>
```

### Duration

Set the `duration` attribute to automatically hide a toast after a period of time. The default duration is 3000ms (3 seconds). If the user interacts with the toast (e.g. moves the mouse over it), the timer will restart.

```html:preview
<terra-button id="toast-duration">Show Toast (5 seconds)</terra-button>

<terra-toast id="toast-duration-toast" duration="5000" closable>
  <terra-icon slot="icon" name="solid-information-circle" library="heroicons"></terra-icon>
  This toast will automatically hide itself after five seconds, unless you interact with it.
</terra-toast>

<script type="module">
  await customElements.whenDefined('terra-toast');

  const button = document.querySelector('#toast-duration');
  const toast = document.querySelector('#toast-duration-toast');
  button.addEventListener('click', async () => {
    await toast.updateComplete;
    toast.toast();
  });
</script>
```

### Countdown

Set the `countdown` attribute to display a loading bar that indicates the remaining time the toast will be displayed. This is useful for toasts with relatively long duration.

```html:preview
<terra-button id="toast-countdown">Show Toast with Countdown</terra-button>

<terra-toast id="toast-countdown-toast" duration="10000" countdown="rtl" closable>
  <terra-icon slot="icon" name="solid-information-circle" library="heroicons"></terra-icon>
  You're not stuck, the toast will close after a pretty long duration.
</terra-toast>

<script type="module">
  await customElements.whenDefined('terra-toast');

  const button = document.querySelector('#toast-countdown');
  const toast = document.querySelector('#toast-countdown-toast');
  button.addEventListener('click', async () => {
    await toast.updateComplete;
    toast.toast();
  });
</script>
```

### Without Icons

Icons are optional. Simply omit the `icon` slot if you don't want them.

```html:preview
<terra-button id="toast-no-icon">Show Toast</terra-button>

<terra-toast id="toast-no-icon-toast" closable>
  Nothing fancy here, just a simple toast.
</terra-toast>

<script type="module">
  await customElements.whenDefined('terra-toast');

  const button = document.querySelector('#toast-no-icon');
  const toast = document.querySelector('#toast-no-icon-toast');
  button.addEventListener('click', async () => {
    await toast.updateComplete;
    toast.toast();
  });
</script>
```

### Creating Toasts Imperatively

For convenience, you can create toasts with a function call rather than composing them in your HTML. Use the static `TerraToast.notify()` method to create and display a toast programmatically.

```html:preview
<terra-button id="toast-imperative">Create Toast</terra-button>

<script type="module">
  // Wait for custom elements to be defined
  await customElements.whenDefined('terra-toast');

  // Access TerraToast constructor class for static methods
  const TerraToastClass = customElements.get('terra-toast');

  const button = document.querySelector('#toast-imperative');
  let count = 0;

  button.addEventListener('click', () => {
    TerraToastClass.notify(`This is custom toast #${++count}`, 'primary', 'solid-information-circle', 3000);
  });
</script>
```

You can also create toasts with different variants:

```html:preview
<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
  <terra-button id="toast-notify-primary">Primary</terra-button>
  <terra-button id="toast-notify-success">Success</terra-button>
  <terra-button id="toast-notify-warning">Warning</terra-button>
  <terra-button id="toast-notify-danger">Danger</terra-button>
</div>

<script type="module">
  // Wait for custom elements to be defined
  await customElements.whenDefined('terra-toast');

  // Access TerraToast constructor class for static methods
  const TerraToastClass = customElements.get('terra-toast');

  document.querySelector('#toast-notify-primary').addEventListener('click', () => {
    TerraToastClass.notify('This is a primary toast', 'primary', 'solid-information-circle');
  });

  document.querySelector('#toast-notify-success').addEventListener('click', () => {
    TerraToastClass.notify('Operation completed successfully', 'success', 'solid-check-circle');
  });

  document.querySelector('#toast-notify-warning').addEventListener('click', () => {
    TerraToastClass.notify('Warning: Please review your settings', 'warning', 'solid-exclamation-triangle');
  });

  document.querySelector('#toast-notify-danger').addEventListener('click', () => {
    TerraToastClass.notify('Error: Something went wrong', 'danger', 'solid-x-circle');
  });
</script>
```

### The Toast Stack

The toast stack is a fixed position singleton element created and managed internally. It will be added and removed from the DOM as needed when toasts are shown. When more than one toast is visible, they will stack vertically in the toast stack.

By default, the toast stack is positioned at the top-right of the viewport. You can change its position by targeting `.terra-toast-stack` in your stylesheet. To make toasts appear at the top-left of the viewport, for example, use the following styles:

```css
.terra-toast-stack {
    left: 0;
    right: auto;
}
```

:::tip

By design, it is not possible to show toasts in more than one stack simultaneously. Such behavior is confusing and makes for a poor user experience.

:::

[component-metadata:terra-toast]
