import { property, state, query } from 'lit/decorators.js'
//import { useState } from 'lit/hooks.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-access-spatial-boundaries.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraLoader from '../loader/loader.component.js' 
import TerraIcon from '../icon/icon.component.js'
//import type { TerraMapChangeEvent } from '../../events/terra-map-change.js'
//import type { MapEventDetail } from '../map/type.js'
//import { MapEventType } from '../map/type.js'
//import { createRef, ref } from 'lit/directives/ref.js'
import TerraDataAccess from '../data-access/data-access.component.js'
import TerraDialog from '../dialog/dialog.component.js'
import TerraAlert from '../alert/alert.component.js'
import TerraMap from '../map/map.component.js'
import TerraDivider from '../divider/divider.component.js'
import TerraTooltip from '../tooltip/tooltip.component.js'
//import TerraToast from '../toast/toast.component.js'
//import TerraToastClass from '../toast/toast.component.js'
//import TerraSpatialBoundaries from '../spatial-boundaries/spatial-boundaries.component.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import { createRef, ref } from 'lit/directives/ref.js'
import type {
    ICellRendererParams,
    ColDef,
} from 'ag-grid-community'
import { RelatedURLTypeEnum } from '../../apis/types/cmr/umm-g.js'
import type { UmmResult } from '../../apis/cmr.api.js'
import type { UmmG } from '../../apis/types/cmr/umm-g.js'
//import { forEachCorner } from 'ol/extent.js'

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

    //service = new DataAccessService()

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @property({ reflect: true, attribute: 'short-name' })
    shortName?: string

    @property({ reflect: true, attribute: 'version' })
    version?: string

    dataAccessRef = createRef<TerraDataAccess>()
    mapRef = createRef<TerraMap>()

    polyInfoRef = createRef<HTMLDivElement>()

    @state() private _dataAccessInitialized = false
    @state() private _mapInitialized = false

    @query('terra-dialog')
    dialogElement?: TerraDialog

    @query('terra-alert')
    alertElement?: TerraAlert

    @property({ type: Boolean, reflect: true })
    dialog: boolean = true

    showDialog() {
        this.dialogElement?.show()
    }


   // @property({ type: Object})
   // boundaryContent: Record<string, unknown> = {}

    async firstVisible(): Promise<void> {
        this.#initializeDataAccess()
        this.#initializeMap()
        this.addEventListener('terra-poly-select', (event: CustomEvent) => {
            this.displayPolyFeatureInfo(event.detail)
        })
    }

    #initializeDataAccess() {
        if (!this.dataAccessRef.value || this._dataAccessInitialized) {
            return
        }
        console.log("data-access-spatial-boundaries:  initializing data access")
        this.dataAccessRef.value.shortName = this.shortName
        this.dataAccessRef.value.version = this.version
        this.dataAccessRef.value.collectionEntryId = this.collectionEntryId

        const grid = this.dataAccessRef.value.gridRef.value

        if (grid) {

                const columnDefs: ColDef<UmmResult<UmmG>>[] = [
                    {
                        field: 'umm.GranuleUR',
                        headerName: 'File',
                        flex: 1,
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
                ]
            
            grid.columnDefs = columnDefs


            console.log("setting grid options")
            //const gridOpts = grid.gridOptions ??= {}

            grid.gridOptions = {
                defaultColDef: {
                    flex: 1,
                    minWidth: 100,
                    sortable: true,
                    resizable: true,
                    sortingOrder: ['desc', 'asc', null],
                },
                rowBuffer: 25,
                cacheBlockSize: 50,
                maxConcurrentDatasourceRequests: 2,
                infiniteInitialRowCount: 50,
            }

            //const gridColDefs = grid.columnDefs
            console.log("grid column defs: ", columnDefs)
            /*
            gridColDefs?.forEach((colDef) => {
                if (colDef.headerName === 'Start Date') {
                    colDef.hide = true
                }
                if (colDef.headerName === 'End Date') {
                    colDef.hide = true
                }
                if (colDef.headerName === 'Cloud Cover (%)') {
                    colDef.hide = true
                }
            })
            */
            //grid.requestUpdate()    
            grid.refresh()    
        }

        console.log("grid options should be set; data access initialized")
        this._dataAccessInitialized = true
    }

    #initializeMap() {
        if (!this.mapRef.value || this._mapInitialized) {
            return
        }
        this.mapRef.value.hasNavigation = true
        this.mapRef.value.showGraticule = true
        this.mapRef.value.showBoundaries = true
        this.mapRef.value.showMouseCoordinates = true
        this._mapInitialized = true
        console.log("data-access-spatial-boundaries:  initializing map, map values: ", this.mapRef.value)
    }

    /* 
     * Handle the click of a row in the data access grid.  
     * The event detail contains the file id and other metadata for the selected file.  
     * We use this information to display the spatial boundaries of the selected file in the map component. 
     * */
    #handleRowClicked(event:any) {
        //console.log("handling data grid row click: ",event)
        const mapElemRef = this.mapRef.value!
        mapElemRef.setPolygons(event)
    }

    displayPolyFeatureInfo(options:any): void {
        console.log("dasb, inside displayPolyFeatureInfo, options: ", options)
        if (!options) {
            console.warn("data-access-spatial-boundaries, displayPolyFeatureInfo: no options provided")
            return
        }
        let optionsHtml = ''
        for (let key in options) {
            //console.log("displayPolyFeatureInfo, key: ", key, " value: ", options[key])
            //console.log("displayPolyFeatureInfo, options, fileData: ", options.fileData)
            if (key === 'fileData') {
                if (options[key] !== null && options[key] !== undefined) {
                    Object.keys(options[key]).forEach((fileDataKey) => {
                        if (fileDataKey !== 'geometry' && options[key][fileDataKey] !== null && options[key][fileDataKey] !== undefined) {
                            optionsHtml += '<strong>' + fileDataKey + '</strong>:  ' + options[key][fileDataKey] + '<br/>'
                        }
                    }) 
                    //Object.keys(options[key]).forEach((fileDataKey) => {
                    //    if (fileDataKey === 'geometry' && options[key][fileDataKey] !== null && options[key][fileDataKey] !== undefined) {
                    //        //console.log("displayPolyFeatureInfo, fileDataKey: ", fileDataKey, " value: ", options[key][fileDataKey])
                    //        optionsHtml += '<strong>Extent</strong>:  ' + options[key][fileDataKey].extent + '<br/>'
                    //    }
                    //})
                }
            }
            
        }
        var infoElement = this.polyInfoRef.value || document.getElementById('polygonFeatureInfo')
        if (infoElement) {
            infoElement.innerHTML = optionsHtml
        } else {
            console.warn("displayPolyFeatureInfo: could not find element with id 'polygonFeatureInfo'")
        }

        //TerraToastClass.notify(
        //    optionsHtml || 'No properties found for this polygon', 
        //    'information', 
        //    'solid-information-circle', 
        //    20000,
        //    false);

        //return html`
        //    <terra-alert variant="information" duration="3000" open closable onTerraAfterHide={() => setOpen(false)}>
        //        <terra-icon
        //            slot="icon"
        //            name="outline-information-circle"
        //            library="heroicons"
        //        ></terra-icon>
        //        ${optionsHtml}
        //    </terra-alert>
        //`
    }

    render() {
        return html `
        <div id="dasp-flex-container" style="display: flex; flex-direction: row; height: 100%;">
            <div class="data-access-container">
                <terra-data-access
                    ${ref(this.dataAccessRef)}
                     @terra-row-clicked="${this.#handleRowClicked}"
                     @terra-row-hovered="${this.#handleRowClicked}">
                </terra-data-access>

                <script>
                    //const grid = document.querySelector('#grid-event')
                </script>
            </div>
            <terra-divider 
                orientation="vertical" 
                style="--terra-divider-color: var(--terra-border-primary, #9e7440); --terra-divider-width: 3px; --terra-divider-margin: 3px;">
            </terra-divider>
            <div class="dasb-map-container" 
                style="margin-left:1em; border: 1px solid var(--terra-border-primary, #9e7440); padding: 0.5em; border-radius: 4px; background-color: var(--terra-background-secondary, #ffffff);">
                <div style="margin-left: 1em; margin-bottom: -1em;">SpatialBoundaries Map  
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
                    show-boundaries
                    @terra-map-change="${(event: CustomEvent) => {
                        console.log("map change event: ", event)
                    }}">
                </terra-map>
                <div class="poly-feature-info-title">
                    Boundary Information
                </div>
                <div ${ref(this.polyInfoRef)} id="polygonFeatureInfo" class="polygon-feature-info"
                    style="width: 93%; height: calc(30vh - 2em); overflow-y: auto; border: 1px solid var(--terra-border-primary, #9e7440); margin-left: 1em;padding: 0.5em; border-radius: 4px; background-color: var(--terra-background-secondary, #f5f5f5);">
                    <span style="font-style: italic; color: var(--terra-text-tertiary, #6b7280);">Polygon feature information will appear here when you click on a polygon in the map above.</span> 
                </div>
            </div>
        </div>
        `
    }
}