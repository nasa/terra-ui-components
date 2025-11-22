---
meta:
    title: Tab
    description: Tabs are used inside tabs components to represent and activate tab panels.
layout: component
sidebarSection: Hidden
---

Tabs divide content into meaningful, related sections. Tabs allow users to focus on one specific view at a time while maintaining sight of all the relevant content options available.

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

Tabs are used to browse large amounts of content in a compact footprint. They empower visitors to explore and discover content, or quickly scroll past it if they aren't interested. Tabs are used on topic pages to expose previews of the content that is available on sub-pages.

Tabs can also be used to toggle between different views of the same content set. For example, tabs are used to change the view of content in galleries and search results.

## Examples

### Large Tabs

Large tabs are used in most cases. This is the default size.

```html:preview
<terra-tabs size="large">
  <terra-tab slot="nav" panel="tab-1">Tab 1</terra-tab>
  <terra-tab slot="nav" panel="tab-2">Tab 2</terra-tab>
  <terra-tab slot="nav" panel="tab-3">Tab 3</terra-tab>

  <terra-tab-panel name="tab-1">Tab panel 1</terra-tab-panel>
  <terra-tab-panel name="tab-2">Tab panel 2</terra-tab-panel>
  <terra-tab-panel name="tab-3">Tab panel 3</terra-tab-panel>
</terra-tabs>
```

### Small Tabs

Small tabs are used in more dense UI (like the gallery page).

```html:preview
<terra-tabs size="small">
  <terra-tab slot="nav" panel="tab-1">Tab 1</terra-tab>
  <terra-tab slot="nav" panel="tab-2">Tab 2</terra-tab>
  <terra-tab slot="nav" panel="tab-3">Tab 3</terra-tab>

  <terra-tab-panel name="tab-1">Tab panel 1</terra-tab-panel>
  <terra-tab-panel name="tab-2">Tab panel 2</terra-tab-panel>
  <terra-tab-panel name="tab-3">Tab panel 3</terra-tab-panel>
</terra-tabs>
```

### Icon-Only Tabs

Tabs can also be used with icons instead of text. Place a `<terra-icon>` in the tab's slot.

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="grid">
    <terra-icon name="outline-squares-2x2" library="heroicons"></terra-icon>
  </terra-tab>
  <terra-tab slot="nav" panel="list">
    <terra-icon name="outline-list-bullet" library="heroicons"></terra-icon>
  </terra-tab>
  <terra-tab slot="nav" panel="document">
    <terra-icon name="outline-document-text" library="heroicons"></terra-icon>
  </terra-tab>

  <terra-tab-panel name="grid">Grid view content</terra-tab-panel>
  <terra-tab-panel name="list">List view content</terra-tab-panel>
  <terra-tab-panel name="document">Document view content</terra-tab-panel>
</terra-tabs>
```

### Closable Tabs

Add the `closable` attribute to a tab to show a close button. This example shows how you can dynamically remove tabs from the DOM when the close button is activated.

```html:preview
<terra-tabs class="tabs-closable">
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="closable-1" closable>Closable 1</terra-tab>
  <terra-tab slot="nav" panel="closable-2" closable>Closable 2</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="closable-1">This is the first closable tab panel.</terra-tab-panel>
  <terra-tab-panel name="closable-2">This is the second closable tab panel.</terra-tab-panel>
</terra-tabs>

<script>
  const tabs = document.querySelector('.tabs-closable');

  tabs.addEventListener('terra-close', async event => {
    const tab = event.target;
    const panel = tabs.querySelector(`terra-tab-panel[name="${tab.panel}"]`);

    // Show the previous tab if the tab is currently active
    if (tab.active) {
      tabs.show(tab.previousElementSibling.panel);
    }

    // Remove the tab + panel
    tab.remove();
    panel.remove();
  });
</script>
```

### Disabled Tabs

Tabs can be disabled to prevent selection.

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="disabled" disabled>Disabled</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="disabled">This is a disabled tab panel.</terra-tab-panel>
</terra-tabs>
```

## Best Practices

-   Use tabs to organize related content into distinct sections
-   Keep tab labels concise and descriptive
-   Don't use tabs to switch between drastically different types of content
-   Use large tabs by default; use small tabs in dense UIs
-   For icon-only tabs, ensure icons are recognizable and have tooltips or labels for accessibility

## Accessibility

Tabs are fully keyboard accessible:

-   Use arrow keys to navigate between tabs
-   Press Enter or Space to activate a tab
-   Press Home to jump to the first tab
-   Press End to jump to the last tab

Tabs use proper ARIA attributes for screen readers and maintain focus management for keyboard navigation.
