---
meta:
    title: Progress Bar
    description: Progress bars are used to show the status of an ongoing operation.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-progress-bar value="50"></terra-progress-bar>
```

```jsx:react
import TerraProgressBar from '@nasa-terra/components/dist/react/progress-bar';

const App = () => <TerraProgressBar value={50} />;
```

## Examples

### Basic Usage

Progress bars display a value from 0 to 100. The `value` attribute represents the current progress as a percentage.

```html:preview
<div>
  <terra-progress-bar value="0"></terra-progress-bar>
  <terra-progress-bar value="25"></terra-progress-bar>
  <terra-progress-bar value="50"></terra-progress-bar>
  <terra-progress-bar value="75"></terra-progress-bar>
  <terra-progress-bar value="100"></terra-progress-bar>
</div>

<style>
  terra-progress-bar:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
```

```jsx:react
import TerraProgressBar from '@nasa-terra/components/dist/react/progress-bar';

const App = () => (
  <>
    <TerraProgressBar value={0} />
    <TerraProgressBar value={25} />
    <TerraProgressBar value={50} />
    <TerraProgressBar value={75} />
    <TerraProgressBar value={100} />
  </>
);
```

### Variants

Use the `variant` attribute to change the progress bar's color variant.

```html:preview
<div>
  <terra-progress-bar variant="default" value="50"></terra-progress-bar>
  <terra-progress-bar variant="primary" value="50"></terra-progress-bar>
  <terra-progress-bar variant="success" value="50"></terra-progress-bar>
  <terra-progress-bar variant="warning" value="50"></terra-progress-bar>
  <terra-progress-bar variant="danger" value="50"></terra-progress-bar>
</div>

<style>
  terra-progress-bar:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
```

```jsx:react
import TerraProgressBar from '@nasa-terra/components/dist/react/progress-bar';

const App = () => (
  <>
    <TerraProgressBar variant="default" value={50} />
    <TerraProgressBar variant="primary" value={50} />
    <TerraProgressBar variant="success" value={50} />
    <TerraProgressBar variant="warning" value={50} />
    <TerraProgressBar variant="danger" value={50} />
  </>
);
```

### Indeterminate

Use the `indeterminate` attribute to show an animated progress bar when the duration of an operation is unknown.

```html:preview
<div>
  <terra-progress-bar indeterminate></terra-progress-bar>
  <terra-progress-bar variant="success" indeterminate></terra-progress-bar>
  <terra-progress-bar variant="warning" indeterminate></terra-progress-bar>
  <terra-progress-bar variant="danger" indeterminate></terra-progress-bar>
</div>

<style>
  terra-progress-bar:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
```

```jsx:react
import TerraProgressBar from '@nasa-terra/components/dist/react/progress-bar';

const App = () => (
  <>
    <TerraProgressBar indeterminate />
    <TerraProgressBar variant="success" indeterminate />
    <TerraProgressBar variant="warning" indeterminate />
    <TerraProgressBar variant="danger" indeterminate />
  </>
);
```

### With Labels

You can display text inside the progress bar using the default slot. The text will be centered on the indicator.

```html:preview
<div>
  <terra-progress-bar value="50">50%</terra-progress-bar>
  <terra-progress-bar value="75">75% Complete</terra-progress-bar>
  <terra-progress-bar variant="success" value="100">Done!</terra-progress-bar>
</div>

<style>
  terra-progress-bar:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
```

```jsx:react
import TerraProgressBar from '@nasa-terra/components/dist/react/progress-bar';

const App = () => (
  <>
    <TerraProgressBar value={50}>50%</TerraProgressBar>
    <TerraProgressBar value={75}>75% Complete</TerraProgressBar>
    <TerraProgressBar variant="success" value={100}>Done!</TerraProgressBar>
  </>
);
```

### Custom Labels for Screen Readers

Use the `label` attribute to provide a custom label for assistive devices.

```html:preview
<div>
  <terra-progress-bar value="50" label="File upload progress"></terra-progress-bar>
  <terra-progress-bar value="75" label="Processing data"></terra-progress-bar>
</div>

<style>
  terra-progress-bar:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
```

```jsx:react
import TerraProgressBar from '@nasa-terra/components/dist/react/progress-bar';

const App = () => (
  <>
    <TerraProgressBar value={50} label="File upload progress" />
    <TerraProgressBar value={75} label="Processing data" />
  </>
);
```

### Animated Progress

The progress bar automatically animates when the `value` changes, providing smooth visual feedback.

```html:preview
<div>
  <terra-progress-bar id="animated-progress-bar" value="0"></terra-progress-bar>
  <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
    <terra-button onclick="document.getElementById('animated-progress-bar').value = 25">25%</terra-button>
    <terra-button onclick="document.getElementById('animated-progress-bar').value = 50">50%</terra-button>
    <terra-button onclick="document.getElementById('animated-progress-bar').value = 75">75%</terra-button>
    <terra-button onclick="document.getElementById('animated-progress-bar').value = 100">100%</terra-button>
  </div>
</div>
```

### Custom Height

You can customize the height of the progress bar using CSS custom properties.

```html:preview
<terra-progress-bar value="50" style="--height: 2rem;"></terra-progress-bar>
```

### Custom Colors

You can customize the track and indicator colors using CSS custom properties.

```html:preview
<terra-progress-bar
  value="60"
  style="--track-color: var(--terra-color-carbon-10); --indicator-color: var(--terra-color-nasa-blue);">
  60%
</terra-progress-bar>
```

[component-metadata:terra-progress-bar]
