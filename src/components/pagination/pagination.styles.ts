import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .pagination {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-medium, 1rem);
    }

    .pagination--centered {
        justify-content: center;
    }

    .pagination--left {
        justify-content: space-between;
    }

    .pagination--simple {
        justify-content: center;
    }

    .pagination__nav {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-medium, 1rem);
    }

    .pagination__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--terra-spacing-2x-small, 0.25rem);
        min-width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: none;
        border-radius: 0;
        color: var(--terra-pagination-button-color);
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-small, 0.875rem);
        font-weight: var(--terra-font-weight-normal);
        line-height: 1.5;
        cursor: pointer;
        transition: color var(--terra-transition-fast);
    }

    /* Circular buttons for prev/next - only for icon-only buttons (full/centered variants) */
    /* Need higher specificity to override base button styles */
    :host:not([variant='simple']) .pagination__button.pagination__button--prev,
    :host:not([variant='simple']) .pagination__button.pagination__button--next {
        width: 2rem !important;
        height: 2rem !important;
        min-width: 2rem !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 50% !important;
        background-color: var(
            --terra-pagination-icon-button-background-color
        ) !important;
        border: 1px solid var(--terra-pagination-icon-button-border-color) !important;
        color: var(--terra-pagination-button-color) !important;
        box-sizing: border-box !important;
    }

    /* Hover styles for circular icon buttons only */
    :host:not([variant='simple']) .pagination__button--prev:hover:not(:disabled),
    :host:not([variant='simple']) .pagination__button--next:hover:not(:disabled) {
        background-color: var(--terra-pagination-icon-button-background-color-hover);
        border-color: var(--terra-pagination-icon-button-border-color-hover);
    }

    .pagination__button:hover:not(:disabled) {
        color: var(--terra-pagination-button-color-hover);
    }

    .pagination__button:focus-visible {
        outline: 2px solid var(--terra-color-nasa-blue);
        outline-offset: 2px;
    }

    .pagination__button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .pagination__button:disabled:hover {
        color: var(--terra-pagination-button-color);
    }

    /* Current page button should not be dimmed even though it's disabled */
    .pagination__button--current:disabled {
        opacity: 1;
        cursor: default;
    }

    /* Disabled icon buttons should have lighter appearance */
    :host:not([variant='simple']) .pagination__button--prev:disabled,
    :host:not([variant='simple']) .pagination__button--next:disabled {
        background-color: var(
            --terra-pagination-icon-button-background-color-disabled
        );
        border-color: var(--terra-pagination-icon-button-border-color-disabled);
        opacity: 1;
    }

    :host:not([variant='simple']) .pagination__button--prev:disabled terra-icon,
    :host:not([variant='simple']) .pagination__button--next:disabled terra-icon {
        color: var(--terra-pagination-icon-button-icon-color-disabled);
    }

    .pagination__button--current {
        color: var(--terra-pagination-button-color);
        font-weight: var(--terra-font-weight-bold);
        cursor: default;
    }

    .pagination__button--current:hover {
        color: var(--terra-pagination-button-color);
    }

    .pagination__button--current::after {
        content: '';
        position: absolute;
        bottom: -0.25rem;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(
            --terra-pagination-button-color-current,
            var(--terra-color-carbon-black)
        );
    }

    /* Ensure page buttons have no extra spacing */
    .pagination__button--page:not(.pagination__button--current) {
        color: var(--terra-pagination-button-color);
    }

    .pagination__button--page {
        font-weight: var(--terra-font-weight-bold);
        position: relative;
        padding: 0 5px;
        margin: 0;
    }

    .pagination__button-text {
        display: inline-block;
    }

    .pagination__button terra-icon {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
    }

    /* Icon styling for circular icon-only buttons */
    :host:not([variant='simple']) .pagination__button--prev terra-icon,
    :host:not([variant='simple']) .pagination__button--next terra-icon {
        width: 0.875rem;
        height: 0.875rem;
        color: inherit;
    }

    .pagination__ellipsis {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        color: var(--terra-pagination-button-color);
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-small, 0.875rem);
        line-height: 1.5;
    }

    .pagination__slot {
        display: flex;
        align-items: center;
    }

    /* Dark mode support - handled by horizon.css design tokens */
`
