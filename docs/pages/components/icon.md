---
meta:
    title: Icon
    description: Icons are symbols that can be used to represent various options within an application.
layout: component
---

EDUX Components come bundled with two sets of icons: `default` and `heroicons`. `default` icons are pulled from the [Horizon Design System](https://website.nasa.gov/hds/foundations/iconography/) (HDS), and `heroicons` icons consist of over 500 icons courtesy of the [Heroicons](https://heroicons.com/) project. If you prefer, you can register [custom icon libraries](#custom-icon-libraries) as well.

:::tip
Depending on how you're loading EDUX Components, you may need to copy icon assets and/or [set the base path](/getting-started/installation/#setting-the-base-path) so EDUX knows where to load them from. Otherwise, icons may not appear and you'll see <code>404 Not Found</code> errors in the dev console.
:::

```html:preview

<div style="font-size:4em;display:flex;">
  <span style="color:#1C67E3;font-size:2rem;display:flex;align-items:center;">
    <edux-icon name="solid-rocket-launch" library="heroicons"></edux-icon>
  </span>

  <edux-icon name="nasa-logo"></edux-icon>

  <span style="color:#F64137;font-size:2rem;display:flex;align-items:center;">
    <edux-icon name="outline-rocket-launch" library="heroicons"></edux-icon>
  </span>
</div>

```

## Examples

### Using Default HDS Icons

Default icons require no `library` attribute, but you _can_ use the attribute `library="default"`. If you're building something for NASA, you should use the `default` library to conform to the HDS.

```html:preview
<!-- `library="default"` not required -->
<edux-icon name="caret" library="default"></edux-icon>
<edux-icon name="chevron-left-circle"></edux-icon>
<edux-icon name="arrow-right-circle"></edux-icon>
<edux-icon name="asteroid"></edux-icon>
```

### Customizing the Default Library

The default library contains only the icons used internally by EDUX components. Unlike the Heroicon icon library, the default library does not rely on physical assets. Instead, its icons are hard-coded as data URIs into the resolver to ensure their availability.

If you want to change the icons EDUX uses internally, you can register an icon library using the `default` name and a custom resolver. If you choose to do this, it's your responsibility to provide all of the icons that are required by components. You can reference `src/components/library.default.ts` for a complete list of system icons used by EDUX.

```html
<script type="module">
    import { registerIconLibrary } from '/dist/utilities/icon-library.js'

    registerIconLibrary('default', {
        resolver: name => `/path/to/custom/icons/${name}.svg`,
    })
</script>
```

### Using Heroicons

Heroicons (both outline and solid) are included as a pre-configured library.

```html:preview
<edux-icon name="outline-academic-cap" library="heroicons"></edux-icon>
<edux-icon name="solid-academic-cap" library="heroicons"></edux-icon>
```

The following icons are available for use as part of the Heroicons icon library:

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
    items += `<li><edux-icon style="margin-inline-end:1ch;" name=${icon.name} library="heroicons"></edux-icon>${icon.name}</li>\n`
  }

  ul.innerHTML = items
</script>
```

### Customizing the Heroicons Library

The `heroicons `icon library contains over 500 icons courtesy of the [Heroicons](https://heroicons.com/) project. If you prefer to have these icons resolve elsewhere or to a different icon library, register an icon library using the `heroicons` name and a custom resolver.

This example will load the same set of icons from the jsDelivr CDN instead of your local assets folder.

```html
<script type="module">
    import { registerIconLibrary } from '/dist/utilities/icon-library.js'

    registerIconLibrary('heroicons', {
        resolver: name =>
            `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.0.0/icons/${name}.svg`,
    })
</script>
```

### One-Off Custom Icons

Custom icons can be loaded individually with the `src` attribute. Only SVGs on a local or CORS-enabled endpoint are supported. If you're using more than one custom icon, it might make sense to register a [custom icon library](#custom-icon-libraries).

```html:preview
<edux-icon src="https://cdn.earthdata.nasa.gov/tophat2/NASA_logo.svg" font-size="18em"></edux-icon>
```

### Colors

Most icons inherit their color from the current text color (brand icons, like the NASA logo, do not). You can set the `color` property on the `<edux-icon>` element or style an ancestor to change the color.

```html:preview
<edux-icon name="outline-academic-cap" color="darkorange" library="heroicons"></edux-icon>

