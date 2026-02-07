import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .file-upload-wrapper {
        width: 100%;
    }

    .file-upload__label {
        display: block;
        margin: 0 0 var(--terra-spacing-x-small, 0.5rem) 0;
        font-family: var(--terra-input-label-font-family);
        font-size: var(--terra-input-label-font-size);
        font-weight: var(--terra-input-label-line-weight);
        line-height: var(--terra-input-label-line-height);
        color: var(--terra-input-label-color);
    }

    .file-upload__required-indicator {
        color: var(--terra-input-required-content-color);
        margin-left: var(--terra-input-required-content-offset);
    }

    /* Dropzone */
    .file-upload__dropzone {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 8rem;
        padding: var(--terra-spacing-large);
        background-color: var(--terra-input-background-color);
        border: 2px dashed var(--terra-input-border-color);
        border-radius: var(--terra-input-border-radius);
        cursor: pointer;
        transition:
            border-color var(--terra-transition-fast),
            background-color var(--terra-transition-fast),
            box-shadow var(--terra-transition-fast);
    }

    .file-upload__dropzone:hover:not(.file-upload__dropzone--disabled) {
        border-color: var(--terra-color-nasa-blue);
        background-color: hsla(212, 100%, 58%, 0.05);
    }

    .file-upload__dropzone--dragging {
        border-color: var(--terra-color-nasa-blue);
        border-style: solid;
        background-color: hsla(212, 100%, 58%, 0.1);
    }

    .file-upload__dropzone--focused:not(.file-upload__dropzone--disabled) {
        outline: none;
        border-color: var(--terra-color-nasa-blue);
        box-shadow: 0 0 0 var(--terra-focus-ring-width)
            var(--terra-input-focus-ring-color);
    }

    .file-upload__dropzone--disabled {
        background-color: var(--terra-input-background-color-disabled);
        border-color: var(--terra-input-border-color-disabled);
        cursor: not-allowed;
        opacity: 0.5;
    }

    .file-upload__dropzone-text {
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-input-font-size);
        font-weight: var(--terra-input-font-weight);
        color: var(--terra-input-color);
        text-align: center;
    }

    .file-upload__browse-link {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        color: var(--terra-link-color);
        text-decoration: var(--terra-link-text-decoration);
        text-decoration-style: var(--terra-link-text-decoration-style);
        text-underline-offset: var(--terra-link-underline-offset);
        cursor: pointer;
    }

    .file-upload__browse-link:hover:not(:disabled) {
        color: var(--terra-link-color-hover);
    }

    .file-upload__browse-link:focus {
        outline: none;
    }

    /* File Input */
    .file-upload__input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    /* Preview Section */
    .file-upload__preview {
        border: 2px dashed var(--terra-input-border-color);
        border-radius: var(--terra-input-border-radius);
        padding: var(--terra-spacing-medium);
        background-color: var(--terra-input-background-color);
    }

    .file-upload__preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--terra-spacing-medium);
    }

    .file-upload__file-count {
        font-family: var(--terra-input-label-font-family);
        font-size: var(--terra-input-label-font-size);
        font-weight: var(--terra-font-weight-semibold);
        color: var(--terra-input-label-color);
    }

    .file-upload__change-link {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-input-font-size);
        font-weight: var(--terra-input-font-weight);
        color: var(--terra-link-color);
        text-decoration: var(--terra-link-text-decoration);
        text-decoration-style: var(--terra-link-text-decoration-style);
        text-underline-offset: var(--terra-link-underline-offset);
        cursor: pointer;
    }

    .file-upload__change-link:hover:not(:disabled) {
        color: var(--terra-link-color-hover);
    }

    .file-upload__change-link:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .file-upload__change-link:focus {
        outline: none;
    }

    /* File List */
    .file-upload__file-list {
        display: flex;
        flex-direction: column;
        gap: var(--terra-spacing-small);
    }

    .file-upload__file-item {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-small);
    }

    .file-upload__thumbnail {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
        border-radius: var(--terra-border-radius-small);
        flex-shrink: 0;
    }

    .file-upload__thumbnail--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--terra-color-carbon-10);
        color: var(--terra-color-carbon-50);
    }

    .file-upload__file-name {
        font-family: var(--terra-input-font-family);
        font-size: var(--terra-input-font-size);
        font-weight: var(--terra-input-font-weight);
        color: var(--terra-input-color);
        flex: 1;
    }

    /* Help Text */
    .file-upload__help-text {
        margin-top: var(--terra-spacing-x-small);
        font-size: var(--terra-input-help-text-font-size-medium);
        color: var(--terra-input-help-text-color);
    }

    /* Dark Mode */
    .terra-theme-dark .file-upload__dropzone,
    :host(.terra-theme-dark) .file-upload__dropzone {
        background-color: var(--terra-color-carbon-black);
        border-color: var(--terra-color-carbon-60);
    }

    .terra-theme-dark
        .file-upload__dropzone:hover:not(.file-upload__dropzone--disabled),
    :host(.terra-theme-dark)
        .file-upload__dropzone:hover:not(.file-upload__dropzone--disabled) {
        border-color: var(--terra-color-nasa-blue);
        background-color: hsla(212, 100%, 58%, 0.1);
    }

    .terra-theme-dark .file-upload__preview,
    :host(.terra-theme-dark) .file-upload__preview {
        background-color: var(--terra-color-carbon-black);
        border-color: var(--terra-color-carbon-60);
    }

    .terra-theme-dark .file-upload__thumbnail--placeholder,
    :host(.terra-theme-dark) .file-upload__thumbnail--placeholder {
        background-color: var(--terra-color-carbon-80);
        color: var(--terra-color-carbon-50);
    }
`
