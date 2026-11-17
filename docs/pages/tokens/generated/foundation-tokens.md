---
meta:
    title: Foundation Tokens
    description: The Foundation token layer is where we select which <a href="/tokens/generated/primitive-tokens">Primitive colors</a> will be used for the theme, and define the color usage, such as which colors will be used for surfaces, text, borders, etc. These tokens are the building blocks for all other tokens in the system. The Foundation tokens are organized by color role (e.g. surface, text, border). The Foundation tokens reference the <a href="/tokens/generated/primitive-tokens">Primitives tokens</a> directly, which allows for easy updates to the color palettes without having to update every single token in the system. The <a href="/tokens/generated/semantic-tokens">Semantic</a> level UI role tokens are build on the Foundation-level tokens (rather than primitives) for the most-part so that changes to the theme Foundation are reflected in the <a href="/tokens/generated/semantic-tokens">Semantic tokens</a>.
---

# Foundation Tokens

The Foundation token layer is where we select which <a href="/tokens/generated/primitive-tokens">Primitive colors</a> will be used for the theme, and define the color usage, such as which colors will be used for surfaces, text, borders, etc. These tokens are the building blocks for all other tokens in the system. The Foundation tokens are organized by color role (e.g. surface, text, border). The Foundation tokens reference the <a href="/tokens/generated/primitive-tokens">Primitives tokens</a> directly, which allows for easy updates to the color palettes without having to update every single token in the system. The <a href="/tokens/generated/semantic-tokens">Semantic</a> level UI role tokens are build on the Foundation-level tokens (rather than primitives) for the most-part so that changes to the theme Foundation are reflected in the <a href="/tokens/generated/semantic-tokens">Semantic tokens</a>.

## Surface Color Tokens

Surface color tokens are used for backgrounds and surfaces such as pages, side bars, dialog boxes, cards, buttons, inputs, popovers, tooltips, etc.

### Neutral Surface Colors

Neutral Surface color tokens are used for backgrounds and surfaces such as pages, side bars, dialog boxes, cards, inputs, popovers, tooltips, etc. They provide a range of light to dark neutrals that can be used for layering content, creating depth, and ensuring appropriate contrast with text and other elements.

| Token                                        | Value                            | Preview                                                                                                                                              |
| -------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-bg-surface-neutral-base`      | `var(--terra-color-neutral-0)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span>   |
| `--terra-color-bg-surface-neutral-primary`   | `var(--terra-color-neutral-50)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-50);"></span>  |
| `--terra-color-bg-surface-neutral-secondary` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-color-bg-surface-neutral-tertiary`  | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |

### Inverse Neutral Surface Colors

Neutral Inverse Surface color tokens are for special cases and local contrast needs of side bars, dialog boxes, cards, inputs, popovers, tooltips, etc. They let you swap the Neutral Surface colors so content remains legible. Use sparingly as needed, only when a surface sits on top of something with the opposite polarity. If you only had neutral background tokens, you’d have mismatched contrast.

