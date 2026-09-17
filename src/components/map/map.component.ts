import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { map } from 'lit/directives/map.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './map.styles.js'
import {
    MapService,
    type AddLayerOptions,
    type FitToExtentOptions,
} from './map.service.js'
import { QueryController } from '../../controllers/query.controller.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import {
    queryGiovanniShapeFiles,
    queryGiovanniGeoJsonShape,
} from '../../queries/giovanni.queries.js'

/**
 * @summary A map component for visualizing and selecting coordinates.
 * @documentation https://terra-ui.netlify.app/components/map
 * @status stable
 * @since 1.0
 *
 */
export default class TerraMap extends QueryClientMixin(TerraElement) {
    static styles: CSSResultGroup = [componentStyles, styles]

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
    @property({ type: Number })
    zoom: number = 1

    @watch('zoom')
    zoomChanged() {
        this.#service?.setZoom(this.zoom)
    }

    /**
     * has map navigation toolbar
     */
    @property({ attribute: 'has-navigation', type: Boolean })
    hasNavigation: boolean = false

    /**
     * shows mouse coordinates at bottom left of map as user moves mouse over map
     */
    @property({ attribute: 'show-mouse-coordinates', type: Boolean })
    showMouseCoordinates: boolean = false

    /**
     * @deprecated has coordinate tracker (use show-mouse-coordinates instead)
     */
    @property({ attribute: 'has-coord-tracker', type: Boolean })
    set hasCoordTracker(value: boolean) {
        console.warn(
            'The "has-coord-tracker" property is deprecated. Please use "show-mouse-coordinates" instead.'
        )
        this.showMouseCoordinates = value
    }
    get hasCoordTracker() {
        return this.showMouseCoordinates
    }

    /**
     * has shape selector
     */
    @property({ attribute: 'has-shape-selector', type: Boolean })
    hasShapeSelector: boolean = false

    @property({ attribute: 'show-graticule', type: Boolean })
    showGraticule: boolean = false

    @watch('showGraticule')
    showGraticuleChanged() {
        this.#service?.toggleLayerVisibility('graticule', this.showGraticule)
    }

    @property({ attribute: 'show-bounding-box-selection', type: Boolean })
    showBoundingBoxSelection: boolean = false

    /**
     * @deprecated hide bounding box selection (use show-bounding-box-selection instead)
     */
    @property({ attribute: 'hide-bounding-box-selection', type: Boolean })
    set hideBoundingBoxSelection(value: boolean) {
        console.warn(
            'The "hide-bounding-box-selection" property is deprecated. Please use "show-bounding-box-selection" instead.'
        )
        this.showBoundingBoxSelection = !value
    }
    get hideBoundingBoxSelection() {
        return !this.showBoundingBoxSelection
    }

    @property({ attribute: 'show-point-selection', type: Boolean })
    showPointSelection: boolean = false

    /**
     * @deprecated hide point selection (use show-point-selection instead)
     */
    @property({ attribute: 'hide-point-selection', type: Boolean })
    set hidePointSelection(value: boolean) {
        console.warn(
            'The "hide-point-selection" property is deprecated. Please use "show-point-selection" instead.'
        )
        this.showPointSelection = !value
    }
    get hidePointSelection() {
        return !this.showPointSelection
    }

    @property({ attribute: 'show-polygon-selection', type: Boolean })
    showPolygonSelection: boolean = false

    @property({ attribute: 'show-circle-selection', type: Boolean })
    showCircleSelection: boolean = false

    @property({ type: Boolean })
    staticMode?: boolean = false

    /**
     * Removes the map's default card chrome (padding, border, fixed aspect
     * ratio) so it stretches to fill its container. Useful when embedding
     * this map inside another component.
     */
    @property({ type: Boolean, reflect: true })
    fill: boolean = false

    /**
     * Disables infinite horizontal scrolling on the map (world wrapping)
     */
    @property({ attribute: 'no-world-wrap', type: Boolean })
    noWorldWrap: boolean = false

    /**
     * Spatial constraints for the map (default: '-180, -90, 180, 90')
     * Format: 'west, south, east, north'
     */
    @property({ attribute: 'spatial-constraints' })
    spatialConstraints: string = '-180, -90, 180, 90'

    @property({ type: String })
    value?: string

    /**
     * if true, when setting a value, the map will focus on the feature
     */
    @property({ type: Boolean, attribute: 'fit-to-feature' })
    fitToValue: boolean = false

    // querySelector for the map element
    @query('[part="map"]')
    mapElement: HTMLDivElement

    @state()
    cursorCoordinates: [number, number] = [0, 0]

    @state()
    shapeLoading: boolean = false

    #service?: MapService

