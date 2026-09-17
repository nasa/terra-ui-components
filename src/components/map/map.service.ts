import { Feature, Graticule, Map, MapBrowserEvent, View } from 'ol'
import {
    toLonLat,
    transform,
    transformExtent,
    type ProjectionLike,
    get as getProjection,
} from 'ol/proj.js'
import type { Extent } from 'ol/extent.js'
import type BaseLayerType from 'ol/layer/Base.js'
import type Interaction from 'ol/interaction/Interaction.js'
import type { FitOptions } from 'ol/View.js'
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
    onMouseMove?: (coordinate: [number, number], pixel: [number, number]) => void
    onDraw?: (detail: MapEventDetail) => void
}

export class MapService {
    #el: HTMLElement // the map component's root element
    #map: Map
    #drawToolbarControl: DrawToolbarControl
    #options: MapOptions
    #shapeLayer: VectorLayer
    #onDraw: MapOptions['onDraw']
    #onShapeLoading: MapOptions['onShapeLoading']

    constructor(el: HTMLElement, options: MapOptions) {
        this.#el = el
        this.#options = options

        this.#map = this.#createMap(options)

        this.#updateMapSizeOnResize()
    }

    toggleLayerVisibility(name: string, show: boolean) {
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

    removeLayer(name: string) {
        const layer = this.#getLayerByName(name)

        if (layer) {
            this.#map.removeLayer(layer)
        }
    }

    getLayer(name: string) {
        return this.#getLayerByName(name)
    }

    /**
     * Fits the map's view to the given extent, reprojecting from
     * `options.projection` to the map's view projection if provided.
     */
    fitToExtent(extent: Extent, options: FitToExtentOptions = {}) {
        const { projection, ...fitOptions } = options

        const targetExtent = projection
            ? transformExtent(extent, projection, this.#map.getView().getProjection())
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
                viewport.querySelectorAll('canvas')
            ) as HTMLCanvasElement[],
            svgs: Array.from(viewport.querySelectorAll('svg')) as SVGElement[],
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

    renderComplete(): Promise<void> {
        return new Promise(resolve => {
            this.#map.once('rendercomplete', () => resolve())
            this.#map.render()
        })
    }

    setZoom(zoom: number) {
        this.#map.getView().setZoom(zoom)
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
                .map(part => parseFloat(part.trim()))

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
                `Provided location had invalid length of ${locationParts.length}. Should have 2 or 4 items.`
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
                featureProjection: 'EPSG:3857',
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

        const bordersLayer = new BordersLayer(options)
        bordersLayer.set('name', 'borders')

        const labelsLayer = new LabelsLayer(options)
        labelsLayer.set('name', 'labels')

        const graticuleLayer = this.#createGraticuleLayer(options)
        const drawLayer = this.#createDrawLayer()
        this.#shapeLayer = this.#createShapeLayer()

        const projection = getProjection('EPSG:3857')
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

        map.on('pointermove', (event: MapBrowserEvent) => {
            const coordinate = toLonLat(event.coordinate)
            options.onMouseMove?.(
                coordinate as [number, number],
                event.pixel as [number, number]
            )
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

                if (drawtool === 'bbox') {
                    // transform the extent into lat/lng bounds
                    const extent = event.feature!.getGeometry()!.getExtent()!
                    const bbox4326 = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.BBOX,
                        bounds: new LatLngBounds(bbox4326),
                    })
                } else if (geometry instanceof Polygon) {
                    const coordinates = geometry.getCoordinates()[0].slice(0, -1) // remove last point (duplicate of first)

                    const latLngs = coordinates.map(([x, y]) => {
                        const [lng, lat] = transform([x, y], 'EPSG:3857', 'EPSG:4326')
                        return new LatLng(lat, lng)
                    })

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POLYGON,
                        latLngs,
                    })
                } else if (geometry instanceof Point) {
                    const coords = geometry.getCoordinates()
                    const [lng, lat] = transform(coords, 'EPSG:3857', 'EPSG:4326')

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POINT,
                        latLng: new LatLng(lat, lng),
                    })
                } else if (geometry instanceof Circle) {
                    const radius = geometry.getRadius()
                    const [lng, lat] = transform(
                        geometry.getCenter(),
                        'EPSG:3857',
                        'EPSG:4326'
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

        return layer
    }

    #createDrawLayer() {
        const source = new VectorSource({
            wrapX: false,
        })

        return new VectorLayer({
            source: source,
        })
    }

    #createShapeLayer() {
        const source = new VectorSource()

        const layer = new VectorLayer({
            source,
        })

        layer.set('name', 'shapes')

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
            .find(layer => layer.get('name') === name)
    }
}
