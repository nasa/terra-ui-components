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
import { cache } from 'lit/directives/cache.js'
import { nothing } from 'lit';

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
    @property({ type: Boolean }) showPixelValues = false
    @property({ type: String }) colormap = 'viridis' // default colormap
    @property({ type: Number }) opacity = 1;
    @property() pixelValue = 'N/A';
    @property() pixelCoordinates = 'N/A';




    @state()
    activeMenuItem: MenuNames = null

    @state() colormaps = [
        'jet', 'hsv', 'hot', 'cool', 'spring', 'summer', 'autumn', 'winter', 'bone',
        'copper', 'greys', 'YIGnBu', 'greens', 'YIOrRd', 'bluered', 'RdBu', 'picnic',
        'rainbow', 'portland', 'blackbody', 'earth', 'electric', 'viridis', 'inferno',
        'magma', 'plasma', 'warm', 'cool', 'bathymetry', 'cdom', 'chlorophyll', 'density',
        'fressurface-blue', 'freesurface-red', 'oxygen', 'par', 'phase', 'salinity',
        'temperature', 'turbidity', 'velocity-blue', 'velocity-green', 'cubhelix'
    ];
    @state() colorMapName = 'density';

    @query('#menu') menu: HTMLMenuElement

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

    render() {
        return cache(
            !this.catalogVariable
                ? html`<div class="spacer"></div>`
                : html` <header>
                      <slot name="title">
                          <h2 class="title">
                              ${this.catalogVariable.dataFieldLongName}
                          </h2>
                      </slot>

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
                        
                          ${this.dataType == 'geotiff' ? html`
                              <terra-button
                              circle
                              outline
                              aria-expanded=${this.activeMenuItem === 'GeoTIFF'}
                              aria-controls="menu"
                              aria-haspopup="true" 
                              class="toggle"
                              @mouseenter=${this.#handleActiveMenuItem}
                              data-menu-name="GeoTIFF"
                          >
                              <terra-icon
                                  name="outline-cog-8-tooth"
                                  library="heroicons"
                                  font-size="1.5em"
                              ></terra-icon>
                          </terra-button>
                            `:
                        nothing}
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

                          <li
                              role="menuitem"
                              ?hidden=${this.activeMenuItem !== 'GeoTIFF'}
                          >
                              ${this.#renderGeotiffPanel()}
                          </li>
                      </menu>
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
        // If the GeoTIFF menu is in use, it will only close if you hover outside of the time average map component
        const relatedTarget = event.relatedTarget as HTMLElement

        if (!this.contains(relatedTarget)) {
            if (this.activeMenuItem !== 'GeoTIFF') {
                this.closeMenu()
            }
            else {
                if (relatedTarget.className !== 'ol-layer') {
                    this.closeMenu()
                }
            }
        }
    }

    #onShowOpacityChange = (e: Event) => {
        this.opacity = parseFloat((e.target as HTMLInputElement).value);
        this.dispatchEvent(new CustomEvent('show-opacity-value', {
            detail: this.opacity,
            bubbles: true,
            composed: true
        }));

    };

    #onColorMapChange = (e: Event) => {

        this.colorMapName = (e.target as HTMLInputElement).value
        this.dispatchEvent(new CustomEvent('show-color-map', {
            detail: this.colorMapName,
            bubbles: true,
            composed: true
        }));

    };
    #renderGeotiffPanel() {
        return html`
          <h3 class="sr-only">GeoTIFF Settings</h3>
      
          ${this.dataType === 'geotiff' ? html`
            <p>Select opacity, display pixel values, and apply colormaps</p>

            <div ><strong>Value:</strong> <span id="pixelValue"> ${this.pixelValue}</span></div>
            <div><strong>Coordinate: </strong> <span id="cursorCoordinates">${this.pixelCoordinates}</span></div>

            <label>
                Layer opacity
                <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                .value=${String(this.opacity)}
                @change=${this.#onShowOpacityChange}
                />
                <span id="opacity-output">${this.opacity.toFixed(2)}</span>
            </label>

            <label>
                ColorMap:
                <select id="colormap-select" @change=${this.#onColorMapChange}>
                    ${this.colormaps.map(cm => html`
                    <option value="${cm}" ?selected=${cm === this.colorMapName}>
                    ${cm}
                    </option>`)}
                </select>
                </label>
          ` : nothing}
        `
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

        // Fetch the time series data from IndexedDB
        getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            this.cacheKey
        ).then(timeSeriesData => {
            // we don't have an easy way of knowing when JupyterLite finishes loading, so we'll wait a bit and then post our notebook
            setTimeout(() => {
                const notebook = [
                    {
                        id: '2733501b-0de4-4067-8aff-864e1b4c76cb',
                        cell_type: 'code',
                        source: '%pip install -q terra_ui_components',
                        metadata: {
                            trusted: true,
                        },
                        outputs: [],
                        execution_count: null,
                    },
                    {
                        id: '870c1384-e706-48ee-ba07-fd552a949869',
                        cell_type: 'code',
                        source: `from terra_ui_components import TerraTimeSeries\ntimeseries = TerraTimeSeries()\n\ntimeseries.variableEntryId = '${this.variableEntryId}'\ntimeseries.startDate = '${this.startDate}'\ntimeseries.endDate = '${this.endDate}'\ntimeseries.location = '${this.location}'\n\ntimeseries`,
                        metadata: {
                            trusted: true,
                        },
                        outputs: [],
                        execution_count: null,
                    },
                ]

                jupyterWindow.postMessage(
                    {
                        type: 'load-notebook',
                        filename: `${encodeURIComponent(this.variableEntryId ?? 'plot')}.ipynb`,
                        notebook,
                        timeSeriesData,
                        databaseName: DB_NAME,
                        storeName: IndexedDbStores.TIME_SERIES,
                    },
                    '*'
                )
            }, 500)
        })
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
