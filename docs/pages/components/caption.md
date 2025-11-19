---
meta:
    title: Caption
    description: Captions are small text blocks that describe photos, provide additional context and information, and give credit to photographers and other content owners and creators.
layout: component
sidebarSection: Elements
---

# Caption

Captions are small text blocks that describe photos, provide additional context and information, and give credit to photographers and other content owners and creators.

[component-metadata:terra-caption]

## Usage

Captions can be used generally to support images and other media throughout the site, but they mostly appear on content pages such as articles, press releases, and features.

```html:preview
<figure>
    <img
        src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop"
        alt="NASA engineers carefully transport and test the telescope"
        style="width: 100%; max-width: 800px; height: auto; display: block;"
    />
    <terra-caption>
        NASA engineers carefully transport and test the telescope to ensure it is ready for launch.
        <span class="credit">Image Credit: Goddard Space Flight Center</span>
    </terra-caption>
</figure>
```

```jsx:react
import TerraCaption from '@nasa-terra/components/dist/react/caption';

const App = () => (
    <terra-caption>
        NASA engineers carefully transport and test the telescope to ensure it is ready for launch.
        <span className="credit">Image Credit: Goddard Space Flight Center</span>
    </terra-caption>
);
```

## Variants and Options

Captions come in 2 color schemes, so they can be used in light and dark modules and pages. If credits are needed, they are added to the end of the caption in a color with higher contrast.

### Light Background

```html:preview
<div style="background-color: #f5f5f5; padding: 2rem;">
    <figure>
        <img
            src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop"
            alt="NASA engineers carefully transport and test the telescope"
            style="width: 100%; max-width: 800px; height: auto; display: block;"
        />
        <terra-caption>
            NASA engineers carefully transport and test the telescope to ensure it is ready for launch.
            <span class="credit">Image Credit: Goddard Space Flight Center</span>
        </terra-caption>
    </figure>
</div>
```

### Dark Background

```html:preview
<div style="background-color: #1a1a1a; padding: 2rem;">
    <figure>
        <img
            src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop"
            alt="NASA engineers carefully transport and test the telescope"
            style="width: 100%; max-width: 800px; height: auto; display: block;"
        />
        <terra-caption>
            NASA engineers carefully transport and test the telescope to ensure it is ready for launch.
            <span class="credit">Image Credit: Goddard Space Flight Center</span>
        </terra-caption>
    </figure>
</div>
```

## Credits

Credits are displayed with higher contrast than the main caption text. Use a `<span>` element with the `credit` class to mark credit text:

```html:preview
<terra-caption>
    A close-up of the head of the rover's remote sensing mast. The mast head contains the SuperCam instrument. (Its lens is in the large circular opening.) In the gray boxes beneath mast head are the two Mastcam-Z images. On the exterior sides of those images are the rover's two navigation cameras.
    <span class="credit">Image Credits: NASA/JPL-Caltech</span>
</terra-caption>
```

## Customization

You can customize caption appearance using CSS custom properties:

```css
terra-caption {
    --terra-caption-font-family: var(--terra-font-family--inter);
    --terra-caption-font-size: var(--terra-font-size-small);
    --terra-caption-color: var(--terra-color-carbon-50);
    --terra-caption-credit-color: var(--terra-color-carbon-70);
}
```

### Design Tokens

The following design tokens are available for customization:

-   `--terra-caption-font-family`: Font family (default: `--terra-font-family--public-sans`)
-   `--terra-caption-font-size`: Font size (default: `--terra-font-size-small`)
-   `--terra-caption-font-weight`: Font weight (default: `--terra-font-weight-normal`)
-   `--terra-caption-line-height`: Line height (default: `--terra-line-height-normal`)
-   `--terra-caption-color`: Text color (default: `--terra-color-carbon-50` in light mode, `--terra-color-carbon-60` in dark mode)
-   `--terra-caption-credit-color`: Credit text color (default: `--terra-color-carbon-70` in light mode, `--terra-color-carbon-70` in dark mode)

All tokens automatically adapt to dark mode when dark mode is active.
