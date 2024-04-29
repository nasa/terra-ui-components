import { css } from 'lit'

export default css`
    @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    @import url('https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css');

    :host {
        display: block;
        padding: 16px;
        max-width: 600px;
    }

    :host .spatial-picker__input_fields {
        position: relative;
    }

    :host input {
        box-shadow: none;
        border-radius: 0 !important;
    }

    :host .form-control {
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
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        -webkit-transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
        transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
    }

    :host .spatial-picker__input_icon_button {
        display: inline-block;
        height: 36px;
        width: 36px;
        padding: 0px;
        position: absolute;
        padding-top: 5px;
        top: 0;
        right: 0;
        z-index: 2;
        border: none;
        cursor: pointer;
        box-shadow: none;
        background-color: none;
        background: black;
    }

    :host .spatial-picker__input_icon_button svg {
        height: 28px;
        color: white;
    }
`