| Token                                                | Value                            | Preview                                                                                                                                              |
| ---------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-bg-surface-neutral-inverse-primary`   | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-color-bg-surface-neutral-inverse-secondary` | `var(--terra-color-neutral-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-800);"></span> |
| `--terra-color-bg-surface-neutral-inverse-tertiary`  | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |

### Neutral Surface Interactive Colors

Neutral Surface Interactive states for neutral surfaces (base, primary) that are used for inputs fields and form controls like checkboxes, radio buttons, toggles and sliders.

| Token                                           | Value                            | Preview                                                                                                                                              |
| ----------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-bg-surface-interactive-default`  | `var(--terra-color-neutral-0)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span>   |
| `--terra-color-bg-surface-interactive-hover`    | `var(--terra-color-neutral-50)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-50);"></span>  |
| `--terra-color-bg-surface-interactive-disabled` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-color-bg-surface-interactive-active`   | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |

### Brand Surface Colors

Brand surfacecolors to be used sparingly for the background surfaces of header and footer regions, hero sections, and splash pages.

| Token                                      | Value                          | Preview                                                                                                                                            |
| ------------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-bg-surface-brand-primary`   | `var(--terra-color-nasa-blue)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-nasa-blue);"></span> |
| `--terra-color-bg-surface-brand-secondary` | `var(--terra-color-blue-200)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-200);"></span>  |
| `--terra-color-bg-surface-brand-tertiary`  | `var(--terra-color-blue-50)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-50);"></span>   |

### Brand Selected Surface Interactive Colors

Brand Surface colors are used for selected states for input field backgrounds and surfaces, tabs, and form controls like checkboxes, radio buttons, toggles, and sliders. These use the brand color and have interactions.

| Token                                              | Value                         | Preview                                                                                                                                           |
| -------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-bg-surface-brand-selected-default`  | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-color-bg-surface-brand-selected-hover`    | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-color-bg-surface-brand-selected-active`   | `var(--terra-color-blue-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-800);"></span> |
| `--terra-color-bg-surface-brand-selected-disabled` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |

### Semantic Background Colors

Semantic background surfaces that appear or change to give feedback or status. Use subtle when you want the content message (text/icon) to carry the meaning, and the background only reinforces it without stealing focus (banners / alerts, toasts, tags). Use bold when the background itself must demand attention and stand apart from surrounding UI (critical blocking alerts, destructive confirmation dialogs, system critical toasts). DO NOT use the bold tokens for action-focused elements like buttons; instead use the Action backgrounds which have color variants for hover and disabled states.

| Token                             | Value                            | Preview                                                                                                                                              |
| --------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-bg-default-subtle` | `var(--terra-color-neutral-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span> |
| `--terra-color-bg-default-bold`   | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-color-bg-success-subtle` | `var(--terra-color-green-100)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-100);"></span>   |
| `--terra-color-bg-success-bold`   | `var(--terra-color-green-600)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-600);"></span>   |
| `--terra-color-bg-warning-subtle` | `var(--terra-color-orange-100)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-100);"></span>  |
| `--terra-color-bg-warning-bold`   | `var(--terra-color-orange-500)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-500);"></span>  |
| `--terra-color-bg-error-subtle`   | `var(--terra-color-red-100)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-100);"></span>     |
| `--terra-color-bg-error-bold`     | `var(--terra-color-red-600)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-600);"></span>     |
| `--terra-color-bg-info-subtle`    | `var(--terra-color-blue-100)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-100);"></span>    |
| `--terra-color-bg-info-bold`      | `var(--terra-color-blue-500)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span>    |

## Action Backgrounds With Interactive States

Background colors for interactive elements that have states, such as buttons. Use the default, hover, active, and disabled variants to provide visual feedback for each state. The default shade can be used for badges, chips, pills, etc where interactive states are not needed.

### Brand Action Background Colors

Background colors for action-focused elements such as buttons. The Primary action uses the brand color for the main action buttons throughout the UI. Secondary actions are for less prominent actions like “Cancel” buttons. “Call to action” (CTA) actions direct user attention to a main goal. Use sparingly. Use the default, hover, active, and disabled variants to provide visual feedback for each state.

