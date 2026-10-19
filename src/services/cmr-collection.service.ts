import type {
    CmrCollectionsJsonResponse,
    GibsTagEntry,
} from '../apis/types/cmr/collection-tags.js'
import type {
    GibsLayerConfig,
    Projection,
} from '../components/map/layers/gibs.layer.js'

class CmrCollectionService {
    /**
     * Pulls the GIBS tag data (every imagery product CMR knows about for the
     * collection) out of a `collections.json?...&include_tags=edsc*`
     * response. A `entry_id[]`/`concept-id` lookup matches at most one
     * collection, so only `feed.entry[0]` is relevant; `[]` when the
     * collection has no `edsc.extra.serverless.gibs` tag at all (most don't).
     */
    extractGibsEntries(response?: CmrCollectionsJsonResponse | null): GibsTagEntry[] {
        return (
            response?.feed?.entry?.[0]?.tags?.['edsc.extra.serverless.gibs']?.data ??
            []
        )
    }

    /**
     * Keeps only the entries actually available in the given map projection.
     * The tag data has no explicit "web mercator" flag — GIBS' `epsg3857/best`
     * endpoint is treated as always attemptable, matching `GibsLayer`'s own
     * unvalidated default (it fails at tile-load time, not config time, if a
     * layer isn't really published there). `EPSG:4326`/`EPSG:3413`/`EPSG:3031`
     * are explicit per-entry flags (`geographic`/`arctic`/`antarctic`).
     */
    filterByProjection(
        entries: GibsTagEntry[],
        projection: Projection
    ): GibsTagEntry[] {
        switch (projection) {
            case 'EPSG:4326':
                return entries.filter(entry => entry.geographic)
            case 'EPSG:3413':
                return entries.filter(entry => entry.arctic)
            case 'EPSG:3031':
                return entries.filter(entry => entry.antarctic)
            default:
                return entries
        }
    }

    /**
     * Builds a `GibsLayerConfig` per entry, ready to hand to `buildGibsLayer()`
     * or the `<terra-map layers>`/`collection-id` pipeline. Every entry
     * becomes its own named layer — `${collectionId}:${entry.product}` — so
     * multiple products (day/night variants, pressure levels, etc.) can
     * coexist without colliding with each other or with user-supplied
     * `layers` entries.
     */
    buildGibsLayerConfigs(
        entries: GibsTagEntry[],
        options: { collectionId: string; projection: Projection; date?: string }
    ): GibsLayerConfig[] {
        return entries.map(entry => ({
            type: 'gibs',
            name: `${options.collectionId}:${entry.product}`,
            layer: entry.product,
            date: options.date,
            format: entry.format === 'png' ? 'png' : 'jpg',
            projection:
                options.projection === 'EPSG:3857' ? undefined : options.projection,
            position: 'top',
        }))
    }
}

const cmrCollectionService = new CmrCollectionService()

export default cmrCollectionService
