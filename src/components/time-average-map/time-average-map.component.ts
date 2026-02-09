import { html, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ImageTile, Map, MapBrowserEvent, View } from 'ol'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import VectorLayer from 'ol/layer/Vector.js'
import Graticule from 'ol/layer/Graticule.js'
import OSM from 'ol/source/OSM.js'
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import type GeoTIFF from 'ol/source/GeoTIFF.js'
import { Style, Stroke } from 'ol/style.js'
import Draw from 'ol/interaction/Draw.js'
import Point from 'ol/geom/Point.js'
import { getLength } from 'ol/sphere.js'
import Feature from 'ol/Feature.js'
import TerraElement from '../../internal/terra-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './time-average-map.styles.js'
import type { CSSResultGroup } from 'lit'
import { TimeAvgMapController } from './time-average-map.controller.js'
import TerraButton from '../button/button.component.js'
import TerraPlot from '../plot/plot.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
import TerraAlert from '../alert/alert.component.js'
import { TaskStatus } from '@lit/task'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { cache } from 'lit/directives/cache.js'
import { AuthController } from '../../auth/auth.controller.js'
import { toLonLat, transformExtent } from 'ol/proj.js'
import { getFetchVariableTask } from '../../metadata-catalog/tasks.js'
import { getVariableEntryId } from '../../metadata-catalog/utilities.js'
import {
    extractHarmonyError,
    formatHarmonyErrorMessage,
} from '../../utilities/harmony.js'
import { watch } from '../../internal/watch.js'
import TerraLoader from '../loader/loader.component.js'
import { formatDate } from '../../utilities/date.js'
import { Environment } from '../../utilities/environment.js'
import type DataTileSource from 'ol/source/DataTile.js'
import type DataTile from 'ol/DataTile.js'
import type { TimeAverageMapOptions } from '../../events/terra-plot-options-change.js'

