import type { LatLng } from './models/LatLng.js'
import type { LatLngBounds } from './models/LatLngBounds.js'

export enum MapEventType {
    POINT = 'point',
    BBOX = 'bbox',
    POLYGON = 'polygon',
    CIRCLE = 'circle',
}

type BaseMapEventDetail = {
    cause: string
}

export type MapEventDetail = BaseMapEventDetail &
    (
        | { type: MapEventType.POINT; latLng: LatLng }
        | { type: MapEventType.BBOX; bounds: LatLngBounds }
        | {
              type: MapEventType.POLYGON
              latLngs: LatLng[]
              geoJson?: object
              label?: string
          }
        | { type: MapEventType.CIRCLE; center: LatLng; radius: number }
        | { type?: undefined }
    )

export type MapLayerToggleDetail = {
    name: string
    title: string
    type: 'base' | 'overlay' | 'visualization'
    visible: boolean
    layer: unknown
}

export type MapLegendClickDetail = {
    name: string
    title: string
    type: 'base' | 'overlay' | 'visualization'
    valueChosen?: string | number
    rgbChosen?: number[]
    min?: number | string
    max?: number | string
    legendValues?: Array<{ value: string; rgb: number[] }>
    layer: unknown
}