| Token                                     | Value                               | Preview                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-action-primary-default`    | `var(--terra-color-blue-500)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span>       |
| `--terra-color-action-primary-hover`      | `var(--terra-color-blue-600)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span>       |
| `--terra-color-action-primary-active`     | `var(--terra-color-blue-700)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span>       |
| `--terra-color-action-primary-disabled`   | `var(--terra-color-blue-100)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-100);"></span>       |
| `--terra-color-action-secondary-default`  | `var(--terra-color-neutral-200)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-200);"></span>    |
| `--terra-color-action-secondary-hover`    | `var(--terra-color-neutral-300)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span>    |
| `--terra-color-action-secondary-active`   | `var(--terra-color-neutral-400)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span>    |
| `--terra-color-action-secondary-disabled` | `var(--terra-color-neutral-100)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span>    |
| `--terra-color-action-cta-default`        | `var(--terra-color-chartreuse-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-500);"></span> |
| `--terra-color-action-cta-hover`          | `var(--terra-color-chartreuse-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-600);"></span> |
| `--terra-color-action-cta-active`         | `var(--terra-color-chartreuse-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-700);"></span> |
| `--terra-color-action-cta-disabled`       | `var(--terra-color-chartreuse-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-chartreuse-100);"></span> |

### Semantic Action Background Colors

Semantic background colors for action-focused elements such as buttons. Semantic colors communicate the meaning of an action. Use the default, hover, active, and disabled variants to provide visual feedback for each state.

| Token                                   | Value                           | Preview                                                                                                                                             |
| --------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-color-action-success-default`  | `var(--terra-color-green-500)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-500);"></span>  |
| `--terra-color-action-success-hover`    | `var(--terra-color-green-600)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-600);"></span>  |
| `--terra-color-action-success-active`   | `var(--terra-color-green-700)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-700);"></span>  |
| `--terra-color-action-success-disabed`  | `var(--terra-color-green-100)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-100);"></span>  |
| `--terra-color-action-warning-default`  | `var(--terra-color-orange-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-500);"></span> |
| `--terra-color-action-warning-hover`    | `var(--terra-color-orange-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-600);"></span> |
| `--terra-color-action-warning-active`   | `var(--terra-color-orange-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-700);"></span> |
| `--terra-color-action-warning-disabled` | `var(--terra-color-orange-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-100);"></span> |
| `--terra-color-action-error-default`    | `var(--terra-color-red-600)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-600);"></span>    |
| `--terra-color-action-error-hover`      | `var(--terra-color-red-700)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-700);"></span>    |
| `--terra-color-action-error-active`     | `var(--terra-color-red-800)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-800);"></span>    |
| `--terra-color-action-error-disabled`   | `var(--terra-color-red-100)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-100);"></span>    |
| `--terra-color-action-info-default`     | `var(--terra-color-blue-500)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span>   |
| `--terra-color-action-info-hover`       | `var(--terra-color-blue-600)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span>   |
| `--terra-color-action-info-active`      | `var(--terra-color-blue-700)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span>   |
| `--terra-color-action-info-disabled`    | `var(--terra-color-blue-100)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-100);"></span>   |

## Text Color Tokens

Text color tokens define the colors used for text on various surfaces. Text and icon colors variants are defined with the intended use for headings, body text, captions in content areas; as well as use on buttons, banners, toasts, tags, and other UI element surfaces. WCAG rules do not require every text token in a design system to be AA compliant. The only requirement is you must not use non-compliant text for content that users must read. Some combinations such as tertiary text and disabled text don’t meet WCAG contrast standard, but the low contrast pairing is useful for aesthetic subtle hints and disabled states. WCGA AA is the standard most digital products are expected to meet.

### Text Colors On Neutral Surfaces

Text colors on neutral surfaces define the colors used for text on light backgrounds. The primary, secondary, and tertiary variants help establish a clear visual hierarchy.

| Token                    | Value                            | Preview                                                                                                                                              |
| ------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-text-primary`   | `var(--terra-color-neutral-900)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span> |
| `--terra-text-secondary` | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |
| `--terra-text-tertiary`  | `var(--terra-color-neutral-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span> |

### Inverse Text Colors On Inverse Neutral Surfaces

Inverse text colors on inverse neutral surfaces define the colors used for text on dark backgrounds. The primary, secondary, and tertiary variants help establish a clear visual hierarchy.

| Token                            | Value                            | Preview                                                                                                                                              |
| -------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-text-primary-inverse`   | `var(--terra-color-neutral-0)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-0);"></span>   |
| `--terra-text-secondary-inverse` | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-text-tertiary-inverse`  | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |

### Text Link Colors On Neutral Surfaces

Text link colors for use on primary, secondary, and tertiary neutral surfaces define the colors used for links on light backgrounds.

