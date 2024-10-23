import { Task, initialState } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import { compile } from 'handlebars'
import type { ReactiveControllerHost } from 'lit'
import { format } from 'date-fns'
import type { Data, PlotData } from 'plotly.js-dist-min'
import type {
    Collection,
    EndDate,
    StartDate,
    Variable,
    VariableDbEntry,
    Location,
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
const isLocalHost = globalThis.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy
const timeSeriesUrlTemplate = compile(
    `${
        isLocalHost
            ? 'http://localhost:9000/hydro1'
            : 'https://uui-test.gesdisc.eosdis.nasa.gov/api/proxy/hydro1'
    }/daac-bin/access/timeseries.cgi?variable={{variable}}&startDate={{startDate}}&endDate={{endDate}}&location={{location}}&type=asc2`
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
    host: ReactiveControllerHost
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

    constructor(host: ReactiveControllerHost) {
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

                return this.lastTaskValue
            },
        })
    }

    async #loadTimeSeries(signal: AbortSignal) {
        const collection = this.collection.replace(
            'NLDAS_FORA0125_H_2.0',
            'NLDAS_FORA0125_H_v2.0'
        )

        // create the variable identifer
        const variableEntryId = `${collection}_${this.variable}`
        const cacheKey = `${variableEntryId}_${this.location}`

        // check the database for any existing data
        const existingTerraData = await getDataByKey<VariableDbEntry>(
            IndexedDbStores.TIME_SERIES,
            cacheKey
        )

        console.log(existingTerraData)

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

        // on-prem, some of the URLs have a different start prefix
        // this is a hack for UWG that should be removed
        const variableGroup = variableEntryId.startsWith('NLDAS_')
            ? 'NLDAS2'
            : variableEntryId.split('_')[0]

        // construct a URL to fetch the time series data
        const url = timeSeriesUrlTemplate({
            variable: `${variableGroup}:${collection}:${this.variable}`, // TODO: Cloud Giovanni would use "variableEntryId" directly here, no need to reformat
            // variable: `GPM:GPM_3IMERGHH_07:precipitationQualityIndex`, // TODO: Cloud Giovanni would use "variableEntryId" directly here, no need to reformat
            startDate: format(requestStartDate, 'yyyy-MM-dd') + 'T00',
            endDate: format(requestEndDate, 'yyyy-MM-dd') + 'T00',
            location: `GEOM:POINT(${this.location})`,
        })

        // fetch the time series as a CSV
        const response = await fetch(url, { mode: 'cors', signal })

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
