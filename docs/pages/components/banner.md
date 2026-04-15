---
meta:
    title: Banner
    description: Banners are used to display important messages outline.
layout: component
---

```html:preview
<terra-banner open>
  <terra-icon  slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
  This is a standard banner. You can customize its content and even the icon.
</terra-banner>
<br />
```

```jsx:react
import TerraBanner from '@nasa-terra/components/dist/react/banner';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => (
  <TerraBanner open>
    <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
    This is a standard banner. You can customize its content and even the icon.
  </TerraBanner>
);
```
:::tip
Banners will not be visible if the open attribute is not present.
:::

## Examples

### Variants

Set the variant attribute to change the banner's variant.

```html:preview
<terra-banner variant="primary" open>
<terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
 <strong>This is super informative</strong><br />
  You can tell by how pretty the banner is.
</terra-banner>
<br />
<terra-banner variant="neutral" open>
<terra-icon slot="icon" name="outline-cog-8-tooth" library="heroicons"></terra-icon>
  <strong>Your settings have been updated</strong><br />
  Settings will take effect on next login.
</terra-banner>
<br />
<terra-banner variant="danger" open>
<terra-icon slot="icon" name="outline-shield-exclamation" library="heroicons"></terra-icon>
<strong>Your account has been deleted</strong><br />
  We're very sorry to see you go!
</terra-banner>
```

```jsx:react
import TerraAlert from '@nasa-terra/components/dist/react/banner';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => (
<>
  <TerraBanner variant="primary" open>
    <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
     <strong>This is super informative</strong>
      <br />
      You can tell by how pretty the banner is.
  </TerraBanner>
  <br />
  <TerraBanner variant="neutral" open>
    <TerraIcon slot="icon" name="outline-cog-8-tooth" library="heroicons" />
      <strong>Your settings have been updated</strong><br />
      Settings will take effect on next login.
  </TerraBanner>
  <br />
  <TerraBanner variant="danger" open>
    <TerraIcon slot="icon" name="outline-shield-exclamation" library="heroicons" />
     <strong>Your account has been deleted</strong><br />
     We're very sorry to see you go!
  </TerraBanner>
  </>
);
```

### Closable

Add the closable attribute to show a close button that will hide the banner.

```html:preview
<terra-banner variant="primary" open closable class="banner--closable">
<terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
  You can close this banner any time!
</terra-banner>

<script>
  const banner = document.querySelector('.banner-closable');
  banner.addEventListener('terra-hide', () => {
    setTimeout(() => (banner.open = true), 2000);
  });
</script>
```

```jsx:react
import { useState } from 'react';
import TerraBanner from '@nasa-terra/components/dist/react/banner';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => {
  const [open, setOpen] = useState(true);

  function handleHide() {
    setOpen(false);
    setTimeout(() => setOpen(true), 2000);
  }

  return (
    <TerraBanner open={open} closable onTerraAfterHide={handleHide}>
      <TerraIcon slot="icon" name="outline-information-circle" library="heroicons" />
      You can close this banner any time!
    </TerraBanner>
  );
};
```

### Without Icons

Icons are optional. Simply omit the icon slot if you don't want them.

```html:preview
<terra-banner open>
  Nothing fancy here, just a simple banner.
</terra-banner>

```

```jsx:react
import TerraBanner from '@nasa-terra/components/dist/react/banner';

const App = () => (
  <TerraBanner open>
    Nothing fancy here, just a simple banner.
  </TerraBanner>
);
```