---
meta:
    title: Tabs
    description: Tabs organize content into a container that shows one section at a time.
layout: component
sidebarSection: Elements
---

Tabs make use of [tab](/components/tab) and [tab panel](/components/tab-panel) components. Each tab must be slotted into the `nav` slot and its `panel` must refer to a tab panel of the same name.

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="advanced">Advanced</terra-tab>
  <terra-tab slot="nav" panel="disabled" disabled>Disabled</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="advanced">This is the advanced tab panel.</terra-tab-panel>
  <terra-tab-panel name="disabled">This is a disabled tab panel.</terra-tab-panel>
</terra-tabs>
```

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

### Tabs on Bottom

Tabs can be shown on the bottom by setting `placement` to `bottom`.

```html:preview
<terra-tabs placement="bottom">
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="advanced">Advanced</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="advanced">This is the advanced tab panel.</terra-tab-panel>
</terra-tabs>
```

### Tabs on Start

Tabs can be shown on the starting side by setting `placement` to `start`.

```html:preview
<terra-tabs placement="start">
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="advanced">Advanced</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="advanced">This is the advanced tab panel.</terra-tab-panel>
</terra-tabs>
```

### Tabs on End

Tabs can be shown on the ending side by setting `placement` to `end`.

```html:preview
<terra-tabs placement="end">
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="advanced">Advanced</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="advanced">This is the advanced tab panel.</terra-tab-panel>
</terra-tabs>
```

### Scrolling Tabs

When there are more tabs than horizontal space allows, the nav will be scrollable with scroll buttons appearing automatically.

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="tab-1">Tab 1</terra-tab>
  <terra-tab slot="nav" panel="tab-2">Tab 2</terra-tab>
  <terra-tab slot="nav" panel="tab-3">Tab 3</terra-tab>
  <terra-tab slot="nav" panel="tab-4">Tab 4</terra-tab>
  <terra-tab slot="nav" panel="tab-5">Tab 5</terra-tab>
  <terra-tab slot="nav" panel="tab-6">Tab 6</terra-tab>
  <terra-tab slot="nav" panel="tab-7">Tab 7</terra-tab>
  <terra-tab slot="nav" panel="tab-8">Tab 8</terra-tab>
  <terra-tab slot="nav" panel="tab-9">Tab 9</terra-tab>
  <terra-tab slot="nav" panel="tab-10">Tab 10</terra-tab>

  <terra-tab-panel name="tab-1">Tab panel 1</terra-tab-panel>
  <terra-tab-panel name="tab-2">Tab panel 2</terra-tab-panel>
  <terra-tab-panel name="tab-3">Tab panel 3</terra-tab-panel>
  <terra-tab-panel name="tab-4">Tab panel 4</terra-tab-panel>
  <terra-tab-panel name="tab-5">Tab panel 5</terra-tab-panel>
  <terra-tab-panel name="tab-6">Tab panel 6</terra-tab-panel>
  <terra-tab-panel name="tab-7">Tab panel 7</terra-tab-panel>
  <terra-tab-panel name="tab-8">Tab panel 8</terra-tab-panel>
  <terra-tab-panel name="tab-9">Tab panel 9</terra-tab-panel>
  <terra-tab-panel name="tab-10">Tab panel 10</terra-tab-panel>
</terra-tabs>
```

### Manual Activation

When focused, keyboard users can press arrow keys to select the desired tab. By default, the corresponding tab panel will be shown immediately (automatic activation). You can change this behavior by setting `activation="manual"` which will require the user to press Space or Enter before showing the tab panel (manual activation).

```html:preview
<terra-tabs activation="manual">
  <terra-tab slot="nav" panel="general">General</terra-tab>
  <terra-tab slot="nav" panel="custom">Custom</terra-tab>
  <terra-tab slot="nav" panel="advanced">Advanced</terra-tab>

  <terra-tab-panel name="general">This is the general tab panel.</terra-tab-panel>
  <terra-tab-panel name="custom">This is the custom tab panel.</terra-tab-panel>
  <terra-tab-panel name="advanced">This is the advanced tab panel.</terra-tab-panel>
</terra-tabs>
```

### Tabs with Icons

Tabs can include icons alongside text labels. Place a `<terra-icon>` inside the tab's default slot along with the text.

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="home">
    <terra-icon name="home" library="heroicons"></terra-icon>
    Home
  </terra-tab>
  <terra-tab slot="nav" panel="settings">
    <terra-icon name="cog-6-tooth" library="heroicons"></terra-icon>
    Settings
  </terra-tab>
  <terra-tab slot="nav" panel="profile">
    <terra-icon name="user" library="heroicons"></terra-icon>
    Profile
  </terra-tab>

  <terra-tab-panel name="home">Home content</terra-tab-panel>
  <terra-tab-panel name="settings">Settings content</terra-tab-panel>
  <terra-tab-panel name="profile">Profile content</terra-tab-panel>
</terra-tabs>
```

### Icon-Only Tabs

Tabs can be icon-only for a more compact interface. Place a `<terra-icon>` directly in the tab's slot without any text.

```html:preview
<terra-tabs>
  <terra-tab slot="nav" panel="grid" title="Grid view">
    <terra-icon name="squares-2x2" library="heroicons"></terra-icon>
  </terra-tab>
  <terra-tab slot="nav" panel="list" title="List view">
    <terra-icon name="list-bullet" library="heroicons"></terra-icon>
  </terra-tab>
  <terra-tab slot="nav" panel="document" title="Document view">
    <terra-icon name="document-text" library="heroicons"></terra-icon>
  </terra-tab>

  <terra-tab-panel name="grid">Grid view content</terra-tab-panel>
  <terra-tab-panel name="list">List view content</terra-tab-panel>
  <terra-tab-panel name="document">Document view content</terra-tab-panel>
</terra-tabs>
```

## Usage

Tabs are used to browse large amounts of content in a compact footprint. They empower visitors to explore and discover content, or quickly scroll past it if they aren't interested. Tabs are used on topic pages to expose previews of the content that is available on sub-pages.

Tabs can also be used to toggle between different views of the same content set. For example, tabs are used to change the view of content in galleries and search results.

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
