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
        | { type: MapEventType.POLYGON; latLngs: LatLng[] }
        | { type: MapEventType.CIRCLE; center: LatLng; radius: number }
        | { type?: undefined }
    )
