import { css } from 'lit'

export default css`
    :host {
        display: block;
        padding: 16px;
        background: var(--terra-map-background-color);
        border: 1px solid var(--terra-map-border-color);
        border-radius: var(--terra-border-radius-medium);
    }

    :host([fill]) {
        padding: 0;
        border: none;
        border-radius: 0;
        width: 100%;
        height: 100%;
    }

    :root,
    :host {
        --ol-background-color: var(--terra-container-panel-bg, white);
        --ol-accent-background-color: var(
            --terra-color-bg-surface-neutral-secondary,
            #f5f5f5
        );
        --ol-subtle-background-color: var(
            --terra-color-bg-surface-neutral-secondary,
            rgba(128, 128, 128, 0.25)
        );
        --ol-partial-background-color: rgba(255, 255, 255, 0.75);
        --ol-foreground-color: var(--terra-text-primary, #333333);
        --ol-subtle-foreground-color: var(--terra-text-secondary, #666666);
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
        background-color: var(--terra-container-panel-bg, #ffffff);
        color: var(--terra-text-primary, #333333);
        box-shadow: none;
        border: 2px solid var(--terra-container-panel-border, rgba(0, 0, 0, 0.2));
        background-clip: padding-box;
        pointer-events: none;
    }

    @media (max-width: 768px) {
        #mouse-info {
            bottom: 5px;
            left: 5px;
        }
    }

    .ol-tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 0.375rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        pointer-events: none;
        white-space: nowrap;
    }

    .map-toolbar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        position: absolute;
        top: 4.68rem;
        left: 0.5rem;
        background: transparent;
        border-radius: 0;
        padding: 0;
        pointer-events: none;
    }

    .draw-toolbar,
    .layer-picker-control {
        position: absolute;
        top: 4.5rem;
        left: 0.5rem;
        display: flex;
        flex-direction: column;
        pointer-events: auto;
    }

    .map-toolbar .draw-toolbar,
    .map-toolbar .layer-picker-control {
        position: static;
        top: auto;
        left: auto;
    }

    .draw-toolbar:not(:has(button:not(.cancel-btn):not([style*='display: none']))),
    .layer-picker-control:not(:has(button:not([style*='display: none']))) {
        display: none;
    }

    .map-toolbar button,
    .draw-toolbar button,
    .layer-picker-control button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        margin: 1px;
        padding: 0;
        border: none;
        border-radius: 2px;
        background: var(--ol-background-color);
        color: #464646;
        cursor: pointer;
    }

    .map-toolbar button svg,
    .draw-toolbar button svg,
    .layer-picker-control button svg {
        width: 1.125rem;
        height: 1.125rem;
    }

    .map-toolbar button:hover,
    .map-toolbar button:focus,
    .draw-toolbar button:hover,
    .draw-toolbar button:focus,
    .layer-picker-control button:hover,
    .layer-picker-control button:focus {
        background: #f0f0f0;
        color: var(--ol-foreground-color);
        outline: 1px solid var(--ol-subtle-foreground-color);
    }

    .map-toolbar button.active,
    .draw-toolbar button.active,
    .layer-picker-control button.active {
        background: #e6f4ff;
        color: var(--ol-brand-color);
    }

    .layer-picker-toggle {
        anchor-name: --layer-picker-btn;
    }

    .draw-toolbar button.cancel-btn {
        display: none;
        height: 0;
        margin-block: 0;
        opacity: 0;
        transform: scale(0.8) translateY(-4px);
        overflow: hidden;
        transition:
            height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            margin-block 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.2s ease-out,
            transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
            display 0.25s allow-discrete;
    }

    .draw-toolbar button.cancel-btn.visible {
        display: flex;
        height: 1.75rem;
        margin-block: 1px;
        opacity: 1;
        transform: none;

        @starting-style {
            height: 0;
            margin-block: 0;
            opacity: 0;
            transform: scale(0.8) translateY(-4px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .draw-toolbar button.cancel-btn {
            transition: none;
        }
    }

    .ol-zoom button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        color: #464646;
        font-size: 1.125rem;
        line-height: 1;
        cursor: pointer;
    }

    .ol-zoom button:hover,
    .ol-zoom button:focus {
        background: #f0f0f0;
        color: var(--ol-foreground-color);
        outline: 1px solid var(--ol-subtle-foreground-color);
    }

    @layer ol {
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
            height: 1.75rem;
            width: 1.75rem;
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
        anchor-name: --map-container;
        container: terra-map / size;
        aspect-ratio: 4 / 3;
        border: solid 1px var(--terra-map-border-color);
    }

    .map.fill {
        aspect-ratio: unset;
        width: 100%;
        height: 100%;
        border: none;
    }

    .map.static .ol-control {
        display: none;
    }

    .layer-picker-panel {
        display: none;
        opacity: 0;
        transform: scale(0.96) translateX(-6px);
        position: absolute;
        left: calc(100% + 0.5rem);
        top: -4.18rem;
        width: clamp(18rem, 80cqw, 32rem);
        max-height: calc(100cqh - 1rem);
        flex-direction: column;
        overflow-y: auto;
        background: var(
            --terra-container-menu-bg,
            var(--terra-container-panel-bg, #ffffff)
        );
        color: var(
            --terra-checkbox-label-color,
            var(--ol-foreground-color, #333333)
        );
        border: solid var(--terra-container-menu-border-width, 1px)
            var(--terra-container-menu-border, rgba(0, 0, 0, 0.08));
        border-radius: var(--terra-border-radius-medium, 0.25rem);
        box-shadow: var(
            --terra-shadow-large,
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -4px rgba(0, 0, 0, 0.1)
        );
        padding: 0;
        z-index: var(--terra-z-index-tooltip, 1050);
        text-align: left;
        font-family: var(
            --terra-checkbox-label-font-family,
            var(--terra-font-family--public-sans, 'Helvetica Neue', Arial, sans-serif)
        );
        font-size: var(--terra-checkbox-label-font-size, 0.875rem);
        font-weight: var(--terra-checkbox-label-font-weight, 400);
        transform-origin: left top;
        transition:
            opacity 0.15s ease-out,
            transform 0.15s cubic-bezier(0.16, 1, 0.3, 1),
            display 0.15s allow-discrete;
        overscroll-behavior: contain;
    }

    @media (prefers-reduced-motion: reduce) {
        .layer-picker-panel {
            transition: none;
        }
    }

    .layer-picker-panel.open {
        display: flex;
        opacity: 1;
        transform: none;

        @starting-style {
            opacity: 0;
            transform: scale(0.96) translateX(-6px);
        }
    }

    /* Default (Compact / short container): Unified scrolling across entire panel */
    .layer-picker-body {
        flex: none;
        overflow: visible;
        padding: var(--terra-spacing-small, 0.75rem) var(--terra-spacing-medium, 1rem)
            var(--terra-spacing-x-small, 0.5rem);
    }

    .layer-picker-footer {
        flex: none;
        padding: var(--terra-spacing-x-small, 0.5rem) var(--terra-spacing-medium, 1rem)
            var(--terra-spacing-small, 0.75rem);
        border-top: 1px solid var(--terra-container-menu-border, rgba(0, 0, 0, 0.08));
    }

    /* Tall container: Pinned footer + independent visualizations scroll */
    @container terra-map (min-height: 500px) {
        .layer-picker-panel {
            overflow: hidden;
            max-height: calc(100cqh - 1rem);
        }

        .layer-picker-body {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
        }

        .layer-picker-footer {
            flex: 1 0 auto;
        }
    }

    .layer-picker-body + .layer-picker-footer {
        border-top: 1px solid var(--terra-container-menu-border, rgba(0, 0, 0, 0.08));
    }

    .layer-picker-footer:only-child {
        border-top: none;
        padding: var(--terra-spacing-small, 0.75rem) var(--terra-spacing-medium, 1rem);
    }

    .layer-picker-visualization-item {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--terra-spacing-small, 0.75rem);
        position: relative;
        border-radius: var(--terra-border-radius-small, 2px);
        transition:
            opacity 0.15s ease,
            background-color 0.15s ease;

        &.is-dragging {
            opacity: 0.45;
            background: var(--terra-container-panel-bg-subtle, rgba(0, 0, 0, 0.03));
            outline: 1px dashed var(--terra-border-neutral-default, rgba(0, 0, 0, 0.2));
            outline-offset: 2px;
        }

        &.drop-target-above::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--terra-slider-connect-color, #1c67e3);
            border-radius: 1px;
            z-index: 10;
        }

        &.drop-target-below::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--terra-slider-connect-color, #1c67e3);
            border-radius: 1px;
            z-index: 10;
        }
    }

    .layer-picker-viz-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--terra-spacing-x-small, 0.5rem);
        /* Solid surface so setDragImage(header, ...) snapshots an opaque pill rather
           than floating transparent text over the map canvas during drag-and-drop. */
        background: var(
            --terra-container-menu-bg,
            var(--terra-container-panel-bg, #ffffff)
        );
        border-radius: var(--terra-border-radius-small, 2px);
    }

    .layer-picker-viz-header .layer-picker-item {
        flex: 1 1 auto;
        min-width: 0;
        // overflow: hidden;
    }

    .layer-picker-viz-header .layer-picker-item span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .layer-picker-viz-actions {
        display: flex;
        align-items: center;
        gap: 0.125rem;
        flex: 0 0 auto;
    }

    .layer-picker-settings-btn,
    .layer-picker-drag-handle {
        flex: 0 0 auto;
        min-width: 1.5rem;
        min-height: 1.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--terra-border-radius-small, 2px);
        color: var(--terra-text-secondary, var(--ol-subtle-foreground-color, #707070));
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .layer-picker-drag-handle {
        cursor: grab;

        &:active {
            cursor: grabbing;
        }
    }

    .layer-picker-settings-btn:hover,
    .layer-picker-settings-btn.active,
    .layer-picker-drag-handle:hover {
        background: var(--ol-accent-background-color, #f0f0f0);
        color: var(--terra-color-nasa-blue, var(--ol-brand-color, #1c67e3));
    }

    .layer-picker-settings-btn:focus-visible,
    .layer-picker-drag-handle:focus-visible {
        outline: var(--terra-focus-ring);
        outline-offset: var(--terra-focus-ring-offset);
    }

    .layer-picker-settings-drawer {
        margin-top: 0.375rem;
        padding: 0.375rem 0.5rem;
        background: var(--terra-container-panel-bg-subtle, rgba(0, 0, 0, 0.03));
        border-radius: var(--terra-border-radius-medium, 0.25rem);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &[hidden] {
            display: none;
        }
    }

    .layer-picker-opacity-header {
        display: flex;
        justify-content: space-between;
        font-size: var(--terra-font-size-x-small, 0.75rem);
        color: var(--terra-slider-label-color, var(--terra-text-secondary, #707070));

        label {
            cursor: pointer;
            user-select: none;
        }
    }

    .layer-picker-opacity-value {
        color: var(--terra-slider-range-color, var(--terra-text-secondary, #707070));
        font-variant-numeric: tabular-nums;
    }

    .layer-picker-opacity-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 1.25rem;
        background: transparent;
        cursor: pointer;
        margin: 0;
        padding: 0;

        &:focus {
            outline: none;
        }

        /* WebKit / Chromium Track */
        &::-webkit-slider-runnable-track {
            height: 4px;
            border-radius: var(--terra-border-radius-small, 2px);
            background: linear-gradient(
                to right,
                var(--terra-slider-connect-color, #1c67e3) 0%,
                var(--terra-slider-connect-color, #1c67e3) var(--slider-percent, 100%),
                var(--terra-slider-track-background-color, #ffffff) var(--slider-percent, 100%),
                var(--terra-slider-track-background-color, #ffffff) 100%
            );
            border: 1px solid var(--terra-slider-track-border-color, rgba(0, 0, 0, 0.15));
        }

        /* WebKit / Chromium Thumb */
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--terra-slider-handle-background-color, #ffffff);
            border: 2px solid var(--terra-slider-handle-border-color, #1c67e3);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
            margin-top: -7px;
            cursor: pointer;
            transition: transform 0.1s ease;
        }

        &::-webkit-slider-thumb:hover {
            transform: scale(1.1);
        }

        &::-webkit-slider-thumb:active {
            transform: scale(1.15);
            background: var(--terra-slider-handle-background-color-active, #f0f0f0);
        }

        /* Firefox Track */
        &::-moz-range-track {
            height: 4px;
            border-radius: var(--terra-border-radius-small, 2px);
            background: var(--terra-slider-track-background-color, #ffffff);
            border: 1px solid var(--terra-slider-track-border-color, rgba(0, 0, 0, 0.15));
        }

        /* Firefox Progress Fill */
        &::-moz-range-progress {
            height: 4px;
            border-radius: var(--terra-border-radius-small, 2px) 0 0
                var(--terra-border-radius-small, 2px);
            background: var(--terra-slider-connect-color, #1c67e3);
            border: 1px solid var(--terra-slider-track-border-color, rgba(0, 0, 0, 0.15));
            border-right: none;
        }

        /* Firefox Thumb */
        &::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--terra-slider-handle-background-color, #ffffff);
            border: 2px solid var(--terra-slider-handle-border-color, #1c67e3);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            box-sizing: border-box;
            transition: transform 0.1s ease;
        }

        &::-moz-range-thumb:hover {
            transform: scale(1.1);
        }

        &::-moz-range-thumb:active {
            transform: scale(1.15);
            background: var(--terra-slider-handle-background-color-active, #f0f0f0);
        }

        &:focus-visible::-webkit-slider-thumb,
        &:focus-visible::-moz-range-thumb {
            outline: var(--terra-focus-ring);
            outline-offset: var(--terra-focus-ring-offset);
        }
    }

    .layer-picker-legend {
        margin-top: 0.375rem;
    }

    .layer-picker-legend-bar {
        height: 0.625rem;
        border-radius: var(--terra-border-radius-small, 2px);
        cursor: pointer;
        border: 1px solid var(--terra-border-neutral-default, rgba(0, 0, 0, 0.15));

        &:focus-visible {
            outline: var(--terra-focus-ring);
            outline-offset: var(--terra-focus-ring-offset);
        }
    }

    .layer-picker-legend-labels {
        display: flex;
        justify-content: space-between;
        font-size: var(--terra-font-size-2x-small, 0.688rem);
        color: var(--terra-text-secondary, var(--ol-subtle-foreground-color, #707070));
        margin-top: 2px;
    }

    .layer-picker-legend-gibs {
        width: 100%;
        cursor: crosshair;

        svg,
        img {
            width: 100%;
            height: auto;
        }

        svg {
            display: flex;
            /* User-agent stylesheets default <svg> to overflow: hidden, which clips
               GIBS' inline <g id="tooltip_..."> hover callouts when a bin's callout
               box extends slightly past the SVG viewBox width (e.g. x = 310.2 on a
               302.4pt viewBox). Allowing overflow lets those callouts paint into
               .layer-picker-body's horizontal padding instead of being cut off. */
            overflow: visible;
        }

        img {
            display: block;
        }
    }

    .layer-picker-legend-skeleton {
        width: 100%;
        pointer-events: none;

        terra-skeleton {
            /* Match GIBS horizontal legend SVG viewBox (302.4 x 50.4 = 6:1) */
            aspect-ratio: 302.4 / 50.4;
            width: 100%;
            --terra-skeleton-background-color: var(
                --terra-color-neutral-50,
                #f5f5f5
            );
            --terra-skeleton-sheen-color: var(
                --terra-color-neutral-100,
                #e3e3e3
            );
            --terra-skeleton-border-radius: var(
                --terra-border-radius-small,
                0.1875rem
            );
        }
    }

    .layer-picker-section + .layer-picker-section {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    .layer-picker-heading {
        font-family: var(--terra-font-family--inter, sans-serif);
        font-weight: var(--terra-font-weight-semi-bold, 600);
        font-size: 0.688rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--ol-subtle-foreground-color);
        margin-bottom: 0.5rem;
    }

    .layer-picker-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.25rem 0.125rem;
        font-family: var(
            --terra-checkbox-label-font-family,
            var(--terra-font-family--public-sans, 'Helvetica Neue', Arial, sans-serif)
        );
        font-size: var(--terra-checkbox-label-font-size, 0.875rem);
        font-weight: var(--terra-checkbox-label-font-weight, 400);
        line-height: 1.35;
        color: var(--terra-checkbox-label-color, var(--ol-foreground-color));
        cursor: pointer;
        white-space: nowrap;
        border-radius: 2px;
        user-select: none;
    }

    .layer-picker-item:hover {
        background: var(--ol-accent-background-color);
    }

    .layer-picker-item input {
        appearance: none;
        -webkit-appearance: none;
        flex: 0 0 auto;
        margin: 0;
        width: var(--terra-checkbox-size-medium, 1rem);
        height: var(--terra-checkbox-size-medium, 1rem);
        border: solid var(--terra-checkbox-border-width, 1px)
            var(--terra-checkbox-border-color, #959599);
        background-color: var(--terra-checkbox-background-color, #ffffff);
        cursor: pointer;
        display: inline-grid;
        place-content: center;
        transition:
            0.15s border-color,
            0.15s background-color;
    }

    .layer-picker-item input[type='checkbox'] {
        border-radius: var(--terra-checkbox-border-radius, 2px);
    }

    .layer-picker-item input[type='radio'] {
        border-radius: 50%;
    }

    .layer-picker-item input:hover {
        border-color: var(--terra-checkbox-border-color-hover, #58585b);
    }

    .layer-picker-item input:checked {
        border-color: var(--terra-checkbox-border-color-checked, #1c67e3);
        background-color: var(--terra-checkbox-background-color-checked, #1c67e3);
    }

    .layer-picker-item input[type='checkbox']:checked::before {
        content: '';
        width: 0.55rem;
        height: 0.3rem;
        border-left: 2px solid var(--terra-checkbox-icon-color, #ffffff);
        border-bottom: 2px solid var(--terra-checkbox-icon-color, #ffffff);
        transform: translateY(-1px) rotate(-45deg);
    }

    .layer-picker-item input[type='radio']:checked::before {
        content: '';
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
        background-color: var(--terra-radio-icon-color, #ffffff);
    }

    .layer-picker-item input:focus-visible {
        outline: var(--terra-focus-ring);
        outline-offset: var(--terra-focus-ring-offset);
    }

    .form-control {
        display: block;
        width: 100%;
        height: 36px;
        padding: 6px 12px;
        background-color: var(--terra-input-background-default);
        border: 1px solid var(--terra-input-border-default);
        border-radius: var(--terra-border-radius-small);
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

    .map__loading-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(2px);
        z-index: 1000;
        pointer-events: none;
    }

    .map__spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 0, 0, 0.12);
        border-top-color: #3388ff;
        border-radius: 50%;
        animation: map-spin 0.75s linear infinite;
    }

    @keyframes map-spin {
        to {
            transform: rotate(360deg);
        }
    }
`
