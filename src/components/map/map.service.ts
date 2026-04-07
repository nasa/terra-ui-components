import { Feature, Graticule, Map, MapBrowserEvent, View } from 'ol'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import { toLonLat, transform, transformExtent, type ProjectionLike } from 'ol/proj.js'
import { OSM } from 'ol/source.js'
import { Stroke } from 'ol/style.js'
import { isResizeObserverSupported } from '../../utilities/feature.js'
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import { Circle, Point, Polygon, type Geometry } from 'ol/geom.js'
import { DrawToolbarControl } from './controls/draw-toolbar.control.js'
import { MapEventType, type MapEventDetail } from './type.js'
import { LatLngBounds } from './models/LatLngBounds.js'
import { LatLng } from './models/LatLng.js'

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
    onMouseMove?: (coordinate: [number, number]) => void
    onDraw?: (detail: MapEventDetail) => void
}

export class MapService {
    #el: HTMLElement // the map component's root element
    #map: Map
    #drawToolbarControl: DrawToolbarControl

    constructor(el: HTMLElement, options: MapOptions) {
        this.#el = el

        this.#map = this.#createMap(options)

        this.#updateMapSizeOnResize()
    }

    toggleLayerVisibility(name: string, show: boolean) {
        const layer = this.#getLayerByName(name)

        if (layer) {
            layer.setVisible(show)
        }
    }

    setZoom(zoom: number) {
        this.#map.getView().setZoom(zoom)
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

    #createMap(options: MapOptions) {
        const baseLayer = this.#createBaseLayer()
        const graticuleLayer = this.#createGraticuleLayer(options)
        const drawLayer = this.#createDrawLayer()

        const map = new Map({
            target: this.#el,
            layers: [baseLayer, graticuleLayer, drawLayer],
            view: new View({
                center: [0, 0],
                zoom: options.zoom,
                projection: options.projection ?? 'EPSG:3857',
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
            }),
        })

        map.on('pointermove', (event: MapBrowserEvent) => {
            const coordinate = toLonLat(event.coordinate)
            options.onMouseMove?.(coordinate as [number, number])
        })

        this.#drawToolbarControl = new DrawToolbarControl(drawLayer, {
            showBboxTool: options.showBoundingBoxSelection,
            showPolygonTool: options.showPolygonSelection,
            showPointTool: options.showPointSelection,
            showCircleTool: options.showCircleSelection,
        })

        map.addControl(this.#drawToolbarControl)

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
                        const latLng = transform([x, y], 'EPSG:3857', 'EPSG:4326')
                        return new LatLng(latLng[0], latLng[1])
                    })

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POLYGON,
                        latLngs,
                    })
                } else if (geometry instanceof Point) {
                    const coords = geometry.getCoordinates()
                    const latLng = transform(coords, 'EPSG:3857', 'EPSG:4326')

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POINT,
                        latLng: new LatLng(latLng[0], latLng[1]),
                    })
                } else if (geometry instanceof Circle) {
                    const radius = geometry.getRadius()
                    const latLngCenter = transform(
                        geometry.getCenter(),
                        'EPSG:3857',
                        'EPSG:4326'
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.CIRCLE,
                        center: new LatLng(latLngCenter[0], latLngCenter[1]),
                        radius,
                    })
                } else {
                    console.warn('Unhandled draw type! ', event.feature)
                }
            })

        return map
    }

    #createBaseLayer() {
        return new WebGLTileLayer({
            source: new OSM() as any,
        })
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
