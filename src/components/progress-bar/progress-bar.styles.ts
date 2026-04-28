import { css } from 'lit'

export default css`
    :host {
        --height: 1rem;
        --track-color: var(--terra-color-carbon-20);
        --indicator-color: var(--terra-color-nasa-blue);
        --label-color: var(--terra-color-spacesuit-white);

        display: block;
    }

    .progress-bar {
        position: relative;
        background-color: var(--track-color);
        height: var(--height);
        border-radius: 999px;
        box-shadow: inset var(--terra-shadow-small);
        overflow: hidden;
    }

    .progress-bar__indicator {
        height: 100%;
        font-family: var(--terra-font-family--inter);
        font-size: 12px;
        font-weight: var(--terra-font-weight-normal);
        background-color: var(--indicator-color);
        color: var(--label-color);
        text-align: center;
        line-height: var(--height);
        white-space: nowrap;
        overflow: hidden;
        transition:
            400ms width,
            400ms background-color;
        user-select: none;
        -webkit-user-select: none;
    }

    /* Variant modifiers */
    .progress-bar--primary .progress-bar__indicator {
        background-color: var(--terra-color-nasa-blue);
    }

    .progress-bar--success .progress-bar__indicator {
        background-color: var(--terra-color-success-green);
    }

    .progress-bar--warning .progress-bar__indicator {
        background-color: var(--terra-color-international-orange);
    }

    .progress-bar--danger .progress-bar__indicator {
        background-color: var(--terra-color-nasa-red);
    }

    .progress-bar--default .progress-bar__indicator {
        background-color: var(--terra-color-default-gray);
    }

    /* Indeterminate */
    .progress-bar--indeterminate .progress-bar__indicator {
        position: absolute;
        animation: indeterminate 2.5s infinite cubic-bezier(0.37, 0, 0.63, 1);
    }

    .progress-bar--indeterminate.progress-bar--rtl .progress-bar__indicator {
        animation-name: indeterminate-rtl;
    }

    @media (forced-colors: active) {
        .progress-bar {
            outline: solid 1px SelectedItem;
            background-color: var(--terra-color-spacesuit-white);
        }

        .progress-bar__indicator {
            outline: solid 1px SelectedItem;
            background-color: SelectedItem;
        }
    }

    @keyframes indeterminate {
        0% {
            left: -50%;
            width: 50%;
        }
        75%,
        100% {
            left: 100%;
            width: 50%;
        }
    }

    @keyframes indeterminate-rtl {
        0% {
            right: -50%;
            width: 50%;
        }
        75%,
        100% {
            right: 100%;
            width: 50%;
        }
    }
`
