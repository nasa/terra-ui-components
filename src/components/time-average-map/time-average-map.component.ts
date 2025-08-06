import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { Map, View } from 'ol';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import OSM from 'ol/source/OSM.js';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import TerraElement from '../../internal/terra-element.js';

import { TimeAvgMapController } from './time-average-map.controller.js'

export default class TerraTimeAverageMap extends TerraElement {
  static styles = css`
    :host {
      display: block;
      height: 600px;
    }

    #map {
      width: 100%;
      height: 100%;
    }
  `;

@property() long_name = ''; // Value populated at geotiff metadata extraction step

 /**
     * a collection entry id (ex: GPM_3IMERGHH_06)
     * only required if you don't include a variableEntryId
     */
 @property({ reflect: true })
 collection?: string

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

      
  #controller: TimeAvgMapController
  
  async firstUpdated() {
    console.log("Parameters at firstUpdated: ",this.collection,this.startDate,this.endDate,this.location,this.bearerToken)
    this.#controller = new TimeAvgMapController(this)
    
    // // Now we wait until polling completes with a final job
    const finalStatus = this.#controller.jobStatusTask.run();

    console.log("Job status: ",finalStatus)
  
    const url = 'https://localhost:4000/dist/GIOVANNI-timeAvgMap.M2T1NXAER_5_12_4_BCCMASS.20090101-20090105.62E_5N_95E_40N.tif'
  
    const baseLayer = new WebGLTileLayer({
      source: new OSM() as any,
    })
  
    const gtSource = new GeoTIFF({
      sources: [
        {
          url,
          bands: [1],
          nodata: NaN,
        },
      ],
      interpolate: false,
      normalize: false,
    })
  
    const gtLayer = new WebGLTileLayer({
      source: gtSource,
    })
  
    new Map({
      target: this.shadowRoot?.getElementById('map') ?? undefined,
      layers: [baseLayer, gtLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: 'EPSG:3857',
      }),
    })
  
    // const metadata = await this.#controller.fetchGeoTIFFMetadata(gtSource)
    // this.long_name = metadata['long_name'] ?? ''
    // console.log(this.long_name)
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