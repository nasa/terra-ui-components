---
meta:
    title: More Design Tokens
    description: Additional design tokens can be found here.
---

# More Design Tokens

All of the design tokens described herein are considered relatively stable. However, some changes might occur in future versions to address mission critical bugs or improvements. If such changes occur, they _will not_ be considered breaking changes and will be clearly documented in the [changelog](/resources/changelog).

Most design tokens are consistent across the light and dark theme. Those that vary will show both values.

:::tip
Currently, the source of design tokens is considered to be [`light.css`](https://github.com/gesdisc/components/blob/next/src/themes/light.css). The dark theme, [dark.css](https://github.com/gesdisc/components/blob/next/src/themes/dark.css), mirrors all of the same tokens with dark mode-specific values where appropriate. Work is planned to move all design tokens to a single file, perhaps JSON or YAML, in the near future.
:::

## Focus Rings

Focus ring tokens control the appearance of focus rings. Note that form inputs use `--edux-input-focus-ring-*` tokens instead.

| Token                      | Value                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `--edux-focus-ring-color`  | `var(--edux-color-primary-600)` (light theme)<br>`var(--edux-color-primary-700)` (dark theme) |
| `--edux-focus-ring-style`  | `solid`                                                                                       |
| `--edux-focus-ring-width`  | `3px`                                                                                         |
| `--edux-focus-ring`        | `var(--edux-focus-ring-style) var(--edux-focus-ring-width) var(--edux-focus-ring-color)`      |
| `--edux-focus-ring-offset` | `1px`                                                                                         |

## Buttons

Button tokens control the appearance of buttons. In addition, buttons also currently use some form input tokens such as `--edux-input-height-*` and `--edux-input-border-*`. More button tokens may be added in the future to make it easier to style them more independently.

| Token                            | Value                           |
| -------------------------------- | ------------------------------- |
| `--edux-button-font-size-small`  | `var(--edux-font-size-x-small)` |
| `--edux-button-font-size-medium` | `var(--edux-font-size-small)`   |
| `--edux-button-font-size-large`  | `var(--edux-font-size-medium)`  |

## Form Inputs

Form input tokens control the appearance of form controls such as [input](/components/input), [select](/components/select), [textarea](/components/textarea), etc.

| Token                                     | Value                                |
| ----------------------------------------- | ------------------------------------ |
| `--edux-input-height-small`               | `1.875rem` (30px @ 16px base)        |
| `--edux-input-height-medium`              | `2.5rem` (40px @ 16px base)          |
| `--edux-input-height-large`               | `3.125rem` (50px @ 16px base)        |
| `--edux-input-background-color`           | `var(--edux-color-neutral-0)`        |
| `--edux-input-background-color-hover`     | `var(--edux-input-background-color)` |
| `--edux-input-background-color-focus`     | `var(--edux-input-background-color)` |
| `--edux-input-background-color-disabled`  | `var(--edux-color-neutral-100)`      |
| `--edux-input-border-color`               | `var(--edux-color-neutral-300)`      |
| `--edux-input-border-color-hover`         | `var(--edux-color-neutral-400)`      |
| `--edux-input-border-color-focus`         | `var(--edux-color-primary-500)`      |
| `--edux-input-border-color-disabled`      | `var(--edux-color-neutral-300)`      |
| `--edux-input-border-width`               | `1px`                                |
| `--edux-input-required-content`           | `*`                                  |
| `--edux-input-required-content-offset`    | `-2px`                               |
| `--edux-input-required-content-color`     | `var(--edux-input-label-color)`      |
| `--edux-input-border-radius-small`        | `var(--edux-border-radius-medium)`   |
| `--edux-input-border-radius-medium`       | `var(--edux-border-radius-medium)`   |
| `--edux-input-border-radius-large`        | `var(--edux-border-radius-medium)`   |
| `--edux-input-font-family`                | `var(--edux-font-sans)`              |
| `--edux-input-font-weight`                | `var(--edux-font-weight-normal)`     |
| `--edux-input-font-size-small`            | `var(--edux-font-size-small)`        |
| `--edux-input-font-size-medium`           | `var(--edux-font-size-medium)`       |
| `--edux-input-font-size-large`            | `var(--edux-font-size-large)`        |
| `--edux-input-letter-spacing`             | `var(--edux-letter-spacing-normal)`  |
| `--edux-input-color`                      | `var(--edux-color-neutral-700)`      |
| `--edux-input-color-hover`                | `var(--edux-color-neutral-700)`      |
| `--edux-input-color-focus`                | `var(--edux-color-neutral-700)`      |
| `--edux-input-color-disabled`             | `var(--edux-color-neutral-900)`      |
| `--edux-input-icon-color`                 | `var(--edux-color-neutral-500)`      |
| `--edux-input-icon-color-hover`           | `var(--edux-color-neutral-600)`      |
| `--edux-input-icon-color-focus`           | `var(--edux-color-neutral-600)`      |
| `--edux-input-placeholder-color`          | `var(--edux-color-neutral-500)`      |
| `--edux-input-placeholder-color-disabled` | `var(--edux-color-neutral-600)`      |
| `--edux-input-spacing-small`              | `var(--edux-spacing-small)`          |
| `--edux-input-spacing-medium`             | `var(--edux-spacing-medium)`         |
| `--edux-input-spacing-large`              | `var(--edux-spacing-large)`          |
| `--edux-input-focus-ring-color`           | `hsl(198.6 88.7% 48.4% / 40%)`       |
| `--edux-input-focus-ring-offset`          | `0`                                  |

## Filled Form Inputs

Filled form input tokens control the appearance of form controls using the `filled` variant.

| Token                                           | Value                           |
| ----------------------------------------------- | ------------------------------- |
| `--edux-input-filled-background-color`          | `var(--edux-color-neutral-100)` |
| `--edux-input-filled-background-color-hover`    | `var(--edux-color-neutral-100)` |
| `--edux-input-filled-background-color-focus`    | `var(--edux-color-neutral-100)` |
| `--edux-input-filled-background-color-disabled` | `var(--edux-color-neutral-100)` |
| `--edux-input-filled-color`                     | `var(--edux-color-neutral-800)` |
| `--edux-input-filled-color-hover`               | `var(--edux-color-neutral-800)` |
| `--edux-input-filled-color-focus`               | `var(--edux-color-neutral-700)` |
| `--edux-input-filled-color-disabled`            | `var(--edux-color-neutral-800)` |

## Form Labels

Form label tokens control the appearance of labels in form controls.

| Token                                 | Value                          |
| ------------------------------------- | ------------------------------ |
| `--edux-input-label-font-size-small`  | `var(--edux-font-size-small)`  |
| `--edux-input-label-font-size-medium` | `var(--edux-font-size-medium`) |
| `--edux-input-label-font-size-large`  | `var(--edux-font-size-large)`  |
| `--edux-input-label-color`            | `inherit`                      |

