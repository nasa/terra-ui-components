import { compile } from 'handlebars'
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

const timeSeriesUrlTemplate = compile(
    `https://8weebb031a.execute-api.us-east-1.amazonaws.com/SIT/timeseries-no-user?data={{variable}}&lat={{lat}}&lon={{lon}}&time_start={{time_start}}&time_end={{time_end}}`
)

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
            '.',
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
        // the fetch request we send out may not contain the full date range the user requested
        // we'll request only the data we don't currently have cached
        let requestStartDate = this.startDate
        let requestEndDate = this.endDate

        if (existingTerraData) {
            if (
                requestStartDate.getTime() <
                new Date(existingTerraData.startDate).getTime()
            ) {
                // user has requested more data than what we have, move the endDate up
                requestEndDate = new Date(existingTerraData.startDate)
            }

            if (
                requestEndDate.getTime() >
                new Date(existingTerraData.endDate).getTime()
            ) {
                // user has requested more data than what we have, move the startDate back
                requestStartDate = new Date(existingTerraData.endDate)
            }
        }

        const [lon, lat] = decodeURIComponent(this.location ?? ', ').split(', ')

        // construct a URL to fetch the time series data
        const url = timeSeriesUrlTemplate({
            variable: variableEntryId,
            time_start: format(requestStartDate, 'yyyy-MM-dd') + 'T00%3A00%3A00',
            time_end: format(requestEndDate, 'yyyy-MM-dd') + 'T23%3A59%3A59',
            lat,
            lon,
        })

        // fetch the time series as a CSV
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

        const parsedData = this.#parseTimeSeriesCsv(await response.text())

        // combined the new parsedData with any existinTerraata
        parsedData.data = [...parsedData.data, ...(existingTerraData?.data || [])]

        // save the new data to the database
        await storeDataByKey<VariableDbEntry>(IndexedDbStores.TIME_SERIES, cacheKey, {
            variableEntryId,
            key: cacheKey,
            startDate: parsedData.data[0].timestamp,
            endDate: parsedData.data[parsedData.data.length - 1].timestamp,
            ...parsedData,
        })

        return this.#getDataInRange(parsedData)
    }

    /**
     * the data we receive for the time series is in CSV format, but with metadata at the top
     * this function parses the CSV data and returns an object of the metadata and the data
     */
    #parseTimeSeriesCsv(text: string) {
        const lines = text.split('\n')
        const metadata: Partial<TimeSeriesMetadata> = {}
        const data: TimeSeriesDataRow[] = []

        lines.forEach(line => {
            if (line.includes('=')) {
                const [key, value] = line.split('=')
                metadata[key] = value
            } else if (line.includes(',')) {
                const [timestamp, value] = line.split(',')
                if (timestamp && value) {
                    data.push({ timestamp, value })
                }
            }
        })

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
