import TileLayer from 'ol/layer/Tile.js'
import { ImageTile } from 'ol/source.js'

export type Options = {
    noWorldWrap?: boolean
}

export class BaseLayer extends TileLayer {
    constructor(options: Options = {}) {
        super({
            source: new ImageTile({
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                ...(options.noWorldWrap ? { wrapX: false } : {}),
            }),
        })
    }
}
