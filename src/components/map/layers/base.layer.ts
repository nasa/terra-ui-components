import TileLayer from 'ol/layer/Tile.js'
import ImageTile from 'ol/source/ImageTile.js'

export type Options = {
    noWorldWrap?: boolean
}

export class BaseLayer extends TileLayer {
    constructor(options: Options = {}) {
        super({
            source: new ImageTile({
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attributions: ['Esri', 'Vantor', 'Earthstar Geographics'],
                ...(options.noWorldWrap ? { wrapX: false } : {}),
            }),
        })
    }
}
