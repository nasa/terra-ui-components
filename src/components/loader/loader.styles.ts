import { css } from 'lit';

export default css`
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
    }

    .loader {
        position: relative;
        width: var(--size);        
        height: var(--size);
    }

    /* Theme modes */

    .loader--dark {
        color: white;
        background-color: black;
    }

    .loader--light {
        color: black;
        background-color: white;
    }

    /* Loader sizes */

    .loader--large {
        --size: 52px;
        --stroke-width: 3.5px;
    }

    .loader--small {
        --size: 30px;
        --stroke-width: 3.5px;
    }

    svg {
        width: var(--size);
        height: var(--size);
    }

    .percent {
        display: block;
        width: var(--size);
        position: absolute;
        top: 19px;
        padding-left: 4px;
        letter-spacing: .1rem;
        text-align: center;
    }

    .circular-progress {
        --progress: 0;        /* added this so I can try to reference it and change the value. This value drives the rest of the calcultations */
        --half-size: calc(var(--size) / 2);
        --radius: calc((var(--size) - var(--stroke-width)) / 2);
        --circumference: calc(var(--radius) * pi * 2);
        --dash: calc((var(--progress) * var(--circumference)) / 100);     /* Calculate the length of the dash based on the progress percentage */
    }

    .circular-progress circle {
        cx: var(--half-size);
        cy: var(--half-size);
        r: var(--radius);
        stroke-width: var(--stroke-width);
        fill: none;
        stroke-linecap: round;
    }

    .circular-progress circle.bg {
        stroke: var(--edux-color-carbon-20);
    }

    .circular-progress circle.fg {
        transform: rotate(-90deg);
        transform-origin: var(--half-size) var(--half-size);
        stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
        transition: stroke-dasharray 0.3s linear 0s;                      /* Defines how --dash value changes to stroke-dasharray are animated */
        stroke: var(--edux-color-nasa-blue);
    }

    @property --progress {      /* Registers and describes the custom property and variable with the browser. */
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
    }

`;
