import { Control } from 'ol/control.js'
import { Draw } from 'ol/interaction.js'
import { createBox } from 'ol/interaction/Draw.js'
import type VectorLayer from 'ol/layer/Vector.js'
import Feature from 'ol/Feature.js'
import { Point, Polygon } from 'ol/geom.js'
import { transform, transformExtent } from 'ol/proj.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import { LatLng } from '../models/LatLng.js'
import { LatLngBounds } from '../models/LatLngBounds.js'

export type DrawTool = 'bbox' | 'polygon' | 'point' | 'circle'

export type Options = {
    showBboxTool?: boolean
    showPolygonTool?: boolean
    showPointTool?: boolean
    showCircleTool?: boolean
}

export class DrawToolbarControl extends Control {
    protected vectorLayer: VectorLayer

    #draw?: Draw
    #options?: Options
    #tooltipEl: HTMLElement
    #cancelBtn: HTMLButtonElement
    // @ts-expect-error
    #activeTool?: DrawTool
    #boundMoveHandler: any

    constructor(vectorLayer: VectorLayer, options?: Options) {
        const element = document.createElement('div')
        element.className = 'draw-toolbar ol-unselectable ol-control'

        super({ element })

        this.#options = options

        let tools: DrawTool[] = ['bbox', 'polygon', 'point', 'circle']

        tools.forEach(tool => {
            const btn = document.createElement('button')
            btn.innerHTML = this.#getIcon(tool)
            btn.title = this.#getTitle(tool)

            btn.addEventListener('click', () => this.#activateTool(tool))

            element.appendChild(btn)

            this.toggleButtonVisibility(tool)
        })

        const cancelBtn = document.createElement('button')
        cancelBtn.innerHTML = '✕'
        cancelBtn.style.display = 'none'

        element.appendChild(cancelBtn)

        this.vectorLayer = vectorLayer
        this.#cancelBtn = cancelBtn

        this.#tooltipEl = document.createElement('div')
        this.#tooltipEl.className = 'ol-tooltip'
        this.#tooltipEl.style.display = 'none'

        cancelBtn.addEventListener('click', () => this.#cleanup())

        this.#boundMoveHandler = this.#moveHandler.bind(this)
    }

    setOptions(options: Partial<Options>) {
        this.#options = { ...this.#options, ...options }

        // update button visibility based on new options
        this.toggleButtonVisibility('bbox')
        this.toggleButtonVisibility('polygon')
        this.toggleButtonVisibility('point')
        this.toggleButtonVisibility('circle')
    }

    setValue(value: LatLng | LatLngBounds, fitToValue: boolean = false) {
        this.#cleanup()

        const source = this.vectorLayer.getSource()
        if (!source) return

        source.clear()

        let feature

        if (value instanceof LatLng) {
            feature = this.buildPointFeature(value)
        } else if (value instanceof LatLngBounds) {
            feature = this.buildBBoxFeature(value)
        }

        if (!feature) return

        source.addFeature(feature)

        if (fitToValue) {
            this.#fitToFeature(feature)
        }
    }

    setMap(map: any) {
        super.setMap(map)

        if (map) {
            map.getViewport().appendChild(this.#tooltipEl)
        }
    }

    buildPointFeature(latLng: LatLng) {
        const coords = transform([latLng.lng, latLng.lat], 'EPSG:4326', 'EPSG:3857')
        const point = new Point(coords)
        const feature = new Feature({ geometry: point })
        feature.set('drawtool', 'point')
        return feature
    }

    buildBBoxFeature(bounds: LatLngBounds) {
        const west = bounds.getWest()
        const south = bounds.getSouth()
        const east = bounds.getEast()
        const north = bounds.getNorth()
        const coordinates = [
            [west, south],
            [west, north],
            [east, north],
            [east, south],
            [west, south],
        ].map(coord => transform(coord, 'EPSG:4326', 'EPSG:3857'))
        const polygon = new Polygon([coordinates])
        const feature = new Feature({ geometry: polygon })
        feature.set('drawtool', 'bbox')
        return feature
    }

    #fitToFeature(feature: Feature) {
        const map = this.getMap()
        if (!map) return

        const geometry = feature.getGeometry()
        if (!geometry) return

        const extent = geometry.getExtent()
        if (!extent) return

        map.getView().fit(extent, {
            padding: [20, 20, 20, 20],
            maxZoom: 5, // don't allow zooming in too far, you lose context of where you are on the map
            duration: 250,
        })
    }

    toggleButtonVisibility(tool: DrawTool) {
        const show =
            this.#options?.[
                `show${tool.charAt(0).toUpperCase() + tool.slice(1)}Tool` as keyof Options
            ] ?? false

        const btn = this.element.querySelector(
            `button:nth-child(${this.#getButtonIndex(tool)})`
        ) as HTMLButtonElement

        if (btn) {
            btn.style.display = show ? 'inline-block' : 'none'
        }
    }

    #getButtonIndex(tool: DrawTool) {
        if (tool === 'bbox') return 1
        if (tool === 'polygon') return 2
        if (tool === 'point') return 3
        if (tool === 'circle') return 4
        return -1
    }

