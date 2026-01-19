import { css } from 'lit'

export default css`
    :host {
        box-sizing: border-box;
        color: #1b1b1b; /* HDS uses this color for body text but does not have a defined color in the HDS palette */
        display: block;
        font-family: var(--terra-font-family--public-sans);
    }

    .login-container {
        background: var(--terra-color-spacesuit-white);
        border-radius: var(--terra-border-radius-large);
        box-shadow: var(--terra-shadow-medium);
        overflow: hidden;
        width: 100%;
        max-width: 420px;
    }

    .login-header {
        background: var(--terra-color-carbon-black);
        padding: var(--terra-spacing-medium);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--terra-spacing-small);
    }

    .login-header > a:first-child {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-small);
        text-decoration: none;
        color: var(--terra-color-spacesuit-white);
    }

    .login-header .help-link {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var(--terra-color-spacesuit-white);
        background-color: var(--terra-color-carbon-40);
        border: 1px solid var(--terra-color-carbon-40);
        border-radius: 50%;
        width: 1.5rem;
        height: 1.5rem;
        transition:
            background-color var(--terra-transition-fast),
            border-color var(--terra-transition-fast);
    }

    .login-header .help-link terra-icon {
        font-size: 0.875em;
    }

    .login-header .help-link:hover,
    .login-header .help-link:focus-visible {
        background-color: var(--terra-color-carbon-50);
        border-color: var(--terra-color-carbon-50);
        color: var(--terra-color-spacesuit-white);
    }

    .login-header .help-link:focus-visible {
        outline: 2px solid var(--terra-color-spacesuit-white);
        outline-offset: 2px;
    }

    .login-header > a:first-child terra-icon {
        width: 40px;
        height: 34px;
    }

    .login-header h1 {
        color: var(--terra-color-spacesuit-white);
        font-size: var(--terra-font-size-medium);
        font-weight: var(--terra-font-weight-normal);
        margin: 0;
        font-family: var(--terra-font-family--public-sans);
    }

    .login-form {
        padding: var(--terra-spacing-large);
    }

    .login-form terra-input {
        display: block;
        margin-bottom: var(--terra-spacing-medium);
    }

    /* Make inputs more compact by reducing internal spacing */
    .login-form terra-input::part(input) {
        padding: var(--terra-spacing-x-small) var(--terra-spacing-small);
        font-size: var(--terra-font-size-small);
    }

    .login-button {
        width: 100%;
    }

    .help-text {
        color: var(--terra-color-carbon-60);
        font-size: var(--terra-font-size-small);
        line-height: var(--terra-line-height-normal);
        margin-block: 0;
    }

    label,
    input {
        display: block;
    }

    input {
        padding-inline: 0.5em;
    }

    terra-button[data-task-status='2']::part(base),
    terra-button[data-task-status='3']::part(base) {
        padding-inline: 0;

        transition-delay: 4s;
        transition-property: padding-inline;
    }

    terra-button[data-task-status='2']::part(label),
    terra-button[data-task-status='3']::part(label) {
        padding-inline: var(--terra-spacing-medium);
    }

    .login-task {
        animation-delay: 4s;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
        animation-name: fade-out;
        animation-timing-function: ease-in;

        transition-behavior: allow-discrete;
    }

    .login-task--pending {
        font-size: 1em;
    }

    .login-task--complete {
        color: var(--terra-color-active-green-tint);
        font-size: 1.8em;
    }

    .login-task--error {
        color: var(--terra-color-international-orange-tint);
        font-size: 1.8em;
    }

    .form-feedback {
        color: var(--terra-color-nasa-red-shade);
        display: block;
        font-size: 0.875em;
        margin-top: var(--terra-spacing-small);
    }

    .form-feedback .link {
        display: inline-block;
        margin-right: var(--terra-spacing-small);
    }

    @keyframes fade-out {
        0% {
            opacity: 1;
            scale: 1;
        }

        50% {
            opacity: 0;
            scale: 1;
        }

        95% {
            opacity: 0;
            scale: 1;
        }

        100% {
            display: none;
            opacity: 0;
            scale: 0;
            font-size: 0;
        }
    }

    /* Dark Mode Styles
     * Dark mode uses CSS variables that change automatically when .terra-theme-dark class
     * is applied or when prefers-color-scheme: dark is active with .terra-prefers-color-scheme
     */
    @media (prefers-color-scheme: dark) {
        .login-container {
            background: var(--terra-color-carbon-10);
        }

        .login-header .help-link {
            background-color: var(--terra-color-carbon-60);
            border-color: var(--terra-color-carbon-60);
        }

        .login-header .help-link:hover,
        .login-header .help-link:focus-visible {
            background-color: var(--terra-color-carbon-50);
            border-color: var(--terra-color-carbon-50);
        }
    }
`
