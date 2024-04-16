import { format } from 'date-fns'
import { compile } from 'handlebars'

// TODO: switch this to Cloud Giovanni during GUUI-3329
const isLocalHost = window.location.hostname === 'localhost' // if running on localhost, we'll route API calls through a local proxy
const timeSeriesUrlTemplate = compile(
    `${
        isLocalHost
            ? 'http://localhost:9000/hydro1'
            : 'https://hydro1.gesdisc.eosdis.nasa.gov'
    }/daac-bin/access/timeseries.cgi?variable={{variable}}&startDate={{startDate}}&endDate={{endDate}}&location={{location}}&type=asc2`
)

/**
 * given a variableEntryId (e.g. GPM_3IMERGHH_06_precipitationCal), fetches the time series data
 * TODO: when using Cloud Giovanni, we'll need to rework the URL to use the new API. CG uses a different syntax for the variable name
 */
export async function fetchTimeSeries(
    variableEntryId: string,
    startDate: Date,
    endDate: Date
) {
    // ex: GPM_3IMERGHH_06_precipitationCal
    const project = variableEntryId.split('_')[0] // GPM
    const dataset = variableEntryId.split('_').slice(0, -1).join('_') // GPM_3IMERGHH_06
    const variable = variableEntryId.split('_').pop() // precipitationCal

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

    // return a parsed object of the metadata and data from the CSV
    return parseCsv(await response.text())
}

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
 * the data we receive for the time series is in CSV format, but with metadata at the top
 * this function parses the CSV data and returns an object of the metadata and the data
 */
function parseCsv(text: string) {
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
