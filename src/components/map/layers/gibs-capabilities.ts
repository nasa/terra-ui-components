import WMTSCapabilities from 'ol/format/WMTSCapabilities.js'

const GIBS_WMTS_ROOT = 'https://gibs.earthdata.nasa.gov/wmts'

type Projection = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'

const WMTS_NS = 'http://www.opengis.net/wmts/1.0'
const OWS_NS = 'http://www.opengis.net/ows/1.1'
const XLINK_NS = 'http://www.w3.org/1999/xlink'

type CapabilitiesEntry = {
    /** The ol-parsed capabilities object, as returned by `getGibsCapabilities()`. */
    capabilities: any
    /** The raw parsed XML, kept around for lookups ol's parser doesn't expose (e.g. legend orientation). */
    doc: Document
}

const capabilitiesCache = new Map<string, Promise<CapabilitiesEntry>>()

function fetchGibsCapabilities(
    projection: Projection,
): Promise<CapabilitiesEntry> {
    const endpoint = projection.replace(':', '').toLowerCase() // e.g. 'epsg4326'

    let cached = capabilitiesCache.get(endpoint)
    if (!cached) {
        cached = fetch(
            `${GIBS_WMTS_ROOT}/${endpoint}/best/wmts.cgi?REQUEST=GetCapabilities`,
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch GIBS GetCapabilities for ${projection}: ${response.status} ${response.statusText}`,
                    )
                }
                return response.text()
            })
            .then((xml) => {
                const doc = new DOMParser().parseFromString(
                    xml,
                    'application/xml',
                )
                return { capabilities: new WMTSCapabilities().read(doc), doc }
            })
            .catch((error) => {
                // don't cache failures, so a transient network error can be retried
                capabilitiesCache.delete(endpoint)
                throw error
            })

        capabilitiesCache.set(endpoint, cached)
    }

    return cached
}

/**
 * Fetches and parses a GIBS projection's WMTS GetCapabilities document,
 * caching the result (per projection) so repeated GibsLayer.forProjection()
 * calls don't refetch the (large) capabilities document every time.
 */
export function getGibsCapabilities(projection: Projection): Promise<any> {
    return fetchGibsCapabilities(projection).then((entry) => entry.capabilities)
}

export type GibsLegendUrls = {
    /** Wide color map legend image, suitable for rendering below/above the map. */
    horizontal?: string
    /** Tall color map legend image, suitable for rendering beside the map. */
    vertical?: string
}

/**
 * Looks up a GIBS layer's color map legend image URLs (both orientations
 * GIBS publishes, keyed by their `xlink:role`) from a projection's
 * GetCapabilities document.
 *
 * ol's `WMTSCapabilities` parser reads `Style`/`LegendURL` elements, but
 * drops the `xlink:role` attribute that distinguishes the horizontal from
 * the vertical legend image - so this reads the raw parsed XML directly
 * instead of the ol-parsed capabilities object.
 */
export async function getGibsLegendUrls(
    projection: Projection,
    layer: string,
): Promise<GibsLegendUrls | undefined> {
    const { doc } = await fetchGibsCapabilities(projection)

    const layerNode = Array.from(
        doc.getElementsByTagNameNS(WMTS_NS, 'Layer'),
    ).find(
        (node) =>
            node.getElementsByTagNameNS(OWS_NS, 'Identifier')[0]
                ?.textContent === layer,
    )
    if (!layerNode) {
        return undefined
    }

    const styleNodes = Array.from(
        layerNode.getElementsByTagNameNS(WMTS_NS, 'Style'),
    )
    const styleNode =
        styleNodes.find((node) => node.getAttribute('isDefault') === 'true') ??
        styleNodes[0]
    if (!styleNode) {
        return undefined
    }

    const legends: GibsLegendUrls = {}
    for (const legendNode of Array.from(
        styleNode.getElementsByTagNameNS(WMTS_NS, 'LegendURL'),
    )) {
        const href = legendNode.getAttributeNS(XLINK_NS, 'href')
        const role = legendNode.getAttributeNS(XLINK_NS, 'role') ?? ''
        if (!href) {
            continue
        }
        if (role.endsWith('horizontal')) {
            legends.horizontal = href
        } else if (role.endsWith('vertical')) {
            legends.vertical = href
        }
    }

    return Object.keys(legends).length ? legends : undefined
}
