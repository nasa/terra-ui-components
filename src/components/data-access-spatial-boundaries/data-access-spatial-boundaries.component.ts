import { property, state, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-access-spatial-boundaries.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraLoader from '../loader/loader.component.js' 
import TerraIcon from '../icon/icon.component.js'
import TerraDataAccess from '../data-access/data-access.component.js'
import TerraDataGrid from '../data-grid/data-grid.component.js'
import TerraDialog from '../dialog/dialog.component.js'
import TerraAlert from '../alert/alert.component.js'
import TerraMap from '../map/map.component.js'
import TerraDivider from '../divider/divider.component.js'
import TerraTooltip from '../tooltip/tooltip.component.js'
import TerraToastClass from '../toast/toast.component.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import { createRef, ref } from 'lit/directives/ref.js'
import type {
    ICellRendererParams,
    ColDef,
} from 'ag-grid-community'
import { RelatedURLTypeEnum } from '../../apis/types/cmr/umm-g.js'
import type { UmmResult } from '../../apis/cmr.api.js'
import type { UmmG } from '../../apis/types/cmr/umm-g.js'
import { Stroke, Fill, Style } from 'ol/style.js'
// for feature select handling
import Select from 'ol/interaction/Select.js'
// for pointer 'move' (drag, really) handling
import { singleClick } from 'ol/events/condition.js'
import { SplitPane, Pane } from 'react-split-pane';
/*
 * build data access component
 * build spatial boundaries component
 * read data from data access
 * use boundaries utility move spatial metadata into cached list?
 * for a given file id, render its polygons on the spatial boundaries component map
 *
 */

/**
 * @summary A component that combines TerraDataAccess and TerraMap to visualize spatial boundaries
 * for selected files (granules)
 * @documentation https://terra-ui.netlify.app/components/data-access-spatial-boundaries
 * @status stable
 * @since 1.0
 *
 * @dependency terra-data-access
 * @dependency terra-map
 */

export default class TerraDataAccessSpatialBoundaries extends QueryClientMixin(TerraElement) {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-loader': TerraLoader,
        'terra-icon': TerraIcon,
        'terra-data-access': TerraDataAccess,
        'terra-map': TerraMap,
        'terra-dialog': TerraDialog,
        'terra-divider': TerraDivider,
        'terra-tooltip': TerraTooltip,
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @property({ reflect: true, attribute: 'short-name' })
    shortName?: string

    @property({ reflect: true, attribute: 'version' })
    version?: string

    @state() private _dataAccessInitialized = false
    @state() private _mapInitialized = false

    @query('terra-dialog')
    dialogElement?: TerraDialog

    @query('terra-alert')
    alertElement?: TerraAlert

    @property({ type: Boolean, reflect: true })
    dialog: boolean = true

    @state() dataAccessRef = createRef<TerraDataAccess>()
    @state() dataGridRef = createRef<TerraDataGrid<UmmResult<UmmG>>>()
    @state() mapRef = createRef<TerraMap>()

    polyInfoRef = createRef<HTMLDivElement>()

    polyInfo: string | undefined = undefined

    sp: SplitPane = undefined
    pn: Pane = undefined

    showDialog() {
        this.dialogElement?.show()
    }

    //#handleMapChange(event: TerraMapChangeEvent) {
    //    console.log("dasb, handleMapChange: ", event.detail)
    //}

    /**
     * Add listener to file selections from the data-grid element. 
     * This is how we find files and access file boundaries.
     * Boundaries will only be acquired and the layer displayed if 'showBoundaries' 
     * is true (see the handler function in MapService).
     */
    /*
    connectedCallback(): void {
        super.connectedCallback()

        document.addEventListener(
            'terra-map-change',
            this.displayPolyFeatureInfo as EventListener,
        )
    }

    disconnectedCallback(): void {
        super.disconnectedCallback?.()
        document.removeEventListener('terra-map-change', this.displayPolyFeatureInfo as EventListener)
    }
    */

    async firstVisible(): Promise<void> {
        const dataGrid = this.dataAccessRef.value?.gridRef.value
        this.#initializeDataAccess(dataGrid)
        
        //console.log("dasb, in 'firstVisible', after data access init")
        if (dataGrid) {
            console.log("dasb, dataGrid is defined")
            //dataGrid.refresh()
            this.dataAccessRef.value?.gridRef.value?.updateComplete.then((stateObj) => {
                console.log("dasb, initializing map, da loading status:  ", stateObj)
                this.#initializeMap()
            })
        }
        //document.addEventListener('terra-map-change', (event: CustomEvent) => {
        //    console.log("dasb, catching terra-map-change event for polygon select: ", event.detail)
        //    this.displayPolyFeatureInfo(event.detail)
        //})
    }

    #initializeDataAccess(dataGrid:any) {
        if (!this.dataAccessRef.value || this._dataAccessInitialized) {
            return
        }
        //console.log("data-access-spatial-boundaries:  initializing data access")
        this.dataAccessRef.value.shortName = this.shortName
        this.dataAccessRef.value.version = this.version
        this.dataAccessRef.value.collectionEntryId = this.collectionEntryId

        //let dataGrid = this.dataAccessRef.value?.gridRef.value


        //console.log("dasb, initial grid options: ", dataGrid?.gridOptions)
        //const testgrid = this.dataGridRef.value

        if (dataGrid) {

            const newColumnDefs: ColDef<UmmResult<UmmG>>[] = [
                {
                    field: 'umm.GranuleUR',
                    headerName: 'File',
                    flex: 5,
                    cellRenderer: (
                        params: ICellRendererParams<UmmResult<UmmG>>,
                    ) => {
                        if (!params.data) {
                            return ''
                        }
        
                        const url = params.data.umm.RelatedUrls?.find(
                            (relatedUrl) =>
                                relatedUrl.Type === RelatedURLTypeEnum.GetData,
                        )?.URL
        
                        if (url) {
                            const link = document.createElement('a')
                            link.href = url
                            link.target = '_blank'
                            link.title = url
                            link.textContent = params.data.umm.GranuleUR
        
                            return link
                        }
        
                        const span = document.createElement('span')
                        span.textContent = params.data.umm.GranuleUR
                        return span
                    }
                },
                {
                    headerName: '',
                    flex: 1,
                    sortable: false,
                    filter: false,
                    cellRenderer: () => {
                        const span = document.createElement('span')
                        span.title = 'Click or tap to view file boundary polygon and related info'
                        span.innerHTML = this.getFileInfoIcon().strings[0]
                        return span
                    }
                }
            ]

            dataGrid.columnDefs = newColumnDefs

            //this.dataAccessRef.value?.gridRef.value?.requestUpdate()
            const dataAccessObj = this.dataAccessRef.value?.gridRef
            //dataAccessObj.updateComplete.then(() => {
                console.log("dasb, data access object update complete: ", dataAccessObj)
                console.log("dasb, dao children, ", dataAccessObj.value?.children)

                const childElements = dataAccessObj?.value?.attributes

                if (childElements) {
                    for (const child of childElements) {
                        console.log("dasb kids: ", child.nodeName) // Logs the tag names of child elements
                    }
                }

                //const daoCols = dataAccessObj.value?
                //console.log("cols from final object: ", daoCols)
            //})

            this.dataAccessRef.value?.gridRef.value?.updateComplete.then(() => {
                const gridColumnCount = this.dataAccessRef.value?.gridRef.value?.columnDefs?.length ?? 0
                //this.sleep(2000)
                //const columns = this.dataAccessRef.value?.gridRef.value?.columnDefs
                const curGrid = this.dataAccessRef.value?.gridRef.value
                const test = curGrid?.shadowRoot?.querySelector('[part~="grid"]')
                //const colCount = test?.shadowRoot?.querySelectorAll('[col-id~="umm.GranuleUR"]')
                console.log("grid column count: ", gridColumnCount)
                console.log("grid column html: ", test)
                console.log("curGrid, ", curGrid)
                if (gridColumnCount > 2) {
                    console.log("dasb column count > 2")
                    //dataGrid.columnDefs = newColumnDefs
                    //this.dataAccessRef.value?.requestUpdate()
                }

                //const rowDataStuff = this.dataAccessRef.value?.gridRef.value?.rowData?.values
                //this.dataAccessRef.value?.gridRef.value?.rowData?.values
                //console.log("dasb, grid row data: ", rowDataStuff)

                //const dasbHtml = this.dataAccessRef.value
                //console.log("dasb html comp: ", dasbHtml)
                //const cols = this.shadowRoot?.querySelector('ag-cell-value')
                //console.log("dasb, cols: ", cols)
                //console.log("dasb, data access ref after update: ", this.dataAccessRef)
                //console.log("dasb, grid options after update: ", dataGrid)
                //const gridOpts = dataGrid.gridOptions ??= {}
                //dataGrid.gridOptions = {
                //    ...gridOpts,
                //    columnDefs: newColumnDefs
                //}
            })


            //this.dataAccessRef.value?.updateComplete.then(() => {
            //    console.log("dasb, grid options after: ", gridOpts)
            //})
            
            //dataGrid.columnDefs = newColumnDefs

            //this.dataAccessRef.value?.updateComplete.then(() => {

            //console.log("dasb, grid options before: ", gridOpts)
 
            //gridOpts.columnDefs = newColumnDefs

            //console.log("dasb, grid options after: ", gridOpts)

            //})

            //console.log("dasb, data grid column definitions: ", dataGrid.columnDefs)

            //dataGrid.gridOptions.columnsDefs = newColumnDefs



            /*

            dataGrid.gridOptions = {
                ...gridOpts,
                columnDefs: newColumnDefs
            }
                */
            //dataGrid.updateComplete.then(() => {
            //    dataGrid.refresh()
            //})


            /*
            grid.gridOptions = {
                newColumnDefs,
                //defaultColDef: {
                //    flex: 1,
                //    minWidth: 100,
                //    sortable: true,
                //    resizable: true,
                //    sortingOrder: ['desc', 'asc', null],
                //},
                rowBuffer: 25,
                cacheBlockSize: 50,
                maxConcurrentDatasourceRequests: 2,
                infiniteInitialRowCount: 50,
            }
                */

            /*
            const gridColDefs = grid.columnDefs

            
            gridColDefs?.forEach((colDef) => {
                if (colDef.headerName === 'Start Date') {
                    console.log("hiding start date column")
                    colDef.hide = true
                }
                if (colDef.headerName === 'End Date') {
                    console.log("hiding end date column")
                    colDef.hide = true
                }
                if (colDef.headerName === 'Size (MB)') {
                    console.log("hiding size column")
                    colDef.hide = true
                }
                if (colDef.headerName === 'Cloud Cover (%)') {
                    console.log("hiding cloud cover column")
                    colDef.hide = true
                }
            })
                */
            //grid.columnDefs = columnDefs
            //grid.requestUpdate()    
            //console.log("grid column defs: ", this.dataGrid.gridOptions?.columnDefs)
            //dataGrid.refresh()    
        }

        //console.log("dasb, grid options: ", this.dataGrid?.gridOptions)
        this._dataAccessInitialized = true
    }

    getFileInfoIcon(): any {
        return html`
            <terra-icon 
                class='data-access-info-icon' 
                name='outline-globe-alt' 
                library='heroicons' 
                aria-hidden='true'>
            </terra-icon>
        `
    }

    #initializeMap() {
        if (!this.mapRef.value || this._mapInitialized) {
            return
        }
        this.mapRef.value.hasNavigation = true
        this.mapRef.value.showGraticule = true
        this.mapRef.value.showBoundaries = true
        this.mapRef.value.showMouseCoordinates = true

        this.initializePolygonSelection(this.mapRef)

        this._mapInitialized = true

        console.log("data-access-spatial-boundaries:  initializing map, map values: ", this.mapRef.value)
    }

    colorStyle(style:any) {
        return function (f:any) {
            //console.log("colorStyle, f: ", f)
            //console.log("colorStyle, get style: ", style)
            style.getFill().setColor(f.get('color') || 'rgba(255,0,0,0.3)');
            return style;
        };
    }

    polySelectStyle = new Style({
        fill: new Fill({
            color: 'rgba(255,100,100,0.3)',
        }),
        stroke: new Stroke({
            color: 'red',
            width: 3,
        }),
    });

    initializePolygonSelection(mapRef:any) {
        const select = new Select({
            condition: singleClick,
            style: this.colorStyle(this.polySelectStyle),
        });

        const dasbRef = this
        if (mapRef) {
            mapRef.value.getMap().addInteraction(select);        
            select.on('select', function (e) {
                if (e.selected.length > 0) {
                    console.log("dasb for map, SELECT: ", e.selected[0])
                    let props = e.selected[0].getProperties()      
                    dasbRef.displayPolyFeatureInfo(props)
                } else {
                    console.log("dasb, select, no event selected obj")
                }
            })
        }
    }

    /* 
     * Handle the click of a row in the data access grid.  
     * The event detail contains the file id and other metadata for the selected file.  
     * We use this information to display the spatial boundaries of the selected file in the map component. 
     * */
    #handleDataAccessTableRowClicked(event:any) {
        const mapElemRef = this.mapRef.value!
        mapElemRef.setBoundaryPolygons(event)
    }

    displayPolyFeatureInfo(options:any): void {
        console.log("dasb, inside displayPolyFeatureInfo, options: ", options)
        if (!options) {
            console.warn("data-access-spatial-boundaries, displayPolyFeatureInfo: no options provided")
            return
        }
        let optionsHtml = ''
        for (let key in options) {
            //console.log("dasb, displayPolyFeatureInfo, key: ", key, " value: ", options[key])
            //console.log("map.service.displayPolyFeatureInfo, options, fileData: ", options.fileData)
            //if (key === 'fileData') {
                if (options[key] !== null && options[key] !== undefined && key !== 'geometry') {
                    optionsHtml += '<strong>' + key + '</strong>:  ' + options[key] + '<br/>'
                    //Object.keys(options[key]).forEach((fileDataKey) => {
                    //    console.log("key: ", fileDataKey)
                    //    console.log("value: ", options[fileDataKey])
                    //    if (fileDataKey !== 'geometry' && options[fileDataKey] !== null && options[fileDataKey] !== undefined) {
                    //        optionsHtml += '<strong>' + fileDataKey + '</strong>:  ' + options[fileDataKey] + '<br/>'
                    //    }
                    //}) 
                            //console.log("dasb, options HTML: ", optionsHtml)
                    //Object.keys(options[key]).forEach((fileDataKey) => {
                    //    if (fileDataKey === 'geometry' && options[key][fileDataKey] !== null && options[key][fileDataKey] !== undefined) {
                    //        //console.log("displayPolyFeatureInfo, fileDataKey: ", fileDataKey, " value: ", options[key][fileDataKey])
                    //        optionsHtml += '<strong>Extent</strong>:  ' + options[key][fileDataKey].extent + '<br/>'
                    //    }
                    //})
                }
            //}
            
        }

        var infoElement = this.polyInfoRef.value || document.getElementById('polygonFeatureInfo')
        if (infoElement) {
            infoElement.innerHTML = optionsHtml
            this.polyInfo = optionsHtml
            
        } else {
            console.warn("displayPolyFeatureInfo: could not find element with id 'polygonFeatureInfo'")
        }

    }

    sleep(milliseconds:any) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    getCopyAlert(): any {
        return html`
            <terra-alert id="copy-alert" variant="information" duration="3000" closable>
                <terra-icon slot="icon" name="outline-information-circle" library="heroicons"></terra-icon>
                Content copied
            </terra-alert>
        `
    }

    copyPolyInfoToClipboard() {
        // Use writeText to avoid passing undefined or non-ClipboardItem types
        const text = (this.polyInfo === undefined || this.polyInfo === null) ? 
            '' : String(this.polyInfo).replaceAll('<br\/>','\n')
        const regex = /(<([^>]+)>)/gi;
        const result = text.replace(regex, "");
        navigator.clipboard.writeText(result).catch((e) => console.error('Clipboard write failed', e))
        TerraToastClass.notify(
            'Boundary information copied', 
            'information', 
            'outline-information-circle', 
            2000,
            false);
    }

    render() {
        return html `
            <div id="dasp-flex-container" style="display: flex; flex-direction: row; height: 100%;">
            <div class="data-access-container">
                <terra-data-access id="file-access"
                    ${ref(this.dataAccessRef)}
                    @terra-row-clicked="${this.#handleDataAccessTableRowClicked}">
                </terra-data-access>
            </div>
            <div class="dasb-map-container">
                <div class="dasb-map-header">Spatial Boundaries Map  
                    <terra-tooltip content="Click on a file row to show the spatial boundaries of that file.\n 
                        If no boundary is shown, the file has no spatial metadata.\n If a boundary is shown, 
                        click on it to see its coordinates and properties.">                                    
                        <terra-button variant="text">
                            <terra-icon
                                name="outline-information-circle"
                                library="heroicons"
                                font-size="18px"
                            ></terra-icon>
                        </terra-button>
                    </terra-tooltip>
                </div>
                <terra-map class="dasb-map" style="border: none;"
                    ${ref(this.mapRef)}
                    show-boundaries>
                </terra-map>
                <div class="poly-feature-info-title">
                    Boundary Information
                    <terra-button id="dasb-poly-feature-copy-button" variant="text"
                        @click=${(e: Event) => {
                            e.stopPropagation()
                            this.copyPolyInfoToClipboard()
                        }}>
                        <terra-icon
                            name="outline-clipboard-document"
                            library="heroicons"
                            font-size="18px"
                        ></terra-icon>
                    </terra-button>
                </div>
                <div ${ref(this.polyInfoRef)} id="polygonFeatureInfo" class="polygon-feature-info"
                    <span>Polygon feature information will appear here when you click on a polygon in the map above.</span> 
                </div>
            </div>
        </div>
        `
    }
}