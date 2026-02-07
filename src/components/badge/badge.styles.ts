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
        color: var(--terra-color-spacesuit-white);
    }

    /* Variant modifiers */
    .badge--primary {
        background-color: var(--terra-color-nasa-blue);
    }

    .badge--success {
        background-color: var(--terra-color-success-green);
    }

    .badge--neutral {
        background-color: var(--terra-color-carbon-60);
    }

    .badge--warning {
        background-color: var(--terra-color-international-orange);
    }

    .badge--danger {
        background-color: var(--terra-color-nasa-red);
    }

    /* Pill modifier */
    .badge--pill {
        border-radius: 999px;
    }

    /* Pulse modifier */
    .badge--pulse {
        animation: pulse 1.5s infinite;
    }

    .badge--pulse.badge--primary {
        --pulse-color: var(--terra-color-nasa-blue);
    }

    .badge--pulse.badge--success {
        --pulse-color: var(--terra-color-success-green);
    }

    .badge--pulse.badge--neutral {
        --pulse-color: var(--terra-color-carbon-60);
    }

    .badge--pulse.badge--warning {
        --pulse-color: var(--terra-color-international-orange);
    }

    .badge--pulse.badge--danger {
        --pulse-color: var(--terra-color-nasa-red);
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