<span style="color:rebeccapurple;">
  <edux-icon name="solid-academic-cap" library="heroicons"></edux-icon>
</span>
```

### Sizing

Icons are sized relative to the current font size. To change their size, set the `font-size` property on the icon itself or on a parent element as shown below.

```html:preview
<edux-icon name="outline-academic-cap" library="heroicons" font-size="4em"></edux-icon>

<span style="font-size:4em;">
  <edux-icon name="solid-academic-cap" library="heroicons"></edux-icon>
</span>
```

### Labels

For non-decorative icons, use the `label` attribute to announce it to assistive devices. Icons are otherwise set to `aria-hidden="true"`.

```html:preview
<edux-icon name="outline-star" label="Add to favorites" library="heroicons"></edux-icon>
```

## Custom Icon Libraries

You can register additional icons to use with the `<edux-icon>` component through icon libraries. Icon files can exist locally or on a CORS-enabled endpoint (e.g. a CDN). There is no limit to how many icon libraries you can register and there is no cost associated with registering them, as individual icons are only requested when they're used.

EDUX ships with two built-in icon libraries, `default` and `heroicons`. The [default icon library](#customizing-the-default-library) contains a small subset of the icons from the HDS, though more will be added. The [Heroicon library](#customizing-the-heroicons-library) contains all of the icons from the Heroicon project.

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

To display an icon, set the `library` and `name` attributes of an `<edux-icon>` element.

```html
<!-- This will show the icon located at /assets/icons/smile.svg -->
<edux-icon library="my-icons" name="smile"></edux-icon>
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
  <edux-icon library="bootstrap" name="rocket"></edux-icon>
  <edux-icon library="bootstrap" name="rocket-fill"></edux-icon>
  <edux-icon library="bootstrap" name="rocket-takeoff"></edux-icon>
  <edux-icon library="bootstrap" name="rocket-takeoff-fill"></edux-icon>
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
  <edux-icon library="boxicons" name="bx-bot"></edux-icon>
  <edux-icon library="boxicons" name="bx-cookie"></edux-icon>
  <edux-icon library="boxicons" name="bx-joystick"></edux-icon>
  <edux-icon library="boxicons" name="bx-save"></edux-icon>
  <edux-icon library="boxicons" name="bx-server"></edux-icon>
  <edux-icon library="boxicons" name="bx-wine"></edux-icon>
  <br />
  <edux-icon library="boxicons" name="bxs-bot"></edux-icon>
  <edux-icon library="boxicons" name="bxs-cookie"></edux-icon>
  <edux-icon library="boxicons" name="bxs-joystick"></edux-icon>
  <edux-icon library="boxicons" name="bxs-save"></edux-icon>
  <edux-icon library="boxicons" name="bxs-server"></edux-icon>
  <edux-icon library="boxicons" name="bxs-wine"></edux-icon>
  <br />
  <edux-icon library="boxicons" name="bxl-apple"></edux-icon>
  <edux-icon library="boxicons" name="bxl-chrome"></edux-icon>
  <edux-icon library="boxicons" name="bxl-edge"></edux-icon>
  <edux-icon library="boxicons" name="bxl-firefox"></edux-icon>
  <edux-icon library="boxicons" name="bxl-opera"></edux-icon>
  <edux-icon library="boxicons" name="bxl-microsoft"></edux-icon>
