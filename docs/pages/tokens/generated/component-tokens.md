---
meta:
    title: Component Tokens
    description: These tokens are specific to individual components in the design system. They reference the foundation, semantic and utility tokens. All tokens are defined in horizon.scss and automatically adapt to dark mode when applicable.
---

# Component Tokens

These tokens are specific to individual components in the design system. They reference the foundation, semantic and utility tokens. All tokens are defined in horizon.scss and automatically adapt to dark mode when applicable.

## Accordion Tokens

Accordion tokens define the visual appearance of accordion elements in the design system.

### Layout And Styling

Accordion layout tokens define the visual layout of accordion elements.

| Token | Value |
|-------|-------|
| `--terra-accordion-border-width` | `1px` |
| `--terra-accordion-border-radius` | `var(--terra-border-radius-large)` |
| `--terra-accordion-content-padding` | `var(--terra-spacing-medium)` |
| `--terra-accordion-summary-font-size` | `var(--terra-font-size-small)` |
| `--terra-accordion-summary-font-weight` | `var(--terra-font-weight-semibold)` |
| `--terra-accordion-summary-padding` | `var(--terra-spacing-small) var(--terra-spacing-medium)` |

### Accordion Colors

Accordion color tokens define the visual colors of accordion elements.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-accordion-border-color` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-accordion-content-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-accordion-background-color` | `var(--terra-container-menu-bg)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-menu-bg);"></span> |
| `--terra-accordion-summary-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-accordion-summary-background-color-hover` | `var(--terra-color-bg-surface-neutral-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-secondary);"></span> |
| `--terra-accordion-summary-border-color` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-accordion-summary-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-accordion-transition` | `background-color var(--terra-transition-fast)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:background-color var(--terra-transition-fast);"></span> |

## Alerts Tokens

Alert tokens define the visual appearance of alert elements and its variants in the design system.

### Layout And Styling

Alert layout tokens define the visual layout of alert elements.

| Token | Value |
|-------|-------|
| `--terra-alert-line-height` | `var(--terra-line-height-normal)` |

### Filled Alert Appearance

Alert filled tokens define the visual appearance of filled alert elements in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-alert-filled-background-color-information` | `var(--terra-color-bg-info-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-info-bold);"></span> |
| `--terra-alert-filled-background-color-success` | `var(--terra-color-bg-success-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-success-bold);"></span> |
| `--terra-alert-filled-background-color-neutral` | `var(--terra-color-bg-default-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-default-bold);"></span> |
| `--terra-alert-filled-background-color-warning` | `var(--terra-color-bg-warning-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-warning-bold);"></span> |
| `--terra-alert-filled-background-color-danger` | `var(--terra-color-bg-error-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-error-bold);"></span> |
| `--terra-alert-filled-color-information` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-alert-filled-color-success` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-alert-filled-color-neutral` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-alert-filled-color-warning` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-alert-filled-color-danger` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-alert-filled-icon-color-information` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-alert-filled-icon-color-success` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-alert-filled-icon-color-neutral` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-alert-filled-icon-color-warning` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-alert-filled-icon-color-danger` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |

### Subtle Alert Appearance

Alert subtle tokens define the visual appearance of alert elements lighter colored subtle backgrounds in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-alert-subtle-background-color-information` | `var(--terra-color-bg-info-subtle)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-info-subtle);"></span> |
| `--terra-alert-subtle-background-color-success` | `var(--terra-color-bg-success-subtle)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-success-subtle);"></span> |
| `--terra-alert-subtle-background-color-neutral` | `var(--terra-color-bg-default-subtle)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-default-subtle);"></span> |
| `--terra-alert-subtle-background-color-warning` | `var(--terra-color-bg-warning-subtle)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-warning-subtle);"></span> |
| `--terra-alert-subtle-background-color-danger` | `var(--terra-color-bg-error-subtle)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-error-subtle);"></span> |
| `--terra-alert-subtle-color-information` | `var(--terra-text-on-info)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-info);"></span> |
| `--terra-alert-subtle-color-success` | `var(--terra-text-on-success)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-success);"></span> |
| `--terra-alert-subtle-color-neutral` | `var(--terra-text-on-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-default);"></span> |
| `--terra-alert-subtle-color-warning` | `var(--terra-text-on-warning)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-warning);"></span> |
| `--terra-alert-subtle-color-danger` | `var(--terra-text-on-error)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-error);"></span> |

### White Alert Appearance

Alert white appearance tokens define the visual appearance of alert elements with white backgrounds and accent colors in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-alert-white-background-color` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |
| `--terra-alert-white-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |

## Avatar

Avatar tokens define the visual appearance of avatar elements in the design system.

### Avatar Sizes

Avatar size tokens define the visual size of avatar elements in the design system.

| Token | Value |
|-------|-------|
| `--terra-avatar-size-small` | `2rem` (32px) |
| `--terra-avatar-size-medium` | `2.5rem` (40px) |
| `--terra-avatar-size-large` | `3.5rem` (56px) |

### Avatar Typography

Avatar typography tokens define the visual typography of avatar elements in the design system.

| Token | Value |
|-------|-------|
| `--terra-avatar-font-family` | `var(--terra-font-family--inter)` |
| `--terra-avatar-font-weight` | `var(--terra-font-weight-normal)` |

### Avatar Colors

