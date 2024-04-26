import { Task, initialState } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import { compile } from 'handlebars'
import type { ReactiveControllerHost } from 'lit'
import { format } from 'date-fns'
import type { Data, PlotData } from 'plotly.js'
import type {
    Collection,
    EndDate,
    StartDate,
    Variable,
    VariableDbEntry,
} from './time-series.types.js'
import type {
    TimeSeriesData,
    TimeSeriesDataRow,
    TimeSeriesMetadata,
} from './time-series.types.js'
import {
    IndexedDbStores,
    getDataByKey,
    storeDataByKey,
} from '../../internal/indexeddb.js'

// TODO: switch this to Cloud Giovanni during GUUI-3329
const isLocalHost = window.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy
const timeSeriesUrlTemplate = compile(
    `${
        isLocalHost
            ? 'http://localhost:9000/hydro1'
            : 'https://hydro1.gesdisc.eosdis.nasa.gov'
    }/daac-bin/access/timeseries.cgi?variable={{variable}}&startDate={{startDate}}&endDate={{endDate}}&location={{location}}&type=asc2`
)

export const plotlyDefaultData: Partial<PlotData> = {
    // holds the default Plotly configuration options.
    // see https://plotly.com/javascript/time-series/
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgb(28, 103, 227)' }, // TODO: configureable?
}

type TaskArguments = [Collection, Variable, StartDate, EndDate]

export class TimeSeriesController {
    host: ReactiveControllerHost
    emptyPlotData: Partial<Data>[] = [
        {
            ...plotlyDefaultData,
            x: [],
            y: [],
        },
    ]

    task: Task<TaskArguments, Partial<Data>[]>

    #collection: Collection
    #variable: Variable
    #startDate: StartDate
    #endDate: EndDate

    constructor(host: ReactiveControllerHost) {
        this.host = host

        this.task = new Task<TaskArguments, Partial<Data>[]>(
            host,
            async (
                args: TaskArguments,
                { signal } // passing the signal in so the fetch request will be aborted when the task is aborted
            ) => {
                const [collection, variable, startDate, endDate] = args

                if (!collection || !variable || !startDate || !endDate) {
                    // requirements not yet met to fetch the time series data
                    return initialState
                }

                // fetch the time series data
                const timeSeries = await this.#loadTimeSeries(signal)

                // now that we have actual data, map it to a Plotly plot definition
                // see https://plotly.com/javascript/time-series/
                return [
                    {
                        ...plotlyDefaultData,
                        x: timeSeries.data.map(row => row.timestamp),
                        y: timeSeries.data.map(row => row.value),
                    },
                ]
            },
            () => [this.collection, this.variable, this.startDate, this.endDate]
        )
    }

    set collection(value: Collection) {
        this.#collection = value
        this.host.requestUpdate()
    }
    get collection() {
        return this.#collection
    }

    set variable(value: Variable) {
        this.#variable = value
        this.host.requestUpdate()
    }
    get variable() {
        return this.#variable
    }

    set startDate(value: StartDate) {
        this.#startDate = value
        this.host.requestUpdate()
    }
    get startDate() {
        return this.#startDate
    }

    set endDate(value: EndDate) {
        this.#endDate = value
        this.host.requestUpdate()
    }
    get endDate() {
        return this.#endDate
    }

    async #loadTimeSeries(signal: AbortSignal) {
        // create the variable identifer
        const variableEntryId = `${this.collection}_${this.variable}`

        // check the database for any existing data
        const existingData = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            variableEntryId
        )

        if (
            existingData &&
            this.startDate.getTime() >= new Date(existingData.startDate).getTime() &&
            this.endDate.getTime() <= new Date(existingData.endDate).getTime()
        ) {
            // already have the data downloaded!
            return this.#getDataInRange(existingData)
        }

        // the fetch request we send out may not contain the full date range the user requested
        // we'll request only the data we don't currently have cached
        let requestStartDate = this.startDate
        let requestEndDate = this.endDate

        if (existingData) {
            if (
                requestStartDate.getTime() <
                new Date(existingData.startDate).getTime()
            ) {
                // user has requested more data than what we have, move the endDate up
                requestEndDate = new Date(existingData.startDate)
            }

            if (requestEndDate.getTime() > new Date(existingData.endDate).getTime()) {
                // user has requested more data than what we have, move the startDate back
                requestStartDate = new Date(existingData.endDate)
            }
        }

        // construct a URL to fetch the time series data
        const url = timeSeriesUrlTemplate({
            variable: `${variableEntryId.split('_')[0]}:${this.collection}:${
                this.variable
            }`, // TODO: Cloud Giovanni would use "variableEntryId" directly here, no need to reformat
            startDate: format(requestStartDate, 'yyyy-MM-dd') + 'T00',
            endDate: format(requestEndDate, 'yyyy-MM-dd') + 'T00',
            location: 'GEOM:POINT(-86.9375,%2033.9375)',
        })

        // fetch the time series as a CSV
        const response = await fetch(url, { mode: 'cors', signal })

        if (!response.ok) {
            throw new Error(
                `Failed to fetch time series data: ${response.statusText}`
            )
        }

        const parsedData = this.#parseTimeSeriesCsv(await response.text())

        // combined the new parsedData with any existingData
        parsedData.data = [...parsedData.data, ...(existingData?.data || [])]

        // save the new data to the database
        await storeDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            variableEntryId,
            {
                variableEntryId,
                startDate: parsedData.data[0].timestamp,
                endDate: parsedData.data[parsedData.data.length - 1].timestamp,
                ...parsedData,
            }
        )

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
            } else if (line.includes('\t')) {
                const [timestamp, value] = line.split('\t')
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
            data: data.data.filter(row => {
                const timestamp = new Date(row.timestamp)
                return timestamp >= this.startDate && timestamp <= this.endDate
            }),
        }
    }

    render(renderFunctions: StatusRenderer<Partial<Data>[]>) {
        return this.task.render(renderFunctions)
    }
}
