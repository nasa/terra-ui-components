import type { UmmG } from '../types/cmr.js'
import type { HostWithMaybeProperties } from './types.js'

export function getGranuleUrl(granule: UmmG) {
    const getDataUrl = granule.RelatedUrls?.find(url => url.Type === 'GET DATA')
    return getDataUrl?.URL
}

export function getVariableEntryId(host: HostWithMaybeProperties) {
    if (!host.variableEntryId && !(host.collection && host.variable)) {
        return
    }

    return host.variableEntryId ?? `${host.collection}_${host.variable}`
}
