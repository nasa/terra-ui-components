import { css } from 'lit'

export default css`
    :host {
        box-sizing: border-box;
        color: #1b1b1b; /* HDS uses this color for body text but does not have a defined color in the HDS palette */
        display: block;
        font-family: var(--terra-font-family--public-sans);
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
`
