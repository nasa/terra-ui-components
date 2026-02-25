import type {
    CloudCoverRange,
    CmrGranule,
    CmrSamplingOfGranules,
    MetadataCatalogInterface,
} from '../../metadata-catalog/types.js'
import { CmrCatalog } from '../../metadata-catalog/cmr-catalog.js'
import { Task, type StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type TerraDataAccess from './data-access.component.js'

export type FetchGranulesOptions = {
    collectionEntryId: string
    startRow: number
    endRow: number
    sortBy?: string
    sortDirection?: string
    search?: string
    cloudCover?: {
        min?: number
        max?: number
    }
}

export class DataAccessController {
    fetchGranulesTask: Task<
        [
            string,
            number,
            number,
            string,
            string,
            string,
            { min?: number; max?: number },
        ],
        CmrGranule[] | undefined
    >
    cloudCoverRangeTask: Task<
        [string | undefined, string | undefined],
        CloudCoverRange | null | undefined
    >
    samplingTask: Task<
        [string | undefined, string | undefined],
        CmrSamplingOfGranules | undefined
    >
    #host: ReactiveControllerHost & TerraDataAccess
    #catalog: MetadataCatalogInterface
    #totalGranules: number = 0
    #granules: CmrGranule[] = []
    #sampling?: CmrSamplingOfGranules
    #cloudCoverRange: CloudCoverRange | null = null

    constructor(host: ReactiveControllerHost & TerraDataAccess) {
        this.#host = host
        this.#catalog = this.#getCatalogRepository()

        // fetch sampling of granules
        this.samplingTask = new Task(host, {
            task: async ([shortName, version], { signal }) => {
                const collectionEntryId = this.#getCollectionEntryId(
                    shortName,
                    version
                )

                if (!collectionEntryId) {
                    return
                }

                const sampling = await this.#catalog.getSamplingOfGranules(
                    collectionEntryId,
                    {
                        signal,
                    }
                )

                this.#sampling = sampling?.collections?.items?.[0] ?? []

                return this.#sampling
            },
            args: () => [this.#host.shortName, this.#host.version],
        })

        // fetch cloud cover range
        this.cloudCoverRangeTask = new Task(host, {
            task: async ([shortName, version], { signal }) => {
                const collectionEntryId = this.#getCollectionEntryId(
                    shortName,
                    version
                )

                if (!collectionEntryId) {
                    return
                }

                const cloudCoverRange = await this.#catalog.getCloudCoverRange(
                    collectionEntryId,
                    {
                        signal,
                    }
                )

                this.#cloudCoverRange = cloudCoverRange

                return this.#cloudCoverRange
            },
            args: () => [this.#host.shortName, this.#host.version],
        })
    }

    get granules() {
        return this.#granules
    }

    get totalGranules() {
        return this.#totalGranules
    }

    get sampling() {
        return this.#sampling
    }

    get granuleMinDate() {
        if (!this.#sampling?.firstGranules) {
            return null
        }

        return (
            this.#sampling.firstGranules.items[0]?.temporalExtent?.rangeDateTime
                ?.beginningDateTime ?? null
        )
    }

    get granuleMaxDate() {
        const granules = this.#sampling?.lastGranules?.items

        if (!granules?.length) {
            return null
        }

        return (
            granules[granules.length - 1].temporalExtent?.rangeDateTime
                ?.endingDateTime ?? null
        )
    }

    get cloudCoverRange() {
        return this.#cloudCoverRange
    }

    get isSubDaily() {
        if (!this.#sampling?.firstGranules?.items?.[0]) {
            return false
        }

        const firstGranule = this.#sampling.firstGranules.items[0]

        const timeStart =
            firstGranule.temporalExtent?.rangeDateTime?.beginningDateTime
        const timeEnd = firstGranule.temporalExtent?.rangeDateTime?.endingDateTime

        if (!timeStart || !timeEnd) {
            return false
        }

        // Parse the dates and calculate the difference in hours
        const start = new Date(timeStart)
        const end = new Date(timeEnd)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        // If the temporal extent is less than 24 hours, it's sub-daily
        return diffHours < 24
    }

    get spatialConstraints() {
        const boundingRects =
            this.#sampling?.spatialExtent?.horizontalSpatialDomain?.geometry
                ?.boundingRectangles

        if (!boundingRects || boundingRects.length === 0) {
            return '-180, -90, 180, 90'
        }

        const boundingRect = boundingRects[0]
        const {
            westBoundingCoordinate,
            southBoundingCoordinate,
            eastBoundingCoordinate,
            northBoundingCoordinate,
        } = boundingRect

        return `${westBoundingCoordinate}, ${southBoundingCoordinate}, ${eastBoundingCoordinate}, ${northBoundingCoordinate}`
    }

    get spatialExtentDisplay() {
        const boundingRects =
            this.#sampling?.spatialExtent?.horizontalSpatialDomain?.geometry
                ?.boundingRectangles

        if (!boundingRects || boundingRects.length === 0) {
            return 'Global'
        }

        const boundingRect = boundingRects[0]
        const {
            westBoundingCoordinate,
            southBoundingCoordinate,
            eastBoundingCoordinate,
            northBoundingCoordinate,
        } = boundingRect

        // Check if it's global coverage
        if (
            westBoundingCoordinate === -180 &&
            southBoundingCoordinate === -90 &&
            eastBoundingCoordinate === 180 &&
            northBoundingCoordinate === 90
        ) {
            return 'Global'
        }

        return `${westBoundingCoordinate}, ${southBoundingCoordinate}, ${eastBoundingCoordinate}, ${northBoundingCoordinate}`
    }

    render(renderFunctions: StatusRenderer<Partial<CmrGranule[] | undefined>>) {
        return this.fetchGranulesTask.render(renderFunctions)
    }

    #getCatalogRepository() {
        return new CmrCatalog()
    }

    #getCollectionEntryId(shortName?: string, version?: string) {
        if (!shortName || !version) {
            return
        }

        return `${shortName}_${version}`
    }
}
