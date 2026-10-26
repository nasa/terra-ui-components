import type { MapBrowserEvent, Map as OlMap } from 'ol'
import { Control } from 'ol/control.js'
import { Draw } from 'ol/interaction.js'
import { createBox } from 'ol/interaction/Draw.js'
import type VectorLayer from 'ol/layer/Vector.js'
import Feature from 'ol/Feature.js'
import { Point, Polygon } from 'ol/geom.js'
import { transform, transformExtent } from 'ol/proj.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import type { DrawEvent } from 'ol/interaction/Draw.js'
import type { Pixel } from 'ol/pixel.js'
import type { Options as DrawOptions } from 'ol/interaction/Draw.js'
import { LatLng } from '../models/LatLng.js'
import { LatLngBounds } from '../models/LatLngBounds.js'

export type DrawTool = 'bbox' | 'polygon' | 'point' | 'circle'

export type Options = {
    showBboxTool?: boolean
    showPolygonTool?: boolean
    showPointTool?: boolean
    showCircleTool?: boolean
    target?: HTMLElement | string
}

export class DrawToolbarControl extends Control {
    declare public element: HTMLElement
    protected vectorLayer: VectorLayer

    #draw?: Draw
    #options?: Options
    #tooltipEl: HTMLElement
    #cancelBtn: HTMLButtonElement
    #boundMoveHandler: (event: MapBrowserEvent) => void

    constructor(vectorLayer: VectorLayer, options?: Options) {
        const element = document.createElement('div')
        element.className = 'draw-toolbar ol-unselectable ol-control'

        super({ element, target: options?.target })

        this.#options = options

        const tools: DrawTool[] = ['bbox', 'polygon', 'point', 'circle']

        tools.forEach(tool => {
            const btn = document.createElement('button')
            btn.type = 'button'
            btn.innerHTML = this.#getIcon(tool)
            btn.title = this.#getTitle(tool)

            btn.addEventListener('click', () => this.#activateTool(tool))

            element.appendChild(btn)

            this.toggleButtonVisibility(tool)
        })

        const cancelBtn = document.createElement('button')
        cancelBtn.type = 'button'
        cancelBtn.className = 'cancel-btn'
        cancelBtn.innerHTML = this.#getIcon('cancel')
        cancelBtn.title = 'Cancel drawing'

        cancelBtn.addEventListener('click', () => this.#cleanup())
        element.appendChild(cancelBtn)

        this.vectorLayer = vectorLayer
        this.#cancelBtn = cancelBtn

        this.#tooltipEl = document.createElement('div')
        this.#tooltipEl.className = 'ol-tooltip'
        this.#tooltipEl.style.display = 'none'

        this.#boundMoveHandler = this.#moveHandler.bind(this)
    }

    setMap(map: OlMap | null) {
        super.setMap(map)

        if (map) {
            map.getViewport()?.appendChild(this.#tooltipEl)
        }
    }

    setOptions(options: Partial<Options>) {
        this.#options = { ...this.#options, ...options }

        // update button visibility based on new options
        this.toggleButtonVisibility('bbox')
        this.toggleButtonVisibility('polygon')
        this.toggleButtonVisibility('point')
        this.toggleButtonVisibility('circle')
    }

    clearValue() {
        this.#cleanup()
        this.vectorLayer.getSource()?.clear()
    }

    setValue(value: LatLng | LatLngBounds, _fitToValue: boolean = false) {
        this.clearValue()

        const source = this.vectorLayer.getSource()
        if (!source) return

        let feature:
            | ReturnType<typeof this.buildPointFeature>
            | ReturnType<typeof this.buildBBoxFeature>
            | undefined

        if (value instanceof LatLng) {
            feature = this.buildPointFeature(value)
        } else if (value instanceof LatLngBounds) {
            feature = this.buildBBoxFeature(value)
        }

        if (feature) {
            source.addFeature(feature)
        }
    }

    #viewProjection() {
        return this.getMap()?.getView().getProjection() ?? 'EPSG:3857'
    }

    buildPointFeature(latLng: LatLng) {
        const viewProjection = this.#viewProjection()
        const coords = transform(
            [latLng.lng, latLng.lat],
            'EPSG:4326',
            viewProjection
        )

        const feature = new Feature({
            geometry: new Point(coords),
        })

        feature.set('drawtool', 'point')

        return feature
    }

    buildBBoxFeature(bounds: LatLngBounds) {
        const viewProjection = this.#viewProjection()
        const [minX, minY] = transform(
            [bounds.getWest(), bounds.getSouth()],
            'EPSG:4326',
            viewProjection
        )
        const [maxX, maxY] = transform(
            [bounds.getEast(), bounds.getNorth()],
            'EPSG:4326',
            viewProjection
        )

        const feature = new Feature({
            geometry: new Polygon([
                [
                    [minX, minY],
                    [maxX, minY],
                    [maxX, maxY],
                    [minX, maxY],
                    [minX, minY],
                ],
            ]),
        })
        feature.set('drawtool', 'bbox')

        return feature
    }

    toggleButtonVisibility(tool: DrawTool) {
        let btnIndex = 0

        if (tool === 'bbox') {
            btnIndex = 1
        } else if (tool === 'polygon') {
            btnIndex = 2
        } else if (tool === 'point') {
            btnIndex = 3
        } else if (tool === 'circle') {
            btnIndex = 4
        }

        const btn = this.element?.querySelector(
            `button:nth-child(${btnIndex})`
        ) as HTMLButtonElement

        if (btn) {
            btn.style.display = this.#isButtonVisible(tool) ? 'flex' : 'none'
        }
    }

    #isButtonVisible(tool: DrawTool) {
        if (!this.#options) {
            return true
        }

        switch (tool) {
            case 'bbox':
                return this.#options.showBboxTool ?? true
            case 'polygon':
                return this.#options.showPolygonTool ?? true
            case 'point':
                return this.#options.showPointTool ?? true
            case 'circle':
                return this.#options.showCircleTool ?? true
            default:
                return false
        }
    }

    #getIcon(tool: DrawTool | 'cancel') {
        switch (tool) {
            case 'bbox':
                return `<svg viewBox="12 12 36 36" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M 44,14 H 16 v 28 h 28 z m -2,26 H 18 V 16 h 24 z" />
            </svg>`
            case 'polygon':
                return `<svg viewBox="73 15 30 30" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M 100,24.565 97.904,39.395 83.07,42 76,28.773 86.463,18 Z" />
            </svg>`
            case 'point':
                return `<svg viewBox="255 15 30 30" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="m 270,19 c -4.971,0 -9,4.029 -9,9 0,4.971 5.001,12 9,14 4.001,-2 9,-9.029 9,-14 0,-4.971 -4.029,-9 -9,-9 z m 0,12.5 c -2.484,0 -4.5,-2.014 -4.5,-4.5 0,-2.484 2.016,-4.5 4.5,-4.5 2.485,0 4.5,2.016 4.5,4.5 0,2.486 -2.015,4.5 -4.5,4.5 z" />
            </svg>`
            case 'circle':
                return `<svg viewBox="195 15 30 30" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="m 221,30 c 0,6.078 -4.926,11 -11,11 -6.074,0 -11,-4.922 -11,-11 0,-6.074 4.926,-11 11,-11 6.074,0 11,4.926 11,11 z" />
            </svg>`
            case 'cancel':
                return `<svg viewBox="0 0 30 30" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
              <line x1="8" y1="8" x2="22" y2="22" />
              <line x1="22" y1="8" x2="8" y2="22" />
            </svg>`
            default:
                return ''
        }
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

    static getDrawStyleDefaults() {
        return new Style({
            stroke: new Stroke({
                color: '#DC143C',
                width: 2,
            }),
            fill: new Fill({
                color: 'rgba(220, 20, 60, 0.6)',
            }),
        })
    }

   #getDrawDefaults() {
        const draw_style_defaults = DrawToolbarControl.getDrawStyleDefaults()
        // When the polygon is being drawn, give it a line dash.
        draw_style_defaults.getStroke()?.setLineDash([8, 4])

        return {
            source: this.vectorLayer.getSource() ?? undefined,
            dragVertexDelay: 0,
            style: draw_style_defaults
        }
    }

