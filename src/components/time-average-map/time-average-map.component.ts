import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { Map, MapBrowserEvent, View } from 'ol'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import OSM from 'ol/source/OSM.js'
import GeoTIFF from 'ol/source/GeoTIFF.js'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './time-average-map.styles.js'
import type { CSSResultGroup } from 'lit'
import { watch } from '../../internal/watch.js'
import { TimeAvgMapController } from './time-average-map.controller.js'
import TerraButton from '../button/button.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
import { GiovanniVariableCatalog } from '../../metadata-catalog/giovanni-variable-catalog.js'
import { Task } from '@lit/task'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { cache } from 'lit/directives/cache.js'
import { AuthController } from '../../auth/auth.controller.js'
import { toLonLat } from 'ol/proj.js'
// @ts-ignore
import colormap from 'colormap'

export default class TerraTimeAverageMap extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-plot-toolbar': TerraPlotToolbar,
    }

    /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     */
    @property({ reflect: true })
    collection?: string

    @property({ reflect: true })
    variable?: string

    @property({
        attribute: 'start-date',
        reflect: true,
    })
    startDate?: string

    @property({
        attribute: 'end-date',
        reflect: true,
    })
    endDate?: string

    /**
     * The point location in "lat,lon" format.
     * Or the bounding box in "west,south,east,north" format.
     */
    @property({
        reflect: true,
    })
    location?: string

    @state()
    activeMenuItem: any = null

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

    @watch('activeMenuItem')
    handleFocus(_oldValue: any, newValue: any) {
        if (newValue === null) {
            return
        }

        this.menu.focus()
    }

    /**
     * The token to be used for authentication with remote servers.
     * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
     * The property's value will be inserted after "Bearer" (the authentication scheme).
     */
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string

    @property({ type: String })
    long_name = ''

    @query('#menu') menu: HTMLMenuElement

    @state() catalogVariable: Variable

    #controller: TimeAvgMapController
    #catalog = new GiovanniVariableCatalog()
    _authController = new AuthController(this)

    #map: Map | null = null
    #gtLayer: WebGLTileLayer | null = null

    /**
     * anytime the collection or variable changes, we'll fetch the variable from the catalog to get all of it's metadata
     */
    _fetchVariableTask = new Task(this, {
        task: async (_args, { signal }) => {
            const variableEntryId = this.getVariableEntryId()

            if (!variableEntryId) {
                return
            }

            console.debug('Fetch variable ', variableEntryId)

            const variable = await this.#catalog.getVariable(variableEntryId, {
                signal,
            })

            console.debug('Found variable ', variable)

            if (!variable) {
                return
            }

            // if we don't have dates, use the example initial dates, which is the last 7 days of data
            this.startDate =
                this.startDate ?? variable.exampleInitialStartDate?.toISOString()
            this.endDate =
                this.endDate ?? variable.exampleInitialEndDate?.toISOString()

            this.catalogVariable = variable
        },
        args: () => [this.collection, this.variable],
    })

    async firstUpdated() {
        this.#controller = new TimeAvgMapController(this)
        // Initialize the base layer open street map
        this.intializeMap()
        this.updateGeoTIFFLayer()
    }

    async updateGeoTIFFLayer() {
        await this.#controller.jobStatusTask.run()
        // The task returns the blob upon completion
        let job_status_value = this.#controller.jobStatusTask.value
        const blobUrl = URL.createObjectURL(job_status_value)

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
        }

        const metadata = await this.fetchGeotiffMetadata(gtSource)
        this.long_name = metadata['long_name'] ?? ''

        if (this.#map && this.#gtLayer) {
            this.renderPixelValues(this.#map, this.#gtLayer)
            this.applyColorToLayer(gtSource, 'density')
            const opacityInput = this.shadowRoot?.getElementById(
                'opacity-input'
            ) as HTMLInputElement | null
            const opacityOutput = this.shadowRoot?.getElementById(
                'opacity-output'
            ) as HTMLElement | null

            if (opacityInput && opacityOutput) {
                const updateOpacity = () => {
                    const opacity = parseFloat(opacityInput.value)
                    if (this.#gtLayer) {
                        this.#gtLayer.setOpacity(opacity)
                    }
                    opacityOutput.innerText = opacity.toFixed(2)
                }

                opacityInput.addEventListener('input', updateOpacity)

                // Initialize output display with default slider value
                updateOpacity()
            }
        }
    }

    renderPixelValues(map: Map, gtLayer: WebGLTileLayer) {
        const pixelValueEl = this.shadowRoot?.getElementById('pixelValue')
        const coordEl = this.shadowRoot?.getElementById('cursorCoordinates')

        map.on('pointermove', (event: MapBrowserEvent) => {
            const data = gtLayer.getData(event.pixel)
            const coordinate = toLonLat(event.coordinate)
            //TODO: Address type script error
            // @ts-ignore
            // Set pixel/coordinate display to N/A if the pixel values are zero or NaN
            if (!data || isNaN(data[0]) || data[0] === 0) {
                if (pixelValueEl) pixelValueEl.textContent = 'N/A'
                if (coordEl) coordEl.textContent = 'N/A'
                return
            }
            //TODO: Address type script error
            // @ts-ignore
            const val = Number(data[0]).toExponential(4)
            const coordStr = coordinate.map(c => c.toFixed(3)).join(', ')

            if (pixelValueEl) pixelValueEl.textContent = val
            if (coordEl) coordEl.textContent = coordStr
        })
    }

    // Referencing workshop example from https://openlayers.org/workshop/en/cog/colormap.html
    getColorStops(name: any, min: any, max: any, steps: any, reverse: any) {
        const delta = (max - min) / (steps - 1)
        const stops = new Array(steps * 2)
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
            controls: [],
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
                    ...this.getColorStops(color, min, max, 72, false),
                ],
            ],
        }

        this.#gtLayer?.setStyle(gtStyle)
    }

    #onColorMapChange(event: Event) {
        const selectedColormap = (event.target as HTMLSelectElement).value
        // Reapply the style with the new colormap
        if (this.#gtLayer && this.#gtLayer.getSource()) {
            this.applyColorToLayer(this.#gtLayer.getSource(), selectedColormap)
        }
    }

    getVariableEntryId() {
        if (!this.collection || !this.variable) {
            return
        }

        return `${this.collection}_${this.variable}`
    }

    render() {
        return html`
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
                          .variableEntryId=${this.getVariableEntryId()}
                      ></terra-plot-toolbar>`
                    : html`<div class="spacer"></div>`
            )}

            <!-- Display pixels/coordinate/opacity/colormap list in Map  -->
            <div id="map"">
              <div id="settings">
                <div><strong>Value:</strong> <span id="pixelValue">N/A</span></div>
                <div><strong>Lat,Lon:</strong> <span id="cursorCoordinates">N/A</span></div>
                <div>
                  <label>
                    Layer opacity
                    <input id="opacity-input" type="range" min="0" max="1" step="0.01" value="1" />
                    <span id="opacity-output"></span>
                  </label>
                  <label>
                    ColorMap:
                    <select id="colormap-select" @change=${this.#onColorMapChange}>
                      ${this.colormaps.map(
                          cm =>
                              html` <option
                                  value="${cm}"
                                  ?selected=${cm === this.colorMapName}
                              >
                                  ${cm}
                              </option>`
                      )}
                    </select>
                    </label>
                </div>
              </div>
            </div>
        `
    }
}
