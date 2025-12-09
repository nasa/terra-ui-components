import { calculateDataPoints, calculateDateChunks } from '../../lib/dataset.js'
import { format } from 'date-fns'
import { initialState, Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type { Data, PlotData } from 'plotly.js-dist-min'
import {
    IndexedDbStores,
    getDataByKey,
    storeDataByKey,
    deleteDataByKey,
} from '../../internal/indexeddb.js'
import type {
    TimeSeriesData,
    TimeSeriesDataRow,
    TimeSeriesMetadata,
    VariableDbEntry,
} from './time-series.types.js'
import type TerraTimeSeries from './time-series.component.js'
import type { TimeInterval } from '../../types.js'
import { formatDate, getUTCDate, isDateRangeContained } from '../../utilities/date.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import {
    FINAL_STATUSES,
    HarmonyDataService,
} from '../../data-services/harmony-data-service.js'
import type { SubsetJobStatus, SubsetJobError } from '../../data-services/types.js'
import { Status } from '../../data-services/types.js'

const NUM_DATAPOINTS_TO_WARN_USER = 50000
const REFRESH_HARMONY_DATA_INTERVAL = 2000
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

const endpoint =
    'https://8weebb031a.execute-api.us-east-1.amazonaws.com/SIT/timeseries-no-user'

export const plotlyDefaultData: Partial<PlotData> = {
    // holds the default Plotly configuration options.
    // see https://plotly.com/javascript/time-series/
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgb(28, 103, 227)' }, // TODO: configureable?
}

export class TimeSeriesController {
    #userConfirmedWarning = false
    #dataService: HarmonyDataService

    host: ReactiveControllerHost & TerraTimeSeries
    emptyPlotData: Partial<Data>[] = [
        {
            ...plotlyDefaultData,
            x: [],
            y: [],
        },
    ]

    task: Task<any, Partial<Data>[]>

    //? we want to KEEP the last fetched data when a user cancels, not revert back to an empty plot
    //? Lit behavior is to set the task.value to undefined when aborted
    lastTaskValue: Partial<Data>[] | undefined