Avatar color tokens define the visual colors of avatar elements in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-avatar-background-color` | `var(--terra-color-carbon-40)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-40);"></span> |
| `--terra-avatar-color` | `var(--terra-color-spacesuit-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-spacesuit-white);"></span> |

## Badge Component

Badge tokens define the visual appearance of badge elements in the design system.

### Badge Colors

Badge tokens that define background and text colors.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-badge-background-color-information` | `var(--terra-color-bg-info-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-info-bold);"></span> |
| `--terra-badge-background-color-success` | `var(--terra-color-bg-success-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-success-bold);"></span> |
| `--terra-badge-background-color-neutral` | `var(--terra-color-bg-default-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-default-bold);"></span> |
| `--terra-badge-background-color-warning` | `var(--terra-color-bg-warning-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-warning-bold);"></span> |
| `--terra-badge-background-color-danger` | `var(--terra-color-bg-error-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-error-bold);"></span> |
| `--terra-badge-color-information` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-badge-color-success` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-badge-color-neutral` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-badge-color-warning` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-badge-color-danger` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |

## Banner

Banner tokens define the visual appearance of banner elements in the design system.

### Layout And Styling

| Token | Value |
|-------|-------|
| `--terra-banner-line-height` | `var(--terra-line-height-normal)` |

## Button Component

Button tokens define the visual appearance of button elements and their variants in the design system.

### Layout And Styling

| Token | Value |
|-------|-------|
| `--terra-button-border-width` | `1px` |
| `--terra-button-font-size-small` | `var(--terra-font-size-x-small)` |
| `--terra-button-font-size-medium` | `var(--terra-font-size-small)` |
| `--terra-button-font-size-large` | `var(--terra-font-size-medium)` |
| `--terra-button-height-small` | `1.875rem` (30px) |
| `--terra-button-height-medium` | `2.25rem` (36px) |
| `--terra-button-height-large` | `3rem` (48px) |

### Text Colors For Standard And Outline Buttons

Text colors used on Standard and Outline variant buttons.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-button-color-default` | `var(--terra-text-on-action-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-secondary);"></span> |
| `--terra-button-color-primary` | `var(--terra-text-on-action-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-primary);"></span> |
| `--terra-button-color-cta` | `var(--terra-text-on-action-cta)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-cta);"></span> |
| `--terra-button-color-success` | `var(--terra-text-on-action-success)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-success);"></span> |
| `--terra-button-color-warning` | `var(--terra-text-on-action-warning)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-warning);"></span> |
| `--terra-button-color-danger` | `var(--terra-text-on-action-error)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-error);"></span> |
| `--terra-button-outline-text-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |

### Text Colors For Text Buttons

Text color states for Text variant buttons.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-button-text-text-color` | `var(--terra-text-link-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-link-default);"></span> |
| `--terra-button-text-text-color-hover` | `var(--terra-text-link-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-link-hover);"></span> |
| `--terra-button-text-text-color-active` | `var(--terra-text-link-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-link-default);"></span> |
| `--terra-button-text-text-color-disabled` | `var(--terra-color-action-primary-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-disabled);"></span> |
| `--terra-button-page-link-text-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |

## Caption

Caption tokens define the visual appearance of caption elements.

### Typography

| Token | Value |
|-------|-------|
| `--terra-caption-font-family` | `var(--terra-font-family--public-sans)` |
| `--terra-caption-font-size` | `var(--terra-font-size-small)` |
| `--terra-caption-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-caption-line-height` | `var(--terra-line-height-normal)` |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-caption-color` | `var(--terra-text-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-tertiary);"></span> |
| `--terra-caption-credit-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |

## Card

Card tokens define the visual appearance of card elements.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-card-background-color` | `var(--terra-container-panel-bg)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-bg);"></span> |

## Checkbox

Checkbox tokens define the visual appearance of checkbox elements.

### Border

| Token | Value |
|-------|-------|
| `--terra-checkbox-border-width` | `1px` |
| `--terra-checkbox-border-radius` | `2px` |

### Typography

| Token | Value |
|-------|-------|
| `--terra-checkbox-label-font-family` | `var(--terra-font-family--inter)` |
| `--terra-checkbox-label-font-size` | `var(--terra-font-size-small)` |
| `--terra-checkbox-label-font-weight` | `var(--terra-font-weight-normal)` |

### Checkbox Sizes

| Token | Value |
|-------|-------|
| `--terra-checkbox-size-small` | `0.875rem` (14px) |
| `--terra-checkbox-size-medium` | `1.125rem` (18px) |
| `--terra-checkbox-size-large` | `1.375rem` (22px) |

