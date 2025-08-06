---
meta:
    title: More Design Tokens
    description: Additional design tokens can be found here.
---

# More Design Tokens

All of the design tokens described herein are considered relatively stable. However, some changes might occur in future versions to address mission critical bugs or improvements. If such changes occur, they _will not_ be considered breaking changes and will be clearly documented in the [changelog](/resources/changelog).

Most design tokens are consistent across the light and dark theme. Those that vary will show both values.

:::tip
Currently, the source of design tokens is considered to be [`light.css`](https://github.com/nasa/terra-ui-components/blob/next/src/themes/light.css). The dark theme, [dark.css](https://github.com/nasa/terra-ui-components/blob/next/src/themes/dark.css), mirrors all of the same tokens with dark mode-specific values where appropriate. Work is planned to move all design tokens to a single file, perhaps JSON or YAML, in the near future.
:::

## Focus Rings

Focus ring tokens control the appearance of focus rings. Note that form inputs use `--terra-input-focus-ring-*` tokens instead.

| Token                       | Value                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| `--terra-focus-ring-color`  | `var(--terra-color-primary-600)` (light theme)<br>`var(--terra-color-primary-700)` (dark theme) |
| `--terra-focus-ring-style`  | `solid`                                                                                         |
| `--terra-focus-ring-width`  | `3px`                                                                                           |
| `--terra-focus-ring`        | `var(--terra-focus-ring-style) var(--terra-focus-ring-width) var(--terra-focus-ring-color)`     |
| `--terra-focus-ring-offset` | `1px`                                                                                           |

## Buttons

Button tokens control the appearance of buttons. In addition, buttons also currently use some form input tokens such as `--terra-input-height-*` and `--terra-input-border-*`. More button tokens may be added in the future to make it easier to style them more independently.

| Token                             | Value                            |
| --------------------------------- | -------------------------------- |
| `--terra-button-font-size-small`  | `var(--terra-font-size-x-small)` |
| `--terra-button-font-size-medium` | `var(--terra-font-size-small)`   |
| `--terra-button-font-size-large`  | `var(--terra-font-size-medium)`  |

## Form Inputs

Form input tokens control the appearance of form controls such as [input](/components/input), [select](/components/select), [textarea](/components/textarea), etc.

| Token                                      | Value                                 |
| ------------------------------------------ | ------------------------------------- |
| `--terra-input-height-small`               | `1.875rem` (30px @ 16px base)         |
| `--terra-input-height-medium`              | `2.5rem` (40px @ 16px base)           |
| `--terra-input-height-large`               | `3.125rem` (50px @ 16px base)         |
| `--terra-input-background-color`           | `var(--terra-color-neutral-0)`        |
| `--terra-input-background-color-hover`     | `var(--terra-input-background-color)` |
| `--terra-input-background-color-focus`     | `var(--terra-input-background-color)` |
| `--terra-input-background-color-disabled`  | `var(--terra-color-neutral-100)`      |
| `--terra-input-border-color`               | `var(--terra-color-neutral-300)`      |
| `--terra-input-border-color-hover`         | `var(--terra-color-neutral-400)`      |
| `--terra-input-border-color-focus`         | `var(--terra-color-primary-500)`      |
| `--terra-input-border-color-disabled`      | `var(--terra-color-neutral-300)`      |
| `--terra-input-border-width`               | `1px`                                 |
| `--terra-input-required-content`           | `*`                                   |
| `--terra-input-required-content-offset`    | `-2px`                                |
| `--terra-input-required-content-color`     | `var(--terra-input-label-color)`      |
| `--terra-input-border-radius-small`        | `var(--terra-border-radius-medium)`   |
| `--terra-input-border-radius-medium`       | `var(--terra-border-radius-medium)`   |
| `--terra-input-border-radius-large`        | `var(--terra-border-radius-medium)`   |
| `--terra-input-font-family`                | `var(--terra-font-sans)`              |
| `--terra-input-font-weight`                | `var(--terra-font-weight-normal)`     |
| `--terra-input-font-size-small`            | `var(--terra-font-size-small)`        |
| `--terra-input-font-size-medium`           | `var(--terra-font-size-medium)`       |
| `--terra-input-font-size-large`            | `var(--terra-font-size-large)`        |
| `--terra-input-letter-spacing`             | `var(--terra-letter-spacing-normal)`  |
| `--terra-input-color`                      | `var(--terra-color-neutral-700)`      |
| `--terra-input-color-hover`                | `var(--terra-color-neutral-700)`      |
| `--terra-input-color-focus`                | `var(--terra-color-neutral-700)`      |
| `--terra-input-color-disabled`             | `var(--terra-color-neutral-900)`      |
| `--terra-input-icon-color`                 | `var(--terra-color-neutral-500)`      |
| `--terra-input-icon-color-hover`           | `var(--terra-color-neutral-600)`      |
| `--terra-input-icon-color-focus`           | `var(--terra-color-neutral-600)`      |
| `--terra-input-placeholder-color`          | `var(--terra-color-neutral-500)`      |
| `--terra-input-placeholder-color-disabled` | `var(--terra-color-neutral-600)`      |
| `--terra-input-spacing-small`              | `var(--terra-spacing-small)`          |
| `--terra-input-spacing-medium`             | `var(--terra-spacing-medium)`         |
| `--terra-input-spacing-large`              | `var(--terra-spacing-large)`          |
| `--terra-input-focus-ring-color`           | `hsl(198.6 88.7% 48.4% / 40%)`        |
| `--terra-input-focus-ring-offset`          | `0`                                   |

## Filled Form Inputs

Filled form input tokens control the appearance of form controls using the `filled` variant.

| Token                                            | Value                            |
| ------------------------------------------------ | -------------------------------- |
| `--terra-input-filled-background-color`          | `var(--terra-color-neutral-100)` |
| `--terra-input-filled-background-color-hover`    | `var(--terra-color-neutral-100)` |
| `--terra-input-filled-background-color-focus`    | `var(--terra-color-neutral-100)` |
| `--terra-input-filled-background-color-disabled` | `var(--terra-color-neutral-100)` |
| `--terra-input-filled-color`                     | `var(--terra-color-neutral-800)` |
| `--terra-input-filled-color-hover`               | `var(--terra-color-neutral-800)` |
| `--terra-input-filled-color-focus`               | `var(--terra-color-neutral-700)` |
| `--terra-input-filled-color-disabled`            | `var(--terra-color-neutral-800)` |

## Form Labels

Form label tokens control the appearance of labels in form controls.

| Token                                  | Value                           |
| -------------------------------------- | ------------------------------- |
| `--terra-input-label-font-size-small`  | `var(--terra-font-size-small)`  |
| `--terra-input-label-font-size-medium` | `var(--terra-font-size-medium`) |
| `--terra-input-label-font-size-large`  | `var(--terra-font-size-large)`  |
| `--terra-input-label-color`            | `inherit`                       |

