import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
    }

    .plot-container {
        position: relative;
    }

    dialog {
        opacity: 0;
        transition: all 0.15s ease-out;
        transition-delay: 0.4s; /* a short delay, to allow local results to be displayed without a loading icon */
        position: absolute;
        top: 20%;
        left: 0;
        z-index: 100;
    }

    dialog.open {
        opacity: 1;
    }

    @starting-style {
        dialog.open {
            opacity: 0;
        }
    }
`
