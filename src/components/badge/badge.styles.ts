import { css } from 'lit'

export default css`
    :host {
        display: inline-flex;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: max(12px, 0.75em);
        font-weight: var(--terra-font-weight-semibold);
        letter-spacing: var(--terra-letter-spacing-normal);
        line-height: 1;
        border-radius: var(--terra-border-radius-small);
        border: none;
        white-space: nowrap;
        padding: 0.35em 0.6em;
        user-select: none;
        -webkit-user-select: none;
        cursor: inherit;
    }

    /* Variant modifiers */
    .badge--information {
        background-color: var(--terra-color-bg-info-bold);
        color: var(--terra-text-on-semantic);
    }

    .badge--success {
        background-color: var(--terra-color-bg-success-bold);
        color: var(--terra-text-on-semantic-inverse);
    }

    .badge--neutral {
        background-color: var(--terra-color-bg-default-bold);
        color: var(--terra-text-on-semantic-inverse);
    }

    .badge--warning {
        background-color: var(--terra-color-bg-warning-bold);
        olor: var(--terra-text-on-semantic-inverse);
    }

    .badge--danger {
        background-color: var(--terra-color-bg-error-bold);
        color: var(--terra-text-on-semantic);
    }

    /* Pill modifier */
    .badge--pill {
        border-radius: 999px;
    }

    /* Pulse modifier */
    .badge--pulse {
        animation: pulse 1.5s infinite;
    }

    .badge--pulse.badge--information {
        --pulse-color: var(--terra-color-bg-info-bold);
    }

    .badge--pulse.badge--success {
        --pulse-color: var(--terra-color-bg-success-bold);
    }

    .badge--pulse.badge--neutral {
        --pulse-color: var(--terra-color-bg-default-bold);
    }

    .badge--pulse.badge--warning {
        --pulse-color: var(--terra-color-bg-warning-bold);
    }

    .badge--pulse.badge--danger {
        --pulse-color: var(--terra-color-bg-error-bold);
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 var(--pulse-color);
        }
        70% {
            box-shadow: 0 0 0 0.5rem transparent;
        }
        100% {
            box-shadow: 0 0 0 0 transparent;
        }
    }
`
