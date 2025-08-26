import type { MaybeBearerToken } from '../components/time-series/time-series.types.js'

export type SearchOptions = {
    signal?: AbortSignal
    bearerToken?: MaybeBearerToken
    environment?: 'uat' | 'prod'
}

export interface DataServiceInterface {
    getCollectionWithAvailableServices(
        collectionEntryId: string,
        options?: SearchOptions
    ): Promise<CollectionWithAvailableServices>

    createSubsetJob(
        input: CreateSubsetJobInput,
        options?: SearchOptions
    ): Promise<SubsetJobStatus | undefined>

    getSubsetJobStatus(jobId: string): Promise<SubsetJobStatus>
}

export interface CollectionWithAvailableServices {
    conceptId: string
    shortName: string
    variableSubset: boolean
    bboxSubset: boolean
    shapeSubset: boolean
    temporalSubset: boolean
    concatenate: boolean
    reproject: boolean
    capabilitiesVersion: string
    outputFormats: string[]
    services: Service[]
    variables: Variable[]
    collection: Collection
}

export interface Collection {
    granuleCount: number
    EntryTitle: string
    SpatialExtent: {
        GranuleSpatialRepresentation: string
        HorizontalSpatialDomain: {
            Geometry: {
                CoordinateSystem: string
                BoundingRectangles: {
                    WestBoundingCoordinate: number
                    NorthBoundingCoordinate: number
                    EastBoundingCoordinate: number
                    SouthBoundingCoordinate: number
                }
            }
        }
    }
    TemporalExtents: Array<{
        EndsAtPresentFlag: boolean
        RangeDateTimes: Array<{
            BeginningDateTime: string
            EndingDateTime: string | null
        }>
    }>
}

export interface Service {
    name: string
    href: string
    capabilities: Capabilities
}

export interface Capabilities {
    output_formats: string[]
    subsetting: Subsetting
}

export interface Subsetting {
    temporal: boolean
    bbox: boolean
    variable: boolean
    shape: boolean
}

export interface Variable {
    name: string
    href: string
    conceptId: string
}

export type BoundingBox = {
    w: number
    s: number
    e: number
    n: number
}

export type CreateSubsetJobInput = {
    collectionConceptId?: string
    collectionEntryId?: string
    variableConceptIds?: Array<string>
    variableEntryIds?: Array<string>
    boundingBox?: BoundingBox
    startDate?: string
    endDate?: string
    format?: string
    average?: string
    labels?: Array<string>
}

export enum Status {
    FETCHING = 'fetching',
    PREVIEWING = 'previewing',
    RUNNING = 'running',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    CANCELED = 'canceled',
    PAUSED = 'paused',
    RUNNING_WITH_ERRORS = 'running_with_errors',
    COMPLETE_WITH_ERRORS = 'complete_with_errors',
}

export type SubsetJobs = {
    count: number
    jobs: Array<SubsetJobStatus>
}

export type SubsetJobStatus = {
    jobID: string
    status: Status
    message: string
    progress: number
    createdAt: string
    updatedAt: string
    dataExpiration: string
    request: string
    numInputGranules: number
    originalDataSize?: string
    outputDataSize?: string
    dataSizePercentChange?: string
    labels?: string[]
    errors?: Array<SubsetJobError>
    links: Array<SubsetJobLink>
}

export type SubsetJobError = {
    url: string
    message: string
}

export type SubsetJobLink = {
    title: string
    href: string
    rel: string
    type: string
    bbox?: number[]
    temporal?: {
        start: string
        end: string
    }
}