export default class TerraTimeAverageMap extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-plot-toolbar': TerraPlotToolbar,
        'terra-loader': TerraLoader,
        'terra-plot': TerraPlot,
        'terra-alert': TerraAlert,
    }

    @property({ reflect: true }) collection?: string
    @property({ reflect: true }) variable?: string
    @property({ attribute: 'start-date', reflect: true }) startDate?: string
    @property({ attribute: 'end-date', reflect: true }) endDate?: string
    @property({ reflect: true }) location?: string
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string
    @property({ type: String }) long_name = ''
    @property({ type: String, attribute: 'color-map-name', reflect: true })
    colorMapName: string = 'viridis'
    @property({ type: Number }) opacity = 1

    @state() catalogVariable: Variable
    @state() pixelValue: string = 'N/A'
    @state() pixelCoordinates: string = 'N/A'
    @state() metadata: { [key: string]: string } = {}
    @state() toggleState = false
    @state() minimized = false
    @state() noDataValue: number = -9999
    @state() min: string = '0'
    @state() max: string = '1'
    @state() legendValues: { value: string; rgb: string }[] = []

    /**
     * stores error information from time average map requests
     */
    @state() private timeAverageMapError: {
        code: string
        message?: string
        context?: string
    } | null = null

    #controller: TimeAvgMapController
    #map: Map | null = null
    #gtLayer: WebGLTileLayer | null = null
    #bordersLayer: VectorLayer<VectorSource> | null = null
    #vectorSource: VectorSource | null = null
    #vectorLayer: VectorLayer | null = null
    #draw: Draw | null = null
    #graticuleLayer: Graticule | null = null

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
    @state() plotData = {}
    @state() layout = {}
    @state() harmonyJobId?: string

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

    @watch(['colorMapName', 'opacity'])
    handlePlotOptionsChange() {
        this.emit('terra-plot-options-change', {
            detail: {
                colorMapName: this.colorMapName,
                opacity: this.opacity,
            } as TimeAverageMapOptions,
        })
    }
    connectedCallback(): void {
        super.connectedCallback()

        this.addEventListener(
            'terra-time-average-map-error',
            this.#handleMapError as EventListener
        )

        this.addEventListener(
            'terra-plot-toolbar-export-image',
            this.#handleExportImage as EventListener
        )
    }

    async firstUpdated() {
        this.#controller = new TimeAvgMapController(this)
        // Initialize the base layer open street map
        this.intializeMap()
        this._fetchVariableTask.run()
    }

    updated(changedProps: globalThis.Map<string, unknown>) {
        super.updated(changedProps)

        const taskStatus = this.#controller?.jobStatusTask?.status

        // Clear error when a new request starts
        if (taskStatus === TaskStatus.PENDING && this.timeAverageMapError) {
            this.timeAverageMapError = null
        }

        // Check if task has an error and we haven't already captured it via event
        if (taskStatus === TaskStatus.ERROR && !this.timeAverageMapError) {
            const taskError = this.#controller?.jobStatusTask?.error
            if (taskError) {
                // Use the utility to extract error information
                const errorDetails = extractHarmonyError(taskError)

                // Don't show errors for user-initiated cancellations
                if (errorDetails.isCancellation) {
                    return
                }

                this.timeAverageMapError = {
                    code: errorDetails.code,
                    message: errorDetails.message,
                    context: errorDetails.context,
                }
            }
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.removeEventListener(
            'terra-time-average-map-error',
            this.#handleMapError as EventListener
        )
        this.removeEventListener(
            'terra-plot-toolbar-export-image',
            this.#handleExportImage as EventListener
        )
    }

    #handleMapError = (event: CustomEvent) => {
        const { status, code, message, context } = event.detail

        // Store error information
        this.timeAverageMapError = {
            code: code || String(status),
            message,
            context,
        }
    }

    #handleExportImage = async (event: CustomEvent<{ format: 'png' | 'jpg' }>) => {
        if (!this.#map) {
            console.warn('Map not initialized, cannot export image')
            return
        }

        const format = event.detail?.format || 'png'

        try {
            // Wait for map to finish rendering
            await new Promise<void>(resolve => {
                this.#map!.once('rendercomplete', () => {
                    resolve()
                })
                // Force a render to ensure we get the rendercomplete event
                this.#map!.render()
            })

            // Get the map viewport and size
            const mapElement = this.#map.getViewport()
            const mapSize = this.#map.getSize()

            if (!mapSize) {
                console.warn('Map size is not available')
                return
            }

            const mapWidth = mapSize[0]
            const mapHeight = mapSize[1]

            // Get all canvas elements (OpenLayers can have multiple canvases for different layers)
            // We need to get them in z-order (bottom to top)
            const allCanvases = Array.from(
                mapElement.querySelectorAll('canvas')
            ) as HTMLCanvasElement[]

            // Also get SVG elements (vector layers might be rendered as SVG)
            const svgs = Array.from(
                mapElement.querySelectorAll('svg')
            ) as SVGElement[]

            if (allCanvases.length === 0 && svgs.length === 0) {
                console.warn('Could not find map canvas or SVG elements')
                return
            }

            // Create a new canvas for the final image with text overlay
            const finalCanvas = document.createElement('canvas')
            const ctx = finalCanvas.getContext('2d')
            if (!ctx) {
                console.warn('Could not get canvas context')
                return
            }

            // Set canvas size (map size + space for text)
            const textHeight = 80 // Space for text overlay
            finalCanvas.width = mapWidth
            finalCanvas.height = mapHeight + textHeight

            // Fill background with white
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

            // Draw all canvas layers in order (they should composite correctly)
            // OpenLayers renders layers from bottom to top, so we draw them in the same order
            for (const canvas of allCanvases) {
                // Ensure we're drawing at the correct size
                ctx.drawImage(
                    canvas,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                    0,
                    textHeight,
                    mapWidth,
                    mapHeight
                )
            }

            // Convert SVG elements to images and draw them on top
            for (const svg of svgs) {
                try {
                    // Clone the SVG to avoid modifying the original
                    const clonedSvg = svg.cloneNode(true) as SVGElement

                    // Set explicit dimensions on the cloned SVG
                    if (!clonedSvg.hasAttribute('width')) {
                        clonedSvg.setAttribute('width', String(mapWidth))
                    }
                    if (!clonedSvg.hasAttribute('height')) {
                        clonedSvg.setAttribute('height', String(mapHeight))
                    }

                    const svgData = new XMLSerializer().serializeToString(clonedSvg)
                    const svgBlob = new Blob([svgData], {
                        type: 'image/svg+xml;charset=utf-8',
                    })
                    const url = URL.createObjectURL(svgBlob)

                    const img = new Image()
                    await new Promise<void>((resolve, reject) => {
                        img.onload = () => {
                            ctx.drawImage(img, 0, textHeight, mapWidth, mapHeight)
                            URL.revokeObjectURL(url)
                            resolve()
                        }
                        img.onerror = () => {
                            URL.revokeObjectURL(url)
                            reject(new Error('Failed to load SVG image'))
                        }
                        img.src = url
                    })
                } catch (error) {
                    console.warn('Failed to render SVG layer:', error)
                }
            }

            // Prepare text overlay
            const textY = 30
            const lineHeight = 25
            ctx.fillStyle = '#000000'
            ctx.font = 'bold 18px Arial, sans-serif'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'

            // Format the title text
            const titleText = this.#getMapTitleText()
            const lines = this.#wrapText(ctx, titleText, mapWidth - 40, 16)

            // Draw text lines
            lines.forEach((line, index) => {
                ctx.fillText(line, 20, textY + index * lineHeight)
            })

            // Draw the legend on top of the map
            await this.#drawLegend(ctx, textHeight)

            // Convert canvas to blob and download
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
            const fileExtension = format === 'jpg' ? 'jpg' : 'png'
            const quality = format === 'jpg' ? 0.92 : undefined // JPG quality (0-1), PNG doesn't use quality

            finalCanvas.toBlob(
                blob => {
                    if (!blob) {
                        console.warn('Failed to create blob from canvas')
                        return
                    }

                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    const locationStr = this.location
                        ? `_${this.location.replace(/,/g, '_')}`
                        : ''
                    const dateRange =
                        this.startDate && this.endDate
                            ? `_${this.startDate.split('T')[0]}_to_${this.endDate.split('T')[0]}`
                            : ''
                    const variableEntryId = getVariableEntryId(this)
                    const filename = `${variableEntryId || 'map'}${locationStr}${dateRange}.${fileExtension}`

                    a.href = url
                    a.download = filename
                    a.style.display = 'none'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                },
                mimeType,
                quality
            )
        } catch (error) {
            console.error('Error exporting map as PNG:', error)
        }
    }

    async #drawLegend(ctx: CanvasRenderingContext2D, textHeight: number) {
        // Get the legend element from shadow root
        const legendElement = this.shadowRoot?.getElementById('legend')
        if (!legendElement) {
            return
        }

        // Get the #map container for relative positioning
        const mapContainer = this.shadowRoot?.getElementById('map')
        if (!mapContainer) {
            return
        }

        const legendRect = legendElement.getBoundingClientRect()
        const mapRect = mapContainer.getBoundingClientRect()

        // Calculate position relative to map (accounting for textHeight offset)
        const legendX = legendRect.left - mapRect.left
        const legendY = legendRect.top - mapRect.top + textHeight
        const legendWidth = legendRect.width
        const legendHeight = legendRect.height

        // Draw legend background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(legendX, legendY, legendWidth, legendHeight)

        // Draw border (optional, matching the border-radius style)
        ctx.strokeStyle = '#cccccc'
        ctx.lineWidth = 1
        ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

        // Get computed styles
        const computedStyle = window.getComputedStyle(legendElement)
        const fontSize = parseFloat(computedStyle.fontSize) || 12
        const fontFamily = computedStyle.fontFamily || 'monospace'
        const padding = parseFloat(computedStyle.padding) || 8

        // Draw max value
        const statsMax = legendElement.querySelector('#statsMax')
        if (statsMax) {
            ctx.fillStyle = '#000000'
            ctx.font = `${fontSize}px ${fontFamily}`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillText(
                statsMax.textContent || '',
                legendX + legendWidth / 2,
                legendY + padding
            )
        }

        // Draw color palette
        const palette = legendElement.querySelector('.palette')
        if (palette) {
            const paletteRect = palette.getBoundingClientRect()
            const paletteX = paletteRect.left - mapRect.left
            const paletteY = paletteRect.top - mapRect.top + textHeight
            const paletteWidth = paletteRect.width

            // Get all color divs
            const colorDivs = Array.from(
                palette.querySelectorAll('div')
            ) as HTMLDivElement[]

            // Draw each color div
            let currentY = paletteY
            for (const div of colorDivs) {
                const divRect = div.getBoundingClientRect()
                const divHeight = divRect.height
                const style = div.getAttribute('style') || ''
                const bgColorMatch = style.match(
                    /background-color:\s*rgba?\(([^)]+)\)/
                )

                if (bgColorMatch) {
                    const colorStr = bgColorMatch[1]
                    const [r, g, b, a = 1] = colorStr
                        .split(',')
                        .map(s => parseFloat(s.trim()))

                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
                    ctx.fillRect(paletteX, currentY, paletteWidth, divHeight)
                }

                currentY += divHeight
            }
        }

        // Draw min value
        const statsMin = legendElement.querySelector('#statsMin')
        if (statsMin) {
            ctx.fillStyle = '#000000'
            ctx.font = `${fontSize}px ${fontFamily}`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillText(
                statsMin.textContent || '',
                legendX + legendWidth / 2,
                legendY + legendHeight - padding
            )
        }
    }

    #getMapTitleText(): string {
        if (!this.catalogVariable) {
            return 'Time Averaged Map'
        }

        const parts: string[] = []

        // Add "Time Averaged Map of"
        parts.push('Time Averaged Map of')

        // Add variable long name
        if (this.catalogVariable.dataFieldLongName) {
            parts.push(this.catalogVariable.dataFieldLongName)
        }

        // Add time interval if available
        if (
            this.catalogVariable.dataProductTimeInterval &&
            this.catalogVariable.dataProductTimeInterval.toLowerCase() !==
                'not applicable'
        ) {
            parts.push(this.catalogVariable.dataProductTimeInterval)
        }

        // Add spatial resolution if available
        if (
            this.catalogVariable.dataProductSpatialResolution &&
            this.catalogVariable.dataProductSpatialResolution.toLowerCase() !==
                'not applicable'
        ) {
            parts.push(this.catalogVariable.dataProductSpatialResolution)
        }

        // Add dataset info in brackets
        if (this.catalogVariable.dataProductShortName) {
            let datasetInfo = `[${this.catalogVariable.dataProductShortName}`
            if (this.catalogVariable.dataProductVersion) {
                datasetInfo += ` v${this.catalogVariable.dataProductVersion}`
            }
            datasetInfo += ']'
            parts.push(datasetInfo)
        }

        // Add date range with "over" prefix
        if (this.startDate && this.endDate) {
            const startFormatted = formatDate(this.startDate)
            const endFormatted = formatDate(this.endDate)
            parts.push(`over ${startFormatted} - ${endFormatted}`)
        }

        return parts.join(' ')
    }

    #wrapText(
        ctx: CanvasRenderingContext2D,
        text: string,
        maxWidth: number,
        fontSize: number
    ): string[] {
        ctx.font = `bold ${fontSize}px Arial, sans-serif`
        const words = text.split(' ')
        const lines: string[] = []
        let currentLine = words[0]

        for (let i = 1; i < words.length; i++) {
            const word = words[i]
            const width = ctx.measureText(currentLine + ' ' + word).width
            if (width < maxWidth) {
                currentLine += ' ' + word
            } else {
                lines.push(currentLine)
                currentLine = word
            }
        }
        lines.push(currentLine)
        return lines
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
                    nodata: this.noDataValue,
                },
            ],
            wrapX: true, // Enable wrapping so GeoTIFF is always visible when scrolling
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

        this.metadata = await this.fetchGeotiffMetadata(gtSource)
        this.long_name = this.metadata['long_name'] ?? ''

        if (this.#map && this.#gtLayer) {
            this.renderPixelValues(this.#map, this.#gtLayer)
            this.applyColorToLayer(gtSource, this.colorMapName)

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

        this.#graticuleLayer = new Graticule({
            strokeStyle: new Stroke({
                color: 'rgba(0,0,0,0.2)',
                width: 2,
                lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: false,
        })

        this.#map = new Map({
            target: this.shadowRoot?.getElementById('map') ?? undefined,
            layers: [baseLayer, this.#graticuleLayer],
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
            let data = gtLayer.getData(event.pixel)
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
                data = null
            }

            const val = data ? Number(data[0]).toExponential(3) : 'N/A'
            const coordStr = coordinate.map(c => c.toFixed(3)).join(', ')

            this.pixelValue = val
            this.pixelCoordinates = coordStr
        })
    }

    // Get the fill value from the GeoTIFF file
    getNoDataValue(gtSource: DataTileSource<DataTile | ImageTile> | null) {
        let ndv = this.noDataValue

        if (gtSource == null) {
            return ndv
        }

        gtSource.getView().then(() => {
            const gtImage = (gtSource as any).sourceImagery_[0][0] // TODO: fix type
            ndv = parseFloat(
                gtImage.fileDirectory?.GDAL_NODATA ?? this.noDataValue.toString()
            )
        })

        return ndv
    }

    async getMinMax(gtSource: DataTileSource<DataTile | ImageTile>) {
        await gtSource.getView()
        const gtImage = (gtSource as any).sourceImagery_[0][0] // TODO: fix

        // read raster data from band 1
        const rasterData = await gtImage.readRasters({ samples: [0] })
        const pixels = rasterData[0]

        let min = Infinity
        let max = -Infinity

        // Loop through pixels and get min and max values. This gives us a range to determine color mapping styling
        for (let i = 0; i < pixels.length; i++) {
            const val = pixels[i]
            if (!isNaN(val) && val != this.getNoDataValue(gtSource)) {
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

        const dataVals = []

        if (reverse) {
            colors.reverse()
        }

        for (let i = 0; i < steps; i++) {
            stops[i * 2] = min + i * delta
            stops[i * 2 + 1] = colors[i]

            dataVals.push((min + i * delta).toExponential(2))
        }

        this.generatePalette(colors, dataVals, min, max)

        return stops
    }

    generatePalette(clrs: any, dv: any, min: any, max: any) {
        this.legendValues = []

        for (let i = clrs.length - 1; i > 0; i--) {
            const curVal = parseFloat(dv[i])
            if (curVal >= min && curVal <= max) {
                this.legendValues.push({ value: dv[i], rgb: clrs[i] })
            }
        }

        this.min = min.toExponential(3)
        this.max = max.toExponential(3)
    }

    #handleOpacityChange(e: any) {
        this.opacity = e.detail
        if (this.#gtLayer) {
            this.#gtLayer.setOpacity(this.opacity)
        }
    }

    #handleColorMapChange(e: any) {
        const selectedColormap = e.detail
        // Reapply the style with the new colormap to the layer
        if (this.#gtLayer && this.#gtLayer.getSource()) {
            this.colorMapName = selectedColormap
            this.applyColorToLayer(this.#gtLayer.getSource()!, this.colorMapName)
        }
    }

    #abortJobStatusTask() {
        this.#controller.jobStatusTask?.abort('Cancelled time averaged map request')
    }

    async applyColorToLayer(
        gtSource: DataTileSource<DataTile | ImageTile>,
        color: String
    ) {
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
        const length = getLength(line) // Getting the length of the line between data points in meters
        let pointCount
        /*

        Determines how many equally spaced points should be sampled along the line.

        Logic:
            - For short lines (≤ 100 meters): sample approximately every 10 meters.
            - For long lines (> 100 meters): sample approximately every 60 kilometers.

        Examples:
        Suppose the length of the line is 50 meters then there will be a total of 5 points (50/10)

        Suppose the length of the line is 2,472,280 meters then there will be ~41 points

        pointCount = 2472280/1000 = 2472.28 km
        pointCount = 2472.28/ 60 = 41.20466

        There will be ~41 total points
        */
        if (length > 100) {
            // Convert meters to km and sample roughly every 60 km
            pointCount = length / 1000 / 60
        } else {
            // For shorter lines, sample every 10 meters
            pointCount = length / 10
        }
        return Math.max(2, Math.round(pointCount)) // Always at least 2
    }
    #quantizeLineString(geo: any) {
        /*

        Breaks a drawn line into evenly spaced points.
    
        Uses the number of points calculated from #getNumberOfPoints(line)
        to split the line into equal segments.
    
        Example:

        If numPoints = 4, the fractions along the line will be:
            i = 0  → 0.0   (start)
            i = 1  → 0.25  (25% along)
            i = 2  → 0.5   (middle)
            i = 3  → 0.75  (75% along)
            i = 4  → 1.0   (end)
    
        Returns an array of coordinates representing these evenly spaced points.
        */

        const numPoints = this.#getNumberOfPoints(geo)
        const points = [] // Stores each coordinate
        for (let i = 0; i <= numPoints; i++) {
            const fraction = i / numPoints // Calculates how far you are along the full line

            points.push(geo.getCoordinateAt(fraction)) // Get coordinate at this position along the line
        }
        return points // Return evenly spaced coordinates
    }

    #minifyMapPopover() {
        this.minimized = !this.minimized
    }

    #cleanUpMap() {
        this.toggleState = false
        if (this.#map && this.#draw && this.#vectorLayer) {
            this.#map.removeInteraction(this.#draw)
            this.#map.removeLayer(this.#vectorLayer)
        }

        // Clear vector features
        this.#vectorSource?.clear()

        // Clean up references
        this.#draw = null
        this.#vectorLayer = null
        this.#vectorSource = null
    }

    #getRasterValueAtCoordinate(coord: [number, number]): number {
        if (!this.#map || !this.#gtLayer) return NaN

        const pixel = this.#map.getPixelFromCoordinate(coord)
        if (!pixel) return NaN

        const data = this.#gtLayer.getData(pixel)
        if (!data) return NaN

        if (
            data instanceof Uint8Array ||
            data instanceof Uint8ClampedArray ||
            data instanceof Float32Array
        ) {
            return !isNaN(data[0]) ? data[0] : NaN
        }

        if (data instanceof DataView) {
            const val = data.getFloat32(0, true)
            return !isNaN(val) ? val : NaN
        }

        return NaN
    }

    #handleCheckBoxToggle(e: any) {
        var isToggled = e.detail
        if (isToggled) {
            // If the button is toggled, then the pixel value interpolation and scatter plotting logic will take effect
            this.toggleState = isToggled
            this.#vectorSource = new VectorSource({ wrapX: false })
            this.#vectorLayer = new VectorLayer({
                source: this.#vectorSource,
            })

            this.#draw = new Draw({
                source: this.#vectorSource,
                type: 'LineString',
            })
            if (this.#map) {
                this.#map.addLayer(this.#vectorLayer)
                this.#map.addInteraction(this.#draw)

                this.#draw.on('drawend', (event: any) => {
                    const line = event.feature.getGeometry() // Getting line geometry

                    const coords = this.#quantizeLineString(line) // Break line into chunks of points

                    // Create point features for each sampled location
                    const pointFeatures = coords.map(
                        coord =>
                            new Feature({
                                geometry: new Point(coord),
                            })
                    )
                    this.#vectorSource?.addFeatures(pointFeatures) // Each point will show up in the UI

                    // Obtaining geotiff data values by using list of coordinates to grab the geotiff layers corresponding data value
                    const rasterValues = coords.map(coord =>
                        this.#getRasterValueAtCoordinate(coord)
                    )
                    const xValues = coords.map((_, index) => index) //Mapping indexes to each coordinate for the x-axis of the scatter plot

                    // Returns a list for formatted lon,lat, and data value to be used by hover tool tip
                    const lonLatCoords = coords.map(coord => {
                        const [lon, lat] = toLonLat(coord)
                        const val = this.#getRasterValueAtCoordinate(coord)
                        const rastervalue = !isNaN(val) ? val.toExponential(4) : 'N/A'
                        return [
                            parseFloat(lon.toFixed(2)),
                            parseFloat(lat.toFixed(2)),
                            rastervalue,
                        ]
                    })

                    // Formatting hover tool tip over each point that displays point index, data value, and coordinate
                    const hoverTexts = lonLatCoords.map((coord, idx) => {
                        const x = idx
                        const value = coord[2]
                        return `Index: ${x}<br>Value: ${value}<br>Coordinates: [${coord[0]}, ${coord[1]}]`
                    })

                    // Configure plot data for plot component
                    this.plotData = [
                        {
                            x: xValues,
                            y: rasterValues,
                            text: hoverTexts,
                            hoverinfo: 'text',
                            type: 'scatter',
                            mode: 'lines+markers',
                            line: { color: 'blue' },
                        },
                    ]

                    this.layout = {
                        title: 'Data Profile',
                        xaxis: {
                            title: 'Point Index',
                        },
                        yaxis: {
                            title: `Cloud Coverage (${this.metadata['units']})`,
                            tickformat: '.2e',
                        },
                    }
                })
            }
        } else {
            this.#cleanUpMap()
        }
    }
    #isVariableNotFound(): boolean {
        const variableTaskStatus = this._fetchVariableTask.status
        // Only show "variable not found" if the variable fetch task has completed
        if (variableTaskStatus !== TaskStatus.COMPLETE) {
            return false
        }

        // Check if user has provided variable information
        const hasVariableRequest = Boolean(this.collection && this.variable)

        // If user requested a variable but catalogVariable is not set, variable was not found
        return hasVariableRequest && !this.catalogVariable
    }

    #getErrorMessage(error: {
        code: string
        message?: string
        context?: string
    }): any {
        return formatHarmonyErrorMessage(error)
    }

    render() {
        return html`
            ${this.#isVariableNotFound()
                ? html`
                      <terra-alert
                          class="no-data-alert"
                          variant="danger"
                          open
                          closable
                      >
                          <terra-icon
                              slot="icon"
                              name="outline-exclamation-triangle"
                              library="heroicons"
                          ></terra-icon>
                          The selected variable was not found in the catalog
                      </terra-alert>
                  `
                : ''}
            ${this.timeAverageMapError
                ? html`
                      <terra-alert
                          class="error-alert"
                          variant="danger"
                          open
                          closable
                          @terra-after-hide=${() => (this.timeAverageMapError = null)}
                      >
                          <terra-icon
                              slot="icon"
                              name="outline-exclamation-triangle"
                              library="heroicons"
                          ></terra-icon>
                          ${this.#getErrorMessage(this.timeAverageMapError)}
                      </terra-alert>
                  `
                : ''}
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
                              show-date-range
                              .colormaps=${this.colormaps}
                              .colorMapName=${this.colorMapName}
                              .opacity=${this.opacity}
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

                    <div id="legend">
                        <div class="stats" id="statsMax">${this.max}</div>
                        <div class="palette">
                            ${this.legendValues.map(
                                value => html`
                                    <div
                                        class="color-box"
                                        style="background-color: rgba(${value.rgb})"
                                        title="${value.value}"
                                    ></div>
                                `
                            )}
                        </div>
                        <div class="stats" id="statsMin">${this.min}</div>
                    </div>
                </div>
            </div>

            ${this.harmonyJobId
                ? html`
                      <div class="harmony-job-link">
                          <a
                              href=${`https://harmony${this.environment === Environment.UAT ? '.uat' : ''}.earthdata.nasa.gov/jobs/${this.harmonyJobId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                          >
                              Request Status: ${this.harmonyJobId}
                          </a>
                      </div>
                  `
                : nothing}

            <!-- Floating Popover for Plot -->
            ${this.toggleState &&
            this.plotData &&
            Object.keys(this.plotData).length &&
            this.layout &&
            Object.keys(this.layout).length
                ? html`
                      <div class="plot-popover ${this.minimized ? 'minimized' : ''}">
                          <terra-plot
                              style="display: ${this.minimized ? 'none' : 'block'}"
                              .data=${this.plotData}
                              plotTitle="Data Profile"
                              .layout=${this.layout}
                          >
                          </terra-plot>

                          <terra-button
                              class="minify-btn"
                              @click=${this.#minifyMapPopover}
                          >
                              ${this.minimized ? 'Restore' : 'Minimize'}
                          </terra-button>
                      </div>
                  `
                : null}

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