| Token                                    | Value                                                          | Preview                                                                                                                                                                            |
| ---------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-text-link-default`              | `var(--terra-color-blue-functional-link-default)`              | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-default);"></span>              |
| `--terra-text-link-hover`                | `var(--terra-color-blue-functional-link-hover)`                | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-hover);"></span>                |
| `--terra-text-link-on-secondary-default` | `var(--terra-color-blue-functional-link-on-secondary-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-on-secondary-default);"></span> |
| `--terra-text-link-on-secondary-hover`   | `var(--terra-color-blue-functional-link-on-secondary-hover)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-on-secondary-hover);"></span>   |
| `--terra-text-link-on-tertiary-default`  | `var(--terra-color-blue-functional-link-on-tertiary-default)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-on-tertiary-default);"></span>  |
| `--terra-text-link-on-tertiary-hover`    | `var(--terra-color-blue-functional-link-on-tertiary-hover)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-on-tertiary-hover);"></span>    |

### Inverse Text Link Colors On Inverse Neutral Surfaces

Inverse text link colors for use on inverse primary, secondary, and tertiary neutral surfaces, define the colors used for links on dark backgrounds.

| Token                                            | Value                                                                  | Preview                                                                                                                                                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--terra-text-link-inverse-default`              | `var(--terra-color-blue-functional-link-inverse-default)`              | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-inverse-default);"></span>              |
| `--terra-text-link-inverse-hover`                | `var(--terra-color-blue-functional-link-inverse-hover)`                | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-inverse-hover);"></span>                |
| `--terra-text-link-inverse-on-secondary-default` | `var(--terra-color-blue-functional-link-inverse-on-secondary-default)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-inverse-on-secondary-default);"></span> |
| `--terra-text-link-inverse-on-secondary-hover`   | `var(--terra-color-blue-functional-link-inverse-on-secondary-hover)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-inverse-on-secondary-hover);"></span>   |
| `--terra-text-link-inverse-on-tertiary-default`  | `var(--terra-color-blue-functional-link-inverse-on-tertiary-default)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-inverse-on-tertiary-default);"></span>  |
| `--terra-text-link-inverse-on-tertiary-hover`    | `var(--terra-color-blue-functional-link-inverse-on-tertiary-hover)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-functional-link-inverse-on-tertiary-hover);"></span>    |

### Brand Text Colors On Brand And Neutral Surfaces

Brand text colors are used for non-link text. They define the text colors used on light, dark and brand backgrounds.

| Token                                     | Value                         | Preview                                                                                                                                           |
| ----------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-text-brand-on-brand-primary`     | `var(--terra-color-white)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-white);"></span>    |
| `--terra-text-brand-on-brand-inverse`     | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-text-brand-on-primary`           | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-text-brand-on-secondary`         | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-text-brand-on-tertiary`          | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-text-brand-on-primary-inverse`   | `var(--terra-color-blue-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-400);"></span> |
| `--terra-text-brand-on-secondary-inverse` | `var(--terra-color-blue-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-300);"></span> |
| `--terra-text-brand-on-tertiary-inverse`  | `var(--terra-color-blue-200)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-200);"></span> |

### Text Colors On Neutral Interactive Surfaces

Text colors for use on elements such as menus, tabs, combo boxes, and selection lists which have interactive surfaces. These tokens define the colors used for text in different interactive states.

| Token                                     | Value                              | Preview                                                                                                                                                |
| ----------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--terra-text-interactive-default`        | `var(--terra-color-neutral-700)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span>   |
| `--terra-text-interactive-hover`          | `var(--terra-color-neutral-900)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span>   |
| `--terra-text-interactive-active`         | `var(--terra-color-neutral-900)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-900);"></span>   |
| `--terra-text-interactive-disabled`       | `var(--terra-color-neutral-500)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span>   |
| `--terra-text-interactive-selected`       | `var(--terra-color-neutral-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-white);"></span> |
| `--terra-text-interactive-brand-selected` | `var(--terra-color-blue-500)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span>      |

### Text Colors On Semantic Surfaces

Text colors for use on semantic surfaces define the colors used for text on success, warning, error, information and default surfaces. Semantic surfaces have subtle and bold variants. On the subtle backgrounds, use the on-success, on-warning, on-error, on-info, and on-default tokens. On the bold backgrounds, use the on-semantic and on-semantic-inverse tokens.

| Token                              | Value                              | Preview                                                                                                                                                |
| ---------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--terra-text-on-success`          | `var(--terra-color-green-900)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-900);"></span>     |
| `--terra-text-on-warning`          | `var(--terra-color-orange-900)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-900);"></span>    |
| `--terra-text-on-error`            | `var(--terra-color-red-900)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-900);"></span>       |
| `--terra-text-on-info`             | `var(--terra-color-blue-800)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-800);"></span>      |
| `--terra-text-on-default`          | `var(--terra-color-neutral-700)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span>   |
| `--terra-text-on-semantic`         | `var(--terra-color-neutral-white)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-white);"></span> |
| `--terra-text-on-semantic-inverse` | `var(--terra-color-neutral-black)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-black);"></span> |

### Text Colors On Action Surfaces

