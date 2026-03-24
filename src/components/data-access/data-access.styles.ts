import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .filters-compact {
        margin-bottom: 12px;
    }

    .search-row {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        color: var(--terra-input-icon-default);
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: 12px 14px 12px 36px;
        border: 1px solid var(--terra-input-border-default);
        border-radius: var(--terra-input-border-radius-medium);
        font-size: var(--terra-input-font-size-medium);
        color: var(--terra-input-text-color);
        background: var(--terra-input-background-default);
        outline: none;
        transition:
            box-shadow 0.2s,
            border-color 0.2s;
    }

    .search-input:focus {
        border-color: var(--terra-input-border-focus);
        box-shadow: var(--terra-shadow-small);
    }

    .toggle-row {
        display: flex;
        gap: 14px;
        margin-bottom: var(--terra-spacing-x-large);
    }

    .filter {
        position: relative;
    }

    .filter-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border: 2px solid var(--terra-border-action-secondary-default);
        border-radius: var(--terra-border-radius-medium);
        background: var(--terra-color-action-secondary-default);
        color: var(--terra-text-on-action-secondary);
        cursor: pointer;
        font-size: 16px;
        transition:
            border-color 0.15s,
            background 0.15s,
            color 0.15s;
    }

    .filter-btn:hover {
        border-color: var(--terra-border-action-secondary-hover);
        background: var(--terra-color-action-secondary-hover);
    }

    .filter-btn:active {
        border-color: var(--terra-border-action-secondary-active);
        background: var(--terra-color-action-secondary-active);
    }

    .clear-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin-left: 4px;
        padding: 0;
        background: transparent;
        border: 1px solid var(--terra-border-action-secondary-default);
        border-radius: var(--terra-border-radius-circle);
        font-size: 18px;
        color: var(--terra-button-color-default)
        line-height: 1;

        cursor: pointer;
        transition: all 0.15s;
    }

    .clear-badge:hover {
        background: var(--terra-border-action-secondary-hover);
        color: var(--terra-button-color-default);
    }

    .filter-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 8px 0 4px;
        flex-wrap: wrap;
    }

    .filter-field {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .inline-control {
        min-width: 220px;
    }

    .inline-map {
        min-width: 320px;
        max-width: 600px;
        flex: 1 1 auto;
    }

    .results-info {
        margin-top: 8px;
        padding-top: 10px;
        border-top: 1px solid var(--terra-border-neutral-default, #b9b9bb);
        color: var(--terra-text-secondary);
        font-size: 16px;
    }

    @media (max-width: 768px) {
        .inline-map {
            min-width: 100%;
        }
    }

    .grid-container {
        position: relative;
        width: 100%;
    }

    .datepicker-container,
    .spatialpicker-container {
        padding: 1rem;
    }

    .available-range {
        font-size: 0.8rem;
    }

    /* Remove border/background from terra-data-grid container since we handle it here if needed */
    .grid-container terra-data-grid::part(base) {
        border: none;
        background: transparent;
    }

    .download-dropdown {
        position: relative;
        display: inline-block;
        z-index: 800;
    }

    .download-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: var(--terra-color-action-primary-default);
        color: var(--terra-button-color-primary);
        border: none;
        border-radius: 6px;
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        cursor: pointer;
        transition: all 0.2s;
    }

    .download-btn:hover {
        background: var(--terra-color-action-primary-hover);;
    }

    .download-icon-small {
        width: 16px;
        height: 16px;
    }

    .dropdown-arrow {
        width: 16px;
        height: 16px;
        transition: transform 0.2s;
    }

    .download-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--terra-container-menu-bg);
        border: var(--terra-container-menu-border-width) solid var(--terra-container-menu-border-width);
        border-radius: var(--terra-container-menu-border-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 801;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s;
        margin-top: 4px;
        min-width: 200px;
    }

    .download-menu.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .download-dropdown.open .dropdown-arrow {
        transform: rotate(180deg);
    }

    .jupyter-btn {
        background: var(--terra-color-action-secondary-default);
        color: var(--terra-button-color-defaul);
        border: 1px solid var(--terra-color-action-secondary);
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 1em;
        cursor: pointer;
        transition:
            background 0.2s,
            box-shadow 0.2s;
        margin-left: 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .jupyter-btn:hover,
    .jupyter-btn:focus {
        background: var(--terra-color-action-secondary-hover);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        outline: none;
    }

    .download-option {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        text-align: left;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .download-option:hover {
        background: var(--terra-color-action-secondary-hover);
    }

    .download-option:first-child {
        border-radius: 6px 6px 0 0;
    }

    .download-option:last-child {
        border-radius: 0 0 6px 6px;
    }

    .cloud-cover-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        z-index: 1000;
        width: 400px;
        max-width: 90vw;
        background: var(--terra-container-menu-bg, #ffffff);
        border-radius: var(--terra-container-menu-border-radius, 8px);
        border: 1px solid var(--terra-container-menu-border, #b9b9bb);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s;
        pointer-events: none;
    }

    .cloud-cover-dropdown.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
    }

    .cloud-cover-dropdown terra-slider {
        width: 100%;
        min-width: 300px;
        padding-top: 20px;
    }

    .loading-modal {
        background: var(--terra-container-dialog-bg, #ffffff);
        border: 1px solid var(--terra-container-dialog-border, #b9b9bb);
        padding: 24px;
        border-radius: var(--terra-container-dialog-border-radius, 8px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        position: absolute;
        top: 100px;
        width: 200px;
        height: 100px;
        left: 50%;
        margin-left: -100px;
    }

    .dropdown-header {
    display: flex;
    justify-content: flex-end;
    padding: 4px 6px;
    }

    .panel-close {
        border: none;
        background: transparent;
        font-size: 18px;
        cursor: pointer;
        line-height: 1;
    }

    .panel-close:hover {
        opacity: 0.7;
    }
`
