/**
 * A single GIBS imagery product, as listed under a collection's `edsc.extra.serverless.gibs` tag.
 * (example collection with tags: https://cmr.earthdata.nasa.gov/search/collections.json?entry_id[]=AIRS2RET_NRT_7.0&include_tags=edsc*)
 */
export interface GibsTagEntry {
    /** GIBS WMTS layer identifier, e.g. 'AIRS_L2_Surface_Air_Temperature_Day'. */
    product: string
    title: string
    source: string
    /** e.g. 'overlays'. */
    group: string
    format: string
    /** e.g. 'Daily', 'Subdaily'. */
    layerPeriod: string
    geographic: boolean
    geographic_resolution: string | null
    arctic: boolean
    arctic_resolution: string | null
    antarctic: boolean
    antarctic_resolution: string | null
    match: {
        time_start?: string
        day_night_flag?: 'day' | 'night'
    }
    updated_at: string
}

export interface CmrCollectionsJsonResponse {
    feed: {
        entry: Array<{
            tags?: {
                'edsc.extra.serverless.gibs'?: {
                    data: GibsTagEntry[]
                }
                [tagName: string]: { data: unknown } | undefined
            }
        }>
    }
}
