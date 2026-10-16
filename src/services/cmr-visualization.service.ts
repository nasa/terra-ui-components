import type { UmmResponse, UmmResult } from '../apis/cmr.api.js'
import type { UmmC } from '../apis/types/cmr/umm-c.js'
import type { UmmVis } from '../apis/types/cmr/umm-vis.js'
import type {
    GibsLayerConfig,
    Projection,
} from '../components/map/layers/gibs.layer.js'

const SUPPORTED_PROJECTIONS = new Set<Projection>([
    'EPSG:3857',
    'EPSG:4326',
    'EPSG:3413',
    'EPSG:3031',
])

class CmrVisualizationService {
    /**
     * Some data centers (e.g. GES DISC) curate "GET RELATED VISUALIZATION" /
     * `WORLDVIEW` entries in a collection's own `RelatedUrls` — each one a
     * Worldview deep link whose `l=` query param lists the layer(s) it's
     * meant to show, with the intended default layer listed first (other
     * layers in the list are typically marked `(hidden)`). This is a
     * genuinely curated signal (unlike the unordered UMM-Vis associations
     * below), and costs no extra request since `RelatedUrls` is already
     * part of the collection record we fetch.
     *
     * Not every collection has one of these — e.g. ESDIS/SEDAC collections
     * observed during development had UMM-Vis associations but no curated
     * Worldview RelatedUrl at all. This is the preferred signal when present.
     */
    getCuratedGibsLayerId(collection?: UmmC | null): string | undefined {
        const worldviewUrl = collection?.RelatedUrls?.find(
            url =>
                url.Type === 'GET RELATED VISUALIZATION' &&
                url.Subtype === 'WORLDVIEW'
        )?.URL

        if (!worldviewUrl) {
            return undefined
        }

        let layers: string[]
        try {
            layers = (new URL(worldviewUrl).searchParams.get('l') ?? '').split(',')
        } catch {
            return undefined
        }

        // layers are listed as e.g. 'AIRS_L2_..._Day' or 'Coastlines_15m(hidden)' —
        // the first one *not* marked hidden is the intended default
        return layers.find(layer => layer && !layer.includes('(hidden)'))
    }

    /**
     * Given CMR's visualizations search response for a collection, pick the
     * one to render as the "top" GIBS layer. Used as a fallback when the
     * collection has no curated Worldview `RelatedUrl` (see
     * `getCuratedGibsLayerId`).
     *
     * CMR doesn't expose an explicit ranking across multiple visualization
     * records for the same collection — a single collection can have dozens
     * (e.g. one per science parameter / pressure level / day-night variant),
     * in no meaningful order — so this just takes the first record that's
     * actually GIBS-tile-renderable (`VisualizationType === 'tiles'`).
     */
    selectTopVisualization(
        visualizations?: UmmResponse<UmmVis> | null
    ): UmmResult<UmmVis> | undefined {
        if (!visualizations?.items?.length) {
            return undefined
        }

        return visualizations.items.find(
            item => item.umm.VisualizationType === 'tiles'
        )
    }

    /**
     * The GIBS WMTS layer identifier for a visualization record. Prefers the
     * "best available" variant (CMR/GIBS's own notion of which product to
     * show by default, e.g. standard over NRT) and falls back to the
     * standard/NRT identifier if that's all that's provided.
     */
    getGibsLayerIdentifier(visualization: UmmResult<UmmVis>): string | undefined {
        const productId = visualization.umm.Specification?.ProductIdentification

        return (
            productId?.BestAvailableExternalIdentifier ??
            productId?.StandardOrNRTExternalIdentifier
        )
    }

    /**
     * Resolves the GIBS layer id to render for a collection, preferring a
     * curated Worldview `RelatedUrl` over the unordered UMM-Vis association
     * list. When the chosen layer id also matches one of the fetched UMM-Vis
     * records, that record's metadata (projection/extent) is included too.
     */
    resolveGibsLayer(args: {
        collection?: UmmC | null
        visualizations?: UmmResponse<UmmVis> | null
    }): { layerId: string; visualization?: UmmResult<UmmVis> } | undefined {
        const curatedLayerId = this.getCuratedGibsLayerId(args.collection)

        if (curatedLayerId) {
            const matchingVisualization = args.visualizations?.items?.find(
                item => this.getGibsLayerIdentifier(item) === curatedLayerId
            )
            return { layerId: curatedLayerId, visualization: matchingVisualization }
        }

        const topVisualization = this.selectTopVisualization(args.visualizations)
        const layerId =
            topVisualization && this.getGibsLayerIdentifier(topVisualization)

        if (!layerId) {
            return undefined
        }

        return { layerId, visualization: topVisualization }
    }

    /**
     * Builds a `GibsLayerConfig` (ready to hand to `buildGibsLayer()` or the
     * `<terra-map layers>` property) from a resolved layer id, enriched
     * with projection/extent from a matching UMM-Vis record when available.
     */
    buildGibsLayerConfig(
        resolved: { layerId: string; visualization?: UmmResult<UmmVis> },
        options: { name: string; date?: string }
    ): GibsLayerConfig {
        const outputProjection = resolved.visualization?.umm.Generation
            ?.OutputProjection as Projection | undefined
        const projection =
            outputProjection && SUPPORTED_PROJECTIONS.has(outputProjection)
                ? outputProjection
                : undefined

        const extent =
            resolved.visualization?.umm.Specification?.ProductMetadata
                ?.NativeSpatialCoverage

        return {
            type: 'gibs',
            name: options.name,
            layer: resolved.layerId,
            date: options.date,
            projection,
            extent,
            position: 'top',
        }
    }
}

const cmrVisualizationService = new CmrVisualizationService()

export default cmrVisualizationService
