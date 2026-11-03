import type { QueryObserverOptions } from '@tanstack/query-core'
import gibsApi from '../apis/gibs.api.js'
import { duration } from '../constants.js'
import type { MapProjection } from '../types.js'

const GIBS_STALE_TIME = duration.days(1)

export function queryGibsCapabilitiesXml(
    projection: MapProjection
): QueryObserverOptions<string> {
    const endpoint = projection.replace(':', '').toLowerCase()
    return {
        queryKey: ['gibs', 'capabilities', endpoint],
        queryFn: async ({ signal }) => {
            return gibsApi.getCapabilitiesXml(projection, { signal })
        },
        staleTime: GIBS_STALE_TIME,
        gcTime: GIBS_STALE_TIME,
    }
}

export function queryGibsLegendSvg(
    urlOrLayer?: string
): QueryObserverOptions<string | null> {
    return {
        queryKey: ['gibs', 'legendSvg', urlOrLayer],
        queryFn: async ({ signal }) => {
            if (!urlOrLayer) {
                return null
            }
            return gibsApi.getLegendSvg(urlOrLayer, { signal })
        },
        enabled: Boolean(urlOrLayer),
        staleTime: GIBS_STALE_TIME,
        gcTime: GIBS_STALE_TIME,
    }
}
