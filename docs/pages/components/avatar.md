---
meta:
    title: Avatar
    description: Avatars are used to represent a person or object.
layout: component
sidebarSection: Elements
---

By default, a generic icon will be shown. You can personalize avatars by adding custom icons, initials, and images. You should always provide a `label` for assistive devices.

```html:preview
<terra-avatar label="User avatar"></terra-avatar>
```

```jsx:react
import TerraAvatar from '@nasa-terra/components/dist/react/avatar';

const App = () => <TerraAvatar label="User avatar" />;
```

## Examples

### Images

To use an image for the avatar, set the `image` and `label` attributes. This will take priority and be shown over initials and icons.
Avatar images can be lazily loaded by setting the `loading` attribute to `lazy`.

```html:preview
<terra-avatar
  image="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  label="Avatar of the moon"
></terra-avatar>
<terra-avatar
  image="https://images.unsplash.com/photo-1635373670332-43ea883bb081?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  label="Avatar of an astronaut"
  loading="lazy"
></terra-avatar>
```

```jsx:react
import TerraAvatar from '@nasa-terra/components/dist/react/avatar';

const App = () => (
  <TerraAvatar
    image="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    label="Avatar of the moon"
  />
  <TerraAvatar
    image="https://images.unsplash.com/photo-1635373670332-43ea883bb081?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    label="Avatar of an astronaut"
    loading="lazy"
  />
);
```

### Initials

When you don't have an image to use, you can set the `initials` attribute to show something more personalized than an icon.

```html:preview
<terra-avatar initials="JD" label="Avatar with initials: JD"></terra-avatar>
```

```jsx:react
import TerraAvatar from '@nasa-terra/components/dist/react/avatar';

const App = () => <TerraAvatar initials="JD" label="Avatar with initials: JD" />;
```

### Custom Icons

When no image or initials are set, an icon will be shown. The default avatar shows a generic "user" icon, but you can customize this with the `icon` slot.

```html:preview
<terra-avatar label="Avatar with an asteroid icon">
  <terra-icon slot="icon" name="asteroid"></terra-icon>
</terra-avatar>

<terra-avatar label="Avatar with a caret icon">
  <terra-icon slot="icon" name="caret"></terra-icon>
</terra-avatar>

<terra-avatar label="Avatar with a chevron icon">
  <terra-icon slot="icon" name="chevron-right-circle"></terra-icon>
</terra-avatar>
```

```jsx:react
import TerraAvatar from '@nasa-terra/components/dist/react/avatar';
import TerraIcon from '@nasa-terra/components/dist/react/icon';

const App = () => (
  <>
    <TerraAvatar label="Avatar with an asteroid icon">
      <TerraIcon slot="icon" name="asteroid" />
    </TerraAvatar>

    <TerraAvatar label="Avatar with a caret icon">
      <TerraIcon slot="icon" name="caret" />
    </TerraAvatar>

    <TerraAvatar label="Avatar with a chevron icon">
      <TerraIcon slot="icon" name="chevron-right-circle" />
    </TerraAvatar>
  </>
);
```

### Shapes

Avatars can be shaped using the `shape` attribute.

```html:preview
<terra-avatar shape="square" label="Square avatar"></terra-avatar>
<terra-avatar shape="rounded" label="Rounded avatar"></terra-avatar>
<terra-avatar shape="circle" label="Circle avatar"></terra-avatar>
```

```jsx:react
import TerraAvatar from '@nasa-terra/components/dist/react/avatar';

const App = () => (
  <>
    <TerraAvatar shape="square" label="Square avatar" />
    <TerraAvatar shape="rounded" label="Rounded avatar" />
    <TerraAvatar shape="circle" label="Circle avatar" />
  </>
);
```

### Avatar Groups

You can group avatars with a few lines of CSS.

```html:preview
<div class="avatar-group">
  <terra-avatar
    image="https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right"
    label="Avatar 1 of 3"
  ></terra-avatar>

  <terra-avatar
    image="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&crop=left&q=80"
    label="Avatar 2 of 3"
  ></terra-avatar>

  <terra-avatar
    image="https://images.unsplash.com/photo-1635373670332-43ea883bb081?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&crop=left&q=80"
    label="Avatar 3 of 3"
  ></terra-avatar>
</div>

<style>
  .avatar-group terra-avatar:not(:first-of-type) {
    margin-left: -1rem;
  }

  .avatar-group terra-avatar::part(base) {
    border: solid 2px var(--terra-color-spacesuit-white);
  }
</style>
```

```jsx:react
import TerraAvatar from '@nasa-terra/components/dist/react/avatar';

const css = `
  .avatar-group terra-avatar:not(:first-of-type) {
    margin-left: -1rem;
  }

  .avatar-group terra-avatar::part(base) {
    border: solid 2px var(--terra-color-spacesuit-white);
  }
`;

const App = () => (
  <>
    <div className="avatar-group">
      <TerraAvatar
        image="https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right"
        label="Avatar 1 of 3"
      />

      <TerraAvatar
        image="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&crop=left&q=80"
        label="Avatar 2 of 3"
      />

      <TerraAvatar
        image="https://images.unsplash.com/photo-1635373670332-43ea883bb081?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&crop=left&q=80"
        label="Avatar 3 of 3"
      />
    </div>

    <style>{css}</style>
  </>
);
```

[component-metadata:terra-avatar]