    constructor(host: ReactiveControllerHost & TerraTimeSeries) {
        this.#dataService = this.#getDataService()

        this.host = host

        this.task = new Task(host, {
            // passing the signal in so the fetch request will be aborted when the task is aborted
            task: async (_args, { signal }) => {
                if (
                    !this.host.catalogVariable ||
                    !this.host.startDate ||
                    !this.host.endDate ||
                    !this.host.location
                ) {
                    console.log('Requirements not met to fetch the time series data ')
                    return initialState
                }

                // fetch the time series data
                const timeSeries = await this.#loadTimeSeries(signal)

                // Filter out fill values from the data
                const filteredData = this.#filterFillValues(
                    timeSeries.data,
                    timeSeries.metadata?.undef
                )

                // now that we have actual data, map it to a Plotly plot definition
                // see https://plotly.com/javascript/time-series/
                this.lastTaskValue = [
                    {
                        ...plotlyDefaultData,
                        x: filteredData.map(row => row.timestamp),
                        y: filteredData.map(row => row.value),
                    },
                ]

                this.host.emit('terra-time-series-data-change', {
                    detail: {
                        data: timeSeries,
                        variable: this.host.catalogVariable,
                        startDate: formatDate(this.host.startDate),
                        endDate: formatDate(this.host.endDate),
                        location: this.host.location,
                    },
                })

                return this.lastTaskValue
            },
            args: () => [
                this.host.catalogVariable,
                this.host.startDate,
                this.host.endDate,
                this.host.location,
            ],
        })
    }

    async #loadTimeSeries(signal: AbortSignal) {
        const startDate = getUTCDate(this.host.startDate!)
        const endDate = getUTCDate(this.host.endDate!, true)
        const cacheKey = this.getCacheKey()
        const variableEntryId = this.host.catalogVariable!.dataFieldId

        console.log(
            'Loading time series for variable',
            this.host.catalogVariable,
            this.host.startDate,
            this.host.endDate,
            this.host.location
        )

        // check the database for any existing data
        const existingTerraData = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey
        )

        console.log('Existing data?', existingTerraData ? 'Yes' : 'No')
        console.log(
            'Is date range contained?',
            isDateRangeContained(
                startDate,
                endDate,
                getUTCDate(existingTerraData?.startDate),
                getUTCDate(existingTerraData?.endDate, true)
            )
        )
        console.log('Is cache valid?', this.#isCacheValid(existingTerraData))

        if (
            existingTerraData &&
            isDateRangeContained(
                startDate,
                endDate,
                getUTCDate(existingTerraData?.startDate),
                getUTCDate(existingTerraData?.endDate, true)
            ) &&
            this.#isCacheValid(existingTerraData)
        ) {
            console.log('Returning existing data from cache ', this.getCacheKey())

            // Filter fill values from cached data (in case old cached data contains fill values)
            const fillValue = existingTerraData.metadata?.undef
            const filteredData = this.#filterFillValues(
                existingTerraData.data,
                fillValue
            )
            const filteredTimeSeries: TimeSeriesData = {
                ...existingTerraData,
                data: filteredData,
            }

            // already have the data downloaded!
            return this.#getDataInRange(filteredTimeSeries)
        }

        // Calculate what data we need to fetch (accounting for data we already have)
        const dataGaps = this.#calculateDataGaps(existingTerraData)

        if (dataGaps.length === 0 && existingTerraData) {
            // Filter fill values from cached data (in case old cached data contains fill values)
            const filteredData = this.#filterFillValues(
                existingTerraData.data,
                existingTerraData.metadata?.undef
            )
            const filteredTimeSeries: TimeSeriesData = {
                ...existingTerraData,
                data: filteredData,
            }

            // No gaps to fill, return existing data
            return this.#getDataInRange(filteredTimeSeries)
        }

        // We have gaps, so we'll need to request new data
        // We'll do this in chunks in case the number of data points exceeds the API-imposed limit
        const allChunks: Array<{ start: Date; end: Date }> = []

        for (const gap of dataGaps) {
            const chunks = calculateDateChunks(
                this.host.catalogVariable!.dataProductTimeInterval as TimeInterval,
                gap.start,
                gap.end
            )
            allChunks.push(...chunks)
        }

        // Request chunks in parallel
        const chunkResults = await Promise.all(
            allChunks.map(async chunk => {
                const result = await this.#fetchTimeSeriesChunk(
                    variableEntryId,
                    chunk.start,
                    chunk.end,
                    signal
                )

                return result
            })
        )

        let allData: TimeSeriesDataRow[] = existingTerraData?.data || []
        let metadata = {} as any

        // Merge all the chunk results
        for (const chunkResult of chunkResults) {
            allData = [...allData, ...chunkResult.data]
            metadata = { ...metadata, ...chunkResult.metadata }
        }

        // Deduplicate by timestamp to prevent duplicate entries
        allData = this.#deduplicateByTimestamp(allData)

        const consolidatedResult: TimeSeriesData = {
            metadata,
            data: allData,
        }

        // Save the consolidated data to IndexedDB (including fill values to avoid unnecessary API requests)
        if (allData.length > 0) {
            // Sort data by timestamp to ensure they're in order
            const sortedData = [...allData].sort(
                (a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )

            await storeDataByKey<VariableDbEntry>(
                IndexedDbStores.TIME_SERIES,
                cacheKey,
                {
                    variableEntryId,
                    key: cacheKey,
                    startDate: sortedData[0].timestamp,
                    endDate: sortedData[sortedData.length - 1].timestamp,
                    metadata: consolidatedResult.metadata,
                    data: sortedData,
                    environment: this.host.environment,
                    cachedAt: new Date().getTime(),
                }
            )
        }

        // Filter fill values before returning (but keep them in cache)
        const filteredData = this.#filterFillValues(allData, metadata?.undef)
        return this.#getDataInRange({
            metadata: consolidatedResult.metadata,
            data: filteredData,
        })
    }

    /**
     * Checks if cached data is still valid (not expired)
     */
    #isCacheValid(existingData?: VariableDbEntry): boolean {
        // If cachedAt is not present (backward compatibility), consider it expired
        if (!existingData?.cachedAt) {
            this.clearExpiredCache()
            return false
        }

        const now = new Date().getTime()
        const cacheIsExpired = now - existingData.cachedAt > CACHE_TTL_MS

        if (cacheIsExpired) {
            this.clearExpiredCache()
        }

        return !cacheIsExpired
    }

    /**
     * Calculates what data gaps need to be filled from the API
     */
    #calculateDataGaps(
        existingData?: VariableDbEntry
    ): Array<{ start: Date; end: Date }> {
        const start = getUTCDate(this.host.startDate!)
        const end = getUTCDate(this.host.endDate!)

        if (!existingData) {
            // No existing data, need to fetch the entire range
            return [{ start, end }]
        }

        const existingStartDate = new Date(existingData.startDate)
        const existingEndDate = new Date(existingData.endDate)
        const gaps: Array<{ start: Date; end: Date }> = []

        // Check if we need data before our cached range
        if (start < existingStartDate) {
            gaps.push({ start, end: existingStartDate })
        }

        // Check if we need data after our cached range
        if (end > existingEndDate) {
            gaps.push({ start: existingEndDate, end })
        }

        return gaps
    }

    /**
     * Fetches a single chunk of time series data
     */
    async #fetchTimeSeriesChunk(
        variableEntryId: string,
        startDate: Date,
        endDate: Date,
        signal: AbortSignal
    ): Promise<TimeSeriesData> {
        let timeSeriesCsvData: string = ''

        // Check if we need to warn the user about data point limits
        if (
            !this.#userConfirmedWarning &&
            !this.#checkDataPointLimits(
                this.host.catalogVariable!,
                startDate,
                endDate
            )
        ) {
            // User needs to confirm before proceeding
            throw new Error('User cancelled data point warning')
        }

        // Reset the confirmation flag after using it
        this.#userConfirmedWarning = false

        const parsedLocation = decodeURIComponent(this.host.location ?? ',').split(
            ','
        )

        if (parsedLocation.length === 4) {
            const collection = `${this.host.catalogVariable!.dataProductShortName}_${this.host.catalogVariable!.dataProductVersion}`
            const [w, s, e, n] = parsedLocation
            let subsetOptions = {
                collectionEntryId: collection,
                variableConceptIds: ['parameter_vars'],
                variableEntryIds: [variableEntryId],
                startDate: format(startDate, 'yyyy-MM-dd') + 'T00%3A00%3A00',
                endDate: format(endDate, 'yyyy-MM-dd') + 'T23%3A59%3A59',
                format: 'text/csv',
                boundingBox: {
                    w: parseFloat(w),
                    s: parseFloat(s),
                    e: parseFloat(e),
                    n: parseFloat(n),
                },
                average: 'area',
            }

            console.log(
                `Creating a Harmony job for collection, ${collection}, with subset options`,
                subsetOptions
            )

            // create the new job
            let job: SubsetJobStatus | undefined
            try {
                job = await this.#dataService.createSubsetJob(subsetOptions, {
                    signal,
                    bearerToken: this.host.bearerToken,
                    environment: this.host.environment,
                })
            } catch (error) {
                // Handle GraphQL errors from Harmony
                this.#handleHarmonyError(error)
                throw error
            }

            if (!job) {
                const error = new Error('Failed to create subset job')
                this.#handleHarmonyError(error)
                throw error
            }

            const jobStatus = await this.#waitForHarmonyJob(job, signal)

            // Check if job failed or has errors
            if (jobStatus.status === Status.FAILED) {
                const errorMessage =
                    jobStatus.message ||
                    jobStatus.errors?.[0]?.message ||
                    'The subset job failed'
                const error = new Error(errorMessage)
                this.#handleHarmonyError(error, jobStatus.errors)
                throw error
            }

            if (
                jobStatus.status === Status.COMPLETE_WITH_ERRORS &&
                jobStatus.errors &&
                jobStatus.errors.length > 0
            ) {
                const errorMessage =
                    jobStatus.errors[0].message ||
                    'The subset job completed with errors'
                const error = new Error(errorMessage)
                this.#handleHarmonyError(error, jobStatus.errors)
                throw error
            }

            // the job is completed, fetch the data for the job
            try {
                const { text } = await this.#dataService.getSubsetJobData(jobStatus, {
                    signal,
                    bearerToken: this.host.bearerToken,
                    environment: this.host.environment,
                })
                timeSeriesCsvData = text
            } catch (error) {
                this.#handleHarmonyError(error)
                throw error
            }
        } else {
            const [lat, lon] = this.#normalizeCoordinates(parsedLocation)

            const url = `${endpoint}?${new URLSearchParams({
                data: variableEntryId,
                lat,
                lon,
                time_start: format(startDate, 'yyyy-MM-dd') + 'T00%3A00%3A00',
                time_end: format(endDate, 'yyyy-MM-dd') + 'T23%3A59%3A59',
            }).toString()}`

            // Fetch the time series as a CSV
            const response = await fetch(url, {
                mode: 'cors',
                signal,
                headers: {
                    Accept: 'application/json',
                    /* TODO: figure out why bearer tokens are not working
                    ...(this.host.bearerToken
                        ? { Authorization: `Bearer: ${this.host.bearerToken}` }
                        : {}),
                        */
                },
            })

            if (!response.ok) {
                // Try to parse JSON error response
                let errorDetails: {
                    code?: string
                    message?: string
                    context?: string
                } = {}
                const contentType = response.headers.get('content-type')
                if (contentType?.includes('application/json')) {
                    try {
                        errorDetails = await response.json()
                    } catch {
                        // If JSON parsing fails, use status text
                        errorDetails = { message: response.statusText }
                    }
                } else {
                    errorDetails = { message: response.statusText }
                }

                this.host.dispatchEvent(
                    new CustomEvent('terra-time-series-error', {
                        detail: {
                            status: response.status,
                            code: errorDetails.code || String(response.status),
                            message: errorDetails.message || response.statusText,
                            context: errorDetails.context,
                        },
                        bubbles: true,
                        composed: true,
                    })
                )

                throw new Error(
                    `Failed to fetch time series data: ${errorDetails.message || response.statusText}`
                )
            }

            timeSeriesCsvData = await response.text()
        }

        return this.#parseTimeSeriesCsv(timeSeriesCsvData)
    }

    #waitForHarmonyJob(job: SubsetJobStatus, signal: AbortSignal) {
        return new Promise<SubsetJobStatus>(async (resolve, reject) => {
            let jobStatus: SubsetJobStatus | undefined

            try {
                jobStatus = await this.#dataService.getSubsetJobStatus(job.jobID, {
                    signal,
                    bearerToken: this.host.bearerToken,
                    environment: this.host.environment,
                })

                console.log('Job status', jobStatus)
            } catch (error) {
                console.error('Error checking harmony job status', error)
                // Handle GraphQL errors from status check
                this.#handleHarmonyError(error)
                reject(error)
                return
            }

            if (jobStatus && FINAL_STATUSES.has(jobStatus.status)) {
                console.log('Job is done', jobStatus)
                resolve(jobStatus)
            } else {
                setTimeout(async () => {
                    try {
                        resolve(await this.#waitForHarmonyJob(job, signal))
                    } catch (error) {
                        reject(error)
                    }
                }, REFRESH_HARMONY_DATA_INTERVAL)
            }
        })
    }

    /**
     * the data we receive for the time series is in CSV format, but with metadata at the top
     * this function parses the CSV data and returns an object of the metadata and the data
     */
    #parseTimeSeriesCsv(text: string) {
        const lines = text
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean)

        const metadata: Partial<TimeSeriesMetadata> = {}
        const data: TimeSeriesDataRow[] = []

        let inDataSection = false
        let dataHeaders: string[] = []

        for (const line of lines) {
            if (!inDataSection) {
                if (line.startsWith('Timestamp (UTC)') || line.startsWith('time,')) {
                    // This marks the beginning of the data section
                    dataHeaders = line.split(',').map(h => h.trim())
                    inDataSection = true
                    continue
                }

                // Otherwise, treat as metadata (key,value)
                const [key, value] = line.split(',')
                if (key && value !== undefined) {
                    metadata[key.trim()] = value.trim()
                }
            } else {
                // Now parsing data rows
                const parts = line.split(',')
                if (parts.length === dataHeaders.length) {
                    const row: Array<string> = []
                    for (let i = 0; i < dataHeaders.length; i++) {
                        row.push(parts[i].trim())
                    }

                    // Normalize timestamp format
                    const timestamp = this.#normalizeTimestamp(row[0])

                    data.push({
                        timestamp,
                        value: row[1],
                    })
                }
            }
        }

        return { metadata, data } as TimeSeriesData
    }

    /**
     * Normalizes timestamp format to be consistent between point-based and area-averaged data
     * Point-based data format: "2013-11-28 23:30"
     * Area-averaged data format: "2009-01-01T00:30:00.000000000"
     * This function converts area-averaged format to match point-based format
     */
    #normalizeTimestamp(timestamp: string): string {
        try {
            // Parse the timestamp and format it consistently
            const date = new Date(timestamp)

            return formatDate(date)
        } catch (error) {
            // If parsing fails, return the original timestamp
            console.warn('Failed to normalize timestamp:', timestamp, error)
            return timestamp
        }
    }

    /**
     * Filters out fill values from time series data
     */
    #filterFillValues(
        data: TimeSeriesDataRow[],
        fillValue: string | number | undefined
    ): TimeSeriesDataRow[] {
        if (!fillValue) {
            return data
        }

        return data.filter(row => {
            const rowValue = row.value.trim()
            const fillValueStr = String(fillValue).trim()
            // Compare as strings first (most common case)
            if (rowValue === fillValueStr) {
                return false
            }
            // Also compare as numbers to handle formatting differences
            const rowNum = parseFloat(rowValue)
            const fillNum = parseFloat(fillValueStr)
            if (!isNaN(rowNum) && !isNaN(fillNum) && rowNum === fillNum) {
                return false
            }
            return true
        })
    }

    /**
     * Deduplicates time series data by timestamp, keeping the first occurrence
     */
    #deduplicateByTimestamp(data: TimeSeriesDataRow[]): TimeSeriesDataRow[] {
        const seen = new Map<string, TimeSeriesDataRow>()
        for (const row of data) {
            const timestamp = row.timestamp
            if (!seen.has(timestamp)) {
                seen.set(timestamp, row)
            }
        }
        return Array.from(seen.values())
    }

    /**
     * given a set of data and a date range, will return only the data that falls within that range
     */
    #getDataInRange(data: TimeSeriesData): TimeSeriesData {
        const startDate = getUTCDate(this.host.startDate!)
        const endDate = getUTCDate(this.host.endDate!)

        return {
            ...data,
            data: data.data
                .filter(row => {
                    const timestamp = new Date(row.timestamp)
                    return timestamp >= startDate && timestamp <= endDate
                })
                .sort(
                    (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                ),
        }
    }

    render(renderFunctions: StatusRenderer<Partial<Data>[]>) {
        return this.task.render(renderFunctions)
    }

    /**
     * Normalizes coordinates to 2 decimal places
     */
    #normalizeCoordinates(coordinates: Array<string>) {
        return coordinates.map(coord => Number(coord).toFixed(2))
    }

    /**
     * Gets the cache key for the current time series data
     */
    getCacheKey(): string {
        if (!this.host.location || !this.host.catalogVariable) {
            throw new Error(
                'Location and catalog variable are required to get cache key'
            )
        }

        const normalizedCoordinates = this.#normalizeCoordinates(
            this.host.location.split(',')
        )
        const normalizedLocation = normalizedCoordinates.join(',%20')
        const environment = this.host.environment ?? 'prod'
        return `${this.host.catalogVariable.dataFieldId}_${normalizedLocation}_${environment}`
    }

    /**
     * Checks if the current date range will exceed data point limits
     * Returns true if it's safe to proceed, false if confirmation is needed
     */
    #checkDataPointLimits(catalogVariable: Variable, startDate: Date, endDate: Date) {
        this.host.estimatedDataPoints = calculateDataPoints(
            catalogVariable.dataProductTimeInterval as TimeInterval,
            startDate,
            endDate
        )

        if (this.host.estimatedDataPoints < NUM_DATAPOINTS_TO_WARN_USER) {
            // under the warning limit, user is good to go
            return true
        }

        // show warning and require confirmation from the user
        // TODO: temporarily turning this off
        // this.host.showDataPointWarning = true
        // return false
        return true
    }

    /**
     * Called when the user confirms the data point warning
     */
    confirmDataPointWarning() {
        this.#userConfirmedWarning = true
        this.host.showDataPointWarning = false
    }

    /**
     * Clears expired cache entries for the current cache key
     */
    async clearExpiredCache() {
        try {
            const cacheKey = this.getCacheKey()
            const existingData = await getDataByKey<VariableDbEntry>(
                IndexedDbStores.TIME_SERIES,
                cacheKey
            )

            if (existingData && !this.#isCacheValid(existingData)) {
                await deleteDataByKey(IndexedDbStores.TIME_SERIES, cacheKey)
                console.log(`Cleared expired cache for key: ${cacheKey}`)
            }
        } catch (error) {
            console.warn('Error clearing expired cache:', error)
        }
    }

    #getDataService() {
        return new HarmonyDataService()
    }

    /**
     * Handles errors from Harmony GraphQL operations and dispatches them as events
     */
    #handleHarmonyError(error: unknown, jobErrors?: Array<SubsetJobError>): void {
        let errorCode = '400' // Default to 400 for GraphQL errors (usually client errors)
        let errorMessage = 'An error occurred'
        let errorContext: string | undefined

        // Extract error information from the error object
        if (error instanceof Error) {
            errorMessage = error.message

            // Try to extract GraphQL error information
            // GraphQL errors often have a format like "Failed to create subset job: <message>"
            // or the error might be an Apollo error with more details
            const graphQLErrorMatch = errorMessage.match(
                /Failed to (?:create|fetch|cancel) subset job:\s*(.+)/i
            )
            if (graphQLErrorMatch) {
                errorContext = graphQLErrorMatch[1]
                errorMessage = graphQLErrorMatch[1] // Use the extracted message as the main message
            } else {
                errorContext = errorMessage
            }

            // Try to extract status code from error message
            const statusMatch = errorMessage.match(/status[:\s]+(\d+)/i)
            if (statusMatch) {
                errorCode = statusMatch[1]
            }
        } else {
            errorMessage = String(error)
            errorContext = errorMessage
        }

        // If we have job errors, use the first one's message
        if (jobErrors && jobErrors.length > 0) {
            errorContext = jobErrors[0].message || errorContext
            errorMessage = jobErrors[0].message || errorMessage
        }

        // Dispatch the error event
        this.host.dispatchEvent(
            new CustomEvent('terra-time-series-error', {
                detail: {
                    status: parseInt(errorCode, 10) || 500,
                    code: errorCode,
                    message: errorMessage,
                    context: errorContext,
                },
                bubbles: true,
                composed: true,
            })
        )
    }
}
