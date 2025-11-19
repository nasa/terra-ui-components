import { css } from 'lit'

export default css`
    :host {
        --terra-status-indicator-font-family: var(--terra-font-family--inter);
        --terra-status-indicator-font-size: var(--terra-font-size-small);
        --terra-status-indicator-font-weight: var(--terra-font-weight-normal);
        --terra-status-indicator-label-color: var(--terra-color-carbon-90);

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
            var(--terra-color-active-green)
        );
    }

    /* Completed variant - Gray */
    .status-indicator--completed .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-completed,
            var(--terra-color-carbon-40)
        );
    }

    /* Testing variant - Orange */
    .status-indicator--testing .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-testing,
            var(--terra-color-international-orange)
        );
    }

    /* Future variant - Blue */
    .status-indicator--future .status-indicator__dot {
        background-color: var(
            --terra-status-indicator-dot-color-future,
            var(--terra-color-nasa-blue)
        );
    }

    /* Dark mode support - automatic via system preference (when dark prop is not set) */
    @media (prefers-color-scheme: dark) {
        :host:not([dark]) {
            --terra-status-indicator-label-color: var(--terra-color-carbon-60);
        }
    }

    /* Dark mode support - forced via dark prop (takes precedence over system preference) */
    :host([dark]) {
        --terra-status-indicator-label-color: var(--terra-color-carbon-60);
    }
`
