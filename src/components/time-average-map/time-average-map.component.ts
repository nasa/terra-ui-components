import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { Map, MapBrowserEvent, View } from 'ol'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import OSM from 'ol/source/OSM.js'
import type GeoTIFF from 'ol/source/GeoTIFF.js'
import Draw from 'ol/interaction/Draw.js';
import VectorSource from 'ol/source/Vector.js';
import Point from 'ol/geom/Point.js';
import { getLength } from 'ol/sphere.js';
import Feature from 'ol/Feature.js';
import VectorLayer from 'ol/layer/Vector.js';
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './time-average-map.styles.js'
import type { CSSResultGroup } from 'lit'
import { TimeAvgMapController } from './time-average-map.controller.js'
import TerraButton from '../button/button.component.js'
import TerraPlot from '../plot/plot.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
import { TaskStatus } from '@lit/task'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { cache } from 'lit/directives/cache.js'
import { AuthController } from '../../auth/auth.controller.js'
import { toLonLat } from 'ol/proj.js'
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
        'terra-plot': TerraPlot
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
    @state() metadata: { [key: string]: string } = {}
    @state() toggleState = false

    #controller: TimeAvgMapController
    #map: Map | null = null
    #gtLayer: WebGLTileLayer | null = null
    #vectorSource: VectorSource | null = null;
    #vectorLayer: VectorLayer | null = null;
    #draw: Draw | null = null;

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
    @state() plotData = {}
    @state() layout = {}

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
        }

        this.metadata = await this.fetchGeotiffMetadata(gtSource)
        this.long_name = this.metadata['long_name'] ?? ''

        if (this.#map && this.#gtLayer) {
            this.renderPixelValues(this.#map, this.#gtLayer)
            this.applyColorToLayer(gtSource, 'density') // Initial color for layer is density
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

    #getNumberOfPoints(line: any) {
        const length = getLength(line); // Getting the length of the line between data points in meters
        let pointCount;
        // Splitting
        if (length > 100) {
            pointCount = (length / 1000) / 60;
        } else {
            pointCount = length / 10;
        }
        return Math.max(2, Math.round(pointCount)); // Always at least 2
    }
    #quantizeLineString(geo: any) {
        const numPoints = this.#getNumberOfPoints(geo);
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const fraction = i / numPoints; // Calculates how far you are along the full line 

            points.push(geo.getCoordinateAt(fraction));
        }
        return points;
    }

    #handleCheckBoxToggle(e: any) {
        var isToggled = e.detail
        this.toggleState = isToggled
        if (isToggled) { // If the button is toggled, then the pixel value interpolation and scatter plotting logic will take effect
            this.#vectorSource = new VectorSource({ wrapX: false });
            this.#vectorLayer = new VectorLayer({
                source: this.#vectorSource,
            });

            this.#draw = new Draw({
                source: this.#vectorSource,
                type: 'LineString',
            });
            if (this.#map) {
                this.#map.addLayer(this.#vectorLayer)
                this.#map.addInteraction(this.#draw)

                this.#draw.on('drawend', (event: any) => {
                    const line = event.feature.getGeometry(); // Getting line geometry

                    const coords = this.#quantizeLineString(line); // Break line into chunks of points

                    // Create point features for each sampled location
                    const pointFeatures = coords.map(coord => new Feature({
                        geometry: new Point(coord),
                    }));

                    this.#vectorSource?.addFeatures(pointFeatures); // Each point will show up in the UI

                    // Obtaining geotiff data values by using list of coordinates to grab the geotiff layers corresponding data value
                    const rasterValues = coords.map(coord => {
                        const pixel = this.#map?.getPixelFromCoordinate(coord);
                        if (!pixel) return NaN;

                        const data = this.#gtLayer?.getData(pixel);
                        if (!data) return NaN;

                        if (data instanceof Uint8Array || data instanceof Uint8ClampedArray || data instanceof Float32Array) {
                            return !isNaN(data[0]) ? data[0] : NaN;
                        }

                        if (data instanceof DataView) {
                            const val = data.getFloat32(0, true);
                            return !isNaN(val) ? val : NaN;
                        }

                        return NaN;
                    });

                    const xValues = coords.map((_, index) => index); //Mapping indexes to each coordinate for the x-axis of the scatter plot
                    // Configure plot data for plot component
                    this.plotData = [
                        {
                            x: xValues,
                            y: rasterValues,
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: 'blue' },
                            marker: { size: 6 }
                        }
                    ];
                    // Configure layout for plot component
                    this.layout = {
                        title: 'Raster Values Along Line',
                        xaxis: {
                            title: 'Point Index',
                        },
                        yaxis: {
                            title: `Raster value (${this.metadata["units"]})`,
                            tickformat: '.2e' // force scientific notation (e.g., 2.21e-7)
                            // or tickformat: '.6f' // for fixed decimal (e.g., 0.000000221)
                        }
                    };
                });
            }
        }
        else { // Clean up if check box is toggled off
            // Safely remove interaction and layer if they exist
            if (this.#map && this.#draw && this.#vectorLayer) {
                this.#map.removeInteraction(this.#draw);
                this.#map.removeLayer(this.#vectorLayer);
            }

            // Clear vector features
            this.#vectorSource?.clear();

            // Clean up references
            this.#draw = null;
            this.#vectorLayer = null;
            this.#vectorSource = null;

        }
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
                              @show-check-box-toggle=${this.#handleCheckBoxToggle}
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

            ${this.toggleState && this.plotData && Object.keys(this.plotData).length && this.layout && Object.keys(this.layout).length
                ? html`<terra-plot
                    .data=${this.plotData}
                    plotTitle="Raster Profile"
                    .layout=${this.layout}
                ></terra-plot>`
                : null}
        `
    }
}