### Checkbox Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-checkbox-background-color` | `var(--terra-control-bg-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-default);"></span> |
| `--terra-checkbox-background-color-hover` | `var(--terra-control-bg-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-hover);"></span> |
| `--terra-checkbox-background-color-active` | `var(--terra-control-bg-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-active);"></span> |
| `--terra-checkbox-background-color-checked` | `var(--terra-control-bg-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-selected);"></span> |
| `--terra-checkbox-background-color-checked-hover` | `var(--terra-control-bg-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-selected-hover);"></span> |
| `--terra-checkbox-background-color-disabled` | `var(--terra-control-bg-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-disabled);"></span> |
| `--terra-checkbox-border-color` | `var(--terra-control-border-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-default);"></span> |
| `--terra-checkbox-border-color-hover` | `var(--terra-control-border-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-hover);"></span> |
| `--terra-checkbox-border-color-active` | `var(--terra-control-border-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-active);"></span> |
| `--terra-checkbox-border-color-checked` | `var(--terra-control-border-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected);"></span> |
| `--terra-checkbox-border-color-checked-hover` | `var(--terra-control-border-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected-hover);"></span> |
| `--terra-checkbox-border-color-disabled` | `var(--terra-control-border-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-disabled);"></span> |
| `--terra-checkbox-icon-color` | `var(--terra-control-icon-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected);"></span> |
| `--terra-checkbox-label-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |

### Checkbox Focus Ring

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-checkbox-focus-ring-color` | `var(--terra-focus-ring-color)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-focus-ring-color);"></span> |
| `--terra-checkbox-focus-ring-width` | `var(--terra-focus-ring-width)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-focus-ring-width);"></span> |
| `--terra-checkbox-focus-ring-offset` | `var(--terra-focus-ring-offset)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-focus-ring-offset);"></span> |

## Chips

Chip tokens define the visual appearance of chip elements.

### Chip Sizes

| Token | Value |
|-------|-------|
| `--terra-chip-height-small` | `1.375rem` (22px) |
| `--terra-chip-height-medium` | `1.875rem` (30px) |
| `--terra-chip-height-large` | `2.5rem` (40px) |

### Spacing

| Token | Value |
|-------|-------|
| `--terra-chip-padding-small` | `var(--terra-spacing-x-small)` |
| `--terra-chip-padding-medium` | `var(--terra-spacing-small)` |
| `--terra-chip-padding-large` | `var(--terra-spacing-medium)` |
| `--terra-chip-margin` | `var(--terra-spacing-2x-small)` |

### Border

| Token | Value |
|-------|-------|
| `--terra-chip-border-width` | `1.5px` |

### Typography

| Token | Value |
|-------|-------|
| `--terra-chip-font-family` | `var(--terra-font-family--inter)` |
| `--terra-chip-font-weight` | `var(--terra-font-weight-bold)` |

### Transition

| Token | Value |
|-------|-------|
| `--terra-chip-transition` | `fill var(--terra-transition-fast)` |

### Chip Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-chip-background-color` | `var(--terra-color-neutral-0)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span> |
| `--terra-chip-border-color` | `var(--terra-color-bg-info-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-info-bold);"></span> |
| `--terra-chip-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-chip-color-hover` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-chip-icon-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-chip-icon-color-hover` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |

## Container

Container tokens define the visual appearance of Container elements. Container common styles for components like dialogs, menus, and panels. These tokens provide a consistent style for these types of components across the design system.

### Container Border

| Token | Value |
|-------|-------|
| `--terra-container-dialog-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-container-dialog-border-width` | `1px` |
| `--terra-container-dialog-header-border-color` | `var(--terra-border-neutral-default)` |

### Container Header And Footer Border

| Token | Value |
|-------|-------|
| `--terra-container-dialog-header-border-style` | `solid` |
| `--terra-container-dialog-footer-border-color` | `var(--terra-border-neutral-default)` |
| `--terra-container-dialog-footer-border-style` | `none` |

### Container Menu Border

| Token | Value |
|-------|-------|
| `--terra-container-menu-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-container-menu-border-width` | `1px` |

### Container Panel Border

| Token | Value |
|-------|-------|
| `--terra-container-panel-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-container-panel-border-width` | `1px` |

## Data Grid

Data grid tokens define the visual appearance of data grid elements.

### Typography

| Token | Value |
|-------|-------|
| `--terra-data-grid-font-family` | `var(--terra-font-family--inter)` |
| `--terra-data-grid-font-size` | `var(--terra-font-size-small)` |
| `--terra-data-grid-icon-font-family` | `agGridAlpine` |

### Spacing & Sizing

| Token | Value |
|-------|-------|
| `--terra-data-grid-height` | `400px` |
| `--terra-data-grid-grid-size` | `var(--terra-spacing-x-small)` |
| `--terra-data-grid-icon-size` | `var(--terra-icon-small)` |
| `--terra-data-grid-row-height` | `calc(var(--terra-data-grid-grid-size) * 7)` |
| `--terra-data-grid-header-height` | `calc(var(--terra-data-grid-grid-size) * 8)` |
| `--terra-data-grid-list-item-height` | `calc(var(--terra-data-grid-grid-size) * 4)` |
| `--terra-data-grid-cell-horizontal-padding` | `calc(var(--terra-data-grid-grid-size) * 3)` |
| `--terra-data-grid-cell-widget-spacing` | `calc(var(--terra-data-grid-grid-size) * 2)` |
| `--terra-data-grid-widget-container-vertical-padding` | `calc(var(--terra-data-grid-grid-size) * 2)` |
| `--terra-data-grid-widget-container-horizontal-padding` | `calc(var(--terra-data-grid-grid-size) * 2)` |
| `--terra-data-grid-widget-vertical-spacing` | `calc(var(--terra-data-grid-grid-size) * 1.5)` |
| `--terra-data-grid-column-select-indent-size` | `var(--terra-data-grid-icon-size)` |
| `--terra-data-grid-set-filter-indent-size` | `var(--terra-data-grid-icon-size)` |
| `--terra-data-grid-advanced-filter-builder-indent-size` | `calc(var(--terra-data-grid-icon-size) + var(--terra-data-grid-grid-size) * 2)` |
| `--terra-data-grid-toggle-button-height` | `18px` |
| `--terra-data-grid-toggle-button-width` | `28px` |
| `--terra-data-grid-tab-min-width` | `240px` |
| `--terra-data-grid-side-bar-panel-width` | `250px` |

### Borders & Radius

| Token | Value |
|-------|-------|
| `--terra-data-grid-borders` | `solid 1px` |
| `--terra-data-grid-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-data-grid-borders-side-button` | `none` |
| `--terra-data-grid-side-button-selected-background-color` | `transparent` |
| `--terra-data-grid-header-column-resize-handle-display` | `block` |
| `--terra-data-grid-header-column-resize-handle-width` | `2px` |
| `--terra-data-grid-header-column-resize-handle-height` | `30%` |

### Shadows

| Token | Value |
|-------|-------|
| `--terra-data-grid-card-shadow` | `var(--terra-shadow-small)` |
| `--terra-data-grid-popup-shadow` | `var(--terra-shadow-small)` |

### Transitions

| Token | Value |
|-------|-------|
| `--terra-data-grid-selected-tab-underline-width` | `2px` |
| `--terra-data-grid-selected-tab-underline-transition-speed` | `var(--terra-transition-medium)` |

### Primary Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-active-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |
| `--terra-data-grid-background-color` | `var(--terra-input-background-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-background-default);"></span> |
| `--terra-data-grid-foreground-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-data-grid-secondary-foreground-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-data-grid-disabled-foreground-color` | `var(--terra-text-on-action-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-disabled);"></span> |

### Border Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-border-color` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-data-grid-secondary-border-color` | `var(--terra-border-neutral-light)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-light);"></span> |
| `--terra-data-grid-input-border-color` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-data-grid-input-border-color-invalid` | `var(--terra-border-error-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-error-primary);"></span> |
| `--terra-data-grid-input-disabled-border-color` | `var(--terra-border-action-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-action-disabled);"></span> |

### Background Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-header-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-data-grid-tooltip-background-color` | `var(--terra-color-bg-surface-neutral-inverse-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-inverse-primary);"></span> |
| `--terra-data-grid-odd-row-background-color` | `var(--terra-color-neutral-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-50);"></span> |
| `--terra-data-grid-control-panel-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-data-grid-subheader-background-color` | `var(--terra-color-bg-surface-neutral-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-secondary);"></span> |
| `--terra-data-grid-panel-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-data-grid-menu-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-data-grid-input-disabled-background-color` | `var(--terra-input-background-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-background-disabled);"></span> |
| `--terra-data-grid-checkbox-background-color` | `var(--terra-checkbox-background-color)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-checkbox-background-color);"></span> |
| `--terra-data-grid-chip-background-color` | `var(--terra-chip-background-color)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-chip-background-color);"></span> |

