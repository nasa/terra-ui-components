import { Feature, Graticule, Map, MapBrowserEvent, View } from 'ol'
import {
    toLonLat,
    fromLonLat,
    transform,
    transformExtent,
    type ProjectionLike,
    get as getProjection,
} from 'ol/proj.js'
import { isEmpty as isEmptyExtent, type Extent } from 'ol/extent.js'
import type { Coordinate } from 'ol/coordinate.js'
import type BaseLayerType from 'ol/layer/Base.js'
import type Interaction from 'ol/interaction/Interaction.js'
import type { FitOptions } from 'ol/View.js'
import type { FeatureLike } from 'ol/Feature.js'
import Layer from 'ol/layer/Layer.js'
import type Source from 'ol/source/Source.js'
import { Stroke } from 'ol/style.js'
import { isResizeObserverSupported } from '../../utilities/feature.js'
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import { Circle, Point, Polygon, type Geometry } from 'ol/geom.js'
import { DrawToolbarControl } from './controls/draw-toolbar.control.js'
import { MapEventType, type MapEventDetail } from './type.js'
import { LatLngBounds } from './models/LatLngBounds.js'
import { LatLng } from './models/LatLng.js'
import { BadRequestException } from '../../exceptions/http.exception.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { BaseLayer } from './layers/base.layer.js'
import { BordersLayer } from './layers/borders.layer.js'
import { LabelsLayer } from './layers/labels.layer.js'

export type AddLayerOptions = {
    name?: string
    position?: 'below-borders' | 'top'
}

export type FitToExtentOptions = {
    projection?: ProjectionLike
} & FitOptions

/** Options accepted by navigation/layer methods that can optionally animate. */
export type AnimationOptions = {
    duration?: number
}

type MapOptions = {
    projection?: ProjectionLike
    zoom?: number
    minZoom?: number
    maxZoom?: number
    showGraticule?: boolean
    showBoundingBoxSelection?: boolean
    showPolygonSelection?: boolean
    showPointSelection?: boolean
    showCircleSelection?: boolean
    noWorldWrap?: boolean
    value?: string
    fitToValue?: boolean
    getGeoJson?: (shapeId: string) => Promise<unknown>
    onShapeLoading?: (loading: boolean) => void
    onMouseMove?: (
        coordinate: [number, number],
        pixel: [number, number],
    ) => void
    onDraw?: (detail: MapEventDetail) => void
    onReady?: () => void
    onClick?: (
        latLng: LatLng,
        pixel: [number, number],
        features: FeatureLike[],
    ) => void
    onDoubleClick?: (
        latLng: LatLng,
        pixel: [number, number],
        features: FeatureLike[],
    ) => void
    onMoveEnd?: (center: LatLng, zoom: number) => void
    onZoomChange?: (zoom: number) => void
    onLayerClick?: (
        feature: FeatureLike,
        layerName: string,
        latLng: LatLng,
        pixel: [number, number],
    ) => void
    onLayerError?: (name: string, error: Error) => void
}

export class MapService {
    #el: HTMLElement // the map component's root element
    #map: Map
    #drawToolbarControl: DrawToolbarControl
    #options: MapOptions
    #shapeLayer: VectorLayer
    #onDraw: MapOptions['onDraw']
    #onShapeLoading: MapOptions['onShapeLoading']
    #initialView: { center: Coordinate; zoom: number; rotation: number }

    constructor(el: HTMLElement, options: MapOptions) {
        this.#el = el
        this.#options = options

        this.#map = this.#createMap(options)

        this.#updateMapSizeOnResize()
    }

    setLayerVisibility(name: string, show: boolean) {
        const layer = this.#getLayerByName(name)

        if (layer) {
            layer.setVisible(show)
        }
    }

