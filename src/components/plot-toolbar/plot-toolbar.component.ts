import { property, query, state } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './plot-toolbar.styles.js'
import type { CSSResultGroup } from 'lit'
import type { DataType, MenuNames } from './plot-toolbar.types.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import { downloadImage, type Data } from 'plotly.js-dist-min'
import type TerraPlot from '../plot/plot.component.js'
import type { Plot } from '../plot/plot.types.js'
import { DB_NAME, getDataByKey, IndexedDbStores } from '../../internal/indexeddb.js'
import type { VariableDbEntry } from '../time-series/time-series.types.js'
import TerraButton from '../button/button.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraMap from '../map/map.component.js'
import { parseBoundingBox } from '../map/leaflet-utils.js'
import { cache } from 'lit/directives/cache.js'
import { AuthController } from '../../auth/auth.controller.js'
import { getTimeAveragedMapNotebook } from './notebooks/time-averaged-map-notebook.js'
import { getTimeSeriesNotebook } from './notebooks/time-series-notebook.js'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/plot-toolbar
 * @status experimental
 * @since 1.0
 *
 * @dependency terra-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class TerraPlotToolbar extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
        'terra-button': TerraButton,
        'terra-map': TerraMap,
    }

    @property() catalogVariable: Variable
    @property() variableEntryId: string
    @property() plot?: TerraPlot
    @property() timeSeriesData?: Partial<Data>[] | Blob
    @property() location: string
    @property() startDate: string
    @property() endDate: string
    @property() cacheKey: string
    @property() dataType: DataType
    @property({ type: Boolean, attribute: 'show-location' }) showLocation: boolean =
        true

    @state()
    activeMenuItem: MenuNames = null

    @state()
    showLocationTooltip: boolean = false

    @state()
    locationMapValue: any = []

    #tooltipTimeout: number | null = null

    @query('#menu') menu: HTMLMenuElement

    _authController = new AuthController(this)

    @watch('activeMenuItem')
    handleFocus(_oldValue: MenuNames, newValue: MenuNames) {
        if (newValue === null) {
            return
        }

        this.menu.focus()
    }

    closeMenu() {
        this.activeMenuItem = null
    }

    #handleLocationMouseEnter() {
        if (this.location && this.location.trim()) {
            try {
                this.locationMapValue = parseBoundingBox(this.location.trim())
                // Add a small delay to prevent flickering
                this.#tooltipTimeout = window.setTimeout(() => {
                    this.showLocationTooltip = true
                }, 150)
            } catch (error) {
                console.warn('Failed to parse location for tooltip:', error)
                // Don't show tooltip if parsing fails
                this.showLocationTooltip = false
            }
        }
    }

    #handleLocationMouseLeave() {
        if (this.#tooltipTimeout) {
            clearTimeout(this.#tooltipTimeout)
            this.#tooltipTimeout = null
        }
        this.showLocationTooltip = false
    }

    #getLocationIcon() {
        if (!this.location) return ''

        return html`<terra-icon
            name="outline-map-pin"
            library="heroicons"
            font-size="1em"
            class="location-icon"
            label="Point location"
        ></terra-icon>`
    }

    render() {
        const metadata = [
            this.catalogVariable.dataProductInstrumentShortName,
            this.catalogVariable.dataProductTimeInterval,
        ]
            .filter(Boolean)
            .filter(value => value.toLowerCase() !== 'not applicable')

        return cache(
            !this.catalogVariable
                ? html`<div class="spacer"></div>`
                : html` <header>
                      <div class="title-container">
                          <slot name="title">
                              <h2 class="title">
                                  ${this.catalogVariable.dataFieldLongName}
                              </h2>
                          </slot>
                          <slot name="subtitle">
                              <h3 class="subtitle">
                                  ${metadata.join(' • ')} •
                                  <a
                                      target="_blank"
                                      href="${this.catalogVariable
                                          .dataProductDescriptionUrl}"
                                      >[${this.catalogVariable
                                          .dataProductShortName}_${this
                                          .catalogVariable.dataProductVersion}]</a
                                  >
                                  ${this.showLocation
                                      ? html`• ${this.#getLocationIcon()}
                                            <span
                                                class="location-text"
                                                @mouseenter=${this
                                                    .#handleLocationMouseEnter}
                                                @mouseleave=${this
                                                    .#handleLocationMouseLeave}
                                                >${this.location.replace(
                                                    /,/g,
                                                    ', '
                                                )}</span
                                            >`
                                      : ''}
                              </h3>
                          </slot>
                      </div>

                      <div class="toggles">
                          <terra-button
                              circle
                              outline
                              aria-expanded=${this.activeMenuItem === 'information'}
                              aria-controls="menu"
                              aria-haspopup="true"
                              class="toggle"
                              @mouseenter=${this.#handleActiveMenuItem}
                              data-menu-name="information"
                          >
                              <span class="sr-only"
                                  >Information for
                                  ${this.catalogVariable.dataFieldLongName}</span
                              >

                              <terra-icon name="info" font-size="1em"></terra-icon>
                          </terra-button>

                          <terra-button
                              circle
                              outline
                              aria-expanded=${this.activeMenuItem === 'download'}
                              aria-controls="menu"
                              aria-haspopup="true"
                              class="toggle"
                              @mouseenter=${this.#handleActiveMenuItem}
                              data-menu-name="download"
                          >
                              <span class="sr-only"
                                  >Download options for
                                  ${this.catalogVariable.dataFieldLongName}</span
                              >

                              <terra-icon
                                  name="outline-arrow-down-tray"
                                  library="heroicons"
                                  font-size="1.5em"
                              ></terra-icon>
                          </terra-button>

                          <terra-button
                              circle
                              outline
                              aria-expanded=${this.activeMenuItem === 'help'}
                              aria-controls="menu"
                              aria-haspopup="true"
                              class="toggle"
                              @mouseenter=${this.#handleActiveMenuItem}
                              data-menu-name="help"
                          >
                              <span class="sr-only"
                                  >Help link for
                                  ${this.catalogVariable.dataFieldLongName}</span
                              >

                              <terra-icon
                                  name="question"
                                  font-size="1em"
                              ></terra-icon>
                          </terra-button>

                          <terra-button
                              circle
                              outline
                              aria-expanded=${this.activeMenuItem === 'jupyter'}
                              aria-controls="menu"
                              aria-haspopup="true"
                              class="toggle"
                              @mouseenter=${this.#handleActiveMenuItem}
                              data-menu-name="jupyter"
                          >
                              <span class="sr-only"
                                  >Open in Jupyter Notebook for
                                  ${this.catalogVariable.dataFieldLongName}</span
                              >

                              <terra-icon
                                  name="outline-code-bracket"
                                  library="heroicons"
                                  font-size="1.5em"
                              ></terra-icon>
                          </terra-button>
                      </div>

                      <menu
                          role="menu"
                          id="menu"
                          data-expanded=${this.activeMenuItem !== null}
                          tabindex="-1"
                          @mouseleave=${this.#handleMenuLeave}
                      >
                          <li
                              role="menuitem"
                              ?hidden=${this.activeMenuItem !== 'information'}
                          >
                              ${this.#renderInfoPanel()}
                          </li>

                          <li
                              role="menuitem"
                              ?hidden=${this.activeMenuItem !== 'download'}
                          >
                              ${this.#renderDownloadPanel()}
                          </li>

                          <li
                              role="menuitem"
                              ?hidden=${this.activeMenuItem !== 'help'}
                          >
                              ${this.#renderHelpPanel()}
                          </li>

                          <li
                              role="menuitem"
                              ?hidden=${this.activeMenuItem !== 'jupyter'}
                          >
                              ${this.#renderJupyterNotebookPanel()}
                          </li>
                      </menu>

                      ${this.showLocationTooltip
                          ? html`
                                <div class="location-tooltip">
                                    <terra-map
                                        .value=${this.locationMapValue}
                                        zoom="4"
                                        has-navigation="false"
                                        hide-bounding-box-selection="true"
                                        hide-point-selection="true"
                                        .staticMode=${true}
                                        style="width: 300px; height: 200px;"
                                    ></terra-map>
                                </div>
                            `
                          : ''}
                  </header>`
        )
    }

    #handleActiveMenuItem(event: Event) {
        const button = event.currentTarget as HTMLButtonElement
        const menuName = button.dataset.menuName as MenuNames

        // Set the menu item as active.
        this.activeMenuItem = menuName
    }

    #handleMenuLeave(event: MouseEvent) {
        // Only close if we're not moving to another element within the component
        const relatedTarget = event.relatedTarget as HTMLElement
        if (!this.contains(relatedTarget)) {
            this.activeMenuItem = null
        }
    }

    #renderInfoPanel() {
        return html`
            <h3 class="sr-only">Information</h3>

            <dl>
                <dt>Variable Longname</dt>
                <dd>${this.catalogVariable.dataFieldLongName}</dd>

                <dt>Variable Shortname</dt>
                <dd>
                    ${this.catalogVariable.dataFieldShortName ??
                    this.catalogVariable.dataFieldAccessName}
                </dd>

                <dt>Units</dt>
                <dd>
                    <code>${this.catalogVariable.dataFieldUnits}</code>
                </dd>

                <dt>Dataset Information</dt>
                <dd>
                    <a
                        href=${this.catalogVariable.dataProductDescriptionUrl}
                        rel="noopener noreffer"
                        target="_blank"
                        >${this.catalogVariable.dataProductLongName}

                        <terra-icon
                            name="outline-arrow-top-right-on-square"
                            library="heroicons"
                        ></terra-icon>
                    </a>
                </dd>

                <dt>Variable Information</dt>
                <dd>
                    <a
                        href=${this.catalogVariable.dataFieldDescriptionUrl}
                        rel="noopener noreffer"
                        target="_blank"
                        >Variable Glossary

                        <terra-icon
                            name="outline-arrow-top-right-on-square"
                            library="heroicons"
                        ></terra-icon>
                    </a>
                </dd>
            </dl>
        `
    }

    #renderDownloadPanel() {
        return html`
            <h3 class="sr-only">Download Options</h3>

            ${this.dataType === 'geotiff'
                ? html`
                      <p>
                          This plot can be downloaded as a
                          <abbr title="Geotiff">GeoTIFF</abbr>
                          file
                      </p>
                  `
                : html`
                      <p>
                          This plot can be downloaded as either a
                          <abbr title="Portable Network Graphic">PNG</abbr>
                          image or
                          <abbr title="Comma-Separated Value">CSV</abbr>
                          data.
                      </p>
                  `}
            ${this.dataType === 'geotiff'
                ? html`
                      <terra-button
                          outline
                          variant="default"
                          @click=${this.#downloadGeotiff}
                      >
                          <span class="sr-only">Download Plot Data as </span>
                          GeoTIFF
                          <terra-icon
                              slot="prefix"
                              name="outline-photo"
                              library="heroicons"
                              font-size="1.5em"
                          ></terra-icon>
                      </terra-button>
                  `
                : html`
                      <terra-button
                          outline
                          variant="default"
                          @click=${this.#downloadPNG}
                      >
                          <span class="sr-only">Download Plot Data as </span>
                          PNG
                          <terra-icon
                              slot="prefix"
                              name="outline-photo"
                              library="heroicons"
                              font-size="1.5em"
                          ></terra-icon>
                      </terra-button>

                      <terra-button
                          outline
                          variant="default"
                          @click=${this.#downloadCSV}
                      >
                          <span class="sr-only">Download Plot Data as </span>
                          CSV
                          <terra-icon
                              slot="prefix"
                              name="outline-document-chart-bar"
                              library="heroicons"
                              font-size="1.5em"
                          ></terra-icon>
                      </terra-button>
                  `}
        `
    }

    #renderHelpPanel() {
        return html`
            <h3 class="sr-only">Help Links</h3>
            <ul>
                <li>
                    <a href="https://forum.earthdata.nasa.gov/viewforum.php?f=7&DAAC=3" rel"noopener noreffer">Earthdata User Forum
                        <terra-icon
                            name="outline-arrow-top-right-on-square"
                            library="heroicons"
                        ></terra-icon>
                    </a>
                </li>
            </ul>                  
        `
    }

    #renderJupyterNotebookPanel() {
        return html`
            <h3 class="sr-only">Jupyter Notebook Options</h3>
            <p>Open this plot in a Jupyter Notebook to explore the data further.</p>
            <a
                href="#"
                @click=${(e: Event) => {
                    e.preventDefault()
                    this.#handleJupyterNotebookClick()
                }}
            >
                Open in Jupyter Notebook
                <terra-icon
                    name="outline-arrow-top-right-on-square"
                    library="heroicons"
                ></terra-icon>
            </a>
        `
    }

    #handleJupyterNotebookClick() {
        const jupyterLiteUrl = 'https://gesdisc.github.io/jupyterlite/lab/index.html'
        const jupyterWindow = window.open(jupyterLiteUrl, '_blank')

        if (!jupyterWindow) {
            console.error('Failed to open JupyterLite!')
            return
        }

        const handleMessage = (event: any) => {
            if (event.data?.type !== 'jupyterlite-ready') {
                return
            }

            console.log('JupyterLite is ready!')
            this.#sendDataToJupyterNotebook(jupyterWindow)
        }

        window.addEventListener('message', handleMessage.bind(this), { once: true })
    }

    #sendDataToJupyterNotebook(jupyterWindow: Window) {
        if (this.dataType === 'geotiff') {
            this.#sendMapDataToJupyterNotebook(jupyterWindow)
        } else {
            this.#sendTimeSeriesDataToJupyterNotebook(jupyterWindow)
        }
    }

    #sendTimeSeriesDataToJupyterNotebook(jupyterWindow: Window) {
        console.log('Sending time series data to JupyterLite...')

        // Fetch the time series data from IndexedDB
        getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            this.cacheKey
        ).then(timeSeriesData => {
            // we don't have an easy way of knowing when JupyterLite finishes loading, so we'll wait a bit and then post our notebook
            setTimeout(() => {
                const notebook = getTimeSeriesNotebook(this)

                jupyterWindow.postMessage(
                    {
                        type: 'load-notebook',
                        filename: `${encodeURIComponent(this.variableEntryId ?? 'plot')}-timeseries.ipynb`,
                        notebook,
                        timeSeriesData,
                        databaseName: DB_NAME,
                        storeName: IndexedDbStores.TIME_SERIES,
                        token: this.bearerToken,
                    },
                    '*'
                )
            }, 500)
        })
    }

    #sendMapDataToJupyterNotebook(jupyterWindow: Window) {
        console.log('Sending map data to JupyterLite...')

        // Fetch the time series data from IndexedDB
        getDataByKey<Blob>(IndexedDbStores.TIME_AVERAGE_MAP, this.cacheKey).then(
            blob => {
                // we don't have an easy way of knowing when JupyterLite finishes loading, so we'll wait a bit and then post our notebook
                setTimeout(() => {
                    const notebook = getTimeAveragedMapNotebook(this)

                    jupyterWindow.postMessage(
                        {
                            type: 'load-notebook',
                            filename: `${encodeURIComponent(this.variableEntryId ?? 'plot')}-map.ipynb`,
                            notebook,
                            blob,
                            databaseName: DB_NAME,
                            storeName: IndexedDbStores.TIME_AVERAGE_MAP,
                            token: this.bearerToken,
                        },
                        '*'
                    )
                }, 500)
            }
        )
    }

    #downloadPNG(_event: Event) {
        downloadImage(this.plot!.base, {
            filename: this.catalogVariable!.dataFieldId,
            format: 'png',
            width: 1920,
            height: 1080,
        })
    }

    #downloadCSV(_event: Event) {
        let plotData: Array<Plot> = []

        if (!Array.isArray(this.timeSeriesData)) {
            return
        }

        // convert data object to plot object to resolve property references
        this.timeSeriesData?.forEach((plot: any, index: number) => {
            plotData[index] = plot as unknown as Plot
        })

        // Return x and y values for every data point in each plot line
        const csvData = plotData
            .map(trace => {
                return trace.x.map((x: any, i: number) => {
                    return {
                        x: x,
                        y: trace.y[i],
                    }
                })
            })
            .flat()

        // Create CSV format, make it a Blob file and generate a link to it.
        const csv = this.#convertToCSV(csvData)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)

        // Create filename with variable, location, and date range
        const variableName = this.catalogVariable?.dataFieldId || 'time-series-data'
        const locationStr = this.location
            ? `_${this.location.replace(/,/g, '_')}`
            : ''
        const dateRange =
            this.startDate && this.endDate
                ? `_${this.startDate.split('T')[0]}_to_${this.endDate.split('T')[0]}`
                : ''

        const filename = `${variableName}${locationStr}${dateRange}.csv`
        link.setAttribute('download', filename)

        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    #convertToCSV(data: any[]): string {
        const header = Object.keys(data[0]).join(',') + '\n'
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n')
        return header + rows
    }

    #downloadGeotiff() {
        if (!this.timeSeriesData || !(this.timeSeriesData instanceof Blob)) {
            console.warn('No GeoTIFF available to download.')
            return
        }

        const url = URL.createObjectURL(this.timeSeriesData)
        const a = document.createElement('a')

        const locationStr = `${this.location!.replace(/,/g, '_')}`
        let file_name = `${this.variableEntryId}_${this.startDate}-${this.endDate}_${locationStr}.tif`
        a.href = url
        a.download = `${file_name}`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        console.log('Successfully downloaded tiff file...')
    }
}
