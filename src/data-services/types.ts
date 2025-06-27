export interface DataServiceInterface {
    createSubsetJob(
        collectionConceptId: string,
        subsetOptions?: SubsetJobOptions
    ): Promise<SubsetJobStatus | undefined>

    getSubsetJobStatus(jobId: string): Promise<SubsetJobStatus>

    // TODO: document and types
    getAvailableServices(): Promise<any>
}

export type SubsetJobOptions = {
    variableConceptId?: string
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
    links: SubsetJobLink
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
