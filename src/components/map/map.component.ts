import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { map } from 'lit/directives/map.js'
import TerraElement, {
    undefinedStringConverter,
} from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './map.styles.js'
import {
    MapService,
    type AddLayerOptions,
    type AnimationOptions,
    type FitToExtentOptions,
} from './map.service.js'
import type { LatLng } from './models/LatLng.js'
import type { LatLngBounds } from './models/LatLngBounds.js'
import type { Projection } from './layers/gibs.layer.js'
import type { GeoTiffLayerInfo } from './layers/geotiff.layer.js'
import {
    buildMapLayer,
    type MapLayerConfig,
    type MapLayerResult,
} from './layers/layer.js'
import { QueryController } from '../../controllers/query.controller.js'
import { CmrCollectionController } from '../../controllers/cmr-collection.controller.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import {
    queryGiovanniShapeFiles,
    queryGiovanniGeoJsonShape,
} from '../../queries/giovanni.queries.js'

const layersConverter = {
    fromAttribute: (value: string | null): MapLayerConfig[] => {
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
 * @event terra-map-change - Emitted when a point, bounding box, polygon, or circle is drawn/selected. `detail` is a `MapEventDetail` shaped by `detail.type` (`'point'`, `'bbox'`, `'polygon'`, `'circle'`).
 * @event terra-map-pointer-move - Emitted on mouse move over the map (while `show-mouse-coordinates` is set). `detail` is `{ coordinate, pixel }`.
 * @event terra-map-layer-change - Emitted when a declarative `layers` entry finishes building, successfully or not. `detail` is `{ name, type, info? }` on success, or `{ name, type, error }` on failure.
 * @event terra-map-ready - Emitted once, synchronously, as the map finishes its initial construction (during `firstUpdated()`). Attach a listener before/at element creation to avoid missing it.
 * @event terra-map-click - Emitted when the map is clicked. `detail` is `{ latLng, pixel, features }`.
 * @event terra-map-double-click - Emitted when the map is double-clicked. `detail` is `{ latLng, pixel, features }`.
 * @event terra-map-move-end - Emitted when the view's center/zoom/rotation settles after a pan or zoom. `detail` is `{ center, zoom }`.
 * @event terra-map-zoom-change - Emitted on every resolution change (no debouncing - use `terra-map-move-end` if only the settled value matters). `detail` is `{ zoom }`.
 * @event terra-map-layer-click - Emitted when a click hits a feature on a consumer-added layer. `detail` is `{ feature, layerName, latLng, pixel }`.
 * @event terra-map-layer-error - Emitted when a consumer-added layer fails to load a tile or image at runtime. `detail` is `{ name, error }`.
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
     * has shape selector
     */
    @property({ attribute: 'has-shape-selector', type: Boolean })
    hasShapeSelector: boolean = false

    @property({ attribute: 'show-graticule', type: Boolean })
    showGraticule: boolean = false

    @watch('showGraticule')
    showGraticuleChanged() {
        this.#service?.setLayerVisibility('graticule', this.showGraticule)
    }

    @property({ attribute: 'show-bounding-box-selection', type: Boolean })
    showBoundingBoxSelection: boolean = false

    @property({ attribute: 'show-point-selection', type: Boolean })
    showPointSelection: boolean = false

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
     * This is a construction-time setting. Changing it after the map has rendered has no effect.
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
     * Declarative layers to add to the map. Each entry's `type` picks which kind of layer it builds:
     * `'gibs'` (raster) or `'gibs-vector'` for NASA GIBS imagery, or
     * `'geotiff'` for a standalone GeoTIFF/COG by URL. e.g.:
     *
     * ```html
     * <terra-map layers='[
     *     { "type": "gibs", "name": "imagery", "layer": "MODIS_Terra_CorrectedReflectance_TrueColor", "date": "2024-06-01", "projection": "EPSG:3413" },
     *     { "type": "geotiff", "name": "my-data", "url": "https://example.com/data.tif", "colorMapName": "viridis" }
     * ]'></terra-map>
     * ```
     */
    @property({ attribute: 'layers', converter: layersConverter })
    layers: MapLayerConfig[] = []

    /**
     * A CMR collection entry-id (e.g. `AIRS2RET_NRT_7.0`) or concept-id (e.g. `C1234567890-PROVIDER`). Either is accepted.
     * When set, every GIBS imagery product CMR has tagged for the collection is added as its own layer.
     */
    @property({
        attribute: 'collection-id',
        converter: undefinedStringConverter,
    })
    collectionId?: string

    #collectionController = new CmrCollectionController(this, {
        getCollectionId: () => this.collectionId,
        getProjection: () => this.projection,
    })
    #previousCollectionLayers: MapLayerConfig[] = []

    // `buildMapLayer()` (below) is async - GetCapabilities fetches, raster
    // min/max reads - so if a layer's config changes again before its build
    // resolves, two builds for the same `name` can be in flight at once.
    // This counter, bumped per-name each time a (re)build starts, lets each
    // build's continuation check whether it's still the most recent one for
    // that name before applying its result; a superseded build just bails
    // instead of a slow-but-stale result clobbering a newer one.
    #layerRequestIds = new Map<string, number>()

    @watch('layers', { waitUntilFirstUpdate: true })
    async layersChanged(
        previous: MapLayerConfig[] = [],
        next: MapLayerConfig[] = [],
    ) {
        const previousByName = new Map(
            previous.map((config) => [config.name, config]),
        )
        const nextByName = new Map(next.map((config) => [config.name, config]))

        for (const name of previousByName.keys()) {
            if (!nextByName.has(name)) {
                this.removeLayer(name)
                this.#layerRequestIds.delete(name)
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

            this.#warnIfProjectionMismatch(name, config)

            const requestId = (this.#layerRequestIds.get(name) ?? 0) + 1
            this.#layerRequestIds.set(name, requestId)

            if (previousConfig) {
                this.removeLayer(name)
            }

            try {
                const result = await buildMapLayer(config)

                // bail if this layer was removed or superseded while it was building
                if (this.#layerRequestIds.get(name) !== requestId) {
                    continue
                }

                this.#handleLayerBuilt(name, config, result)
            } catch (error) {
                // bail if this layer was removed or superseded while it was building
                if (this.#layerRequestIds.get(name) !== requestId) {
                    continue
                }

                console.error(
                    `Failed to build "${config.type}" layer "${name}":`,
                    error,
                )
                this.emit('terra-map-layer-change', {
                    detail: { name, type: config.type, error: error as Error },
                })
            }
        }
    }

    /**
     * GIBS vector layers are only published in EPSG:4326 today; raster
     * layers default to EPSG:3857. Either way, warn (rather than silently
     * rendering distorted/reprojected raster imagery, or - for vector
     * layers - rendering nothing at all, since OpenLayers' vector tile
     * reprojection doesn't reliably handle GIBS' tile grids) if a layer's
     * projection doesn't match the map's own view projection.
     */
    #warnIfProjectionMismatch(name: string, config: MapLayerConfig) {
        if (config.type !== 'gibs' && config.type !== 'gibs-vector') {
            return
        }

        const layerProjection =
            config.type === 'gibs-vector'
                ? 'EPSG:4326'
                : (config.projection ?? 'EPSG:3857')

        if (layerProjection !== this.projection) {
            console.warn(
                `GIBS layer "${name}" is published in ${layerProjection}, but <terra-map> is using ${this.projection}. Set projection="${layerProjection}" on <terra-map> to render it without distortion.`,
            )
        }
    }

    /**
     * Adds a successfully-built `layers` entry to the map and fires
     * `terra-map-layer-change` with its type-specific detail.
     */
    #handleLayerBuilt(
        name: string,
        config: MapLayerConfig,
        result: MapLayerResult,
    ) {
        this.addLayer(result.layer, { name, position: config.position })
        result.layer.setVisible(config.visible ?? true)

        if (config.type === 'geotiff' && result.type === 'geotiff') {
            // stash the computed info directly on the OL layer
            result.layer.set('info', result.info)

            if (config.fitView && result.info.extent) {
                this.fitToExtent(result.info.extent, {
                    projection: result.info.projection,
                    padding: [50, 50, 50, 50],
                    duration: 300,
                })
            }

            this.emit('terra-map-layer-change', {
                detail: { name, type: result.type, info: result.info },
            })
        } else if (result.type === 'gibs' || result.type === 'gibs-vector') {
            result.layer.set('legend', result.legend)

            this.emit('terra-map-layer-change', {
                detail: { name, type: result.type },
            })
        }
    }

    /**
     * Gets the computed data range, colormap stops, and legend values for a
     * declaratively-added GeoTIFF layer, as built by a `'geotiff'` entry in
     * `layers`.
     */
    getGeoTiffLayerInfo(name: string): GeoTiffLayerInfo | undefined {
        return this.getLayer(name)?.get('info')
    }

    /**
     * Reads the raw band value(s) of a `layers` GeoTIFF layer at a given
     * pixel (e.g. from a `terra-map-pointer-move` event), for building a
     * hover readout.
     */
    getGeoTiffValueAtPixel(
        name: string,
        pixel: [number, number],
    ): ReturnType<GeoTiffLayerInfo['layer']['getData']> | undefined {
        return this.getGeoTiffLayerInfo(name)?.layer.getData(pixel)
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
            getGeoJson: (shapeId) =>
                this.queryClient.fetchQuery(queryGiovanniGeoJsonShape(shapeId)),
            onMouseMove: (coordinate, pixel) => {
                this.cursorCoordinates = coordinate
                this.emit('terra-map-pointer-move', {
                    detail: { coordinate, pixel },
                })
            },
            onDraw: (detail) => {
                this.emit('terra-map-change', { detail })
            },
            onShapeLoading: (loading) => {
                this.shapeLoading = loading
            },
            onReady: () => {
                this.emit('terra-map-ready')
            },
            onClick: (latLng, pixel, features) => {
                this.emit('terra-map-click', {
                    detail: { latLng, pixel, features },
                })
            },
            onDoubleClick: (latLng, pixel, features) => {
                this.emit('terra-map-double-click', {
                    detail: { latLng, pixel, features },
                })
            },
            onMoveEnd: (center, zoom) => {
                this.emit('terra-map-move-end', { detail: { center, zoom } })
            },
            onZoomChange: (zoom) => {
                this.emit('terra-map-zoom-change', { detail: { zoom } })
            },
            onLayerClick: (feature, layerName, latLng, pixel) => {
                this.emit('terra-map-layer-click', {
                    detail: { feature, layerName, latLng, pixel },
                })
            },
            onLayerError: (name, error) => {
                this.emit('terra-map-layer-error', { detail: { name, error } })
            },
        })

        // the `layers` @watch handler only fires on changes *after* this
        // first update, so apply whatever was set declaratively up front here
        if (this.layers.length) {
            this.layersChanged(undefined, this.layers)
        }
    }

    updated(changedProps: globalThis.Map<string, unknown>) {
        super.updated(changedProps)

        // `gibsLayerConfigs` is a plain getter on `#collectionController`,
        // not a `@property`/`@state` - it's computed from CMR query results
        // and the current `projection` (see CmrCollectionController) - so
        // `@watch` (which only observes reactive properties) can't react to
        // it directly. Polling it here after every update and diffing by
        // reference instead (the getter returns a cached array unless its
        // own inputs actually changed) is what lets `collection-id`-derived
        // layers reuse the exact same add/remove/rebuild diffing `layersChanged`
        // already does for the declarative `layers` property, just fed a
        // different before/after pair.
        const nextCollectionLayers = this.#collectionController.gibsLayerConfigs
        if (nextCollectionLayers !== this.#previousCollectionLayers) {
            const previousCollectionLayers = this.#previousCollectionLayers
            this.#previousCollectionLayers = nextCollectionLayers
            this.layersChanged(previousCollectionLayers, nextCollectionLayers)
        }
    }

    /**
     * Adds a custom layer to the map. By default the layer is placed below
     * the borders/labels layers so they continue to render on top of it; pass
     * `{ position: 'top' }` to place it above everything else instead.
     */
    addLayer(
        layer: Parameters<MapService['addLayer']>[0],
        options?: AddLayerOptions,
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
        options?: FitToExtentOptions,
    ) {
        this.#service?.fitToExtent(extent, options)
    }

    addInteraction(interaction: Parameters<MapService['addInteraction']>[0]) {
        this.#service?.addInteraction(interaction)
    }

    removeInteraction(
        interaction: Parameters<MapService['removeInteraction']>[0],
    ) {
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

    /** Forces the map to recompute its size and re-render. */
    refresh() {
        this.#service?.refresh()
    }

    /**
     * Pans the view's center to `lon`/`lat`. Animates over
     * `options.duration` ms when given, otherwise jumps immediately.
     */
    setCenter(lon: number, lat: number, options?: AnimationOptions) {
        this.#service?.setCenter(lon, lat, options)
    }

    /** Returns the view's current center as a `LatLng`. */
    getCenter(): LatLng | undefined {
        return this.#service?.getCenter()
    }

    getZoom(): number | undefined {
        return this.#service?.getZoom()
    }

    /**
     * Sets the view's zoom level. Animates over `options.duration` ms when
     * given, otherwise jumps immediately.
     */
    setZoom(zoom: number, options?: AnimationOptions) {
        this.#service?.setZoom(zoom, options)
    }

    zoomIn(options?: AnimationOptions) {
        this.#service?.zoomIn(options)
    }

    zoomOut(options?: AnimationOptions) {
        this.#service?.zoomOut(options)
    }

    /**
     * Fits the view to a `LatLngBounds`.
     */
    fitBounds(bounds: LatLngBounds, options?: FitToExtentOptions) {
        this.#service?.fitBounds(bounds, options)
    }

    /** Returns the view's current visible extent as a `LatLngBounds`. */
    getBounds(): LatLngBounds | undefined {
        return this.#service?.getBounds()
    }

    /** Resets the view to its center/zoom/rotation at construction time. */
    resetView(options?: AnimationOptions) {
        this.#service?.resetView(options)
    }

    setRotation(radians: number, options?: AnimationOptions) {
        this.#service?.setRotation(radians, options)
    }

    getRotation(): number | undefined {
        return this.#service?.getRotation()
    }

    /**
     * Shows or hides a layer (built-in or consumer-added) by name.
     */
    setLayerVisibility(name: string, show: boolean) {
        this.#service?.setLayerVisibility(name, show)
    }

    setLayerOpacity(name: string, opacity: number) {
        this.#service?.setLayerOpacity(name, opacity)
    }

    /**
     * Returns only the layers added through `addLayer()` - built-in layers
     * (base imagery, borders, labels, graticule, shapes, draw) are never
     * included. Use `getLayer()`/`getAllLayers()` to see every layer,
     * built-in or not.
     */
    getLayers() {
        return this.#service?.getLayers()
    }

    /**
     * Reorders consumer-added layers to match `names` (bottom-to-top).
     * Built-in layers are untouched.
     */
    setLayerOrder(names: string[]) {
        this.#service?.setLayerOrder(names)
    }

    /**
     * Fits the map's view to a consumer-added layer's source extent.
     */
    fitToLayer(
        name: string,
        options?: Parameters<MapService['fitToLayer']>[1],
    ) {
        this.#service?.fitToLayer(name, options)
    }

    /** Removes every consumer-added layer; built-in layers are untouched. */
    clearLayers() {
        this.#service?.clearLayers()
    }

    /** Refreshes a layer's source, forcing it to reload its data. */
    refreshLayer(name: string) {
        this.#service?.refreshLayer(name)
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
                    map(shapes ?? undefined, (category) => {
                        return html`<optgroup label="${category.title}">
                            ${category.shapes.map((shape) => {
                                return html`
                                    <option
                                        value="${shape.shapefileID}/${shape.shapeID}"
                                    >
                                        ${shape.name}
                                    </option>
                                `
                            })}
                        </optgroup> `
                    }),
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
