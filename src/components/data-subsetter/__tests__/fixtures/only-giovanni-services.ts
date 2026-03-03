export const onlyGiovanniServices = {
    conceptId: 'C2723754847-GES_DISC',
    shortName: 'GPM_3IMERGHH',
    variableSubset: true,
    bboxSubset: true,
    shapeSubset: false,
    temporalSubset: true,
    concatenate: false,
    reproject: false,
    outputFormats: ['text/csv', 'image/tiff'],
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
                output_formats: ['text/csv'],
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
                output_formats: ['text/csv', 'image/tiff'],
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
    capabilitiesVersion: '2',
}
