import { calculateDataPoints, calculateDateChunks } from '../../lib/dataset.js'
import { format } from 'date-fns'
import { initialState, Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type { Data, PlotData } from 'plotly.js-dist-min'
import type {
    TimeSeriesData,
    TimeSeriesDataRow,
    TimeSeriesMetadata,
} from './time-series.types.js'
import type TerraTimeSeries from './time-series.component.js'
import { TimeInterval } from '../../types.js'
import {
    formatDate,
    getUTCDate,
    isDateRangeContained,
} from '../../utilities/date.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'
import type {
    SubsetJobStatus,
    SubsetJobError,
} from '../../data-services/types.js'
import { extractHarmonyError } from '../../utilities/harmony.js'
import { FINAL_STATUSES, Status } from '../../apis/harmony.api.js'
import { CollectionController } from '../../controllers/collection.controller.js'
import { HarmonyRequestController } from '../../controllers/harmony-request.controller.js'
import { HarmonyRequest } from '../../lib/harmony/harmony.request.js'
import { LatLng } from '../map/models/LatLng.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import TimeSeriesCacheService from './time-series-cache.service.js'
import { ThumbnailService } from '../../lib/thumbnails/thumbnail.service.js'
import * as Plotly from 'plotly.js-dist-min'

const NUM_DATAPOINTS_TO_WARN_USER = 50000
const HARMONY_LINK_PROXY_URL =
    'https://lpo4uv7f0h.execute-api.us-east-1.amazonaws.com/default/harmony-link-proxy'
const TIME_SERIES_NO_USER_PROXY_URL =
    'https://8weebb031a.execute-api.us-east-1.amazonaws.com/SIT/timeseries-no-user'
const HARMONY_STATUS_WAIT_INTERVAL_MS = 300
const MAX_CONCEPT_ID_WAIT_MS = 10000

export const plotlyDefaultData: Partial<PlotData> = {
    // holds the default Plotly configuration options.
    // see https://plotly.com/javascript/time-series/
    type: 'scatter',
    mode: 'lines',
}

export class TimeSeriesController {
    #userConfirmedWarning = false
    #cacheService = new TimeSeriesCacheService()
    #thumbnailService = new ThumbnailService()
    #lastHarmonyJobId: string | undefined
    #collectionController: CollectionController
    #harmonyRequestController: HarmonyRequestController

    host: ReactiveControllerHost & TerraTimeSeries & QueryClientHost
    emptyPlotData: Partial<Data>[] = [
        {
            ...plotlyDefaultData,
            x: [],
            y: [],
        },
    ]

    task: Task<readonly unknown[], Partial<Data>[]>

    //? we want to KEEP the last fetched data when a user cancels, not revert back to an empty plot
    //? Lit behavior is to set the task.value to undefined when aborted
    lastTaskValue: Partial<Data>[] | undefined

    metadata: TimeSeriesMetadata

    constructor(
        host: ReactiveControllerHost & TerraTimeSeries & QueryClientHost,
    ) {
        this.host = host
        this.#collectionController = new CollectionController(this.host, {
            getCollectionEntryId: () => this.#getCollectionEntryId(),
            getBearerToken: () => this.host.bearerToken,
        })
        this.#harmonyRequestController = new HarmonyRequestController(this.host)

        this.task = new Task(host, {
            // passing the signal in so the fetch request will be aborted when the task is aborted
            task: async (_args, { signal }) => {
                if (
                    !this.#getRequestedVariables().length ||
                    !this.host.startDate ||
                    !this.host.endDate ||
                    !this.host.location
                ) {
                    console.log(
                        'Requirements not met to fetch the time series data ',
                    )
                    return initialState
                }

                const requestedVariables = this.#getRequestedVariables()

                // fetch each requested variable independently and render each as a separate trace
                const seriesResults = await Promise.all(
                    requestedVariables.map(async (variable) => {
                        const timeSeries = await this.#loadTimeSeries(
                            signal,
                            variable,
                        )

                        // Filter out fill values from the data
                        const filteredData = this.#filterFillValues(
                            timeSeries.data,
                            timeSeries.metadata?.undef,
                        )

                        return {
                            variable,
                            timeSeries,
                            filteredData,
                        }
                    }),
                )

                this.metadata = seriesResults[0]?.timeSeries.metadata

                // map each variable result to its own Plotly trace
                this.lastTaskValue = seriesResults.map(
                    ({ variable, filteredData }) => ({
                        ...plotlyDefaultData,
                        name:
                            variable.dataFieldLongName ??
                            variable.dataFieldShortName ??
                            variable.dataFieldId,
                        hovertemplate: variable.dataFieldUnits
                            ? `%{x}<br>%{y} ${variable.dataFieldUnits}<extra>%{fullData.name}</extra>`
                            : '%{x}<br>%{y}<extra>%{fullData.name}</extra>',
                        x: filteredData.map((row) => row.timestamp),
                        y: filteredData.map((row) => row.value),
                    }),
                )

                const firstSeries = seriesResults[0]
                if (!firstSeries) {
                    return this.lastTaskValue ?? this.emptyPlotData
                }

                this.host.emit('terra-time-series-data-change', {
                    detail: {
                        data: firstSeries.timeSeries,
                        variable: firstSeries.variable,
                        series: seriesResults.map(
                            ({ variable, timeSeries }) => ({
                                variable,
                                data: timeSeries,
                            }),
                        ),
                        startDate: formatDate(this.host.startDate),
                        endDate: formatDate(this.host.endDate),
                        location: this.host.location,
                    },
                })

                if (this.#lastHarmonyJobId) {
                    this.#capturePlotThumbnail(this.#lastHarmonyJobId).catch(
                        console.error,
                    )
                }

                return this.lastTaskValue
            },
            args: () => [
                this.host.catalogVariable,
                this.host.catalogVariables,
                this.host.startDate,
                this.host.endDate,
                this.host.location,
            ],
        })
    }

    #getRequestedVariables(): Variable[] {
        if (this.host.catalogVariables?.length) {
            return this.host.catalogVariables
        }

        if (this.host.catalogVariable) {
            return [this.host.catalogVariable]
        }

        return []
    }

    async #loadTimeSeries(signal: AbortSignal, catalogVariable: Variable) {
        const hostStartDate = this.host.startDate
        const hostEndDate = this.host.endDate

        if (!hostStartDate || !hostEndDate) {
            throw new Error(
                'Start and end date are required to fetch time series data',
            )
        }

        const startDate = getUTCDate(hostStartDate)
        const endDate = getUTCDate(hostEndDate, true)
        const cacheKey = this.getCacheKeyForVariable(catalogVariable)
        const variableEntryId = catalogVariable.dataFieldId

        console.log(
            'Loading time series for variable',
            catalogVariable,
            this.host.startDate,
            this.host.endDate,
            this.host.location,
        )

        // If a job ID is provided, skip cache/chunking and directly wait for that job
        if (this.host.jobId) {
            const jobStatus = await this.#waitForHarmonyJob(
                this.host.jobId,
                signal,
            )

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

            const dataLink = jobStatus.links.find(
                (link) => link.rel === 'data',
            )?.href
            if (!dataLink) {
                const error = new Error('No data link found for Harmony job')
                this.#handleHarmonyError(error, jobStatus.errors)
                throw error
            }

            const proxyUrl = `${HARMONY_LINK_PROXY_URL}?url=${encodeURIComponent(dataLink)}`
            const response = await fetch(proxyUrl, {
                signal,
                headers: {
                    ...(this.host.bearerToken
                        ? {
                              Authorization: `Bearer ${this.host.bearerToken}`,
                          }
                        : {}),
                },
            })

            if (!response.ok) {
                const error = new Error(
                    `Failed to fetch subset job link contents: ${response.statusText}`,
                )
                this.#handleHarmonyError(error)
                throw error
            }

            this.#lastHarmonyJobId = this.host.jobId
            return this.#parseTimeSeriesCsv(await response.text())
        }

        // check the database for any existing data (only when cache is enabled)
        const existingTerraData = this.host.cache
            ? await this.#cacheService.getValidCacheEntry(cacheKey)
            : undefined
        const existingStartDate = existingTerraData?.startDate
            ? getUTCDate(existingTerraData.startDate)
            : undefined
        const existingEndDate = existingTerraData?.endDate
            ? getUTCDate(existingTerraData.endDate, true)
            : undefined

        console.log('Existing data?', existingTerraData ? 'Yes' : 'No')
        console.log(
            'Is date range contained?',
            existingStartDate && existingEndDate
                ? isDateRangeContained(
                      startDate,
                      endDate,
                      existingStartDate,
                      existingEndDate,
                  )
                : false,
        )
        console.log(
            'Is cache valid?',
            this.#cacheService.isCacheValid(existingTerraData),
        )

        if (
            existingTerraData &&
            existingStartDate &&
            existingEndDate &&
            isDateRangeContained(
                startDate,
                endDate,
                existingStartDate,
                existingEndDate,
            ) &&
            this.#cacheService.isCacheValid(existingTerraData)
        ) {
            console.log(
                'Returning existing data from cache ',
                this.getCacheKey(),
            )

            // Filter fill values from cached data (in case old cached data contains fill values)
            const fillValue = existingTerraData.metadata?.undef
            const filteredData = this.#filterFillValues(
                existingTerraData.data,
                fillValue,
            )
            const filteredTimeSeries: TimeSeriesData = {
                ...existingTerraData,
                data: filteredData,
            }

            // already have the data downloaded!
            return this.#cacheService.getDataInRange(
                filteredTimeSeries,
                startDate,
                endDate,
            )
        }

        // Calculate what data we need to fetch (accounting for data we already have)
        const dataGaps = this.#cacheService.calculateDataGaps(
            startDate,
            endDate,
            existingTerraData,
        )

        if (dataGaps.length === 0 && existingTerraData) {
            // Filter fill values from cached data (in case old cached data contains fill values)
            const filteredData = this.#filterFillValues(
                existingTerraData.data,
                existingTerraData.metadata?.undef,
            )
            const filteredTimeSeries: TimeSeriesData = {
                ...existingTerraData,
                data: filteredData,
            }

            // No gaps to fill, return existing data
            return this.#cacheService.getDataInRange(
                filteredTimeSeries,
                startDate,
                endDate,
            )
        }

        // We have gaps, so we'll need to request new data
        // We'll do this in chunks in case the number of data points exceeds the API-imposed limit
        const detectedInterval = existingTerraData?.data
            ? this.#detectTimeInterval(existingTerraData.data)
            : null
        const timeInterval =
            detectedInterval ||
            (catalogVariable.dataProductTimeInterval as TimeInterval) ||
            TimeInterval.Daily

        const allChunks: Array<{ start: Date; end: Date }> = []

        for (const gap of dataGaps) {
            const chunks = calculateDateChunks(timeInterval, gap.start, gap.end)
            allChunks.push(...chunks)
        }

        // Request chunks in parallel
        const chunkResults = await Promise.all(
            allChunks.map(async (chunk) => {
                const result = await this.#fetchTimeSeriesChunk(
                    variableEntryId,
                    chunk.start,
                    chunk.end,
                    signal,
                    catalogVariable,
                )

                return result
            }),
        )

        let allData: TimeSeriesDataRow[] = existingTerraData?.data || []
        let metadata: TimeSeriesMetadata = (existingTerraData?.metadata ||
            {}) as TimeSeriesMetadata

        // Merge all the chunk results
        for (const chunkResult of chunkResults) {
            allData = [...allData, ...chunkResult.data]
            metadata = {
                ...metadata,
                ...chunkResult.metadata,
            } as TimeSeriesMetadata
        }

        // Deduplicate by timestamp to prevent duplicate entries
        allData = this.#cacheService.deduplicateByTimestamp(allData)

        const consolidatedResult: TimeSeriesData = {
            metadata,
            data: allData,
        }

        // Save the consolidated data to IndexedDB (including fill values to avoid unnecessary API requests)
        // Only when cache mode is enabled
        if (this.host.cache) {
            await this.#cacheService.storeConsolidatedData({
                cacheKey,
                variableEntryId,
                environment: this.host.environment,
                metadata: consolidatedResult.metadata,
                data: allData,
            })
        }

        // Filter fill values before returning (but keep them in cache)
        const filteredData = this.#filterFillValues(allData, metadata?.undef)
        return this.#cacheService.getDataInRange(
            {
                metadata: consolidatedResult.metadata,
                data: filteredData,
            },
            startDate,
            endDate,
        )
    }

    /**
     * Fetches a single chunk of time series data
     */
    async #fetchTimeSeriesChunk(
        variableEntryId: string,
        startDate: Date,
        endDate: Date,
        signal: AbortSignal,
        catalogVariable: Variable,
    ): Promise<TimeSeriesData> {
        // Check if we need to warn the user about data point limits
        if (
            !this.#userConfirmedWarning &&
            !this.#checkDataPointLimits(catalogVariable, startDate, endDate)
        ) {
            // User needs to confirm before proceeding
            throw new Error('User cancelled data point warning')
        }

        // Reset the confirmation flag after using it
        this.#userConfirmedWarning = false

        const location = this.#parseLocationInput()

        if (location instanceof LatLng) {
            return this.#fetchPointTimeSeriesChunkFromProxy(
                variableEntryId,
                startDate,
                endDate,
                signal,
                location,
            )
        }

        const isBoundingBoxLocation = location instanceof LatLngBounds
        const collectionConceptId =
            await this.#waitForCollectionConceptId(signal)

        const harmonyRequest = new HarmonyRequest({
            collectionConceptId,
            location,
        })
            .variable(variableEntryId)
            .dateRange(
                format(startDate, "yyyy-MM-dd'T'00:00:00'Z'"),
                format(endDate, "yyyy-MM-dd'T'23:59:59'Z'"),
            )
            .format('text/csv')
            .label('terra-time-series')

        if (this.host.applicationId) {
            harmonyRequest.label(this.host.applicationId)
        }

        // add some helpful labels to the request for user experience so users don't just see concept ids
        harmonyRequest.addLabelsFromVariable(catalogVariable)

        if (isBoundingBoxLocation) {
            harmonyRequest.average('area')
        }

        let jobId: string
        try {
            const job = await this.#harmonyRequestController.startJob({
                harmonyRequest,
                options: {
                    signal,
                    bearerToken: this.host.bearerToken,
                    environment: this.host.environment,
                },
            })
            jobId = job.jobID
            this.#lastHarmonyJobId = jobId

            this.host.emit('terra-harmony-job-status-update', {
                detail: job,
            })
        } catch (error) {
            this.#handleHarmonyError(error)
            throw error
        }

        const jobStatus = await this.#waitForHarmonyJob(jobId, signal)

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

        const dataLink = jobStatus.links.find(
            (link) => link.rel === 'data',
        )?.href

        if (!dataLink) {
            const error = new Error('No data link found for Harmony job')
            this.#handleHarmonyError(error, jobStatus.errors)
            throw error
        }

        const proxyUrl = `${HARMONY_LINK_PROXY_URL}?url=${encodeURIComponent(dataLink)}`

        const response = await fetch(proxyUrl, {
            signal,
            headers: {
                ...(this.host.bearerToken
                    ? { Authorization: `Bearer ${this.host.bearerToken}` }
                    : {}),
            },
        })

        if (!response.ok) {
            const error = new Error(
                `Failed to fetch subset job link contents: ${response.statusText}`,
            )
            this.#handleHarmonyError(error)
            throw error
        }

        return this.#parseTimeSeriesCsv(await response.text())
    }

    async #fetchPointTimeSeriesChunkFromProxy(
        variableEntryId: string,
        startDate: Date,
        endDate: Date,
        signal: AbortSignal,
        location: LatLng,
    ): Promise<TimeSeriesData> {
        const lat = location.lat.toFixed(2)
        const lon = location.lng.toFixed(2)

        const url = `${TIME_SERIES_NO_USER_PROXY_URL}?${new URLSearchParams({
            data: variableEntryId,
            lat,
            lon,
            time_start: `${format(startDate, 'yyyy-MM-dd')}T00:00:00`,
            time_end: `${format(endDate, 'yyyy-MM-dd')}T23:59:59`,
        }).toString()}`

        const response = await fetch(url, {
            mode: 'cors',
            signal,
            headers: {
                Accept: 'application/json',
            },
        })

        if (!response.ok) {
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
                }),
            )

            throw new Error(
                `Failed to fetch time series data: ${errorDetails.message || response.statusText}`,
            )
        }

        return this.#parseTimeSeriesCsv(await response.text())
    }

    async #waitForHarmonyJob(
        jobId: string,
        signal: AbortSignal,
    ): Promise<SubsetJobStatus> {
        this.#harmonyRequestController.startPollForJobStatus(jobId)

        while (true) {
            if (signal.aborted) {
                throw new Error('Job polling was aborted')
            }

            const jobStatus = this.#harmonyRequestController.data

            if (jobStatus) {
                this.host.emit('terra-harmony-job-status-update', {
                    detail: jobStatus,
                })
            }

            if (
                jobStatus?.jobID === jobId &&
                FINAL_STATUSES.has(jobStatus.status)
            ) {
                return jobStatus
            }

            await this.#sleep(HARMONY_STATUS_WAIT_INTERVAL_MS, signal)
        }
    }

    /**
     * the data we receive for the time series is in CSV format, but with metadata at the top
     * this function parses the CSV data and returns an object of the metadata and the data
     */
    #parseTimeSeriesCsv(text: string) {
        const lines = text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)

        const metadata: Partial<TimeSeriesMetadata> = {}
        const data: TimeSeriesDataRow[] = []

        let inDataSection = false
        let dataHeaders: string[] = []

        for (const line of lines) {
            if (!inDataSection) {
                if (
                    line.startsWith('Timestamp (UTC)') ||
                    line.startsWith('time,')
                ) {
                    // This marks the beginning of the data section
                    dataHeaders = line.split(',').map((h) => h.trim())
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
     * This function converts both formats to ISO 8601 format while preserving full time resolution
     */
    #normalizeTimestamp(timestamp: string): string {
        try {
            // Parse the timestamp
            const date = new Date(timestamp)

            // Check if the date is valid
            if (Number.isNaN(date.getTime())) {
                console.warn('Invalid timestamp:', timestamp)
                return timestamp
            }

            // Format as ISO 8601 to preserve full time resolution
            // This ensures sub-hourly, hourly, and daily data all maintain their precision
            return date.toISOString()
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
        fillValue: string | number | undefined,
    ): TimeSeriesDataRow[] {
        if (!fillValue) {
            return data
        }

        return data.filter((row) => {
            const rowValue = row.value.trim()
            const fillValueStr = String(fillValue).trim()
            // Compare as strings first (most common case)
            if (rowValue === fillValueStr) {
                return false
            }
            // Also compare as numbers to handle formatting differences
            const rowNum = parseFloat(rowValue)
            const fillNum = parseFloat(fillValueStr)
            if (
                !Number.isNaN(rowNum) &&
                !Number.isNaN(fillNum) &&
                rowNum === fillNum
            ) {
                return false
            }
            return true
        })
    }

    render(renderFunctions: StatusRenderer<Partial<Data>[]>) {
        return this.task.render(renderFunctions)
    }

    /**
     * Gets the cache key for the current time series data
     */
    getCacheKey(): string {
        if (!this.host.location || !this.host.catalogVariable) {
            return ''
        }

        return this.getCacheKeyForVariable(this.host.catalogVariable)
    }

    getCacheKeyForVariable(catalogVariable: Variable): string {
        return this.#cacheService.getCacheKeyForVariable(
            catalogVariable.dataFieldId,
            this.host.location,
            this.host.environment,
        )
    }

    /**
     * Checks if the current date range will exceed data point limits
     * Returns true if it's safe to proceed, false if confirmation is needed
     */
    #checkDataPointLimits(
        catalogVariable: Variable,
        startDate: Date,
        endDate: Date,
    ) {
        this.host.estimatedDataPoints = calculateDataPoints(
            catalogVariable.dataProductTimeInterval as TimeInterval,
            startDate,
            endDate,
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
     * Detects the actual time interval from the data by analyzing timestamp differences
     * Returns the detected TimeInterval or null if unable to determine
     */
    #detectTimeInterval(data: TimeSeriesDataRow[]): TimeInterval | null {
        if (data.length < 2) {
            return null
        }

        // Sort data by timestamp to ensure we're analyzing in order
        const sortedData = [...data].sort(
            (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
        )

        // Calculate time differences between consecutive points
        const intervals: number[] = []
        for (let i = 1; i < Math.min(sortedData.length, 100); i++) {
            const prevTime = new Date(sortedData[i - 1].timestamp).getTime()
            const currTime = new Date(sortedData[i].timestamp).getTime()
            const diffMs = currTime - prevTime
            if (diffMs > 0) {
                intervals.push(diffMs)
            }
        }

        if (intervals.length === 0) {
            return null
        }

        // Find the most common interval (mode)
        const intervalCounts = new Map<number, number>()
        intervals.forEach((interval) => {
            // Round to nearest minute to handle small variations
            const rounded = Math.round(interval / (1000 * 60)) * (1000 * 60)
            intervalCounts.set(rounded, (intervalCounts.get(rounded) || 0) + 1)
        })

        let mostCommonInterval = 0
        let maxCount = 0
        intervalCounts.forEach((count, interval) => {
            if (count > maxCount) {
                maxCount = count
                mostCommonInterval = interval
            }
        })

        // Convert milliseconds to TimeInterval
        const MILLIS_IN_HOUR = 1000 * 60 * 60
        const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24

        if (mostCommonInterval <= MILLIS_IN_HOUR / 2 + 60000) {
            // 30 minutes or less (with 1 minute tolerance)
            return TimeInterval.HalfHourly
        } else if (mostCommonInterval <= MILLIS_IN_HOUR + 60000) {
            // ~1 hour
            return TimeInterval.Hourly
        } else if (mostCommonInterval <= MILLIS_IN_HOUR * 3 + 60000) {
            // ~3 hours
            return TimeInterval.ThreeHourly
        } else if (mostCommonInterval <= MILLIS_IN_DAY + 60000) {
            // ~1 day
            return TimeInterval.Daily
        } else if (mostCommonInterval <= MILLIS_IN_DAY * 7 + 60000) {
            // ~1 week
            return TimeInterval.Weekly
        }

        // Default to daily if we can't determine
        return TimeInterval.Daily
    }

    #getCollectionEntryId(): string | undefined {
        if (this.host.collection) {
            return this.host.collection
        }

        const variable = this.host.catalogVariable

        if (!variable) {
            return undefined
        }

        return `${variable.dataProductShortName}_${variable.dataProductVersion}`
    }

    async #waitForCollectionConceptId(signal: AbortSignal): Promise<string> {
        const startedAt = Date.now()

        while (Date.now() - startedAt < MAX_CONCEPT_ID_WAIT_MS) {
            if (signal.aborted) {
                throw new Error(
                    'Request aborted while waiting for collection metadata',
                )
            }

            const conceptId = this.#collectionController.conceptId
            if (conceptId) {
                return conceptId
            }

            if (this.#collectionController.collection?.isError) {
                const error = new Error(
                    'Unable to load collection metadata needed for Harmony requests',
                )
                this.#handleHarmonyError(error)
                throw error
            }

            await this.#sleep(HARMONY_STATUS_WAIT_INTERVAL_MS, signal)
        }

        const error = new Error(
            'Timed out waiting for collection metadata needed for Harmony requests',
        )
        this.#handleHarmonyError(error)
        throw error
    }

    #parseLocationInput(): LatLng | LatLngBounds {
        const rawLocation = decodeURIComponent(this.host.location ?? '')
        const rawCoordinates = rawLocation
            .split(',')
            .map((coord) => coord.trim())
        const coordinates = rawCoordinates.map((coord) => Number(coord))
        const hasInvalidCoordinates =
            rawCoordinates.some((coord) => coord.length === 0) ||
            coordinates.some((value) => Number.isNaN(value))

        if (hasInvalidCoordinates) {
            const error = new Error(
                'Invalid location format. Expected "lat,lon" or "west,south,east,north".',
            )

            this.host.dispatchEvent(
                new CustomEvent('terra-time-series-error', {
                    detail: {
                        status: 400,
                        code: 'INVALID_LOCATION',
                        message: error.message,
                        context: rawLocation,
                    },
                    bubbles: true,
                    composed: true,
                }),
            )

            throw error
        }

        if (coordinates.length === 2) {
            return new LatLng(coordinates[0], coordinates[1])
        }

        if (coordinates.length === 4) {
            return new LatLngBounds(coordinates)
        }

        const error = new Error(
            'Invalid location format. Expected "lat,lon" or "west,south,east,north".',
        )

        this.host.dispatchEvent(
            new CustomEvent('terra-time-series-error', {
                detail: {
                    status: 400,
                    code: 'INVALID_LOCATION',
                    message: error.message,
                    context: rawLocation,
                },
                bubbles: true,
                composed: true,
            }),
        )

        throw error
    }

    async #capturePlotThumbnail(
        harmonyJobId: string,
        delayMs = 1000,
        thumbWidth = 200,
        thumbHeight = 200,
    ): Promise<void> {
        // Give Plotly time to finish rendering
        await this.#sleep(delayMs)

        const plotEl = this.host.plot?.base
        if (!plotEl) {
            return
        }

        try {
            const dataUrl = await Plotly.toImage(
                plotEl as Plotly.PlotlyHTMLElement,
                {
                    format: 'jpeg',
                    width: 500,
                    height: 500,
                },
            )

            const img = new Image()
            img.src = dataUrl
            await img.decode()

            const canvas = document.createElement('canvas')
            canvas.width = thumbWidth
            canvas.height = thumbHeight
            const ctx = canvas.getContext('2d')
            if (!ctx) return undefined
            ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight)

            const blob = await new Promise<Blob>((resolve, reject) =>
                canvas.toBlob(
                    (b) =>
                        b ? resolve(b) : reject(new Error('toBlob failed')),
                    'image/jpeg',
                    0.8,
                ),
            )

            await this.#thumbnailService.store(harmonyJobId, blob)
        } catch (error) {
            console.error('Failed to capture time series thumbnail', error)
        }
    }

    #sleep(ms: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                if (signal) {
                    signal.removeEventListener('abort', handleAbort)
                }
                resolve()
            }, ms)

            const handleAbort = () => {
                clearTimeout(timeoutId)
                reject(new Error('Operation aborted'))
            }

            if (signal) {
                signal.addEventListener('abort', handleAbort, { once: true })
            }
        })
    }

    /**
     * Handles errors from Harmony GraphQL operations and dispatches them as events
     */
    #handleHarmonyError(
        error: unknown,
        jobErrors?: Array<SubsetJobError>,
    ): void {
        const errorDetails = extractHarmonyError(error, jobErrors)

        // Dispatch the error event
        this.host.dispatchEvent(
            new CustomEvent('terra-time-series-error', {
                detail: errorDetails,
                bubbles: true,
                composed: true,
            }),
        )
    }
}
