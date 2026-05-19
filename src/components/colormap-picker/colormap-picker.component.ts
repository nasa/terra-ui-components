import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './colormap-picker.styles.js'
import type { CSSResultGroup } from 'lit'
import type { ColormapCategory, ColormapEntry } from './colormap-picker.types.js'

export { type ColormapCategory, type ColormapEntry }

const COLORMAPS: ColormapEntry[] = [
    // Sequential
    {
        name: 'viridis',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #440154, #31688e, #35b779, #fde725)',
    },
    {
        name: 'plasma',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #0d0887, #7e03a8, #cc4778, #f89540, #f0f921)',
    },
    {
        name: 'inferno',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #000004, #420a68, #932667, #dd513a, #fca50a, #fcffa4)',
    },
    {
        name: 'magma',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #000004, #3b0f70, #8c2981, #de4968, #fe9f6d, #fcfdbf)',
    },
    {
        name: 'cividis',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #00204c, #31446b, #666870, #9b9b74, #d5c253, #ffea46)',
    },
    {
        name: 'blues',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #f7fbff, #c6dbef, #6baed6, #2171b5, #08306b)',
    },
    {
        name: 'greens',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #f7fcf5, #c7e9c0, #74c476, #238b45, #00441b)',
    },
    {
        name: 'reds',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #fff5f0, #fcbba1, #fb6a4a, #cb181d, #67000d)',
    },
    {
        name: 'oranges',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #fff5eb, #fdd0a2, #fd8d3c, #d94701, #7f2704)',
    },
    {
        name: 'YlOrRd',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #ffffcc, #fed976, #fd8d3c, #f03b20, #bd0026)',
    },
    {
        name: 'YlGnBu',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #ffffd9, #c7e9b4, #41b6c4, #1d91c0, #225ea8, #0c2c84)',
    },
    {
        name: 'hot',
        category: 'sequential',
        gradient: 'linear-gradient(to right, #000000, #ff0000, #ffff00, #ffffff)',
    },
    // Diverging
    {
        name: 'RdBu',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #67001f, #d6604d, #f7f7f7, #4393c3, #053061)',
    },
    {
        name: 'RdYlBu',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #d73027, #fdae61, #ffffbf, #74add1, #4575b4)',
    },
    {
        name: 'coolwarm',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #3b4cc0, #6b87d0, #f7f7f7, #dd8b63, #b40426)',
    },
    {
        name: 'Spectral',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #9e0142, #f46d43, #ffffbf, #66c2a5, #3288bd, #5e4fa2)',
    },
    {
        name: 'BrBG',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #543005, #bf812d, #f6e8c3, #c7eae5, #35978f, #003c30)',
    },
    {
        name: 'PiYG',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #8e0152, #de77ae, #f7f7f7, #7fbc41, #276419)',
    },
    {
        name: 'PRGn',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #40004b, #9970ab, #f7f7f7, #5aae61, #00441b)',
    },
    {
        name: 'seismic',
        category: 'diverging',
        gradient: 'linear-gradient(to right, #00004d, #0000ff, #ffffff, #ff0000, #800000)',
    },
    // Qualitative
    {
        name: 'tab10',
        category: 'qualitative',
        gradient:
            'linear-gradient(to right, #1f77b4 10%, #ff7f0e 10% 20%, #2ca02c 20% 30%, #d62728 30% 40%, #9467bd 40% 50%, #8c564b 50% 60%, #e377c2 60% 70%, #7f7f7f 70% 80%, #bcbd22 80% 90%, #17becf 90%)',
    },
    {
        name: 'Set1',
        category: 'qualitative',
        gradient:
            'linear-gradient(to right, #e41a1c 12.5%, #377eb8 12.5% 25%, #4daf4a 25% 37.5%, #984ea3 37.5% 50%, #ff7f00 50% 62.5%, #a65628 62.5% 75%, #f781bf 75% 87.5%, #999999 87.5%)',
    },
    {
        name: 'Set2',
        category: 'qualitative',
        gradient:
            'linear-gradient(to right, #66c2a5 12.5%, #fc8d62 12.5% 25%, #8da0cb 25% 37.5%, #e78ac3 37.5% 50%, #a6d854 50% 62.5%, #ffd92f 62.5% 75%, #e5c494 75% 87.5%, #b3b3b3 87.5%)',
    },
    {
        name: 'Pastel1',
        category: 'qualitative',
        gradient:
            'linear-gradient(to right, #fbb4ae 12.5%, #b3cde3 12.5% 25%, #ccebc5 25% 37.5%, #decbe4 37.5% 50%, #fed9a6 50% 62.5%, #ffffcc 62.5% 75%, #e5d8bd 75% 87.5%, #fddaec 87.5%)',
    },
]

