---
meta:
  title: Breadcrumb
  description: Breadcrumbs provide a group of links so users can easily navigate a website's hierarchy.
layout: component
---

Breadcrumbs are usually placed before a page's main content with the current page shown last to indicate the user's position in the navigation.

```html:preview
<gd-breadcrumb>
  <gd-breadcrumb-item>Catalog</gd-breadcrumb-item>
  <gd-breadcrumb-item>Clothing</gd-breadcrumb-item>
  <gd-breadcrumb-item>Women's</gd-breadcrumb-item>
  <gd-breadcrumb-item>Shirts &amp; Tops</gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import SlBreadcrumb from '@gesdisc/components/dist/react/breadcrumb';
import SlBreadcrumbItem from '@gesdisc/components/dist/react/breadcrumb-item';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem>Catalog</SlBreadcrumbItem>
    <SlBreadcrumbItem>Clothing</SlBreadcrumbItem>
    <SlBreadcrumbItem>Women's</SlBreadcrumbItem>
    <SlBreadcrumbItem>Shirts &amp; Tops</SlBreadcrumbItem>
  </SlBreadcrumb>
);
```

## Examples

### Breadcrumb Links

By default, breadcrumb items are rendered as buttons so you can use them to navigate single-page applications. In this case, you'll need to add event listeners to handle clicks.

For websites, you'll probably want to use links instead. You can make any breadcrumb item a link by applying an `href` attribute to it. Now, when the user activates it, they'll be taken to the corresponding page — no event listeners required.

```html:preview
<gd-breadcrumb>
  <gd-breadcrumb-item href="https://example.com/home">Homepage</gd-breadcrumb-item>

  <gd-breadcrumb-item href="https://example.com/home/services">Our Services</gd-breadcrumb-item>

  <gd-breadcrumb-item href="https://example.com/home/services/digital">Digital Media</gd-breadcrumb-item>

  <gd-breadcrumb-item href="https://example.com/home/services/digital/web-design">Web Design</gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import SlBreadcrumb from '@gesdisc/components/dist/react/breadcrumb';
import SlBreadcrumbItem from '@gesdisc/components/dist/react/breadcrumb-item';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem href="https://example.com/home">Homepage</SlBreadcrumbItem>

    <SlBreadcrumbItem href="https://example.com/home/services">Our Services</SlBreadcrumbItem>

    <SlBreadcrumbItem href="https://example.com/home/services/digital">Digital Media</SlBreadcrumbItem>

    <SlBreadcrumbItem href="https://example.com/home/services/digital/web-design">Web Design</SlBreadcrumbItem>
  </SlBreadcrumb>
);
```

### Custom Separators

Use the `separator` slot to change the separator that goes between breadcrumb items. Icons work well, but you can also use text or an image.

```html:preview
<gd-breadcrumb>
  <gd-icon name="dot" slot="separator"></gd-icon>
  <gd-breadcrumb-item>First</gd-breadcrumb-item>
  <gd-breadcrumb-item>Second</gd-breadcrumb-item>
  <gd-breadcrumb-item>Third</gd-breadcrumb-item>
</gd-breadcrumb>

<br />

<gd-breadcrumb>
  <gd-icon name="arrow-right" slot="separator"></gd-icon>
  <gd-breadcrumb-item>First</gd-breadcrumb-item>
  <gd-breadcrumb-item>Second</gd-breadcrumb-item>
  <gd-breadcrumb-item>Third</gd-breadcrumb-item>
</gd-breadcrumb>

<br />

<gd-breadcrumb>
  <span slot="separator">/</span>
  <gd-breadcrumb-item>First</gd-breadcrumb-item>
  <gd-breadcrumb-item>Second</gd-breadcrumb-item>
  <gd-breadcrumb-item>Third</gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import SlBreadcrumb from '@gesdisc/components/dist/react/breadcrumb';
import SlBreadcrumbItem from '@gesdisc/components/dist/react/breadcrumb-item';

const App = () => (
  <>
    <SlBreadcrumb>
      <gd-icon name="dot" slot="separator" />
      <SlBreadcrumbItem>First</SlBreadcrumbItem>
      <SlBreadcrumbItem>Second</SlBreadcrumbItem>
      <SlBreadcrumbItem>Third</SlBreadcrumbItem>
    </SlBreadcrumb>

    <br />

    <SlBreadcrumb>
      <gd-icon name="arrow-right" slot="separator" />
      <SlBreadcrumbItem>First</SlBreadcrumbItem>
      <SlBreadcrumbItem>Second</SlBreadcrumbItem>
      <SlBreadcrumbItem>Third</SlBreadcrumbItem>
    </SlBreadcrumb>

    <br />

    <SlBreadcrumb>
      <span slot="separator">/</span>
      <SlBreadcrumbItem>First</SlBreadcrumbItem>
      <SlBreadcrumbItem>Second</SlBreadcrumbItem>
      <SlBreadcrumbItem>Third</SlBreadcrumbItem>
    </SlBreadcrumb>
  </>
);
```