Text colors for use on action surfaces define the colors used for text on primary, secondary, CTA, success, warning, error and information action surfaces. The "on-action" text is used on the default and hover state action backgrounds. The "on-action-disabled" text is used on all the disabled state action backgrounds. All "on-action" colors need to pass at least WCAG AA compliance which is acceptable since text size tends to be larger on actions. The "on-action-disabled" color doesn’t need WCAG compliance since it should be recognizably different.

| Token                              | Value                                   | Preview                                                                                                                                                     |
| ---------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-text-on-action-primary`   | `var(--terra-text-on-semantic)`         | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span>         |
| `--terra-text-on-action-secondary` | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-cta`       | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-success`   | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-warning`   | `var(--terra-text-on-semantic-inverse)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic-inverse);"></span> |
| `--terra-text-on-action-error`     | `var(--terra-text-on-semantic)`         | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span>         |
| `--terra-text-on-action-info`      | `var(--terra-text-on-semantic)`         | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-text-on-semantic);"></span>         |
| `--terra-text-on-action-disabled`  | `var(--terra-color-neutral-400)`        | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span>        |

## Border Color Tokens

Border color tokens define the colors used for borders on neutral, neutral interactive, brand selected and semantic surfaces. Borders support function and hierarchy by dividing or separating surfaces (cards, sections, containers), indicating interactive states (focus, hover, error), and reinforcing semantic meaning (error outlines, success banners). Borders are perceived in relation to their inner fill color, NOT the canvas. It is not necessary to specify a border variant for every single background in your system. Borders serve a few specific roles, and those can usually be covered by a small set of tokens.

### Border Colors For Neutral Surfaces

Use for decorative borders (like light dividers) on neutral surfaces. Light is good forsubtle dividers (table row separators, etc). Use Default for standard containers (dialog, card borders). Use Strong for stronger separation (panels, sidebars).

| Token                            | Value                            | Preview                                                                                                                                              |
| -------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-border-neutral-light`   | `var(--terra-color-neutral-100)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-100);"></span> |
| `--terra-border-neutral-default` | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-border-neutral-strong`  | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |

### Border Colors For Neutral Inverse Surfaces

Use for the neutral inverse borders on the neutral inverse surfaces. Light is good forsubtle dividers (table row separators, etc). Use Default for standard containers (dialog, card borders). Use Strong for stronger separation (panels, sidebars).

| Token                                    | Value                            | Preview                                                                                                                                              |
| ---------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-border-neutral-inverse-light`   | `var(--terra-color-neutral-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-700);"></span> |
| `--terra-border-neutral-inverse-default` | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-border-neutral-inverse-strong`  | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |

### Border Colors For Neutral Interactive Surfaces

Use for borders on interactive elements with neutral surfaces such as input fields, input controls like radio buttons, check boxes, toggles, and sliders. Hover is used for the hover state, disabled for the disabled state, active for the active state, and focus-ring for the focus ring.

| Token                                   | Value                            | Preview                                                                                                                                              |
| --------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-border-interactive-hover`      | `var(--terra-color-neutral-400)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-400);"></span> |
| `--terra-border-interactive-disabled`   | `var(--terra-color-neutral-300)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-300);"></span> |
| `--terra-border-interactive-active`     | `var(--terra-color-neutral-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-neutral-500);"></span> |
| `--terra-border-interactive-focus-ring` | `var(--terra-color-blue-500)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span>    |

### Border Colors For Interactive Brand Selected Surfaces

Use these borders on brand input control surfaces that are selected such as toggle switches, sliders, radio buttons, check boxes.

| Token                                    | Value                         | Preview                                                                                                                                           |
| ---------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-border-brand-selected-default`  | `var(--terra-color-blue-500)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-500);"></span> |
| `--terra-border-brand-selected-hover`    | `var(--terra-color-blue-600)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-600);"></span> |
| `--terra-border-brand-selected-active`   | `var(--terra-color-blue-800)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-800);"></span> |
| `--terra-border-brand-selected-disabled` | `var(--terra-color-blue-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span> |

### Border Colors For Semantic Surfaces

Use semantic borders (Success, Warning, Error, Info) paired with subtle backgrounds to reinforce the meaning. Borders that communicate meaning (e.g., input error states, focus rings) must meet 3:1 against their adjacent background. The bold variants of sematic backgrounds do not need unique borders because the high-contrast fill conveys the meaning.

| Token                    | Value                           | Preview                                                                                                                                             |
| ------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-border-success` | `var(--terra-color-green-800)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-green-800);"></span>  |
| `--terra-border-warning` | `var(--terra-color-orange-700)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-orange-700);"></span> |
| `--terra-border-error`   | `var(--terra-color-red-700)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-red-700);"></span>    |
| `--terra-border-info`    | `var(--terra-color-blue-700)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-blue-700);"></span>   |

