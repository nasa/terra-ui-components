export interface GeoJsonShapesInterface {
    /**
     * Fetches the list of available shape files
     * @returns Promise containing the list of shape files
     */
    getShapeFiles(): Promise<ShapeFilesResponse>

    /**
     * Fetches GeoJSON data for a specific shape
     * @param query The query string in format 'key=value'
     * @returns Promise containing the GeoJSON data
     */
    getGeoJson(query: string): Promise<GeoJsonShapeResponse>
}

export interface Shape {
    name: string
    shapeID: string
    shapefileID: string
}

export interface Category {
    shapefileID: string
    title: string
    sourceName: string
    sourceURL: string
    shapes: Shape[]
}

export interface ShapeFilesResponse {
    categories: Category[]
}

export interface Properties {
    TYPE?: string
    RIVER?: string
    USE_1?: string
    USE_2?: string
    USE_3?: string
    ELEV_M?: number
    COUNTRY?: string
    GLWD_ID?: number
    LAT_DEG?: number
    VOL_SRC?: string
    AREA_SKM?: number
    DAM_NAME?: string
    DAM_YEAR?: number
    LONG_DEG?: number
    LRS_AREA?: number
    PERIM_KM?: number
    POLY_SRC?: string
    gShapeID?: string
    LAKE_NAME?: string
    LRS_CATCH?: number
    MGLD_AREA?: number
    MGLD_TYPE?: string
    NEAR_CITY?: string
    SEC_CNTRY?: string
    CATCH_TSKM?: number
    DAM_HEIGHT?: number
    INFLOW_CMS?: number
    LRS_AR_SRC?: string
    VOLUME_CKM?: number
}

export type GeoJsonGeometryType =
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeometryCollection'

export interface Geometry {
    type: GeoJsonGeometryType
    coordinates: number[][][]
}

export interface Feature {
    type: 'Feature'
    geometry: Geometry
    properties: Properties
}

export interface GeoJsonShapeResponse {
    type: 'FeatureCollection'
    features: Feature[]
}
