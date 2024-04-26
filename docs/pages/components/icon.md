---
meta:
    title: Icon
    description: Icons are symbols that can be used to represent various options within an application.
layout: component
---

EDUX Components come bundled with two sets of icons: `system` and `default`. `system` icons are pulled from the [Horizon Design System](https://website.nasa.gov/hds/foundations/iconography/) (HDS), and `default` icons consist of over 500 icons courtesy of the [Heroicons](https://heroicons.com/) project. If you prefer, you can register [custom icon libraries](#icon-libraries) as well.

:::tip
Depending on how you're loading EDUX Components, you may need to copy icon assets and/or [set the base path](/getting-started/installation/#setting-the-base-path) so EDUX knows where to load them from. Otherwise, icons may not appear and you'll see <code>404 Not Found</code> errors in the dev console.
:::

```html:preview

<div style="font-size:4em;display:flex;">
  <span style="color:#1C67E3;font-size:2rem;display:flex;align-items:center;">
    <gd-icon name="solid-rocket-launch"></gd-icon>
  </span>

  <gd-icon name="nasa-logo" library="system"></gd-icon>

  <span style="color:#F64137;font-size:2rem;display:flex;align-items:center;">
    <gd-icon name="outline-rocket-launch"></gd-icon>
  </span>
</div>

```

## Examples

### Using System Icons

System icons require the attribute `library="system"`. If you're building something for NASA, you should use the `system` library to conform to the HDS.

```html:preview
<gd-icon name="caret" library="system"></gd-icon>
<gd-icon name="chevron-left-circle" library="system"></gd-icon>
<gd-icon name="arrow-right-circle" library="system"></gd-icon>
```

### Customizing the System Library

The system library contains only the icons used internally by EDUX components. Unlike the default icon library, the system library does not rely on physical assets. Instead, its icons are hard-coded as data URIs into the resolver to ensure their availability.

If you want to change the icons EDUX uses internally, you can register an icon library using the `system` name and a custom resolver. If you choose to do this, it's your responsibility to provide all of the icons that are required by components. You can reference `src/components/library.system.ts` for a complete list of system icons used by EDUX.

```html
<script type="module">
    import { registerIconLibrary } from '/dist/utilities/icon-library.js'

    registerIconLibrary('system', {
        resolver: name => `/path/to/custom/icons/${name}.svg`,
    })
</script>
```

### Using Default Icons (Heroicons)

Default icons are copied from Heroicons. You _can_ use the attribute `library="default"`, but the library attribute defaults to that value.

```html:preview
<gd-icon name="outline-academic-cap"></gd-icon>
<gd-icon name="solid-academic-cap"></gd-icon>
```

The following icons are available for use as part of the default icon library:

```html:preview
<details>
  <summary>Heroicons List</summary>
  <ul id="heroicons-list">

  </ul>
</details>

<script type="module">
  import icons from '/dist/assets/icons/icons.json' with { type: 'json' }

  const ul = document.querySelector('#heroicons-list')
  let items = ``

  for (const icon of icons) {
    items += `<li><gd-icon style="margin-inline-end:1ch;" name=${icon.name}></gd-icon>${icon.name}</li>\n`
  }

  ul.innerHTML = items
</script>
```

### Customizing the Default Library

The default icon library contains over 500 icons courtesy of the [Heroicons](https://heroicons.com/) project. These are the icons that display when you use `<gd-icon>` without the `library` attribute. If you prefer to have these icons resolve elsewhere or to a different icon library, register an icon library using the `default` name and a custom resolver.

This example will load the same set of icons from the jsDelivr CDN instead of your local assets folder.

```html
<script type="module">
    import { registerIconLibrary } from '/dist/utilities/icon-library.js'

    registerIconLibrary('default', {
        resolver: name =>
            `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.0.0/icons/${name}.svg`,
    })
</script>
```

### Colors

Most icons inherit their color from the current text color (brand icons, like the NASA logo, do not). You can set the `color` property on the `<gd-icon>` element or style an ancestor to change the color.

```html:preview
<gd-icon name="outline-academic-cap" color="darkorange"></gd-icon>

<span style="color:rebeccapurple;">
  <gd-icon name="solid-academic-cap"></gd-icon>
</span>
```

### Sizing

Icons are sized relative to the current font size. To change their size, set the `font-size` property on the icon itself or on a parent element as shown below.

```html:preview
<gd-icon name="outline-academic-cap" font-size="4em"></gd-icon>

<span style="font-size:4em;">
  <gd-icon name="solid-academic-cap"></gd-icon>
</span>
```

### Labels

For non-decorative icons, use the `label` attribute to announce it to assistive devices. Icons are otherwise set to `aria-hidden="true"`.

```html:preview
<gd-icon name="outline-star" label="Add to favorites"></gd-icon>
```

### Custom Icons

Custom icons can be loaded individually with the `src` attribute. Only SVGs on a local or CORS-enabled endpoint are supported. If you're using more than one custom icon, it might make sense to register a [custom icon library](#icon-libraries).

```html:preview
<gd-icon src="https://cdn.earthdata.nasa.gov/tophat2/NASA_logo.svg" font-size="18em"></gd-icon>
```

## Icon Libraries

You can register additional icons to use with the `<gd-icon>` component through icon libraries. Icon files can exist locally or on a CORS-enabled endpoint (e.g. a CDN). There is no limit to how many icon libraries you can register and there is no cost associated with registering them, as individual icons are only requested when they're used.

EDUX ships with two built-in icon libraries, `default` and `system`. The [default icon library](#customizing-the-default-library) contains all of the icons in the Heroicons project. The [system icon library](#customizing-the-system-library) contains only a small subset of icons that are used internally by EDUX components.

To register an additional icon library, use the `registerIconLibrary()` function that's exported from `utilities/icon-library.js`. At a minimum, you must provide a name and a resolver function. The resolver function translates an icon name to a URL where the corresponding SVG file exists. Refer to the examples below to better understand how it works.

If necessary, a mutator function can be used to mutate the SVG element before rendering. This is necessary for some libraries due to the many possible ways SVGs are crafted. For example, icons should ideally inherit the current text color via `currentColor`, so you may need to apply `fill="currentColor` or `stroke="currentColor"` to the SVG element using this function.

Here's an example that registers an icon library located in the `/assets/icons` directory.

```html
<script type="module">
    import { registerIconLibrary } from '/dist/utilities/icon-library.js'

    registerIconLibrary('my-icons', {
        resolver: name => `/assets/icons/${name}.svg`,
        mutator: svg => svg.setAttribute('fill', 'currentColor'),
    })
</script>
```

To display an icon, set the `library` and `name` attributes of an `<gd-icon>` element.

```html
<!-- This will show the icon located at /assets/icons/smile.svg -->
<gd-icon library="my-icons" name="smile"></gd-icon>
```

If an icon is used before registration occurs, it will be empty initially but shown when registered.

The following examples demonstrate how to register a number of popular, open source icon libraries via CDN. Feel free to adapt the code as you see fit to use your own origin or naming conventions.

### Bootstrap

This will register the [Bootstrap Icons](https://icons.getbootstrap.com/) library using the jsDelivr CDN.

```html:preview
<script type="module">
    import { registerIconLibrary } from '/dist/utilities/icon-library.js'

    registerIconLibrary('bootstrap', {
        resolver: name =>
            `https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/${name}.svg`,
    })
</script>

<div style="font-size: 24px;">
  <gd-icon library="bootstrap" name="rocket"></gd-icon>
  <gd-icon library="bootstrap" name="rocket-fill"></gd-icon>
  <gd-icon library="bootstrap" name="rocket-takeoff"></gd-icon>
  <gd-icon library="bootstrap" name="rocket-takeoff-fill"></gd-icon>
</div>
```

### Boxicons

This will register the [Boxicons](https://boxicons.com/) library using the jsDelivr CDN. This library has three variations: regular (`bx-*`), solid (`bxs-*`), and logos (`bxl-*`). A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [Creative Commons 4.0 License](https://github.com/atisawd/boxicons#license).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('boxicons', {
    resolver: name => {
      let folder = 'regular';
      if (name.substring(0, 4) === 'bxs-') folder = 'solid';
      if (name.substring(0, 4) === 'bxl-') folder = 'logos';
      return `https://cdn.jsdelivr.net/npm/boxicons@2.0.5/svg/${folder}/${name}.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="boxicons" name="bx-bot"></gd-icon>
  <gd-icon library="boxicons" name="bx-cookie"></gd-icon>
  <gd-icon library="boxicons" name="bx-joystick"></gd-icon>
  <gd-icon library="boxicons" name="bx-save"></gd-icon>
  <gd-icon library="boxicons" name="bx-server"></gd-icon>
  <gd-icon library="boxicons" name="bx-wine"></gd-icon>
  <br />
  <gd-icon library="boxicons" name="bxs-bot"></gd-icon>
  <gd-icon library="boxicons" name="bxs-cookie"></gd-icon>
  <gd-icon library="boxicons" name="bxs-joystick"></gd-icon>
  <gd-icon library="boxicons" name="bxs-save"></gd-icon>
  <gd-icon library="boxicons" name="bxs-server"></gd-icon>
  <gd-icon library="boxicons" name="bxs-wine"></gd-icon>
  <br />
  <gd-icon library="boxicons" name="bxl-apple"></gd-icon>
  <gd-icon library="boxicons" name="bxl-chrome"></gd-icon>
  <gd-icon library="boxicons" name="bxl-edge"></gd-icon>
  <gd-icon library="boxicons" name="bxl-firefox"></gd-icon>
  <gd-icon library="boxicons" name="bxl-opera"></gd-icon>
  <gd-icon library="boxicons" name="bxl-microsoft"></gd-icon>
</div>
```

### Lucide

This will register the [Lucide](https://lucide.dev/) icon library using the jsDelivr CDN. This project is a community-maintained fork of the popular [Feather](https://feathericons.com/) icon library.

Icons in this library are licensed under the [MIT License](https://github.com/lucide-icons/lucide/blob/master/LICENSE).

```html:preview
<div style="font-size: 24px;">
  <gd-icon library="lucide" name="feather"></gd-icon>
  <gd-icon library="lucide" name="pie-chart"></gd-icon>
  <gd-icon library="lucide" name="settings"></gd-icon>
  <gd-icon library="lucide" name="map-pin"></gd-icon>
  <gd-icon library="lucide" name="printer"></gd-icon>
  <gd-icon library="lucide" name="shopping-cart"></gd-icon>
</div>

<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('lucide', {
    resolver: name => `https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/${name}.svg`
  });
</script>
```

### Font Awesome

This will register the [Font Awesome Free](https://fontawesome.com/) library using the jsDelivr CDN. This library has three variations: regular (`far-*`), solid (`fas-*`), and brands (`fab-*`). A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [Font Awesome Free License](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt). Some of the icons that appear on the Font Awesome website require a license and are therefore not available in the CDN.

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('fa', {
    resolver: name => {
      const filename = name.replace(/^fa[rbs]-/, '');
      let folder = 'regular';
      if (name.substring(0, 4) === 'fas-') folder = 'solid';
      if (name.substring(0, 4) === 'fab-') folder = 'brands';
      return `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.1/svgs/${folder}/${filename}.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="fa" name="far-bell"></gd-icon>
  <gd-icon library="fa" name="far-comment"></gd-icon>
  <gd-icon library="fa" name="far-hand-point-right"></gd-icon>
  <gd-icon library="fa" name="far-hdd"></gd-icon>
  <gd-icon library="fa" name="far-heart"></gd-icon>
  <gd-icon library="fa" name="far-star"></gd-icon>
  <br />
  <gd-icon library="fa" name="fas-archive"></gd-icon>
  <gd-icon library="fa" name="fas-book"></gd-icon>
  <gd-icon library="fa" name="fas-chess-knight"></gd-icon>
  <gd-icon library="fa" name="fas-dice"></gd-icon>
  <gd-icon library="fa" name="fas-pizza-slice"></gd-icon>
  <gd-icon library="fa" name="fas-scroll"></gd-icon>
  <br />
  <gd-icon library="fa" name="fab-apple"></gd-icon>
  <gd-icon library="fa" name="fab-chrome"></gd-icon>
  <gd-icon library="fa" name="fab-edge"></gd-icon>
  <gd-icon library="fa" name="fab-firefox"></gd-icon>
  <gd-icon library="fa" name="fab-opera"></gd-icon>
  <gd-icon library="fa" name="fab-microsoft"></gd-icon>
</div>
```

### Iconoir

This will register the [Iconoir](https://iconoir.com/) library using the jsDelivr CDN.

Icons in this library are licensed under the [MIT License](https://github.com/lucaburgio/iconoir/blob/master/LICENSE).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('iconoir', {
    resolver: name => `https://cdn.jsdelivr.net/gh/lucaburgio/iconoir@latest/icons/${name}.svg`
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="iconoir" name="check-circled-outline"></gd-icon>
  <gd-icon library="iconoir" name="drawer"></gd-icon>
  <gd-icon library="iconoir" name="keyframes"></gd-icon>
  <gd-icon library="iconoir" name="headset-help"></gd-icon>
  <gd-icon library="iconoir" name="color-picker"></gd-icon>
  <gd-icon library="iconoir" name="wifi"></gd-icon>
</div>
```

### Ionicons

This will register the [Ionicons](https://ionicons.com/) library using the jsDelivr CDN. This library has three variations: outline (default), filled (`*-filled`), and sharp (`*-sharp`). A mutator function is required to polyfill a handful of styles we're not including.

Icons in this library are licensed under the [MIT License](https://github.com/ionic-team/ionicons/blob/master/LICENSE).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('ionicons', {
    resolver: name => `https://cdn.jsdelivr.net/npm/ionicons@5.1.2/dist/ionicons/svg/${name}.svg`,
    mutator: svg => {
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('stroke', 'currentColor');
      [...svg.querySelectorAll('.ionicon-fill-none')].map(el => el.setAttribute('fill', 'none'));
      [...svg.querySelectorAll('.ionicon-stroke-width')].map(el => el.setAttribute('stroke-width', '32px'));
    }
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="ionicons" name="alarm"></gd-icon>
  <gd-icon library="ionicons" name="american-football"></gd-icon>
  <gd-icon library="ionicons" name="bug"></gd-icon>
  <gd-icon library="ionicons" name="chatbubble"></gd-icon>
  <gd-icon library="ionicons" name="settings"></gd-icon>
  <gd-icon library="ionicons" name="warning"></gd-icon>
  <br />
  <gd-icon library="ionicons" name="alarm-outline"></gd-icon>
  <gd-icon library="ionicons" name="american-football-outline"></gd-icon>
  <gd-icon library="ionicons" name="bug-outline"></gd-icon>
  <gd-icon library="ionicons" name="chatbubble-outline"></gd-icon>
  <gd-icon library="ionicons" name="settings-outline"></gd-icon>
  <gd-icon library="ionicons" name="warning-outline"></gd-icon>
  <br />
  <gd-icon library="ionicons" name="alarm-sharp"></gd-icon>
  <gd-icon library="ionicons" name="american-football-sharp"></gd-icon>
  <gd-icon library="ionicons" name="bug-sharp"></gd-icon>
  <gd-icon library="ionicons" name="chatbubble-sharp"></gd-icon>
  <gd-icon library="ionicons" name="settings-sharp"></gd-icon>
  <gd-icon library="ionicons" name="warning-sharp"></gd-icon>
</div>
```

### Jam Icons

This will register the [Jam Icons](https://jam-icons.com/) library using the jsDelivr CDN. This library has two variations: regular (default) and filled (`*-f`). A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [MIT License](https://github.com/michaelampr/jam/blob/master/LICENSE).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('jam', {
    resolver: name => `https://cdn.jsdelivr.net/npm/jam-icons@2.0.0/svg/${name}.svg`,
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="jam" name="calendar"></gd-icon>
  <gd-icon library="jam" name="camera"></gd-icon>
  <gd-icon library="jam" name="filter"></gd-icon>
  <gd-icon library="jam" name="leaf"></gd-icon>
  <gd-icon library="jam" name="picture"></gd-icon>
  <gd-icon library="jam" name="set-square"></gd-icon>
  <br />
  <gd-icon library="jam" name="calendar-f"></gd-icon>
  <gd-icon library="jam" name="camera-f"></gd-icon>
  <gd-icon library="jam" name="filter-f"></gd-icon>
  <gd-icon library="jam" name="leaf-f"></gd-icon>
  <gd-icon library="jam" name="picture-f"></gd-icon>
  <gd-icon library="jam" name="set-square-f"></gd-icon>
</div>
```

### Material Icons

This will register the [Material Icons](https://material.io/resources/icons/?style=baseline) library using the jsDelivr CDN. This library has three variations: outline (default), round (`*_round`), and sharp (`*_sharp`). A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [Apache 2.0 License](https://github.com/google/material-design-icons/blob/master/LICENSE).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('material', {
    resolver: name => {
      const match = name.match(/^(.*?)(_(round|sharp))?$/);
      return `https://cdn.jsdelivr.net/npm/@material-icons/svg@1.0.5/svg/${match[1]}/${match[3] || 'outline'}.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="material" name="notifications"></gd-icon>
  <gd-icon library="material" name="email"></gd-icon>
  <gd-icon library="material" name="delete"></gd-icon>
  <gd-icon library="material" name="volume_up"></gd-icon>
  <gd-icon library="material" name="settings"></gd-icon>
  <gd-icon library="material" name="shopping_basket"></gd-icon>
  <br />
  <gd-icon library="material" name="notifications_round"></gd-icon>
  <gd-icon library="material" name="email_round"></gd-icon>
  <gd-icon library="material" name="delete_round"></gd-icon>
  <gd-icon library="material" name="volume_up_round"></gd-icon>
  <gd-icon library="material" name="settings_round"></gd-icon>
  <gd-icon library="material" name="shopping_basket_round"></gd-icon>
  <br />
  <gd-icon library="material" name="notifications_sharp"></gd-icon>
  <gd-icon library="material" name="email_sharp"></gd-icon>
  <gd-icon library="material" name="delete_sharp"></gd-icon>
  <gd-icon library="material" name="volume_up_sharp"></gd-icon>
  <gd-icon library="material" name="settings_sharp"></gd-icon>
  <gd-icon library="material" name="shopping_basket_sharp"></gd-icon>
</div>
```

### Remix Icon

This will register the [Remix Icon](https://remixicon.com/) library using the jsDelivr CDN. This library groups icons by categories, so the name must include the category and icon separated by a slash, as well as the `-line` or `-fill` suffix as needed. A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [Apache 2.0 License](https://github.com/Remix-Design/RemixIcon/blob/master/License).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('remixicon', {
    resolver: name => {
      const match = name.match(/^(.*?)\/(.*?)?$/);
      match[1] = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      return `https://cdn.jsdelivr.net/npm/remixicon@2.5.0/icons/${match[1]}/${match[2]}.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="remixicon" name="business/cloud-line"></gd-icon>
  <gd-icon library="remixicon" name="design/brush-line"></gd-icon>
  <gd-icon library="remixicon" name="business/pie-chart-line"></gd-icon>
  <gd-icon library="remixicon" name="development/bug-line"></gd-icon>
  <gd-icon library="remixicon" name="media/image-line"></gd-icon>
  <gd-icon library="remixicon" name="system/alert-line"></gd-icon>
  <br />
  <gd-icon library="remixicon" name="business/cloud-fill"></gd-icon>
  <gd-icon library="remixicon" name="design/brush-fill"></gd-icon>
  <gd-icon library="remixicon" name="business/pie-chart-fill"></gd-icon>
  <gd-icon library="remixicon" name="development/bug-fill"></gd-icon>
  <gd-icon library="remixicon" name="media/image-fill"></gd-icon>
  <gd-icon library="remixicon" name="system/alert-fill"></gd-icon>
</div>
```

### Tabler Icons

This will register the [Tabler Icons](https://tabler-icons.io/) library using the jsDelivr CDN. This library features over 1,950 open source icons.

Icons in this library are licensed under the [MIT License](https://github.com/tabler/tabler-icons/blob/master/LICENSE).

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('tabler', {
    resolver: name => `https://cdn.jsdelivr.net/npm/@tabler/icons@1.68.0/icons/${name}.svg`
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="tabler" name="alert-triangle"></gd-icon>
  <gd-icon library="tabler" name="arrow-back"></gd-icon>
  <gd-icon library="tabler" name="at"></gd-icon>
  <gd-icon library="tabler" name="ball-baseball"></gd-icon>
  <gd-icon library="tabler" name="cake"></gd-icon>
  <gd-icon library="tabler" name="files"></gd-icon>
  <br />
  <gd-icon library="tabler" name="keyboard"></gd-icon>
  <gd-icon library="tabler" name="moon"></gd-icon>
  <gd-icon library="tabler" name="pig"></gd-icon>
  <gd-icon library="tabler" name="printer"></gd-icon>
  <gd-icon library="tabler" name="ship"></gd-icon>
  <gd-icon library="tabler" name="toilet-paper"></gd-icon>
</div>
```

### Unicons

This will register the [Unicons](https://iconscout.com/unicons) library using the jsDelivr CDN. This library has two variations: line (default) and solid (`*-s`). A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [Apache 2.0 License](https://github.com/Iconscout/unicons/blob/master/LICENSE). Some of the icons that appear on the Unicons website, particularly many of the solid variations, require a license and are therefore not available in the CDN.

```html:preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('unicons', {
    resolver: name => {
      const match = name.match(/^(.*?)(-s)?$/);
      return `https://cdn.jsdelivr.net/npm/@iconscout/unicons@3.0.3/svg/${match[2] === '-s' ? 'solid' : 'line'}/${
        match[1]
      }.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <gd-icon library="unicons" name="clock"></gd-icon>
  <gd-icon library="unicons" name="graph-bar"></gd-icon>
  <gd-icon library="unicons" name="padlock"></gd-icon>
  <gd-icon library="unicons" name="polygon"></gd-icon>
  <gd-icon library="unicons" name="rocket"></gd-icon>
  <gd-icon library="unicons" name="star"></gd-icon>
  <br />
  <gd-icon library="unicons" name="clock-s"></gd-icon>
  <gd-icon library="unicons" name="graph-bar-s"></gd-icon>
  <gd-icon library="unicons" name="padlock-s"></gd-icon>
  <gd-icon library="unicons" name="polygon-s"></gd-icon>
  <gd-icon library="unicons" name="rocket-s"></gd-icon>
  <gd-icon library="unicons" name="star-s"></gd-icon>
</div>
```

[component-metadata:gd-icon]
