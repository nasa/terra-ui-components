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

        display: block;
        padding: 16px;
        background: white;
        border: solid 1px var(--terra-color-neutral--200, var(--color-neutral--200));
    }

    .map {
        aspect-ratio: 4 / 3;
    }

    .leaflet-mouse-position-container {
        color: #464646;
        padding: 5px;
        background-color: white;
    }

    .leaflet-mouse-position-text {
        margin: 0;
        font-weight: 700;
    }

    .form-control {
        display: block;
        border-radius: 0;
        width: 100%;
        height: 36px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: 0 none;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        -webkit-transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
        transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
    }

    .form-control:focus {
        border: 1px solid var(--terra-color-blue--600, var(--color-blue--600));
    }

    .map__select {
        box-shadow: none;
        border-radius: 0 !important;
        margin-bottom: 1rem;
    }
`
