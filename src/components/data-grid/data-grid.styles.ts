import { css } from 'lit'
import 'ag-grid-community/styles/ag-grid.css'
// Import default alpine theme - users can import additional themes if needed
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default css`
    :host {
        display: block;

        /* Map AG Grid CSS variables to Terra Data Grid design tokens */
        /* Colors - Primary */
        --ag-alpine-active-color: var(--terra-data-grid-active-color);
        --ag-background-color: var(--terra-data-grid-background-color);
        --ag-foreground-color: var(--terra-data-grid-foreground-color);
        --ag-secondary-foreground-color: var(--terra-data-grid-secondary-foreground-color);
        --ag-disabled-foreground-color: var(--terra-data-grid-disabled-foreground-color);

        /* Colors - Borders */
        --ag-border-color: var(--terra-data-grid-border-color);
        --ag-secondary-border-color: var(--terra-data-grid-secondary-border-color);
        --ag-input-border-color: var(--terra-data-grid-input-border-color);
        --ag-input-border-color-invalid: var(--terra-data-grid-input-border-color-invalid);
        --ag-input-disabled-border-color: var(--terra-data-grid-input-disabled-border-color);

        /* Colors - Backgrounds */
        --ag-header-background-color: var(--terra-data-grid-header-background-color);
        --ag-tooltip-background-color: var(--terra-data-grid-tooltip-background-color);
        --ag-odd-row-background-color: var(--terra-data-grid-odd-row-background-color);
        --ag-control-panel-background-color: var(--terra-data-grid-control-panel-background-color);
        --ag-subheader-background-color: var(--terra-data-grid-subheader-background-color);
        --ag-panel-background-color: var(--terra-data-grid-panel-background-color);
        --ag-menu-background-color: var(--terra-data-grid-menu-background-color);
        --ag-input-disabled-background-color: var(--terra-data-grid-input-disabled-background-color);
        --ag-checkbox-background-color: var(--terra-data-grid-checkbox-background-color);
        --ag-chip-background-color: var(--terra-data-grid-chip-background-color);

        /* Colors - Interactive States */
        --ag-row-hover-color: var(--terra-data-grid-row-hover-color);
        --ag-column-hover-color: var(--terra-data-grid-column-hover-color);
        --ag-selected-row-background-color: var(--terra-data-grid-selected-row-background-color);
        --ag-range-selection-background-color: var(--terra-data-grid-range-selection-background-color);
        --ag-range-selection-background-color-2: var(--terra-data-grid-range-selection-background-color-2);
        --ag-range-selection-background-color-3: var(--terra-data-grid-range-selection-background-color-3);
        --ag-range-selection-background-color-4: var(--terra-data-grid-range-selection-background-color-4);
        --ag-range-selection-border-color: var(--terra-data-grid-range-selection-border-color);
        --ag-input-focus-border-color: var(--terra-data-grid-input-focus-border-color);

        /* Colors - Validation & Status */
        --ag-invalid-color: var(--terra-data-grid-invalid-color);
        --ag-checkbox-unchecked-color: var(--terra-data-grid-checkbox-unchecked-color);
        --ag-checkbox-checked-color: var(--terra-data-grid-checkbox-checked-color);

        /* Colors - Advanced Filters */
        --ag-advanced-filter-join-pill-color: var(--terra-data-grid-advanced-filter-join-pill-color);
        --ag-advanced-filter-column-pill-color: var(--terra-data-grid-advanced-filter-column-pill-color);
        --ag-advanced-filter-option-pill-color: var(--terra-data-grid-advanced-filter-option-pill-color);
        --ag-advanced-filter-value-pill-color: var(--terra-data-grid-advanced-filter-value-pill-color);

        /* Colors - Find/Search */
        --ag-find-match-color: var(--terra-data-grid-find-match-color);
        --ag-find-match-background-color: var(--terra-data-grid-find-match-background-color);
        --ag-find-active-match-color: var(--terra-data-grid-find-active-match-color);
        --ag-find-active-match-background-color: var(--terra-data-grid-find-active-match-background-color);

        /* Colors - Buttons & Actions */
        --ag-filter-panel-apply-button-color: var(--terra-data-grid-filter-panel-apply-button-color);
        --ag-filter-panel-apply-button-background-color: var(--terra-data-grid-filter-panel-apply-button-background-color);
        --ag-selected-tab-underline-color: var(--terra-data-grid-selected-tab-underline-color);

        /* Typography */
        --ag-font-family: var(--terra-data-grid-font-family);
        --ag-font-size: var(--terra-data-grid-font-size);
        --ag-icon-font-family: var(--terra-data-grid-icon-font-family);

        /* Spacing & Sizing */
        --ag-grid-size: var(--terra-data-grid-grid-size);
        --ag-icon-size: var(--terra-data-grid-icon-size);
        --ag-row-height: var(--terra-data-grid-row-height);
        --ag-header-height: var(--terra-data-grid-header-height);
        --ag-list-item-height: var(--terra-data-grid-list-item-height);
        --ag-cell-horizontal-padding: var(--terra-data-grid-cell-horizontal-padding);
        --ag-cell-widget-spacing: var(--terra-data-grid-cell-widget-spacing);
        --ag-widget-container-vertical-padding: var(--terra-data-grid-widget-container-vertical-padding);
        --ag-widget-container-horizontal-padding: var(--terra-data-grid-widget-container-horizontal-padding);
        --ag-widget-vertical-spacing: var(--terra-data-grid-widget-vertical-spacing);
        --ag-column-select-indent-size: var(--terra-data-grid-column-select-indent-size);
        --ag-set-filter-indent-size: var(--terra-data-grid-set-filter-indent-size);
        --ag-advanced-filter-builder-indent-size: var(--terra-data-grid-advanced-filter-builder-indent-size);
        --ag-toggle-button-height: var(--terra-data-grid-toggle-button-height);
        --ag-toggle-button-width: var(--terra-data-grid-toggle-button-width);
        --ag-tab-min-width: var(--terra-data-grid-tab-min-width);
        --ag-side-bar-panel-width: var(--terra-data-grid-side-bar-panel-width);

        /* Borders & Radius */
        --ag-borders: var(--terra-data-grid-borders);
        --ag-border-radius: var(--terra-data-grid-border-radius);
        --ag-borders-side-button: var(--terra-data-grid-borders-side-button);
        --ag-side-button-selected-background-color: var(--terra-data-grid-side-button-selected-background-color);
        --ag-header-column-resize-handle-display: var(--terra-data-grid-header-column-resize-handle-display);
        --ag-header-column-resize-handle-width: var(--terra-data-grid-header-column-resize-handle-width);
        --ag-header-column-resize-handle-height: var(--terra-data-grid-header-column-resize-handle-height);

        /* Shadows */
        --ag-card-shadow: var(--terra-data-grid-card-shadow);
        --ag-popup-shadow: var(--terra-data-grid-popup-shadow);

        /* Transitions */
        --ag-selected-tab-underline-width: var(--terra-data-grid-selected-tab-underline-width);
        --ag-selected-tab-underline-transition-speed: var(--terra-data-grid-selected-tab-underline-transition-speed);

        /* Legacy support - keep for backwards compatibility */
        --terra-data-grid-border-color: var(--ag-border-color);
        --terra-data-grid-header-background: var(--ag-header-background-color);
        --terra-data-grid-row-hover: var(--ag-row-hover-color);
        --terra-data-grid-selected-row: var(--ag-selected-row-background-color);
    }

    .grid-container {
        position: relative;
        width: 100%;
        border: 1px solid var(--terra-data-grid-border-color);
        border-radius: var(--terra-border-radius-medium, 0.375rem);
        overflow: hidden;
        background: var(--terra-data-grid-background-color);
    }

    .grid {
        width: 100%;
    }

    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.9);
        z-index: 10;
        gap: var(--terra-spacing-small, 0.75rem);
    }

    /* Apply HDS token overrides to AG Grid theme classes */
    /* The variables are already set on :host, but we ensure they cascade to the grid */
    :host ::slotted(.ag-theme-alpine),

`
