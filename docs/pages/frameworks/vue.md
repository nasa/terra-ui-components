---
meta:
    title: Vue
    description: Tips for using terra in your Vue 3 app.
---

# Vue

Vue [plays nice](https://custom-elements-everywhere.com/#vue) with custom elements, so you can use Terra in your Vue apps with ease.

:::tip
These instructions are for Vue 3 and above. If you're using Vue 2, please see the [Vue 2 instructions](/frameworks/vue-2).
:::

## Installation

To add Terra to your Vue app, install the package from npm.

```bash
npm install @nasa-terra/components
```

Next, [include a theme](/getting-started/themes) and set the [base path](/getting-started/installation#setting-the-base-path) for icons and other assets. In this example, we'll import the light theme and use the CDN as a base path.

```jsx
import '@nasa-terra/components/dist/themes/light.css'
import { setBasePath } from '@nasa-terra/components/dist/utilities/base-path'

setBasePath('https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/')
```

:::tip
If you'd rather not use the CDN for assets, you can create a build task that copies `node_modules/@nasa-terra/components/dist/assets` into a public folder in your app. Then you can point the base path to that folder instead.
:::

## Configuration

If you haven't configured your Vue.js project to work with custom elements/web components, follow [the instructions here](https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue) based on your project type to ensure your project will not throw an error when it encounters a custom element.

Now you can start using Terra components in your app!

## Types

Once you have configured your application for custom elements, you should be able to use Terra in your application without it causing any errors. Unfortunately, this doesn't register the custom elements to behave like components built using Vue. To provide autocomplete information and type safety for your components, you can import the Terra Vue types into your `tsconfig.json` to get better integration in your standard Vue and JSX templates.

```json
{
    "compilerOptions": {
        "types": ["@nasa-terra/components/dist/types/vue"]
    }
}
```

## Usage

### QR code generator example

```html
<template>
    <div class="container">
        <h1>QR code generator</h1>

        <terra-input
            maxlength="255"
            clearable
            label="Value"
            v-model="qrCode"
        ></terra-input>

        <terra-qr-code :value="qrCode"></terra-qr-code>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import '@nasa-terra/components/dist/components/qr-code/qr-code.js'
    import '@nasa-terra/components/dist/components/input/input.js'

    const qrCode = ref()
</script>

<style>
    .container {
        max-width: 400px;
        margin: 0 auto;
    }

    terra-input {
        margin: var(--terra-spacing-large) 0;
    }
</style>
```

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

### Slots

Slots in Terra/web components are functionally the same as basic slots in Vue. Slots can be assigned to elements using the `slot` attribute followed by the name of the slot it is being assigned to.

Here is an example:

```html
<terra-drawer
    label="Drawer"
    placement="start"
    class="drawer-placement-start"
    :open="drawerIsOpen"
>
    This drawer slides in from the start.
    <div slot="footer">
        <terra-button variant="primary" @click=" drawerIsOpen = false"
            >Close</terra-button
        >
    </div>
</terra-drawer>
```
