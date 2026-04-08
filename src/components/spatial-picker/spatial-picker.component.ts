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
import type { MapEventDetail } from '../map/type.js'
import { MapEventType } from '../map/type.js'
import { LatLng } from '../map/models/LatLng.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'
import { SpatialPickerService } from './spatial-picker.service.js'

/**
 * @summary A component that allows input of coordinates and rendering of map.
 * @documentation https://terra-ui.netlify.app/components/spatial-picker
 * @status stable
 * @since 1.0
 */
export default class TerraSpatialPicker extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-map': TerraMap,
        'terra-input': TerraInput,
        'terra-dropdown': TerraDropdown,
    }

    @property({ attribute: 'min-zoom', type: Number }) minZoom: number = 0
    @property({ attribute: 'max-zoom', type: Number }) maxZoom: number = 23
    @property({ type: Number }) zoom: number = 1
    @property({ attribute: 'has-navigation', type: Boolean }) hasNavigation: boolean =
        true
    @property({ attribute: 'has-coord-tracker', type: Boolean })
    hasCoordTracker: boolean = true
    @property({ attribute: 'has-shape-selector', type: Boolean })
    hasShapeSelector: boolean = false

    /**
     * Whether bounding box selection is allowed via the draw toolbar.
     * Mirrors the terra-map attribute name for consistency.
     */
    @property({ attribute: 'show-bounding-box-selection', type: Boolean })
    showBoundingBoxSelection: boolean = true

    /**
     * @deprecated Use show-bounding-box-selection instead.
     */
    @property({ attribute: 'hide-bounding-box-selection', type: Boolean })
    set hideBoundingBoxSelection(value: boolean) {
        console.warn(
            '"hide-bounding-box-selection" is deprecated. Use "show-bounding-box-selection" instead.'
        )
        this.showBoundingBoxSelection = !value
    }
    get hideBoundingBoxSelection() {
        return !this.showBoundingBoxSelection
    }

    /**
     * Whether point selection is allowed via the draw toolbar.
     */
    @property({ attribute: 'show-point-selection', type: Boolean })
    showPointSelection: boolean = true

    /**
     * @deprecated Use show-point-selection instead.
     */
    @property({ attribute: 'hide-point-selection', type: Boolean })
    set hidePointSelection(value: boolean) {
        console.warn(
            '"hide-point-selection" is deprecated. Use "show-point-selection" instead.'
        )
        this.showPointSelection = !value
    }
    get hidePointSelection() {
        return !this.showPointSelection
    }

    /** Initial/current value of the picker. */
    @property({ attribute: 'initial-value' }) initialValue: string = ''

    @property({ attribute: 'hide-label', type: Boolean }) hideLabel = false
    @property() label: string = 'Select Region'

    /**
     * Spatial constraints extent: 'west, south, east, north'.
     * Draws a visual overlay on the map and rejects draws outside this area.
     */
    @property({ attribute: 'spatial-constraints' })
    spatialConstraints: string = '-180, -90, 180, 90'

    @property({ attribute: 'is-expanded', type: Boolean, reflect: true })
    isExpanded: boolean = false

    @property({ attribute: 'no-world-wrap', type: Boolean }) noWorldWrap: boolean =
        false
    @property({ type: Boolean }) inline: boolean = false
    @property({ attribute: 'show-map-on-focus', type: Boolean })
    showMapOnFocus: boolean = false
    @property({ attribute: 'url-state', type: Boolean }) urlState: boolean = false
    @property({ attribute: 'help-text' }) helpText = ''

    /** The canonical serialized value passed down to terra-map. */
    @state() private mapValue: string | undefined

    @state() error: string = ''

    dropdownRef = createRef<TerraDropdown>()

    @query('terra-input') terraInput: TerraInput
    @query('terra-map') map: TerraMap

    // ─── Derived helpers ───────────────────────────────────────────────────────

    private get _allowedTypes() {
        return {
            allowPoint: this.showPointSelection,
            allowBbox: this.showBoundingBoxSelection,
        }
    }

    firstUpdated() {
        const urlParams = new URLSearchParams(window.location.search)
        const spatialParam = urlParams.get('spatial')
        const seed = this.urlState && spatialParam ? spatialParam : this.initialValue

        if (seed) {
            this._applyValue(seed, { emit: false })
        }
    }

    // ─── Public API ────────────────────────────────────────────────────────────

    setValue(value: string) {
        this._applyValue(value, { emit: true })
    }

    open() {
        if (!this.inline) this.dropdownRef.value?.show()
    }

    close() {
        if (!this.inline) this.dropdownRef.value?.hide()
    }

    setOpen(open: boolean) {
        open ? this.open() : this.close()
    }

    // ─── Input event handlers ──────────────────────────────────────────────────

    private _input() {
        // Clear error while the user is still typing
        this.error = ''
        this.terraInput?.setCustomValidity('')
    }

    private _change() {
        this._input()
        const raw = this.terraInput?.value ?? ''

        if (!raw.trim()) {
            this._clearValue()
            return
        }

        this._validateAndCommit(raw)
    }

    private _keydown(event: KeyboardEvent) {
        if (event.key === ' ') {
            event.stopPropagation()
            return
        }
        if (event.key === 'Enter') {
            event.preventDefault()
            this._validateAndCommit(this.terraInput?.value ?? '')
            this.terraInput?.blur()
        }
    }

    private _blur() {
        this._validateAndCommit(this.terraInput?.value ?? '')
    }

    private _focus() {
        if (this.showMapOnFocus && !this.inline) {
            this.dropdownRef.value?.show()
        }
    }

    private _click(e: Event) {
        e.stopPropagation()
        if (!this.inline) {
            this.isExpanded ? this.close() : this.open()
        }
    }

    // ─── Map event handler ─────────────────────────────────────────────────────

    private _handleMapChange(event: CustomEvent<MapEventDetail>) {
        const detail = event.detail

        if (detail.cause === 'clear') {
            this._clearValue()
            return
        }

        if (detail.cause !== 'draw') return

        let value: LatLng | LatLngBounds | undefined

        if (detail.type === MapEventType.BBOX && detail.bounds) {
            value = detail.bounds
        } else if (detail.type === MapEventType.POINT && detail.latLng) {
            value = detail.latLng
        }
        // polygon / circle: not yet supported in the input field — just re-emit
        else {
            this.emit('terra-map-change', { detail })
            return
        }

        // Validate against constraints before accepting the draw
        const constraintError = SpatialPickerService.validateConstraints(
            value,
            this.spatialConstraints
        )
        if (constraintError) {
            this.error = constraintError
            // Tell the map to revert by clearing mapValue (it will get undefined → no feature)
            this.mapValue = undefined
            return
        }

        const serialized = SpatialPickerService.serialize(value)
        this._commit(serialized, value)
    }

    // ─── Dropdown handlers ─────────────────────────────────────────────────────

    private handleDropdownShow() {
        this.isExpanded = true
    }

    private handleDropdownHide() {
        this.isExpanded = false
    }

    // ─── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Parse, validate and commit a raw string value.
     */
    private _validateAndCommit(raw: string) {
        if (!raw.trim()) {
            this._clearValue()
            return
        }

        const result = SpatialPickerService.validate(
            raw,
            this._allowedTypes,
            this.spatialConstraints
        )

        if (!result.ok) {
            this.error = result.error
            this.terraInput?.setCustomValidity(result.error)
            return
        }

        this._commit(result.serialized, result.value)
    }

    /**
     * Apply a value string without going through the validation pipeline
     * (used for initialValue / setValue where we still want to display what
     * was given, but we do want to show an error if it's malformed).
     */
    private _applyValue(raw: string, { emit }: { emit: boolean }) {
        const result = SpatialPickerService.validate(
            raw,
            this._allowedTypes,
            this.spatialConstraints
        )

        if (!result.ok) {
            this.error = result.error
            return
        }

        this.error = ''
        this.mapValue = result.serialized
        if (this.terraInput) this.terraInput.value = result.serialized

        if (emit) {
            this._emitChange(result.value)
        }

        this._updateURLParam(result.serialized)
    }

    /**
     * Commit a validated value: sync UI, mapValue, URL, and emit.
     */
    private _commit(serialized: string, value: LatLng | LatLngBounds) {
        this.error = ''
        this.terraInput?.setCustomValidity('')
        this.mapValue = serialized
        if (this.terraInput) this.terraInput.value = serialized
        this._updateURLParam(serialized)
        this._emitChange(value)
    }

    private _clearValue() {
        this.error = ''
        this.mapValue = undefined
        this.terraInput?.setCustomValidity('')
        if (this.terraInput) this.terraInput.value = ''
        this._updateURLParam(null)
    }

    private _emitChange(value: LatLng | LatLngBounds) {
        if (value instanceof LatLng) {
            this.emit('terra-map-change', {
                detail: {
                    cause: 'draw',
                    type: MapEventType.POINT,
                    latLng: value,
                },
            })
        } else {
            this.emit('terra-map-change', {
                detail: {
                    cause: 'draw',
                    type: MapEventType.BBOX,
                    bounds: value,
                },
            })
        }
    }

    private _updateURLParam(value: string | null) {
        if (!this.urlState) return
        const url = new URL(window.location.href)
        value
            ? url.searchParams.set('spatial', value)
            : url.searchParams.delete('spatial')
        window.history.replaceState({}, '', url.toString())
    }

    // ─── Rendering ─────────────────────────────────────────────────────────────

    renderMap() {
        return html`<terra-map
            class="${this.inline ? 'inline' : ''}"
            exportparts="map"
            min-zoom=${this.minZoom}
            max-zoom=${this.maxZoom}
            zoom=${this.zoom}
            ?show-mouse-coordinates=${this.hasCoordTracker}
            .value=${this.mapValue}
            ?has-navigation=${this.hasNavigation}
            ?has-shape-selector=${this.hasShapeSelector}
            ?show-bounding-box-selection=${this.showBoundingBoxSelection}
            ?show-point-selection=${this.showPointSelection}
            ?no-world-wrap=${this.noWorldWrap}
            spatial-constraints=${this.spatialConstraints}
            @terra-map-change=${this._handleMapChange}
        ></terra-map>`
    }

    private _inputTemplate(slot?: string) {
        return html`<terra-input
            slot=${slot ?? nothing}
            .label=${this.label}
            .hideLabel=${this.hideLabel}
            .value=${this.initialValue}
            placeholder="${this.spatialConstraints}"
            aria-controls="map"
            aria-expanded=${this.inline ? true : this.isExpanded}
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
            .helpText=${this.helpText}
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
        </terra-input>`
    }

    render() {
        if (this.inline) {
            return html`
                <div class="spatial-picker">
                    ${this._inputTemplate()}
                    <slot name="additional-text"></slot>
                    <div
                        class="spatial-picker__map-container spatial-picker__map-container--inline"
                    >
                        ${this.renderMap()}
                    </div>
                    ${this.error
                        ? html`<div class="spatial-picker__error">${this.error}</div>`
                        : nothing}
                </div>
            `
        }

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
                    ${this._inputTemplate('trigger')}
                    <slot name="additional-text"></slot>
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
}
