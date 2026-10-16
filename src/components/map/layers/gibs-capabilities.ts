import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'

const GIBS_WMTS_ROOT = 'https://gibs.earthdata.nasa.gov/wmts'

const capabilitiesCache = new Map<string, Promise<any>>()

/**
 * Fetches and parses a GIBS projection's WMTS GetCapabilities document,
 * caching the result (per projection) so repeated GibsLayer.forProjection()
 * calls don't refetch the (large) capabilities document every time.
 */
export function getGibsCapabilities(
    projection: 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'
): Promise<any> {
    const endpoint = projection.replace(':', '').toLowerCase() // e.g. 'epsg4326'

    let cached = capabilitiesCache.get(endpoint)
    if (!cached) {
        cached = fetch(
            `${GIBS_WMTS_ROOT}/${endpoint}/best/wmts.cgi?REQUEST=GetCapabilities`
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch GIBS GetCapabilities for ${projection}: ${response.status} ${response.statusText}`
                    )
                }
                return response.text()
            })
            .then(xml => new WMTSCapabilities().read(xml))
            .catch(error => {
                // don't cache failures, so a transient network error can be retried
                capabilitiesCache.delete(endpoint)
                throw error
            })

        capabilitiesCache.set(endpoint, cached)
    }

    return cached
}
