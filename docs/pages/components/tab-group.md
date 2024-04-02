---
meta:
  title: Tab Group
  description: Tab groups organize content into a container that shows one section at a time.
layout: component
---

Tab groups make use of [tabs](/components/tab) and [tab panels](/components/tab-panel). Each tab must be slotted into the `nav` slot and its `panel` must refer to a tab panel of the same name.

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

## Examples

### Tabs on Bottom

Tabs can be shown on the bottom by setting `placement` to `bottom`.

```html:preview
<gd-tab-group placement="bottom">
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
  <SlTabGroup placement="bottom">
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

### Tabs on Start

Tabs can be shown on the starting side by setting `placement` to `start`.

```html:preview
<gd-tab-group placement="start">
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
  <SlTabGroup placement="start">
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

### Tabs on End

Tabs can be shown on the ending side by setting `placement` to `end`.

```html:preview
<gd-tab-group placement="end">
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
  <SlTabGroup placement="end">
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

### Closable Tabs

Add the `closable` attribute to a tab to show a close button. This example shows how you can dynamically remove tabs from the DOM when the close button is activated.

```html:preview
<gd-tab-group class="tabs-closable">
  <gd-tab slot="nav" panel="general">General</gd-tab>
  <gd-tab slot="nav" panel="closable-1" closable>Closable 1</gd-tab>
  <gd-tab slot="nav" panel="closable-2" closable>Closable 2</gd-tab>
  <gd-tab slot="nav" panel="closable-3" closable>Closable 3</gd-tab>

  <gd-tab-panel name="general">This is the general tab panel.</gd-tab-panel>
  <gd-tab-panel name="closable-1">This is the first closable tab panel.</gd-tab-panel>
  <gd-tab-panel name="closable-2">This is the second closable tab panel.</gd-tab-panel>
  <gd-tab-panel name="closable-3">This is the third closable tab panel.</gd-tab-panel>
</gd-tab-group>

<script>
  const tabGroup = document.querySelector('.tabs-closable');

  tabGroup.addEventListener('gd-close', async event => {
    const tab = event.target;
    const panel = tabGroup.querySelector(`gd-tab-panel[name="${tab.panel}"]`);

    // Show the previous tab if the tab is currently active
    if (tab.active) {
      tabGroup.show(tab.previousElementSibling.panel);
    }

    // Remove the tab + panel
    tab.remove();
    panel.remove();
  });
</script>
```

```jsx:react
import SlTab from '@gesdisc/components/dist/react/tab';
import SlTabGroup from '@gesdisc/components/dist/react/tab-group';
import SlTabPanel from '@gesdisc/components/dist/react/tab-panel';

