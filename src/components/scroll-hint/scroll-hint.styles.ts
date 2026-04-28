import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: fixed;
        bottom: var(--terra-spacing-large, 1.25rem);
        left: var(--terra-spacing-large, 1.25rem);
        z-index: var(--terra-z-index-tooltip, 1000);
    }

    :host([inline]) {
        position: static;
        bottom: auto;
        left: auto;
        z-index: auto;
    }

    .scroll-hint {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-medium, 1rem);
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-small, 0.875rem);
        font-weight: var(--terra-font-weight-semibold, 600);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--terra-scroll-hint-text-color);
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .scroll-hint:hover {
        opacity: 0.8;
    }

    .scroll-hint:focus {
        outline: 2px solid var(--terra-color-nasa-blue);
        outline-offset: 2px;
        border-radius: var(--terra-border-radius-small, 0.125rem);
    }

    .scroll-hint__icon-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
    }

    .scroll-hint__ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 3rem;
        height: 3rem;
        border: 2px dotted var(--terra-scroll-hint-ring-color);
        border-radius: 50%;
        animation: pulse-ring 2s ease-in-out infinite;
    }

    .scroll-hint__icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background-color: var(--terra-scroll-hint-icon-background-color);
        border-radius: 50%;
        z-index: 1;
    }

    .scroll-hint__icon terra-icon {
        color: var(--terra-scroll-hint-icon-color);
        width: 1rem;
        height: 1rem;
    }

    .scroll-hint__text {
        color: var(--terra-scroll-hint-text-color);
        user-select: none;
    }

    /* Dark mode support - handled by horizon.css design tokens */

    /* Pulsing ring animation */
    @keyframes pulse-ring {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    /* Respect reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .scroll-hint__ring {
            animation: none;
        }

        .scroll-hint {
            transition: none;
        }
    }
`
