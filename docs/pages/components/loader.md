---
meta:
    title: Loader
    description: Loaders are used to indicate there is content that is loading.
layout: component
---

```html:preview
<edux-loader percent='50'></edux-loader>
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/loader';

const App = () => <EduxLoader></EduxLoader>;
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
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/loader';

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
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/loader';

const App = () => (
    <>
        <EduxLoader indeterminate size='small'></EduxLoader>
        <EduxLoader indeterminate size='large'></EduxLoader>
        <EduxLoader indeterminate size='orbit'></EduxLoader>
    </>
);
```

[component-metadata:edux-loader]
