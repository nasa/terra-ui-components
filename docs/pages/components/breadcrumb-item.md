---
meta:
  title: Breadcrumb Item
  description: Breadcrumb Items are used inside breadcrumbs to represent different links.
layout: component
---

```html:preview
<gd-breadcrumb>
  <gd-breadcrumb-item>
    <gd-icon slot="prefix" name="house"></gd-icon>
    Home
  </gd-breadcrumb-item>
  <gd-breadcrumb-item>Clothing</gd-breadcrumb-item>
  <gd-breadcrumb-item>Shirts</gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import SlBreadcrumb from '@gesdisc/components/dist/react/breadcrumb';
import SlBreadcrumbItem from '@gesdisc/components/dist/react/breadcrumb-item';
import SlIcon from '@gesdisc/components/dist/react/icon';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem>
      <SlIcon slot="prefix" name="house"></SlIcon>
      Home
    </SlBreadcrumbItem>
    <SlBreadcrumbItem>Clothing</SlBreadcrumbItem>
    <SlBreadcrumbItem>Shirts</SlBreadcrumbItem>
  </SlBreadcrumb>
);
```

:::tip
Additional demonstrations can be found in the [breadcrumb examples](/components/breadcrumb).
:::
