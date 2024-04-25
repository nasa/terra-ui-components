import { format } from 'date-fns'
import { compile } from 'handlebars'
import { storeDataForVariable, getDownloadDataForVariable } from './time-series.db.js'

// TODO: switch this to Cloud Giovanni during GUUI-3329
const isLocalHost = window.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy
const timeSeriesUrlTemplate = compile(
    `${
        isLocalHost
            ? 'http://localhost:9000/hydro1'
            : 'https://hydro1.gesdisc.eosdis.nasa.gov'
    }/daac-bin/access/timeseries.cgi?variable={{variable}}&startDate={{startDate}}&endDate={{endDate}}&location={{location}}&type=asc2`
)

export type TimeSeriesData = {
    metadata: TimeSeriesMetadata
    data: TimeSeriesDataRow[]
}

export type TimeSeriesDataRow = {
    timestamp: string
    value: string
}

export type TimeSeriesMetadata = {
    prod_name: string
    param_short_name: string
    param_name: string
    unit: string
    begin_time: string
    end_time: string
    lat: number
    lon: number
    [key: string]: string | number
}

/**
 * given a variableEntryId (e.g. GPM_3IMERGHH_06_precipitationCal), fetches the time series data
 * TODO: when using Cloud Giovanni, we'll need to rework the URL to use the new API. CG uses a different syntax for the variable name
 */
export async function fetchTimeSeries(
    variableEntryId: string,
    startDate: Date,
    endDate: Date
) {
    // check the database for any existing data
    const existingData = await getDownloadDataForVariable(variableEntryId)

    if (
        existingData &&
        startDate.getTime() >= new Date(existingData.startDate).getTime() &&
        endDate.getTime() <= new Date(existingData.endDate).getTime()
    ) {
        // already have the data downloaded!
        return getDataInRange(existingData, startDate, endDate)
    }

    // ex: GPM_3IMERGHH_06_precipitationCal
    const project = variableEntryId.split('_')[0] // GPM
    const dataset = variableEntryId.split('_').slice(0, -1).join('_') // GPM_3IMERGHH_06
    const variable = variableEntryId.split('_').pop() // precipitationCal

    // if we have some data, we want to make sure we don't request data we already have
    if (existingData) {
        if (startDate.getTime() < new Date(existingData.startDate).getTime()) {
            // user has requested more data than what we have, move the endDate up
            endDate = new Date(existingData.startDate)
        }

        if (endDate.getTime() > new Date(existingData.endDate).getTime()) {
            // user has requested more data than what we have, move the startDate back
            startDate = new Date(existingData.endDate)
        }
    }

    // construct a URL to fetch the time series data
    const url = timeSeriesUrlTemplate({
        variable: `${project}:${dataset}:${variable}`, // TODO: Cloud Giovanni would use "variableEntryId" directly here, no need to reformat
        startDate: format(startDate, 'yyyy-MM-dd') + 'T00',
        endDate: format(endDate, 'yyyy-MM-dd') + 'T00',
        location: 'GEOM:POINT(-86.9375,%2033.9375)',
    })

    // fetch the time series as a CSV
    const response = await fetch(url, { mode: 'cors' })

    if (!response.ok) {
        throw new Error(`Failed to fetch time series data: ${response.statusText}`)
    }

    const parsedData = parseTimeSeriesCsv(await response.text())

    // combined the new parsedData with any existingData
    parsedData.data = [...parsedData.data, ...(existingData?.data || [])]

    // save the new data to the database
    await storeDataForVariable(variableEntryId, parsedData)

    return getDataInRange(parsedData, startDate, endDate)
}

/**
 * the data we receive for the time series is in CSV format, but with metadata at the top
 * this function parses the CSV data and returns an object of the metadata and the data
 */
function parseTimeSeriesCsv(text: string) {
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
function getDataInRange(
    data: TimeSeriesData,
    startDate: Date,
    endDate: Date
): TimeSeriesData {
    return {
        ...data,
        data: data.data.filter(row => {
            const timestamp = new Date(row.timestamp)
            return timestamp >= startDate && timestamp <= endDate
        }),
    }
}
