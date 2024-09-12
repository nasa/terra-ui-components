---
meta:
    title: Color Tokens
    description: Color tokens help maintain consistent use of color throughout your app.
---

# Color Tokens

Color tokens help maintain consistent use of color throughout your app. The Horizon Design System provides palettes for theme colors as definined in the <a href='https://website.nasa.gov/hds/foundations/color/'>Horizon Design System Foundations guide</a>.

Color tokens are referenced using the `--terra-color-{name}-{n}` CSS custom property, where `{name}` is the name of the palette and `{n}` is the numeric value of the desired swatch.

## Theme Tokens

Theme tokens give you a semantic way to reference colors in your app. The primary palette is typically based on a brand color, whereas success, neutral, warning, and danger are used to visualize actions that correspond to their respective meanings.

<div class="color-palette">
  <div class="color-palette__name">
    Primary<br>
    <p>Our primary palette consists of black, white, red, and blue. These colors are used in 
      logical ways throughout the site to highlight actions when they are important. We use 
      a restricted palette to give attention and hierarchy to our content without distraction.
    </p>
    <code>--terra-color-<em>{name}</em></code>
  </div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-black);"></div>carbon-black</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-spacesuit-white);"></div>spacesuit-white</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-nasa-red);"></div>nasa-red</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-nasa-blue);"></div>nasa-blue</div>
</div>

<div class="color-palette">
  <div class="color-palette__name">
    Extended Palette<br>
    <p>The extended palette consists of a tint and shade for the brand colors in the primary palette. 
      Usage of these colors varies depending on the touch point, but they come in handy to ensure that your combinations are always AAA accessible.
    </p>
    <code>--terra-color-<em>{name}</em></code>
  </div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-nasa-red-tint);"></div>nasa-red-tint</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-nasa-red-shade);"></div>nasa-red-shade</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-nasa-blue-tint);"></div>nasa-blue-tint</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-nasa-blue-shade);"></div>nasa-blue-shade</div>
</div>

<div class="color-palette">
  <div class="color-palette__name">
    Neutrals<br>
    <p>Neutrals have varying degrees of value that allow for the appropriate levels of contrast across the system. 
     Typically, they are used for text and subtle backgrounds to de-emphasize a piece of secondary content.
    </p>
    <code>--terra-color-carbon-<em>{n}</em></code>
  </div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-90);"></div>90</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-80);"></div>80</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-70);"></div>70</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-60);"></div>60</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-50);"></div>50</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-40);"></div>40</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-30);"></div>30</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-20);"></div>20</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-10);"></div>10</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-carbon-5);"></div>5</div>
</div>

<div class="color-palette">
  <div class="color-palette__name">
    Additional Colors<br>
    <p>International Orange and Active Green are colors that are used sparingly and intentionally.
    </p>
    <code>--terra-color-<em>{name}</em></code>
  </div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-international-orange);"></div>international-orange</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-international-orange-tint);"></div>international-orange-tint</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-international-orange-shade);"></div>international-orange-shade</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-active-green);"></div>active-green</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-active-green-tint);"></div>active-green-tint</div>
  <div class="color-palette__example"><div class="color-palette__swatch" style="background-color: var(--terra-color-active-green-shade);"></div>active-green-shade</div>
</div>
