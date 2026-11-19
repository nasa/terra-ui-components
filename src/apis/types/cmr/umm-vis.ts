export interface UmmVisMetadataLink {
    'xlink:Href'?: string
    'xlink:Role'?: string
    'xlink:Title'?: string
    'xlink:Type'?: string
}

export interface UmmVisProductIdentification {
    InternalIdentifier?: string
    StandardOrNRTExternalIdentifier?: string
    BestAvailableExternalIdentifier?: string
    GIBSTitle?: string
    WorldviewTitle?: string
    WorldviewSubtitle?: string
}

export interface UmmVisProductMetadata {
    InternalIdentifier?: string
    'ows:Identifier'?: string
    ColorMap?: string
    'ows:Metadata'?: UmmVisMetadataLink[]
    [key: string]: unknown
}

export interface UmmVis {
    Identifier?: string
    Name?: string
    Title?: string
    Subtitle?: string
    Description?: string
    VisualizationType?: string
    Specification?: {
        ProductIdentification?: UmmVisProductIdentification
        ProductMetadata?: UmmVisProductMetadata
    }
}