</div>
```

### Lucide

This will register the [Lucide](https://lucide.dev/) icon library using the jsDelivr CDN. This project is a community-maintained fork of the popular [Feather](https://feathericons.com/) icon library.

Icons in this library are licensed under the [MIT License](https://github.com/lucide-icons/lucide/blob/master/LICENSE).

```html:preview
<div style="font-size: 24px;">
  <edux-icon library="lucide" name="feather"></edux-icon>
  <edux-icon library="lucide" name="pie-chart"></edux-icon>
  <edux-icon library="lucide" name="settings"></edux-icon>
  <edux-icon library="lucide" name="map-pin"></edux-icon>
  <edux-icon library="lucide" name="printer"></edux-icon>
  <edux-icon library="lucide" name="shopping-cart"></edux-icon>
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
  <edux-icon library="fa" name="far-bell"></edux-icon>
  <edux-icon library="fa" name="far-comment"></edux-icon>
  <edux-icon library="fa" name="far-hand-point-right"></edux-icon>
  <edux-icon library="fa" name="far-hdd"></edux-icon>
  <edux-icon library="fa" name="far-heart"></edux-icon>
  <edux-icon library="fa" name="far-star"></edux-icon>
  <br />
  <edux-icon library="fa" name="fas-archive"></edux-icon>
  <edux-icon library="fa" name="fas-book"></edux-icon>
  <edux-icon library="fa" name="fas-chess-knight"></edux-icon>
  <edux-icon library="fa" name="fas-dice"></edux-icon>
  <edux-icon library="fa" name="fas-pizza-slice"></edux-icon>
  <edux-icon library="fa" name="fas-scroll"></edux-icon>
  <br />
  <edux-icon library="fa" name="fab-apple"></edux-icon>
  <edux-icon library="fa" name="fab-chrome"></edux-icon>
  <edux-icon library="fa" name="fab-edge"></edux-icon>
  <edux-icon library="fa" name="fab-firefox"></edux-icon>
  <edux-icon library="fa" name="fab-opera"></edux-icon>
  <edux-icon library="fa" name="fab-microsoft"></edux-icon>
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
  <edux-icon library="iconoir" name="check-circled-outline"></edux-icon>
  <edux-icon library="iconoir" name="drawer"></edux-icon>
  <edux-icon library="iconoir" name="keyframes"></edux-icon>
  <edux-icon library="iconoir" name="headset-help"></edux-icon>
  <edux-icon library="iconoir" name="color-picker"></edux-icon>
  <edux-icon library="iconoir" name="wifi"></edux-icon>
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
  <edux-icon library="ionicons" name="alarm"></edux-icon>
  <edux-icon library="ionicons" name="american-football"></edux-icon>
  <edux-icon library="ionicons" name="bug"></edux-icon>
  <edux-icon library="ionicons" name="chatbubble"></edux-icon>
  <edux-icon library="ionicons" name="settings"></edux-icon>
  <edux-icon library="ionicons" name="warning"></edux-icon>
  <br />
  <edux-icon library="ionicons" name="alarm-outline"></edux-icon>
  <edux-icon library="ionicons" name="american-football-outline"></edux-icon>
  <edux-icon library="ionicons" name="bug-outline"></edux-icon>
  <edux-icon library="ionicons" name="chatbubble-outline"></edux-icon>
  <edux-icon library="ionicons" name="settings-outline"></edux-icon>
  <edux-icon library="ionicons" name="warning-outline"></edux-icon>
  <br />
  <edux-icon library="ionicons" name="alarm-sharp"></edux-icon>
  <edux-icon library="ionicons" name="american-football-sharp"></edux-icon>
  <edux-icon library="ionicons" name="bug-sharp"></edux-icon>
  <edux-icon library="ionicons" name="chatbubble-sharp"></edux-icon>
  <edux-icon library="ionicons" name="settings-sharp"></edux-icon>
  <edux-icon library="ionicons" name="warning-sharp"></edux-icon>
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
  <edux-icon library="jam" name="calendar"></edux-icon>
  <edux-icon library="jam" name="camera"></edux-icon>
  <edux-icon library="jam" name="filter"></edux-icon>
  <edux-icon library="jam" name="leaf"></edux-icon>
  <edux-icon library="jam" name="picture"></edux-icon>
  <edux-icon library="jam" name="set-square"></edux-icon>
  <br />
  <edux-icon library="jam" name="calendar-f"></edux-icon>
  <edux-icon library="jam" name="camera-f"></edux-icon>
  <edux-icon library="jam" name="filter-f"></edux-icon>
  <edux-icon library="jam" name="leaf-f"></edux-icon>
  <edux-icon library="jam" name="picture-f"></edux-icon>
  <edux-icon library="jam" name="set-square-f"></edux-icon>
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
  <edux-icon library="material" name="notifications"></edux-icon>
  <edux-icon library="material" name="email"></edux-icon>
  <edux-icon library="material" name="delete"></edux-icon>
  <edux-icon library="material" name="volume_up"></edux-icon>
  <edux-icon library="material" name="settings"></edux-icon>
  <edux-icon library="material" name="shopping_basket"></edux-icon>
  <br />
  <edux-icon library="material" name="notifications_round"></edux-icon>
  <edux-icon library="material" name="email_round"></edux-icon>
  <edux-icon library="material" name="delete_round"></edux-icon>
  <edux-icon library="material" name="volume_up_round"></edux-icon>
  <edux-icon library="material" name="settings_round"></edux-icon>
  <edux-icon library="material" name="shopping_basket_round"></edux-icon>
  <br />
  <edux-icon library="material" name="notifications_sharp"></edux-icon>
  <edux-icon library="material" name="email_sharp"></edux-icon>
  <edux-icon library="material" name="delete_sharp"></edux-icon>
  <edux-icon library="material" name="volume_up_sharp"></edux-icon>
  <edux-icon library="material" name="settings_sharp"></edux-icon>
  <edux-icon library="material" name="shopping_basket_sharp"></edux-icon>
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
  <edux-icon library="remixicon" name="business/cloud-line"></edux-icon>
  <edux-icon library="remixicon" name="design/brush-line"></edux-icon>
  <edux-icon library="remixicon" name="business/pie-chart-line"></edux-icon>
  <edux-icon library="remixicon" name="development/bug-line"></edux-icon>
  <edux-icon library="remixicon" name="media/image-line"></edux-icon>
  <edux-icon library="remixicon" name="system/alert-line"></edux-icon>
  <br />
  <edux-icon library="remixicon" name="business/cloud-fill"></edux-icon>
  <edux-icon library="remixicon" name="design/brush-fill"></edux-icon>
  <edux-icon library="remixicon" name="business/pie-chart-fill"></edux-icon>
  <edux-icon library="remixicon" name="development/bug-fill"></edux-icon>
  <edux-icon library="remixicon" name="media/image-fill"></edux-icon>
  <edux-icon library="remixicon" name="system/alert-fill"></edux-icon>
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
  <edux-icon library="tabler" name="alert-triangle"></edux-icon>
  <edux-icon library="tabler" name="arrow-back"></edux-icon>
  <edux-icon library="tabler" name="at"></edux-icon>
  <edux-icon library="tabler" name="ball-baseball"></edux-icon>
  <edux-icon library="tabler" name="cake"></edux-icon>
  <edux-icon library="tabler" name="files"></edux-icon>
  <br />
  <edux-icon library="tabler" name="keyboard"></edux-icon>
  <edux-icon library="tabler" name="moon"></edux-icon>
  <edux-icon library="tabler" name="pig"></edux-icon>
  <edux-icon library="tabler" name="printer"></edux-icon>
  <edux-icon library="tabler" name="ship"></edux-icon>
  <edux-icon library="tabler" name="toilet-paper"></edux-icon>
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
  <edux-icon library="unicons" name="clock"></edux-icon>
  <edux-icon library="unicons" name="graph-bar"></edux-icon>
  <edux-icon library="unicons" name="padlock"></edux-icon>
  <edux-icon library="unicons" name="polygon"></edux-icon>
  <edux-icon library="unicons" name="rocket"></edux-icon>
  <edux-icon library="unicons" name="star"></edux-icon>
  <br />
  <edux-icon library="unicons" name="clock-s"></edux-icon>
  <edux-icon library="unicons" name="graph-bar-s"></edux-icon>
  <edux-icon library="unicons" name="padlock-s"></edux-icon>
  <edux-icon library="unicons" name="polygon-s"></edux-icon>
  <edux-icon library="unicons" name="rocket-s"></edux-icon>
  <edux-icon library="unicons" name="star-s"></edux-icon>
</div>
```

[component-metadata:edux-icon]
