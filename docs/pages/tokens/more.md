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

Focus ring tokens control the appearance of focus rings. Note that form inputs use `--gd-input-focus-ring-*` tokens instead.

| Token                    | Value                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `--gd-focus-ring-color`  | `var(--gd-color-primary-600)` (light theme)<br>`var(--gd-color-primary-700)` (dark theme) |
| `--gd-focus-ring-style`  | `solid`                                                                                   |
| `--gd-focus-ring-width`  | `3px`                                                                                     |
| `--gd-focus-ring`        | `var(--gd-focus-ring-style) var(--gd-focus-ring-width) var(--gd-focus-ring-color)`        |
| `--gd-focus-ring-offset` | `1px`                                                                                     |

## Buttons

Button tokens control the appearance of buttons. In addition, buttons also currently use some form input tokens such as `--gd-input-height-*` and `--gd-input-border-*`. More button tokens may be added in the future to make it easier to style them more independently.

| Token                          | Value                         |
| ------------------------------ | ----------------------------- |
| `--gd-button-font-size-small`  | `var(--gd-font-size-x-small)` |
| `--gd-button-font-size-medium` | `var(--gd-font-size-small)`   |
| `--gd-button-font-size-large`  | `var(--gd-font-size-medium)`  |

## Form Inputs

Form input tokens control the appearance of form controls such as [input](/components/input), [select](/components/select), [textarea](/components/textarea), etc.

| Token                                   | Value                              |
| --------------------------------------- | ---------------------------------- |
| `--gd-input-height-small`               | `1.875rem` (30px @ 16px base)      |
| `--gd-input-height-medium`              | `2.5rem` (40px @ 16px base)        |
| `--gd-input-height-large`               | `3.125rem` (50px @ 16px base)      |
| `--gd-input-background-color`           | `var(--gd-color-neutral-0)`        |
| `--gd-input-background-color-hover`     | `var(--gd-input-background-color)` |
| `--gd-input-background-color-focus`     | `var(--gd-input-background-color)` |
| `--gd-input-background-color-disabled`  | `var(--gd-color-neutral-100)`      |
| `--gd-input-border-color`               | `var(--gd-color-neutral-300)`      |
| `--gd-input-border-color-hover`         | `var(--gd-color-neutral-400)`      |
| `--gd-input-border-color-focus`         | `var(--gd-color-primary-500)`      |
| `--gd-input-border-color-disabled`      | `var(--gd-color-neutral-300)`      |
| `--gd-input-border-width`               | `1px`                              |
| `--gd-input-required-content`           | `*`                                |
| `--gd-input-required-content-offset`    | `-2px`                             |
| `--gd-input-required-content-color`     | `var(--gd-input-label-color)`      |
| `--gd-input-border-radius-small`        | `var(--gd-border-radius-medium)`   |
| `--gd-input-border-radius-medium`       | `var(--gd-border-radius-medium)`   |
| `--gd-input-border-radius-large`        | `var(--gd-border-radius-medium)`   |
| `--gd-input-font-family`                | `var(--gd-font-sans)`              |
| `--gd-input-font-weight`                | `var(--gd-font-weight-normal)`     |
| `--gd-input-font-size-small`            | `var(--gd-font-size-small)`        |
| `--gd-input-font-size-medium`           | `var(--gd-font-size-medium)`       |
| `--gd-input-font-size-large`            | `var(--gd-font-size-large)`        |
| `--gd-input-letter-spacing`             | `var(--gd-letter-spacing-normal)`  |
| `--gd-input-color`                      | `var(--gd-color-neutral-700)`      |
| `--gd-input-color-hover`                | `var(--gd-color-neutral-700)`      |
| `--gd-input-color-focus`                | `var(--gd-color-neutral-700)`      |
| `--gd-input-color-disabled`             | `var(--gd-color-neutral-900)`      |
| `--gd-input-icon-color`                 | `var(--gd-color-neutral-500)`      |
| `--gd-input-icon-color-hover`           | `var(--gd-color-neutral-600)`      |
| `--gd-input-icon-color-focus`           | `var(--gd-color-neutral-600)`      |
| `--gd-input-placeholder-color`          | `var(--gd-color-neutral-500)`      |
| `--gd-input-placeholder-color-disabled` | `var(--gd-color-neutral-600)`      |
| `--gd-input-spacing-small`              | `var(--gd-spacing-small)`          |
| `--gd-input-spacing-medium`             | `var(--gd-spacing-medium)`         |
| `--gd-input-spacing-large`              | `var(--gd-spacing-large)`          |
| `--gd-input-focus-ring-color`           | `hsl(198.6 88.7% 48.4% / 40%)`     |
| `--gd-input-focus-ring-offset`          | `0`                                |

