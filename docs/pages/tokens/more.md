---
meta:
    title: More Design Tokens
    description: Additional design tokens for focus rings, buttons, form inputs, toggles, overlays, panels, and tooltips.
---

# More Design Tokens

Additional design tokens for specific components and UI patterns. All tokens are defined in `horizon.css` and automatically adapt to dark mode when applicable.

## Accordions

Accordion tokens control the look of accordions.

| Token                                              | Value                                                    |
| -------------------------------------------------- | -------------------------------------------------------- |
| `--terra-accordion-background-color`               | `var(--terra-container-menu-bg)`                         |
| `--terra-accordion-border-color`                   | `var(--terra-border-neutral-default)`                    |
| `--terra-accordion-border-width`                   | `1px`                                                    |
| `--terra-accordion-border-radius`                  | `var(--terra-border-radius-large)`                       |
| `--terra-accordion-content-color`                  | `var(--terra-text-secondary)`                            |
| `--terra-accordion-summary-background-color`       | `var(--terra-color-bg-surface-neutral-primary)`          |
| `--terra-accordion-summary-background-color-hover` | `var(--terra-color-bg-surface-neutral-secondary)`        |
| `--terra-accordion-summary-border-color`           | `var(--terra-border-neutral-default)`                    |
| `--terra-accordion-summary-padding`                | `var(--terra-spacing-small) var(--terra-spacing-medium)` |
| `--terra-accordion-summary-font-size`              | `var(--terra-font-size-small)`                           |
| `--terra-accordion-summary-font-weight`            | `var(--terra-font-weight-semibold)`                      |
| `--terra-accordion-summary-color`                  | `var(--terra-text-primary)`                              |
| `--terra-accordion-content-padding`                | `var(--terra-spacing-medium)`                            |
| `--terra-accordion-transition`                     | `background-color var(--terra-transition-fast)`          |

## Alerts

Alert tokens control the appearance of the alter variants.

### Filled Alerts Appearance

| Token                                               | Value                                   |
| --------------------------------------------------- | --------------------------------------- |
| `--terra-alert-line-height`                         | `var(--terra-line-height-normal)`       |
| `--terra-alert-filled-background-color-information` | `var(--terra-color-bg-info-bold)`       |
| `--terra-alert-filled-background-color-success`     | `var(--terra-color-bg-success-bold)`    |
| `--terra-alert-filled-background-color-neutral`     | `var(--terra-color-bg-default-bold)`    |
| `--terra-alert-filled-background-color-warning`     | `var(--terra-color-bg-warning-bold)`    |
| `--terra-alert-filled-background-color-danger`      | `var(--terra-color-bg-error-bold)`      |
| `--terra-alert-filled-color-information`            | `var(--terra-text-on-semantic)`         |
| `--terra-alert-filled-color-success`                | `var(--terra-text-on-semantic-inverse)` |
| `--terra-alert-filled-color-neutral`                | `var(--terra-text-on-semantic-inverse)` |
| `--terra-alert-filled-color-warning`                | `var(--terra-text-on-semantic-inverse)` |
| `--terra-alert-filled-color-danger`                 | `var(--terra-text-on-semantic)`         |
| `--terra-alert-filled-icon-color-information`       | `var(--terra-text-on-semantic)`         |
| `--terra-alert-filled-icon-color-success`           | `var(--terra-text-on-semantic-inverse)` |
| `--terra-alert-filled-icon-color-neutral`           | `var(--terra-text-on-semantic-inverse)` |
| `--terra-alert-filled-icon-color-warning`           | `var(--terra-text-on-semantic-inverse)` |
| `--terra-alert-filled-icon-color-danger`            | `var(--terra-text-on-semantic)`         |

### Subtle Alerts Appearance

| Token                                               | Value                                  |
| --------------------------------------------------- | -------------------------------------- |
| `--terra-alert-subtle-background-color-information` | `var(--terra-color-bg-info-subtle)`    |
| `--terra-alert-subtle-background-color-success`     | `var(--terra-color-bg-success-subtle)` |
| `--terra-alert-subtle-background-color-neutral`     | `var(--terra-color-bg-default-subtle)` |
| `--terra-alert-subtle-background-color-warning`     | `var(--terra-color-bg-warning-subtle)` |
| `--terra-alert-subtle-background-color-danger`      | `var(--terra-color-bg-error-subtle)`   |
| `--terra-alert-subtle-color-information`            | `var(--terra-text-on-info)`            |
| `--terra-alert-subtle-color-success`                | `var(--terra-text-on-success)`         |
| `--terra-alert-subtle-color-neutral`                | `var(--terra-text-on-default)`         |
| `--terra-alert-subtle-color-warning`                | `var(--terra-text-on-warning)`         |
| `--terra-alert-subtle-color-danger`                 | `var(--terra-text-on-error)`           |

### White Appearance

| Token                                  | Value                                        |
| -------------------------------------- | -------------------------------------------- |
| `--terra-alert-white-background-color` | `var(--terra-color-bg-surface-neutral-base)` |
| `--terra-alert-white-color`            | `var(--terra-text-secondary)`                |

## Avatar

Avatar tokens control the appearance of avatars.

| Token                             | Value                                |
| --------------------------------- | ------------------------------------ |
| `--terra-avatar-size-small`       | `2rem`                               |
| `--terra-avatar-size-medium`      | `2.5rem`                             |
| `--terra-avatar-size-large`       | `3.5rem`                             |
| `--terra-avatar-background-color` | `var(--terra-color-carbon-40)`       |
| `--terra-avatar-color`            | `var(--terra-color-spacesuit-white)` |
| `--terra-avatar-font-family`      | `var(--terra-font-family--inter)`    |
| `--terra-avatar-font-weight`      | `var(--terra-font-weight-normal)`    |

## Badge Component

Badge tokens control the appearance of badges.

| Token                                        | Value                                   |
| -------------------------------------------- | --------------------------------------- |
| `--terra-badge-background-color-information` | `var(--terra-color-bg-info-bold)`       |
| `--terra-badge-background-color-success`     | `var(--terra-color-bg-success-bold)`    |
| `--terra-badge-background-color-neutral`     | `var(--terra-color-bg-default-bold)`    |
| `--terra-badge-background-color-warning`     | `var(--terra-color-bg-warning-bold)`    |
| `--terra-badge-background-color-danger`      | `var(--terra-color-bg-error-bold)`      |
| `--terra-badge-color-information`            | `var(--terra-text-on-semantic)`         |
| `--terra-badge-color-success`                | `var(--terra-text-on-semantic-inverse)` |
| `--terra-badge-color-neutral`                | `var(--terra-text-on-semantic-inverse)` |
| `--terra-badge-color-warning`                | `var(--terra-text-on-semantic-inverse)` |
| `--terra-badge-color-danger`                 | `var(--terra-text-on-semantic)`         |

## Breadcrumb

Breadcrumb tokens control the appearance of breadcrumbs.

| Token                             | Value                                   |
| --------------------------------- | --------------------------------------- |
| `--terra-breadcrumb-text-default` | `var(--terra-text-interactive-default)` |
| `--terra-breadcrumb-text-hover`   | `var(--terra-text-interactive-hover)`   |
| `--terra-breadcrumb-text-visited` | `var(--terra-text-tertiary)`            |
| `--terra-breadcrumb-text-current` | `var(--terra-text-interactive-active)`  |

