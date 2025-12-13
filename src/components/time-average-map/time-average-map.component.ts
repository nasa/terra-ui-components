import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { Map, MapBrowserEvent, View } from 'ol'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import VectorLayer from 'ol/layer/Vector.js'
import OSM from 'ol/source/OSM.js'
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import type GeoTIFF from 'ol/source/GeoTIFF.js'
import { Style, Stroke } from 'ol/style.js'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './time-average-map.styles.js'
import type { CSSResultGroup } from 'lit'
import { TimeAvgMapController } from './time-average-map.controller.js'
import TerraButton from '../button/button.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
import { TaskStatus } from '@lit/task'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { cache } from 'lit/directives/cache.js'
import { AuthController } from '../../auth/auth.controller.js'
import { toLonLat, transformExtent } from 'ol/proj.js'
import { getFetchVariableTask } from '../../metadata-catalog/tasks.js'
import { getVariableEntryId } from '../../metadata-catalog/utilities.js'
import { watch } from '../../internal/watch.js'
import TerraLoader from '../loader/loader.component.js'

export default class TerraTimeAverageMap extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-plot-toolbar': TerraPlotToolbar,
        'terra-loader': TerraLoader,
    }

    @property({ reflect: true }) collection?: string
    @property({ reflect: true }) variable?: string
    @property({ attribute: 'start-date', reflect: true }) startDate?: string
    @property({ attribute: 'end-date', reflect: true }) endDate?: string
    @property({ reflect: true }) location?: string
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string
    @property({ type: String }) long_name = ''

    @state() catalogVariable: Variable
    @state() pixelValue: string = 'N/A'
    @state() pixelCoordinates: string = 'N/A'

    #controller: TimeAvgMapController
    #map: Map | null = null
    #gtLayer: WebGLTileLayer | null = null
    #bordersLayer: VectorLayer<VectorSource> | null = null

    _authController = new AuthController(this)

    @state() colormaps = [
        'jet',
        'hsv',
        'hot',
        'cool',
        'spring',
        'summer',
        'autumn',
        'winter',
        'bone',
        'copper',
        'greys',
        'YIGnBu',
        'greens',
        'YIOrRd',
        'bluered',
        'RdBu',
        'picnic',
        'rainbow',
        'portland',
        'blackbody',
        'earth',
        'electric',
        'viridis',
        'inferno',
        'magma',
        'plasma',
        'warm',
        'cool',
        'bathymetry',
        'cdom',
        'chlorophyll',
        'density',
        'fressurface-blue',
        'freesurface-red',
        'oxygen',
        'par',
        'phase',
        'salinity',
        'temperature',
        'turbidity',
        'velocity-blue',
        'velocity-green',
        'cubhelix',
    ]
    @state() colorMapName = 'density'

    /**
     * anytime the collection or variable changes, we'll fetch the variable from the catalog to get all of it's metadata
     */
    _fetchVariableTask = getFetchVariableTask(this, false)

    @watch(['startDate', 'endDate', 'location', 'catalogVariable'])
    handlePropertyChange() {
        if (
            !this.startDate ||
            !this.endDate ||
            !this.location ||
            !this.catalogVariable
        ) {
            return
        }

        this.#controller.jobStatusTask.run()
    }

    async firstUpdated() {
        this.#controller = new TimeAvgMapController(this)
        // Initialize the base layer open street map
        this.intializeMap()
        this._fetchVariableTask.run()
    }

    async updateGeoTIFFLayer(blob: Blob) {
        // The task returns the blob upon completion
        const blobUrl = URL.createObjectURL(blob)

        const { default: GeoTIFF } = await import('ol/source/GeoTIFF.js')

        const gtSource = new GeoTIFF({
            sources: [
                {
                    url: blobUrl,
                    bands: [1],
                    nodata: NaN,
                },
            ],
            interpolate: false,
            normalize: false,
        })

        this.#gtLayer = new WebGLTileLayer({
            source: gtSource,
        })

        if (this.#map) {
            this.#map.addLayer(this.#gtLayer)

            if (this.#bordersLayer) {
                this.#map.removeLayer(this.#bordersLayer)
                this.#bordersLayer = null
            }

            // Add borders/coastlines layer on top of the GeoTIFF layer
            await this.addBordersLayerForGeoTIFF(gtSource)
        }

        const metadata = await this.fetchGeotiffMetadata(gtSource)
        this.long_name = metadata['long_name'] ?? ''

        if (this.#map && this.#gtLayer) {
            this.renderPixelValues(this.#map, this.#gtLayer)
            this.applyColorToLayer(gtSource, 'density') // Initial color for layer is density

            setTimeout(async () => {
                // Try to fit the map view to the GeoTIFF extent
                try {
                    // Get the GeoTIFF view
                    const view = await this.#gtLayer!.getSource()?.getView()

                    // Because the GeoTIFF and the map projection's differ, we'll transform the GeoTIFF projection
                    // to the maps projection
                    const transformedExtent = transformExtent(
                        view!.extent!,
                        view!.projection!,
                        this.#map!.getView().getProjection()
                    )

                    // Now we can change the map view to fit the GeoTIFF
                    this.#map!.getView().fit(transformedExtent, {
                        padding: [50, 50, 50, 50],
                        duration: 300,
                    })
                } catch (error) {
                    console.warn('Failed to fit map to GeoTIFF extent:', error)
                }
            }, 500)
        }
    }

    intializeMap() {
        const baseLayer = new WebGLTileLayer({
            source: new OSM() as any,
        })

        this.#map = new Map({
            target: this.shadowRoot?.getElementById('map') ?? undefined,
            layers: [baseLayer],
            view: new View({
                center: [0, 0],
                zoom: 2,
                projection: 'EPSG:3857',
            }),
        })

        if (this.#map) {
            const resizeObserver = new ResizeObserver(() => {
                this.#map?.updateSize()
            })

            const mapElement = this.shadowRoot?.getElementById('map')
            if (mapElement) {
                resizeObserver.observe(mapElement)
            }
        }
    }

    async addBordersLayerForGeoTIFF(gtSource: GeoTIFF) {
        if (!this.#map) {
            return
        }

        // Get the GeoTIFF extent to clip borders rendering
        let geoTiffExtent: number[] | undefined
        try {
            const view = await gtSource.getView()
            if (view?.extent) {
                geoTiffExtent = transformExtent(
                    view.extent,
                    view.projection!,
                    this.#map.getView().getProjection()
                )
            }
        } catch (error) {
            console.warn('Could not get GeoTIFF extent for border clipping:', error)
        }

        const vectorSource = new VectorSource({
            url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson',
            format: new GeoJSON(),
        })

        this.#bordersLayer = new VectorLayer({
            source: vectorSource,
            extent: geoTiffExtent,
            style: new Style({
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                }),
            }),
        })

        this.#map.addLayer(this.#bordersLayer)
    }

    async fetchGeotiffMetadata(
        gtSource: GeoTIFF
    ): Promise<{ [key: string]: string }> {
        await gtSource.getView()
        const internal = gtSource as any
        const gtImage = internal.sourceImagery_[0][0]
        const gtMetadata = gtImage.fileDirectory?.GDAL_METADATA

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(gtMetadata, 'application/xml')
        const items = xmlDoc.querySelectorAll('Item')

        const dataObj: { [key: string]: string } = {}

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const name = item.getAttribute('name')
            const value = item.textContent ? item.textContent.trim() : ''
            if (name) {
                dataObj[name] = value
            }
        }

        console.log('Data obj: ', dataObj)
        return dataObj
    }

    renderPixelValues(map: Map, gtLayer: WebGLTileLayer) {
        map.on('pointermove', (event: MapBrowserEvent) => {
            console.log('Event: ', event)
            const data = gtLayer.getData(event.pixel)
            const coordinate = toLonLat(event.coordinate)

            if (
                !data ||
                !(
                    data instanceof Uint8Array ||
                    data instanceof Uint8ClampedArray ||
                    data instanceof Float32Array
                ) ||
                isNaN(data[0]) ||
                data[0] === 0
            ) {
                this.pixelValue = 'N/A'
                this.pixelCoordinates = 'N/A'
                return
            }
            const val = Number(data[0]).toExponential(4)
            const coordStr = coordinate.map(c => c.toFixed(3)).join(', ')

            this.pixelValue = val
            this.pixelCoordinates = coordStr
        })
    }

    async getMinMax(gtSource: any) {
        await gtSource.getView()
        const gtImage = gtSource.sourceImagery_[0][0]

        // read raster data from band 1
        const rasterData = await gtImage.readRasters({ samples: [0] })
        const pixels = rasterData[0]

        let min = Infinity
        let max = -Infinity

        // Loop through pixels and get min and max values. This gives us a range to determine color mapping styling
        for (let i = 0; i < pixels.length; i++) {
            const val = pixels[i]
            if (!isNaN(val)) {
                // skip no-data pixels or NaN
                if (val < min) min = val
                if (val > max) max = val
            }
        }

        return { min, max }
    }

    // Referencing workshop example from https://openlayers.org/workshop/en/cog/colormap.html
    async getColorStops(name: any, min: any, max: any, steps: any, reverse: any) {
        const delta = (max - min) / (steps - 1)
        const stops = new Array(steps * 2)

        const { default: colormap } = await import('colormap')

        const colors = colormap({ colormap: name, nshades: steps, format: 'rgba' })
        if (reverse) {
            colors.reverse()
        }
        for (let i = 0; i < steps; i++) {
            stops[i * 2] = min + i * delta
            stops[i * 2 + 1] = colors[i]
        }
        return stops
    }

    #handleOpacityChange(e: any) {
        var opacity_val = e.detail
        if (this.#gtLayer) {
            this.#gtLayer.setOpacity(opacity_val)
        }
    }

    #handleColorMapChange(e: any) {
        const selectedColormap = e.detail
        // Reapply the style with the new colormap to the layer
        if (this.#gtLayer && this.#gtLayer.getSource()) {
            this.applyColorToLayer(this.#gtLayer.getSource(), selectedColormap)
        }
    }

    #abortJobStatusTask() {
        this.#controller.jobStatusTask?.abort()
    }

    async applyColorToLayer(gtSource: any, color: String) {
        var { min, max } = await this.getMinMax(gtSource)
        let gtStyle = {
            color: [
                'case',
                ['==', ['band', 2], 0],
                [0, 0, 0, 0],
                [
                    'interpolate',
                    ['linear'],
                    ['band', 1],
                    ...(await this.getColorStops(color, min, max, 72, false)),
                ],
            ],
        }

        this.#gtLayer?.setStyle(gtStyle)
    }
    render() {
        return html`
            <div class="toolbar-container">
                ${cache(
                    this.catalogVariable
                        ? html`<terra-plot-toolbar
                              dataType="geotiff"
                              .catalogVariable=${this.catalogVariable}
                              .timeSeriesData=${this.#controller.jobStatusTask?.value}
                              .location=${this.location}
                              .startDate=${this.startDate}
                              .endDate=${this.endDate}
                              .cacheKey=${this.#controller.getCacheKey()}
                              .variableEntryId=${getVariableEntryId(this)}
                              @show-opacity-value=${this.#handleOpacityChange}
                              @show-color-map=${this.#handleColorMapChange}
                              .pixelValue=${this.pixelValue}
                              .pixelCoordinates=${this.pixelCoordinates}
                          ></terra-plot-toolbar>`
                        : html`<div class="spacer"></div>`
                )}
            </div>

            <div class="map-container">
                <div id="map">
                    <div id="settings">
                        <div>
                            <strong>Value:</strong>
                            <span id="pixelValue">${this.pixelValue}</span>
                        </div>

                        <div>
                            <strong>Coordinate: </strong>
                            <span id="cursorCoordinates"
                                >${this.pixelCoordinates}</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <dialog
                ?open=${this.#controller?.jobStatusTask?.status ===
                TaskStatus.PENDING}
            >
                <terra-loader indeterminate variant="orbit"></terra-loader>
                <p>Plotting ${this.catalogVariable?.dataFieldId}&hellip;</p>
                <terra-button @click=${this.#abortJobStatusTask}>Cancel</terra-button>
            </dialog>
        `
    }
}
