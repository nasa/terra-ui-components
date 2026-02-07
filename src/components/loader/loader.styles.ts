import { css } from 'lit'

export default css`
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: var(--terra-loader-size-large);
    }

    .loader {
        position: relative;
        width: var(--size);
        height: var(--size);
    }

    /* Loader variations */

    .loader--large {
        --size: var(--terra-loader-size-medium);
        --stroke-width: var(--terra-loader-stroke-width-medium);
    }

    .loader--small {
        --size: var(--terra-loader-size-small);
        --stroke-width: var(--terra-loader-stroke-width-small);
    }

    .loader--orbit {
        --size: var(--terra-loader-size-large);
    }

    .planet {
        fill: var(--terra-loader-planet-color);
        cx: 80px;
        cy: 80px;
        r: 50px;
    }

    .moon {
        fill: var(--terra-loader-moon-color);
        r: 5.5px;
    }

    #orbit {
        /* total length of orbit ellipse = 298.2393493652344 */
        stroke: var(--terra-loader-progress-color);
        stroke-width: var(--terra-loader-stroke-width-large);
        stroke-dasharray: 250 48;
        fill: none;
    }

    svg {
        width: var(--size);
        height: var(--size);
    }

    .percent {
        display: block;
        width: var(--size);
        position: absolute;
        top: calc((var(--size) / 2) - 10px);
        padding-left: var(--terra-loader-text-padding);
        letter-spacing: var(--terra-loader-text-letter-spacing);
        text-align: center;
    }

    .circular-progress {
        --progress: 0; /* added this so I can try to reference it and change the value. This value drives the rest of the calcultations */
        --half-size: calc(var(--size) / 2);
        --radius: calc((var(--size) - var(--stroke-width)) / 2);
        --circumference: calc(var(--radius) * pi * 2);
        --dash: calc(
            (var(--progress) * var(--circumference)) / 100
        ); /* Calculate the length of the dash based on the progress percentage */
        --indeterminate-dash: calc(
            (25 * var(--circumference)) / 100
        ); /* force progress to 25% for an indeterminate loader */
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
        stroke: var(--terra-loader-track-color);
    }

    .circular-progress circle.fg {
        transform: rotate(-90deg);
        transform-origin: var(--half-size) var(--half-size);
        stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
        transition: stroke-dasharray 0.3s linear 0s; /* Defines how --dash value changes to stroke-dasharray are animated */
        stroke: var(--terra-loader-progress-color);
    }

    .circular-progress.indeterminate circle.fg {
        stroke-dasharray: var(--indeterminate-dash)
            calc(var(--circumference) - var(--indeterminate-dash));
        animation: 0.8s spin infinite;
        animation-timing-function: linear;
        transform-origin: 50% 50%;
    }

    @keyframes dash {
        from {
            stroke-dashoffset: 300;
        }
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(-90deg);
        }

        to {
            transform: rotate(270deg);
        }
    }

    @property --progress {
        /* Registers and describes the custom property and variable with the browser. */
        syntax: '<number>';
        inherits: false;
        initial-value: 0;
    }
`
