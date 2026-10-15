import { css } from 'lit';

export default css`
    :host {
        display: block;
        /* consumers should typically set an explicit height on this element */
        height: 100%;
    }

    terra-map {
        width: 100%;
        height: 100%;
    }
`;
