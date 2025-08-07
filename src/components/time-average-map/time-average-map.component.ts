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

    @property({ type: String })
    long_name = '';
      
  #controller: TimeAvgMapController
  
  async firstUpdated() {
    console.log("Parameters at firstUpdated: ",this.collection,this.startDate,this.endDate,this.location,this.bearerToken)
    this.#controller = new TimeAvgMapController(this)
    
    // Start the task..
    this.#controller.jobStatusTask.run();

    let blob: Blob | undefined;

    while (!blob) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // poll every second
      blob = this.#controller.jobStatusTask.value;
      console.log("Polling jobStatusTask.value: ", blob);
    }

    let gtSource = this.render_open_layers_map(blob);
    
    const metadata = await this.fetchGeotiffMetadata(gtSource);
    this.long_name = metadata['long_name'] ?? '';
  }

  // TODO: Add proper type for geotiff_url
  render_open_layers_map(geotiff_url: any): GeoTIFF {
    
    let blobUrl = URL.createObjectURL(geotiff_url);

    const baseLayer = new WebGLTileLayer({
      source: new OSM() as any,
    })
  
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

    return gtSource

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