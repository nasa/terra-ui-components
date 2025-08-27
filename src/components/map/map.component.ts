import type { CSSResultGroup } from 'lit'
import { html, nothing } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { map } from 'lit/directives/map.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import leafletDrawStyles from './leaflet-draw.styles.js'
import { Leaflet } from './leaflet-utils.js'
import leafletStyles from './leaflet.styles.js'
import { MapController } from './map.controller.js'
import styles from './map.styles.js'
import type { ShapeFilesResponse } from '../../geojson/types.js'
import { MapEventType } from './type.js'

/**
 * @summary A map component for visualizing and selecting coordinates.
 * @documentation https://disc.gsfc.nasa.gov/components/map
 * @status mvp
 * @since 1.0
 *
 */
export default class TerraMap extends TerraElement {
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

    @property({ attribute: 'hide-bounding-box-selection', type: Boolean })
    hideBoundingBoxSelection?: boolean

    @property({ attribute: 'hide-point-selection', type: Boolean })
    hidePointSelection?: boolean

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

    map = new Leaflet()

    /**
     * List of geojson shapes
     */
    @state()
    shapes: ShapeFilesResponse

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
            hideBoundingBoxDrawTool: this.hideBoundingBoxSelection,
            hidePointSelectionDrawTool: this.hidePointSelection,
        })

        this.map.on('draw', (layer: any) => {
            this.emit('terra-map-change', {
                detail: {
                    cause: 'draw',
                    type:
                        'latLng' in layer
                            ? MapEventType.POINT
                            : 'bounds' in layer
                              ? MapEventType.BBOX
                              : undefined,
                    ...layer,
                },
            })
        })

        this.map.on('clear', (_e: any) =>
            this.emit('terra-map-change', {
                detail: {
                    cause: 'clear',
                },
            })
        )

        this.#markDynamicLeafletContent()
    }

    getDrawLayer() {
        return this.map.editableLayers.getLayers()[0]
    }

    #markDynamicLeafletContent() {
        //* Add CSS parts to the following items that Leaflet dynamically inserts:
        const parts = [
            {
                item: this.shadowRoot?.querySelector('.leaflet-draw-draw-rectangle'),
                name: 'leaflet-bbox',
            },
            {
                item: this.shadowRoot?.querySelector('.leaflet-draw-draw-marker'),
                name: 'leaflet-point',
            },
            {
                item: this.shadowRoot?.querySelector('.leaflet-draw-edit-edit'),
                name: 'leaflet-edit',
            },
            {
                item: this.shadowRoot?.querySelector('.leaflet-draw-edit-remove'),
                name: 'leaflet-remove',
            },
        ]

        parts.forEach(({ item, name }) => {
            item?.setAttribute('part', name)
        })
    }

    selectTemplate() {
        return html`
            <select
                class="map__select form-control"
                @change=${this.map.handleShapeSelect}
            >
                <option value="">Select a Shape...</option>

                ${cache(
                    map(this.shapes?.categories, category => {
                        return html`<optgroup label="${category.title}">
                            ${category.shapes.map(shape => {
                                return html`
                                    <option
                                        value="shape=${shape.shapefileID}/${shape.shapeID}"
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
            <!-- select goes here -->
            ${this.hasShapeSelector ? this.selectTemplate() : nothing}
            <!-- "Map goes here" -->
            <div part="map" id="map" class="map"></div>
        `
    }

    invalidateSize() {
        this.map.map.invalidateSize()
    }
}
