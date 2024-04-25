/* eslint-disable */

import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import GDElement from '../../internal/gd-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'

import 'leaflet-draw'
import { property, state } from 'lit/decorators.js'
import GdMap from '../map/map.component.js'
import { parseBoundingBox } from '../map/services/leaflet-utils.js'

// This is needed to fix the error: Uncaught ReferenceError: type is not defined
// @ts-ignore
window.type = ''

/**
 * @summary A component that allows input of coordinates and rendering of map --example - '-180, -90, 180, 90'
 * @documentation https://disc.gsfc.nasa.gov/components/spatial-picker
 * @status experimental
 * @since 1.0
 *
 * @dependency gd-map
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class GdSpatialPicker extends GDElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'gd-map': GdMap,
    }

    /**
     * Minimum zoom level of the map.
     */
    @property({ attribute: 'min-zoom', type: Number, reflect: true })
    minZoom: number = 0

    /**
     * Maximum zoom level of the map.
     */
    @property({ attribute: 'max-zoom', type: Number, reflect: true })
    maxZoom: number = 23

    /**
     * Initial map zoom level
     */
    @property({ type: Number, reflect: true }) zoom: number = 1

    /*
     * width of the map
     */
    @property({ type: Number, reflect: true }) width: number

    /**
     * height of the map
     */
    @property({ type: Number, reflect: true }) height: number = 336

    /**
     * show map navigation toolbar
     */
    @property({ attribute: 'show-navigation', type: Boolean, reflect: true })
    showNavigation: boolean = true

    /**
     * mouse coordinate tracker
     */
    @property({ attribute: 'mouse-position', type: Boolean, reflect: true })
    mousePosition: boolean = true

    @state()
    showMap: boolean = false

    @state()
    mapValue: any

    private _blur(e: Event) {
        const boundingBox: any = parseBoundingBox(
            (e.target as HTMLInputElement).value
        )

        this.mapValue = boundingBox
    }

    private _click(e: Event) {
        this.showMap = !this.showMap
    }

    renderMap() {
        return html`<gd-map
            min-zoom=${this.minZoom}
            max-zoom=${this.maxZoom}
            zoom=${this.zoom}
            width=${this.width ? this.width : this.getBoundingClientRect().width - 64}
            height=${this.height}
            ?mouse-position=${this.mousePosition}
            .value=${this.mapValue}
        >
        </gd-map>`
    }

    render() {
        return html`
            <!-- @ts-ignore -->
            <style>
                @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
                @import url('https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css');
            </style>
            <div class="spatial-picker">
                <div class="spatial-picker__input_fields">
                    <input
                        type="text"
                        class="spatial-picker__input form-control"
                        placeholder="-180, -90, 180, 90"
                        @blur=${this._blur}
                    />
                    <button
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
                    </button>
                </div>
                ${this.showMap ? this.renderMap() : null}
            </div>
        `
    }
}
