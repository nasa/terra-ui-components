---
meta:
    title: Alert
    description: Alerts are used to display important messages inline or as toast notifications.
layout: component
---

<!-- TODO: @shoelace-style/shoelace/dist/react/alert needs to be replaced with our dist -->

```html:preview
<terra-alert open>
  <terra-icon slot="icon" name="info-circle"></terra-icon>
  <span>This is a standard alert. You can customize its content and even the icon.</span>
</terra-alert>

<terra-alert>This is a test message
</terra-alert>

```

```jsx:react
import TerraAlert from '@nasa-terra/components/dist/react/alert';
import TerraIcon from '@nasa-terra/components/dist/react/icon';
 if (!customElements.get('terra-alert')) {
    customElements.define('terra-alert', TerraAlert);
  }
const App = () => (
  <TerraAlert open>
    <TerraIcon slot="icon" name="info-circle" />
    This is a standard alert. You can customize its content and even the icon.
  </TerraAlert>
);
```

:::tip Alerts will not be visible if the open attribute is not present. :::