## Help Text

Help text tokens control the appearance of help text in form controls.

| Token                                      | Value                            |
| ------------------------------------------ | -------------------------------- |
| `--terra-input-help-text-font-size-small`  | `var(--terra-font-size-x-small)` |
| `--terra-input-help-text-font-size-medium` | `var(--terra-font-size-small)`   |
| `--terra-input-help-text-font-size-large`  | `var(--terra-font-size-medium)`  |
| `--terra-input-help-text-color`            | `var(--terra-color-neutral-500)` |

## Toggles

Toggle tokens control the appearance of toggles such as [checkbox](/components/checkbox), [radio](/components/radio), [switch](/components/switch), etc.

| Token                        | Value                         |
| ---------------------------- | ----------------------------- |
| `--terra-toggle-size-small`  | `0.875rem` (14px @ 16px base) |
| `--terra-toggle-size-medium` | `1.125rem` (18px @ 16px base) |
| `--terra-toggle-size-large`  | `1.375rem` (22px @ 16px base) |

## Overlays

Overlay tokens control the appearance of overlays as used in [dialog](/components/dialog), [drawer](/components/drawer), etc.

| Token                              | Value                       |
| ---------------------------------- | --------------------------- |
| `--terra-overlay-background-color` | `hsl(240 3.8% 46.1% / 33%)` |

## Panels

Panel tokens control the appearance of panels such as those used in [dialog](/components/dialog), [drawer](/components/drawer), [menu](/components/menu), etc.

| Token                            | Value                            |
| -------------------------------- | -------------------------------- |
| `--terra-panel-background-color` | `var(--terra-color-neutral-0)`   |
| `--terra-panel-border-color`     | `var(--terra-color-neutral-200)` |
| `--terra-panel-border-width`     | `1px`                            |

## Tooltips

Tooltip tokens control the appearance of tooltips. This includes the [tooltip](/components/tooltip) component as well as other implementations, such [range tooltips](/components/range).

| Token                              | Value                                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| `--terra-tooltip-border-radius`    | `var(--terra-border-radius-medium)`                          |
| `--terra-tooltip-background-color` | `var(--terra-color-neutral-800)`                             |
| `--terra-tooltip-color`            | `var(--terra-color-neutral-0)`                               |
| `--terra-tooltip-font-family`      | `var(--terra-font-sans)`                                     |
| `--terra-tooltip-font-weight`      | `var(--terra-font-weight-normal)`                            |
| `--terra-tooltip-font-size`        | `var(--terra-font-size-small)`                               |
| `--terra-tooltip-line-height`      | `var(--terra-line-height-dense)`                             |
| `--terra-tooltip-padding`          | `var(--terra-spacing-2x-small) var(--terra-spacing-x-small)` |
| `--terra-tooltip-arrow-size`       | `6px`                                                        |