    #getDrawOptions(tool: DrawTool): DrawOptions {
        const base = this.#getDrawDefaults()

        if (tool === 'bbox') {
            return {
                ...base,
                type: 'Circle',
                geometryFunction: createBox(),
                freehand: true,
            }
        }

        if (tool === 'circle') {
            return {
                ...base,
                type: 'Circle',
                freehand: true,
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

        this.vectorLayer.getSource()?.clear()

        const viewport = map.getViewport()

        if (viewport) {
            viewport.style.cursor = 'crosshair'
        }

        const drawOptions = this.#getDrawOptions(tool)
        this.#draw = new Draw(drawOptions)

        map.addInteraction(this.#draw)

        this.#tooltipEl.style.display = 'block'
        this.#tooltipEl.innerText = this.#getTooltipText(tool)
        this.#cancelBtn.classList.add('visible')

        map.on('pointermove', this.#boundMoveHandler)

        this.#draw.on('drawend', (event: DrawEvent) => {
            event.feature.set('drawtool', tool)
            this.#cleanup()
        })

        const viewProjection = this.#viewProjection()

        this.#draw.on('drawstart', (e: DrawEvent) => {
            const geom = e.feature.getGeometry()
            if (!geom) return

            geom.on('change', () => {
                const extent = geom.getExtent()

                // TODO: cleanup for other types (polygon, circle)
                const bbox4326 = transformExtent(extent, viewProjection, 'EPSG:4326')

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

    #moveHandler(e: MapBrowserEvent) {
        const pixel = e.pixel as Pixel
        this.#tooltipEl.style.left = `${pixel[0] + 12}px`
        this.#tooltipEl.style.top = `${pixel[1] + 12}px`
    }

    #cleanup() {
        const map = this.getMap()

        if (map && this.#draw) {
            const viewport = map.getViewport()

            map.removeInteraction(this.#draw)
            map.un('pointermove', this.#boundMoveHandler)

            if (viewport) {
                viewport.style.cursor = ''
            }
        }

        this.#draw = undefined
        this.#tooltipEl.style.display = 'none'
        this.#cancelBtn.classList.remove('visible')
    }
}