const App = () => {
  function handleClose(event) {
    //
    // This is a crude example that removes the tab and its panel from the DOM.
    // There are better ways to manage tab creation/removal in React, but that
    // would significantly complicate the example.
    //
    const tab = event.target;
    const tabGroup = tab.closest('gd-tab-group');
    const tabPanel = tabGroup.querySelector(`[aria-labelledby="${tab.id}"]`);

    tab.remove();
    tabPanel.remove();
  }

  return (
    <SlTabGroup className="tabs-closable" onSlClose={handleClose}>
      <SlTab slot="nav" panel="general">
        General
      </SlTab>
      <SlTab slot="nav" panel="closable-1" closable onSlClose={handleClose}>
        Closable 1
      </SlTab>
      <SlTab slot="nav" panel="closable-2" closable onSlClose={handleClose}>
        Closable 2
      </SlTab>
      <SlTab slot="nav" panel="closable-3" closable onSlClose={handleClose}>
        Closable 3
      </SlTab>

      <SlTabPanel name="general">This is the general tab panel.</SlTabPanel>
      <SlTabPanel name="closable-1">This is the first closable tab panel.</SlTabPanel>
      <SlTabPanel name="closable-2">This is the second closable tab panel.</SlTabPanel>
      <SlTabPanel name="closable-3">This is the third closable tab panel.</SlTabPanel>
    </SlTabGroup>
  );
};
```

### Scrolling Tabs

When there are more tabs than horizontal space allows, the nav will be scrollable.

```html:preview
<gd-tab-group>
  <gd-tab slot="nav" panel="tab-1">Tab 1</gd-tab>
  <gd-tab slot="nav" panel="tab-2">Tab 2</gd-tab>
  <gd-tab slot="nav" panel="tab-3">Tab 3</gd-tab>
  <gd-tab slot="nav" panel="tab-4">Tab 4</gd-tab>
  <gd-tab slot="nav" panel="tab-5">Tab 5</gd-tab>
  <gd-tab slot="nav" panel="tab-6">Tab 6</gd-tab>
  <gd-tab slot="nav" panel="tab-7">Tab 7</gd-tab>
  <gd-tab slot="nav" panel="tab-8">Tab 8</gd-tab>
  <gd-tab slot="nav" panel="tab-9">Tab 9</gd-tab>
  <gd-tab slot="nav" panel="tab-10">Tab 10</gd-tab>
  <gd-tab slot="nav" panel="tab-11">Tab 11</gd-tab>
  <gd-tab slot="nav" panel="tab-12">Tab 12</gd-tab>
  <gd-tab slot="nav" panel="tab-13">Tab 13</gd-tab>
  <gd-tab slot="nav" panel="tab-14">Tab 14</gd-tab>
  <gd-tab slot="nav" panel="tab-15">Tab 15</gd-tab>
  <gd-tab slot="nav" panel="tab-16">Tab 16</gd-tab>
  <gd-tab slot="nav" panel="tab-17">Tab 17</gd-tab>
  <gd-tab slot="nav" panel="tab-18">Tab 18</gd-tab>
  <gd-tab slot="nav" panel="tab-19">Tab 19</gd-tab>
  <gd-tab slot="nav" panel="tab-20">Tab 20</gd-tab>

  <gd-tab-panel name="tab-1">Tab panel 1</gd-tab-panel>
  <gd-tab-panel name="tab-2">Tab panel 2</gd-tab-panel>
  <gd-tab-panel name="tab-3">Tab panel 3</gd-tab-panel>
  <gd-tab-panel name="tab-4">Tab panel 4</gd-tab-panel>
  <gd-tab-panel name="tab-5">Tab panel 5</gd-tab-panel>
  <gd-tab-panel name="tab-6">Tab panel 6</gd-tab-panel>
  <gd-tab-panel name="tab-7">Tab panel 7</gd-tab-panel>
  <gd-tab-panel name="tab-8">Tab panel 8</gd-tab-panel>
  <gd-tab-panel name="tab-9">Tab panel 9</gd-tab-panel>
  <gd-tab-panel name="tab-10">Tab panel 10</gd-tab-panel>
  <gd-tab-panel name="tab-11">Tab panel 11</gd-tab-panel>
  <gd-tab-panel name="tab-12">Tab panel 12</gd-tab-panel>
  <gd-tab-panel name="tab-13">Tab panel 13</gd-tab-panel>
  <gd-tab-panel name="tab-14">Tab panel 14</gd-tab-panel>
  <gd-tab-panel name="tab-15">Tab panel 15</gd-tab-panel>
  <gd-tab-panel name="tab-16">Tab panel 16</gd-tab-panel>
  <gd-tab-panel name="tab-17">Tab panel 17</gd-tab-panel>
  <gd-tab-panel name="tab-18">Tab panel 18</gd-tab-panel>
  <gd-tab-panel name="tab-19">Tab panel 19</gd-tab-panel>
  <gd-tab-panel name="tab-20">Tab panel 20</gd-tab-panel>
</gd-tab-group>
```

```jsx:react
import SlTab from '@gesdisc/components/dist/react/tab';
import SlTabGroup from '@gesdisc/components/dist/react/tab-group';
import SlTabPanel from '@gesdisc/components/dist/react/tab-panel';

