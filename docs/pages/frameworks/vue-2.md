---
meta:
    title: Vue (version 2)
    description: Tips for using Terra in your Vue 2 app.
---

# Vue (version 2)

Vue [plays nice](https://custom-elements-everywhere.com/#vue) with custom elements, so you can use Terra in your Vue apps with ease.

:::tip
These instructions are for Vue 2. If you're using Vue 3 or above, please see the [Vue 3 instructions](/frameworks/vue).
:::

## Installation

To add Terra to your Vue app, install the package from npm.

```bash
npm install @nasa-terra/components
```

Next, [include a theme](/getting-started/themes) and set the [base path](/getting-started/installation#setting-the-base-path) for icons and other assets. In this example, we'll import the light theme and use the CDN as a base path.

```jsx
import '@nasa-terra/components/%NPMDIR%/themes/light.css'
import { setBasePath } from '@nasa-terra/components/%NPMDIR%/utilities/base-path'

setBasePath('https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/')
```

:::tip
If you'd rather not use the CDN for assets, you can create a build task that copies `node_modules/@nasa-terra/components/dist/assets` into a public folder in your app. Then you can point the base path to that folder instead.
:::

## Configuration

You'll need to tell Vue to ignore Terra components. This is pretty easy because they all start with `terra-`.

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.ignoredElements = [/terra-/]

const app = new Vue({
    render: h => h(App),
})

app.$mount('#app')
```

Now you can start using Terra components in your app!

## Usage

### Binding Complex Data

When binding complex data such as objects and arrays, use the `.prop` modifier to make Vue bind them as a property instead of an attribute.

```html
<terra-color-picker :swatches.prop="mySwatches" />
```

### Two-way Binding

One caveat is there's currently [no support for v-model on custom elements](https://github.com/vuejs/vue/issues/7830), but you can still achieve two-way binding manually.

```html
<!-- This doesn't work -->
<terra-input v-model="name"></terra-input>
<!-- This works, but it's a bit longer -->
<terra-input :value="name" @input="name = $event.target.value"></terra-input>
```
