import { css } from 'lit'

export default css`
    :host {
        display: block;
        padding: 16px;
        background: white;
    }

    #map {
        width: 100%;
        height: 100%;
        border: solid 1px gray;
    }

    :host .leaflet-mouse-position-container {
        color: #464646;
        padding: 5px;
        background-color: white;
    }

    :host .leaflet-mouse-position-text {
        margin: 0;
        font-weight: 700;
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

    :host .map__select {
        width: 100%;
        /* height: 1.7rem; */
        box-shadow: none;
        border-radius: 0 !important;
        margin-bottom: 1rem;
    }
`
