---
meta:
  title: Tab Panel
  description: Tab panels are used inside tab groups to display tabbed content.
layout: component
---

```html:preview
<gd-tab-group>
  <gd-tab slot="nav" panel="general">General</gd-tab>
  <gd-tab slot="nav" panel="custom">Custom</gd-tab>
  <gd-tab slot="nav" panel="advanced">Advanced</gd-tab>
  <gd-tab slot="nav" panel="disabled" disabled>Disabled</gd-tab>

  <gd-tab-panel name="general">This is the general tab panel.</gd-tab-panel>
  <gd-tab-panel name="custom">This is the custom tab panel.</gd-tab-panel>
  <gd-tab-panel name="advanced">This is the advanced tab panel.</gd-tab-panel>
  <gd-tab-panel name="disabled">This is a disabled tab panel.</gd-tab-panel>
</gd-tab-group>
```

```jsx:react
import SlTab from '@gesdisc/components/dist/react/tab';
import SlTabGroup from '@gesdisc/components/dist/react/tab-group';
import SlTabPanel from '@gesdisc/components/dist/react/tab-panel';

const App = () => (
  <SlTabGroup>
    <SlTab slot="nav" panel="general">
      General
    </SlTab>
    <SlTab slot="nav" panel="custom">
      Custom
    </SlTab>
    <SlTab slot="nav" panel="advanced">
      Advanced
    </SlTab>
    <SlTab slot="nav" panel="disabled" disabled>
      Disabled
    </SlTab>

    <SlTabPanel name="general">This is the general tab panel.</SlTabPanel>
    <SlTabPanel name="custom">This is the custom tab panel.</SlTabPanel>
    <SlTabPanel name="advanced">This is the advanced tab panel.</SlTabPanel>
    <SlTabPanel name="disabled">This is a disabled tab panel.</SlTabPanel>
  </SlTabGroup>
);
```

:::tip
Additional demonstrations can be found in the [tab group examples](/components/tab-group).
:::
