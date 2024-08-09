export interface LatLng {
    lat: number
    lng: number
}

export interface BoundingBox {
    _southWest: LatLng
    _northEast: LatLng
}

export interface MapEventDetail {
    cause: string
    geoJson?: any
    bounds?: any
    latLng?: any
}
