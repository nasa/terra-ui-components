---
meta:
    title: Icon
    description: Icons are symbols that can be used to represent various options within an application.
layout: component
---

Terra UI Components come bundled with two sets of icons: `default` and `heroicons`. `default` icons are pulled from the [Horizon Design System](https://website.nasa.gov/hds/foundations/iconography/) (HDS), and `heroicons` icons consist of over 500 icons courtesy of the [Heroicons](https://heroicons.com/) project. If you prefer, you can register [custom icon libraries](#custom-icon-libraries) as well.

:::tip
Depending on how you're loading Terra UI Components, you may need to copy icon assets and/or [set the base path](/getting-started/installation/#setting-the-base-path) so Terra UI knows where to load them from. Otherwise, icons may not appear and you'll see <code>404 Not Found</code> errors in the dev console.
:::

```html:preview

<div style="font-size:4em;display:flex;">
  <span style="color:#1C67E3;font-size:2rem;display:flex;align-items:center;">
    <terra-icon name="solid-rocket-launch" library="heroicons"></terra-icon>
  </span>

  <terra-icon name="nasa-logo"></terra-icon>

  <span style="color:#F64137;font-size:2rem;display:flex;align-items:center;">
    <terra-icon name="outline-rocket-launch" library="heroicons"></terra-icon>
  </span>
</div>

```

## Examples

### Using Default HDS Icons

Default icons require no `library` attribute, but you _can_ use the attribute `library="default"`. If you're building something for NASA, you should use the `default` library to conform to the HDS.

```html:preview
<!-- `library="default"` not required -->
<terra-icon name="caret" library="default"></terra-icon>
<terra-icon name="chevron-left-circle"></terra-icon>
<terra-icon name="arrow-right-circle"></terra-icon>
<terra-icon name="asteroid"></terra-icon>
```

### Customizing the Default Library

The default library contains only the icons used internally by Terra UI components. Unlike the Heroicon icon library, the default library does not rely on physical assets. Instead, its icons are hard-coded as data URIs into the resolver to ensure their availability.

If you want to change the icons Terra UI uses internally, you can register an icon library using the `default` name and a custom resolver. If you choose to do this, it's your responsibility to provide all of the icons that are required by components. You can reference `src/components/library.default.ts` for a complete list of system icons used by Terra UI.

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
<terra-icon name="outline-academic-cap" library="heroicons"></terra-icon>
<terra-icon name="solid-academic-cap" library="heroicons"></terra-icon>
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
    items += `<li><terra-icon style="margin-inline-end:1ch;" name=${icon.name} library="heroicons"></terra-icon>${icon.name}</li>\n`
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
<terra-icon src="https://cdn.earthdata.nasa.gov/tophat2/NASA_logo.svg" font-size="18em"></terra-icon>
```

### Colors

Most icons inherit their color from the current text color (brand icons, like the NASA logo, do not). You can set the `color` property on the `<terra-icon>` element or style an ancestor to change the color.

```html:preview
<terra-icon name="outline-academic-cap" color="darkorange" library="heroicons"></terra-icon>

<span style="color:rebeccapurple;">
  <terra-icon name="solid-academic-cap" library="heroicons"></terra-icon>
</span>
```

### Sizing

Icons are sized relative to the current font size. To change their size, set the `font-size` property on the icon itself or on a parent element as shown below.

```html:preview
<terra-icon name="outline-academic-cap" library="heroicons" font-size="4em"></terra-icon>

<span style="font-size:4em;">
  <terra-icon name="solid-academic-cap" library="heroicons"></terra-icon>
</span>
```

### Labels

For non-decorative icons, use the `label` attribute to announce it to assistive devices. Icons are otherwise set to `aria-hidden="true"`.

```html:preview
<terra-icon name="outline-star" label="Add to favorites" library="heroicons"></terra-icon>
```

## Custom Icon Libraries

You can register additional icons to use with the `<terra-icon>` component through icon libraries. Icon files can exist locally or on a CORS-enabled endpoint (e.g. a CDN). There is no limit to how many icon libraries you can register and there is no cost associated with registering them, as individual icons are only requested when they're used.

Terra UI ships with two built-in icon libraries, `default` and `heroicons`. The [default icon library](#customizing-the-default-library) contains a small subset of the icons from the HDS, though more will be added. The [Heroicon library](#customizing-the-heroicons-library) contains all of the icons from the Heroicon project.

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

To display an icon, set the `library` and `name` attributes of an `<terra-icon>` element.

```html
<!-- This will show the icon located at /assets/icons/smile.svg -->
<terra-icon library="my-icons" name="smile"></terra-icon>
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
  <terra-icon library="bootstrap" name="rocket"></terra-icon>
  <terra-icon library="bootstrap" name="rocket-fill"></terra-icon>
  <terra-icon library="bootstrap" name="rocket-takeoff"></terra-icon>
  <terra-icon library="bootstrap" name="rocket-takeoff-fill"></terra-icon>
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
  <terra-icon library="boxicons" name="bx-bot"></terra-icon>
  <terra-icon library="boxicons" name="bx-cookie"></terra-icon>
  <terra-icon library="boxicons" name="bx-joystick"></terra-icon>
  <terra-icon library="boxicons" name="bx-save"></terra-icon>
  <terra-icon library="boxicons" name="bx-server"></terra-icon>
  <terra-icon library="boxicons" name="bx-wine"></terra-icon>
  <br />
  <terra-icon library="boxicons" name="bxs-bot"></terra-icon>
  <terra-icon library="boxicons" name="bxs-cookie"></terra-icon>
  <terra-icon library="boxicons" name="bxs-joystick"></terra-icon>
  <terra-icon library="boxicons" name="bxs-save"></terra-icon>
  <terra-icon library="boxicons" name="bxs-server"></terra-icon>
  <terra-icon library="boxicons" name="bxs-wine"></terra-icon>
  <br />
  <terra-icon library="boxicons" name="bxl-apple"></terra-icon>
  <terra-icon library="boxicons" name="bxl-chrome"></terra-icon>
  <terra-icon library="boxicons" name="bxl-edge"></terra-icon>
  <terra-icon library="boxicons" name="bxl-firefox"></terra-icon>
  <terra-icon library="boxicons" name="bxl-opera"></terra-icon>
  <terra-icon library="boxicons" name="bxl-microsoft"></terra-icon>
</div>
```

### Lucide

This will register the [Lucide](https://lucide.dev/) icon library using the jsDelivr CDN. This project is a community-maintained fork of the popular [Feather](https://feathericons.com/) icon library.

Icons in this library are licensed under the [MIT License](https://github.com/lucide-icons/lucide/blob/master/LICENSE).

```html:preview
<div style="font-size: 24px;">
  <terra-icon library="lucide" name="feather"></terra-icon>
  <terra-icon library="lucide" name="pie-chart"></terra-icon>
  <terra-icon library="lucide" name="settings"></terra-icon>
  <terra-icon library="lucide" name="map-pin"></terra-icon>
  <terra-icon library="lucide" name="printer"></terra-icon>
  <terra-icon library="lucide" name="shopping-cart"></terra-icon>
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
  <terra-icon library="fa" name="far-bell"></terra-icon>
  <terra-icon library="fa" name="far-comment"></terra-icon>
  <terra-icon library="fa" name="far-hand-point-right"></terra-icon>
  <terra-icon library="fa" name="far-hdd"></terra-icon>
  <terra-icon library="fa" name="far-heart"></terra-icon>
  <terra-icon library="fa" name="far-star"></terra-icon>
  <br />
  <terra-icon library="fa" name="fas-archive"></terra-icon>
  <terra-icon library="fa" name="fas-book"></terra-icon>
  <terra-icon library="fa" name="fas-chess-knight"></terra-icon>
  <terra-icon library="fa" name="fas-dice"></terra-icon>
  <terra-icon library="fa" name="fas-pizza-slice"></terra-icon>
  <terra-icon library="fa" name="fas-scroll"></terra-icon>
  <br />
  <terra-icon library="fa" name="fab-apple"></terra-icon>
  <terra-icon library="fa" name="fab-chrome"></terra-icon>
  <terra-icon library="fa" name="fab-edge"></terra-icon>
  <terra-icon library="fa" name="fab-firefox"></terra-icon>
  <terra-icon library="fa" name="fab-opera"></terra-icon>
  <terra-icon library="fa" name="fab-microsoft"></terra-icon>
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
  <terra-icon library="iconoir" name="check-circled-outline"></terra-icon>
  <terra-icon library="iconoir" name="drawer"></terra-icon>
  <terra-icon library="iconoir" name="keyframes"></terra-icon>
  <terra-icon library="iconoir" name="headset-help"></terra-icon>
  <terra-icon library="iconoir" name="color-picker"></terra-icon>
  <terra-icon library="iconoir" name="wifi"></terra-icon>
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
  <terra-icon library="ionicons" name="alarm"></terra-icon>
  <terra-icon library="ionicons" name="american-football"></terra-icon>
  <terra-icon library="ionicons" name="bug"></terra-icon>
  <terra-icon library="ionicons" name="chatbubble"></terra-icon>
  <terra-icon library="ionicons" name="settings"></terra-icon>
  <terra-icon library="ionicons" name="warning"></terra-icon>
  <br />
  <terra-icon library="ionicons" name="alarm-outline"></terra-icon>
  <terra-icon library="ionicons" name="american-football-outline"></terra-icon>
  <terra-icon library="ionicons" name="bug-outline"></terra-icon>
  <terra-icon library="ionicons" name="chatbubble-outline"></terra-icon>
  <terra-icon library="ionicons" name="settings-outline"></terra-icon>
  <terra-icon library="ionicons" name="warning-outline"></terra-icon>
  <br />
  <terra-icon library="ionicons" name="alarm-sharp"></terra-icon>
  <terra-icon library="ionicons" name="american-football-sharp"></terra-icon>
  <terra-icon library="ionicons" name="bug-sharp"></terra-icon>
  <terra-icon library="ionicons" name="chatbubble-sharp"></terra-icon>
  <terra-icon library="ionicons" name="settings-sharp"></terra-icon>
  <terra-icon library="ionicons" name="warning-sharp"></terra-icon>
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
  <terra-icon library="jam" name="calendar"></terra-icon>
  <terra-icon library="jam" name="camera"></terra-icon>
  <terra-icon library="jam" name="filter"></terra-icon>
  <terra-icon library="jam" name="leaf"></terra-icon>
  <terra-icon library="jam" name="picture"></terra-icon>
  <terra-icon library="jam" name="set-square"></terra-icon>
  <br />
  <terra-icon library="jam" name="calendar-f"></terra-icon>
  <terra-icon library="jam" name="camera-f"></terra-icon>
  <terra-icon library="jam" name="filter-f"></terra-icon>
  <terra-icon library="jam" name="leaf-f"></terra-icon>
  <terra-icon library="jam" name="picture-f"></terra-icon>
  <terra-icon library="jam" name="set-square-f"></terra-icon>
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
  <terra-icon library="material" name="notifications"></terra-icon>
  <terra-icon library="material" name="email"></terra-icon>
  <terra-icon library="material" name="delete"></terra-icon>
  <terra-icon library="material" name="volume_up"></terra-icon>
  <terra-icon library="material" name="settings"></terra-icon>
  <terra-icon library="material" name="shopping_basket"></terra-icon>
  <br />
  <terra-icon library="material" name="notifications_round"></terra-icon>
  <terra-icon library="material" name="email_round"></terra-icon>
  <terra-icon library="material" name="delete_round"></terra-icon>
  <terra-icon library="material" name="volume_up_round"></terra-icon>
  <terra-icon library="material" name="settings_round"></terra-icon>
  <terra-icon library="material" name="shopping_basket_round"></terra-icon>
  <br />
  <terra-icon library="material" name="notifications_sharp"></terra-icon>
  <terra-icon library="material" name="email_sharp"></terra-icon>
  <terra-icon library="material" name="delete_sharp"></terra-icon>
  <terra-icon library="material" name="volume_up_sharp"></terra-icon>
  <terra-icon library="material" name="settings_sharp"></terra-icon>
  <terra-icon library="material" name="shopping_basket_sharp"></terra-icon>
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
  <terra-icon library="remixicon" name="business/cloud-line"></terra-icon>
  <terra-icon library="remixicon" name="design/brush-line"></terra-icon>
  <terra-icon library="remixicon" name="business/pie-chart-line"></terra-icon>
  <terra-icon library="remixicon" name="development/bug-line"></terra-icon>
  <terra-icon library="remixicon" name="media/image-line"></terra-icon>
  <terra-icon library="remixicon" name="system/alert-line"></terra-icon>
  <br />
  <terra-icon library="remixicon" name="business/cloud-fill"></terra-icon>
  <terra-icon library="remixicon" name="design/brush-fill"></terra-icon>
  <terra-icon library="remixicon" name="business/pie-chart-fill"></terra-icon>
  <terra-icon library="remixicon" name="development/bug-fill"></terra-icon>
  <terra-icon library="remixicon" name="media/image-fill"></terra-icon>
  <terra-icon library="remixicon" name="system/alert-fill"></terra-icon>
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
  <terra-icon library="tabler" name="alert-triangle"></terra-icon>
  <terra-icon library="tabler" name="arrow-back"></terra-icon>
  <terra-icon library="tabler" name="at"></terra-icon>
  <terra-icon library="tabler" name="ball-baseball"></terra-icon>
  <terra-icon library="tabler" name="cake"></terra-icon>
  <terra-icon library="tabler" name="files"></terra-icon>
  <br />
  <terra-icon library="tabler" name="keyboard"></terra-icon>
  <terra-icon library="tabler" name="moon"></terra-icon>
  <terra-icon library="tabler" name="pig"></terra-icon>
  <terra-icon library="tabler" name="printer"></terra-icon>
  <terra-icon library="tabler" name="ship"></terra-icon>
  <terra-icon library="tabler" name="toilet-paper"></terra-icon>
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
  <terra-icon library="unicons" name="clock"></terra-icon>
  <terra-icon library="unicons" name="graph-bar"></terra-icon>
  <terra-icon library="unicons" name="padlock"></terra-icon>
  <terra-icon library="unicons" name="polygon"></terra-icon>
  <terra-icon library="unicons" name="rocket"></terra-icon>
  <terra-icon library="unicons" name="star"></terra-icon>
  <br />
  <terra-icon library="unicons" name="clock-s"></terra-icon>
  <terra-icon library="unicons" name="graph-bar-s"></terra-icon>
  <terra-icon library="unicons" name="padlock-s"></terra-icon>
  <terra-icon library="unicons" name="polygon-s"></terra-icon>
  <terra-icon library="unicons" name="rocket-s"></terra-icon>
  <terra-icon library="unicons" name="star-s"></terra-icon>
</div>
```

[component-metadata:terra-icon]
