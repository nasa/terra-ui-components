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
import TerraLoader from '@nasa/terra-ui-components/dist/react/loader';

const App = () => <TerraLoader></TerraLoader>;
```

## Examples

### Sizes

Use the `size` attribute to change a button's size.

```html:preview
<terra-loader size='large' percent='33'></terra-loader>
<terra-loader size='small' percent='33'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa/terra-ui-components/dist/react/loader';

const App = () => (
    <>
        <TerraLoader size="large" percent='33'></TerraLoader>
        <TerraLoader size="small" percent='33'></TerraLoader>
    </>
);
```

### Themes

```html:preview
<terra-loader theme='light' percent='75'></terra-loader>
<terra-loader theme='dark' percent='75'></terra-loader>
```

```jsx:react
import TerraLoader from '@nasa/terra-ui-components/dist/react/loader';

const App = () => (
    <>
        <TerraLoader theme="light" percent='75'></TerraLoader>
        <TerraLoader theme="dark" percent='75'></TerraLoader>
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

[component-metadata:terra-loader]
