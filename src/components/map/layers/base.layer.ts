import TileLayer from 'ol/layer/Tile.js'
import ImageTile from 'ol/source/ImageTile.js'
import { getYesterdayIsoDate } from '../../../utilities/date.js'

export type Options = {
    noWorldWrap?: boolean
}

export type BaseLayerConfig = {
    name: string
    title: string
    url: string
    attributions?: string[]
    visible?: boolean
    noWorldWrap?: boolean
}

export function buildBaseLayer(config: BaseLayerConfig): TileLayer {
    const layer = new TileLayer({
        visible: config.visible ?? false,
        source: new ImageTile({
            url: config.url,
            attributions: config.attributions,
            ...(config.noWorldWrap ? { wrapX: false } : {}),
        }),
    })

    layer.set('name', config.name)
    layer.set('title', config.title)
    layer.set('type', 'base')

    return layer
}

export function buildDefaultBaseLayers(options: Options = {}): TileLayer[] {
    const yesterday = getYesterdayIsoDate()

    return [
        buildBaseLayer({
            ...options,
            name: 'base',
            title: 'World Imagery',
            url:
                'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Esri', 'Vantor', 'Earthstar Geographics'],
            visible: true,
        }),
        buildBaseLayer({
            ...options,
            name: 'true-color',
            title: 'Corrected Reflectance (True Color)',
            url:
                'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/' +
                `VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${yesterday}/` +
                'GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
            attributions: ['NASA EOSDIS GIBS'],
            visible: false,
        }),
        buildBaseLayer({
            ...options,
            name: 'land-water',
            title: 'Land / Water Map',
            url:
                'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/' +
                'OSM_Land_Water_Map/default/default/' +
                'GoogleMapsCompatible_Level9/{z}/{y}/{x}.png',
            attributions: [
                '© OpenStreetMap contributors',
                'NASA EOSDIS GIBS',
            ],
            visible: false,
        }),
        buildBaseLayer({
            ...options,
            name: 'topo',
            title: 'Topographic',
            url:
                'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Esri', 'HERE', 'Garmin', 'USGS'],
            visible: false,
        }),
    ]
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
