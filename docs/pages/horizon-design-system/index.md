---
meta:
    title: Horizon Design System Overview
    description: Learn how to use Horizon Design System (HDS) CSS variables and themes in your applications
---

# Horizon Design System Overview

The [Horizon Design System (HDS)](https://website.nasa.gov/hds/) is NASA's design system for building consistent, accessible web applications. Terra UI Components includes the HDS theme (`horizon.css`) which provides a comprehensive set of CSS variables that you can use directly in your applications, even if you're not using Terra web components.

This section shows you how to use HDS design tokens, CSS variables, and themes to style your applications with NASA's design system.

## What is Horizon Design System?

Horizon Design System is NASA's official design system that provides:

-   **Design Tokens**: Colors, typography, spacing, and other design values
-   **Components**: Reusable UI components following NASA design guidelines
-   **Accessibility**: Built-in accessibility standards and best practices
-   **Consistency**: Ensures visual and functional consistency across NASA applications

## Using the Horizon Theme

The `horizon.css` theme file contains all the HDS design tokens as CSS custom properties (CSS variables). You can import and use these variables in your own CSS, regardless of whether you're using Terra web components.

### Installation

To use the Horizon theme, import the CSS file in your HTML:

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon.css"
/>
```

Or if you're using npm:

```html
<link
    rel="stylesheet"
    href="node_modules/@nasa-terra/components/%NPMDIR%/themes/horizon.css"
/>
```

The theme is automatically applied to `:root`, so all CSS variables are available globally once imported.

### Dark Mode

The `horizon.css` theme file includes both light and dark themes. Dark mode can be enabled in two ways:

**Automatic dark mode (requires opt-in):**

To enable automatic dark mode based on system preference, add the `terra-prefers-color-scheme` class to the `<body>` element:

```html
<body class="terra-prefers-color-scheme">
    <!-- Dark mode activates automatically based on system preference -->
    ...
</body>
```

**Manual dark mode override:**

```html
<html class="terra-theme-dark">
    <!-- Always use dark mode, regardless of system preference -->
    ...
</html>
```

**Force light mode:**

```html
<html class="terra-theme-horizon">
    <!-- Always use light mode, regardless of system preference -->
    ...
</html>
```

## Using CSS Variables in Your Code

Once you've imported the Horizon theme, you can use any of the design tokens in your own stylesheets. See the [Design Tokens](/tokens/typography) section for a complete reference of all available tokens.

```css
.my-button {
    background-color: var(--terra-color-nasa-blue);
    color: var(--terra-color-spacesuit-white);
    padding: var(--terra-spacing-small) var(--terra-spacing-medium);
    border-radius: var(--terra-border-radius-medium);
    font-family: var(--terra-font-family--inter);
    font-size: var(--terra-font-size-medium);
    transition: background-color var(--terra-transition-medium);
}

.my-button:hover {
    background-color: var(--terra-color-nasa-blue-shade);
}
```

```html
<button class="my-button">Click Me</button>
```

## Extending the Horizon Theme

You can extend the Horizon theme by creating your own stylesheet that overrides or adds to the existing variables. This is useful when you need custom colors or spacing that aren't in the base theme.

### Overriding Variables

To override existing variables, create a new stylesheet and scope it to the same selectors as the Horizon theme:

```css
:root,
:host,
.terra-theme-horizon {
    /* Override existing variables */
    --terra-color-nasa-blue: #0066cc;

    /* Add new custom variables */
    --my-custom-color: #ff9900;
    --my-custom-spacing: 2.5rem;
}
```

Make sure to import your custom stylesheet **after** the Horizon theme:

```html
<link rel="stylesheet" href="path/to/horizon.css" />
<link rel="stylesheet" href="path/to/my-custom-theme.css" />
```

### Creating Theme Variants

You can create entirely new theme variants by scoping your variables to a custom class:

```css
:host,
.terra-theme-custom {
    /* Your custom theme variables */
    --terra-color-primary: #8b5cf6;
    --terra-color-secondary: #ec4899;
    /* ... */
}
```

Then apply the theme class to activate it:

```html
<html class="terra-theme-custom">
    ...
</html>
```

## Best Practices

1. **Use Design Tokens**: Always use CSS variables instead of hardcoded values to maintain consistency and enable theming. See the [Design Tokens](/tokens/typography) section for available tokens.

2. **Respect the Color Palette**: Stick to the HDS color palette for brand consistency. Use neutrals for text and backgrounds.

3. **Accessibility**: HDS colors are tested for accessibility. When creating custom colors, ensure they meet WCAG AA contrast requirements.

4. **Typography Hierarchy**: Use the provided font sizes and weights to create clear visual hierarchy.

5. **Consistent Spacing**: Use the spacing scale for margins, padding, and gaps to maintain visual rhythm.

## Adoption Status

This page tracks the progress of Terra UI Components in adopting the Horizon Design System. Components are marked based on their current implementation status.

### Status Legend

-   ✅ **Fully Supported** - Component fully implements HDS design tokens and guidelines
-   🟡 **In Progress** - Component partially implements HDS, with known gaps
-   ❌ **Not Supported** - Component not yet implemented or not planned

### Elements

| Component                                         | Status             | Notes                                                                                                     |
| ------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| [Avatar](/components/avatar)                      | ✅ Fully Supported | Implements HDS avatar guidelines with image, initials, and icon support. Full dark mode support.          |
| Badges                                            | ❌ Not Supported   | Not yet implemented.                                                                                      |
| [Button](/components/button)                      | ✅ Fully Supported | Core HDS styles implemented. Some variants were modified to fit application UI better.                    |
| [Caption](/components/caption)                    | ✅ Fully Supported | CSS-only component for displaying captions with support for credits. Full dark mode support.              |
| [Checkbox](/components/checkbox)                  | ✅ Fully Supported | Implements HDS checkbox guidelines with design tokens, form integration, and full dark mode support.      |
| [Chip](/components/chip)                          | ✅ Fully Supported | Fully implements HDS chip design with dark mode support.                                                  |
| [Date Picker](/components/date-picker)            | ✅ Fully Supported | Implements HDS date picker patterns with design tokens, help text support, and full dark mode support.    |
| [File Upload](/components/file-upload)            | ✅ Fully Supported | Implements HDS file upload patterns with drag-and-drop, previews, and full dark mode support.             |
| Links                                             | ❌ Not Supported   | Not yet implemented.                                                                                      |
| [Loader](/components/loader)                      | ✅ Fully Supported | Implements HDS loader patterns with design tokens.                                                        |
| [Pagination](/components/pagination)              | ✅ Fully Supported | Implements HDS pagination patterns with design tokens, circular icon buttons, and full dark mode support. |
| [Radio](/components/radio)                        | ✅ Fully Supported | Implements HDS radio button guidelines with design tokens, form integration, and full dark mode support.  |
| [Scroll Hint](/components/scroll-hint)            | ✅ Fully Supported | Implements HDS scroll hint patterns with animation and dark mode support.                                 |
| [Select](/components/select)                      | ✅ Fully Supported | Implements HDS select field patterns with design tokens, multiple selection, and full dark mode support.  |
| [Slider](/components/slider)                      | ✅ Fully Supported | Implements HDS slider patterns with design tokens, tooltip merging, and full dark mode support.           |
| [Status Indicator](/components/status-indicator)  | ✅ Fully Supported | Displays mission/project status with a colored dot and label. Full dark mode support.                     |
| [Tag](/components/tag)                            | ✅ Fully Supported | Supports content, topic, and urgent variants with icons, stacking, and full dark mode support.            |
| Text & Select Fields ([Input](/components/input)) | ✅ Fully Supported | Implements HDS input field patterns with design tokens, prefix/suffix slots, and full dark mode support.  |
| [Toggle](/components/toggle)                      | ✅ Fully Supported | Implements HDS toggle patterns with design tokens and full dark mode support.                             |

### Components

| Component                          | Status             | Notes                                                                       |
| ---------------------------------- | ------------------ | --------------------------------------------------------------------------- |
| [Accordion](/components/accordion) | ✅ Fully Supported | Implements HDS accordion patterns with design tokens and dark mode support. |
| Article Building Blocks            | ❌ Not Supported   | Not yet implemented.                                                        |
| Audio Player                       | ❌ Not Supported   | Not yet implemented.                                                        |
| Blockquote                         | ❌ Not Supported   | Not yet implemented.                                                        |
| Breadcrumbs                        | ❌ Not Supported   | Not yet implemented.                                                        |
| Cards                              | ❌ Not Supported   | Not yet implemented.                                                        |
| Carousel Thumbnails                | ❌ Not Supported   | Not yet implemented.                                                        |
| Countdown                          | ❌ Not Supported   | Not yet implemented.                                                        |
| [Dialog](/components/dialog)       | ✅ Fully Supported | Implements HDS modal patterns with design tokens. Dialogs & Modals.         |
| [Dropdown](/components/dropdown)   | ✅ Fully Supported | Uses HDS design tokens. Dropdown Menus.                                     |
| Filter & Sorts                     | ❌ Not Supported   | Not yet implemented.                                                        |
| Gallery Thumbnails                 | ❌ Not Supported   | Not yet implemented.                                                        |
| Image with Caption                 | ❌ Not Supported   | Not yet implemented.                                                        |
| List                               | ❌ Not Supported   | Not yet implemented.                                                        |
| Live Event Ticker                  | ❌ Not Supported   | Not yet implemented.                                                        |
| Quick Facts Carousel               | ❌ Not Supported   | Not yet implemented.                                                        |
| Search Fields                      | ❌ Not Supported   | Not yet implemented.                                                        |
| Sign Up                            | ❌ Not Supported   | Not yet implemented.                                                        |
| Social Media Share                 | ❌ Not Supported   | Not yet implemented.                                                        |
| Stepper                            | ❌ Not Supported   | Not yet implemented.                                                        |
| Table of Contents                  | ❌ Not Supported   | Not yet implemented.                                                        |
| Tabs                               | ❌ Not Supported   | Not yet implemented.                                                        |
| [Popup](/components/popup)         | ✅ Fully Supported | Implements HDS popup patterns. Tooltips and Popovers.                       |
| Video Player                       | ❌ Not Supported   | Not yet implemented.                                                        |
| Vitals                             | ❌ Not Supported   | Not yet implemented.                                                        |

### Modules

| Component                         | Status           | Notes                |
| --------------------------------- | ---------------- | -------------------- |
| 3D Model Module                   | ❌ Not Supported | Not yet implemented. |
| About the Author                  | ❌ Not Supported | Not yet implemented. |
| Article Hero Image                | ❌ Not Supported | Not yet implemented. |
| Ask NASA                          | ❌ Not Supported | Not yet implemented. |
| Banners                           | ❌ Not Supported | Not yet implemented. |
| Callout                           | ❌ Not Supported | Not yet implemented. |
| Card Carousel                     | ❌ Not Supported | Not yet implemented. |
| Card Grid                         | ❌ Not Supported | Not yet implemented. |
| Centers & Facilities              | ❌ Not Supported | Not yet implemented. |
| Contingency Homepage              | ❌ Not Supported | Not yet implemented. |
| Credits & Resources               | ❌ Not Supported | Not yet implemented. |
| Event List                        | ❌ Not Supported | Not yet implemented. |
| Eyes on the Solar System Embed    | ❌ Not Supported | Not yet implemented. |
| Feature 50/50                     | ❌ Not Supported | Not yet implemented. |
| Feature/Chapter Divider           | ❌ Not Supported | Not yet implemented. |
| Feature/Feature Nav               | ❌ Not Supported | Not yet implemented. |
| Feature/Fullscreen Carousel       | ❌ Not Supported | Not yet implemented. |
| Feature/Hero Numbers              | ❌ Not Supported | Not yet implemented. |
| Feature/Hero Quote                | ❌ Not Supported | Not yet implemented. |
| Feature/Intro                     | ❌ Not Supported | Not yet implemented. |
| Feature/Oversized Text            | ❌ Not Supported | Not yet implemented. |
| Feature/Scrapbook Gallery         | ❌ Not Supported | Not yet implemented. |
| Featured Image                    | ❌ Not Supported | Not yet implemented. |
| Featured Link                     | ❌ Not Supported | Not yet implemented. |
| Featured Link List                | ❌ Not Supported | Not yet implemented. |
| Featured Mission                  | ❌ Not Supported | Not yet implemented. |
| Featured Podcast                  | ❌ Not Supported | Not yet implemented. |
| Featured Story                    | ❌ Not Supported | Not yet implemented. |
| Featured Video                    | ❌ Not Supported | Not yet implemented. |
| Featured/Content Banner           | ❌ Not Supported | Not yet implemented. |
| File List                         | ❌ Not Supported | Not yet implemented. |
| Forms Embed                       | ❌ Not Supported | Not yet implemented. |
| Gallery Hero                      | ❌ Not Supported | Not yet implemented. |
| Gallery Preview                   | ❌ Not Supported | Not yet implemented. |
| Hero Numbers                      | ❌ Not Supported | Not yet implemented. |
| Iframe Embeds                     | ❌ Not Supported | Not yet implemented. |
| Image Before/After                | ❌ Not Supported | Not yet implemented. |
| Image Carousel and Image Timeline | ❌ Not Supported | Not yet implemented. |
| Image Detail Modal                | ❌ Not Supported | Not yet implemented. |
| Inline Case Study                 | ❌ Not Supported | Not yet implemented. |
| Interactive Exhibit               | ❌ Not Supported | Not yet implemented. |
| Listicle                          | ❌ Not Supported | Not yet implemented. |
| Map                               | ❌ Not Supported | Not yet implemented. |
| Math Equations                    | ❌ Not Supported | Not yet implemented. |
| Meet the…                         | ❌ Not Supported | Not yet implemented. |
| Mission Hero                      | ❌ Not Supported | Not yet implemented. |
| NASA Live                         | ❌ Not Supported | Not yet implemented. |
| NASA Mag                          | ❌ Not Supported | Not yet implemented. |
| Navigation                        | ❌ Not Supported | Not yet implemented. |
| News Modules                      | ❌ Not Supported | Not yet implemented. |
| Page Intro                        | ❌ Not Supported | Not yet implemented. |
| Parallax Image                    | ❌ Not Supported | Not yet implemented. |
| Planet Hero                       | ❌ Not Supported | Not yet implemented. |
| Q&A                               | ❌ Not Supported | Not yet implemented. |
| Quiz                              | ❌ Not Supported | Not yet implemented. |
| Related Articles                  | ❌ Not Supported | Not yet implemented. |
| Slideshow                         | ❌ Not Supported | Not yet implemented. |
| Social Media Feed                 | ❌ Not Supported | Not yet implemented. |
| Story Block                       | ❌ Not Supported | Not yet implemented. |
| Subscription Banner               | ❌ Not Supported | Not yet implemented. |
| Tabbed Section                    | ❌ Not Supported | Not yet implemented. |
| Tables                            | ❌ Not Supported | Not yet implemented. |
| Team Member Spotlight             | ❌ Not Supported | Not yet implemented. |
| Timeline                          | ❌ Not Supported | Not yet implemented. |
| Topic Cards                       | ❌ Not Supported | Not yet implemented. |
| Topic Hero                        | ❌ Not Supported | Not yet implemented. |
| Topic Spotlight                   | ❌ Not Supported | Not yet implemented. |

### Templates

| Component               | Status           | Notes                |
| ----------------------- | ---------------- | -------------------- |
| 404 Page                | ❌ Not Supported | Not yet implemented. |
| About                   | ❌ Not Supported | Not yet implemented. |
| About NASA              | ❌ Not Supported | Not yet implemented. |
| Articles                | ❌ Not Supported | Not yet implemented. |
| Bio Page                | ❌ Not Supported | Not yet implemented. |
| Blog Overview           | ❌ Not Supported | Not yet implemented. |
| Blog Page               | ❌ Not Supported | Not yet implemented. |
| Blog Post               | ❌ Not Supported | Not yet implemented. |
| Careers                 | ❌ Not Supported | Not yet implemented. |
| Center/Org/Institution  | ❌ Not Supported | Not yet implemented. |
| Centers & Facilities    | ❌ Not Supported | Not yet implemented. |
| Contact NASA            | ❌ Not Supported | Not yet implemented. |
| Encyclopedic Reference  | ❌ Not Supported | Not yet implemented. |
| Event Calendar          | ❌ Not Supported | Not yet implemented. |
| Galleries Home          | ❌ Not Supported | Not yet implemented. |
| Homepage                | ❌ Not Supported | Not yet implemented. |
| Impacts and Benefits    | ❌ Not Supported | Not yet implemented. |
| Mission Hubs            | ❌ Not Supported | Not yet implemented. |
| NASA TV Page            | ❌ Not Supported | Not yet implemented. |
| News and Events         | ❌ Not Supported | Not yet implemented. |
| Press Kit               | ❌ Not Supported | Not yet implemented. |
| Q&A Interactive Archive | ❌ Not Supported | Not yet implemented. |
| Q&A Page                | ❌ Not Supported | Not yet implemented. |
| Quiz Template           | ❌ Not Supported | Not yet implemented. |
| Raw Image Gallery       | ❌ Not Supported | Not yet implemented. |
| Sitemap                 | ❌ Not Supported | Not yet implemented. |
| Special Features        | ❌ Not Supported | Not yet implemented. |
| Subtopic Hub            | ❌ Not Supported | Not yet implemented. |
| Topic Galleries         | ❌ Not Supported | Not yet implemented. |
| Topic Hubs              | ❌ Not Supported | Not yet implemented. |

:::tip
If you need a component that's not listed here or marked as "Not Supported", please [create a GitHub issue](https://github.com/nasa/terra-ui-components/issues/new) to request it.
:::

## Contributing

If you're working on implementing HDS support for a component, please:

1. Use design tokens from `horizon.css` instead of hardcoded values
2. Ensure dark mode support using the provided dark mode tokens
3. Follow HDS accessibility guidelines
4. Update this page when status changes

## Next Steps

-   Explore [Design Tokens](/tokens/typography) to see all available CSS variables
-   Learn about [HDS Components](/components/avatar) in the component documentation
-   Visit the [official HDS website](https://website.nasa.gov/hds/) for more information
