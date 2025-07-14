import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraMap from '../map/map.component.js'
import { html, nothing } from 'lit'
import { parseBoundingBox, StringifyBoundingBox } from '../map/leaflet-utils.js'
import { property, query, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A component that allows input of coordinates and rendering of map.
 * @documentation https://disc.gsfc.nasa.gov/components/spatial-picker
 * @status experimental
 * @since 1.0
 *
 */
export default class TerraSpatialPicker extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-map': TerraMap,
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

    /**
     * has map navigation toolbar
     */
    @property({ attribute: 'has-navigation', type: Boolean })
    hasNavigation: boolean = true

    /**
     * has coordinate tracker
     */
    @property({ attribute: 'has-coord-tracker', type: Boolean })
    hasCoordTracker: boolean = true

    /**
     * has shape selector
     */
    @property({ attribute: 'has-shape-selector', type: Boolean })
    hasShapeSelector: boolean = false

    @property({ attribute: 'hide-bounding-box-selection', type: Boolean })
    hideBoundingBoxSelection?: boolean

    @property({ attribute: 'hide-point-selection', type: Boolean })
    hidePointSelection?: boolean

    /**
     * initialValue of spatial picker
     */
    @property({ attribute: 'initial-value' })
    initialValue: string = ''

    /**
     * Hide the combobox's label text.
     * When hidden, still presents to screen readers.
     */
    @property({ attribute: 'hide-label', type: Boolean })
    hideLabel = false

    /**
     *  spatial picker label
     */
    @property()
    label: string = 'Select Region'

    /**
     * Spatial constraints for the map (default: '-180, -90, 180, 90')
     */
    @property({ attribute: 'spatial-constraints' })
    spatialConstraints: string = '-180, -90, 180, 90'

    @property({ attribute: 'is-expanded', type: Boolean, reflect: true })
    isExpanded: boolean = false

    /**
     * Whether the map should be shown inline, or as part of the normal content flow
     * the default is false, the map is positioned absolute under the input
     */
    @property({ type: Boolean })
    inline: boolean = false

    /**
     * Whether the map should show automatically when the input is focused
     */
    @property({ attribute: 'show-map-on-focus', type: Boolean })
    showMapOnFocus: boolean = false

    @state()
    mapValue: any

    @query('.spatial-picker__input')
    spatialInput: HTMLInputElement

    @query('terra-map')
    map: TerraMap

    private _blur(e: FocusEvent) {
        const inputValue = (e.target as HTMLInputElement).value

        if (inputValue === '') {
            this.mapValue = []
        } else {
            const parsedValue = parseBoundingBox(inputValue)

            if (Array.isArray(parsedValue)) {
                this.mapValue = parsedValue.map((coordArray: number[]) => {
                    // Round each number in the inner array (lat, lng) to 2 decimal places
                    return coordArray.map((coord: number) =>
                        parseFloat(coord.toFixed(2))
                    )
                })
            } else if (
                parsedValue &&
                typeof parsedValue === 'object' &&
                'lat' in parsedValue &&
                'lng' in parsedValue
            ) {
                // Handle lat/lng object
                const { lat, lng } = parsedValue
                this.mapValue = {
                    lat: parseFloat(lat.toFixed(2)),
                    lng: parseFloat(lng.toFixed(2)),
                }
            } else {
                this.mapValue = []
            }
        }

        // Don't hide if clicking within the map component
        const relatedTarget = e.relatedTarget as HTMLElement
        if (!relatedTarget?.closest('terra-map')) {
            this.isExpanded = false
        }

        this.emit('terra-map-change', {
            detail: {
                cause: 'draw',
                latLng: this.mapValue,
                geoJson: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [this.mapValue.lng, this.mapValue.lat],
                    },
                    properties: {},
                },
            },
        })
    }

    private _focus() {
        if (this.showMapOnFocus) {
            this.isExpanded = true
        }
    }

    private _click() {
        this.isExpanded = !this.isExpanded
    }

    open() {
        this.isExpanded = true
    }

    close() {
        this.isExpanded = false
    }

    private _handleMapChange(event: CustomEvent) {
        switch (event.detail.cause) {
            case 'clear':
                this.spatialInput.value = ''
                // Reset spatial constraints to default value on map clear
                this.spatialConstraints = '-180, -90, 180, 90'
                break

            case 'draw':
                if (event.detail.bounds) {
                    this.spatialInput.value = StringifyBoundingBox(
                        event.detail.bounds
                    )
                } else if (event.detail.latLng) {
                    this.spatialInput.value = StringifyBoundingBox(
                        event.detail.latLng
                    )
                }
                break

            default:
                break
        }
    }

    firstUpdated() {
        if (this.initialValue) {
            this.mapValue =
                this.initialValue === '' ? [] : parseBoundingBox(this.initialValue)
        }

        setTimeout(() => {
            this.invalidateSize()
        }, 500)
    }

    renderMap() {
        return html`<terra-map
            class="${this.inline ? 'inline' : ''}"
            exportparts="map, leaflet-bbox, leaflet-point, leaflet-edit, leaflet-remove"
            min-zoom=${this.minZoom}
            max-zoom=${this.maxZoom}
            zoom=${this.zoom}
            ?has-coord-tracker=${this.hasCoordTracker}
            .value=${this.mapValue}
            ?has-navigation=${this.hasNavigation}
            ?has-shape-selector=${this.hasShapeSelector}
            ?hide-bounding-box-selection=${this.hideBoundingBoxSelection}
            ?hide-point-selection=${this.hidePointSelection}
            @terra-map-change=${this._handleMapChange}
        >
        </terra-map>`
    }

    render() {
        const expanded = this.inline ? true : this.isExpanded
        return html`
            <div class="spatial-picker">
                <label
                    for="spatial-picker__input"
                    class=${this.hideLabel
                        ? 'sr-only'
                        : 'spatial-picker__input_label'}
                    >${this.label}</label
                >
                <div class="spatial-picker__input_fields">
                    <input
                        id="spatial-picker__input"
                        value=${this.initialValue}
                        type="text"
                        class="spatial-picker__input form-control"
                        placeholder="${this.spatialConstraints}"
                        aria-controls="map"
                        aria-expanded=${expanded}
                        @blur=${this._blur}
                        @focus=${this._focus}
                    />
                    <terra-button
                        shape="square-left"
                        class="spatial-picker__input_icon_button"
                        @click=${this._click}
                        type="button"
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
                    </terra-button>
                </div>
                ${expanded
                    ? html`<div
                          style="${this.inline
                              ? 'position: static; width: 100%;'
                              : ''}"
                      >
                          ${this.renderMap()}
                      </div>`
                    : nothing}
            </div>
        `
    }

    invalidateSize() {
        this.map?.invalidateSize()
    }
}
