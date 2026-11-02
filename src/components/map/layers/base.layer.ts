import TileLayer from 'ol/layer/Tile.js'
import XYZ from 'ol/source/XYZ.js'
import { GIBS_WMTS_ENDPOINT } from '../../../apis/gibs.api.js'
import { getYesterdayIsoDate } from '../../../utilities/date.js'

const ARCGIS_REST_ENDPOINT = 'https://server.arcgisonline.com/ArcGIS/rest/services'

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

/**
 * Builds a base map tile layer using OpenLayers' `XYZ` source.
 *
 * `XYZ` (derived from `TileImage`) delegates projection transformations to
 * `ol/reproj/Tile.js`, which renders reprojected raster tiles via 2D canvas.
 * This ensures base layers reproject cleanly across non-Web Mercator views
 * (such as polar stereographic EPSG:3413 / EPSG:3031 and geographic EPSG:4326)
 * without depending on hardware WebGL context availability.
 */
export function buildBaseLayer(config: BaseLayerConfig): TileLayer<XYZ> {
    const layer = new TileLayer({
        visible: config.visible ?? false,
        source: new XYZ({
            url: config.url,
            attributions: config.attributions,
            wrapX: !config.noWorldWrap,
        }),
    })

    layer.set('name', config.name)
    layer.set('title', config.title)
    layer.set('type', 'base')
    layer.set('__builtin', true)

    return layer
}

export function buildDefaultBaseLayers(options: Options = {}): TileLayer[] {
    const yesterday = getYesterdayIsoDate()

    return [
        buildBaseLayer({
            ...options,
            name: 'base',
            title: 'World Imagery',
            url: `${ARCGIS_REST_ENDPOINT}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
            attributions: ['Esri', 'Vantor', 'Earthstar Geographics'],
            visible: true,
        }),
        buildBaseLayer({
            ...options,
            name: 'true-color',
            title: 'Corrected Reflectance (True Color)',
            url: `${GIBS_WMTS_ENDPOINT}/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${yesterday}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
            attributions: ['NASA EOSDIS GIBS'],
            visible: false,
        }),
        buildBaseLayer({
            ...options,
            name: 'land-water',
            title: 'Land / Water Map',
            url: `${GIBS_WMTS_ENDPOINT}/epsg3857/best/OSM_Land_Water_Map/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`,
            attributions: ['© OpenStreetMap contributors', 'NASA EOSDIS GIBS'],
            visible: false,
        }),
        buildBaseLayer({
            ...options,
            name: 'topo',
            title: 'Topographic',
            url: `${ARCGIS_REST_ENDPOINT}/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`,
            attributions: ['Esri', 'HERE', 'Garmin', 'USGS'],
            visible: false,
        }),
    ]
}

export class BaseLayer extends TileLayer<XYZ> {
    constructor(options: Options = {}) {
        super({
            source: new XYZ({
                url: `${ARCGIS_REST_ENDPOINT}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
                attributions: ['Esri', 'Vantor', 'Earthstar Geographics'],
                wrapX: !options.noWorldWrap,
            }),
        })
    }
}
