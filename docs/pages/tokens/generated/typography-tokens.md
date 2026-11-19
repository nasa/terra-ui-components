---
meta:
    title: Typography Tokens
    description: Typography tokens are used to create consistent typography styles across the design system. They include font families, font sizes, font weights, letter spacings, and line heights. They use rem units
---

# Typography Tokens

Typography tokens are used to create consistent typography styles across the design system. They include font families, font sizes, font weights, letter spacings, and line heights. They use rem units

### Font Family

Font family tokens define the font families used in the design system. Inter font is used for large display as well as headings. Public Sans is a strong, neutral typeface for interfaces and text. It is used for body text. DM Mono is a monospace font that's perfect typeface for reading numbers and small labels.

| Token                              | Value                       | Preview                                                                                                                  |
| ---------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--terra-font-family--inter`       | `'Inter', sans-serif`       | <div style="font-family: var(--terra-font-family--inter);">The National Aeronautics and Space Administration</div>       |
| `--terra-font-family--public-sans` | `'Public Sans', sans-serif` | <div style="font-family: var(--terra-font-family--public-sans);">The National Aeronautics and Space Administration</div> |
| `--terra-font-family--dm-mono`     | `'DM Mono', monospace`      | <div style="font-family: var(--terra-font-family--dm-mono);">The National Aeronautics and Space Administration</div>     |

### Font Colors

Font color tokens define the colors used for text on neutral backgrounds in the design system. Primary is used for headings. Secondary is used for body text. Tertiary is used for captions and other small text.

| Token                          | Value                          | Preview                                                                                                                                                 |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--terra-font-color-primary`   | `var(--terra-color-carbon-90)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-font-color-primary);"></span>   |
| `--terra-font-color-secondary` | `var(--terra-color-carbon-70)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-font-color-secondary);"></span> |
| `--terra-font-color-tertiary`  | `var(--terra-color-carbon-50)` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:var(--terra-font-color-tertiary);"></span>  |

### Font Sizes

Font size tokens define the sizes used for text in the design system.

| Token                        | Value             | Preview                                                           |
| ---------------------------- | ----------------- | ----------------------------------------------------------------- |
| `--terra-font-size-2x-small` | `0.625rem` (10px) | <div style="font-size: var(--terra-font-size-2x-small);">Aa</div> |
| `--terra-font-size-x-small`  | `0.75rem` (12px)  | <div style="font-size: var(--terra-font-size-x-small);">Aa</div>  |
| `--terra-font-size-small`    | `0.875rem` (14px) | <div style="font-size: var(--terra-font-size-small);">Aa</div>    |
| `--terra-font-size-medium`   | `1rem` (16px)     | <div style="font-size: var(--terra-font-size-medium);">Aa</div>   |
| `--terra-font-size-large`    | `1.25rem` (20px)  | <div style="font-size: var(--terra-font-size-large);">Aa</div>    |
| `--terra-font-size-x-large`  | `1.5rem` (24px)   | <div style="font-size: var(--terra-font-size-x-large);">Aa</div>  |
| `--terra-font-size-2x-large` | `2.25rem` (36px)  | <div style="font-size: var(--terra-font-size-2x-large);">Aa</div> |
| `--terra-font-size-3x-large` | `3rem` (48px)     | <div style="font-size: var(--terra-font-size-3x-large);">Aa</div> |
| `--terra-font-size-4x-large` | `4.5rem` (72px)   | <div style="font-size: var(--terra-font-size-4x-large);">Aa</div> |

### Font Weights

Font weight tokens define the weights used for text in the design system.

| Token                          | Value | Preview                                                                                                              |
| ------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `--terra-font-weight-light`    | `300` | <div style="font-weight: var(--terra-font-weight-light);">The National Aeronautics and Space Administration</div>    |
| `--terra-font-weight-normal`   | `400` | <div style="font-weight: var(--terra-font-weight-normal);">The National Aeronautics and Space Administration</div>   |
| `--terra-font-weight-semibold` | `600` | <div style="font-weight: var(--terra-font-weight-semibold);">The National Aeronautics and Space Administration</div> |
| `--terra-font-weight-bold`     | `700` | <div style="font-weight: var(--terra-font-weight-bold);">The National Aeronautics and Space Administration</div>     |

### Letter Spacing

Letter spacing tokens define the spacing between characters in the design system.

| Token                           | Value      | Preview                                                                                                                  |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--terra-letter-spacing-denser` | `-0.03em`  | <div style="letter-spacing: var(--terra-letter-spacing-denser);">The National Aeronautics and Space Administration</div> |
| `--terra-letter-spacing-dense`  | `-0.015em` | <div style="letter-spacing: var(--terra-letter-spacing-dense);">The National Aeronautics and Space Administration</div>  |
| `--terra-letter-spacing-normal` | `normal`   | <div style="letter-spacing: var(--terra-letter-spacing-normal);">The National Aeronautics and Space Administration</div> |
| `--terra-letter-spacing-loose`  | `0.075em`  | <div style="letter-spacing: var(--terra-letter-spacing-loose);">The National Aeronautics and Space Administration</div>  |
| `--terra-letter-spacing-looser` | `0.15em`   | <div style="letter-spacing: var(--terra-letter-spacing-looser);">The National Aeronautics and Space Administration</div> |

### Line Heights

Line height tokens define the spacing between lines of text in the design system.

| Token                        | Value | Preview                                                                                                            |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------ |
| `--terra-line-height-denser` | `1`   | <div style="line-height: var(--terra-line-height-denser);">The National Aeronautics and Space Administration</div> |
| `--terra-line-height-dense`  | `1.4` | <div style="line-height: var(--terra-line-height-dense);">The National Aeronautics and Space Administration</div>  |
| `--terra-line-height-normal` | `1.8` | <div style="line-height: var(--terra-line-height-normal);">The National Aeronautics and Space Administration</div> |
| `--terra-line-height-loose`  | `2.2` | <div style="line-height: var(--terra-line-height-loose);">The National Aeronautics and Space Administration</div>  |
| `--terra-line-height-looser` | `2.6` | <div style="line-height: var(--terra-line-height-looser);">The National Aeronautics and Space Administration</div> |
