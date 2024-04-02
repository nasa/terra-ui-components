---
meta:
  title: Tab
  description: Tabs are used inside tab groups to represent and activate tab panels.
layout: component
---

```html:preview
<gd-tab>Tab</gd-tab>
<gd-tab active>Active</gd-tab>
<gd-tab closable>Closable</gd-tab>
<gd-tab disabled>Disabled</gd-tab>
```

```jsx:react
import SlTab from '@gesdisc/components/dist/react/tab';

const App = () => (
  <>
    <SlTab>Tab</SlTab>
    <SlTab active>Active</SlTab>
    <SlTab closable>Closable</SlTab>
    <SlTab disabled>Disabled</SlTab>
  </>
);
```

:::tip
Additional demonstrations can be found in the [tab group examples](/components/tab-group).
:::
