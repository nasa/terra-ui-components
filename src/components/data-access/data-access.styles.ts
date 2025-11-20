import { css } from 'lit'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

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
        color: #666;
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: 12px 14px 12px 36px;
        border: 1px solid #d0d5dd;
        border-radius: 24px;
        font-size: 16px;
        outline: none;
        transition:
            box-shadow 0.2s,
            border-color 0.2s;
    }

    .search-input:focus {
        border-color: #98c3ff;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.15);
    }

    .toggle-row {
        display: flex;
        gap: 14px;
        margin-bottom: 8px;
    }

    .filter {
        position: relative;
    }

    terra-date-picker {
        --terra-input-border-width: 0;
        --terra-input-border-color: transparent;
        --terra-input-suffix-display: none;
        --terra-input-spacing-small: 0;
        --terra-input-spacing-medium: 0;

        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
    }

    terra-spatial-picker {
        --terra-input-border-width: 0;
        --terra-input-border-color: transparent;
        --terra-input-suffix-display: none;
        --terra-input-display: none;

        width: 600px;
        position: absolute;
        top: 0;
        left: 0;
    }

    terra-spatial-picker .spatial-picker {
        width: 0 !important;
        min-height: 38px !important;
        height: 38px !important;
        overflow: visible;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
    }

    terra-spatial-picker .spatial-picker__input_fields {
        display: none !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        opacity: 0 !important;
    }

    terra-spatial-picker .spatial-picker__input_label,
    terra-spatial-picker label {
        display: none !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 0 !important;
        line-height: 0 !important;
    }

    terra-spatial-picker .spatial-picker__error {
        display: none !important;
        visibility: hidden !important;
    }

    terra-spatial-picker terra-input {
        --terra-input-border-width: 0;
        --terra-input-border-color: transparent;
        --terra-input-suffix-display: none;

        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
    }

    terra-spatial-picker .spatial-picker__input_icon {
        display: none !important;
    }

    terra-spatial-picker .spatial-picker__map-container {
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        z-index: 1000 !important;
        width: 600px !important;
        max-width: 90vw !important;
        min-width: 400px !important;
        min-height: 400px !important;
        background: white !important;
        border-radius: 0.5rem !important;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        padding: 0.5rem !important;
        pointer-events: auto !important;
        margin-top: 0.5rem !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 0 !important;
    }

    terra-spatial-picker .spatial-picker__map-container.flipped {
        top: auto !important;
        bottom: calc(100% + 0.5rem) !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
    }

    terra-spatial-picker terra-map {
        width: 100% !important;
        min-width: 100% !important;
    }

    .filter-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border: 2px solid #d0d5dd;
        border-radius: 24px;
        background: #f6f7f9;
        color: #333;
        cursor: pointer;
        font-size: 16px;
        transition:
            border-color 0.15s,
            background 0.15s,
            color 0.15s;
    }

    .filter-btn.active {
        border-color: #2f6bb8;
        background: #e9f1ff;
        color: #1f4f8a;
    }

    .clear-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin-left: 4px;
        padding: 0;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        font-size: 16px;
        line-height: 1;
        color: #666;
        cursor: pointer;
        transition: all 0.15s;
    }

    .clear-badge:hover {
        background: white;
        color: #333;
        border-color: rgba(0, 0, 0, 0.2);
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

    .clear-btn {
        background: none;
        border: none;
        color: #888;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
    }

    .clear-btn:hover {
        color: #444;
    }

    .divider {
        height: 1px;
        background: #e5e7eb;
        margin: 10px 0;
    }

    .results-info {
        margin-top: 8px;
        padding-top: 10px;
        border-top: 1px solid #e5e7eb;
        color: #333;
        font-size: 16px;
    }

    @media (max-width: 768px) {
        .inline-map {
            min-width: 100%;
        }
    }

    .file-grid {
        height: 350px;
    }

    .ag-cell-value {
        line-height: 1.5;
        padding: 5px 0;
    }

    .grid-container {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
    }

    .grid-header {
        display: grid;
        grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
        gap: 1px;
        background: #1e3a5f;
        color: white;
        font-weight: 600;
    }

    .grid-header > div {
        padding: 12px 16px;
        cursor: pointer;
        background: #1e3a5f;
        display: flex;
        align-items: center;
    }

    .grid-header > div terra-icon {
        margin-left: 5px;
    }

    .grid-body {
        display: grid;
        grid-template-columns: 1fr;
    }

    .grid-row {
        display: grid;
        grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
        gap: 1px;
        background: #e0e0e0;
    }

    .grid-row > div {
        min-height: 45px;
        padding: 12px 16px;
        background: white;
        display: flex;
        align-items: center;
        word-break: break-word;
        border-bottom: 1px solid #e0e0e0;
    }

    .grid-row:hover > div {
        background: #f8f9fa;
    }

    .file-name {
        color: #333;
    }

    .size {
        text-align: right;
    }

    .time {
        color: #555;
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
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .download-btn:hover {
        background: #0056b3;
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
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 6px;
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
        background: #fff;
        color: #333;
        border: 1px solid #eee;
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
        background: #f8f8f8;
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
        background: #f8f9fa;
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
        background: white;
        border-radius: 0.5rem;
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
        background: white;
        padding: 24px;
        border-radius: 8px;
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
`
