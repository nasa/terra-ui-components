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
<edux-loader variant='small' percent='33'></edux-loader>
<edux-loader variant='large' percent='33'></edux-loader>
<edux-loader variant='orbit' percent='33'></edux-loader>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/loader';

const App = () => (
    <>
        <EduxLoader varaiant="small" percent='33'></EduxLoader>
        <EduxLoader variant="large" percent='33'></EduxLoader>
        <EduxLoader variant="orbit" percent='33'></EduxLoader>
    </>
);
```

### Indeterminate

Use the `indeterminate` attribute to show a spinner.

```html:preview
<edux-loader indeterminate variant='small'></edux-loader>
<edux-loader indeterminate variant='large'></edux-loader>
<edux-loader indeterminate variant='orbit'></edux-loader>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/loader';

const App = () => (
    <>
        <EduxLoader indeterminate size='small'></EduxLoader>
        <EduxLoader indeterminate size='large'></EduxLoader>
        <EduxLoader indeterminate size='orbit'></EduxLoader>
    </>
);
```

### Aria label and message

```html:preview
<edux-loader label='Loading video of Tropical Storm Nepartak' message='25% completed (262.5 MB of 350 MB remaining)' percent='25'></edux-loader>
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/loader';

const App = () => (
    <>
        <EduxLoader label='Loading video of Tropical Storm Nepartak' message='25% completed (262.5 MB of 350 MB remaining)' percent='25'></EduxLoader>
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
