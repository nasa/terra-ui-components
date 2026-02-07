---
meta:
    title: Tab Panel
    description: Tab panels are used inside tabs components to display tabbed content.
layout: component
sidebarSection: Hidden
---

Tab panels are used inside [tabs](/components/tabs) components to display tabbed content. Each tab panel must have a `name` attribute that matches the `panel` attribute of its corresponding [tab](/components/tab).

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="advanced">Advanced</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="advanced">This is the advanced tab panel.</terra-tab-panel>
</terra-tabs>
```

## Usage

Tab panels contain the content that is displayed when their corresponding tab is active. Only one tab panel is visible at a time.

## Best Practices

-   Ensure each tab panel has a unique `name` that matches its corresponding tab's `panel` attribute
-   Keep tab panel content focused and relevant to its tab label
-   Use appropriate heading levels within tab panels for document structure

## Accessibility

Tab panels use proper ARIA attributes (`role="tabpanel"`) and are automatically hidden/shown based on their `active` state. Screen readers will announce tab panel content when it becomes active.

:::tip
Additional demonstrations can be found in the [tabs examples](/components/tabs).
:::