### Prefixes

Use the `prefix` slot to add content before any breadcrumb item.

```html:preview
<gd-breadcrumb>
  <gd-breadcrumb-item>
    <gd-icon slot="prefix" name="house"></gd-icon>
    Home
  </gd-breadcrumb-item>
  <gd-breadcrumb-item>Articles</gd-breadcrumb-item>
  <gd-breadcrumb-item>Traveling</gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import SlBreadcrumb from '@gesdisc/components/dist/react/breadcrumb';
import SlBreadcrumbItem from '@gesdisc/components/dist/react/breadcrumb-item';
import SlIcon from '@gesdisc/components/dist/react/icon';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem>
      <SlIcon slot="prefix" name="house" />
      Home
    </SlBreadcrumbItem>
    <SlBreadcrumbItem>Articles</SlBreadcrumbItem>
    <SlBreadcrumbItem>Traveling</SlBreadcrumbItem>
  </SlBreadcrumb>
);
```

### Suffixes

Use the `suffix` slot to add content after any breadcrumb item.

```html:preview
<gd-breadcrumb>
  <gd-breadcrumb-item>Documents</gd-breadcrumb-item>
  <gd-breadcrumb-item>Policies</gd-breadcrumb-item>
  <gd-breadcrumb-item>
    Security
    <gd-icon slot="suffix" name="shield-lock"></gd-icon>
  </gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import SlBreadcrumb from '@gesdisc/components/dist/react/breadcrumb';
import SlBreadcrumbItem from '@gesdisc/components/dist/react/breadcrumb-item';
import SlIcon from '@gesdisc/components/dist/react/icon';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem>Documents</SlBreadcrumbItem>
    <SlBreadcrumbItem>Policies</SlBreadcrumbItem>
    <SlBreadcrumbItem>
      Security
      <SlIcon slot="suffix" name="shield-lock"></SlIcon>
    </SlBreadcrumbItem>
  </SlBreadcrumb>
);
```

### With Dropdowns

Dropdown menus can be placed in a prefix or suffix slot to provide additional options.

```html:preview
<gd-breadcrumb>
  <gd-breadcrumb-item>Homepage</gd-breadcrumb-item>
  <gd-breadcrumb-item>Our Services</gd-breadcrumb-item>
  <gd-breadcrumb-item>Digital Media</gd-breadcrumb-item>
  <gd-breadcrumb-item>
    Web Design
    <gd-dropdown slot="suffix">
      <gd-button slot="trigger" size="small" circle>
        <gd-icon label="More options" name="three-dots"></gd-icon>
      </gd-button>
      <gd-menu>
        <gd-menu-item type="checkbox" checked>Web Design</gd-menu-item>
        <gd-menu-item type="checkbox">Web Development</gd-menu-item>
        <gd-menu-item type="checkbox">Marketing</gd-menu-item>
      </gd-menu>
    </gd-dropdown>
  </gd-breadcrumb-item>
</gd-breadcrumb>
```

```jsx:react
import {
  SlBreadcrumb,
  SlBreadcrumbItem,
  SlButton,
  SlDropdown,
  SlIcon,
  SlMenu,
  SlMenuItem
} from '@gesdisc/components/dist/react';

const App = () => (
  <SlBreadcrumb>
    <SlBreadcrumbItem>Homepage</SlBreadcrumbItem>
    <SlBreadcrumbItem>Our Services</SlBreadcrumbItem>
    <SlBreadcrumbItem>Digital Media</SlBreadcrumbItem>
    <SlBreadcrumbItem>
      Web Design
      <SlDropdown slot="suffix">
        <SlButton slot="trigger" size="small" circle>
          <SlIcon label="More options" name="three-dots"></SlIcon>
        </SlButton>
        <SlMenu>
          <SlMenuItem type="checkbox" checked>
            Web Design
          </SlMenuItem>
          <SlMenuItem type="checkbox">Web Development</SlMenuItem>
          <SlMenuItem type="checkbox">Marketing</SlMenuItem>
        </SlMenu>
      </SlDropdown>
    </SlBreadcrumbItem>
  </SlBreadcrumb>
);
```
