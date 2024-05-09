import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import GDElement from '../../internal/gd-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './map.styles.js'
import { Leaflet } from './services/leaflet-utils.js'
import { getShapeFiles } from './services/shapes.js'

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
    @property({ type: Number }) zoom: number = 1

    /*
     * width of the map
     */
    @property({ type: Number }) width: number = 504

    /**
     * height of the map
     */
    @property({ type: Number }) height: number = 336

    /**
     * show map navigation toolbar
     */
    @property({ attribute: 'show-navigation', type: Boolean })
    showNavigation: boolean = false

    /**
     * show coordinate tracker
     */
    @property({ attribute: 'show-coord-tracker', type: Boolean })
    showCoordTracker: boolean = false

    /**
     * show shape selector
     */
    @property({ attribute: 'show-shape-selector', type: Boolean })
    showShapeSelector: boolean = false

    @property({ type: Array })
    value: any = []

    // querySelector for the map element
    @query('#map')
    mapElement!: HTMLDivElement

    @watch('value')
    valueChanged(_oldValue: any, newValue: any) {
        if (newValue.length > 0) {
            this.map?.setValue(this.value)
        }
    }

    map: any = new Leaflet()

    @state()
    listOfShapes: any

    async connectedCallback(): Promise<void> {
        super.connectedCallback()

        if (this.showShapeSelector) {
            this.listOfShapes = await getShapeFiles()
        }
    }

    async firstUpdated() {
        await this.map.initializeMap(this.mapElement, {
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            showCoordTracker: this.showCoordTracker,
            showNavigation: this.showNavigation,
            initialValue: this.value,
        })

        this.map.on('draw', (layer: any) =>
            this.emit('gd-map-change', {
                detail: {
                    cause: 'draw',
                    ...layer,
                },
            })
        )

        this.map.on('clear', (_e: any) =>
            this.emit('gd-map-change', {
                detail: {
                    cause: 'clear',
                },
            })
        )
    }

    selectTemplate() {
        return html`
            <div>
                <select
                    class="map__select form-control"
                    @change=${this.map.handleShapeSelect}
                >
                    <option>Select a Shape...</option>

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
                </select>
            </div>
        `
    }

    render() {
        return html`
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"
            />

            <style>
                :host {
                    width: ${this.width + 32}px;
                }
            </style>
            <div class="map">
                <!-- select goes here -->
                ${this.showShapeSelector ? this.selectTemplate() : null}
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
