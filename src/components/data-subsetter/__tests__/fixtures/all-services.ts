export const allServices = {
    conceptId: 'C1276812863-GES_DISC',
    shortName: 'M2T1NXSLV',
    variableSubset: true,
    bboxSubset: true,
    shapeSubset: true,
    temporalSubset: true,
    concatenate: false,
    reproject: false,
    outputFormats: [
        'text/csv',
        'application/netcdf',
        'application/x-netcdf4',
        'image/tiff',
    ],
    services: [
        {
            name: 'foo-adapter',
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
            name: 'sds/HOSS-geographic',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/S2164732315-XYZ_PROV',
            capabilities: {
                subsetting: {
                    temporal: true,
                    bbox: true,
                    dimension: true,
                    shape: true,
                    variable: true,
                },
                output_formats: ['application/netcdf', 'application/x-netcdf4'],
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
            conceptId: 'V2296950155-GES_DISC',
            name: 'CLDPRS',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2296950155-GES_DISC',
        },
        {
            conceptId: 'V2586807132-GES_DISC',
            name: 'CLDTMP',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2586807132-GES_DISC',
        },
        {
            conceptId: 'V2586807251-GES_DISC',
            name: 'DISPH',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2586807251-GES_DISC',
        },
        {
            conceptId: 'V2621868743-GES_DISC',
            name: 'H1000',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2621868743-GES_DISC',
        },
        {
            conceptId: 'V2586807439-GES_DISC',
            name: 'H250',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2586807439-GES_DISC',
        },
    ],
    capabilitiesVersion: '2',
}
