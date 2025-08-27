export type Collection = string
export type Variable = string
export type StartDate = Date
export type EndDate = Date
export type Location = string

export type VariableDbEntry = TimeSeriesData & {
    variableEntryId: string
    startDate: string
    endDate: string
    /** unique key to identify unique record */
    key: string
    /** environment used when fetching the data */
    environment?: string
    /** timestamp when the data was cached */
    cachedAt: number
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

export type MaybeBearerToken = string | null
