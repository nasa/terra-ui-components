import { calculateDateChunks } from '../../lib/dataset.js'
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
    Collection,
    EndDate,
    Location,
    MaybeBearerToken,
    StartDate,
    TimeSeriesData,
    TimeSeriesDataRow,
    TimeSeriesMetadata,
    Variable,
    VariableDbEntry,
} from './time-series.types.js'
import type TerraTimeSeries from './time-series.component.js'
import type { TimeInterval } from '../../types.js'

const endpoint =
    'https://8weebb031a.execute-api.us-east-1.amazonaws.com/SIT/timeseries-no-user'

export const plotlyDefaultData: Partial<PlotData> = {
    // holds the default Plotly configuration options.
    // see https://plotly.com/javascript/time-series/
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgb(28, 103, 227)' }, // TODO: configureable?
}

type TaskArguments = [Collection, Variable, StartDate, EndDate, Location]

export class TimeSeriesController {
    #bearerToken: MaybeBearerToken = null

    host: ReactiveControllerHost & TerraTimeSeries
    emptyPlotData: Partial<Data>[] = [
        {
            ...plotlyDefaultData,
            x: [],
            y: [],
        },
    ]

    task: Task<TaskArguments, Partial<Data>[]>

    //? we want to KEEP the last fetched data when a user cancels, not revert back to an empty plot
    //? Lit behavior is to set the task.value to undefined when aborted
    lastTaskValue: Partial<Data>[] | undefined

    collection: Collection
    variable: Variable
    startDate: StartDate
    endDate: EndDate
    location: Location

    constructor(
        host: ReactiveControllerHost & TerraTimeSeries,
        bearerToken: MaybeBearerToken
    ) {
        this.#bearerToken = bearerToken

        this.host = host

        this.task = new Task(host, {
            autoRun: false,
            // passing the signal in so the fetch request will be aborted when the task is aborted
            task: async (_args, { signal }) => {
                if (
                    !this.collection ||
                    !this.variable ||
                    !this.startDate ||
                    !this.endDate ||
                    !this.location
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
                        collection: this.collection,
                        variable: this.variable,
                        startDate: this.startDate.toISOString(),
                        endDate: this.endDate.toISOString(),
                        location: this.location,
                    },
                })

                return this.lastTaskValue
            },
        })
    }

    async #loadTimeSeries(signal: AbortSignal) {
        // create the variable identifer
        const variableEntryId = `${this.collection}_${this.variable}`.replace(
            /\./g,
            '_'
        ) // GiC doesn't store variables with a "." in the name, they replace them with "_"
        const cacheKey = `${variableEntryId}_${this.location}`

        // check the database for any existing data
        const existingTerraData = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey
        )

        if (
            existingTerraData &&
            this.startDate.getTime() >=
                new Date(existingTerraData.startDate).getTime() &&
            this.endDate.getTime() <= new Date(existingTerraData.endDate).getTime()
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
                this.host.timeInterval as TimeInterval,
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
        if (!existingData) {
            // No existing data, need to fetch the entire range
            return [{ start: this.startDate, end: this.endDate }]
        }

        const existingStartDate = new Date(existingData.startDate)
        const existingEndDate = new Date(existingData.endDate)
        const gaps: Array<{ start: Date; end: Date }> = []

        // Check if we need data before our cached range
        if (this.startDate < existingStartDate) {
            gaps.push({ start: this.startDate, end: existingStartDate })
        }

        // Check if we need data after our cached range
        if (this.endDate > existingEndDate) {
            gaps.push({ start: existingEndDate, end: this.endDate })
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
        const [lon, lat] = decodeURIComponent(this.location ?? ', ').split(', ')

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
                ...(this.#bearerToken
                    ? { Authorization: `Bearer: ${this.#bearerToken}` }
                    : {}),
            },
        })

        if (!response.ok) {
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
        return {
            ...data,
            data: data.data
                .filter(row => {
                    const timestamp = new Date(row.timestamp)
                    return timestamp >= this.startDate && timestamp <= this.endDate
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
}
