---
meta:
    title: More Design Tokens
    description: Additional design tokens for focus rings, buttons, form inputs, toggles, overlays, panels, and tooltips.
---

# More Design Tokens

Additional design tokens for specific components and UI patterns. All tokens are defined in `horizon.css` and automatically adapt to dark mode when applicable.

## Focus Rings

Focus ring tokens control the appearance of focus rings. Note that form inputs use `--terra-input-focus-ring-*` tokens instead.

| Token                       | Value                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `--terra-focus-ring-color`  | `var(--terra-color-nasa-blue)`                                                              |
| `--terra-focus-ring-style`  | `solid`                                                                                     |
| `--terra-focus-ring-width`  | `3px`                                                                                       |
| `--terra-focus-ring`        | `var(--terra-focus-ring-style) var(--terra-focus-ring-width) var(--terra-focus-ring-color)` |
| `--terra-focus-ring-offset` | `1px`                                                                                       |

## Buttons

Button tokens control the appearance of buttons.

| Token                                  | Value                                |
| -------------------------------------- | ------------------------------------ |
| `--terra-button-font-size-small`       | `var(--terra-font-size-x-small)`     |
| `--terra-button-font-size-medium`      | `var(--terra-font-size-small)`       |
| `--terra-button-font-size-large`       | `var(--terra-font-size-medium)`      |
| `--terra-button-height-small`          | `1.875rem` (30px)                    |
| `--terra-button-height-medium`         | `2.25rem` (36px)                     |
| `--terra-button-height-large`          | `3rem` (48px)                        |
| `--terra-button-border-width`          | `1px`                                |
| `--terra-button-outline-text-color`    | `var(--terra-color-carbon-black)`    |
| `--terra-button-text-text-color`       | `var(--terra-color-nasa-blue)`       |
| `--terra-button-text-text-color-hover` | `var(--terra-color-nasa-blue-shade)` |
| `--terra-button-page-link-text-color`  | `var(--terra-color-carbon-black)`    |

## Form Inputs

Form input tokens control the appearance of form controls such as [input](/components/input).

| Token                                      | Value                                       |
| ------------------------------------------ | ------------------------------------------- |
| `--terra-input-height-small`               | `1.875rem` (30px)                           |
| `--terra-input-height-medium`              | `2.5rem` (40px)                             |
| `--terra-input-height-large`               | `3.125rem` (50px)                           |
| `--terra-input-background-color`           | `var(--terra-color-spacesuit-white)`        |
| `--terra-input-background-color-hover`     | `var(--terra-input-background-color)`       |
| `--terra-input-background-color-focus`     | `var(--terra-input-background-color)`       |
| `--terra-input-background-color-disabled`  | `var(--terra-color-carbon-10)`              |
| `--terra-input-border-color`               | `var(--terra-color-carbon-20)`              |
| `--terra-input-border-color-hover`         | `var(--terra-color-carbon-40)`              |
| `--terra-input-border-color-focus`         | `var(--terra-color-primary-50)` (NASA Blue) |
| `--terra-input-border-color-disabled`      | `var(--terra-color-carbon-30)`              |
| `--terra-input-border-width`               | `1px`                                       |
| `--terra-input-border-radius`              | `var(--terra-border-radius-medium)`         |
| `--terra-input-required-content`           | `*`                                         |
| `--terra-input-required-content-offset`    | `-2px`                                      |
| `--terra-input-required-content-color`     | `var(--terra-input-label-color)`            |
| `--terra-input-border-radius-small`        | `var(--terra-border-radius-medium)`         |
| `--terra-input-border-radius-medium`       | `var(--terra-border-radius-medium)`         |
| `--terra-input-border-radius-large`        | `var(--terra-border-radius-medium)`         |
| `--terra-input-font-family`                | `var(--terra-font-family--public-sans)`     |
| `--terra-input-font-weight`                | `var(--terra-font-weight-normal)`           |
| `--terra-input-font-size`                  | `var(--terra-font-size-small)`              |
| `--terra-input-font-size-small`            | `var(--terra-font-size-small)`              |
| `--terra-input-font-size-medium`           | `var(--terra-font-size-medium)`             |
| `--terra-input-font-size-large`            | `var(--terra-font-size-large)`              |
| `--terra-input-letter-spacing`             | `var(--terra-letter-spacing-normal)`        |
| `--terra-input-line-height`                | `var(--terra-line-height-denser)`           |
| `--terra-input-color`                      | `hsla(240, 4%, 19%, 1)`                     |
| `--terra-input-color-hover`                | `var(--terra-color-carbon-70)`              |
| `--terra-input-color-focus`                | `var(--terra-color-carbon-70)`              |
| `--terra-input-color-disabled`             | `var(--terra-color-carbon-90)`              |
| `--terra-input-icon-color`                 | `var(--terra-color-carbon-50)`              |
| `--terra-input-icon-color-hover`           | `var(--terra-color-carbon-60)`              |
| `--terra-input-icon-color-focus`           | `var(--terra-color-carbon-60)`              |
| `--terra-input-placeholder-color`          | `var(--terra-color-carbon-50)`              |
| `--terra-input-placeholder-color-disabled` | `var(--terra-color-carbon-60)`              |
| `--terra-input-spacing-small`              | `var(--terra-spacing-small)`                |
| `--terra-input-spacing-medium`             | `var(--terra-spacing-medium)`               |
| `--terra-input-spacing-large`              | `var(--terra-spacing-large)`                |
| `--terra-input-focus-ring-color`           | `hsl(198.6 88.7% 48.4% / 40%)`              |
| `--terra-input-focus-ring-offset`          | `0`                                         |

