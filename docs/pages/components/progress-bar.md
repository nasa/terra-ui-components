---
meta:
  title: Progress Bar
  description: Progress bars are used to show the status of an ongoing operation.
layout: component
---

```html:preview
<gd-progress-bar value="50"></gd-progress-bar>
```

```jsx:react
import SlProgressBar from '@gesdisc/components/dist/react/progress-bar';

const App = () => <SlProgressBar value={50} />;
```

## Examples

### Labels

Use the `label` attribute to label the progress bar and tell assistive devices how to announce it.

```html:preview
<gd-progress-bar value="50" label="Upload progress"></gd-progress-bar>
```

```jsx:react
import SlProgressBar from '@gesdisc/components/dist/react/progress-bar';

const App = () => <SlProgressBar value="50" label="Upload progress" />;
```

### Custom Height

Use the `--height` custom property to set the progress bar's height.

```html:preview
<gd-progress-bar value="50" style="--height: 6px;"></gd-progress-bar>
```

{% raw %}

```jsx:react
import SlProgressBar from '@gesdisc/components/dist/react/progress-bar';

const App = () => <SlProgressBar value={50} style={{ '--height': '6px' }} />;
```

{% endraw %}

### Showing Values

Use the default slot to show a value.

```html:preview
<gd-progress-bar value="50" class="progress-bar-values">50%</gd-progress-bar>

<br />

<gd-button circle><gd-icon name="dash" label="Decrease"></gd-icon></gd-button>
<gd-button circle><gd-icon name="plus" label="Increase"></gd-icon></gd-button>

<script>
  const progressBar = document.querySelector('.progress-bar-values');
  const subtractButton = progressBar.nextElementSibling.nextElementSibling;
  const addButton = subtractButton.nextElementSibling;

  addButton.addEventListener('click', () => {
    const value = Math.min(100, progressBar.value + 10);
    progressBar.value = value;
    progressBar.textContent = `${value}%`;
  });

  subtractButton.addEventListener('click', () => {
    const value = Math.max(0, progressBar.value - 10);
    progressBar.value = value;
    progressBar.textContent = `${value}%`;
  });
</script>
```

```jsx:react
import { useState } from 'react';
import SlButton from '@gesdisc/components/dist/react/button';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlProgressBar from '@gesdisc/components/dist/react/progress-bar';

const App = () => {
  const [value, setValue] = useState(50);

  function adjustValue(amount) {
    let newValue = value + amount;
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;
    setValue(newValue);
  }

  return (
    <>
      <SlProgressBar value={value}>{value}%</SlProgressBar>

      <br />

      <SlButton circle onClick={() => adjustValue(-10)}>
        <SlIcon name="dash" label="Decrease" />
      </SlButton>

      <SlButton circle onClick={() => adjustValue(10)}>
        <SlIcon name="plus" label="Increase" />
      </SlButton>
    </>
  );
};
```

### Indeterminate

The `indeterminate` attribute can be used to inform the user that the operation is pending, but its status cannot currently be determined. In this state, `value` is ignored and the label, if present, will not be shown.

```html:preview
<gd-progress-bar indeterminate></gd-progress-bar>
```

```jsx:react
import SlProgressBar from '@gesdisc/components/dist/react/progress-bar';

const App = () => <SlProgressBar indeterminate />;
```
