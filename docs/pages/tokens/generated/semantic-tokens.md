---
meta:
    title: Semantic Tokens
    description: Semantic tokens represent the specific UI roles for colors in the design system. Semantic tokens are consumed directly by UI components. These tokens reference mostly reference <a href="/tokens/generated/foundation-tokens">Foundation tokens</a>, which in turn reference the<a href="/tokens/generated/primitive-tokens">Primitive tokens</a>. This allows for a clear hierarchy and organization of tokens in the system, and it ensures that changes to the <a href="/tokens/generated/primitive-tokens">Primitive</a> and <a href="/tokens/generated/foundation-tokens">Foundation tokens</a> are reflected throughout the designsystem.
---

# Semantic Tokens

Semantic tokens represent the specific UI roles for colors in the design system. Semantic tokens are consumed directly by UI components. These tokens reference mostly reference <a href="/tokens/generated/foundation-tokens">Foundation tokens</a>, which in turn reference the<a href="/tokens/generated/primitive-tokens">Primitive tokens</a>. This allows for a clear hierarchy and organization of tokens in the system, and it ensures that changes to the <a href="/tokens/generated/primitive-tokens">Primitive</a> and <a href="/tokens/generated/foundation-tokens">Foundation tokens</a> are reflected throughout the designsystem.

### Container Tokens

Container tokens define the visual appearance of container elements in the design system. They include background and border colors for components such as dialogs, menus, and panels.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-container-dialog-bg` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |
| `--terra-container-dialog-border` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-container-menu-bg` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |
| `--terra-container-menu-border` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-container-panel-bg` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |
| `--terra-container-panel-border` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |

### Menu Item Color Tokens

Menu Item color tokens define the visual appearance of menu items in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-menu-item-text-default` | `var(--terra-text-interactive-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-default);"></span> |
| `--terra-menu-item-text-hover` | `var(--terra-text-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-hover);"></span> |
| `--terra-menu-item-text-disabled` | `var(--terra-text-interactive-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-disabled);"></span> |
| `--terra-menu-item-text-active` | `var(--terra-text-interactive-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-active);"></span> |
| `--terra-menu-item-text-selected` | `var(--terra-text-interactive-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-selected);"></span> |

### Input Style Color Tokens

Input Style color tokens define the visual appearance of input elements in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-input-background-default` | `var(--terra-color-bg-surface-neutral-base)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-neutral-base);"></span> |
| `--terra-input-background-hover` | `var(--terra-color-bg-surface-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-interactive-hover);"></span> |
| `--terra-input-background-focus` | `var(--terra-color-bg-surface-interactive-focus)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-interactive-focus);"></span> |
| `--terra-input-background-error` | `var(--terra-color-red-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-50);"></span> |
| `--terra-input-border-default` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-input-border-hover` | `var(--terra-border-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-hover);"></span> |
| `--terra-input-border-disabled` | `var(--terra-border-interactive-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-disabled);"></span> |
| `--terra-input-border-focus` | `var(--terra-border-interactive-focus-ring)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-focus-ring);"></span> |
| `--terra-input-border-error` | `var(--terra-border-action-error-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-action-error-default);"></span> |
| `--terra-input-text-default` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-input-text-hover` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-input-text-focus` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |
| `--terra-input-text-disabled` | `var(--terra-text-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-tertiary);"></span> |
| `--terra-input-text-placeholder` | `var(--terra-text-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-tertiary);"></span> |
| `--terra-input-icon-default` | `var(--terra-text-secondary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-secondary);"></span> |
| `--terra-input-icon-hover` | `var(--terra-text-primary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-primary);"></span> |

### Tab Color Tokens

Tab color tokens define the visual appearance of tab elements in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-tab-text-default` | `var(--terra-text-interactive-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-default);"></span> |
| `--terra-tab-text-hover` | `var(--terra-text-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-hover);"></span> |
| `--terra-tab-text-disabled` | `var(--terra-text-interactive-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-disabled);"></span> |
| `--terra-tab-text-active` | `var(--terra-text-interactive-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-active);"></span> |
| `--terra-tab-text-selected` | `var(--terra-text-interactive-brand-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-brand-selected);"></span> |
| `--terra-tab-indicator-selected` | `var(--terra-text-interactive-brand-selected)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-brand-selected);"></span> |
| `--terra-tab-track-color` | `var(--terra-color-carbon-20)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-20);"></span> |

### Input Control Color Tokens

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-control-bg-default` | `var(--terra-color-bg-surface-interactive-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-interactive-default);"></span> |
| `--terra-control-bg-hover` | `var(--terra-color-bg-surface-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-interactive-hover);"></span> |
| `--terra-control-bg-disabled` | `var(--terra-color-bg-surface-interactive-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-interactive-disabled);"></span> |
| `--terra-control-bg-active` | `var(--terra-color-bg-surface-interactive-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-interactive-active);"></span> |
| `--terra-control-bg-selected` | `var(--terra-color-bg-surface-brand-selected-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-bg-surface-brand-selected-default);"></span> |
| `--terra-control-border-default` | `var(--terra-border-neutral-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-neutral-default);"></span> |
| `--terra-control-border-hover` | `var(--terra-border-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-hover);"></span> |
| `--terra-control-border-disabled` | `var(--terra-border-interactive-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-disabled);"></span> |
| `--terra-control-border-active` | `var(--terra-border-interactive-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-active);"></span> |
| `--terra-control-border-focus` | `var(--terra-border-interactive-focus-ring)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-interactive-focus-ring);"></span> |
| `--terra-control-border-selected` | `var(--terra-border-brand-selected-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-brand-selected-default);"></span> |
| `--terra-control-border-selected-hover` | `var(--terra-border-brand-selected-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-brand-selected-hover);"></span> |
| `--terra-control-border-selected-active` | `var(--terra-border-brand-selected-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-border-brand-selected-active);"></span> |
| `--terra-control-icon-selected` | `var(--terra-color-neutral-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-white);"></span> |
| `--terra-control-icon-selected-hover` | `var(--terra-color-carbon-20)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-20);"></span> |
| `--terra-control-icon-selected-disabled` | `var(--terra-color-carbon-20)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-20);"></span> |
| `--terra-control-icon-selected-active` | `var(--terra-color-carbon-40)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-carbon-40);"></span> |

### Breadcrumb Color Tokens

Breadcrumb color tokens define the visual appearance of breadcrumb elements in the design system.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-breadcrumb-text-default` | `var(--terra-text-interactive-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-default);"></span> |
| `--terra-breadcrumb-text-hover` | `var(--terra-text-interactive-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-hover);"></span> |
| `--terra-breadcrumb-text-visited` | `var(--terra-text-tertiary)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-tertiary);"></span> |
| `--terra-breadcrumb-text-current` | `var(--terra-text-interactive-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-interactive-active);"></span> |