## Filled Form Inputs

Filled form input tokens control the appearance of form controls using the `filled` variant.

| Token                                            | Value                          |
| ------------------------------------------------ | ------------------------------ |
| `--terra-input-filled-background-color`          | `var(--terra-color-carbon-10)` |
| `--terra-input-filled-background-color-hover`    | `var(--terra-color-carbon-10)` |
| `--terra-input-filled-background-color-focus`    | `var(--terra-color-carbon-10)` |
| `--terra-input-filled-background-color-disabled` | `var(--terra-color-carbon-10)` |
| `--terra-input-filled-color`                     | `var(--terra-color-carbon-80)` |
| `--terra-input-filled-color-hover`               | `var(--terra-color-carbon-80)` |
| `--terra-input-filled-color-focus`               | `var(--terra-color-carbon-70)` |
| `--terra-input-filled-color-disabled`            | `var(--terra-color-carbon-80)` |

## Form Labels

Form label tokens control the appearance of labels in form controls.

| Token                             | Value                               |
| --------------------------------- | ----------------------------------- |
| `--terra-input-label-font-family` | `var(--terra-font-family--inter)`   |
| `--terra-input-label-font-size`   | `var(--terra-font-size-small)`      |
| `--terra-input-label-color`       | `var(--terra-color-carbon-80)`      |
| `--terra-input-label-line-weight` | `var(--terra-font-weight-semibold)` |
| `--terra-input-label-line-height` | `var(--terra-line-height-looser)`   |

## Help Text

Help text tokens control the appearance of help text in form controls.

| Token                                      | Value                            |
| ------------------------------------------ | -------------------------------- |
| `--terra-input-help-text-font-size-small`  | `var(--terra-font-size-x-small)` |
| `--terra-input-help-text-font-size-medium` | `var(--terra-font-size-small)`   |
| `--terra-input-help-text-font-size-large`  | `var(--terra-font-size-medium)`  |
| `--terra-input-help-text-color`            | `var(--terra-color-carbon-50)`   |

## Toggles

Toggle tokens control the appearance of [toggle](/components/toggle) components.

| Token                                   | Value                                |
| --------------------------------------- | ------------------------------------ |
| `--terra-toggle-size-small`             | `0.875rem` (14px)                    |
| `--terra-toggle-size-medium`            | `1.125rem` (18px)                    |
| `--terra-toggle-size-large`             | `1.375rem` (22px)                    |
| `--terra-toggle-background-color-off`   | `var(--terra-color-carbon-30)`       |
| `--terra-toggle-background-color-on`    | `var(--terra-color-nasa-blue)`       |
| `--terra-toggle-border-color-off`       | `var(--terra-color-carbon-30)`       |
| `--terra-toggle-border-color-on`        | `var(--terra-color-nasa-blue)`       |
| `--terra-toggle-thumb-background-color` | `var(--terra-color-spacesuit-white)` |
| `--terra-toggle-thumb-border-color-off` | `var(--terra-color-carbon-30)`       |
| `--terra-toggle-thumb-border-color-on`  | `var(--terra-color-nasa-blue)`       |
| `--terra-toggle-label-color`            | `var(--terra-color-carbon-90)`       |
| `--terra-toggle-focus-ring-color`       | `var(--terra-color-nasa-blue)`       |

## Overlays

Overlay tokens control the appearance of overlays as used in [dialog](/components/dialog), etc.

| Token                              | Value                       |
| ---------------------------------- | --------------------------- |
| `--terra-overlay-background-color` | `hsl(240 3.8% 46.1% / 33%)` |

## Panels

Panel tokens control the appearance of panels such as those used in [dialog](/components/dialog), [menu](/components/menu), etc.

| Token                            | Value                                |
| -------------------------------- | ------------------------------------ |
| `--terra-panel-background-color` | `var(--terra-color-spacesuit-white)` |
| `--terra-panel-border-color`     | `var(--terra-color-carbon-20)`       |
| `--terra-panel-border-width`     | `1px`                                |

## Tooltips

Tooltip tokens control the appearance of tooltips as used in [popup](/components/popup) and other components.

| Token                              | Value                                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| `--terra-tooltip-border-radius`    | `var(--terra-border-radius-medium)`                          |
| `--terra-tooltip-background-color` | `var(--terra-color-carbon-80)`                               |
| `--terra-tooltip-color`            | `var(--terra-color-spacesuit-white)`                         |
| `--terra-tooltip-font-family`      | `var(--terra-font-family--public-sans)`                      |
| `--terra-tooltip-font-weight`      | `var(--terra-font-weight-normal)`                            |
| `--terra-tooltip-font-size`        | `var(--terra-font-size-small)`                               |
| `--terra-tooltip-line-height`      | `var(--terra-line-height-looser)`                            |
| `--terra-tooltip-padding`          | `var(--terra-spacing-2x-small) var(--terra-spacing-x-small)` |
| `--terra-tooltip-arrow-size`       | `6px`                                                        |