### Interactive State Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-row-hover-color` | `var(--terra-color-bg-info-subtle)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-info-subtle);"></span> |
| `--terra-data-grid-column-hover-color` | `var(--terra-color-bg-surface-brand-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-brand-tertiary);"></span> |
| `--terra-data-grid-selected-row-background-color` | `hsla(212, 100%, 58%, 0.2)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsla(212, 100%, 58%, 0.2);"></span> |
| `--terra-data-grid-range-selection-background-color` | `hsla(212, 100%, 58%, 0.2)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsla(212, 100%, 58%, 0.2);"></span> |
| `--terra-data-grid-range-selection-background-color-2` | `hsla(212, 100%, 58%, 0.36)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsla(212, 100%, 58%, 0.36);"></span> |
| `--terra-data-grid-range-selection-background-color-3` | `hsla(212, 100%, 58%, 0.49)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsla(212, 100%, 58%, 0.49);"></span> |
| `--terra-data-grid-range-selection-background-color-4` | `hsla(212, 100%, 58%, 0.59)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsla(212, 100%, 58%, 0.59);"></span> |
| `--terra-data-grid-range-selection-border-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |
| `--terra-data-grid-input-focus-border-color` | `var(--terra-focus-ring-color)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-focus-ring-color);"></span> |

### Validation & Status Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-invalid-color` | `var(--terra-color-nasa-red)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-red);"></span> |
| `--terra-data-grid-checkbox-unchecked-color` | `var(--terra-color-carbon-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-50);"></span> |
| `--terra-data-grid-checkbox-checked-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |

### Advanced Filters Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-advanced-filter-join-pill-color` | `var(--terra-color-nasa-red-tint)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-red-tint);"></span> |
| `--terra-data-grid-advanced-filter-column-pill-color` | `var(--terra-color-active-green)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-active-green);"></span> |
| `--terra-data-grid-advanced-filter-option-pill-color` | `var(--terra-color-international-orange)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-international-orange);"></span> |
| `--terra-data-grid-advanced-filter-value-pill-color` | `var(--terra-color-nasa-blue-tint)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue-tint);"></span> |

### FindSearch Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-find-match-color` | `var(--terra-color-carbon-90)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-90);"></span> |
| `--terra-data-grid-find-match-background-color` | `#ffff00` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:#ffff00;"></span> |
| `--terra-data-grid-find-active-match-color` | `var(--terra-color-carbon-90)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-90);"></span> |
| `--terra-data-grid-find-active-match-background-color` | `#ffa500` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:#ffa500;"></span> |

### Buttons & Actions Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-grid-filter-panel-apply-button-color` | `var(--terra-text-on-action-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-primary);"></span> |
| `--terra-data-grid-filter-panel-apply-button-background-color` | `var(--terra-color-action-primary-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-default);"></span> |
| `--terra-data-grid-selected-tab-underline-color` | `var(--terra-tab-indicator-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-tab-indicator-selected);"></span> |

## Date Picker

Date picker tokens define the visual appearance of date picker elements in the design system.

### Panel Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-date-picker-sidebar-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-date-picker-time-panel-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |

### PresetColors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-date-picker-preset-background-hover` | `var(--terra-menu-item-background-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-hover);"></span> |
| `--terra-date-picker-preset-background-focus` | `var(--terra-menu-item-background-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-active);"></span> |
| `--terra-date-picker-preset-background-selected` | `var(--terra-menu-item-background-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-selected);"></span> |
| `--terra-date-picker-preset-color` | `var(--terra-menu-item-text)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text);"></span> |
| `--terra-date-picker-preset-color-hover` | `var(--terra-menu-item-text-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-hover);"></span> |
| `--terra-date-picker-preset-color-focus` | `var(--terra-menu-item-text-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-active);"></span> |
| `--terra-date-picker-preset-color-selected` | `var(--terra-menu-item-text-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-selected);"></span> |

### Spinner Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-date-picker-spinner-background-color` | `transparent` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:transparent;"></span> |
| `--terra-date-picker-spinner-background-color-hover` | `var(--terra-menu-item-background-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-hover);"></span> |
| `--terra-date-picker-spinner-background-color-active` | `var(--terra-menu-item-background-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-active);"></span> |
| `--terra-date-picker-spinner-color` | `var(--terra-menu-item-text)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text);"></span> |
| `--terra-date-picker-spinner-color-hover` | `var(--terra-menu-item-text-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-hover);"></span> |

### Interactive Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-date-picker-weekday-color` | `var(--terra-text-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-tertiary);"></span> |
| `--terra-date-picker-day-background-color-hover` | `var(--terra-menu-item-background-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-hover);"></span> |
| `--terra-date-picker-day-background-color-active` | `var(--terra-menu-item-background-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-active);"></span> |
| `--terra-date-picker-day-background-color-selected` | `var(--terra-menu-item-background-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-selected);"></span> |
| `--terra-date-picker-day-color` | `var(--terra-menu-item-text)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text);"></span> |
| `--terra-date-picker-day-color-hover` | `var(--terra-menu-item-text-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-hover);"></span> |
| `--terra-date-picker-day-color-active` | `var(--terra-menu-item-text-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-active);"></span> |
| `--terra-date-picker-day-color-selected` | `var(--terra-menu-item-text-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-selected);"></span> |
| `--terra-date-picker-day-color-disabled` | `var(--terra-menu-item-text-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-disabled);"></span> |
| `--terra-date-picker-day-in-range-background-color` | `var(--terra-color-bg-surface-brand-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-brand-secondary);"></span> |
| `--terra-date-picker-day-in-range-background-color-hover` | `var(--terra-menu-item-background-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-hover);"></span> |
| `--terra-date-picker-day-in-range-color` | `var(--terra-text-brand-on-brand-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-brand-on-brand-inverse);"></span> |
| `--terra-date-picker-day-in-range-color-hover` | `var(--terra-menu-item-text-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-hover);"></span> |

