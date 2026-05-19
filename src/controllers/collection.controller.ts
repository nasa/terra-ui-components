import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'
import {
    queryCmrCollection,
    queryCmrSampling,
    queryCmrVariables,
} from '../queries/cmr.queries.js'
import { queryGiovanniConfiguredVariables } from '../queries/giovanni.queries.js'
import { queryGesDiscCollection } from '../queries/gesdisc.queries.js'
import { queryHarmonyCapabilities } from '../queries/harmony.queries.js'
import { QueryController } from './query.controller.js'
import type { HarmonyCapabilitiesResponse } from '../apis/harmony.api.js'
import type { UmmC } from '../apis/types/cmr/umm-c.js'

export interface CollectionControllerConfig {
    getCollectionEntryId: () => string | undefined
    getBearerToken: () => string | undefined
}

export type CollectionWithAvailableServices = HarmonyCapabilitiesResponse & {
    granuleCount: number
    collection: UmmC
}

/**
 * A Lit ReactiveController that manages all collection-related queries for a given
 * collection entry ID. Owns the full dependency chain:
 *
 *   collectionEntryId
 *     ├── #collectionQuery  (CMR UMM-C record)
 *     │     └── conceptId
 *     │           ├── #capabilitiesQuery  (Harmony capabilities — also needs bearerToken)
 *     │           ├── #variablesQuery     (CMR UMM-Var records)
 *     │           └── #gesDiscCollectionQuery  (GES DISC collection details)
 *     └── #samplingQuery  (first/last granule dates from CMR)
 *
 *   #giovanniVariablesQuery  (always enabled; static endpoint)
 *
 * Queries re-run automatically when collectionEntryId changes because QueryController
 * calls optionsFn() on every hostUpdate(), which picks up the new value.
 */
export class CollectionController implements ReactiveController {
    #collectionQuery
    #capabilitiesQuery
    #variablesQuery
    #gesDiscCollectionQuery
    #samplingQuery
    #giovanniVariablesQuery

    // Memoized values — stable references rebuilt only when underlying query data changes.
    #collectionInfo: CollectionWithAvailableServices | undefined = undefined
    #capsData: unknown = undefined
    #cmrData: unknown = undefined
    #giovanniData: readonly string[] | undefined = undefined
    #giovanniSet: Set<string> = new Set()

    constructor(
        private host: ReactiveControllerHost & QueryClientHost,
        private config: CollectionControllerConfig,
    ) {
        this.host.addController(this)

        this.#collectionQuery = new QueryController(this.host, () =>
            queryCmrCollection(this.config.getCollectionEntryId()),
        )

        this.#capabilitiesQuery = new QueryController(this.host, () =>
            queryHarmonyCapabilities(this.conceptId, {
                bearerToken: this.config.getBearerToken(),
            }),
        )

        this.#variablesQuery = new QueryController(this.host, () =>
            queryCmrVariables({ collectionConceptId: this.conceptId }),
        )

        this.#gesDiscCollectionQuery = new QueryController(this.host, () =>
            queryGesDiscCollection({
                collectionEntryId: this.config.getCollectionEntryId(),
                collectionConceptId: this.conceptId,
            }),
        )

        this.#samplingQuery = new QueryController(this.host, () =>
            queryCmrSampling(this.config.getCollectionEntryId()),
        )

        this.#giovanniVariablesQuery = new QueryController(
            this.host,
            queryGiovanniConfiguredVariables,
        )
    }

    // ReactiveController is satisfied by addController above; sub-controllers handle their own lifecycle
    hostConnected() {}
    hostDisconnected() {}

    // ─── Derived ────────────────────────────────────────────────────────────────

    /** The CMR concept-id for the current collection, once loaded. */
    get conceptId(): string | undefined {
        return this.#collectionQuery.result?.data?.meta['concept-id']
    }

    // ─── Query results ───────────────────────────────────────────────────────────

    /** Raw CMR UMM-C result for the current collection. */
    get collection() {
        return this.#collectionQuery.result
    }

    /** Harmony capabilities for the current collection (output formats, subsetting options, etc.). */
    get capabilities() {
        return this.#capabilitiesQuery.result
    }

    /** CMR UMM-Var records for all variables in the current collection. */
    get variables() {
        return this.#variablesQuery.result
    }

    /** GES DISC collection details (user-friendly dimension names, etc.). */
    get gesDiscCollection() {
        return this.#gesDiscCollectionQuery.result
    }

    /** First/last granule dates derived from a CMR temporal sampling query. */
    get sampling() {
        return this.#samplingQuery.result
    }

    /** List of variable names configured in Giovanni. Stable reference — only changes when data changes. */
    get giovanniVariables(): Set<string> {
        const raw = this.#giovanniVariablesQuery.result?.data ?? undefined
        if (raw !== this.#giovanniData) {
            this.#giovanniData = raw
            this.#giovanniSet = new Set(raw ?? [])
        }
        return this.#giovanniSet
    }

    // ─── Status helpers ──────────────────────────────────────────────────────────

    /** True while the primary collection record is being fetched. */
    get isLoadingCollection() {
        return this.#collectionQuery.result?.isLoading ?? false
    }

    /** True if the capabilities query errored (e.g. collection not found in Harmony). */
    get hasCapabilitiesError() {
        return this.#capabilitiesQuery.result?.isError ?? false
    }

    // ─── Computed from sampling ───────────────────────────────────────────────────

    /** True if the collection contains sub-daily granules (temporal extent < 24 h). */
    get isSubDaily(): boolean {
        return this.#samplingQuery.result?.data?.isSubDaily ?? false
    }

    /** True if the collection has at least one granule. */
    get hasGranules(): boolean {
        return this.#samplingQuery.result?.data?.hasGranules ?? false
    }

    // ─── Computed from CMR collection ────────────────────────────────────────────

    /**
     * Bounding box string derived from the UMM-C spatial extent, in the format
     * "west, south, east, north". Returns a global default if no extent is defined.
     */
    get spatialConstraints(): string {
        const rects =
            this.#collectionQuery.result?.data?.umm.SpatialExtent
                ?.HorizontalSpatialDomain?.Geometry?.BoundingRectangles

        if (!rects?.length) return '-180, -90, 180, 90'

        const r = rects[0]
        return `${r.WestBoundingCoordinate}, ${r.SouthBoundingCoordinate}, ${r.EastBoundingCoordinate}, ${r.NorthBoundingCoordinate}`
    }

    /**
     * Returns a `CollectionWithAvailableServices` shaped object by combining the
     * Harmony capabilities response with UMM-C metadata from CMR.
     * Returns undefined until both capabilities and the collection record are loaded.
     * Stable reference — only rebuilds when the underlying query data changes.
     */
    get collectionInfo() {
        const caps = this.#capabilitiesQuery.result?.data
        const cmr = this.#collectionQuery.result?.data
        if (!caps || !cmr) return undefined

        // Rebuild only when either query's data object changes.
        if (caps !== this.#capsData || cmr !== this.#cmrData) {
            this.#capsData = caps
            this.#cmrData = cmr
            this.#collectionInfo = {
                ...caps,
                granuleCount: cmr.meta['granule-count'] ?? 0,
                collection: cmr.umm,
            }
        }
        return this.#collectionInfo
    }
}
