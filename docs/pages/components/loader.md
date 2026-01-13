---
meta:
    title: Loader
    description: Loaders are used to indicate there is content that is loading.
layout: component
---

```html:preview
<terra-loader percent='50'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/loader';

const App = () => <TerraLoader></TerraLoader>;
```

## Examples

### Variants

Use the `variant` attribute to change the style of the loader.

```html:preview
<terra-loader variant='small' percent='33'></terra-loader>
<terra-loader variant='large' percent='33'></terra-loader>
<terra-loader variant='orbit' percent='33'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/loader';

const App = () => (
    <>
        <TerraLoader varaiant="small" percent='33'></TerraLoader>
        <TerraLoader variant="large" percent='33'></TerraLoader>
        <TerraLoader variant="orbit" percent='33'></TerraLoader>
    </>
);
```

### Indeterminate

Use the `indeterminate` attribute to show a spinner.

```html:preview
<terra-loader indeterminate variant='small'></terra-loader>
<terra-loader indeterminate variant='large'></terra-loader>
<terra-loader indeterminate variant='orbit'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/loader';

const App = () => (
    <>
        <TerraLoader indeterminate size='small'></TerraLoader>
        <TerraLoader indeterminate size='large'></TerraLoader>
        <TerraLoader indeterminate size='orbit'></TerraLoader>
    </>
);
```

### Aria label and message

```html:preview
<terra-loader label='Loading video of Tropical Storm Nepartak' message='25% completed (262.5 MB of 350 MB remaining)' percent='25'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa/terra-ui-components/dist/react/loader';

const App = () => (
    <>
        <TerraLoader label='Loading video of Tropical Storm Nepartak' message='25% completed (262.5 MB of 350 MB remaining)' percent='25'></TerraLoader>
    </>
);
```

### Aria label and message

```html:preview
<terra-loader label='Loading video of Tropical Storm Nepartak' message='25% completed (262.5 MB of 350 MB remaining)' percent='25'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/loader';

const App = () => (
    <>
        <TerraLoader label='Loading video of Tropical Storm Nepartak' message='25% completed (262.5 MB of 350 MB remaining)' percent='25'></TerraLoader>
    </>
);
```

[component-metadata:terra-loader]
