// import * as L from 'leaflet'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import GDElement from '../../internal/gd-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './map.styles.js'
import { getShapeFiles } from './services/shapes.js'

import 'leaflet-draw'
import type { CSSResultGroup } from 'lit'
import { watch } from '../../internal/watch.js'
import { Leaflet } from './services/leaflet-utils.js'

// @ts-ignore
window.type = ''

/**
 * @summary A map component for visualizing and selecting coordinates.
 * @documentation https://disc.gsfc.nasa.gov/components/map
 * @status mvp
 * @since 1.0
 *
 */
export default class GdMap extends GDElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /**
     * Minimum zoom level of the map.
     */
    @property({ attribute: 'min-zoom', type: Number, reflect: true })
    minZoom: number = 0

    /**
     * Maximum zoom level of the map.
     */
    @property({ attribute: 'max-zoom', type: Number, reflect: true })
    maxZoom: number = 23

    /**
     * Initial map zoom level
     */
    @property({ type: Number, reflect: true }) zoom: number = 1

    /*
     * width of the map
     */
    @property({ type: Number, reflect: true }) width: number = 504

    /**
     * height of the map
     */
    @property({ type: Number, reflect: true }) height: number = 336

    /**
     * show map navigation toolbar
     */
    @property({ attribute: 'show-navigation', type: Boolean, reflect: true })
    showNavigation: boolean = true

    /**
     * mouse coordinate tracker
     */
    @property({ attribute: 'mouse-position', type: Boolean, reflect: true })
    mousePosition: boolean = true

    @property({ type: Array })
    value: any = []

    // querySelector for the map element
    @query('#map')
    mapElement!: HTMLDivElement

    @watch('value')
    valueChanged(oldValue: any, newValue: any) {
        if (newValue.length > 0) {
            this.map.setValue(this.value)
        }
    }

    map: any = new Leaflet()

    @state()
    listOfShapes: any

    addedGeoJson: any

    async connectedCallback(): Promise<void> {
        super.connectedCallback()

        this.listOfShapes = await getShapeFiles()
    }

    firstUpdated() {
        this.map.initializeMap(this.mapElement, {
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            mousePosition: this.mousePosition,
            showNavigation: this.showNavigation,
        })

        this.map.on('draw', (layer: any) =>
            this.emit('gd-map-change', {
                detail: {
                    cause: 'draw',
                    ...layer,
                },
            })
        )

        this.map.on('clear', (layer: any) =>
            this.emit('gd-map-change', {
                detail: {
                    cause: 'clear',
                },
            })
        )
    }

    selectTemplate() {
        return html`
            ${this.listOfShapes?.available.map((parentShape: string) => {
                const shapes = this.map.transformShapeData(
                    this.listOfShapes?.info[parentShape]
                )

                return html`<optgroup
                    label="${this.listOfShapes?.info[parentShape].title}"
                >
                    ${shapes.map((shape: any) => {
                        return html`
                            <option
                                value="shape=${shape.shapefileID}/${shape.gShapeID}"
                            >
                                ${shape.name}
                            </option>
                        `
                    })}
                </optgroup> `
            })}
        `
    }

    render() {
        return html`
            <!-- @ts-ignore -->
            <style>
                @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
                @import url('https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css');

                :host {
                    width: ${this.width + 32}px;
                }
            </style>
            <div class="map">
                <div>
                    <select
                        class="map__select form-control"
                        @change=${this.map.handleShapeSelect}
                    >
                        <option>Select a Shape...</option>
                        ${this.selectTemplate()}
                    </select>
                </div>
                <div class="map__container">
                    <!-- "Map goes here" -->
                    <div
                        id="map"
                        style="width:${this.width && this.width}px; height: ${this
                            .height && this.height}px;"
                        class="map__container__map"
                    ></div>
                </div>
            </div>
        `
    }
}
