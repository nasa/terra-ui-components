import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { map } from 'lit/directives/map.js'
import EduxElement from '../../internal/edux-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import leafletDrawStyles from './leaflet-draw.styles.js'
import { Leaflet } from './leaflet-utils.js'
import leafletStyles from './leaflet.styles.js'
import { MapController } from './map.controller.js'
import styles from './map.styles.js'

/**
 * @summary A map component for visualizing and selecting coordinates.
 * @documentation https://disc.gsfc.nasa.gov/components/map
 * @status mvp
 * @since 1.0
 *
 */
export default class EduxMap extends EduxElement {
    static styles: CSSResultGroup = [
        componentStyles,
        leafletStyles,
        leafletDrawStyles,
        styles,
    ]

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
     * has map navigation toolbar
     */
    @property({ attribute: 'has-navigation', type: Boolean })
    hasNavigation: boolean = false

    /**
     * has coordinate tracker
     */
    @property({ attribute: 'has-coord-tracker', type: Boolean })
    hasCoordTracker: boolean = false

    /**
     * has shape selector
     */
    @property({ attribute: 'has-shape-selector', type: Boolean })
    hasShapeSelector: boolean = false

    @property({ type: Array })
    value: any = []

    // querySelector for the map element
    @query('#map')
    mapElement!: HTMLDivElement

    @watch('value')
    valueChanged(_oldValue: any, newValue: any) {
        if (newValue.length > 0) {
            this.map?.setValue(this.value)
        } else if (newValue.length === 0 && this.map.isMapReady) {
            this.map.clearLayers()
        }
    }

    @watch('width')
    widthChanged(_oldValue: any, newValue: any) {
        this.style.setProperty('--width', `${newValue}px`)
    }

    @watch('height')
    heightChanged(_oldValue: any, newValue: any) {
        if (this.hasShapeSelector) {
            this.style.setProperty('--height', `${newValue + 52}px`)
        } else {
            this.style.setProperty('--height', `${newValue}px`)
        }
    }

    map: any = new Leaflet()

    /**
     * List of geojson shapes
     */
    @state()
    shapes: any

    _mapController: MapController = new MapController(this)

    async connectedCallback(): Promise<void> {
        super.connectedCallback()
    }

    async firstUpdated() {
        await this.map.initializeMap(this.mapElement, {
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            hasCoordTracker: this.hasCoordTracker,
            hasNavigation: this.hasNavigation,
            initialValue: this.value,
        })

        this.map.on('draw', (layer: any) =>
            this.emit('edux-map-change', {
                detail: {
                    cause: 'draw',
                    ...layer,
                },
            })
        )

        this.map.on('clear', (_e: any) =>
            this.emit('edux-map-change', {
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
                    <option value="">Select a Shape...</option>

                    ${cache(
                        map(this.shapes?.available, (parentShape: string) => {
                            const shapes = this.map.transformShapeData(
                                this.shapes?.info[parentShape]
                            )

                            return html`<optgroup
                                label="${this.shapes?.info[parentShape].title}"
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
                        })
                    )}
                </select>
            </div>
        `
    }

    render() {
        return html`
            <div class="map">
                <!-- select goes here -->
                ${this.hasShapeSelector ? this.selectTemplate() : null}
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
