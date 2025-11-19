---
meta:
    title: Tag
    description: Tags are simple labels that help categorize items.
layout: component
sidebarSection: Elements
---

## Usage

Tags come in three variants: content tags (with icons), topic tags (clickable labels), and urgent labels (for breaking news). Use the `variant` prop to specify which type of tag you need.

```html:preview
<terra-tag variant="content" icon="asteroid">Feature</terra-tag>
```

```jsx:react
import TerraTag from '@nasa-terra/components/dist/react/tag';

const App = () => (
    <TerraTag variant="content" icon="asteroid">Feature</TerraTag>
);
```

## Variants

### Content Tags

Content tags contain an icon and a label, and are added to card components to identify content types. Content tags help visitors know what to expect when they engage with content. Only use one content tag per card.

```html:preview
<terra-tag variant="content" icon="asteroid">Feature</terra-tag>
<terra-tag variant="content" icon="chevron-right-circle">Article</terra-tag>
<terra-tag variant="content" icon="caret">Interactive</terra-tag>
```

You can also use custom icons via the icon slot:

```html:preview
<terra-tag variant="content">
    <terra-icon slot="icon" name="outline-microphone" library="heroicons"></terra-icon>
    Podcast
</terra-tag>
```

### Topic Tags

Topic tags are shown on article and press release pages to assign content to multiple topics or subjects. Topic tags aid in discovery, since they are clickable and direct to topic, subtopic, or mission pages to view other content with that tag. These tags can stack up to form tight clusters.

```html:preview
<terra-tag variant="topic">Humans in Space</terra-tag>
<terra-tag variant="topic">Missions</terra-tag>
<terra-tag variant="topic">Solar System</terra-tag>
```

Topic tags can be used as links by providing an `href`:

```html:preview
<terra-tag variant="topic" href="/topics/humans-in-space">Humans in Space</terra-tag>
<terra-tag variant="topic" href="/topics/missions">Missions</terra-tag>
<terra-tag variant="topic" href="/topics/solar-system">Solar System</terra-tag>
```

### Urgent Labels

Urgent labels are used to label Breaking News or Live content in those specific modules. They have a bold red fill that draws attention to these important and immediate updates.

```html:preview
<terra-tag variant="urgent">Breaking News</terra-tag>
```

## Sizes

Tags support three sizes: `small`, `medium` (default), and `large`. The size affects the font size, icon size (for content tags), and padding (for topic and urgent tags).

```html:preview
<div>
    <terra-tag variant="content" icon="asteroid" size="small">Small</terra-tag>
    <terra-tag variant="content" icon="asteroid" size="medium">Medium</terra-tag>
    <terra-tag variant="content" icon="asteroid" size="large">Large</terra-tag>
</div>

<div>
    <terra-tag variant="topic" size="small">Small Topic</terra-tag>
    <terra-tag variant="topic" size="medium">Medium Topic</terra-tag>
    <terra-tag variant="topic" size="large">Large Topic</terra-tag>
</div>

<div>
    <terra-tag variant="urgent" size="small">SMALL</terra-tag>
    <terra-tag variant="urgent" size="medium">MEDIUM</terra-tag>
    <terra-tag variant="urgent" size="large">LARGE</terra-tag>
</div>
```

## Stacking

By default, tags sit side by side. Use the `stack` prop to make tags stack vertically:

```html:preview
<terra-tag variant="topic" stack>Humans in Space</terra-tag>
<terra-tag variant="topic" stack>Missions</terra-tag>
<terra-tag variant="topic" stack>Solar System</terra-tag>
```

## Dark Mode

Tags automatically adapt to dark mode based on system preference. Use the `dark` prop to force dark mode styles when placing the component on a dark background.

### Light Background

```html:preview
<div style="background-color: #f5f5f5; padding: 2rem;">
    <terra-tag variant="content" icon="asteroid">Feature</terra-tag>
    <br /><br />
    <terra-tag variant="topic">Humans in Space</terra-tag>
    <br /><br />
    <terra-tag variant="urgent">Breaking News</terra-tag>
</div>
```

### Dark Background

When placing tags on a dark background, use the `dark` prop to ensure proper contrast:

