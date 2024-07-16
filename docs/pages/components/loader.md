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

### Sizes

Use the `size` attribute to change a button's size.

```html:preview
<edux-loader size='large' percent='33'></edux-loader>
<edux-loader size='small' percent='33'></edux-loader>
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/loader';

const App = () => (
    <>
        <EduxLoader size="large" percent='33'></EduxLoader>
        <EduxLoader size="small" percent='33'></EduxLoader>
    </>
);
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/loader';

const App = () => (
    <>
        <EduxLoader theme="light" percent='75'></EduxLoader>
        <EduxLoader theme="dark" percent='75'></EduxLoader>
    </>
);
```

[component-metadata:edux-loader]
