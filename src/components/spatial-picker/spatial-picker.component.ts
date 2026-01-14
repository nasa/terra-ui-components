import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraMap from '../map/map.component.js'
import TerraInput from '../input/input.component.js'
import TerraDropdown from '../dropdown/dropdown.component.js'
import { html, nothing } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'
import { property, query, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'
import { MapEventType } from '../map/type.js'
import * as L from 'leaflet'

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
            this.mapValue = this._parseSpatialInput(value)
            this.error = ''
            if (this.terraInput) {
                this.terraInput.value = value
            }
            this._drawOnMap()
            this._emitMapChangeAfterDraw()
        } catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : 'Invalid spatial area (format: lat, lng for point or west, south, east, north for bounding box)'
        }
    }

    private _input() {
        // Handle input changes - update the value as user types
        const value = this.terraInput?.value || ''
        // Don't validate on every keystroke, just update the value
        this.initialValue = value
        // Clear any previous errors while typing
        if (this.terraInput) {
            this.terraInput.setCustomValidity('')
        }
        this.error = ''
    }

    private _change() {
        this._input()
        const inputValue = this.terraInput?.value || ''

        // If input is empty, explicitly clear the map
        if (!inputValue) {
            this.mapValue = []
            this.error = ''
            if (this.terraInput) {
                this.terraInput.setCustomValidity('')
            }

            // Explicitly clear the map layers if map is ready
            // This ensures the bounding box is cleared even if the value watcher doesn't fire
            if (this.map?.map?.isMapReady) {
                this.map.map.clearLayers()
            }

            this._updateURLParam(null)
            return
        }

        this._validateAndSetValue()
    }

    private _keydown(event: KeyboardEvent) {
        // Prevent space from opening dropdown when typing
        if (event.key === ' ') {
            event.stopPropagation()
            return
        }
        if (event.key === 'Enter') {
            event.preventDefault()
            this._validateAndSetValue()
            // Blur the input after validation
            if (this.terraInput) {
                this.terraInput.blur()
            }
        }
    }

    private _blur() {
        this._validateAndSetValue()
    }

    private _parseSpatialInput(input: string): any {
        // Parse input in format: "west, south, east, north" for bounding boxes
        // or "lat, lng" for points

        const coords = input.split(',').map(c => c.trim())

        if (coords.length === 2) {
            // Point format: "lat, lng"
            const lat = parseFloat(coords[0])
            const lng = parseFloat(coords[1])

            if (isNaN(lat) || isNaN(lng)) {
                throw new Error(
                    'All parts of the input string must be valid numbers.'
                )
            }

            return { lat, lng }
        }

        if (coords.length !== 4) {
            throw new Error('Input must contain exactly 2 or 4 numbers')
        }

        const [west, south, east, north] = coords.map(c => parseFloat(c))

        // Check if values are valid numbers
        if (coords.some(c => isNaN(parseFloat(c)))) {
            throw new Error('All parts of the input string must be valid numbers.')
        }

        // Convert "west, south, east, north" to Leaflet format: [[south, west], [north, east]]
        // Leaflet expects [[southwest], [northeast]] where each is [lat, lng]
        return [
            [south, west], // southwest corner [lat, lng]
            [north, east], // northeast corner [lat, lng]
        ]
    }

    private _validateCoordinateRange(parsed: any): boolean {
        // Validate that coordinates are within valid ranges
        // Latitude: -90 to 90
        // Longitude: -180 to 180

        if ('lat' in parsed && 'lng' in parsed) {
            // It's a point
            const lat = parsed.lat
            const lng = parsed.lng
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return false
            }
        } else if (Array.isArray(parsed) && parsed.length === 2) {
            // It's a bounding box
            // Format: [[south, west], [north, east]]
            const [[south, west], [north, east]] = parsed
            if (
                south < -90 ||
                south > 90 ||
                west < -180 ||
                west > 180 ||
                north < -90 ||
                north > 90 ||
                east < -180 ||
                east > 180
            ) {
                return false
            }
        }

        return true
    }

    private _validateAndSetValue() {
        const inputValue = this.terraInput?.value || ''

        // If input is empty, clear everything
        if (!inputValue.trim()) {
            this.mapValue = []
            this.error = ''
            if (this.terraInput) {
                this.terraInput.setCustomValidity('')
            }
            if (this.map?.map?.isMapReady) {
                this.map.map.clearLayers()
            }
            this._updateURLParam(null)
            return
        }

        // If both hide flags are true, skip validation
        if (this.hidePointSelection && this.hideBoundingBoxSelection) {
            // Don't validate, just try to parse and set
            try {
                const parsed = this._parseSpatialInput(inputValue)
                // Still check coordinate ranges even when both are hidden
                if (!this._validateCoordinateRange(parsed)) {
                    const errorMsg =
                        'Coordinates must be within valid range (lat: -90 to 90, lng: -180 to 180)'
                    this.error = errorMsg
                    if (this.terraInput) {
                        this.terraInput.setCustomValidity(errorMsg)
                    }
                    return
                }
                this.mapValue = parsed
                this.error = ''
                if (this.terraInput) {
                    this.terraInput.setCustomValidity('')
                }
                this._drawOnMap()
                this._emitMapChangeAfterDraw()
                this._updateURLParam(inputValue)
            } catch (error) {
                // If parsing fails, just clear
                this.mapValue = []
                this.error = ''
                if (this.terraInput) {
                    this.terraInput.setCustomValidity('')
                }
            }
            return
        }

        // Validate the input
        try {
            const parsed = this._parseSpatialInput(inputValue)
            const coordParts = inputValue.split(',').map(c => c.trim())
            const isPoint = coordParts.length === 2
            const isBoundingBox = coordParts.length === 4

            // Check coordinate ranges
            if (!this._validateCoordinateRange(parsed)) {
                const errorMsg =
                    'Coordinates must be within valid range (lat: -90 to 90, lng: -180 to 180)'
                this.error = errorMsg
                if (this.terraInput) {
                    this.terraInput.setCustomValidity(errorMsg)
                }
                return
            }

            // Check if point is allowed
            if (isPoint && this.hidePointSelection) {
                const errorMsg = this.hideBoundingBoxSelection
                    ? 'Must be a valid bounding box (west, south, east, north)'
                    : 'Must be a valid bounding box (west, south, east, north) - point selection is disabled'
                this.error = errorMsg
                if (this.terraInput) {
                    this.terraInput.setCustomValidity(errorMsg)
                }
                return
            }

            // Check if bounding box is allowed
            if (isBoundingBox && this.hideBoundingBoxSelection) {
                const errorMsg = this.hidePointSelection
                    ? 'Must be a valid point (lat, lng)'
                    : 'Must be a valid point (lat, lng) - bounding box selection is disabled'
                this.error = errorMsg
                if (this.terraInput) {
                    this.terraInput.setCustomValidity(errorMsg)
                }
                return
            }

            // Validation passed - set the value and draw on map
            this.mapValue = parsed
            this.error = ''
            if (this.terraInput) {
                this.terraInput.setCustomValidity('')
            }
            this._drawOnMap()
            this._emitMapChangeAfterDraw()
            this._updateURLParam(inputValue)
        } catch (error) {
            // Build contextual error message
            let errorMsg = 'Invalid format'
            if (this.hidePointSelection && !this.hideBoundingBoxSelection) {
                errorMsg = 'Must be a valid bounding box (west, south, east, north)'
            } else if (!this.hidePointSelection && this.hideBoundingBoxSelection) {
                errorMsg = 'Must be a valid point (lat, lng)'
            } else if (!this.hidePointSelection && !this.hideBoundingBoxSelection) {
                errorMsg =
                    'Must be a valid point (lat, lng) or bounding box (west, south, east, north)'
            }

            this.error = errorMsg
            if (this.terraInput) {
                this.terraInput.setCustomValidity(errorMsg)
            }
        }
    }

    private _drawOnMap() {
        if (!this.map?.map?.isMapReady || !this.mapValue) {
            return
        }

        // Clear existing layers
        this.map.map.clearLayers()

        // Draw based on the parsed value
        if (this.mapValue && typeof this.mapValue === 'object') {
            if ('lat' in this.mapValue && 'lng' in this.mapValue) {
                // It's a point - draw a marker
                L.marker(this.mapValue as L.LatLngExpression, {
                    icon: L.icon({
                        iconUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconAnchor: [15, 40],
                        shadowUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    }),
                }).addTo(this.map.map.editableLayers)
                this.map.map.map.setView(this.mapValue, 5)
            } else if (Array.isArray(this.mapValue) && this.mapValue.length === 2) {
                // It's a bounding box in format [[south, west], [north, east]]
                // This is the correct format for Leaflet's L.rectangle
                this.map.map.setValue(this.mapValue)
            }
        }
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

    private _emitMapChangeAfterDraw() {
        // Emit map change event after programmatically drawing
        // This is needed to notify listeners that the map value has changed
        if (!this.mapValue) {
            return
        }

        if ('lat' in this.mapValue && 'lng' in this.mapValue) {
            // It's a point
            const latLng = this.mapValue as L.LatLng
            const layer = this.map?.getDrawLayer()
            this.emit('terra-map-change', {
                detail: {
                    type: MapEventType.POINT,
                    cause: 'draw',
                    latLng: latLng,
                    geoJson: layer?.toGeoJSON(),
                },
            })
        } else if (Array.isArray(this.mapValue) && this.mapValue.length === 2) {
            // It's a bounding box - convert array to LatLngBounds
            const bounds = L.latLngBounds(
                this.mapValue as [[number, number], [number, number]]
            )
            const layer = this.map?.getDrawLayer()
            this.emit('terra-map-change', {
                detail: {
                    type: MapEventType.BBOX,
                    cause: 'draw',
                    bounds: bounds,
                    geoJson: layer?.toGeoJSON(),
                },
            })
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
                    // Convert from Leaflet bounds to west, south, east, north format
                    const bounds = event.detail.bounds
                    const west = bounds._southWest.lng
                    const south = bounds._southWest.lat
                    const east = bounds._northEast.lng
                    const north = bounds._northEast.lat
                    stringified = `${west.toFixed(2)}, ${south.toFixed(2)}, ${east.toFixed(2)}, ${north.toFixed(2)}`
                    if (this.terraInput) {
                        this.terraInput.value = stringified
                    }
                    // Update mapValue to our internal format [[south, west], [north, east]]
                    this.mapValue = [
                        [south, west],
                        [north, east],
                    ]
                } else if (event.detail.latLng) {
                    // Point format: lat, lng
                    const latLng = event.detail.latLng
                    stringified = `${latLng.lat.toFixed(2)}, ${latLng.lng.toFixed(2)}`
                    if (this.terraInput) {
                        this.terraInput.value = stringified
                    }
                    this.mapValue = { lat: latLng.lat, lng: latLng.lng }
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
            try {
                this.mapValue = this._parseSpatialInput(spatialParam)
            } catch (e) {
                this.mapValue = []
            }
            if (this.terraInput) {
                this.terraInput.value = spatialParam
            }
        } else if (this.initialValue) {
            try {
                this.mapValue =
                    this.initialValue === ''
                        ? []
                        : this._parseSpatialInput(this.initialValue)
            } catch (e) {
                this.mapValue = []
            }
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
                        @keydown=${this._keydown}
                        resettable
                        name="spatial"
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
                        @keydown=${this._keydown}
                        @click=${(e: Event) => {
                            e.stopPropagation()
                            this._click(e)
                        }}
                        resettable
                        name="spatial"
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
