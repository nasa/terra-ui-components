---
meta:
    title: Alert
    description: Alerts are used to display important messages inline or as toast notifications.
layout: component
---

<!-- TODO: @shoelace-style/shoelace/dist/react/alert needs to be replaced with our dist -->

```html:preview
<terra-alert open>
  <terra-icon  slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
  This is a standard alert. You can customize its content and even the icon.
</terra-alert>

```

```jsx:react
import TerraAlert from '@nasa-terra/components/dist/react/alert';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => (
  <TerraAlert open>
    <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
    This is a standard alert. You can customize its content and even the icon.
  </TerraAlert>
);
```

:::tip
Alerts will not be visible if the open attribute is not present.
:::

## Examples

### Variants

Set the variant attribute to change the alert's variant.

```html:preview
<terra-alert variant="primary" open>
<terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
 <strong>This is super informative</strong><br />
  You can tell by how pretty the alert is.
</terra-alert>
<br />
<terra-alert variant="success" open>
<terra-icon slot="icon" name="outline-check-circle" library="heroicons"></terra-icon>
 <strong>Your changes have been saved </strong><br />
  You can safely exit the app now.
</terra-alert>
<br />
<terra-alert variant="neutral" open>
<terra-icon slot="icon" name="outline-cog-8-tooth" library="heroicons"></terra-icon>
  <strong>Your settings have been updated</strong><br />
  Settings will take effect on next login.
</terra-alert>
<br />
<terra-alert variant="warning" open>
<terra-icon slot="icon" name="outline-exclamation-triangle" library="heroicons"></terra-icon>
 <strong>Your session has ended</strong><br />
  Please login again to continue.
</terra-alert>
<br />
<terra-alert variant="danger" open>
<terra-icon slot="icon" name="outline-shield-exclamation" library="heroicons"></terra-icon>
<strong>Your account has been deleted</strong><br />
  We're very sorry to see you go!
</terra-alert>
```

```jsx:react
import TerraAlert from '@nasa-terra/components/dist/react/alert';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => (
<>
  <TerraAlert variant="primary" open>
    <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
     <strong>This is super informative</strong>
      <br />
      You can tell by how pretty the alert is.
  </TerraAlert>
  <br />
  <TerraAlert variant="success" open>
    <TerraIcon slot="icon" name="outline-check-circle" library="heroicons" />
      <strong>Your changes have been saved </strong><br />
         You can safely exit the app now.
  </TerraAlert>
    <br />
    <TerraAlert variant="neutral" open>
    <TerraIcon slot="icon" name="outline-cog-8-tooth" library="heroicons" />
      <strong>Your settings have been updated</strong><br />
      Settings will take effect on next login.
  </TerraAlert>
  <br />
  <TerraAlert variant="warning" open>
    <TerraIcon slot="icon" name="outline-exclamation-triangle" library="heroicons" />
    <strong>Your session has ended</strong><br />
    Please login again to continue.
  </TerraAlert>
  <br />
  <TerraAlert variant="danger" open>
    <TerraIcon slot="icon" name="outline-shield-exclamation" library="heroicons" />
     <strong>Your account has been deleted</strong><br />
     We're very sorry to see you go!
  </TerraAlert>
  </>
);
```

### Closable

Add the closable attribute to show a close button that will hide the alert.

```html:preview
<terra-alert variant="primary" open closable class="alert-closable">
<terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
  You can close this alert any time!
</terra-alert>

<script>
  const alert = document.querySelector('.alert-closable');
  alert.addEventListener('terra-hide', () => {
    setTimeout(() => (alert.open = true), 2000);
  });
</script>
```

```jsx:react
import { useState } from 'react';
import TerraAlert from '@nasa-terra/components/dist/react/alert';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => {
  const [open, setOpen] = useState(true);

  function handleHide() {
    setOpen(false);
    setTimeout(() => setOpen(true), 2000);
  }

  return (
    <TerraAlert open={open} closable onTerraAfterHide={handleHide}>
      <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
      You can close this alert any time!
    </TerraAlert>
  );
};
```

### Without Icons

Icons are optional. Simply omit the icon slot if you don't want them.

```html:preview
<terra-alert open>
  Nothing fancy here, just a simple alert.
</terra-alert>

```

```jsx:react
import TerraAlert from '@nasa-terra/components/dist/react/alert';

const App = () => (
  <TerraAlert open>
    Nothing fancy here, just a simple alert.
  </TerraAlert>
);
```

### Duration

Set the duration attribute to automatically hide an alert after a period of time. This is useful for alerts that don't require acknowledgement.

```html:preview
<div class="alert-duration">
  <terra-button variant="primary">Show Alert</terra-button>

  <terra-alert variant="primary" duration="3000" closable>
    <terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
   This alert will automatically hide itself after three seconds, unless you interact with it.
  </terra-alert>
</div>

<script>
  const container = document.querySelector('.alert-duration');
  const button = container.querySelector('terra-button');
  const alert = container.querySelector('terra-alert');

  button.addEventListener('click', () => alert.show());
</script>

<style>
  .alert-duration terra-alert {
    margin-top: var(--terra-spacing-medium);
  }
</style>
```

```jsx:react
import { useState } from 'react';
import TerraAlert from '@nasa-terra/components/dist/react/alert';
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const css = `
  .alert-duration terra-alert {
    margin-top: var(--terra-spacing-medium);
  }
`;

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="alert-duration">
        <TerraButton variant="primary" onClick={() => setOpen(true)}>
          Show Alert
        </TerraButton>

        <TerraAlert variant="primary" duration="3000" open={open} closable onTerraAfterHide={() => setOpen(false)}>
          <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
          This alert will automatically hide itself after three seconds, unless you interact with it.
        </TerraAlert>
      </div>

      <style>{css}</style>
    </>
  );
};
```

### Countdown

Set the countdown attribute to display a loading bar that indicates the alert remaining time. This is useful for alerts with relatively long duration.

```html:preview
<div class="alert-countdown">
  <terra-button variant="primary">Show Alert</terra-button>

  <terra-alert variant="primary" duration="10000" countdown="rtl" closable>
    <terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
    You're not stuck, the alert will close after a pretty long duration.
  </terra-alert>
</div>

<script>
  const container = document.querySelector('.alert-countdown');
  const button = container.querySelector('terra-button');
  const alert = container.querySelector('terra-alert');

  button.addEventListener('click', () => alert.show());
</script>

<style>
  .alert-duration terra-alert {
    margin-top: var(--terra-spacing-medium);
  }
</style>
```

```jsx:react
import { useState } from 'react';
import TerraAlert from '@nasa-terra/components/dist/react/alert';
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const css = `
  .alert-duration terra-alert {
    margin-top: var(--terra-spacing-medium);
  }
`;

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="alert-duration">
        <TerraButton variant="primary" onClick={() => setOpen(true)}>
          Show Alert
        </TerraButton>

        <TerraAlert variant="primary"  duration="10000" countdown="rtl" open={open} closable onTerraAfterHide={() => setOpen(false)}>
          <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
           You're not stuck, the alert will close after a pretty long duration.
        </TerraAlert>
      </div>

      <style>{css}</style>
    </>
  );
};
```