    #getIcon(tool: DrawTool) {
        if (tool === 'bbox') return '<div class="control-button control-bbox"></div>'
        if (tool === 'polygon')
            return '<div class="control-button control-polygon"></div>'
        if (tool === 'point')
            return '<div class="control-button control-point"></div>'
        if (tool === 'circle')
            return '<div class="control-button control-circle"></div>'
        return ''
    }

    #getTitle(tool: DrawTool) {
        if (tool === 'bbox') return 'Draw a rectangle'
        if (tool === 'polygon') return 'Draw a polygon'
        if (tool === 'point') return 'Choose a point'
        if (tool === 'circle') return 'Draw a circle'
        return ''
    }

    #getTooltipText(tool: DrawTool) {
        if (tool === 'bbox') return 'Click and drag to draw a bounding box'
        if (tool === 'polygon') return 'Click to draw polygon'
        if (tool === 'point') return 'Click to place point'
        if (tool === 'circle') return 'Click and drag to draw a circle'
        return 'Click to draw'
    }

    #getDrawDefaults() {
        return {
            source: this.vectorLayer.getSource()!,
            dragVertexDelay: 0,
            style: new Style({
                stroke: new Stroke({
                    color: '#3388ff',
                    width: 2,
                    lineDash: [8, 4],
                }),
                fill: new Fill({
                    color: 'rgba(51, 136, 255, 0.1)',
                }),
            }),
        }
    }

    #getDrawOptions(tool: DrawTool) {
        const base = this.#getDrawDefaults()

        if (tool === 'bbox') {
            return {
                ...base,
                type: 'Circle',
                geometryFunction: createBox(),
            }
        }

        if (tool === 'circle') {
            return {
                ...base,
                type: 'Circle',
            }
        }

        if (tool === 'polygon') {
            return {
                ...base,
                type: 'Polygon',
            }
        }

        // default, assume Point
        return {
            ...base,
            type: 'Point',
        }
    }

    #activateTool(tool: DrawTool) {
        const map = this.getMap()
        if (!map) return

        this.#cleanup()

        this.#activeTool = tool

        this.vectorLayer.getSource()?.clear()

        map.getViewport().style.cursor = 'crosshair'

        const drawOptions = this.#getDrawOptions(tool)
        // @ts-expect-error - TypeScript is confused about the dynamic nature of the options
        this.#draw = new Draw(drawOptions)

        map.addInteraction(this.#draw)

        this.#tooltipEl.style.display = 'block'
        this.#tooltipEl.innerText = this.#getTooltipText(tool)!
        this.#cancelBtn.style.display = 'inline-block'

        map.on('pointermove', this.#boundMoveHandler)

        this.#draw.on('drawend', (event: any) => {
            event.feature.set('drawtool', tool)
            this.#cleanup()
        })

        this.#draw.on('drawstart', (e: any) => {
            const geom = e.feature.getGeometry()

            geom.on('change', () => {
                const extent = geom.getExtent()

                // TODO: cleanup for other types (polygon, circle)
                const bbox4326 = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')

                const [west, south, east, north] = bbox4326

                this.#tooltipEl.innerHTML = `
                    W: ${west.toFixed(4)}<br/>
                    S: ${south.toFixed(4)}<br/>
                    E: ${east.toFixed(4)}<br/>
                    N: ${north.toFixed(4)}
                `
            })
        })
    }

    #moveHandler(e: any) {
        this.#tooltipEl.style.left = e.pixel[0] + 12 + 'px'
        this.#tooltipEl.style.top = e.pixel[1] + 12 + 'px'
    }

    #cleanup() {
        const map = this.getMap()

        if (map && this.#draw) {
            map.removeInteraction(this.#draw)
            map.un('pointermove', this.#boundMoveHandler)
            map.getViewport().style.cursor = ''
        }

        this.#draw = undefined
        this.#activeTool = undefined
        this.#tooltipEl.style.display = 'none'
        this.#cancelBtn.style.display = 'none'
    }
}
