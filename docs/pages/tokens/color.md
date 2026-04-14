---
meta:
    title: Color Tokens
    description: Color tokens help maintain consistent use of color throughout your app.
---

# Color Tokens
The Terra UI components use the Horizon Design System color palette. The Horizon Design System is inspired by the colors of space and NASA’s brand. The purpose is to unify NASA websites and applications across the agency. The color palette is designed to be bold and vibrant, while also being accessible and functional. 
The Horizon Design System provides palettes for theme colors as definined in the <a href='https://website.nasa.gov/hds/foundations/color/'>Horizon Design System Foundations guide</a>.

## Theme Tokens
Color tokens help maintain consistent use of color throughout your app. Color tokens are referenced throughout the CSS rules to define the backgrounds, border and text colors used by the components. The color tokens prefixes are as follows; `--terra-color-{name}`, `--terra-text-{name}` and `--terra-border-{name}` where `{name}` is .
Theme tokens give you a semantic way to reference colors in your app. The primary palette is typically based on a brand color, whereas success, neutral, warning, and danger are used to visualize actions that correspond to their respective meanings.

### Horizon Design System Color Tokens
The <a href='/tokens/generated/horizon-design-system-color-tokens'>Horizon Design System color tokens</a> 

### Primitive Color Tokens
The <a href='/tokens/generated/primitive-tokens'>Primitive tokens</a> are expanded color palettes of the Horizon Design System colors. Primitive tokens are the raw base color values of your design system without any usage or meaning attached. They provide a consistent palette and enable light and dark theming. Primitive tokens feed into the <a href='/tokens/generated/foundation-tokens'>Foundation tokens</a>.

### Foundation Color Tokens

The <a href='/tokens/generated/foundation-tokens'>Foundation tokens</a> map raw primitives to general-purpose design concepts (like surface, text, border, brand) without tying them to specific components. They organize select primatives into design roles to create a consistent system vocabulary. <a href='/tokens/generated/foundation-tokens'>Foundation tokens</a> feed into the <a href='/tokens/generated/semantic-tokens'>Semantic tokens</a>.

### Semantic Color Tokens

<a href='/tokens/generated/semantic-tokens'>Semantic tokens</a> define how colors (or values) are used in the UI. They map <a href='/tokens/generated/foundation-tokens'>Foundation tokens</a> to specific UI roles and states (like button, tabs, input, dialog, or breadcrumb). These tokens are used by style rules to connect the design to UI elements.