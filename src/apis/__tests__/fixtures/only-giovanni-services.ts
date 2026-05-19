export const onlyGiovanniServices = {
    conceptId: 'C2723754847-GES_DISC',
    shortName: 'GPM_3IMERGHH',
    summary: {
        subsetting: {
            bbox: true,
            dimension: false,
            shape: false,
            temporal: true,
            variable: true,
        },
        reprojection: {
            supported: false,
            supportedProjections: [],
            interpolationMethods: [],
        },
        averaging: {
            time: true,
            area: true,
        },
        concatenation: false,
        outputFormats: ['text/csv', 'image/tiff'],
    },
    services: [
        {
            name: 'giovanni-time-series-adapter',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/S2739607260-GES_DISC',
            capabilities: {
                subsetting: {
                    temporal: true,
                    variable: true,
                    multiple_variable: false,
                },
                outputFormats: ['text/csv'],
            },
        },
        {
            name: 'giovanni-averaging-service',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/S3385907677-GES_DISC',
            capabilities: {
                subsetting: {
                    bbox: true,
                    temporal: true,
                    variable: true,
                    multiple_variable: false,
                },
                averaging: {
                    time: true,
                    area: true,
                },
                outputFormats: ['text/csv', 'image/tiff'],
            },
        },
    ],
    variables: [
        {
            conceptId: 'V3156634765-GES_DISC',
            name: 'Grid/Intermediate/IRinfluence',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V3156634765-GES_DISC',
        },
        {
            conceptId: 'V3156634739-GES_DISC',
            name: 'Grid/Intermediate/IRprecipitation',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V3156634739-GES_DISC',
        },
        {
            conceptId: 'V3156634732-GES_DISC',
            name: 'Grid/Intermediate/MWobservationTime',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V3156634732-GES_DISC',
        },
        {
            conceptId: 'V3156634718-GES_DISC',
            name: 'Grid/Intermediate/MWprecipitation',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V3156634718-GES_DISC',
        },
        {
            conceptId: 'V3156634723-GES_DISC',
            name: 'Grid/Intermediate/MWprecipSource',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V3156634723-GES_DISC',
        },
        {
            conceptId: 'V3156634824-GES_DISC',
            name: 'Grid/Intermediate/precipitationUncal',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V3156634824-GES_DISC',
        },
    ],
    configuredOutputFormats: [],
    capabilitiesVersion: '2',
}