    /**
     * Adds a custom layer to the map.
     *
     * By default the layer is inserted directly above the base imagery layer
     * and below the borders/labels layers, so borders/labels continue to
     * render on top of any data layers. Use `position: 'top'` to instead
     * place the layer above everything else (e.g. an interactive drawing
     * layer).
     */
    addLayer(layer: BaseLayerType, options: AddLayerOptions = {}) {
        if (options.name) {
            layer.set('name', options.name)
        }

        this.#wireLayerErrorForwarding(layer)

        if (options.position === 'top') {
            this.#map.addLayer(layer)
            return
        }

        const bordersLayer = this.#getLayerByName('borders')
        const layers = this.#map.getLayers()
        const index = bordersLayer
            ? layers.getArray().indexOf(bordersLayer)
            : layers.getLength()

        layers.insertAt(index, layer)
    }

    /**
     * Forwards a consumer-added layer's runtime tile/image load failures to `onLayerError`
     */
    #wireLayerErrorForwarding(layer: BaseLayerType) {
        if (!(layer instanceof Layer)) {
            return
        }

        const source = layer.getSource() as Source | null

        if (!source) {
            return
        }

        const name = layer.get('name')
        const forward = () => {
            this.#options.onLayerError?.(
                name,
                new Error(
                    `Failed to load a tile or image for layer "${name}".`,
                ),
            )
        }

        // Error event names differ based on image or tile type. Register both event names and
        // letting whichever doesn't apply simply never fire is simpler than narrowing by layer type.
        const on = source.on.bind(source) as (
            type: string,
            listener: () => void,
        ) => void
        on('tileloaderror', forward)
        on('imageloaderror', forward)
    }

    removeLayer(name: string) {
        const layer = this.#getLayerByName(name)

        if (layer) {
            this.#map.removeLayer(layer)
        }
    }

    getLayer(name: string) {
        return this.#getLayerByName(name)
    }

    getAllLayers() {
        return this.#map.getAllLayers()
    }

    /**
     * Returns only the layers added through `addLayer()` - built-in layers
     * (base imagery, borders, labels, graticule, shapes, draw) are never
     * included. Use `getAllLayers()` to see every layer, built-in or not.
     */
    getLayers() {
        return this.#map
            .getLayers()
            .getArray()
            .filter((layer) => this.#isConsumerLayer(layer))
    }

    setLayerOpacity(name: string, opacity: number) {
        const layer = this.#getLayerByName(name)

        if (layer) {
            layer.setOpacity(opacity)
        }
    }

    /**
     * Reorders consumer-added layers to match `names` (bottom-to-top). Layers
     * not found by name are skipped with a warning. Consumer layers omitted
     * from `names` keep their relative order, appended after the ones given.
     * Built-in layers are left untouched, at their existing absolute index.
     */
    setLayerOrder(names: string[]) {
        const layers = this.#map.getLayers()
        const snapshot = layers.getArray().slice()

        const consumerLayers = snapshot.filter((layer) =>
            this.#isConsumerLayer(layer),
        )

        const ordered: BaseLayerType[] = []
        const used = new Set<BaseLayerType>()

        for (const name of names) {
            const layer = consumerLayers.find((l) => l.get('name') === name)

            if (!layer) {
                console.warn(`setLayerOrder: no consumer layer named "${name}"`)
                continue
            }

            ordered.push(layer)
            used.add(layer)
        }

        // layers omitted from `names` keep their existing relative order,
        // appended after the ones explicitly ordered
        for (const layer of consumerLayers) {
            if (!used.has(layer)) {
                ordered.push(layer)
            }
        }

        let consumerIndex = 0
        const rebuilt = snapshot.map((layer) =>
            this.#isConsumerLayer(layer) ? ordered[consumerIndex++] : layer,
        )

        layers.clear()
        rebuilt.forEach((layer) => {
            layers.push(layer)
        })
    }

    /**
     * Fits the map's view to a consumer-added layer's source extent. No-ops
     * (with a warning) if the layer isn't found or its source has no extent
     * (e.g. a tile source with unbounded/global coverage).
     */
    fitToLayer(name: string, options: FitOptions = {}) {
        const layer = this.#getLayerByName(name)

        if (!layer) {
            console.warn(`fitToLayer: no layer named "${name}"`)
            return
        }

        const source = layer instanceof Layer ? layer.getSource() : null
        // `getExtent` isn't on the generic `Source` base type - only sources
        // that know their own bounds (e.g. `VectorSource`) implement it -
        // so sources that don't simply report "no extent" below.
        const extent = (
            source as unknown as { getExtent?: () => Extent | null } | null
        )?.getExtent?.()

        // an empty vector source reports a non-null but "empty" extent
        // (`[Infinity, Infinity, -Infinity, -Infinity]`), which `view.fit()`
        // throws on - treat it the same as "no extent at all".
        if (!extent || isEmptyExtent(extent)) {
            console.warn(`fitToLayer: layer "${name}" has no extent to fit to`)
            return
        }

        this.#map.getView().fit(extent, options)
    }

    /** Removes every consumer-added layer; built-in layers are untouched. */
    clearLayers() {
        this.getLayers().forEach((layer) => {
            this.#map.removeLayer(layer)
        })
    }

    /** Refreshes a layer's source, forcing it to reload its data. */
    refreshLayer(name: string) {
        const layer = this.#getLayerByName(name)
        const source = layer instanceof Layer ? layer.getSource() : null

        source?.refresh()
    }

    /**
     * Fits the map's view to the given extent, reprojecting from
     * `options.projection` to the map's view projection if provided.
     */
    fitToExtent(extent: Extent, options: FitToExtentOptions = {}) {
        const { projection, ...fitOptions } = options

        const targetExtent = projection
            ? transformExtent(
                  extent,
                  projection,
                  this.#map.getView().getProjection(),
              )
            : extent

        this.#map.getView().fit(targetExtent, fitOptions)
    }

    addInteraction(interaction: Interaction) {
        this.#map.addInteraction(interaction)
    }

    removeInteraction(interaction: Interaction) {
        this.#map.removeInteraction(interaction)
    }

    /**
     * Returns the map's rendered canvas/svg elements, in z-order, for
     * consumers that need to composite the rendered map (e.g. exporting an
     * image or capturing a thumbnail) without reaching into the map's DOM.
     */
    getCanvasElements() {
        const viewport = this.#map.getViewport()

        return {
            canvases: Array.from(
                viewport?.querySelectorAll('canvas') ?? [],
            ) as HTMLCanvasElement[],
            svgs: Array.from(
                viewport?.querySelectorAll('svg') ?? [],
            ) as SVGElement[],
        }
    }

    getSize() {
        return this.#map.getSize()
    }

    /**
     * Converts a map coordinate (in the view's projection) into a pixel
     * position, for consumers that need to sample a layer's raster data at a
     * given coordinate (e.g. reading GeoTIFF values along a drawn line).
     */
    getPixelFromCoordinate(coordinate: [number, number]) {
        return this.#map.getPixelFromCoordinate(coordinate)
    }

    /**
     * Returns the features rendered at a pixel position, for hover/click
     * feature interactions on vector layers (e.g. `GibsVectorLayer`).
     */
    getFeaturesAtPixel(pixel: [number, number]) {
        return this.#map.getFeaturesAtPixel(pixel)
    }

    getView() {
        return this.#map.getView()
    }

    renderComplete(): Promise<void> {
        return new Promise((resolve) => {
            this.#map.once('rendercomplete', () => resolve())
            this.refresh()
        })
    }

    /** Forces the map to recompute its size and re-render. */
    refresh() {
        this.#map.updateSize()
        this.#map.render()
    }

    /**
     * Pans the view's center to `lon`/`lat`. Animates over
     * `options.duration` ms when given, otherwise jumps immediately.
     */
    setCenter(lon: number, lat: number, options: AnimationOptions = {}) {
        const center = fromLonLat(
            [lon, lat],
            this.#map.getView().getProjection(),
        )

        if (options.duration) {
            this.#map.getView().animate({ center, duration: options.duration })
        } else {
            this.#map.getView().setCenter(center)
        }
    }

    /** Returns the view's current center as a `LatLng`. */
    getCenter(): LatLng {
        const center = this.#map.getView().getCenter() ?? [0, 0]
        const [lng, lat] = toLonLat(center, this.#map.getView().getProjection())

        return new LatLng(lat, lng)
    }

    getZoom(): number | undefined {
        return this.#map.getView().getZoom()
    }

    /**
     * Sets the view's zoom level. Animates over `options.duration` ms when
     * given, otherwise jumps immediately (matches the component's existing
     * `zoom` property/`@watch` behavior).
     */
    setZoom(zoom: number, options: AnimationOptions = {}) {
        if (options.duration) {
            this.#map.getView().animate({ zoom, duration: options.duration })
        } else {
            this.#map.getView().setZoom(zoom)
        }
    }

    zoomIn(options: AnimationOptions = {}) {
        const zoom = this.getZoom()

        if (zoom !== undefined) {
            this.setZoom(zoom + 1, options)
        }
    }

    zoomOut(options: AnimationOptions = {}) {
        const zoom = this.getZoom()

        if (zoom !== undefined) {
            this.setZoom(zoom - 1, options)
        }
    }

    /**
     * Fits the view to a `LatLngBounds`. Thin wrapper around
     * `fitToExtent()` - no duplicate reprojection logic.
     */
    fitBounds(bounds: LatLngBounds, options: FitToExtentOptions = {}) {
        this.fitToExtent(
            [
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth(),
            ],
            { projection: 'EPSG:4326', ...options },
        )
    }

    /** Returns the view's current visible extent as a `LatLngBounds`. */
    getBounds(): LatLngBounds {
        const extent = this.#map.getView().calculateExtent(this.#map.getSize())
        const bbox4326 = transformExtent(
            extent,
            this.#map.getView().getProjection(),
            'EPSG:4326',
        )

        return new LatLngBounds(bbox4326)
    }

    /** Resets the view to its center/zoom/rotation at construction time. */
    resetView(options: AnimationOptions = {}) {
        const { center, zoom, rotation } = this.#initialView

        if (options.duration) {
            this.#map
                .getView()
                .animate({ center, zoom, rotation, duration: options.duration })
        } else {
            const view = this.#map.getView()
            view.setCenter(center)
            view.setZoom(zoom)
            view.setRotation(rotation)
        }
    }

    setRotation(radians: number, options: AnimationOptions = {}) {
        if (options.duration) {
            this.#map
                .getView()
                .animate({ rotation: radians, duration: options.duration })
        } else {
            this.#map.getView().setRotation(radians)
        }
    }

    getRotation(): number {
        return this.#map.getView().getRotation()
    }

    setValue(value: string) {
        if (!value) {
            this.#drawToolbarControl.clearValue()
            return
        }

        const location = this.parseLocationString(value)

        this.#drawToolbarControl.setValue(location, this.#options.fitToValue)
    }

    /**
     * takes a string and parses it into a point, bounding box
     * TODO: support parsing circle and polygon
     */
    parseLocationString(location: string) {
        try {
            const locationParts = location
                .split(',')
                .map((part) => parseFloat(part.trim()))

            // handle lat/lng points
            if (locationParts.length === 2) {
                return new LatLng(locationParts[0], locationParts[1])
            }

            // handle bounding box
            if (locationParts.length === 4) {
                return new LatLngBounds([
                    locationParts[0],
                    locationParts[1],
                    locationParts[2],
                    locationParts[3],
                ])
            }

            throw new Error(
                `Provided location had invalid length of ${locationParts.length}. Should have 2 or 4 items.`,
            )
        } catch (e) {
            throw new BadRequestException({
                message:
                    'Failed to parse location string. Location must be in format: `lat,lng` for a point or `west,south,east,north` for a bounding box',
                cause: e,
            })
        }
    }

    updateDrawToolbarVisibility(options: {
        showBoundingBoxSelection?: boolean
        showPolygonSelection?: boolean
        showPointSelection?: boolean
        showCircleSelection?: boolean
    }) {
        this.#drawToolbarControl.setOptions({
            showBboxTool: options.showBoundingBoxSelection,
            showPolygonTool: options.showPolygonSelection,
            showPointTool: options.showPointSelection,
            showCircleTool: options.showCircleSelection,
        })
    }

    async handleShapeSelect(event: Event) {
        const select = event.target as HTMLSelectElement
        const selectedShape = select.value

        if (!selectedShape) return

        // Clear any previously loaded shape
        this.#shapeLayer.getSource()!.clear()

        this.#onShapeLoading?.(true)

        try {
            const shapeGeoJson = await this.#options.getGeoJson?.(selectedShape)

            if (!shapeGeoJson) return

            // Parse the GeoJSON into OpenLayers features, reprojecting from WGS84 to the map projection
            const format = new GeoJSON()
            const features = format.readFeatures(shapeGeoJson, {
                featureProjection: this.#map.getView().getProjection(),
            })

            const source = this.#shapeLayer.getSource()!
            source.addFeatures(features)

            // Fit the view to the shape's extent
            const extent = source.getExtent()

            if (!extent) {
                return
            }

            this.#map.getView().fit(extent, {
                padding: [20, 20, 20, 20],
                duration: 250,
            })

            // Emit the shape as a polygon draw event so listeners can react
            this.#onDraw?.({
                cause: 'draw',
                type: MapEventType.POLYGON,
                latLngs: [],
                geoJson: shapeGeoJson as object,
                label: select.options[select.selectedIndex]?.text,
            })
        } finally {
            this.#onShapeLoading?.(false)
        }
    }

    #createMap(options: MapOptions) {
        this.#onDraw = options.onDraw
        this.#onShapeLoading = options.onShapeLoading

        const baseLayer = new BaseLayer(options)
        baseLayer.set('name', 'base')
        baseLayer.set('__builtin', true)

        const bordersLayer = new BordersLayer(options)
        bordersLayer.set('name', 'borders')
        bordersLayer.set('__builtin', true)

        const labelsLayer = new LabelsLayer(options)
        labelsLayer.set('name', 'labels')
        labelsLayer.set('__builtin', true)

        const graticuleLayer = this.#createGraticuleLayer(options)
        const drawLayer = this.#createDrawLayer()
        this.#shapeLayer = this.#createShapeLayer()

        const projection = getProjection(options.projection ?? 'EPSG:3857')
        const worldExtent = projection?.getExtent()

        const map = new Map({
            target: this.#el,
            layers: [
                baseLayer,
                bordersLayer,
                labelsLayer,
                graticuleLayer,
                this.#shapeLayer,
                drawLayer,
            ],
            view: new View({
                center: [0, 0],
                zoom: options.zoom,
                projection: options.projection ?? 'EPSG:3857',
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                ...(options.noWorldWrap ? { extent: worldExtent } : {}),
            }),
        })

        this.#initialView = {
            center: map.getView().getCenter() ?? [0, 0],
            zoom: map.getView().getZoom() ?? options.zoom ?? 1,
            rotation: map.getView().getRotation(),
        }

        map.on('pointermove', (event: MapBrowserEvent) => {
            const coordinate = toLonLat(event.coordinate)
            options.onMouseMove?.(
                coordinate as [number, number],
                event.pixel as [number, number],
            )
        })

        map.on('click', (event: MapBrowserEvent) => {
            const latLng = this.#toLatLng(event.coordinate, map)
            const pixel = event.pixel as [number, number]
            const features = map.getFeaturesAtPixel(pixel)

            options.onClick?.(latLng, pixel, features)

            map.forEachFeatureAtPixel(pixel, (feature, layer) => {
                if (layer && this.#isConsumerLayer(layer)) {
                    options.onLayerClick?.(
                        feature,
                        layer.get('name'),
                        latLng,
                        pixel,
                    )
                }
            })
        })

        map.on('dblclick', (event: MapBrowserEvent) => {
            const latLng = this.#toLatLng(event.coordinate, map)
            const pixel = event.pixel as [number, number]
            const features = map.getFeaturesAtPixel(pixel)

            options.onDoubleClick?.(latLng, pixel, features)
        })

        map.on('moveend', () => {
            const view = map.getView()
            const center = view.getCenter()

            if (center) {
                options.onMoveEnd?.(
                    this.#toLatLng(center, map),
                    view.getZoom() ?? 0,
                )
            }
        })

        map.getView().on('change:resolution', () => {
            const zoom = map.getView().getZoom()

            if (zoom !== undefined) {
                options.onZoomChange?.(zoom)
            }
        })

        this.#drawToolbarControl = new DrawToolbarControl(drawLayer, {
            showBboxTool: options.showBoundingBoxSelection,
            showPolygonTool: options.showPolygonSelection,
            showPointTool: options.showPointSelection,
            showCircleTool: options.showCircleSelection,
        })

        map.addControl(this.#drawToolbarControl)

        if (options.value !== undefined) {
            this.setValue(options.value)
        }

        // listen for when any drawing is completed and dispatch a custom event with the drawn geometry
        drawLayer
            .getSource()!
            .on('addfeature', (event: VectorSourceEvent<Feature<Geometry>>) => {
                const drawtool = event.feature?.get('drawtool')

                if (!drawtool) {
                    // something else added this feature, we can safely ignore it
                    return
                }

                const geometry = event.feature!.getGeometry()!
                const viewProjection = map.getView().getProjection()

                if (drawtool === 'bbox') {
                    // transform the extent into lat/lng bounds
                    const extent = event.feature!.getGeometry()!.getExtent()!
                    const bbox4326 = transformExtent(
                        extent,
                        viewProjection,
                        'EPSG:4326',
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.BBOX,
                        bounds: new LatLngBounds(bbox4326),
                    })
                } else if (geometry instanceof Polygon) {
                    const coordinates = geometry
                        .getCoordinates()[0]
                        .slice(0, -1) // remove last point (duplicate of first)

                    const latLngs = coordinates.map(([x, y]) => {
                        const [lng, lat] = transform(
                            [x, y],
                            viewProjection,
                            'EPSG:4326',
                        )
                        return new LatLng(lat, lng)
                    })

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POLYGON,
                        latLngs,
                    })
                } else if (geometry instanceof Point) {
                    const coords = geometry.getCoordinates()
                    const [lng, lat] = transform(
                        coords,
                        viewProjection,
                        'EPSG:4326',
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POINT,
                        latLng: new LatLng(lat, lng),
                    })
                } else if (geometry instanceof Circle) {
                    const radius = geometry.getRadius()
                    const [lng, lat] = transform(
                        geometry.getCenter(),
                        viewProjection,
                        'EPSG:4326',
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.CIRCLE,
                        center: new LatLng(lat, lng),
                        radius,
                    })
                } else {
                    console.warn('Unhandled draw type! ', event.feature)
                }
            })

        options.onReady?.()

        return map
    }

    #createGraticuleLayer(options: MapOptions) {
        const layer = new Graticule({
            visible: options.showGraticule ?? false,
            strokeStyle: new Stroke({
                color: 'rgba(0,0,0,0.2)',
                width: 2,
                lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: true,
        })

        layer.set('name', 'graticule')
        layer.set('__builtin', true)

        return layer
    }

    #createDrawLayer() {
        const source = new VectorSource({
            wrapX: false,
        })

        const layer = new VectorLayer({
            source: source,
        })

        layer.set('name', 'draw')
        layer.set('__builtin', true)

        return layer
    }

    #createShapeLayer() {
        const source = new VectorSource()

        const layer = new VectorLayer({
            source,
        })

        layer.set('name', 'shapes')
        layer.set('__builtin', true)

        return layer
    }

    #updateMapSizeOnResize() {
        if (isResizeObserverSupported()) {
            // anytime the element is resized, update the map size
            const resizeObserver = new ResizeObserver(() => {
                this.#map.updateSize()
            })

            resizeObserver.observe(this.#el)
        }
    }

    #getLayerByName(name: string) {
        return this.#map
            .getLayers()
            .getArray()
            .find((layer) => layer.get('name') === name)
    }

    /**
     * A layer is "consumer-added" if it's missing the `__builtin` flag that
     * every built-in layer (base, borders, labels, graticule, shapes, draw)
     * is tagged with at creation time. `addLayer()` never sets this flag, so
     * this is immune to a consumer reusing one of those names and doesn't
     * require a second piece of state to keep in sync.
     */
    #isConsumerLayer(layer: BaseLayerType): boolean {
        return layer.get('__builtin') !== true
    }

    /** Converts a map coordinate (in the view's projection) to a `LatLng`. */
    #toLatLng(coordinate: Coordinate, map: Map): LatLng {
        const [lng, lat] = transform(
            coordinate,
            map.getView().getProjection(),
            'EPSG:4326',
        )

        return new LatLng(lat, lng)
    }
}
