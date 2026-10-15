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
import {
    buildGibsLayer,
    type GibsLayerConfig,
    type Projection,
} from './layers/gibs.layer.js'
import {
    buildGeoTiffLayer,
    type GeoTiffLayerConfig,
    type GeoTiffLayerInfo,
} from './layers/geotiff.layer.js'
import { QueryController } from '../../controllers/query.controller.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import {
    queryGiovanniShapeFiles,
    queryGiovanniGeoJsonShape,
} from '../../queries/giovanni.queries.js'

const geotiffLayersConverter = {
    fromAttribute: (value: string | null): GeoTiffLayerConfig[] => {
        if (!value) {
            return []
        }

        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    },
}

const gibsLayersConverter = {
    fromAttribute: (value: string | null): GibsLayerConfig[] => {
        if (!value) {
            return []
        }

        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    },
}

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

    /**
     * The map view's projection. Defaults to `'EPSG:3857'` (Web Mercator).
     *
     * This is a construction-time setting, like `no-world-wrap` — changing it
     * after the map has rendered has no effect, since OpenLayers can't swap a
     * view's projection in place.
     *
     * Set this to match any non-`'EPSG:3857'` `projection` used by a
     * `gibs-layers` entry (e.g. `projection="EPSG:3413"`). Imagery published
     * only in a polar/geographic projection renders with severe distortion if
     * left on the default Web Mercator view, since OpenLayers will silently
     * reproject it.
     */
    @property({ type: String })
    projection: Projection = 'EPSG:3857'

    @property({ type: String })
    value?: string

    /**
     * if true, when setting a value, the map will focus on the feature
     */
    @property({ type: Boolean, attribute: 'fit-to-feature' })
    fitToValue: boolean = false

    /**
     * Declarative GIBS layers to add to the map, for use in plain HTML
     * without writing JS, e.g.:
     *
     * ```html
     * <terra-map gibs-layers='[{ "name": "imagery", "layer": "MODIS_Terra_CorrectedReflectance_TrueColor", "date": "2024-06-01", "projection": "EPSG:3413" }]'></terra-map>
     * ```
     */
    @property({ attribute: 'gibs-layers', converter: gibsLayersConverter })
    gibsLayers: GibsLayerConfig[] = []

    #gibsLayerRequestIds = new Map<string, number>()

    @watch('gibsLayers', { waitUntilFirstUpdate: true })
    async gibsLayersChanged(
        previous: GibsLayerConfig[] = [],
        next: GibsLayerConfig[] = []
    ) {
        const previousByName = new Map(previous.map(config => [config.name, config]))
        const nextByName = new Map(next.map(config => [config.name, config]))

        for (const name of previousByName.keys()) {
            if (!nextByName.has(name)) {
                this.removeLayer(name)
                this.#gibsLayerRequestIds.delete(name)
            }
        }

        for (const [name, config] of nextByName) {
            const previousConfig = previousByName.get(name)
            if (
                previousConfig &&
                JSON.stringify(previousConfig) === JSON.stringify(config)
            ) {
                continue // unchanged
            }

            // GIBS vector layers are only published in EPSG:4326 today; raster
            // layers default to EPSG:3857. Either way, warn (rather than
            // silently rendering distorted/reprojected imagery) if it doesn't
            // match the map's own view projection.
            const layerProjection =
                config.type === 'vector'
                    ? 'EPSG:4326'
                    : (config.projection ?? 'EPSG:3857')
            if (layerProjection !== this.projection) {
                console.warn(
                    `GIBS layer "${name}" is published in ${layerProjection}, but <terra-map> is using ${this.projection}. Set projection="${layerProjection}" on <terra-map> to render it without distortion.`
                )
            }

            const requestId = (this.#gibsLayerRequestIds.get(name) ?? 0) + 1
            this.#gibsLayerRequestIds.set(name, requestId)

            if (previousConfig) {
                this.removeLayer(name)
            }

            try {
                const layer = await buildGibsLayer(config)

                // bail if this layer was removed or superseded while it was building
                if (this.#gibsLayerRequestIds.get(name) !== requestId) {
                    continue
                }

                this.addLayer(layer, { name, position: config.position })
            } catch (error) {
                console.error(`Failed to build GIBS layer "${name}":`, error)
            }
        }
    }

    /**
     * Declarative GeoTIFF layers to add to the map, for loading any
     * standalone GeoTIFF/COG by URL - not tied to Harmony, Giovanni, or any
     * other GESDISC-specific service. Each gets a colormap-based style
     * computed from the raster's actual data range. e.g.:
     *
     * ```html
     * <terra-map geotiff-layers='[{ "name": "my-data", "url": "https://example.com/data.tif", "colorMapName": "viridis" }]'></terra-map>
     * ```
     */
    @property({ attribute: 'geotiff-layers', converter: geotiffLayersConverter })
    geotiffLayers: GeoTiffLayerConfig[] = []

    #geotiffLayerRequestIds = new Map<string, number>()
    #geotiffLayerInfo = new Map<string, GeoTiffLayerInfo>()

    @watch('geotiffLayers', { waitUntilFirstUpdate: true })
    async geotiffLayersChanged(
        previous: GeoTiffLayerConfig[] = [],
        next: GeoTiffLayerConfig[] = []
    ) {
        const previousByName = new Map(previous.map(config => [config.name, config]))
        const nextByName = new Map(next.map(config => [config.name, config]))

        for (const name of previousByName.keys()) {
            if (!nextByName.has(name)) {
                this.removeLayer(name)
                this.#geotiffLayerRequestIds.delete(name)
                this.#geotiffLayerInfo.delete(name)
            }
        }

        for (const [name, config] of nextByName) {
            const previousConfig = previousByName.get(name)
            if (
                previousConfig &&
                JSON.stringify(previousConfig) === JSON.stringify(config)
            ) {
                continue // unchanged
            }

            const requestId = (this.#geotiffLayerRequestIds.get(name) ?? 0) + 1
            this.#geotiffLayerRequestIds.set(name, requestId)

            if (previousConfig) {
                this.removeLayer(name)
                this.#geotiffLayerInfo.delete(name)
            }

            try {
                const info = await buildGeoTiffLayer(config)

                // bail if this layer was removed or superseded while it was building
                if (this.#geotiffLayerRequestIds.get(name) !== requestId) {
                    continue
                }

                this.addLayer(info.layer, { name, position: config.position })
                this.#geotiffLayerInfo.set(name, info)

                if (config.fitView && info.extent) {
                    this.fitToExtent(info.extent, {
                        projection: info.projection,
                        padding: [50, 50, 50, 50],
                        duration: 300,
                    })
                }

                this.emit('terra-map-geotiff-layer-change', {
                    detail: { name, info },
                })
            } catch (error) {
                // bail if this layer was removed or superseded while it was building
                if (this.#geotiffLayerRequestIds.get(name) !== requestId) {
                    continue
                }

                console.error(`Failed to build GeoTIFF layer "${name}":`, error)
                this.emit('terra-map-geotiff-layer-change', {
                    detail: { name, error: error as Error },
                })
            }
        }
    }

    /**
     * Gets the computed data range, colormap stops, and legend values for a
     * declaratively-added GeoTIFF layer, as built by `geotiffLayers`.
     */
    getGeoTiffLayerInfo(name: string): GeoTiffLayerInfo | undefined {
        return this.#geotiffLayerInfo.get(name)
    }

    /**
     * Reads the raw band value(s) of a `geotiffLayers` layer at a given
     * pixel (e.g. from a `terra-map-pointer-move` event), for building a
     * hover readout.
     */
    getGeoTiffValueAtPixel(
        name: string,
        pixel: [number, number]
    ): ReturnType<GeoTiffLayerInfo['layer']['getData']> | undefined {
        return this.#geotiffLayerInfo.get(name)?.layer.getData(pixel)
    }

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
            projection: this.projection,
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

        // the `gibsLayers` @watch handler only fires on changes *after* this
        // first update, so apply whatever was set declaratively up front here
        if (this.gibsLayers.length) {
            this.gibsLayersChanged(undefined, this.gibsLayers)
        }

        if (this.geotiffLayers.length) {
            this.geotiffLayersChanged(undefined, this.geotiffLayers)
        }
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

    /**
     * Returns the features rendered at a pixel position (e.g. from the
     * `pixel` in a `terra-map-pointer-move` event), for hover/click feature
     * interactions on vector layers like `GibsVectorLayer`.
     */
    getFeaturesAtPixel(pixel: [number, number]) {
        return this.#service?.getFeaturesAtPixel(pixel)
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
                ${
                    this.showMouseCoordinates
                        ? html`
                              <div id="mouse-info">
                                  <div>
                                      <strong
                                          >lat:
                                          ${this.cursorCoordinates[1].toFixed(2)},
                                          lng:
                                          ${this.cursorCoordinates[0].toFixed(2)}</strong
                                      >
                                  </div>
                              </div>
                          `
                        : nothing
                }
                ${
                    this.shapeLoading
                        ? html`
                              <div class="map__loading-overlay">
                                  <div class="map__spinner"></div>
                              </div>
                          `
                        : nothing
                }
            </div>
        `
    }
}