## Buttons

Button tokens control the appearance of buttons.

| Token                             | Value                            |
| --------------------------------- | -------------------------------- |
| `--terra-button-border-width`     | `1px`                            |
| `--terra-button-font-size-small`  | `var(--terra-font-size-x-small)` |
| `--terra-button-font-size-medium` | `var(--terra-font-size-small)`   |
| `--terra-button-font-size-large`  | `var(--terra-font-size-medium)`  |
| `--terra-button-height-small`     | `1.875rem`                       |
| `--terra-button-height-medium`    | `2.25rem`                        |
| `--terra-button-height-large`     | `3rem`                           |

### Filled / Outline text

Text colors for filled and outline variant buttons.

| Token                               | Value                                   |
| ----------------------------------- | --------------------------------------- |
| `--terra-button-color-default`      | `var(--terra-text-on-action-secondary)` |
| `--terra-button-color-primary`      | `var(--terra-text-on-action-primary)`   |
| `--terra-button-color-cta`          | `var(--terra-text-on-action-cta)`       |
| `--terra-button-color-success`      | `var(--terra-text-on-action-success)`   |
| `--terra-button-color-warning`      | `var(--terra-text-on-action-warning)`   |
| `--terra-button-color-danger`       | `var(--terra-text-on-action-error)`     |
| `--terra-button-outline-text-color` | `var(--terra-text-primary)`             |

### Text Button text

Text color states for Text variant buttons.

| Token                                     | Value                                        |
| ----------------------------------------- | -------------------------------------------- |
| `--terra-button-text-text-color`          | `var(--terra-text-link-default)`             |
| `--terra-button-text-text-color-hover`    | `var(--terra-text-link-hover)`               |
| `--terra-button-text-text-color-active`   | `var(--terra-text-link-default)`             |
| `--terra-button-text-text-color-disabled` | `var(--terra-color-action-primary-disabled)` |
| `--terra-button-page-link-text-color`     | `var(--terra-text-primary)`                  |

## Caption

Caption tokens control the look of captions.

| Token                          | Value                                   |
| ------------------------------ | --------------------------------------- |
| `--terra-caption-font-family`  | `var(--terra-font-family--public-sans)` |
| `--terra-caption-font-size`    | `var(--terra-font-size-small)`          |
| `--terra-caption-font-weight`  | `var(--terra-font-weight-normal)`       |
| `--terra-caption-line-height`  | `var(--terra-line-height-normal)`       |
| `--terra-caption-color`        | `var(--terra-text-tertiary)`            |
| `--terra-caption-credit-color` | `var(--terra-text-secondary)`           |

## Card

Card tokens control the appearance of cards.

| Token                           | Value                             |
| ------------------------------- | --------------------------------- |
| `--terra-card-background-color` | `var(--terra-container-panel-bg)` |

## Checkbox

Checkbox tokens control the appearance of checkboxes.

### Checkbox Sizes

| Token                          | Value      |
| ------------------------------ | ---------- |
| `--terra-checkbox-size-small`  | `0.875rem` |
| `--terra-checkbox-size-medium` | `1.125rem` |
| `--terra-checkbox-size-large`  | `1.375rem` |

### Checkbox Colors

| Token                                             | Value                                        |
| ------------------------------------------------- | -------------------------------------------- |
| `--terra-checkbox-background-color`               | `var(--terra-control-bg-default)`            |
| `--terra-checkbox-background-color-hover`         | `var(--terra-control-bg-hover)`              |
| `--terra-checkbox-background-color-active`        | `var(--terra-control-bg-active)`             |
| `--terra-checkbox-background-color-checked`       | `var(--terra-control-bg-selected)`           |
| `--terra-checkbox-background-color-checked-hover` | `var(--terra-control-bg-selected-hover)`     |
| `--terra-checkbox-background-color-disabled`      | `var(--terra-control-bg-disabled)`           |
| `--terra-checkbox-border-color`                   | `var(--terra-control-border-default)`        |
| `--terra-checkbox-border-color-hover`             | `var(--terra-control-border-hover)`          |
| `--terra-checkbox-border-color-active`            | `var(--terra-control-border-active)`         |
| `--terra-checkbox-border-color-checked`           | `var(--terra-control-border-selected)`       |
| `--terra-checkbox-border-color-checked-hover`     | `var(--terra-control-border-selected-hover)` |
| `--terra-checkbox-border-color-disabled`          | `var(--terra-control-border-disabled)`       |
| `--terra-checkbox-border-width`                   | `1px`                                        |
| `--terra-checkbox-border-radius`                  | `2px`                                        |
| `--terra-checkbox-icon-color`                     | `var(--terra-control-icon-selected)`         |
| `--terra-checkbox-label-color`                    | `var(--terra-text-secondary)`                |
| `--terra-checkbox-label-font-family`              | `var(--terra-font-family--inter)`            |
| `--terra-checkbox-label-font-size`                | `var(--terra-font-size-small)`               |
| `--terra-checkbox-label-font-weight`              | `var(--terra-font-weight-normal)`            |

### Checkbox Focus

| Token                                | Value                            |
| ------------------------------------ | -------------------------------- |
| `--terra-checkbox-focus-ring-color`  | `var(--terra-focus-ring-color)`  |
| `--terra-checkbox-focus-ring-width`  | `var(--terra-focus-ring-width)`  |
| `--terra-checkbox-focus-ring-offset` | `var(--terra-focus-ring-offset)` |

## Chip

Chip tokens ontrol the appearance of chips.

### Chip Sizes

| Token                        | Value      |
| ---------------------------- | ---------- |
| `--terra-chip-height-small`  | `1.375rem` |
| `--terra-chip-height-medium` | `1.875rem` |
| `--terra-chip-height-large`  | `2.5rem`   |

### Chip Spacing

| Token                         | Value                           |
| ----------------------------- | ------------------------------- |
| `--terra-chip-padding-small`  | `var(--terra-spacing-x-small)`  |
| `--terra-chip-padding-medium` | `var(--terra-spacing-small)`    |
| `--terra-chip-padding-large`  | `var(--terra-spacing-medium)`   |
| `--terra-chip-margin`         | `var(--terra-spacing-2x-small)` |

### Chip Border

| Token                       | Value   |
| --------------------------- | ------- |
| `--terra-chip-border-width` | `1.5px` |

### Chip Typography

| Token                      | Value                             |
| -------------------------- | --------------------------------- |
| `--terra-chip-font-family` | `var(--terra-font-family--inter)` |
| `--terra-chip-font-weight` | `var(--terra-font-weight-bold)`   |

### Chip Colors

| Token                           | Value                             |
| ------------------------------- | --------------------------------- |
| `--terra-chip-background-color` | `var(--terra-color-neutral-0)`    |
| `--terra-chip-border-color`     | `var(--terra-color-bg-info-bold)` |
| `--terra-chip-color`            | `var(--terra-text-secondary)`     |
| `--terra-chip-color-hover`      | `var(--terra-text-primary)`       |
| `--terra-chip-icon-color`       | `var(--terra-text-secondary)`     |
| `--terra-chip-icon-color-hover` | `var(--terra-text-primary)`       |

