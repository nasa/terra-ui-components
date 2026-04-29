import { css } from 'lit'

export default css`
    :host {
        display: inline-flex;
        align-items: center;
        gap: var(--terra-spacing-x-small, 0.5rem);
    }

    .status-indicator {
        display: inline-flex;
        align-items: center;
        gap: var(--terra-spacing-x-small, 0.5rem);
    }

    .status-indicator__dot {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: var(--terra-border-radius-circle);
        flex-shrink: 0;
    }

    .status-indicator__label {
        font-family: var(--terra-status-indicator-font-family);
        font-size: var(--terra-status-indicator-font-size);
        font-weight: var(--terra-status-indicator-font-weight);
        color: var(--terra-status-indicator-label-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Active variant - Green */
    .status-indicator--active .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-active,
            var(--terra-color-bg-success-bold)
        );
    }

    /* Completed variant - Gray */
    .status-indicator--completed .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-completed,
            var(--terra-color-bg-default-bold)
        );
    }

    /* Testing variant - Orange */
    .status-indicator--testing .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-testing,
            var(--terra-color-bg-warning-bold)
        );
    }

    /* Future variant - Blue */
    .status-indicator--future .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-future,
            var--terra-color-bg-info-bold)
        );
    }

    /* Dark mode support - handled by horizon.css design tokens */
`