## Date Subsetter

Date Subsetter tokens define the visual appearance of Date Subsetter elements in the design system.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-data-subsetter-background-color` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |

## Data Subsetter History

Data subsetter history token control the appearance of the Data Subsetter History. Data subsetter history is a component that displays a user's history of data subsetter runs.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-subsetter-history-header-background` | `var(--terra-color-nasa-blue-shade)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue-shade);"></span> |
| `--terra-subsetter-history-header-text` | `var(--terra-color-spacesuit-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-spacesuit-white);"></span> |
| `--terra-subsetter-history-panel-background` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-subsetter-history-panel-border` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-history-item-background` | `var(--terra-color-bg-surface-neutral-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-secondary);"></span> |
| `--terra-history-item-border` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-history-item-text` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-history-item-progress-background` | `var(--terra-color-bg-surface-neutral-inverse-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-inverse-tertiary);"></span> |
| `--terra-history-item-progress-bar-fill` | `var(--terra-color-bg-success-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-success-bold);"></span> |

### Shadow

| Token | Value |
|-------|-------|
| `--terra-subsetter-history-panel-shadow` | `var(--terra-shadow-medium)` |

## File Upload

File upload tokens define the visual appearance of file upload elements.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-file-upload-dropzone-background-color` | `var(--terra-input-background-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-background-default);"></span> |
| `--terra-file-upload-dropzone-background-color-hover` | `hsla(212, 100%, 58%, 0.05)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsla(212, 100%, 58%, 0.05);"></span> |
| `--terra-file-upload-dropzone-background-color-disabled` | `var(--terra-input-background-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-background-disabled);"></span> |
| `--terra-file-upload-dropzone-border-color` | `var(--terra-input-border-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-border-default);"></span> |
| `--terra-file-upload-dropzone-border-color-hover` | `var(--terra-input-border-focus)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-border-focus);"></span> |
| `--terra-file-upload-dropzone-border-color-focus` | `var(--terra-input-border-focus)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-border-focus);"></span> |
| `--terra-file-upload-dropzone-border-color-disabled` | `var(--terra-input-border-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-border-disabled);"></span> |

## Dialog

Dialog tokens define the visual appearance of Dialog elements in the design system.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-dialog-background-color` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |

## Icon

Icon tokens define the visual appearance of icon elements.

### Sizes

| Token | Value |
|-------|-------|
| `--terra-icon-small` | `1.2rem` (19.2px) |
| `--terra-icon-medium` | `1.75rem` (28px) |
| `--terra-icon-large` | `2.2rem` (35.2px) |
| `--terra-icon-x-large` | `3rem` (48px) |

## Input

Input tokens define the visual appearance of input elements. Input color tokens (background, border, text) are defined in the Semantic tokens.

### Sizes

| Token | Value |
|-------|-------|
| `--terra-input-height-small` | `1.875rem` (30px) |
| `--terra-input-height-medium` | `2.5rem` (40px) |
| `--terra-input-height-large` | `3.125rem` (50px) |

### Typography

| Token | Value |
|-------|-------|
| `--terra-input-font-family` | `var(--terra-font-family--public-sans)` |
| `--terra-input-font-size` | `var(--terra-font-size-small)` |
| `--terra-input-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-input-line-height` | `var(--terra-line-height-denser)` |
| `--terra-input-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-input-font-size-small` | `var(--terra-font-size-small)` |
| `--terra-input-font-size-medium` | `var(--terra-font-size-medium)` |
| `--terra-input-font-size-large` | `var(--terra-font-size-large)` |
| `--terra-input-letter-spacing` | `var(--terra-letter-spacing-normal)` |

### Border And Radius

| Token | Value |
|-------|-------|
| `--terra-input-border-width` | `1px` |
| `--terra-input-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-input-border-radius-small` | `var(--terra-border-radius-medium)` |
| `--terra-input-border-radius-medium` | `var(--terra-border-radius-medium)` |
| `--terra-input-border-radius-large` | `var(--terra-border-radius-medium)` |
| `--terra-input-required-content` | `'*'` |
| `--terra-input-required-content-offset` | `-2px` |
| `--terra-input-required-content-color` | `var(--terra-color-nasa-red)` |

### Spacing

| Token | Value |
|-------|-------|
| `--terra-input-spacing-small` | `var(--terra-spacing-small)` |
| `--terra-input-spacing-medium` | `var(--terra-spacing-medium)` |
| `--terra-input-spacing-large` | `var(--terra-spacing-large)` |

### Focus Ring

| Token | Value |
|-------|-------|
| `--terra-input-focus-ring-offset` | `0` |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-input-filled-background-color` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-input-filled-background-color-hover` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-input-filled-background-color-focus` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-input-filled-background-color-disabled` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-input-filled-color` | `var(--terra-color-neutral-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-800);"></span> |
| `--terra-input-filled-color-hover` | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-input-filled-color-focus` | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-input-filled-color-disabled` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |

### Label

Label tokens define the visual appearance of Label elements.

| Token | Value |
|-------|-------|
| `--terra-input-label-font-family` | `var(--terra-font-family--inter)` |
| `--terra-input-label-font-size` | `var(--terra-font-size-small)` |
| `--terra-input-label-color` | `var(--terra-text-primary)` |
| `--terra-input-label-line-weight` | `var(--terra-font-weight-semibold)` |
| `--terra-input-label-line-height` | `var(--terra-line-height-looser)` |