### Chip Transitions

| Token                     | Value                               |
| ------------------------- | ----------------------------------- |
| `--terra-chip-transition` | `fill var(--terra-transition-fast)` |

## Container

Container tokens control the appearance of dialog, menu and panel containers.

| Token                             | Value                                        |
| --------------------------------- | -------------------------------------------- |
| `--terra-container-dialog-bg`     | `var(--terra-color-bg-surface-neutral-base)` |
| `--terra-container-dialog-border` | `var(--terra-border-neutral-default)`        |
| `--terra-container-menu-bg`       | `var(--terra-color-bg-surface-neutral-base)` |
| `--terra-container-menu-border`   | `var(--terra-border-neutral-default)`        |
| `--terra-container-panel-bg`      | `var(--terra-color-bg-surface-neutral-base)` |
| `--terra-container-panel-border`  | `var(--terra-border-neutral-default)`        |

### Container Border

| Token                                    | Value                               |
| ---------------------------------------- | ----------------------------------- |
| `--terra-container-dialog-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-container-dialog-border-width`  | `1px`                               |
| `--terra-container-menu-border-radius`   | `var(--terra-border-radius-medium)` |
| `--terra-container-menu-border-width`    | `1px`                               |
| `--terra-container-panel-border-radius`  | `var(--terra-border-radius-medium)` |
| `--terra-container-panel-border-width`   | `1px`                               |

## Control

Control tokens set the appearance of input controls such as checkboxes, radio buttons, toggles, sliders, etc. These tokens are referenced as values for these components.

| Token                                      | Value                                                   |
| ------------------------------------------ | ------------------------------------------------------- |
| `--terra-control-bg-default`               | `var(--terra-color-bg-surface-interactive-default)`     |
| `--terra-control-bg-hover`                 | `var(--terra-color-bg-surface-interactive-hover)`       |
| `--terra-control-bg-disabled`              | `var(--terra-color-bg-surface-interactive-disabled)`    |
| `--terra-control-bg-active`                | `var(--terra-color-bg-surface-interactive-active)`      |
| `--terra-control-bg-selected`              | `var(--terra-color-bg-surface-brand-selected-default)`  |
| `--terra-control-bg-selected-hover`        | `var(--terra-color-bg-surface-brand-selected-hover)`    |
| `--terra-control-bg-selected-disabled`     | `var(--terra-color-bg-surface-brand-selected-disabled)` |
| `--terra-control-bg-selected-active`       | `var(--terra-color-bg-surface-brand-selected-active)`   |
| `--terra-control-border-default`           | `var(--terra-border-neutral-default)`                   |
| `--terra-control-border-hover`             | `var(--terra-border-interactive-hover)`                 |
| `--terra-control-border-disabled`          | `var(--terra-border-interactive-disabled)`              |
| `--terra-control-border-active`            | `var(--terra-border-interactive-active)`                |
| `--terra-control-border-focus`             | `var(--terra-border-interactive-focus-ring)`            |
| `--terra-control-border-selected`          | `var(--terra-border-brand-selected-default)`            |
| `--terra-control-border-selected-hover`    | `var(--terra-border-brand-selected-hover)`              |
| `--terra-control-border-selected-disabled` | `var(--terra-border-brand-selected-disabled)`           |
| `--terra-control-border-selected-active`   | `var(--terra-border-brand-selected-active)`             |
| `--terra-control-icon-selected`            | `var(--terra-color-neutral-white)`                      |
| `--terra-control-icon-selected-hover`      | `var(--terra-color-carbon-20)`                          |
| `--terra-control-icon-selected-disabled`   | `var(--terra-color-carbon-20)`                          |
| `--terra-control-icon-selected-active`     | `var(--terra-color-carbon-40)`                          |

## Data Grid

Data grid tokens control the appearance of the data grid.

### Data Grid - Colors - Primary

| Token                                          | Value                                   |
| ---------------------------------------------- | --------------------------------------- |
| `--terra-data-grid-active-color`               | `var(--terra-color-nasa-blue)`          |
| `--terra-data-grid-background-color`           | `var(--terra-input-background-default)` |
| `--terra-data-grid-foreground-color`           | `var(--terra-text-primary)`             |
| `--terra-data-grid-secondary-foreground-color` | `var(--terra-text-secondary)`           |
| `--terra-data-grid-disabled-foreground-color`  | `var(--terra-text-on-action-disabled)`  |

### Data Grid - Colors - Borders

| Token                                           | Value                                 |
| ----------------------------------------------- | ------------------------------------- |
| `--terra-data-grid-border-color`                | `var(--terra-border-neutral-default)` |
| `--terra-data-grid-secondary-border-color`      | `var(--terra-border-neutral-light)`   |
| `--terra-data-grid-input-border-color`          | `var(--terra-border-neutral-default)` |
| `--terra-data-grid-input-border-color-invalid`  | `var(--terra-border-error-primary)`   |
| `--terra-data-grid-input-disabled-border-color` | `var(--terra-border-action-disabled)` |

### Data Grid - Colors - Backgrounds

| Token                                               | Value                                                   |
| --------------------------------------------------- | ------------------------------------------------------- |
| `--terra-data-grid-header-background-color`         | `var(--terra-color-bg-surface-neutral-primary)`         |
| `--terra-data-grid-tooltip-background-color`        | `var(--terra-color-bg-surface-neutral-inverse-primary)` |
| `--terra-data-grid-odd-row-background-color`        | `var(--terra-color-neutral-50)`                         |
| `--terra-data-grid-control-panel-background-color`  | `var(--terra-color-bg-surface-neutral-primary)`         |
| `--terra-data-grid-subheader-background-color`      | `var(--terra-color-bg-surface-neutral-secondary)`       |
| `--terra-data-grid-panel-background-color`          | `var(--terra-color-bg-surface-neutral-primary)`         |
| `--terra-data-grid-menu-background-color`           | `var(--terra-color-bg-surface-neutral-primary)`         |
| `--terra-data-grid-input-disabled-background-color` | `var(--terra-input-background-disabled)`                |
| `--terra-data-grid-checkbox-background-color`       | `var(--terra-checkbox-background-color)`                |
| `--terra-data-grid-chip-background-color`           | `var(--terra-chip-background-color)`                    |

### Data Grid - Colors - Interactive States

| Token                                                  | Value                                          |
| ------------------------------------------------------ | ---------------------------------------------- |
| `--terra-data-grid-row-hover-color`                    | `var(--terra-color-bg-info-subtle)`            |
| `--terra-data-grid-column-hover-color`                 | `var(--terra-color-bg-surface-brand-tertiary)` |
| `--terra-data-grid-selected-row-background-color`      | `hsla(212, 100%, 58%, 0.2)`                    |
| `--terra-data-grid-range-selection-background-color`   | `hsla(212, 100%, 58%, 0.2)`                    |
| `--terra-data-grid-range-selection-background-color-2` | `hsla(212, 100%, 58%, 0.36)`                   |
| `--terra-data-grid-range-selection-background-color-3` | `hsla(212, 100%, 58%, 0.49)`                   |
| `--terra-data-grid-range-selection-background-color-4` | `hsla(212, 100%, 58%, 0.59)`                   |
| `--terra-data-grid-range-selection-border-color`       | `var(--terra-color-nasa-blue)`                 |
| `--terra-data-grid-input-focus-border-color`           | `var(--terra-focus-ring-color)`                |