## Filled Form Inputs

Filled form input tokens control the appearance of form controls using the `filled` variant.

| Token                                         | Value                         |
| --------------------------------------------- | ----------------------------- |
| `--gd-input-filled-background-color`          | `var(--gd-color-neutral-100)` |
| `--gd-input-filled-background-color-hover`    | `var(--gd-color-neutral-100)` |
| `--gd-input-filled-background-color-focus`    | `var(--gd-color-neutral-100)` |
| `--gd-input-filled-background-color-disabled` | `var(--gd-color-neutral-100)` |
| `--gd-input-filled-color`                     | `var(--gd-color-neutral-800)` |
| `--gd-input-filled-color-hover`               | `var(--gd-color-neutral-800)` |
| `--gd-input-filled-color-focus`               | `var(--gd-color-neutral-700)` |
| `--gd-input-filled-color-disabled`            | `var(--gd-color-neutral-800)` |

## Form Labels

Form label tokens control the appearance of labels in form controls.

| Token                               | Value                        |
| ----------------------------------- | ---------------------------- |
| `--gd-input-label-font-size-small`  | `var(--gd-font-size-small)`  |
| `--gd-input-label-font-size-medium` | `var(--gd-font-size-medium`) |
| `--gd-input-label-font-size-large`  | `var(--gd-font-size-large)`  |
| `--gd-input-label-color`            | `inherit`                    |

## Help Text

Help text tokens control the appearance of help text in form controls.

| Token                                   | Value                         |
| --------------------------------------- | ----------------------------- |
| `--gd-input-help-text-font-size-small`  | `var(--gd-font-size-x-small)` |
| `--gd-input-help-text-font-size-medium` | `var(--gd-font-size-small)`   |
| `--gd-input-help-text-font-size-large`  | `var(--gd-font-size-medium)`  |
| `--gd-input-help-text-color`            | `var(--gd-color-neutral-500)` |

## Toggles

Toggle tokens control the appearance of toggles such as [checkbox](/components/checkbox), [radio](/components/radio), [switch](/components/switch), etc.

| Token                     | Value                         |
| ------------------------- | ----------------------------- |
| `--gd-toggle-size-small`  | `0.875rem` (14px @ 16px base) |
| `--gd-toggle-size-medium` | `1.125rem` (18px @ 16px base) |
| `--gd-toggle-size-large`  | `1.375rem` (22px @ 16px base) |

## Overlays

Overlay tokens control the appearance of overlays as used in [dialog](/components/dialog), [drawer](/components/drawer), etc.

| Token                           | Value                       |
| ------------------------------- | --------------------------- |
| `--gd-overlay-background-color` | `hsl(240 3.8% 46.1% / 33%)` |

## Panels

Panel tokens control the appearance of panels such as those used in [dialog](/components/dialog), [drawer](/components/drawer), [menu](/components/menu), etc.

| Token                         | Value                         |
| ----------------------------- | ----------------------------- |
| `--gd-panel-background-color` | `var(--gd-color-neutral-0)`   |
| `--gd-panel-border-color`     | `var(--gd-color-neutral-200)` |
| `--gd-panel-border-width`     | `1px`                         |

## Tooltips

Tooltip tokens control the appearance of tooltips. This includes the [tooltip](/components/tooltip) component as well as other implementations, such [range tooltips](/components/range).

| Token                           | Value                                                  |
| ------------------------------- | ------------------------------------------------------ |
| `--gd-tooltip-border-radius`    | `var(--gd-border-radius-medium)`                       |
| `--gd-tooltip-background-color` | `var(--gd-color-neutral-800)`                          |
| `--gd-tooltip-color`            | `var(--gd-color-neutral-0)`                            |
| `--gd-tooltip-font-family`      | `var(--gd-font-sans)`                                  |
| `--gd-tooltip-font-weight`      | `var(--gd-font-weight-normal)`                         |
| `--gd-tooltip-font-size`        | `var(--gd-font-size-small)`                            |
| `--gd-tooltip-line-height`      | `var(--gd-line-height-dense)`                          |
| `--gd-tooltip-padding`          | `var(--gd-spacing-2x-small) var(--gd-spacing-x-small)` |
| `--gd-tooltip-arrow-size`       | `6px`                                                  |