## Help Text

Help text tokens control the appearance of help text in form controls.

| Token                                     | Value                           |
| ----------------------------------------- | ------------------------------- |
| `--edux-input-help-text-font-size-small`  | `var(--edux-font-size-x-small)` |
| `--edux-input-help-text-font-size-medium` | `var(--edux-font-size-small)`   |
| `--edux-input-help-text-font-size-large`  | `var(--edux-font-size-medium)`  |
| `--edux-input-help-text-color`            | `var(--edux-color-neutral-500)` |

## Toggles

Toggle tokens control the appearance of toggles such as [checkbox](/components/checkbox), [radio](/components/radio), [switch](/components/switch), etc.

| Token                       | Value                         |
| --------------------------- | ----------------------------- |
| `--edux-toggle-size-small`  | `0.875rem` (14px @ 16px base) |
| `--edux-toggle-size-medium` | `1.125rem` (18px @ 16px base) |
| `--edux-toggle-size-large`  | `1.375rem` (22px @ 16px base) |

## Overlays

Overlay tokens control the appearance of overlays as used in [dialog](/components/dialog), [drawer](/components/drawer), etc.

| Token                             | Value                       |
| --------------------------------- | --------------------------- |
| `--edux-overlay-background-color` | `hsl(240 3.8% 46.1% / 33%)` |

## Panels

Panel tokens control the appearance of panels such as those used in [dialog](/components/dialog), [drawer](/components/drawer), [menu](/components/menu), etc.

| Token                           | Value                           |
| ------------------------------- | ------------------------------- |
| `--edux-panel-background-color` | `var(--edux-color-neutral-0)`   |
| `--edux-panel-border-color`     | `var(--edux-color-neutral-200)` |
| `--edux-panel-border-width`     | `1px`                           |

## Tooltips

Tooltip tokens control the appearance of tooltips. This includes the [tooltip](/components/tooltip) component as well as other implementations, such [range tooltips](/components/range).

| Token                             | Value                                                      |
| --------------------------------- | ---------------------------------------------------------- |
| `--edux-tooltip-border-radius`    | `var(--edux-border-radius-medium)`                         |
| `--edux-tooltip-background-color` | `var(--edux-color-neutral-800)`                            |
| `--edux-tooltip-color`            | `var(--edux-color-neutral-0)`                              |
| `--edux-tooltip-font-family`      | `var(--edux-font-sans)`                                    |
| `--edux-tooltip-font-weight`      | `var(--edux-font-weight-normal)`                           |
| `--edux-tooltip-font-size`        | `var(--edux-font-size-small)`                              |
| `--edux-tooltip-line-height`      | `var(--edux-line-height-dense)`                            |
| `--edux-tooltip-padding`          | `var(--edux-spacing-2x-small) var(--edux-spacing-x-small)` |
| `--edux-tooltip-arrow-size`       | `6px`                                                      |