    @watch([
        'showBoundingBoxSelection',
        'showPointSelection',
        'showPolygonSelection',
        'showCircleSelection',
    ])
    drawButtonSelectionChanged() {
        this.#service?.updateDrawToolbarVisibility({
            showBoundingBoxSelection: this.showBoundingBoxSelection,
            showPointSelection: this.showPointSelection,
            showPolygonSelection: this.showPolygonSelection,
            showCircleSelection: this.showCircleSelection,
        })
    }

    @watch('value')
    valueChanged(_oldValue: any, newValue: any) {
        this.#service?.setValue(newValue)
    }

    /**
     * List of geojson shapes
     */
    shapesQuery = new QueryController(this, () => queryGiovanniShapeFiles())

    async firstUpdated() {
        this.#service = new MapService(this.mapElement, {
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            showGraticule: this.showGraticule,
            showBoundingBoxSelection: this.showBoundingBoxSelection,
            showPointSelection: this.showPointSelection,
            showPolygonSelection: this.showPolygonSelection,
            showCircleSelection: this.showCircleSelection,
            noWorldWrap: this.noWorldWrap,
            value: this.value,
            fitToValue: this.fitToValue,
            getGeoJson: shapeId =>
                this.queryClient.fetchQuery(queryGiovanniGeoJsonShape(shapeId)),
            onMouseMove: (coordinate, pixel) => {
                this.cursorCoordinates = coordinate
                this.emit('terra-map-pointer-move', {
                    detail: { coordinate, pixel },
                })
            },
            onDraw: detail => {
                this.emit('terra-map-change', { detail })
            },
            onShapeLoading: loading => {
                this.shapeLoading = loading
            },
        })
    }

    /**
     * Adds a custom layer to the map. By default the layer is placed below
     * the borders/labels layers so they continue to render on top of it; pass
     * `{ position: 'top' }` to place it above everything else instead.
     */
    addLayer(
        layer: Parameters<MapService['addLayer']>[0],
        options?: AddLayerOptions
    ) {
        this.#service?.addLayer(layer, options)
    }

    /**
     * Removes a previously added layer by the `name` it was given.
     */
    removeLayer(name: string) {
        this.#service?.removeLayer(name)
    }

    /**
     * Gets a layer (built-in or custom) by name.
     */
    getLayer(name: string) {
        return this.#service?.getLayer(name)
    }

    /**
     * Fits the map's view to the given extent, reprojecting from
     * `options.projection` to the map's view projection if provided.
     */
    fitToExtent(
        extent: Parameters<MapService['fitToExtent']>[0],
        options?: FitToExtentOptions
    ) {
        this.#service?.fitToExtent(extent, options)
    }

    addInteraction(interaction: Parameters<MapService['addInteraction']>[0]) {
        this.#service?.addInteraction(interaction)
    }

    removeInteraction(interaction: Parameters<MapService['removeInteraction']>[0]) {
        this.#service?.removeInteraction(interaction)
    }

    /**
     * Returns the map's rendered canvas/svg elements, in z-order, for
     * consumers that need to composite the rendered map (e.g. exporting an
     * image or capturing a thumbnail).
     */
    getCanvasElements() {
        return this.#service?.getCanvasElements()
    }

    getSize() {
        return this.#service?.getSize()
    }

    getPixelFromCoordinate(coordinate: [number, number]) {
        return this.#service?.getPixelFromCoordinate(coordinate)
    }

    renderComplete() {
        return this.#service?.renderComplete()
    }

    selectTemplate() {
        const shapes = this.shapesQuery.result?.data
        return html`
            <select
                class="map__select form-control"
                @change=${(e: any) => this.#service?.handleShapeSelect(e)}
            >
                <option value="">Select a Shape...</option>

                ${cache(
                    map(shapes ?? undefined, category => {
                        return html`<optgroup label="${category.title}">
                            ${category.shapes.map(shape => {
                                return html`
                                    <option
                                        value="${shape.shapefileID}/${shape.shapeID}"
                                    >
                                        ${shape.name}
                                    </option>
                                `
                            })}
                        </optgroup> `
                    })
                )}
            </select>
        `
    }

    render() {
        return html`
            ${this.hasShapeSelector ? this.selectTemplate() : nothing}
            <div
                part="map"
                class=${`map ${this.staticMode ? 'static' : ''} ${this.fill ? 'fill' : ''}`}
            >
                ${this.showMouseCoordinates
                    ? html`
                          <div id="mouse-info">
                              <div>
                                  <strong
                                      >lat: ${this.cursorCoordinates[1].toFixed(2)},
                                      lng:
                                      ${this.cursorCoordinates[0].toFixed(2)}</strong
                                  >
                              </div>
                          </div>
                      `
                    : nothing}
                ${this.shapeLoading
                    ? html`
                          <div class="map__loading-overlay">
                              <div class="map__spinner"></div>
                          </div>
                      `
                    : nothing}
            </div>
        `
    }
}