### Data Grid - Colors - Validation & Status

| Token                                        | Value                          |
| -------------------------------------------- | ------------------------------ |
| `--terra-data-grid-invalid-color`            | `var(--terra-color-nasa-red)`  |
| `--terra-data-grid-checkbox-unchecked-color` | `var(--terra-color-carbon-50)` |
| `--terra-data-grid-checkbox-checked-color`   | `var(--terra-color-nasa-blue)` |

### Data Grid - Colors - Advanced Filters

| Token                                                 | Value                                     |
| ----------------------------------------------------- | ----------------------------------------- |
| `--terra-data-grid-advanced-filter-join-pill-color`   | `var(--terra-color-nasa-red-tint)`        |
| `--terra-data-grid-advanced-filter-column-pill-color` | `var(--terra-color-active-green)`         |
| `--terra-data-grid-advanced-filter-option-pill-color` | `var(--terra-color-international-orange)` |
| `--terra-data-grid-advanced-filter-value-pill-color`  | `var(--terra-color-nasa-blue-tint)`       |

### Data Grid - Colors - Find/Search

| Token                                                  | Value                          |
| ------------------------------------------------------ | ------------------------------ |
| `--terra-data-grid-find-match-color`                   | `var(--terra-color-carbon-90)` |
| `--terra-data-grid-find-match-background-color`        | `#ffff00`                      |
| `--terra-data-grid-find-active-match-color`            | `var(--terra-color-carbon-90)` |
| `--terra-data-grid-find-active-match-background-color` | `#ffa500`                      |

### Data Grid - Colors - Buttons & Actions

| Token                                                          | Value                                       |
| -------------------------------------------------------------- | ------------------------------------------- |
| `--terra-data-grid-filter-panel-apply-button-color`            | `var(--terra-text-on-action-primary)`       |
| `--terra-data-grid-filter-panel-apply-button-background-color` | `var(--terra-color-action-primary-default)` |
| `--terra-data-grid-selected-tab-underline-color`               | `var(--terra-tab-indicator-selected)`       |

### Data Grid - Typography

| Token                                | Value                             |
| ------------------------------------ | --------------------------------- |
| `--terra-data-grid-font-family`      | `var(--terra-font-family--inter)` |
| `--terra-data-grid-font-size`        | `var(--terra-font-size-small)`    |
| `--terra-data-grid-icon-font-family` | `agGridAlpine`                    |

### Data Grid - Spacing & Sizing

| Token                                                   | Value                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `--terra-data-grid-grid-size`                           | `var(--terra-spacing-x-small)`                                                  |
| `--terra-data-grid-icon-size`                           | `var(--terra-icon-small)`                                                       |
| `--terra-data-grid-row-height`                          | `calc(var(--terra-data-grid-grid-size) * 7)`                                    |
| `--terra-data-grid-header-height`                       | `calc(var(--terra-data-grid-grid-size) * 8)`                                    |
| `--terra-data-grid-list-item-height`                    | `calc(var(--terra-data-grid-grid-size) * 4)`                                    |
| `--terra-data-grid-cell-horizontal-padding`             | `calc(var(--terra-data-grid-grid-size) * 3)`                                    |
| `--terra-data-grid-cell-widget-spacing`                 | `calc(var(--terra-data-grid-grid-size) * 2)`                                    |
| `--terra-data-grid-widget-container-vertical-padding`   | `calc(var(--terra-data-grid-grid-size) * 2)`                                    |
| `--terra-data-grid-widget-container-horizontal-padding` | `calc(var(--terra-data-grid-grid-size) * 2)`                                    |
| `--terra-data-grid-widget-vertical-spacing`             | `calc(var(--terra-data-grid-grid-size) * 1.5)`                                  |
| `--terra-data-grid-column-select-indent-size`           | `var(--terra-data-grid-icon-size)`                                              |
| `--terra-data-grid-set-filter-indent-size`              | `var(--terra-data-grid-icon-size)`                                              |
| `--terra-data-grid-advanced-filter-builder-indent-size` | `calc(var(--terra-data-grid-icon-size) + var(--terra-data-grid-grid-size) * 2)` |
| `--terra-data-grid-toggle-button-height`                | `18px`                                                                          |
| `--terra-data-grid-toggle-button-width`                 | `28px`                                                                          |
| `--terra-data-grid-tab-min-width`                       | `240px`                                                                         |
| `--terra-data-grid-side-bar-panel-width`                | `250px`                                                                         |

### Data Grid - Borders & Radius

| Token                                                     | Value                               |
| --------------------------------------------------------- | ----------------------------------- |
| `--terra-data-grid-borders`                               | `solid 1px`                         |
| `--terra-data-grid-border-radius`                         | `var(--terra-border-radius-medium)` |
| `--terra-data-grid-borders-side-button`                   | `none`                              |
| `--terra-data-grid-side-button-selected-background-color` | `transparent`                       |
| `--terra-data-grid-header-column-resize-handle-display`   | `block`                             |
| `--terra-data-grid-header-column-resize-handle-width`     | `2px`                               |
| `--terra-data-grid-header-column-resize-handle-height`    | `30%`                               |

### Data Grid - Shadows

| Token                            | Value                       |
| -------------------------------- | --------------------------- |
| `--terra-data-grid-card-shadow`  | `var(--terra-shadow-small)` |
| `--terra-data-grid-popup-shadow` | `var(--terra-shadow-small)` |

### Data Grid - Transitions

| Token                                                       | Value                            |
| ----------------------------------------------------------- | -------------------------------- |
| `--terra-data-grid-selected-tab-underline-width`            | `2px`                            |
| `--terra-data-grid-selected-tab-underline-transition-speed` | `var(--terra-transition-medium)` |

### Data Grid - Height

| Token                      | Value   |
| -------------------------- | ------- |
| `--terra-data-grid-height` | `400px` |

## Date Picker

