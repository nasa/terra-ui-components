import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
    }

    dialog {
        opacity: 0;
        transition: all 0.15s ease-out;
        transition-delay: 0.5s;
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