## Loader

Loader tokens define the visual appearance of Loader elements.

### Typography

| Token | Value |
|-------|-------|
| `--terra-loader-text-letter-spacing` | `var(--terra-letter-spacing-loose)` |
| `--terra-loader-text-padding` | `var(--terra-spacing-2x-small)` |

### Sizes

| Token | Value |
|-------|-------|
| `--terra-loader-size-small` | `30px` |
| `--terra-loader-size-medium` | `52px` |
| `--terra-loader-size-large` | `100px` |
| `--terra-loader-stroke-width-small` | `3.5px` |
| `--terra-loader-stroke-width-medium` | `3.5px` |
| `--terra-loader-stroke-width-large` | `2.5px` |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-loader-track-color` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-loader-progress-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |
| `--terra-loader-planet-color` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-loader-moon-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |

## Map

Map tokens define the visual appearance of Map elements.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-map-background-color` | `var(--terra-container-panel-bg)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-bg);"></span> |
| `--terra-map-border-color` | `var(--terra-container-panel-border)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-border);"></span> |

## Menu Item

Menu Item tokens define the visual appearance of Menu Item elements. Menu color tokens (background, text) are defined in the [Semantic tokens section](/tokens/generated/semantic-tokens/#menu-item-color-tokens).

### Typography

| Token | Value |
|-------|-------|
| `--terra-menu-item-font-family` | `var(--terra-font-family--inter)` |

## Option

Option tokens define the visual appearance of Option elements. Options are used to present a list of choices to users.

### Typography

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-options-item-text` | `var(--terra-menu-item-text)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text);"></span> |
| `--terra-options-item-text-hover` | `var(--terra-menu-item-text-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-hover);"></span> |
| `--terra-options-item-text-selected` | `var(--terra-menu-item-text-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-text-selected);"></span> |
| `--terra-options-item-background-hover` | `var(--terra-menu-item-background-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-hover);"></span> |
| `--terra-options-item-background-selected` | `var(--terra-menu-item-background-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-menu-item-background-selected);"></span> |

## Overlays

Overlay tokens define the visual appearance of Overlay elements used in [dialog](/components/dialog), etc. Overlays are used primarily to mask content below dialogs.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-overlay-background-color` | `hsl(240 3.8% 46.1% / 33%)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:hsl(240 3.8% 46.1% / 33%);"></span> |

## Pagination

Pagination tokens define the visual appearance of Pagination elements. Pagination is a navigational element that allows users to navigate between content or pages

### Button TextColors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-pagination-button-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-pagination-button-color-hover` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-pagination-button-color-current` | `var(--terra-color-neutral-950)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-950);"></span> |

### Icon Button Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-pagination-icon-button-background-color` | `transparent` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:transparent;"></span> |
| `--terra-pagination-icon-button-border-color` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-pagination-icon-button-background-color-hover` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-pagination-icon-button-border-color-hover` | `var(--terra-border-neutral-strong)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-strong);"></span> |
| `--terra-pagination-icon-button-background-color-disabled` | `var(transparent)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(transparent);"></span> |
| `--terra-pagination-icon-button-border-color-disabled` | `var(--terra-border-action-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-action-disabled);"></span> |
| `--terra-pagination-icon-button-icon-color-disabled` | `var(--terra-text-on-action-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-action-disabled);"></span> |

## Popover

Popover tokens define the visual appearance of Popover elements. Popovers are card-like panels that appear when a user interacts with an element.

### Topography

| Token | Value |
|-------|-------|
| `--terra-popover-font-family` | `var(--terra-font-family--public-sans)` |
| `--terra-popover-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-popover-font-size` | `var(--terra-font-size-small)` |
| `--terra-popover-line-height` | `var(--terra-line-height-normal)` |

### Layout And Styling

| Token | Value |
|-------|-------|
| `--terra-popover-border-radius` | `var(--terra-container-panel-border-radius)` |
| `--terra-popover-padding` | `var(--terra-spacing-medium)` |
| `--terra-popover-shadow` | `var(--terra-shadow-medium)` |
| `--terra-popover-arrow-size` | `var(--terra-tooltip-arrow-size)` |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-popover-background-color` | `var(--terra-container-panel-bg)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-bg);"></span> |
| `--terra-popover-border-color` | `var(--terra-container-panel-border)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-border);"></span> |
| `--terra-popover-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |

## Popup

Popup tokens define the visual appearance of Popup elements.

### Icon Button Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-popup-background-color` | `var(--terra-container-panel-bg)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-bg);"></span> |
| `--terra-popup-border-color` | `var(--terra-container-panel-border)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-border);"></span> |
| `--terra-popup-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-popup-arrow-size` | `6px` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:6px;"></span> |
| `--terra-popup-arrow-color` | `var(--terra-container-panel-bg)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-container-panel-bg);"></span> |
| `--terra-popup-padding` | `var(--terra-spacing-medium)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-spacing-medium);"></span> |

## Progress Bar

Progress Bar tokens define the visual appearance of Progress Bar elements.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-progress-bar-background-color` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |

## Radio

Radio tokens define the visual appearance of Radio elements. Radio buttons are a form field used when only a single selection can be made from a list.

### Sizes

| Token | Value |
|-------|-------|
| `--terra-radio-size-small` | `0.875rem` (14px) |
| `--terra-radio-size-medium` | `1.125rem` (18px) |
| `--terra-radio-size-large` | `1.375rem` (22px) |

### Background Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-radio-background-color` | `var(--terra-control-bg-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-default);"></span> |
| `--terra-radio-background-color-hover` | `var(--terra-control-bg-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-hover);"></span> |
| `--terra-radio-background-color-active` | `var(--terra-control-bg-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-active);"></span> |
| `--terra-radio-background-color-checked` | `var(--terra-control-bg-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-selected);"></span> |
| `--terra-radio-background-color-checked-hover` | `var(--terra-control-bg-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-selected-hover);"></span> |
| `--terra-radio-background-color-disabled` | `var(--terra-control-bg-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-disabled);"></span> |

### Border Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-radio-border-color` | `var(--terra-control-border-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-default);"></span> |
| `--terra-radio-border-color-hover` | `var(--terra-control-border-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-hover);"></span> |
| `--terra-radio-border-color-active` | `var(--terra-control-border-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-active);"></span> |
| `--terra-radio-border-color-checked` | `var(--terra-control-border-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected);"></span> |
| `--terra-radio-border-color-checked-hover` | `var(--terra-control-border-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected-hover);"></span> |
| `--terra-radio-border-color-disabled` | `var(--terra-control-border-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-disabled);"></span> |