| Token                                                     | Value                                             |
| --------------------------------------------------------- | ------------------------------------------------- |
| `--terra-date-picker-sidebar-background-color`            | `var(--terra-color-bg-surface-neutral-secondary)` |
| `--terra-date-picker-time-panel-background-color`         | `var(--terra-color-bg-surface-neutral-secondary)` |
| `--terra-data-picker-preset-background-hover`             | `var(--terra-menu-item-background-hover)`         |
| `--terra-date-picker-preset-background-focus`             | `var(--terra-menu-item-background-active)`        |
| `--terra-date-picker-preset-background-selected`          | `var(--terra-menu-item-background-selected)`      |
| `--terra-date-picker-preset-color`                        | `var(--terra-menu-item-text)`                     |
| `--terra-date-picker-preset-color-hover`                  | `var(--terra-menu-item-text-hover)`               |
| `--terra-date-picker-preset-color-focus`                  | `var(--terra-menu-item-text-active)`              |
| `--terra-date-picker-preset-color-selected`               | `var(--terra-menu-item-text-selected)`            |
| `--terra-date-picker-spinner-background-color`            | `transparent`                                     |
| `--terra-date-picker-spinner-background-color-hover`      | `var(--terra-menu-item-background-hover)`         |
| `--terra-date-picker-spinner-background-color-active`     | `var(--terra-menu-item-background-active)`        |
| `--terra-date-picker-spinner-color`                       | `var(--terra-menu-item-text)`                     |
| `--terra-date-picker-spinner-color-hover`                 | `var(--terra-menu-item-text-hover)`               |
| `--terra-date-picker-weekday-color`                       | `var(--terra-text-tertiary)`                      |
| `--terra-date-picker-day-background-color-hover`          | `var(--terra-menu-item-background-hover)`         |
| `--terra-date-picker-day-background-color-active`         | `var(--terra-menu-item-background-active)`        |
| `--terra-date-picker-day-background-color-selected`       | `var(--terra-menu-item-background-selected)`      |
| `--terra-date-picker-day-color`                           | `var(--terra-menu-item-text)`                     |
| `--terra-date-picker-day-color-hover`                     | `var(--terra-menu-item-text-hover)`               |
| `--terra-date-picker-day-color-active`                    | `var(--terra-menu-item-text-active)`              |
| `--terra-date-picker-day-color-selected`                  | `var(--terra-menu-item-text-selected)`            |
| `--terra-date-picker-day-color-disabled`                  | `var(--terra-menu-item-text-disabled)`            |
| `--terra-date-picker-day-in-range-background-color`       | `var(--terra-color-bg-surface-brand-secondary)`   |
| `--terra-date-picker-day-in-range-background-color-hover` | `var(--terra-menu-item-background-hover)`         |
| `--terra-date-picker-day-in-range-color`                  | `var(--terra-text-brand-on-brand-inverse)`        |
| `--terra-date-picker-day-in-range-color-hover`            | `var(--terra-menu-item-text-hover)`               |

## Data Subsetter History

Data subsetter history token control the appearance of the Data Subsetter History.

| Token                                         | Value                                                    |
| --------------------------------------------- | -------------------------------------------------------- |
| `--terra-subsetter-history-header-background` | `var(--terra-color-nasa-blue-shade)`                     |
| `--terra-subsetter-history-header-text`       | `var(--terra-color-spacesuit-white)`                     |
| `--terra-subsetter-history-panel-background`  | `var(--terra-color-bg-surface-neutral-primary)`          |
| `--terra-subsetter-history-panel-border`      | `var(--terra-border-neutral-default)`                    |
| `--terra-subsetter-history-panel-shadow`      | `var(--terra-shadow-medium)`                             |
| `--terra-history-item-background`             | `var(--terra-color-bg-surface-neutral-secondary)`        |
| `--terra-history-item-border`                 | `var(--terra-border-neutral-default)`                    |
| `--terra-history-item-text`                   | `var(--terra-text-secondary)`                            |
| `--terra-history-item-progress-background`    | `var(--terra-color-bg-surface-neutral-inverse-tertiary)` |
| `--terra-history-item-progress-bar-fill`      | `var(--terra-color-bg-success-bold)`                     |

## File Upload

File Upload tokens control the appearance of the file uploader

| Token                                                    | Value                                    |
| -------------------------------------------------------- | ---------------------------------------- |
| `--terra-file-upload-dropzone-background-color`          | `var(--terra-input-background-default)`  |
| `--terra-file-upload-dropzone-background-color-hover`    | `hsla(212, 100%, 58%, 0.05)`             |
| `--terra-file-upload-dropzone-background-color-disabled` | `var(--terra-input-background-disabled)` |
| `--terra-file-upload-dropzone-border-color`              | `var(--terra-input-border-default)`      |
| `--terra-file-upload-dropzone-border-color-hover`        | `var(--terra-input-border-focus)`        |
| `--terra-file-upload-dropzone-border-color-focus`        | `var(--terra-input-border-focus)`        |
| `--terra-file-upload-dropzone-border-color-disabled`     | `var(--terra-input-border-disabled)`     |

## Focus Rings

Focus ring tokens control the appearance of focus rings. Note that form inputs use `--terra-input-focus-ring-*` tokens instead.

| Token                       | Value                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `--terra-focus-ring-color`  | `var(--terra-border-interactive-focus-ring)`                                                |
| `--terra-focus-ring-style`  | `solid`                                                                                     |
| `--terra-focus-ring-width`  | `3px`                                                                                       |
| `--terra-focus-ring`        | `var(--terra-focus-ring-style) var(--terra-focus-ring-width) var(--terra-focus-ring-color)` |
| `--terra-focus-ring-offset` | `1px`                                                                                       |

## Help Text

Help text tokens control the appearance of help text in form controls.

| Token                                      | Value                            |
| ------------------------------------------ | -------------------------------- |
| `--terra-input-help-text-font-size-small`  | `var(--terra-font-size-x-small)` |
| `--terra-input-help-text-font-size-medium` | `var(--terra-font-size-small)`   |
| `--terra-input-help-text-font-size-large`  | `var(--terra-font-size-medium)`  |
| `--terra-input-help-text-color`            | `var(--terra-color-carbon-50)`   |

## Icon Sizes

| Token                  | Value                |
| ---------------------- | -------------------- |
| `--terra-icon-small`   | `1.2rem` /_ 19px _/  |
| `--terra-icon-medium`  | `1.75rem` /_ 50px _/ |
| `--terra-icon-large`   | `2.2rem` /_ 68px _/  |
| `--terra-icon-x-large` | `3rem` /_ 76px _/    |

## Inputs

Input color tokens control the appearance of the form input fields.

| Token                                   | Value                                   |
| --------------------------------------- | --------------------------------------- |
| `--terra-input-height-small`            | `1.875rem` /_ 30px _/                   |
| `--terra-input-height-medium`           | `2.5rem` /_ 40px _/                     |
| `--terra-input-height-large`            | `3.125rem` /_ 50px _/                   |
| `--terra-input-font-family`             | `var(--terra-font-family--public-sans)` |
| `--terra-input-font-size`               | `var(--terra-font-size-small)`          |
| `--terra-input-font-weight`             | `var(--terra-font-weight-normal)`       |
| `--terra-input-line-height`             | `var(--terra-line-height-denser)`       |
| `--terra-input-border-width`            | `1px`                                   |
| `--terra-input-border-radius`           | `var(--terra-border-radius-medium)`     |
| `--terra-input-required-content`        | `'*'`                                   |
| `--terra-input-required-content-offset` | `-2px`                                  |
| `--terra-input-required-content-color`  | `var(--terra-color-nasa-red)`           |
| `--terra-input-border-radius-small`     | `var(--terra-border-radius-medium)`     |
| `--terra-input-border-radius-medium`    | `var(--terra-border-radius-medium)`     |
| `--terra-input-border-radius-large`     | `var(--terra-border-radius-medium)`     |
| `--terra-input-font-size-small`         | `var(--terra-font-size-small)`          |
| `--terra-input-font-size-medium`        | `var(--terra-font-size-medium)`         |
| `--terra-input-font-size-large`         | `var(--terra-font-size-large)`          |
| `--terra-input-letter-spacing`          | `var(--terra-letter-spacing-normal)`    |
| `--terra-input-spacing-small`           | `var(--terra-spacing-small)`            |
| `--terra-input-spacing-medium`          | `var(--terra-spacing-medium)`           |
| `--terra-input-spacing-large`           | `var(--terra-spacing-large)`            |
| `--terra-input-focus-ring-offset`       | `0`                                     |

