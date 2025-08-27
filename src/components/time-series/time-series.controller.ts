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
import type { SubsetJobStatus } from '../../data-services/types.js'

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
                    // requirements not yet met to fetch the time series data
                    return initialState
                }

                // fetch the time series data
                const timeSeries = await this.#loadTimeSeries(signal)

                // now that we have actual data, map it to a Plotly plot definition
                // see https://plotly.com/javascript/time-series/
                this.lastTaskValue = [
                    {
                        ...plotlyDefaultData,
                        x: timeSeries.data.map(row => row.timestamp),
                        y: timeSeries.data.map(row => row.value),
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

        // check the database for any existing data
        const existingTerraData = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey
        )

        if (
            existingTerraData &&
            isDateRangeContained(
                startDate,
                endDate,
                new Date(existingTerraData.startDate),
                new Date(existingTerraData.endDate)
            ) &&
            this.#isCacheValid(existingTerraData)
        ) {
            console.log('Returning existing data from cache ', this.getCacheKey())

            // already have the data downloaded!
            return this.#getDataInRange(existingTerraData)
        }

        // Calculate what data we need to fetch (accounting for data we already have)
        const dataGaps = this.#calculateDataGaps(existingTerraData)

        if (dataGaps.length === 0 && existingTerraData) {
            // No gaps to fill, return existing data
            return this.#getDataInRange(existingTerraData)
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

        const consolidatedResult: TimeSeriesData = {
            metadata,
            data: allData,
        }

        // Save the consolidated data to IndexedDB
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

        return this.#getDataInRange({
            metadata: consolidatedResult.metadata,
            data: allData,
        })
    }

    /**
     * Checks if cached data is still valid (not expired)
     */
    #isCacheValid(existingData: VariableDbEntry): boolean {
        // If cachedAt is not present (backward compatibility), consider it expired
        if (!existingData.cachedAt) {
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
            const job = await this.#dataService.createSubsetJob(subsetOptions, {
                signal,
                bearerToken: this.host.bearerToken,
                environment: this.host.environment,
            })

            if (!job) {
                throw new Error('Failed to create subset job')
            }

            const jobStatus = await this.#waitForHarmonyJob(job, signal)

            // the job is completed, fetch the data for the job
            const { text } = await this.#dataService.getSubsetJobData(jobStatus, {
                signal,
                bearerToken: this.host.bearerToken,
                environment: this.host.environment,
            })
            timeSeriesCsvData = text
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
                    ...(this.host.bearerToken
                        ? { Authorization: `Bearer: ${this.host.bearerToken}` }
                        : {}),
                },
            })

            if (!response.ok) {
                this.host.dispatchEvent(
                    new CustomEvent('terra-time-series-error', {
                        detail: {
                            status: response.status,
                            message: response.statusText,
                        },
                        bubbles: true,
                        composed: true,
                    })
                )

                throw new Error(
                    `Failed to fetch time series data: ${response.statusText}`
                )
            }

            timeSeriesCsvData = await response.text()
        }

        return this.#parseTimeSeriesCsv(timeSeriesCsvData)
    }

    #waitForHarmonyJob(job: SubsetJobStatus, signal: AbortSignal) {
        return new Promise<SubsetJobStatus>(async resolve => {
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
            }

            if (jobStatus && FINAL_STATUSES.has(jobStatus.status)) {
                console.log('Job is done', jobStatus)
                resolve(jobStatus)
            } else {
                setTimeout(async () => {
                    resolve(await this.#waitForHarmonyJob(job, signal))
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
        this.host.showDataPointWarning = true
        return false
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
}