### Border Width

| Token | Value |
|-------|-------|
| `--terra-radio-border-width` | `1px` |

### Icon Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-radio-icon-color` | `var(--terra-control-icon-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected);"></span> |

### Label Typography

| Token | Value |
|-------|-------|
| `--terra-radio-label-color` | `var(--terra-text-secondary)` |
| `--terra-radio-label-font-family` | `var(--terra-font-family--inter)` |
| `--terra-radio-label-font-size` | `var(--terra-font-size-small)` |
| `--terra-radio-label-font-weight` | `var(--terra-font-weight-normal)` |

### Focus Ring

| Token | Value |
|-------|-------|
| `--terra-radio-focus-ring-width` | `var(--terra-focus-ring-width)` |
| `--terra-radio-focus-ring-offset` | `var(--terra-focus-ring-offset)` |

### Focus Ring Color

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-radio-focus-ring-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |

## Scroll Hint

Scroll hint tokens define the visual appearance of Scroll Hint elements. Scroll hint is an animated button that prompts visitors to scroll.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-scroll-hint-ring-color` | `var(--terra-color-nasa-red)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-red);"></span> |
| `--terra-scroll-hint-icon-background-color` | `var(--terra-color-bg-surface-neutral-inverse-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-inverse-primary);"></span> |
| `--terra-scroll-hint-icon-color` | `var(--terra-text-primary-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary-inverse);"></span> |
| `--terra-scroll-hint-text-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |

### InverseColors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-scroll-hint-inverse-background-color` | `var(--terra-color-bg-surface-neutral-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-primary);"></span> |
| `--terra-scroll-hint-inverse-icon-color` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-scroll-hint-inverse-text-color` | `var(--terra-text-primary-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary-inverse);"></span> |

## Site Header

Site Header tokens define the visual appearance of Site Header elements.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-site-header-background` | `var(--terra-color-carbon-black)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-black);"></span> |
| `--terra-site-header-text` | `var(--terra-color-spacesuit-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-spacesuit-white);"></span> |

## Site Navigation

Site Navigation tokens define the visual appearance of Site Navigation elements.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-site-navigation-background` | `var(--terra-color-carbon-black)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-black);"></span> |

## Skeleton

Skeleton tokens define the visual appearance of Skeleton elements.

### Layout And Styling

| Token | Value |
|-------|-------|
| `--terra-skeleton-border-radius` | `var(--terra-border-radius-medium)` |
| `--terra-skeleton-margin-bottom` | `var(--terra-spacing-small)` |
| `--terra-skeleton-min-height` | `var(--terra-spacing-medium)` |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-skeleton-background-color` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-skeleton-sheen-color` | `var(--terra-color-neutral-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span> |

## Slider

Slider tokens define the visual appearance of Slider elements. Sliders are form fields that allow for selection of a range of values.

### Slider Track Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-slider-track-background-color` | `var(--terra-control-bg-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-default);"></span> |
| `--terra-slider-track-border-color` | `var(--terra-control-border-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-default);"></span> |
| `--terra-slider-connect-color` | `var(--terra-control-bg-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-selected);"></span> |

### Slider Handle Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-slider-handle-background-color` | `var(--terra-control-icon-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected);"></span> |
| `--terra-slider-handle-background-color-hover` | `var(--terra-control-icon-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected-hover);"></span> |
| `--terra-slider-handle-background-color-active` | `var(--terra-control-icon-selected-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected-active);"></span> |
| `--terra-slider-handle-border-color` | `var(--terra-control-border-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected);"></span> |

### Slider Label Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-slider-label-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-slider-range-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |

## Spatial Picker

Spatial Picker tokens define the visual appearance of Spatial Picker elements.

### Icon Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-spatial-picker-icon-color` | `var(--terra-input-icon-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-icon-default);"></span> |
| `--terra-spatial-picker-icon-color-hover` | `var(--terra-input-icon-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-input-icon-hover);"></span> |

## Status Indicator

Status Indicator tokens define the visual appearance of Status Indicator elements. Status indicators are dynamic labels that indicate the current state of a mission or project.

### Typography

| Token | Value |
|-------|-------|
| `--terra-status-indicator-font-family` | `var(--terra-font-family--inter)` |
| `--terra-status-indicator-font-size` | `var(--terra-font-size-small)` |
| `--terra-status-indicator-font-weight` | `var(--terra-font-weight-normal)` |

### Typography

| Token | Value |
|-------|-------|
| `--terra-status-indicator-label-color` | `var(--terra-text-secondary)` |
| `--terra-status-indicator-dot-color-active` | `var(--terra-color-active-green)` |
| `--terra-status-indicator-dot-color-completed` | `var(--terra-color-carbon-40)` |
| `--terra-status-indicator-dot-color-testing` | `var(--terra-color-international-orange)` |
| `--terra-status-indicator-dot-color-future` | `var(--terra-color-nasa-blue)` |

## Stepper

Stepper tokens define the visual appearance of Stepper elements. Steppers are a type of form field that allow users to incrementally increase or decrease a value.

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-stepper-complete-color` | `var(--terra-color-blue-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-400);"></span> |
| `--terra-stepper-current-color` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |
| `--terra-stepper-upcoming-color` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-stepper-background-color` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |

## Tabs

