import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
    }

    :host([stack]) {
        display: block;
    }

    .tag {
        display: inline-flex;
        align-items: center;
        gap: var(--terra-spacing-x-small, 0.5rem);
        font-family: var(--terra-tag-font-family);
        font-size: var(--terra-tag-font-size-medium);
        font-weight: var(--terra-tag-font-weight);
        color: var(--terra-tag-color);
        background-color: var(--terra-tag-background-color);
        text-decoration: none;
        white-space: nowrap;
    }

    .tag__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: var(--terra-border-radius-circle);
        border: 1px solid var(--terra-tag-icon-border-color);
        background-color: transparent;
    }

    /* Icon sizes */
    .tag__icon--small {
        width: var(--terra-tag-icon-size-small);
        height: var(--terra-tag-icon-size-small);
    }

    .tag__icon--small terra-icon {
        width: var(--terra-tag-icon-inner-size-small);
        height: var(--terra-tag-icon-inner-size-small);
    }

    .tag__icon--medium {
        width: var(--terra-tag-icon-size-medium);
        height: var(--terra-tag-icon-size-medium);
    }

    .tag__icon--medium terra-icon {
        width: var(--terra-tag-icon-inner-size-medium);
        height: var(--terra-tag-icon-inner-size-medium);
    }

    .tag__icon--large {
        width: var(--terra-tag-icon-size-large);
        height: var(--terra-tag-icon-size-large);
    }

    .tag__icon--large terra-icon {
        width: var(--terra-tag-icon-inner-size-large);
        height: var(--terra-tag-icon-inner-size-large);
    }

    .tag__label {
        display: inline-block;
    }

    /* Size variants */
    .tag--small {
        font-size: var(--terra-tag-font-size-small);
    }

    .tag--medium {
        font-size: var(--terra-tag-font-size-medium);
    }

    .tag--large {
        font-size: var(--terra-tag-font-size-large);
    }

    /* Content Tag Variant */
    .tag--content {
        /* Uses default tag colors from horizon.css */
    }

    /* Topic Tag Variant */
    .tag--topic {
        border: 1px solid var(--terra-tag-border-color);
        border-radius: var(--terra-border-radius-medium, 0.25rem);
        cursor: pointer;
        transition:
            border-color 0.15s ease,
            background-color 0.15s ease;
    }

    /* Topic tag padding by size */
    .tag--topic.tag--small {
        padding: var(--terra-tag-padding-small);
    }

    .tag--topic.tag--medium {
        padding: var(--terra-tag-padding-medium);
    }

    .tag--topic.tag--large {
        padding: var(--terra-tag-padding-large);
    }

    .tag--topic:hover {
        border-color: var(--terra-tag-border-color-hover);
        background-color: var(--terra-tag-background-color-hover);
        text-decoration: none;
    }

    .tag--topic:focus {
        outline: 2px solid var(--terra-color-nasa-blue);
        outline-offset: 2px;
    }

    /* Urgent Label Variant */
    .tag--urgent {
        color: var(--terra-tag-urgent-color);
        background-color: var(--terra-tag-urgent-background-color);
        font-weight: var(--terra-tag-font-weight-urgent);
        border-radius: var(--terra-border-radius-small, 0.125rem);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Urgent label padding by size */
    .tag--urgent.tag--small {
        padding: var(--terra-tag-padding-small);
    }

    .tag--urgent.tag--medium {
        padding: var(--terra-tag-padding-medium);
    }

    .tag--urgent.tag--large {
        padding: var(--terra-tag-padding-large);
    }

    /* Dark mode support - handled by horizon.css design tokens */
`