### Input Style Colors

| Token                               | Value                                                |
| ----------------------------------- | ---------------------------------------------------- |
| `--terra-input-background-default`  | `var(--terra-color-bg-surface-neutral-base)`         |
| `--terra-input-background-hover`    | `var(--terra-color-bg-surface-interactive-hover)`    |
| `--terra-input-background-disabled` | `var(--terra-color-bg-surface-interactive-disabled)` |
| `--terra-input-background-focus`    | `var(--terra-color-bg-surface-interactive-focus)`    |
| `--terra-input-background-error`    | `var(--terra-color-red-50)`                          |
| `--terra-input-border-default`      | `var(--terra-border-neutral-default)`                |
| `--terra-input-border-hover`        | `var(--terra-border-interactive-hover)`              |
| `--terra-input-border-disabled`     | `var(--terra-border-interactive-disabled)`           |
| `--terra-input-border-focus`        | `var(--terra-border-interactive-focus-ring)`         |
| `--terra-input-border-error`        | `var(--terra-border-action-error-default)`           |
| `--terra-input-text-default`        | `var(--terra-text-secondary)`                        |
| `--terra-input-text-hover`          | `var(--terra-text-primary)`                          |
| `--terra-input-text-focus`          | `var(--terra-text-primary)`                          |
| `--terra-input-text-disabled`       | `var(--terra-text-tertiary)`                         |
| `--terra-input-text-placeholder`    | `var(--terra-text-tertiary)`                         |
| `--terra-input-icon-default`        | `var(--terra-text-secondary)`                        |
| `--terra-input-icon-hover`          | `var(--terra-text-primary)`                          |

### Filled Form Inputs

Filled form input tokens control the appearance of form controls using the `filled` variant.

| Token                                            | Value                            |
| ------------------------------------------------ | -------------------------------- |
| `--terra-input-filled-background-color`          | `var(--terra-color-neutral-100)` |
| `--terra-input-filled-background-color-hover`    | `var(--terra-color-neutral-200)` |
| `--terra-input-filled-background-color-focus`    | `var(--terra-color-neutral-200)` |
| `--terra-input-filled-background-color-disabled` | `var(--terra-color-neutral-200)` |
| `--terra-input-filled-color`                     | `var(--terra-color-neutral-800)` |
| `--terra-input-filled-color-hover`               | `var(--terra-color-neutral-900)` |
| `--terra-input-filled-color-focus`               | `var(--terra-color-neutral-900)` |
| `--terra-input-filled-color-disabled`            | `var(--terra-color-neutral-400)` |

### Labels

Label tokens control the appearance of labels in form controls.

| Token                             | Value                               |
| --------------------------------- | ----------------------------------- |
| `--terra-input-label-font-family` | `var(--terra-font-family--inter)`   |
| `--terra-input-label-font-size`   | `var(--terra-font-size-small)`      |
| `--terra-input-label-color`       | `var(--terra-text-primary)`         |
| `--terra-input-label-line-weight` | `var(--terra-font-weight-semibold)` |
| `--terra-input-label-line-height` | `var(--terra-line-height-looser)`   |

## Loader

Loader tokens control the appearance of loaders.

### Loader Sizes

| Token                                | Value   |
| ------------------------------------ | ------- |
| `--terra-loader-size-small`          | `30px`  |
| `--terra-loader-size-medium`         | `52px`  |
| `--terra-loader-size-large`          | `100px` |
| `--terra-loader-stroke-width-small`  | `3.5px` |
| `--terra-loader-stroke-width-medium` | `3.5px` |
| `--terra-loader-stroke-width-large`  | `2.5px` |

### Loader Colors

| Token                           | Value                            |
| ------------------------------- | -------------------------------- |
| `--terra-loader-track-color`    | `var(--terra-color-neutral-300)` |
| `--terra-loader-progress-color` | `var(--terra-color-nasa-blue)`   |
| `--terra-loader-planet-color`   | `var(--terra-color-neutral-300)` |
| `--terra-loader-moon-color`     | `var(--terra-color-nasa-blue)`   |

### Loader Typography

| Token                                | Value                               |
| ------------------------------------ | ----------------------------------- |
| `--terra-loader-text-letter-spacing` | `var(--terra-letter-spacing-loose)` |
| `--terra-loader-text-padding`        | `var(--terra-spacing-2x-small)`     |

## Map

Map tokens control the appearance of the map.

| Token                          | Value                                 |
| ------------------------------ | ------------------------------------- |
| `--terra-map-background-color` | `var(--terra-container-panel-bg)`     |
| `--terra-map-border-color`     | `var(--terra-container-panel-border)` |

## Menu Item

Menu tokens control the appearance of menu item.

| Token                                   | Value                                                  |
| --------------------------------------- | ------------------------------------------------------ |
| `--terra-menu-item-background-hover`    | `var(--terra-color-bg-surface-interactive-hover)`      |
| `--terra-menu-item-background-disabled` | `var(--terra-color-bg-surface-interactive-disabled)`   |
| `--terra-menu-item-background-active`   | `var(--terra-color-bg-surface-interactive-active)`     |
| `--terra-menu-item-background-selected` | `var(--terra-color-bg-surface-brand-selected-default)` |
| `--terra-menu-item-text-default`        | `var(--terra-text-interactive-default)`                |
| `--terra-menu-item-text-hover`          | `var(--terra-text-interactive-hover)`                  |
| `--terra-menu-item-text-disabled`       | `var(--terra-text-interactive-disabled)`               |
| `--terra-menu-item-text-active`         | `var(--terra-text-interactive-active)`                 |
| `--terra-menu-item-text-selected`       | `var(--terra-text-interactive-selected)`               |
| `--terra-menu-item-font-family`         | `var(--terra-font-family--inter)`                      |

## Option

Option tokens control the appearance of the option component

| Token                                      | Value                                        |
| ------------------------------------------ | -------------------------------------------- |
| `--terra-options-item-text`                | `var(--terra-menu-item-text)`                |
| `--terra-options-item-text-hover`          | `var(--terra-menu-item-text-hover)`          |
| `--terra-options-item-text-selected`       | `var(--terra-menu-item-text-selected)`       |
| `--terra-options-item-background-hover`    | `var(--terra-menu-item-background-hover)`    |
| `--terra-options-item-background-selected` | `var(--terra-menu-item-background-selected)` |

## Overlay

Overlay tokens control the appearance of overlays as used in [dialog](/components/dialog), etc.

| Token                              | Value                       |
| ---------------------------------- | --------------------------- |
| `--terra-overlay-background-color` | `hsl(240 3.8% 46.1% / 33%)` |

## Pagination

Pagination tokens control the appearance of pagination.

