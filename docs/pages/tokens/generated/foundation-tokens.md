---
meta:
    title: Foundation Tokens
    description: The Foundation token layer is where we select which <a href="/tokens/generated/primitive-tokens">Primitive colors</a> will be used for the theme, and define the color usage, such as which colors will be used for surfaces, text, borders, etc. These tokens are the building blocks for all other tokens in the system. The Foundation tokens are organized by color role (e.g. surface, text, border). The Foundation tokens reference the <a href="/tokens/generated/primitive-tokens">Primitives tokens</a> directly, which allows for easy updates to the color palettes without having to update every single token in the system. The <a href="/tokens/generated/semantic-tokens">Semantic</a> level UI role tokens are build on the Foundation-level tokens (rather than primitives) for the most-part so that changes to the theme Foundation are reflected in the <a href="/tokens/generated/semantic-tokens">Semantic tokens</a>.
---

# Foundation Tokens

The Foundation token layer is where we select which <a href="/tokens/generated/primitive-tokens">Primitive colors</a> will be used for the theme, and define the color usage, such as which colors will be used for surfaces, text, borders, etc. These tokens are the building blocks for all other tokens in the system. The Foundation tokens are organized by color role (e.g. surface, text, border). The Foundation tokens reference the <a href="/tokens/generated/primitive-tokens">Primitives tokens</a> directly, which allows for easy updates to the color palettes without having to update every single token in the system. The <a href="/tokens/generated/semantic-tokens">Semantic</a> level UI role tokens are build on the Foundation-level tokens (rather than primitives) for the most-part so that changes to the theme Foundation are reflected in the <a href="/tokens/generated/semantic-tokens">Semantic tokens</a>.

## Surface Color Tokens



### Neutral Surface Colors

Neutral Surface color tokens are used for backgrounds and surfaces such as pages, side bars, dialog boxes, cards, inputs, popovers, tooltips, etc. They provide a range of light to dark neutrals that can be used for layering content, creating depth, and ensuring appropriate contrast with text and other elements.

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-color-bg-surface-neutral-base` | `var(--terra-color-neutral-0)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span> |
| `--terra-color-bg-surface-neutral-primary` | `var(--terra-color-neutral-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-50);"></span> |
| `--terra-color-bg-surface-neutral-secondary` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-color-bg-surface-neutral-tertiary` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-color-bg-surface-neutral-inverse-primary` | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-color-bg-surface-neutral-inverse-tertiary` | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |

### Neutral Surface Interactive Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-color-bg-surface-interactive-default` | `var(--terra-color-neutral-0)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span> |
| `--terra-color-bg-surface-interactive-hover` | `var(--terra-color-neutral-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-50);"></span> |
| `--terra-color-bg-surface-interactive-disabled` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-color-bg-surface-interactive-active` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |

### Brand Surface Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-color-bg-surface-brand-primary` | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |
| `--terra-color-bg-surface-brand-secondary` | `var(--terra-color-blue-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-200);"></span> |
| `--terra-color-bg-surface-brand-tertiary` | `var(--terra-color-blue-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-50);"></span> |

### Brand Selected Surface Interactive Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-color-bg-surface-brand-selected-default` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-color-bg-surface-brand-selected-hover` | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-color-bg-surface-brand-selected-active` | `var(--terra-color-blue-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-800);"></span> |
| `--terra-color-bg-surface-brand-selected-disabled` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |

### Semantic Background Colors

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-color-bg-default-subtle` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-color-bg-default-bold` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-color-bg-success-subtle` | `var(--terra-color-green-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-100);"></span> |
| `--terra-color-bg-success-bold` | `var(--terra-color-green-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-600);"></span> |
| `--terra-color-bg-warning-subtle` | `var(--terra-color-orange-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-100);"></span> |
| `--terra-color-bg-warning-bold` | `var(--terra-color-orange-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-500);"></span> |
| `--terra-color-bg-error-subtle` | `var(--terra-color-red-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-100);"></span> |
| `--terra-color-bg-error-bold` | `var(--terra-color-red-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-600);"></span> |
| `--terra-color-bg-info-subtle` | `var(--terra-color-blue-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-100);"></span> |
| `--terra-color-bg-info-bold` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |

