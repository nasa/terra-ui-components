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
} from '../../internal/indexeddb.js'
import type {
    MaybeBearerToken,
    TimeSeriesData,
    TimeSeriesDataRow,
    TimeSeriesMetadata,
    VariableDbEntry,
} from './time-series.types.js'
import type TerraTimeSeries from './time-series.component.js'
import type { TimeInterval } from '../../types.js'
import { formatDate, getUTCDate } from '../../utilities/date.js'
import type { Variable } from '../browse-variables/browse-variables.types.js'

const NUM_DATAPOINTS_TO_WARN_USER = 50000

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
    #bearerToken: MaybeBearerToken = null
    #userConfirmedWarning = false

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

    constructor(
        host: ReactiveControllerHost & TerraTimeSeries,
        bearerToken: MaybeBearerToken
    ) {
        this.#bearerToken = bearerToken

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
        const endDate = getUTCDate(this.host.endDate!)
        const cacheKey = this.getCacheKey()
        const variableEntryId = this.host.catalogVariable!.dataFieldId

        // check the database for any existing data
        const existingTerraData = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey
        )

        if (
            existingTerraData &&
            startDate.getTime() >= new Date(existingTerraData.startDate).getTime() &&
            endDate.getTime() <= new Date(existingTerraData.endDate).getTime()
        ) {
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
                }
            )
        }

        return this.#getDataInRange({
            metadata: consolidatedResult.metadata,
            data: allData,
        })
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

        const [lat, lon] = decodeURIComponent(this.host.location ?? ',').split(',')
        const normalizedLocation = this.#normalizeCoordinates(lat, lon)

        const url = `${endpoint}?${new URLSearchParams({
            data: variableEntryId,
            lat: normalizedLocation.lat,
            lon: normalizedLocation.lon,
            time_start: format(startDate, 'yyyy-MM-dd') + 'T00%3A00%3A00',
            time_end: format(endDate, 'yyyy-MM-dd') + 'T23%3A59%3A59',
        }).toString()}`

        // Fetch the time series as a CSV
        const response = await fetch(url, {
            mode: 'cors',
            signal,
            headers: {
                Accept: 'application/json',
                ...(this.#bearerToken
                    ? { Authorization: `Bearer: ${this.#bearerToken}` }
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

        return this.#parseTimeSeriesCsv(await response.text())
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
                if (line === 'Timestamp (UTC),Data') {
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
                    const row: Record<string, string> = {}
                    for (let i = 0; i < dataHeaders.length; i++) {
                        row[dataHeaders[i]] = parts[i].trim()
                    }
                    data.push({
                        timestamp: row['Timestamp (UTC)'],
                        value: row['Data'],
                    })
                }
            }
        }

        return { metadata, data } as TimeSeriesData
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
    #normalizeCoordinates(lat: string, lon: string) {
        return {
            lat: Number(lat).toFixed(2),
            lon: Number(lon).toFixed(2),
        }
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

        const [lat, lon] = this.host.location.split(',')
        const normalizedLocation = this.#normalizeCoordinates(lat, lon)
        const location = `${normalizedLocation.lat},%20${normalizedLocation.lon}`
        return `${this.host.catalogVariable.dataFieldId}_${location}`
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
}
