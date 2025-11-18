---
meta:
    title: HDS Adoption Status
    description: Track the progress of Terra UI Components adoption of Horizon Design System
---

# Horizon Design System Adoption Status

This page tracks the progress of Terra UI Components in adopting the [Horizon Design System (HDS)](https://website.nasa.gov/hds/). Components are marked based on their current implementation status.

## Status Legend

-   ✅ **Fully Supported** - Component fully implements HDS design tokens and guidelines
-   🟡 **In Progress** - Component partially implements HDS, with known gaps
-   ❌ **Not Supported** - Component not yet implemented or not planned

## Elements

| Component                          | Status             | Notes                                                                                            |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| [Avatar](/components/avatar)       | ✅ Fully Supported | Implements HDS avatar guidelines with image, initials, and icon support. Full dark mode support. |
| [Button](/components/button)       | 🟡 In Progress     | Core HDS styles implemented. Some variants may need refinement.                                  |
| [Chip](/components/chip)           | ✅ Fully Supported | Fully implements HDS chip design with dark mode support.                                         |
| [Icon](/components/icon)           | ✅ Fully Supported | Icon system compatible with HDS guidelines.                                                      |
| [Accordion](/components/accordion) | ✅ Fully Supported | Implements HDS accordion patterns with design tokens and dark mode support.                      |

## Components

| Component                              | Status             | Notes                                                                                         |
| -------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| [Alert](/components/alert)             | ✅ Fully Supported | Supports both filled (HDS default) and white appearance variants with full dark mode support. |
| [Combobox](/components/combobox)       | 🟡 In Progress     | Core functionality complete. May need HDS-specific styling refinements.                       |
| [Date Picker](/components/date-picker) | 🟡 In Progress     | Functional but may need HDS design token updates.                                             |
| [Dialog](/components/dialog)           | ✅ Fully Supported | Implements HDS modal patterns with design tokens.                                             |
| [Dropdown](/components/dropdown)       | ✅ Fully Supported | Uses HDS design tokens.                                                                       |
| [Input](/components/input)             | 🟡 In Progress     | Core styles implemented. Some advanced features may need HDS alignment.                       |
| [Loader](/components/loader)           | ✅ Fully Supported | Implements HDS loader patterns with design tokens.                                            |
| [Menu](/components/menu)               | ✅ Fully Supported | Uses HDS design tokens for menu items with dark mode support.                                 |
| [Popup](/components/popup)             | ✅ Fully Supported | Implements HDS popup patterns.                                                                |
| [Skeleton](/components/skeleton)       | ✅ Fully Supported | Implements HDS skeleton loading patterns with design tokens.                                  |
| [Slider](/components/slider)           | 🟡 In Progress     | Functional but may need HDS design token updates.                                             |

## Not Currently Supported

The following HDS components/elements are not currently implemented in Terra UI Components:

| Component | Status           | Reason                                                                                 | Request                                                                                                          |
| --------- | ---------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Caption   | ❌ Not Supported | Doesn't seem to make sense as a component, you can use CSS variables to replicate this | [Request Component](https://github.com/nasa/terra-ui-components/issues/new?title=Component%20Request:%20Caption) |

:::tip
If you need a component that's not listed here or marked as "Not Supported", please [create a GitHub issue](https://github.com/nasa/terra-ui-components/issues/new) to request it.
:::

## Contributing

If you're working on implementing HDS support for a component, please:

1. Use design tokens from `horizon.css` instead of hardcoded values
2. Ensure dark mode support using the provided dark mode tokens
3. Follow HDS accessibility guidelines
4. Update this page when status changes

## Design Token Usage

All components should use design tokens from `horizon.css` for:

-   Colors (use `--terra-color-*` variables)
-   Spacing (use `--terra-spacing-*` variables)
-   Typography (use `--terra-font-*` variables)
-   Border radius (use `--terra-border-radius-*` variables)
-   Shadows (use `--terra-shadow-*` variables)
-   Transitions (use `--terra-transition-*` variables)

Component-specific tokens are also available (e.g., `--terra-chip-*`, `--terra-alert-*`) for fine-grained customization.
