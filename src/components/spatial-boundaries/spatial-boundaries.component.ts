import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
//import { ImageTile, Map, MapBrowserEvent, View } from 'ol'
//import WebGLTileLayer from 'ol/layer/WebGLTile.js'
//import VectorLayer from 'ol/layer/Vector.js'
//import Graticule from 'ol/layer/Graticule.js'
//import OSM from 'ol/source/OSM.js'
//import VectorSource from 'ol/source/Vector.js'
//import GeoJSON from 'ol/format/GeoJSON.js'
//import type GeoTIFF from 'ol/source/GeoTIFF.js'
//import { Style, Stroke } from 'ol/style.js'
//import Draw from 'ol/interaction/Draw.js'
//import Point from 'ol/geom/Point.js'
//import { getLength } from 'ol/sphere.js'
//import Feature from 'ol/Feature.js'
import TerraElement from '../../internal/terra-element.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-boundaries.styles.js'
import type { CSSResultGroup } from 'lit'
//import { TimeAvgMapController } from './time-average-map.controller.js'
import TerraButton from '../button/button.component.js'
//import TerraPlot from '../plot/plot.component.js'
import TerraIcon from '../icon/icon.component.js'
//import TerraPlotToolbar from '../plot-toolbar/plot-toolbar.component.js'
//import TerraAlert from '../alert/alert.component.js'
import TerraMap from '../map/map.component.js'
import { createRef } from 'lit/directives/ref.js'

//import { TaskStatus } from '@lit/task'
//import type { Variable } from '../browse-variables/browse-variables.types.js'
//import { cache } from 'lit/directives/cache.js'
//import { AuthController } from '../../auth/auth.controller.js'
//import { toLonLat, transformExtent } from 'ol/proj.js'
//import { getFetchVariableTask } from '../../utilities/variable-task.js'
//import { getVariableEntryId } from '../../utilities/variable.js'
//import { watch } from '../../internal/watch.js'
import TerraLoader from '../loader/loader.component.js'
//import { formatDate } from '../../utilities/date.js'
//import { Environment } from '../../utilities/environment.js'
//import type DataTileSource from 'ol/source/DataTile.js'
//import type DataTile from 'ol/DataTile.js'
/* import type { TimeAverageMapOptions } from '../../events/terra-plot-options-change.js' */

/* import map */
/* do we still need OL imports? */
/* build test area element to report poly coordinates */
/* grab polygons from file...use 'data-access' to grab hovered file? */
/* do we have access to the openlayers map if we import the map component? */

export default class TerraSpatialBoundaries extends QueryClientMixin(
    TerraElement,
) {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-map': TerraMap,
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
        'terra-loader': TerraLoader,
    }

    @property({ reflect: true }) polygons?: string

    //#controller: TerraSpatialBoundariesController = new TerraSpatialBoundariesController(this)
    //#map: Map | null = null
    //#gtLayer: WebGLTileLayer | null = null
    //#geoTiffGraticuleLayer: Graticule | null = null
    //#statesLayer: VectorLayer<VectorSource> | null = null
    //#bordersLayer: VectorLayer<VectorSource> | null = null
    //#vectorSource: VectorSource | null = null
    //#vectorLayer: VectorLayer | null = null
    //#draw: Draw | null = null
    //#graticuleLayer: Graticule | null = null
    //#polygonSource: VectorSource | null = null
    //#polygonLayer: VectorLayer | null = null

    @state() boundaryData = {}
    @state() layout = {}

    mapRef = createRef<TerraMap>()

    connectedCallback(): void {
        // attach event listeners when component is connected
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - addEventListener exists on HTMLElement/LitElement
        super.connectedCallback?.()
        this.addEventListener('terra-selection-changed', this.#handleDataGridRowSelection as EventListener)
    }

    disconnectedCallback(): void {
        super.disconnectedCallback?.()
        this.removeEventListener('terra-selection-changed', this.#handleDataGridRowSelection as EventListener)
    }

    #handleDataGridRowSelection = (event:any) => {
        const { status, code, message, context } = event.detail
        console.log("from data access/data grid row selection: ", status, code, message, context)
        // get/store file id, access polygons, add polygons to polygonLayer
        this.#addPolygons(context)
    }

    #addPolygons = (context:any) => {
        console.log("trying to add polygons, event context: ", context)
    }

    //#removePolygons = () => {
    //    
    //}  

    async firstUpdated() {
        // Initialize the base layer open street map
        this.initializeMap()
    }    

    initializeMap() {
        if (!this.mapRef.value) {
            return
        }
    }
   
    render() {
        return html`
            <div class="map-container">
                <terra-map
                    id="spatial-boundaries-map"
                    has-navigation
                    has-coord-tracker
                    show-graticule>
                </terra-map>
            </div>
        `
    }

} 



