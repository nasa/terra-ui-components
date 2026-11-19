# Terra Color Exporter Plugin for Figma

### Intro

    The Horizon Design System (HDS) theme used by the Terra UI Components was developed for the NASA.gov website. The HDS theme color palette was expanded for web applications to include a wider range of shades to accommodate UI element states and light/dark mode themes.  This design work was done in the [Figma HDS Design System](https://www.figma.com/design/VvOg9o8tFLVafy8TDAtmLs/HDS-Design-System?m=auto&t=BJjdcdJ5ZhhDWuUe-6) project. This project file uses color variables to define the primative, foundation and semantic color tokens used through the Figma project.
    The primitives provide raw color values to the foundation layer; the foundation layer establishes the theme and assigns roles; the semantic layer defines UI specific roles and are used directly by in the component’s CSS rules.

    A custom Figma plugin called "Terra Color Exporter" generates the CSS tokens directly from the Figma
    color variables. The plugin code consists of a manifest.json which registers the plugin with Figma; ui.html which defines the plugin interface; and code.js which does the actual conversion of the Figma color variables to CSS token names and values. If the colors in the Figma HDS Design System are updated,the plugin needs to rerun, and the token values copied back into the horizon.scss file.

### Installing the Terra Color Exporter plugin:

1. Save the plugin files from the GitHub repo to a local directory
2. In Figma go to Plugins > Development > Import plugin from manifest
3. Browse to where you saved the plugin.

### Running the Terra Color Exporter plugin:

1. In Figma go to Plugins > Development >Terra Color Exporter
2. Click “Generate CSS”
3. Click “Copy to Clipboard”
4. Now you can paste it into the horizon.scss file in the Terra-UI components.
5. It’s better to cut and paste sections one at a time into the appropriate sections of the horizon.scss file.
