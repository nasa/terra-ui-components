import { css } from 'lit'

export default css`
    :host {
        display: block;
        padding: 16px;
        background: var(--terra-map-background-color);
        border: 1px solid var(--terra-map-border-color);
    }

    :root,
    :host {
        --ol-background-color: white;
        --ol-accent-background-color: #f5f5f5;
        --ol-subtle-background-color: rgba(128, 128, 128, 0.25);
        --ol-partial-background-color: rgba(255, 255, 255, 0.75);
        --ol-foreground-color: #333333;
        --ol-subtle-foreground-color: #666666;
        --ol-brand-color: #00aaff;
    }

    [part='map'] {
        position: relative;
    }

    #mouse-info {
        font: 16px var(--terra-font-family--public-sans);
        font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-size: 0.75rem;
        line-height: 1.5;
        position: absolute;
        bottom: 20px;
        left: 10px;
        border-radius: 4px;
        padding: 5px;
        background-color: var(--terra-input-background-color);
        box-shadow: none;
        border: 2px solid rgba(0, 0, 0, 0.2);
        background-clip: padding-box;
        z-index: 2;
    }

    .ol-tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 6px 8px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        white-space: nowrap;
    }

    .draw-toolbar {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 4em;
        left: 0.5em;
    }

    .draw-toolbar button {
        width: 32px;
        height: 32px;
        border: none;
        background: white;
        cursor: pointer;
    }

    .draw-toolbar button:hover {
        background: #f0f0f0;
    }

    .ol-box {
        box-sizing: border-box;
        border-radius: 2px;
        border: 1.5px solid var(--ol-background-color);
        background-color: var(--ol-partial-background-color);
    }

    .ol-mouse-position {
        top: 8px;
        right: 8px;
        position: absolute;
    }

    .ol-scale-line {
        background: var(--ol-partial-background-color);
        border-radius: 4px;
        bottom: 8px;
        left: 8px;
        padding: 2px;
        position: absolute;
    }

    .ol-scale-line-inner {
        border: 1px solid var(--ol-subtle-foreground-color);
        border-top: none;
        color: var(--ol-foreground-color);
        font-size: 10px;
        text-align: center;
        margin: 1px;
        will-change: contents, width;
        transition: all 0.25s;
    }

    .ol-scale-bar {
        position: absolute;
        bottom: 8px;
        left: 8px;
    }

    .ol-scale-bar-inner {
        display: flex;
    }

    .ol-scale-step-marker {
        width: 1px;
        height: 15px;
        background-color: var(--ol-foreground-color);
        float: right;
        z-index: 10;
    }

    .ol-scale-step-text {
        position: absolute;
        bottom: -5px;
        font-size: 10px;
        z-index: 11;
        color: var(--ol-foreground-color);
        text-shadow:
            -1.5px 0 var(--ol-partial-background-color),
            0 1.5px var(--ol-partial-background-color),
            1.5px 0 var(--ol-partial-background-color),
            0 -1.5px var(--ol-partial-background-color);
    }

    .ol-scale-text {
        position: absolute;
        font-size: 12px;
        text-align: center;
        bottom: 25px;
        color: var(--ol-foreground-color);
        text-shadow:
            -1.5px 0 var(--ol-partial-background-color),
            0 1.5px var(--ol-partial-background-color),
            1.5px 0 var(--ol-partial-background-color),
            0 -1.5px var(--ol-partial-background-color);
    }

    .ol-scale-singlebar {
        position: relative;
        height: 10px;
        z-index: 9;
        box-sizing: border-box;
        border: 1px solid var(--ol-foreground-color);
    }

    .ol-scale-singlebar-even {
        background-color: var(--ol-subtle-foreground-color);
    }

    .ol-scale-singlebar-odd {
        background-color: var(--ol-background-color);
    }

    .ol-unsupported {
        display: none;
    }

    .ol-viewport,
    .ol-unselectable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    .ol-viewport canvas {
        all: unset;
        overflow: hidden;
    }

    .ol-viewport {
        touch-action: pan-x pan-y;
    }

    .ol-selectable {
        -webkit-touch-callout: default;
        -webkit-user-select: text;
        -moz-user-select: text;
        user-select: text;
    }

    .ol-grabbing {
        cursor: -webkit-grabbing;
        cursor: -moz-grabbing;
        cursor: grabbing;
    }

    .ol-grab {
        cursor: move;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
    }

    .ol-control {
        position: absolute;
        background-color: var(--ol-subtle-background-color);
        border-radius: 4px;
    }

    .ol-zoom {
        top: 0.5em;
        left: 0.5em;
    }

    .ol-rotate {
        top: 0.5em;
        right: 0.5em;
        transition:
            opacity 0.25s linear,
            visibility 0s linear;
    }

    .ol-rotate.ol-hidden {
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 0.25s linear,
            visibility 0s linear 0.25s;
    }

    .ol-zoom-extent {
        top: 4.643em;
        left: 0.5em;
    }

    .ol-full-screen {
        right: 0.5em;
        top: 0.5em;
    }

    .ol-control button {
        display: block;
        margin: 1px;
        padding: 0;
        color: var(--ol-subtle-foreground-color);
        font-weight: bold;
        text-decoration: none;
        font-size: inherit;
        text-align: center;
        height: 1.375em;
        width: 1.375em;
        line-height: 0.4em;
        background-color: var(--ol-background-color);
        border: none;
        border-radius: 2px;
        position: relative;
    }

    .ol-control button::-moz-focus-inner {
        border: none;
        padding: 0;
    }

    .ol-zoom-extent button {
        line-height: 1.4em;
    }

    .ol-compass {
        display: block;
        font-weight: normal;
        will-change: transform;
    }

    .ol-touch .ol-control button {
        font-size: 1.5em;
    }

    .ol-touch .ol-zoom-extent {
        top: 5.5em;
    }

    .ol-control button:hover,
    .ol-control button:focus {
        text-decoration: none;
        outline: 1px solid var(--ol-subtle-foreground-color);
        color: var(--ol-foreground-color);
    }

    .ol-zoom .ol-zoom-in {
        border-radius: 2px 2px 0 0;
    }

    .ol-zoom .ol-zoom-out {
        border-radius: 0 0 2px 2px;
    }

    .ol-attribution {
        display: none !important;
    }

    .ol-zoomslider {
        top: 4.5em;
        left: 0.5em;
        height: 200px;
    }

    .ol-zoomslider button {
        position: relative;
        height: 10px;
    }

    .ol-touch .ol-zoomslider {
        top: 5.5em;
    }

    .ol-overviewmap {
        left: 0.5em;
        bottom: 0.5em;
    }

    .ol-overviewmap.ol-uncollapsible {
        bottom: 0;
        left: 0;
        border-radius: 0 4px 0 0;
    }

    .ol-overviewmap .ol-overviewmap-map,
    .ol-overviewmap button {
        display: block;
    }

    .ol-overviewmap .ol-overviewmap-map {
        border: 1px solid var(--ol-subtle-foreground-color);
        height: 150px;
        width: 150px;
    }

    .ol-overviewmap:not(.ol-collapsed) button {
        bottom: 0;
        left: 0;
        position: absolute;
    }

    .ol-overviewmap.ol-collapsed .ol-overviewmap-map,
    .ol-overviewmap.ol-uncollapsible button {
        display: none;
    }

    .ol-overviewmap:not(.ol-collapsed) {
        background: var(--ol-subtle-background-color);
    }

    .ol-overviewmap-box {
        border: 1.5px dotted var(--ol-subtle-foreground-color);
    }

    .ol-overviewmap .ol-overviewmap-box:hover {
        cursor: move;
    }

    .ol-overviewmap .ol-viewport:hover {
        cursor: pointer;
    }

    /* Responsive design for smaller screens */
    @media (max-width: 768px) {
        :host {
            gap: 1rem 0.5rem;
        }

        .map-container {
            min-height: 300px;
        }

        #map {
            min-height: 300px;
        }

        #settings {
            bottom: 100px;
            left: 5px;
            padding: 6px 8px;
            font-size: 11px;
        }
    }

    @media (max-width: 480px) {
        .map-container {
            min-height: 250px;
        }

        #map {
            min-height: 250px;
        }

        #settings {
            bottom: 80px;
            left: 5px;
            padding: 4px 6px;
            font-size: 10px;
        }
    }

    .map {
        aspect-ratio: 4 / 3;
        border: solid 1px var(--terra-map-border-color);
    }

    .map.static .ol-control {
        display: none;
    }

    .control-button {
        /* TODO: use a local spritesheet instead */
        background-image:
            linear-gradient(transparent, transparent),
            url('https://unpkg.com/leaflet-draw@1.0.4/dist/images/spritesheet.svg');
        background-repeat: no-repeat;
        background-size: 300px 22px;
        background-clip: padding-box;
        position: absolute;
        top: 30%;
        left: 30%;
        width: 40%;
        height: 40%;
    }

    .control-bbox {
        background-position: -90px;
    }

    .control-polygon {
        background-position: -68px;
    }

    .control-point {
        background-position: -134px;
    }

    .control-circle {
        background-position: -112px;
    }

    .form-control {
        display: block;
        width: 100%;
        height: 36px;
        padding: 6px 12px;
        background-image: none;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        -webkit-transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
        transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
    }

    .map__select {
        width: 100%;
        box-shadow: none;
        margin-bottom: 1rem;
    }
`
