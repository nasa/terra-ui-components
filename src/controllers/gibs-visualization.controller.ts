import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'
import {
    queryCmrCollection,
    queryCmrCollectionByConceptId,
    queryCmrVisualizationsByIds,
} from '../queries/cmr.queries.js'
import { QueryController } from './query.controller.js'
import cmrVisualizationService from '../services/cmr-visualization.service.js'
import type { GibsLayerConfig } from '../components/map/layers/gibs.layer.js'

export interface GibsVisualizationControllerConfig {
    /** A CMR collection entry-id (e.g. 'M2T1NXAER_5_12_4') or concept-id (e.g. 'C1234567-PROVIDER'). */
    getCollectionId: () => string | undefined
    /** Resolved GIBS layer name defaults to this when provided, else `getCollectionId()`. */
    getLayerName?: () => string
    /** ISO date (YYYY-MM-DD), or omitted/'default' for the layer's latest available date. */
    getDate?: () => string | undefined
}

// CMR concept-ids look like 'C1234567890-PROVIDER_ID'; entry-ids don't follow this shape
// (e.g. 'M2T1NXAER_5_12_4'), so this is enough to tell the two apart.
const CONCEPT_ID_PATTERN = /^[A-Z]\d+-[A-Z0-9_]+$/i

/**
 * A Lit ReactiveController that resolves a CMR collection id (entry-id or
 * concept-id) down to the `GibsLayerConfig` for the "top" layer of that
 * collection's GIBS stack.
 *
 * CMR's `visualizations` search has no way to filter by collection directly —
 * instead a collection's own UMM-C record lists its associated UMM-Vis
 * concept-ids under `meta.associations.visualizations`, and those have to be
 * looked up by id. That UMM-C record may also carry a curated Worldview
 * `RelatedUrl`, which — when present — is a better signal for which layer is
 * "the" default one (see `cmrVisualizationService.resolveGibsLayer`). So the
 * chain here is:
 *
 *   collectionId (entry-id or concept-id)
 *     └── #collectionQuery (CMR UMM-C record, looked up by whichever id type)
 *           ├── conceptId  (meta['concept-id'])
 *           └── #visualizationIds (meta.associations.visualizations)
 *                 └── #visualizationsQuery (batched UMM-Vis lookup by id)
 *                       └── gibsLayerConfig (resolved + built via cmrVisualizationService)
 */
export class GibsVisualizationController implements ReactiveController {
    #collectionQuery
    #visualizationsQuery

    // Memoized like `CollectionController.collectionInfo` — resolveGibsLayer()
    // does real work (parsing RelatedUrls, scanning visualizations) and is
    // read from multiple getters per update, so this gives callers a stable
    // reference instead of a fresh object/array on every access.
    #resolvedLayerCache: ReturnType<
        typeof cmrVisualizationService.resolveGibsLayer
    > = undefined
    #resolvedLayerCollectionData: unknown
    #resolvedLayerVisualizationsData: unknown

    // Same memoization for the built GibsLayerConfig, keyed off the resolved
    // layer plus the (cheap, but still worth not recomputing) name/date.
    #gibsLayerConfigCache: GibsLayerConfig | undefined
    #gibsLayerConfigResolved: ReturnType<
        typeof cmrVisualizationService.resolveGibsLayer
    > = undefined
    #gibsLayerConfigName: string | undefined
    #gibsLayerConfigDate: string | undefined

    constructor(
        private host: ReactiveControllerHost & QueryClientHost,
        private config: GibsVisualizationControllerConfig,
    ) {
        this.host.addController(this)

        this.#collectionQuery = new QueryController(this.host, () =>
            this.#isConceptId
                ? queryCmrCollectionByConceptId(this.#collectionId)
                : queryCmrCollection(this.#collectionId),
        )

        this.#visualizationsQuery = new QueryController(this.host, () =>
            queryCmrVisualizationsByIds(this.#visualizationIds),
        )
    }

    hostConnected() {}
    hostDisconnected() {}

    get #collectionId(): string | undefined {
        return this.config.getCollectionId()
    }

    get #isConceptId(): boolean {
        return !!this.#collectionId && CONCEPT_ID_PATTERN.test(this.#collectionId)
    }

    get #visualizationIds(): string[] {
        return (
            this.#collectionQuery.result?.data?.meta.associations?.visualizations ??
            []
        )
    }

    /** The CMR concept-id for the current collection, once loaded. */
    get conceptId(): string | undefined {
        return this.#collectionQuery.result?.data?.meta['concept-id']
    }

    get visualizations() {
        return this.#visualizationsQuery.result
    }

    get #resolvedLayer() {
        const collectionData = this.#collectionQuery.result?.data
        const visualizationsData = this.#visualizationsQuery.result?.data

        if (
            collectionData !== this.#resolvedLayerCollectionData ||
            visualizationsData !== this.#resolvedLayerVisualizationsData
        ) {
            this.#resolvedLayerCollectionData = collectionData
            this.#resolvedLayerVisualizationsData = visualizationsData
            this.#resolvedLayerCache = cmrVisualizationService.resolveGibsLayer({
                collection: collectionData?.umm,
                visualizations: visualizationsData,
            })
        }

        return this.#resolvedLayerCache
    }

    /**
     * The CMR UMM-Vis record backing the resolved layer, when one was
     * matched — undefined when the layer came from a curated Worldview link
     * with no corresponding UMM-Vis association.
     */
    get resolvedVisualization() {
        return this.#resolvedLayer?.visualization
    }

    get gibsLayerConfig(): GibsLayerConfig | undefined {
        const resolved = this.#resolvedLayer
        if (!resolved) {
            this.#gibsLayerConfigCache = undefined
            return undefined
        }

        const name = this.config.getLayerName?.() ?? this.#collectionId ?? 'top-layer'
        const date = this.config.getDate?.()

        if (
            resolved !== this.#gibsLayerConfigResolved ||
            name !== this.#gibsLayerConfigName ||
            date !== this.#gibsLayerConfigDate
        ) {
            this.#gibsLayerConfigResolved = resolved
            this.#gibsLayerConfigName = name
            this.#gibsLayerConfigDate = date
            this.#gibsLayerConfigCache = cmrVisualizationService.buildGibsLayerConfig(
                resolved,
                { name, date },
            )
        }

        return this.#gibsLayerConfigCache
    }

    /** True while resolving the collection record, or (once it has associated visualization ids) fetching them. */
    get isLoading(): boolean {
        if (this.#collectionQuery.result?.isLoading ?? false) {
            return true
        }

        if (!this.#visualizationIds.length) {
            return false
        }

        return this.#visualizationsQuery.result?.isLoading ?? false
    }

    /** True if resolving the collection or fetching its visualizations errored. */
    get hasError(): boolean {
        return (
            (this.#collectionQuery.result?.isError ?? false) ||
            (this.#visualizationsQuery.result?.isError ?? false)
        )
    }

    /**
     * True once the collection has loaded but no usable GIBS layer was
     * found — either it has no curated Worldview layer and no associated
     * visualizations at all, or none of them resolved to a GIBS-renderable
     * layer.
     */
    get notFound(): boolean {
        if (this.#collectionQuery.result?.isSuccess !== true) {
            return false
        }

        if (this.gibsLayerConfig) {
            return false
        }

        if (!this.#visualizationIds.length) {
            return true
        }

        return this.#visualizationsQuery.result?.isSuccess === true
    }
}