| Token                                                      | Value                                  |
| ---------------------------------------------------------- | -------------------------------------- |
| `--terra-pagination-button-color`                          | `var(--terra-text-primary)`            |
| `--terra-pagination-button-color-hover`                    | `var(--terra-text-secondary)`          |
| `--terra-pagination-button-color-current`                  | `var(--terra-color-neutral-950)`       |
| `--terra-pagination-icon-button-background-color`          | `transparent`                          |
| `--terra-pagination-icon-button-border-color`              | `var(--terra-border-neutral-default)`  |
| `--terra-pagination-icon-button-background-color-hover`    | `var(--terra-color-neutral-100)`       |
| `--terra-pagination-icon-button-border-color-hover`        | `var(--terra-border-neutral-strong)`   |
| `--terra-pagination-icon-button-background-color-disabled` | `var(transparent)`                     |
| `--terra-pagination-icon-button-border-color-disabled`     | `var(--terra-border-action-disabled)`  |
| `--terra-pagination-icon-button-icon-color-disabled`       | `var(--terra-text-on-action-disabled)` |

## Popup

Popup tokens contro the appearance of popups.

| Token                            | Value                                 |
| -------------------------------- | ------------------------------------- |
| `--terra-popup-background-color` | `var(--terra-container-panel-bg)`     |
| `--terra-popup-border-color`     | `var(--terra-container-panel-border)` |
| `--terra-popup-color`            | `var(--terra-text-primary)`           |
| `--terra-popup-arrow-size`       | `6px`                                 |
| `--terra-popup-arrow-color`      | `var(--terra-container-panel-bg)`     |
| `--terra-popup-padding`          | `var(--terra-spacing-medium)`         |

### Progress Bar

| Token                                   | Value                            |
| --------------------------------------- | -------------------------------- |
| `--terra-progress-bar-background-color` | `var(--terra-color-neutral-200)` |

## Radio

Radio tokens control th appearance of radio buttons.

### Sizes

| Token                       | Value      |
| --------------------------- | ---------- |
| `--terra-radio-size-small`  | `0.875rem` |
| `--terra-radio-size-medium` | `1.125rem` |
| `--terra-radio-size-large`  | `1.375rem` |

### Colors

| Token                                          | Value                                        |
| ---------------------------------------------- | -------------------------------------------- |
| `--terra-radio-background-color`               | `var(--terra-control-bg-default)`            |
| `--terra-radio-background-color-hover`         | `var(--terra-control-bg-hover)`              |
| `--terra-radio-background-color-active`        | `var(--terra-control-bg-active)`             |
| `--terra-radio-background-color-checked`       | `var(--terra-control-bg-selected)`           |
| `--terra-radio-background-color-checked-hover` | `var(--terra-control-bg-selected-hover)`     |
| `--terra-radio-background-color-disabled`      | `var(--terra-control-bg-disabled)`           |
| `--terra-radio-border-color`                   | `var(--terra-control-border-default)`        |
| `--terra-radio-border-color-hover`             | `var(--terra-control-border-hover)`          |
| `--terra-radio-border-color-active`            | `var(--terra-control-border-active)`         |
| `--terra-radio-border-color-checked`           | `var(--terra-control-border-selected)`       |
| `--terra-radio-border-color-checked-hover`     | `var(--terra-control-border-selected-hover)` |
| `--terra-radio-border-color-disabled`          | `var(--terra-control-border-disabled)`       |

### Border and Icon

| Token                        | Value                                |
| ---------------------------- | ------------------------------------ |
| `--terra-radio-border-width` | `1px`                                |
| `--terra-radio-icon-color`   | `var(--terra-control-icon-selected)` |

### Label and Focus

| Token                             | Value                             |
| --------------------------------- | --------------------------------- |
| `--terra-radio-label-color`       | `var(--terra-text-secondary)`     |
| `--terra-radio-label-font-family` | `var(--terra-font-family--inter)` |
| `--terra-radio-label-font-size`   | `var(--terra-font-size-small)`    |
| `--terra-radio-label-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-radio-focus-ring-color`  | `var(--terra-color-nasa-blue)`    |
| `--terra-radio-focus-ring-width`  | `var(--terra-focus-ring-width)`   |
| `--terra-radio-focus-ring-offset` | `var(--terra-focus-ring-offset)`  |

## Scroll Hint

Scroll Hint tokens control the appearance of scroll hints.

| Token                                          | Value                                                   |
| ---------------------------------------------- | ------------------------------------------------------- |
| `--terra-scroll-hint-ring-color`               | `var(--terra-color-nasa-red)`                           |
| `--terra-scroll-hint-icon-background-color`    | `var(--terra-color-bg-surface-neutral-inverse-primary)` |
| `--terra-scroll-hint-icon-color`               | `var(--terra-text-primary-inverse)`                     |
| `--terra-scroll-hint-text-color`               | `var(--terra-text-primary)`                             |
| `--terra-scroll-hint-inverse-background-color` | `var(--terra-color-bg-surface-neutral-primary)`         |
| `--terra-scroll-hint-inverse-icon-color`       | `var(--terra-text-primary)`                             |
| `--terra-scroll-hint-inverse-text-color`       | `var(--terra-text-primary-inverse)`                     |

## Site Header

Site Header tokens control the appearance of site headers

| Token                            | Value                                |
| -------------------------------- | ------------------------------------ |
| `--terra-site-header-background` | `var(--terra-color-carbon-black)`    |
| `--terra-site-header-text`       | `var(--terra-color-spacesuit-white)` |

## Site Navigation

Site Namvigation tokens control the appearance of the site navigation.

| Token                                | Value                             |
| ------------------------------------ | --------------------------------- |
| `--terra-site-navigation-background` | `var(--terra-color-carbon-black)` |

## Skeleton

Skeleton tokens control the appearance of skeletons.

| Token                               | Value                               |
| ----------------------------------- | ----------------------------------- |
| `--terra-skeleton-background-color` | `var(--terra-color-neutral-400)`    |
| `--terra-skeleton-sheen-color`      | `var(--terra-color-neutral-500)`    |
| `--terra-skeleton-border-radius`    | `var(--terra-border-radius-medium)` |
| `--terra-skeleton-margin-bottom`    | `var(--terra-spacing-small)`        |
| `--terra-skeleton-min-height`       | `var(--terra-spacing-medium)`       |

## Slider

Slider tokens control the appearance of sliders.

| Token                                           | Value                                       |
| ----------------------------------------------- | ------------------------------------------- |
| `--terra-slider-track-background-color`         | `var(--terra-control-bg-default)`           |
| `--terra-slider-track-border-color`             | `var(--terra-control-border-default)`       |
| `--terra-slider-connect-color`                  | `var(--terra-control-bg-selected)`          |
| `--terra-slider-handle-background-color`        | `var(--terra-control-icon-selected)`        |
| `--terra-slider-handle-background-color-hover`  | `var(--terra-control-icon-selected-hover)`  |
| `--terra-slider-handle-background-color-active` | `var(--terra-control-icon-selected-active)` |
| `--terra-slider-handle-border-color`            | `var(--terra-control-border-selected)`      |
| `--terra-slider-label-color`                    | `var(--terra-text-secondary)`               |
| `--terra-slider-range-color`                    | `var(--terra-text-secondary)`               |

## Spatial Picker

Spatial Picker tokens control the appearance of spatial pickers.

| Token                                     | Value                             |
| ----------------------------------------- | --------------------------------- |
| `--terra-spatial-picker-icon-color`       | `var(--terra-input-icon-default)` |
| `--terra-spatial-picker-icon-color-hover` | `var(--terra-input-icon-hover)`   |

