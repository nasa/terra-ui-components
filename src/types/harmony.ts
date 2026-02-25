export interface HarmonyCapabilitiesResponse {
    conceptId: string
    shortName: string
    variableSubset: boolean
    bboxSubset: boolean
    shapeSubset: boolean
    temporalSubset: boolean
    concatenate: boolean
    reproject: boolean
    outputFormats: string[]
    services: Service[]
    variables: Variable[]
    capabilitiesVersion: string
}

export interface Service {
    name: string
    href: string
    capabilities: Capabilities
}

export interface Capabilities {
    subsetting: Subsetting
    output_formats: string[]
    averaging?: Averaging
}

export interface Averaging {
    time: boolean
    area: boolean
}

export interface Subsetting {
    temporal: boolean
    variable: boolean
    multiple_variable: boolean
    bbox?: boolean
}

export interface Variable {
    name: string
    href: string
}
