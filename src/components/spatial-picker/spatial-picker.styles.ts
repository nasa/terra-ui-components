import { css } from 'lit'

export default css`
    :host {
        --color-blue--400: #007acc;
        --color-blue--500: #1c67e3;
        --color-blue--600: #0b3d91;

        --color-red--400: #f64137;
        --color-red--500: #b60109;

        --color-neutral--000: #ffffff;
        --color-neutral--100: #f7f7f7;
        --color-neutral--200: #d1d1d1;
        --color-neutral--300: #b9b9bb;
        --color-neutral--400: #959599;
        --color-neutral--500: #767676;
        --color-neutral--600: #58585b;
        --color-neutral--700: #2e2e32;
        --color-neutral--800: #1b1b1b;

        --font-family--inter: Inter, sans-serif;
        --font-family--public-sans: 'Public Sans', sans-serif;
        --font-family--dm-mono: 'DM Mono', monospace;

        --label-height: 1.8125rem;
        --help-height: 1.8125rem;
        --host-height: 5.8125rem;

        display: block;
        padding: 16px;
        position: relative;
        z-index: 1;
    }

    :host .spatial-picker__input_fields {
        position: relative;
    }

    :host input {
        box-shadow: none;
        border-radius: 0 !important;
    }

    .spatial-picker__input_label {
        font-family: var(--edux-font-family--inter, var(--font-family--inter));
        font-weight: 600;
        line-height: 1.1875rem;
    }

    .form-control {
        width: 100%;
        padding-inline-start: 1rem;
        padding-inline-end: 2.5rem;
        padding-block: 0.375rem;
        font-size: 0.85rem;
        line-height: 1.42857143;
        color: currentColor;
        background-color: var(--edux-color-neutral--100, var(--color-neutral--100));
        block-size: var(--edux-block-size, 2.1875rem);
        border-block: 2px solid
            var(--edux-color-neutral--200, var(--color-neutral--200));
        border-inline-end: 0;
        border-inline-start: 2px solid
            var(--edux-color-neutral--200, var(--color-neutral--200));
        border-radius: 4px;
        outline: 0;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    .form-control:focus {
        border-radius: 4px;
        border: 2px solid var(--edux-color-blue--500, var(--color-blue--500));
    }

    .form-control:focus + .spatial-picker__input_icon_button {
        background-color: var(--edux-color-neutral--800, var(--color-neutral--800));
    }

    .spatial-picker__input_icon_button {
        block-size: var(--edux-block-size, 2.1875rem);
        padding-inline: 0.5rem;
        position: absolute;
        padding-top: 5px;
        top: 0;
        right: 0;
        z-index: 2;
        border: none;
        cursor: pointer;
        box-shadow: none;
        background-color: var(--edux-color-neutral--700, var(--color-neutral--700));
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    .spatial-picker__input_icon_button svg {
        height: 1.2rem;
        width: 1.2rem;
        color: white;
    }

    :host edux-map {
        position: absolute;
        top: calc(var(--edux-block-size, 2.1875rem) + 1rem);
    }
`