```html:preview
<div style="background-color: #1a1a1a; padding: 2rem;">
    <terra-tag variant="content" icon="asteroid" dark>Feature</terra-tag>
    <br /><br />
    <terra-tag variant="topic" dark>Humans in Space</terra-tag>
    <br /><br />
    <terra-tag variant="urgent" dark>Breaking News</terra-tag>
</div>
```

## Events

Topic tags emit a `terra-click` event when clicked (unless they have an `href`):

```html:preview
<terra-tag variant="topic" class="clickable-tag">Click me</terra-tag>
<script>
    const tag = document.querySelector('.clickable-tag');
    tag.addEventListener('terra-click', (e) => {
        alert('Tag clicked!');
    });
</script>
```

## Customization

You can customize tag appearance using CSS custom properties:

```css
terra-tag {
    --terra-tag-font-family: var(--terra-font-family--inter);
    --terra-tag-font-size-medium: var(--terra-font-size-small);
    --terra-tag-font-weight: var(--terra-font-weight-normal);
    --terra-tag-color: var(--terra-color-carbon-90);
    --terra-tag-background-color: transparent;
}
```

### Design Tokens

The following design tokens are available for customization:

**Typography:**

-   `--terra-tag-font-family`: Font family (default: `--terra-font-family--inter`)
-   `--terra-tag-font-size-small`: Font size for small tags (default: `--terra-font-size-x-small`)
-   `--terra-tag-font-size-medium`: Font size for medium tags (default: `--terra-font-size-small`)
-   `--terra-tag-font-size-large`: Font size for large tags (default: `--terra-font-size-medium`)
-   `--terra-tag-font-weight`: Font weight (default: `--terra-font-weight-normal`)
-   `--terra-tag-font-weight-urgent`: Font weight for urgent tags (default: `--terra-font-weight-bold`)

**Colors:**

-   `--terra-tag-color`: Text color (default: `--terra-color-carbon-90` in light mode, `--terra-color-carbon-60` in dark mode)
-   `--terra-tag-background-color`: Background color (default: `transparent`)
-   `--terra-tag-border-color`: Border color for topic tags (default: `--terra-color-carbon-30` in light mode, `--terra-color-carbon-20` in dark mode)
-   `--terra-tag-border-color-hover`: Border color for topic tags on hover (default: `--terra-color-carbon-40` in light mode, `--terra-color-carbon-30` in dark mode)
-   `--terra-tag-background-color-hover`: Background color for topic tags on hover (default: `--terra-color-carbon-5` in light mode, `--terra-color-carbon-10` in dark mode)
-   `--terra-tag-icon-border-color`: Border color for content tag icons (default: `--terra-color-carbon-40` in light mode, `--terra-color-carbon-30` in dark mode)
-   `--terra-tag-urgent-color`: Text color for urgent tags (default: `--terra-color-spacesuit-white`)
-   `--terra-tag-urgent-background-color`: Background color for urgent tags (default: `--terra-color-nasa-red`)

**Icon Sizes (Content Tags):**

-   `--terra-tag-icon-size-small`: Size of small content tag icon circles (default: `1.25rem`)
-   `--terra-tag-icon-size-medium`: Size of medium content tag icon circles (default: `1.5rem`)
-   `--terra-tag-icon-size-large`: Size of large content tag icon circles (default: `1.75rem`)
-   `--terra-tag-icon-inner-size-small`: Inner icon size for small content tags (default: `0.75rem`)
-   `--terra-tag-icon-inner-size-medium`: Inner icon size for medium content tags (default: `0.875rem`)
-   `--terra-tag-icon-inner-size-large`: Inner icon size for large content tags (default: `1rem`)

**Padding (Topic and Urgent Tags):**

-   `--terra-tag-padding-small`: Padding for small topic/urgent tags (default: `0.25rem 0.5rem`)
-   `--terra-tag-padding-medium`: Padding for medium topic/urgent tags (default: `var(--terra-spacing-x-small) var(--terra-spacing-small)`)
-   `--terra-tag-padding-large`: Padding for large topic/urgent tags (default: `0.625rem 1rem`)

All tokens automatically adapt to dark mode when dark mode is active (via system preference or the `dark` prop).

[component-metadata:terra-tag]