const App = () => (
  <SlTabGroup>
    <SlTab slot="nav" panel="tab-1">
      Tab 1
    </SlTab>
    <SlTab slot="nav" panel="tab-2">
      Tab 2
    </SlTab>
    <SlTab slot="nav" panel="tab-3">
      Tab 3
    </SlTab>
    <SlTab slot="nav" panel="tab-4">
      Tab 4
    </SlTab>
    <SlTab slot="nav" panel="tab-5">
      Tab 5
    </SlTab>
    <SlTab slot="nav" panel="tab-6">
      Tab 6
    </SlTab>
    <SlTab slot="nav" panel="tab-7">
      Tab 7
    </SlTab>
    <SlTab slot="nav" panel="tab-8">
      Tab 8
    </SlTab>
    <SlTab slot="nav" panel="tab-9">
      Tab 9
    </SlTab>
    <SlTab slot="nav" panel="tab-10">
      Tab 10
    </SlTab>
    <SlTab slot="nav" panel="tab-11">
      Tab 11
    </SlTab>
    <SlTab slot="nav" panel="tab-12">
      Tab 12
    </SlTab>
    <SlTab slot="nav" panel="tab-13">
      Tab 13
    </SlTab>
    <SlTab slot="nav" panel="tab-14">
      Tab 14
    </SlTab>
    <SlTab slot="nav" panel="tab-15">
      Tab 15
    </SlTab>
    <SlTab slot="nav" panel="tab-16">
      Tab 16
    </SlTab>
    <SlTab slot="nav" panel="tab-17">
      Tab 17
    </SlTab>
    <SlTab slot="nav" panel="tab-18">
      Tab 18
    </SlTab>
    <SlTab slot="nav" panel="tab-19">
      Tab 19
    </SlTab>
    <SlTab slot="nav" panel="tab-20">
      Tab 20
    </SlTab>

    <SlTabPanel name="tab-1">Tab panel 1</SlTabPanel>
    <SlTabPanel name="tab-2">Tab panel 2</SlTabPanel>
    <SlTabPanel name="tab-3">Tab panel 3</SlTabPanel>
    <SlTabPanel name="tab-4">Tab panel 4</SlTabPanel>
    <SlTabPanel name="tab-5">Tab panel 5</SlTabPanel>
    <SlTabPanel name="tab-6">Tab panel 6</SlTabPanel>
    <SlTabPanel name="tab-7">Tab panel 7</SlTabPanel>
    <SlTabPanel name="tab-8">Tab panel 8</SlTabPanel>
    <SlTabPanel name="tab-9">Tab panel 9</SlTabPanel>
    <SlTabPanel name="tab-10">Tab panel 10</SlTabPanel>
    <SlTabPanel name="tab-11">Tab panel 11</SlTabPanel>
    <SlTabPanel name="tab-12">Tab panel 12</SlTabPanel>
    <SlTabPanel name="tab-13">Tab panel 13</SlTabPanel>
    <SlTabPanel name="tab-14">Tab panel 14</SlTabPanel>
    <SlTabPanel name="tab-15">Tab panel 15</SlTabPanel>
    <SlTabPanel name="tab-16">Tab panel 16</SlTabPanel>
    <SlTabPanel name="tab-17">Tab panel 17</SlTabPanel>
    <SlTabPanel name="tab-18">Tab panel 18</SlTabPanel>
    <SlTabPanel name="tab-19">Tab panel 19</SlTabPanel>
    <SlTabPanel name="tab-20">Tab panel 20</SlTabPanel>
  </SlTabGroup>
);
```

### Manual Activation

When focused, keyboard users can press [[Left]] or [[Right]] to select the desired tab. By default, the corresponding tab panel will be shown immediately (automatic activation). You can change this behavior by setting `activation="manual"` which will require the user to press [[Space]] or [[Enter]] before showing the tab panel (manual activation).

```html:preview
<gd-tab-group activation="manual">
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
  <SlTabGroup activation="manual">
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
