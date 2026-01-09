import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraMap from '../map/map.component.js'
import TerraInput from '../input/input.component.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import { html, nothing } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'
import { parseBoundingBox, StringifyBoundingBox } from '../map/leaflet-utils.js'
import { property, query, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'
import { MapEventType } from '../map/type.js'

/**
 * @summary A component that allows input of coordinates and rendering of map.
 * @documentation https://terra-ui.netlify.app/components/spatial-picker
 * @status stable
 * @since 1.0
 *
 */
export default class TerraSpatialPicker extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-map': TerraMap,
        'terra-input': TerraInput,
        'terra-dropdown': TerraDropdown,
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

    @property({ attribute: 'url-state', type: Boolean })
    urlState: boolean = false

    @state()
    mapValue: any

    @state()
    error: string = ''

    dropdownRef = createRef<TerraDropdown>()

    @query('terra-input')
    terraInput: TerraInput

    @query('terra-map')
    map: TerraMap

    setValue(value: string) {
        try {
            this.mapValue = parseBoundingBox(value)
            this.error = ''
            if (this.terraInput) {
                this.terraInput.value = value
            }
            this._emitMapChange()
        } catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : 'Invalid spatial area (format: LAT, LNG or LAT, LNG, LAT, LNG)'
        }
    }

    private _input() {
        // Handle input changes - update the value as user types
        const value = this.terraInput?.value || ''
        // Don't validate on every keystroke, just update the value
        this.initialValue = value
    }

    private _change() {
        this._input()
        const inputValue = this.terraInput?.value || ''

        // If input is empty, explicitly clear the map
        if (!inputValue) {
            this.mapValue = []
            this.error = ''

            // Explicitly clear the map layers if map is ready
            // This ensures the bounding box is cleared even if the value watcher doesn't fire
            if (this.map?.map?.isMapReady) {
                this.map.map.clearLayers()
            }

            this._updateURLParam(null)
            return
        }

        this._blur()
    }

    private _blur() {
        try {
            this.mapValue = this.terraInput?.value
                ? parseBoundingBox(this.terraInput.value)
                : []

            this.error = ''
        } catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : 'Invalid spatial area (format: LAT, LNG or LAT, LNG, LAT, LNG)'
        }

        this._emitMapChange()
    }

    private _focus() {
        if (this.showMapOnFocus && !this.inline && this.dropdownRef.value) {
            this.dropdownRef.value.show()
        }
    }

    private _click(e: Event) {
        e.stopPropagation()
        if (!this.inline && this.dropdownRef.value) {
            if (this.isExpanded) {
                this.dropdownRef.value.hide()
            } else {
                this.dropdownRef.value.show()
            }
        }
    }

    private handleDropdownShow() {
        this.isExpanded = true
        setTimeout(() => this.invalidateSize(), 250)
    }

    private handleDropdownHide() {
        this.isExpanded = false
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
        if (!this.inline && this.dropdownRef.value) {
            this.dropdownRef.value.show()
        }
    }

    close() {
        if (!this.inline && this.dropdownRef.value) {
            this.dropdownRef.value.hide()
        }
    }

    setOpen(open: boolean) {
        if (open) {
            this.open()
        } else {
            this.close()
        }
    }

    private _updateURLParam(value: string | null) {
        if (!this.urlState) {
            return
        }

        const url = new URL(window.location.href)
        if (value) {
            url.searchParams.set('spatial', value)
        } else {
            url.searchParams.delete('spatial')
        }

        // Use history.replaceState to avoid creating a new history entry
        window.history.replaceState({}, '', url.toString())
    }

    private _handleMapChange(event: CustomEvent) {
        switch (event.detail.cause) {
            case 'clear':
                if (this.terraInput) {
                    this.terraInput.value = ''
                }
                // Reset spatial constraints to default value on map clear
                this.spatialConstraints = '-180, -90, 180, 90'
                this._updateURLParam(null)
                break

            case 'draw':
                let stringified = ''
                if (event.detail.bounds) {
                    stringified = StringifyBoundingBox(event.detail.bounds)
                    if (this.terraInput) {
                        this.terraInput.value = stringified
                    }
                } else if (event.detail.latLng) {
                    stringified = StringifyBoundingBox(event.detail.latLng)
                    if (this.terraInput) {
                        this.terraInput.value = stringified
                    }
                }
                this._updateURLParam(stringified)
                this._emitMapChange()
                break

            default:
                break
        }
    }

    firstUpdated() {
        const urlParams = new URLSearchParams(window.location.search)
        const spatialParam = urlParams.get('spatial')

        if (spatialParam && this.urlState) {
            this.initialValue = spatialParam
            this.mapValue = parseBoundingBox(spatialParam)
            if (this.terraInput) {
                this.terraInput.value = spatialParam
            }
        } else if (this.initialValue) {
            this.mapValue =
                this.initialValue === '' ? [] : parseBoundingBox(this.initialValue)
        }

        setTimeout(() => {
            this.invalidateSize()
        }, 500)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        // Dropdown handles its own cleanup
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

        // Inline mode: render directly without dropdown
        if (this.inline) {
            return html`
                <div class="spatial-picker">
                    <terra-input
                        .label=${this.label}
                        .hideLabel=${this.hideLabel}
                        .value=${this.initialValue}
                        placeholder="${this.spatialConstraints}"
                        aria-controls="map"
                        aria-expanded=${expanded}
                        @terra-input=${this._input}
                        @terra-change=${this._change}
                        @terra-blur=${this._blur}
                        resettable
                    >
                        <svg
                            slot="suffix"
                            class="spatial-picker__input_icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                            />
                        </svg>
                    </terra-input>
                    ${this.error
                        ? html`<div class="spatial-picker__error">${this.error}</div>`
                        : nothing}
                    <div
                        class="spatial-picker__map-container spatial-picker__map-container--inline"
                    >
                        ${this.renderMap()}
                    </div>
                </div>
            `
        }

        // Non-inline mode: use dropdown
        return html`
            <div class="spatial-picker">
                <terra-dropdown
                    ${ref(this.dropdownRef)}
                    placement="bottom-start"
                    distance="4"
                    @terra-show=${this.handleDropdownShow}
                    @terra-hide=${this.handleDropdownHide}
                    hoist
                >
                    <terra-input
                        slot="trigger"
                        .label=${this.label}
                        .hideLabel=${this.hideLabel}
                        .value=${this.initialValue}
                        placeholder="${this.spatialConstraints}"
                        aria-controls="map"
                        aria-expanded=${expanded}
                        @terra-input=${this._input}
                        @terra-change=${this._change}
                        @terra-blur=${this._blur}
                        @terra-focus=${this._focus}
                        @click=${(e: Event) => {
                            e.stopPropagation()
                            this._click(e)
                        }}
                        resettable
                    >
                        <svg
                            slot="suffix"
                            class="spatial-picker__input_icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            @click=${this._click}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                            />
                        </svg>
                    </terra-input>
                    <div
                        class="spatial-picker__map-container"
                        @click=${(e: Event) => e.stopPropagation()}
                    >
                        ${this.renderMap()}
                    </div>
                </terra-dropdown>
                ${this.error
                    ? html`<div class="spatial-picker__error">${this.error}</div>`
                    : nothing}
            </div>
        `
    }

    invalidateSize() {
        this.map?.invalidateSize()
    }
}