### Border Colors For Action Surfaces

Use for borders on action elements such as buttons and links. Action backgrounds such as buttons have a high-contrast fill so the “meaning” is communicated by the color itself. Borders here are used for structure and states rather than meaning. Use either no borders or neutral borders (Default, Strong, Disabled) for states. We use border colors that match the action backgrounds, so borders are not apparent.

| Token                                      | Value                                          | Preview                                                                                                                                                            |
| ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--terra-border-action-secondary-default`  | `var(--terra-color-action-secondary-default)`  | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-secondary-default);"></span>  |
| `--terra-border-action-secondary-hover`    | `var(--terra-color-action-secondary-hover)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-secondary-hover);"></span>    |
| `--terra-border-action-secondary-active`   | `var(--terra-color-action-secondary-active)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-secondary-active);"></span>   |
| `--terra-border-action-secondary-disabled` | `var(--terra-color-action-secondary-disabled)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-secondary-disabled);"></span> |
| `--terra-border-action-primary-default`    | `var(--terra-color-action-primary-default)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-default);"></span>    |
| `--terra-border-action-primary-hover`      | `var(--terra-color-action-primary-hover)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-hover);"></span>      |
| `--terra-border-action-primary-active`     | `var(--terra-color-action-primary-active)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-active);"></span>     |
| `--terra-border-action-primary-disabled`   | `var(--terra-color-action-primary-disabled)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-primary-disabled);"></span>   |
| `--terra-border-action-cta-default`        | `var(--terra-color-action-cta-default)`        | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-default);"></span>        |
| `--terra-border-action-cta-hover`          | `var(--terra-color-action-cta-hover)`          | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-hover);"></span>          |
| `--terra-border-action-cta-active`         | `var(--terra-color-action-cta-active)`         | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-active);"></span>         |
| `--terra-border-action-cta-disabled`       | `var(--terra-color-action-cta-disabled)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-cta-disabled);"></span>       |
| `--terra-border-action-success-default`    | `var(--terra-color-action-success-default)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-default);"></span>    |
| `--terra-border-action-success-hover`      | `var(--terra-color-action-success-hover)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-hover);"></span>      |
| `--terra-border-action-success-active`     | `var(--terra-color-action-success-active)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-active);"></span>     |
| `--terra-border-action-success-disabled`   | `var(--terra-color-action-success-disabed)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-success-disabed);"></span>    |
| `--terra-border-action-warning-default`    | `var(--terra-color-action-warning-default)`    | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-default);"></span>    |
| `--terra-border-action-warning-hover`      | `var(--terra-color-action-warning-hover)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-hover);"></span>      |
| `--terra-border-action-warning-active`     | `var(--terra-color-action-warning-active)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-active);"></span>     |
| `--terra-border-action-warning-disabled`   | `var(--terra-color-action-warning-disabled)`   | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-warning-disabled);"></span>   |
| `--terra-border-action-error-default`      | `var(--terra-color-action-error-default)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-default);"></span>      |
| `--terra-border-action-error-hover`        | `var(--terra-color-action-error-hover)`        | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-hover);"></span>        |
| `--terra-border-action-error-active`       | `var(--terra-color-action-error-active)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-active);"></span>       |
| `--terra-border-action-error-disabled`     | `var(--terra-color-action-error-disabled)`     | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-error-disabled);"></span>     |
| `--terra-border-action-info-default`       | `var(--terra-color-action-info-default)`       | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-default);"></span>       |
| `--terra-border-action-info-hover`         | `var(--terra-color-action-info-hover)`         | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-hover);"></span>         |
| `--terra-border-action-info-active`        | `var(--terra-color-action-info-active)`        | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-active);"></span>        |
| `--terra-border-action-info-disabled`      | `var(--terra-color-action-info-disabled)`      | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-color-action-info-disabled);"></span>      |
