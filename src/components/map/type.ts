import type { LatLng, LatLngBounds } from 'leaflet'

export enum MapEventType {
    POINT = 'point',
    BBOX = 'bbox',
}

type BaseMapEventDetail = {
    cause: string
    geoJson?: GeoJSON.FeatureCollection
}

export type MapEventDetail = BaseMapEventDetail &
    (
        | { type: MapEventType.POINT; latLng: LatLng }
        | { type: MapEventType.BBOX; bounds: LatLngBounds }
        | { type?: undefined }
    )