## Status Indicator

Status Indicator tokens control the appearance of status indicators.

| Token                                          | Value                                     |
| ---------------------------------------------- | ----------------------------------------- |
| `--terra-status-indicator-font-family`         | `var(--terra-font-family--inter)`         |
| `--terra-status-indicator-font-size`           | `var(--terra-font-size-small)`            |
| `--terra-status-indicator-font-weight`         | `var(--terra-font-weight-normal)`         |
| `--terra-status-indicator-label-color`         | `var(--terra-text-secondary)`             |
| `--terra-status-indicator-dot-color-active`    | `var(--terra-color-active-green)`         |
| `--terra-status-indicator-dot-color-completed` | `var(--terra-color-carbon-40)`            |
| `--terra-status-indicator-dot-color-testing`   | `var(--terra-color-international-orange)` |
| `--terra-status-indicator-dot-color-future`    | `var(--terra-color-nasa-blue)`            |

## Stepper

Stepper tokens control the appearance of steppers.

| Token                              | Value                            |
| ---------------------------------- | -------------------------------- |
| `--terra-stepper-complete-color`   | `var(--terra-color-blue-400)`    |
| `--terra-stepper-current-color`    | `var(--terra-color-nasa-blue)`   |
| `--terra-stepper-upcoming-color`   | `var(--terra-color-neutral-200)` |
| `--terra-stepper-background-color` | `var(--terra-color-neutral-200)` |

## Tab

Tab tokens control the appearance of tabs.

| Token                              | Value                                                      |
| ---------------------------------- | ---------------------------------------------------------- |
| `--terra-tab-font-family`          | `var(--terra-font-family--inter)`                          |
| `--terra-tab-font-size-large`      | `var(--terra-font-size-medium)`                            |
| `--terra-tab-font-size-small`      | `var(--terra-font-size-small)`                             |
| `--terra-tab-font-weight-normal`   | `var(--terra-font-weight-normal)`                          |
| `--terra-tab-font-weight-active`   | `var(--terra-font-weight-bold)`                            |
| `--terra-tab-padding-large`        | `var(--terra-spacing-small) var(--terra-spacing-medium)`   |
| `--terra-tab-padding-small`        | `var(--terra-spacing-2x-small) var(--terra-spacing-small)` |
| `--terra-tab-padding-closable`     | `var(--terra-spacing-2x-small)`                            |
| `--terra-tab-close-button-padding` | `var(--terra-spacing-2x-small)`                            |
| `--terra-tab-close-button-margin`  | `var(--terra-spacing-2x-small)`                            |
| `--terra-tab-opacity-disabled`     | `0.5`                                                      |
| `--terra-tab-focus-ring-offset`    | `2px`                                                      |
| `--terra-tabs-indicator-width`     | `2px`                                                      |
| `--terra-tabs-track-width`         | `1px`                                                      |
| `--terra-tabs-scroll-button-width` | `var(--terra-spacing-x-large)`                             |

### Tab State Colors

| Token                            | Value                                          |
| -------------------------------- | ---------------------------------------------- |
| `--terra-tab-text-default`       | `var(--terra-text-interactive-default)`        |
| `--terra-tab-text-hover`         | `var(--terra-text-interactive-hover)`          |
| `--terra-tab-text-disabled`      | `var(--terra-text-interactive-disabled)`       |
| `--terra-tab-text-active`        | `var(--terra-text-interactive-active)`         |
| `--terra-tab-text-selected`      | `var(--terra-text-interactive-brand-selected)` |
| `--terra-tab-indicator-selected` | `var(--terra-text-interactive-brand-selected)` |
| `--terra-tab-track-color`        | `var(--terra-color-carbon-20)`                 |

## Toggles

Toggle tokens control the appearance of [toggle](/components/toggle) components.

| Token                        | Value      |
| ---------------------------- | ---------- |
| `--terra-toggle-size-small`  | `0.875rem` |
| `--terra-toggle-size-medium` | `1.125rem` |
| `--terra-toggle-size-large`  | `1.375rem` |

### Toggle Colors

| Token                                          | Value                                       |
| ---------------------------------------------- | ------------------------------------------- |
| `--terra-toggle-background-color-off`          | `var(--terra-control-bg-active)`            |
| `--terra-toggle-background-color-on`           | `var(--terra-control-bg-selected)`          |
| `--terra-toggle-border-color-off`              | `var(--terra-control-border-default)`       |
| `--terra-toggle-border-color-on`               | `var(--terra-control-border-selected)`      |
| `--terra-toggle-thumb-background-color`        | `var(--terra-control-icon-selected)`        |
| `--terra-toggle-thumb-border-color-off`        | `var(--terra-control-border-default)`       |
| `--terra-toggle-thumb-border-color-on`         | `var(--terra-control-border-selected)`      |
| `--terra-toggle-thumb-background-color-hover`  | `var(--terra-control-icon-selected-hover)`  |
| `--terra-toggle-thumb-background-color-active` | `var(--terra-control-icon-selected-active)` |
| `--terra-toggle-label-color`                   | `var(--terra-text-secondary)`               |
| `--terra-toggle-focus-ring-color`              | `var(--terra-color-nasa-blue)`              |

## Tooltips

Tooltip tokens control the appearance of tooltips as used in [popup](/components/popup) and other components.

| Token                              | Value                                                        |
| ---------------------------------- | ------------------------------------------------------------ |
| `--terra-tooltip-border-radius`    | `var(--terra-border-radius-medium)`                          |
| `--terra-tooltip-background-color` | `var(--terra-color-bg-surface-neutral-inverse-primary)`      |
| `--terra-tooltip-color`            | `var(--terra-text-primary-inverse)`                          |
| `--terra-tooltip-font-family`      | `var(--terra-font-family--public-sans)`                      |
| `--terra-tooltip-font-weight`      | `var(--terra-font-weight-normal)`                            |
| `--terra-tooltip-font-size`        | `var(--terra-font-size-small)`                               |
| `--terra-tooltip-line-height`      | `var(--terra-line-height-looser)`                            |
| `--terra-tooltip-padding`          | `var(--terra-spacing-2x-small) var(--terra-spacing-x-small)` |
| `--terra-tooltip-arrow-size`       | `6px`                                                        |

### Popover

| Token                              | Value                                        |
| ---------------------------------- | -------------------------------------------- |
| `--terra-popover-border-radius`    | `var(--terra-container-panel-border-radius)` |
| `--terra-popover-background-color` | `var(--terra-container-panel-bg)`            |
| `--terra-popover-border-color`     | `var(--terra-container-panel-border)`        |
| `--terra-popover-color`            | `var(--terra-text-secondary)`                |
| `--terra-popover-font-family`      | `var(--terra-font-family--public-sans)`      |
| `--terra-popover-font-weight`      | `var(--terra-font-weight-normal)`            |
| `--terra-popover-font-size`        | `var(--terra-font-size-small)`               |
| `--terra-popover-line-height`      | `var(--terra-line-height-normal)`            |
| `--terra-popover-padding`          | `var(--terra-spacing-medium)`                |
| `--terra-popover-shadow`           | `var(--terra-shadow-medium)`                 |
| `--terra-popover-arrow-size`       | `var(--terra-tooltip-arrow-size)`            |
