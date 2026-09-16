import MVT from 'ol/format/MVT.js'
import VectorTileLayer from 'ol/layer/VectorTile.js'
import { stylefunction } from 'ol-mapbox-style'
import VectorTileSource from 'ol/source/VectorTile.js'
import type { Options } from './base.layer.js'
import labelsStyleConfig from './labelsStyleConfig.js'

export type { Options }

const ESRI_SOURCE_ID = 'esri'

export class LabelsLayer extends VectorTileLayer {
    constructor(options: Options = {}) {
        super({
            source: new VectorTileSource({
                format: new MVT(),
                url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
                attributions: ['Esri', 'HERE', 'Garmin'],
                ...(options.noWorldWrap ? { wrapX: false } : {}),
            }),
            declutter: true,
        })

        stylefunction(this, labelsStyleConfig, ESRI_SOURCE_ID)
    }
}
