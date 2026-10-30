import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { QueryClientHost } from '../mixins/query-client.mixin.js'
import { queryCmrCollectionTags } from '../queries/cmr.queries.js'
import { QueryController } from './query.controller.js'
import cmrCollectionService from '../services/cmr-collection.service.js'
import type { GibsLayerConfig } from '../components/map/layers/gibs.layer.js'
import type { MapProjection } from '../components/map/type.js'

const EMPTY: GibsLayerConfig[] = []

export interface CmrCollectionControllerConfig {
    /** A CMR collection entry-id (e.g. 'AIRS2RET_NRT_7.0') or concept-id (e.g. 'C1234567-PROVIDER'). */
    getCollectionId: () => string | undefined
    /** The map's current view projection — only GIBS products available in it are returned. */
    getProjection: () => MapProjection
    /** ISO date (YYYY-MM-DD), or omitted/'default' for each layer's latest available date. */
    getDate?: () => string | undefined
}

/**
 * Resolves a CMR collection id (entry-id or concept-id) down to every `GibsLayerConfig` available for it
 */
export class CmrCollectionController implements ReactiveController {
    #query

    #gibsLayerConfigsCache: GibsLayerConfig[] = EMPTY
    #gibsLayerConfigsData: unknown
    #gibsLayerConfigsProjection: MapProjection | undefined
    #gibsLayerConfigsDate: string | undefined

    constructor(
        private host: ReactiveControllerHost & QueryClientHost,
        private config: CmrCollectionControllerConfig
    ) {
        this.host.addController(this)

        this.#query = new QueryController(this.host, () =>
            queryCmrCollectionTags(this.#collectionId)
        )
    }

    hostConnected() {}
    hostDisconnected() {}

    get #collectionId(): string | undefined {
        return this.config.getCollectionId()
    }

    /** Every GIBS layer available for the collection, in the map's current projection. */
    get gibsLayerConfigs(): GibsLayerConfig[] {
        const data = this.#query.result?.data
        const projection = this.config.getProjection()
        const date = this.config.getDate?.()
        const collectionId = this.#collectionId

        if (
            data === this.#gibsLayerConfigsData &&
            projection === this.#gibsLayerConfigsProjection &&
            date === this.#gibsLayerConfigsDate
        ) {
            return this.#gibsLayerConfigsCache
        }

        this.#gibsLayerConfigsData = data
        this.#gibsLayerConfigsProjection = projection
        this.#gibsLayerConfigsDate = date

        if (!data || !collectionId) {
            this.#gibsLayerConfigsCache = EMPTY
            return this.#gibsLayerConfigsCache
        }

        const entries = cmrCollectionService.filterByProjection(
            cmrCollectionService.extractGibsEntries(data),
            projection
        )

        this.#gibsLayerConfigsCache = entries.length
            ? cmrCollectionService.buildGibsLayerConfigs(entries, {
                  collectionId,
                  projection,
                  date,
              })
            : EMPTY

        return this.#gibsLayerConfigsCache
    }

    get isLoading(): boolean {
        return this.#query.result?.isLoading ?? false
    }

    get hasError(): boolean {
        return this.#query.result?.isError ?? false
    }
}
