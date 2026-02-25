export type { UmmC } from './cmr/umm-c.js'
export type { UmmG } from './cmr/umm-g.js'

export interface UmmResponse<T> {
    hits: number
    items: Array<UmmResult<T>>
}

export interface UmmResult<T> {
    meta: UmmMeta
    umm: T
}

/**
 * meta information from the CMR search endpoint
 * there are quite a few more fields available but we're only using what we need
 */
export interface UmmMeta {
    'concept-id': string
    'native-id': string
    'provider-id': string
}
