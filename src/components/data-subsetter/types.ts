import type { Variable } from '../../types/harmony.js'

export type SelectedSubsetOptions = {
    format?: string
    variables?: Variable[]
    spatial?: BoundingBox | LatLng | null
    dateRange?: DateRange
}

export type ConfiguredSubsetOptions = {
    hasGranules: boolean
    estimatedJobSize: EstimatedJobSize | null
    outputFormats: OutputFormat[]
    temporalSubsetting: TemporalSubsetting
    spatialSubsetting: SpatialSubsetting
    variableSubsetting: VariableSubsetting
    helpText?: string
}

export type EstimatedJobSize = {
    days: number
    links: number
}

type BoundingBox = {
    w: number
    s: number
    e: number
    n: number
}

type LatLng = {
    lat: number
    lng: number
}

type DateRange = {
    startDate: string | null
    endDate: string | null
}

export type OutputFormat = {
    key: string
    label: string
    description: string
}

export type TemporalSubsetting = {
    helpText?: string
    enabled: boolean
    timePickerEnabled: boolean
    granuleMinDate?: string
    granuleMaxDate?: string
}

export type SpatialSubsetting = {
    helpText?: string
    enabled: boolean
    bboxSubset: boolean
    shapeSubset: boolean
    spatialConstraints: SpatialConstraints
}

export type VariableSubsetting = {
    helpText?: string
    enabled: boolean
    multipleVariablesAllowed: boolean
}

type SpatialConstraints = {
    coordinates: {
        westBoundingCoordinate: number
        northBoundingCoordinate: number
        eastBoundingCoordinate: number
        southBoundingCoordinate: number
    }
    coordinatesStr: string
}
