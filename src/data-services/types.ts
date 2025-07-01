export interface DataServiceInterface {
    getCollectionWithAvailableServices(
        collectionEntryId: string,
        options?: { signal?: AbortSignal }
    ): Promise<CollectionWithAvailableServices>

    createSubsetJob(
        collectionConceptId: string,
        subsetOptions?: SubsetJobOptions
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
}

export type SubsetJobOptions = {
    variableConceptId?: string
    signal?: AbortSignal
}

export enum Status {
    PREVIEWING = 'previewing',
    RUNNING = 'running',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    CANCELED = 'canceled',
    PAUSED = 'paused',
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
    links: Array<SubsetJobLink>
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