const CATEGORIES: { value: ColormapCategory; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'sequential', label: 'Sequential' },
    { value: 'diverging', label: 'Diverging' },
    { value: 'qualitative', label: 'Qualitative' },
]

/**
 * @summary A colormap picker for selecting scientific data color scales.
 * @documentation https://terra-ui.netlify.app/components/colormap-picker
 * @status stable
 * @since 0.0.189
 *
 * @event terra-colormap-change - Emitted when the selected colormap changes. The event detail contains `{ value: string }`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart filter - The category filter bar.
 * @csspart filter-button - An individual category filter button.
 * @csspart grid - The colormap swatch grid.
 * @csspart swatch - An individual colormap swatch.
 * @csspart swatch-gradient - The gradient strip inside a swatch.
 * @csspart swatch-label - The colormap name label inside a swatch.
 */
export default class TerraColormapPicker extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The currently selected colormap name. */
    @property({ reflect: true }) value: string = 'viridis'

    /** Filters the displayed colormaps by category. */
    @property({ reflect: true }) category: ColormapCategory = 'all'

    /** Disables the picker. */
    @property({ type: Boolean, reflect: true }) disabled = false

    @state() private _filter: ColormapCategory = 'all'

    #select(name: string) {
        if (this.disabled || name === this.value) return
        this.value = name
        this.emit('terra-colormap-change', { detail: { value: name } })
    }

    #renderFilterBar() {
        return html`
            <div part="filter" class="colormap-picker__filter" role="tablist" aria-label="Filter colormaps by category">
                ${CATEGORIES.map(
                    ({ value, label }) => html`
                        <button
                            part="filter-button"
                            role="tab"
                            class=${classMap({
                                'colormap-picker__filter-btn': true,
                                'colormap-picker__filter-btn--active': this._filter === value,
                            })}
                            aria-selected=${this._filter === value}
                            ?disabled=${this.disabled}
                            @click=${() => { this._filter = value }}
                        >
                            ${label}
                        </button>
                    `
                )}
            </div>
        `
    }

    #renderGrid() {
        const visible = COLORMAPS.filter(
            (cm) => this._filter === 'all' || cm.category === this._filter
        )

        return html`
            <div part="grid" class="colormap-picker__grid" role="listbox" aria-label="Colormap options">
                ${visible.map(
                    (cm) => html`
                        <button
                            part="swatch"
                            role="option"
                            class=${classMap({
                                'colormap-picker__swatch': true,
                                'colormap-picker__swatch--selected': this.value === cm.name,
                            })}
                            aria-selected=${this.value === cm.name}
                            aria-label=${cm.name}
                            title=${cm.name}
                            ?disabled=${this.disabled}
                            @click=${() => this.#select(cm.name)}
                            @keydown=${(e: KeyboardEvent) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    this.#select(cm.name)
                                }
                            }}
                        >
                            <span
                                part="swatch-gradient"
                                class="colormap-picker__swatch-gradient"
                                style="background: ${cm.gradient}"
                            ></span>
                            <span part="swatch-label" class="colormap-picker__swatch-label">${cm.name}</span>
                        </button>
                    `
                )}
            </div>
        `
    }

    render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    'colormap-picker': true,
                    'colormap-picker--disabled': this.disabled,
                })}
            >
                ${this.#renderFilterBar()}
                ${this.#renderGrid()}
            </div>
        `
    }
}
