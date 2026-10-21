import type {
    CmrCollectionsJsonResponse,
    GibsTagEntry,
} from '../apis/types/cmr/collection-tags.js'
import type {
    GibsLayerConfig,
    Projection,
} from '../components/map/layers/gibs.layer.js'

// GIBS' Web Mercator ("epsg3857/best") endpoint is tied to a specific
// GoogleMapsCompatible_Level# per layer, keyed by its native resolution —
// requesting the wrong one 400s instead of just rendering blank. EPSG:4326
// and the polar projections instead use the resolution string itself
// (e.g. '2km', '500m') as the tile matrix set id directly, so they don't need
// this table. Source: https://nasa-gibs.github.io/gibs-api-docs/map-library-usage/
const WEB_MERCATOR_LEVEL_BY_RESOLUTION: Record<string, string> = {
    '2km': 'GoogleMapsCompatible_Level6',
    '1km': 'GoogleMapsCompatible_Level7',
    '500m': 'GoogleMapsCompatible_Level8',
    '250m': 'GoogleMapsCompatible_Level9',
}

class CmrCollectionService {
    /**
     * Pulls the GIBS tag data (every imagery product CMR knows about for the collection) out of a UMM-C response
     */
    extractGibsEntries(
        response?: CmrCollectionsJsonResponse | null,
    ): GibsTagEntry[] {
        return (
            // we're looking for a single collection, so only the first result is important
            response?.feed?.entry?.[0]?.tags?.['edsc.extra.serverless.gibs']
                ?.data ?? []
        )
    }

    /**
     * Keeps only the entries actually available in the given map projection.
     */
    filterByProjection(
        entries: GibsTagEntry[],
        projection: Projection,
    ): GibsTagEntry[] {
        switch (projection) {
            case 'EPSG:4326':
                return entries.filter((entry) => entry.geographic)
            case 'EPSG:3413':
                return entries.filter((entry) => entry.arctic)
            case 'EPSG:3031':
                return entries.filter((entry) => entry.antarctic)
            default:
                return entries
        }
    }

    /**
     * The WMTS tile matrix set id to request for an entry
     */
    getTileMatrixSet(
        entry: GibsTagEntry,
        projection: Projection,
    ): string | undefined {
        switch (projection) {
            case 'EPSG:3857':
                return entry.geographic_resolution
                    ? WEB_MERCATOR_LEVEL_BY_RESOLUTION[
                          entry.geographic_resolution
                      ]
                    : undefined
            case 'EPSG:4326':
                return entry.geographic_resolution ?? undefined
            case 'EPSG:3413':
                return entry.arctic_resolution ?? undefined
            case 'EPSG:3031':
                return entry.antarctic_resolution ?? undefined
        }
    }

    /**
     * Builds a `GibsLayerConfig` per entry, ready to hand to `buildGibsLayer()`
     * or the `<terra-map layers>`/`collection-id` pipeline.
     */
    buildGibsLayerConfigs(
        entries: GibsTagEntry[],
        options: {
            collectionId: string
            projection: Projection
            date?: string
        },
    ): GibsLayerConfig[] {
        return entries.map((entry, index) => ({
            type: 'gibs',
            name: `${options.collectionId}:${entry.product}`,
            layer: entry.product,
            date: options.date,
            format: entry.format === 'png' ? 'png' : 'jpg',
            title: entry.title,
            tileMatrixSet: this.getTileMatrixSet(entry, options.projection),
            projection:
                options.projection === 'EPSG:3857'
                    ? undefined
                    : options.projection,
            position: 'top',
            visible: index === 0,
        }))
    }
}

const cmrCollectionService = new CmrCollectionService()

export default cmrCollectionService
