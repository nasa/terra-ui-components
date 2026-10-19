/**
 * A single GIBS imagery product, as listed under a collection's
 * `edsc.extra.serverless.gibs` tag.
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

/**
 * The shape of CMR's `collections.json?...&include_tags=edsc*` response. Only
 * the first `entry` is relevant — a `entry_id[]`/`concept-id` lookup matches
 * at most one collection. Other `edsc.extra.serverless.*` tags (e.g.
 * `collection_capabilities`) can show up alongside `gibs` here too.
 */
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