### Action Background Colors (Buttons, Etc)

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-color-action-primary-default` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-color-action-primary-hover` | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-color-action-primary-active` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |
| `--terra-color-action-primary-disabled` | `var(--terra-color-blue-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-100);"></span> |
| `--terra-color-action-secondary-default` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-color-action-secondary-hover` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-color-action-secondary-active` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-color-action-secondary-disabled` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-color-action-cta-default` | `var(--terra-color-chartreuse-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-500);"></span> |
| `--terra-color-action-cta-hover` | `var(--terra-color-chartreuse-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-600);"></span> |
| `--terra-color-action-cta-active` | `var(--terra-color-chartreuse-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-700);"></span> |
| `--terra-color-action-cta-disabled` | `var(--terra-color-chartreuse-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-100);"></span> |
| `--terra-color-action-success-default` | `var(--terra-color-green-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-500);"></span> |
| `--terra-color-action-success-hover` | `var(--terra-color-green-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-600);"></span> |
| `--terra-color-action-success-active` | `var(--terra-color-green-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-700);"></span> |
| `--terra-color-action-success-disabed` | `var(--terra-color-green-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-100);"></span> |
| `--terra-color-action-warning-default` | `var(--terra-color-orange-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-500);"></span> |
| `--terra-color-action-warning-hover` | `var(--terra-color-orange-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-600);"></span> |
| `--terra-color-action-warning-active` | `var(--terra-color-orange-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-700);"></span> |
| `--terra-color-action-warning-disabled` | `var(--terra-color-orange-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-100);"></span> |
| `--terra-color-action-error-default` | `var(--terra-color-red-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-600);"></span> |
| `--terra-color-action-error-hover` | `var(--terra-color-red-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-700);"></span> |
| `--terra-color-action-error-active` | `var(--terra-color-red-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-800);"></span> |
| `--terra-color-action-error-disabled` | `var(--terra-color-red-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-100);"></span> |
| `--terra-color-action-info-default` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-color-action-info-hover` | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-color-action-info-active` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |
| `--terra-color-action-info-disabled` | `var(--terra-color-blue-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-100);"></span> |

## Text Color Tokens



### Text Colors On Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-text-primary` | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-text-secondary` | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |
| `--terra-text-tertiary` | `var(--terra-color-neutral-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span> |
| `--terra-text-primary-inverse` | `var(--terra-color-neutral-0)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span> |
| `--terra-text-secondary-inverse` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-text-tertiary-inverse` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |

### Text Link Colors On Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-text-link-default` | `var(--terra-color-blue-functional-link-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-default);"></span> |
| `--terra-text-link-hover` | `var(--terra-color-blue-functional-link-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-hover);"></span> |

### Brand Text Colors On Brand And Neutral Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-text-brand-on-brand-primary` | `var(--terra-color-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-white);"></span> |
| `--terra-text-brand-on-brand-inverse` | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-text-brand-on-primary` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-text-brand-on-secondary` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-text-brand-on-tertiary` | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-text-brand-on-primary-inverse` | `var(--terra-color-blue-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-400);"></span> |
| `--terra-text-brand-on-secondary-inverse` | `var(--terra-color-blue-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-300);"></span> |
| `--terra-text-brand-on-tertiary-inverse` | `var(--terra-color-blue-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-200);"></span> |

### Text Colors On Neutral Interactive Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-text-interactive-default` | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |
| `--terra-text-interactive-hover` | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-text-interactive-active` | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-text-interactive-disabled` | `var(--terra-color-neutral-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span> |
| `--terra-text-interactive-selected` | `var(--terra-color-neutral-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-white);"></span> |
| `--terra-text-interactive-brand-selected` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |

### Text Colors On Semantic Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-text-on-success` | `var(--terra-color-green-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-900);"></span> |
| `--terra-text-on-warning` | `var(--terra-color-orange-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-900);"></span> |
| `--terra-text-on-error` | `var(--terra-color-red-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-900);"></span> |
| `--terra-text-on-info` | `var(--terra-color-blue-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-800);"></span> |
| `--terra-text-on-default` | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |
| `--terra-text-on-semantic` | `var(--terra-color-neutral-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-white);"></span> |
| `--terra-text-on-semantic-inverse` | `var(--terra-color-neutral-black)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-black);"></span> |

### Text Colors On Action Surfaces (Buttons Etc)

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-text-on-action-primary` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-text-on-action-secondary` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-cta` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-success` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-warning` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-error` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-text-on-action-info` | `var(--terra-text-on-semantic)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span> |
| `--terra-text-on-action-disabled` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |

## Border Color Tokens



### Border Colors For Neutral Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-border-neutral-light` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-border-neutral-default` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-border-neutral-strong` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-border-neutral-inverse-light` | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |
| `--terra-border-neutral-inverse-default` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-border-neutral-inverse-strong` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |

### Border Colors For Neutral Interactive Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-border-interactive-hover` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-border-interactive-disabled` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-border-interactive-active` | `var(--terra-color-neutral-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span> |
| `--terra-border-interactive-focus-ring` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |

### Border Colors For Brand Selected Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-border-brand-selected-default` | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-border-brand-selected-hover` | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-border-brand-selected-active` | `var(--terra-color-blue-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-800);"></span> |
| `--terra-border-brand-selected-disabled` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |

### Border Colors For Semantic Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-border-success` | `var(--terra-color-green-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-800);"></span> |
| `--terra-border-warning` | `var(--terra-color-orange-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-700);"></span> |
| `--terra-border-error` | `var(--terra-color-red-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-700);"></span> |
| `--terra-border-info` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |

### Border Colors For Action Surfaces

| Token | Value | Preview |
|-------|-------|---------|
| `--terra-border-action-secondary-hover` | `var(--terra-color-action-secondary-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-secondary-hover);"></span> |
| `--terra-border-action-primary-default` | `var(--terra-color-action-primary-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-default);"></span> |
| `--terra-border-action-primary-hover` | `var(--terra-color-action-primary-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-hover);"></span> |
| `--terra-border-action-primary-active` | `var(--terra-color-action-primary-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-active);"></span> |
| `--terra-border-action-cta-default` | `var(--terra-color-action-cta-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-default);"></span> |
| `--terra-border-action-cta-hover` | `var(--terra-color-action-cta-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-hover);"></span> |
| `--terra-border-action-cta-active` | `var(--terra-color-action-cta-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-active);"></span> |
| `--terra-border-action-cta-disabled` | `var(--terra-color-action-cta-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-disabled);"></span> |
| `--terra-border-action-success-default` | `var(--terra-color-action-success-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-default);"></span> |
| `--terra-border-action-success-hover` | `var(--terra-color-action-success-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-hover);"></span> |
| `--terra-border-action-success-active` | `var(--terra-color-action-success-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-active);"></span> |
| `--terra-border-action-success-disabled` | `var(--terra-color-action-success-disabed)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-disabed);"></span> |
| `--terra-border-action-warning-default` | `var(--terra-color-action-warning-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-default);"></span> |
| `--terra-border-action-warning-hover` | `var(--terra-color-action-warning-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-hover);"></span> |
| `--terra-border-action-warning-active` | `var(--terra-color-action-warning-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-active);"></span> |
| `--terra-border-action-error-default` | `var(--terra-color-action-error-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-default);"></span> |
| `--terra-border-action-error-hover` | `var(--terra-color-action-error-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-hover);"></span> |
| `--terra-border-action-error-active` | `var(--terra-color-action-error-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-active);"></span> |
| `--terra-border-action-error-disabled` | `var(--terra-color-action-error-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-disabled);"></span> |
| `--terra-border-action-info-default` | `var(--terra-color-action-info-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-default);"></span> |
| `--terra-border-action-info-hover` | `var(--terra-color-action-info-hover)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-hover);"></span> |
| `--terra-border-action-info-active` | `var(--terra-color-action-info-active)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-active);"></span> |
| `--terra-border-action-info-disabled` | `var(--terra-color-action-info-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-disabled);"></span> |

