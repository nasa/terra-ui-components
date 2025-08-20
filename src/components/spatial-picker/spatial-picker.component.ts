import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraMap from '../map/map.component.js'
import { html, nothing } from 'lit'
import { parseBoundingBox, StringifyBoundingBox } from '../map/leaflet-utils.js'
import { property, query, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'
import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
import { MapEventType } from '../map/type.js'

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

    @state()
    error: string = ''

    @query('.spatial-picker__input')
    spatialInput: HTMLInputElement

    @query('terra-map')
    map: TerraMap

    setValue(value: string) {
        try {
            this.mapValue = parseBoundingBox(value)
            this.error = ''

            this._emitMapChange()
        } catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : 'Invalid spatial area (format: LAT, LNG or LAT, LNG, LAT, LNG)'
        }
    }

    private _blur(e: FocusEvent) {
        try {
            this.mapValue = this.spatialInput.value
                ? parseBoundingBox(this.spatialInput.value)
                : []

            this.error = ''
        } catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : 'Invalid spatial area (format: LAT, LNG or LAT, LNG, LAT, LNG)'
        }

        this._emitMapChange()

        // Don't hide if clicking within the map component
        const relatedTarget = e.relatedTarget as HTMLElement
        if (!relatedTarget?.closest('terra-map')) {
            this.isExpanded = false
        }
    }

    private _focus() {
        if (this.showMapOnFocus) {
            this.isExpanded = true
        }
    }

    private _click() {
        this.isExpanded = !this.isExpanded
    }

    private _emitMapChange() {
        const layer = this.map?.getDrawLayer()

        if (!layer) {
            return
        }

        if ('getLatLng' in layer) {
            this.mapValue = layer.getLatLng()

            this.emit('terra-map-change', {
                detail: {
                    type: MapEventType.POINT,
                    cause: 'draw',
                    latLng: this.mapValue,
                    geoJson: layer.toGeoJSON(),
                },
            })
        } else if ('getBounds' in layer) {
            this.mapValue = layer.getBounds()

            this.emit('terra-map-change', {
                detail: {
                    type: MapEventType.BBOX,
                    cause: 'draw',
                    bounds: this.mapValue,
                    geoJson: layer.toGeoJSON(),
                },
            })
        } else {
            this.mapValue = []
        }
    }

    open() {
        this.isExpanded = true
    }

    close() {
        this.isExpanded = false
    }

    private _handleMapChange(event: TerraMapChangeEvent) {
        switch (event.detail.cause) {
            case 'clear':
                this.spatialInput.value = ''
                break

            case 'draw':
                if (event.detail.type === MapEventType.BBOX) {
                    this.spatialInput.value = StringifyBoundingBox(
                        event.detail.bounds
                    )
                } else if (event.detail.type === MapEventType.POINT) {
                    this.spatialInput.value = StringifyBoundingBox(
                        event.detail.latLng
                    )
                }

                this._emitMapChange()

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
                ${this.error
                    ? html`<div class="spatial-picker__error">${this.error}</div>`
                    : nothing}
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