Tabs tokens define the visual appearance of Tabs elements. Tabs divide content into meaningful, related sections. Tab color tokens (text and indicator) are defined in the [Semantic tokens section](/tokens/generated/semantic-tokens/#tab-color-tokens).

### Typography

| Token | Value |
|-------|-------|
| `--terra-tab-font-family` | `var(--terra-font-family--inter)` |
| `--terra-tab-font-size-large` | `var(--terra-font-size-medium)` |
| `--terra-tab-font-size-small` | `var(--terra-font-size-small)` |
| `--terra-tab-font-weight-normal` | `var(--terra-font-weight-normal)` |
| `--terra-tab-font-weight-active` | `var(--terra-font-weight-bold)` |

### Spacing

| Token | Value |
|-------|-------|
| `--terra-tab-padding-large` | `var(--terra-spacing-small) var(--terra-spacing-medium)` |

### Close Button

| Token | Value |
|-------|-------|
| `--terra-tab-close-button-padding` | `var(--terra-spacing-2x-small)` |
| `--terra-tab-close-button-margin` | `var(--terra-spacing-2x-small)` |

### States

| Token | Value |
|-------|-------|
| `--terra-tab-opacity-disabled` | `0.5` |

### Focus

| Token | Value |
|-------|-------|
| `--terra-tab-focus-ring-offset` | `2px` |

### Indicator

| Token | Value |
|-------|-------|
| `--terra-tabs-indicator-width` | `2px` |
| `--terra-tabs-track-width` | `1px` |

### Scroll Button

| Token | Value |
|-------|-------|
| `--terra-tabs-scroll-button-width` | `var(--terra-spacing-x-large)` |

## Tag

Tag tokens define the visual appearance of Tag elements. Tags are simple labels that help categorize items.

### Typography

| Token | Value |
|-------|-------|
| `--terra-tag-font-family` | `var(--terra-font-family--inter)` |
| `--terra-tag-font-size-small` | `var(--terra-font-size-x-small)` |
| `--terra-tag-font-size-medium` | `var(--terra-font-size-small)` |
| `--terra-tag-font-size-large` | `var(--terra-font-size-medium)` |
| `--terra-tag-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-tag-font-weight-urgent` | `var(--terra-font-weight-bold, 700)` |

### Padding

| Token | Value |
|-------|-------|
| `--terra-tag-padding-small` | `0.25rem 0.5rem` |
| `--terra-tag-padding-medium` | `var(--terra-spacing-x-small, 0.5rem) var(--terra-spacing-small, 0.75rem)` |
| `--terra-tag-padding-large` | `0.625rem 1rem` |

### Icon Sizes

| Token | Value |
|-------|-------|
| `--terra-tag-icon-size-small` | `1.25rem` (20px) |
| `--terra-tag-icon-size-medium` | `1.5rem` (24px) |
| `--terra-tag-icon-size-large` | `1.75rem` (28px) |
| `--terra-tag-icon-inner-size-small` | `0.75rem` (12px) |
| `--terra-tag-icon-inner-size-medium` | `0.875rem` (14px) |
| `--terra-tag-icon-inner-size-large` | `1rem` (16px) |
| `--terra-tag-icon-border-color` | `var(--terra-color-carbon-40)` |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-tag-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-tag-background-color` | `transparent` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:transparent;"></span> |
| `--terra-tag-border-color` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-tag-color-hover` | `var(--terra-text-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-tertiary);"></span> |
| `--terra-tag-background-color-hover` | `var(--terra-color-bg-surface-neutral-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-tertiary);"></span> |
| `--terra-tag-border-color-hover` | `var(--terra-border-neutral-strong)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-strong);"></span> |
| `--terra-tag-urgent-color` | `var(--terra-color-spacesuit-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-spacesuit-white);"></span> |
| `--terra-tag-urgent-background-color` | `var(--terra-color-bg-error-bold)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-error-bold);"></span> |

## Toggle

Toggle tokens define the visual appearance of Toggle elements. Toggles are switches that allow the user to turn an option on or off.

### Sizes

| Token | Value |
|-------|-------|
| `--terra-toggle-size-small` | `0.875rem` (14px) |
| `--terra-toggle-size-medium` | `1.125rem` (18px) |
| `--terra-toggle-size-large` | `1.375rem` (22px) |

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-toggle-background-color-off` | `var(--terra-control-bg-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-active);"></span> |
| `--terra-toggle-background-color-on` | `var(--terra-control-bg-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-bg-selected);"></span> |
| `--terra-toggle-border-color-off` | `var(--terra-control-border-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-default);"></span> |
| `--terra-toggle-border-color-on` | `var(--terra-control-border-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected);"></span> |
| `--terra-toggle-thumb-background-color` | `var(--terra-control-icon-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected);"></span> |
| `--terra-toggle-thumb-border-color-off` | `var(--terra-control-border-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-default);"></span> |
| `--terra-toggle-thumb-border-color-on` | `var(--terra-control-border-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-border-selected);"></span> |
| `--terra-toggle-thumb-background-color-hover` | `var(--terra-control-icon-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected-hover);"></span> |
| `--terra-toggle-thumb-background-color-active` | `var(--terra-control-icon-selected-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-control-icon-selected-active);"></span> |
| `--terra-toggle-label-color` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |

### Focus Ring

| Token | Value |
|-------|-------|
| `--terra-toggle-focus-ring-color` | `var(--terra-color-nasa-blue)` |

## Tooltips

Tooltip tokens define the visual appearance of Tooltip elements. Tooltips are small popups that provide additional information when a user hovers over an element.

### Topography

| Token | Value |
|-------|-------|
| `--terra-tooltip-font-family` | `var(--terra-font-family--public-sans)` |
| `--terra-tooltip-font-weight` | `var(--terra-font-weight-normal)` |
| `--terra-tooltip-font-size` | `var(--terra-font-size-small)` |
| `--terra-tooltip-line-height` | `var(--terra-line-height-normal)` |

### Layout And Styling

| Token | Value |
|-------|-------|

### Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-tooltip-background-color` | `var(--terra-color-bg-surface-neutral-inverse-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-inverse-primary);"></span> |
| `--terra-tooltip-color` | `var(--terra-text-primary-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary-inverse);"></span> |

