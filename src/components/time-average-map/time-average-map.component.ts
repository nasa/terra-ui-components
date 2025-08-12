import { html} from 'lit';
import { property } from 'lit/decorators.js';
import { Map, View } from 'ol';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import OSM from 'ol/source/OSM.js';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import TerraElement from '../../internal/terra-element.js';
import componentStyles from '../../styles/component.styles.js';
import styles from './time-average-map.styles.js'
import type { CSSResultGroup } from 'lit'



import { TimeAvgMapController } from './time-average-map.controller.js'

export default class TerraTimeAverageMap extends TerraElement {
static styles: CSSResultGroup = [componentStyles, styles]
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

    /**
   * The token to be used for authentication with remote servers.
   * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
   * The property's value will be inserted after "Bearer" (the authentication scheme).
   */
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string

    @property({ type: String })
    long_name = '';
      
  #controller: TimeAvgMapController

  #map: Map | null = null
  #gtLayer: WebGLTileLayer | null = null

    async firstUpdated() {

    this.#controller = new TimeAvgMapController(this)
    // Initialize the base layer open street map
    this.intializeMap()
    this.updateGeoTIFFLayer()


  }

  async updateGeoTIFFLayer() {
    await this.#controller.jobStatusTask.run();
    // The task returns the blob upon completion
    let job_status_value = this.#controller.jobStatusTask.value
    
    const blobUrl = URL.createObjectURL(job_status_value);
  
    const gtSource = new GeoTIFF({
      sources: [{
        url: blobUrl,
        bands: [1],
        nodata: NaN,
      }],
      interpolate: false,
      normalize: false,
    });
  
    this.#gtLayer = new WebGLTileLayer({
      source: gtSource,
    });
  
    if (this.#map) {
      this.#map.addLayer(this.#gtLayer);
    }

    const metadata = await this.fetchGeotiffMetadata(gtSource);
    this.long_name = metadata['long_name'] ?? '';

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
    });
  }

  async fetchGeotiffMetadata(gtSource: GeoTIFF): Promise<{ [key: string]: string }> {
    await gtSource.getView();
    const internal = gtSource as any;
    console.log('sourceImagery_:', internal.sourceImagery_);
    const gtImage = internal.sourceImagery_[0][0];
    const gtMetadata = gtImage.fileDirectory?.GDAL_METADATA;
    console.log(typeof (gtMetadata));
  
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gtMetadata, "application/xml");
    const items = xmlDoc.querySelectorAll("Item");
    console.log("items: ", items);
  
    const dataObj: { [key: string]: string } = {};
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const name = item.getAttribute("name");
      const value = item.textContent ? item.textContent.trim() : "";
      if (name) {
        dataObj[name] = value;
      }
    }
  
    console.log("Data obj: ", dataObj);
    return dataObj;
  }
  render() {
    return html`
      <header>
        <h2>${this.long_name}</h2>
      </header>
      <div id="map"></div>
    `;
  }
}