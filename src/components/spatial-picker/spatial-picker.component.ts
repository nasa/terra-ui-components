import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import EduxElement from '../../internal/edux-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'

import { property, state } from 'lit/decorators.js'
import EduxMap from '../map/map.component.js'
import { parseBoundingBox } from '../map/services/leaflet-utils.js'

/**
 * @summary A component that allows input of coordinates and rendering of map.
 * @documentation https://disc.gsfc.nasa.gov/components/spatial-picker
 * @status experimental
 * @since 1.0
 *
 */
export default class EduxSpatialPicker extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'edux-map': EduxMap,
    }

    /**
     * Minimum zoom level of the map.
     */
    @property({ attribute: 'min-zoom', type: Number })
    minZoom: number = 0

    /**
     * Maximum zoom level of the map.
     */
    @property({ attribute: 'max-zoom', type: Number })
    maxZoom: number = 23

    /**
     * Initial map zoom level
     */
    @property({ type: Number }) zoom: number = 1

    /*
     * width of the map
     */
    @property({ type: Number }) width: number

    /**
     * height of the map
     */
    @property({ type: Number }) height: number = 336

    /**
     * show map navigation toolbar
     */
    @property({ attribute: 'show-navigation', type: Boolean })
    showNavigation: boolean = true

    /**
     * show coordinate tracker
     */
    @property({ attribute: 'show-coord-tracker', type: Boolean })
    showCoordTracker: boolean = true

    /**
     * show shape selector
     */
    @property({ attribute: 'show-shape-selector', type: Boolean })
    showShapeSelector: boolean = false

    @state()
    showMap: boolean = false

    @state()
    mapValue: any

    private _blur(e: Event) {
        const inputValue = (e.target as HTMLInputElement).value

        this.mapValue = inputValue === '' ? [] : parseBoundingBox(inputValue)
    }

    private _click() {
        this.showMap = !this.showMap
    }

    renderMap() {
        return html`<edux-map
            min-zoom=${this.minZoom}
            max-zoom=${this.maxZoom}
            zoom=${this.zoom}
            width=${this.width ? this.width : this.getBoundingClientRect().width - 64}
            height=${this.height}
            ?show-coord-tracker=${this.showCoordTracker}
            .value=${this.mapValue}
            ?show-navigation=${this.showNavigation}
            ?show-shape-selector=${this.showShapeSelector}
        >
        </edux-map>`
    }

    render() {
        return html`
            <div class="spatial-picker">
                <div class="spatial-picker__input_fields">
                    <input
                        type="text"
                        class="spatial-picker__input form-control input"
                        placeholder="-180, -90, 180, 90"
                        @blur=${this._blur}
                    />
                    <edux-button
                        shape="square-left"
                        class="spatial-picker__input_icon_button"
                        @click=${this._click}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                            />
                        </svg>
                    </edux-button>                    
                </div>
                ${this.showMap ? this.renderMap() : null}
            </div>
        `
    }
}
