export const onlyNetcdf = {
    conceptId: 'C1239966755-GES_DISC',
    shortName: 'OMAERO',
    summary: {
        subsetting: {
            bbox: true,
            dimension: true,
            shape: true,
            temporal: true,
            variable: true,
        },
        reprojection: {
            supported: false,
            supportedProjections: [],
            interpolationMethods: [],
        },
        averaging: {
            time: false,
            area: false,
        },
        concatenation: false,
        outputFormats: ['application/netcdf', 'application/x-netcdf4'],
    },
    services: [
        {
            name: 'podaac/l2-subsetter',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/S1962070864-POCLOUD',
            capabilities: {
                subsetting: {
                    temporal: true,
                    bbox: true,
                    variable: true,
                    shape: true,
                    dimension: true,
                },
                outputFormats: ['application/netcdf', 'application/x-netcdf4'],
            },
        },
    ],
    variables: [
        {
            conceptId: 'V2778423892-GES_DISC',
            name: 'HDFEOS/SWATHS/ColumnAmountAerosol/Data Fields/AerosolIndexUV',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2778423892-GES_DISC',
        },
        {
            conceptId: 'V2778427374-GES_DISC',
            name: 'HDFEOS/SWATHS/ColumnAmountAerosol/Data Fields/AerosolIndexVIS',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2778427374-GES_DISC',
        },
        {
            conceptId: 'V2778427929-GES_DISC',
            name: 'HDFEOS/SWATHS/ColumnAmountAerosol/Data Fields/AerosolModelMW',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2778427929-GES_DISC',
        },
        {
            conceptId: 'V2778424120-GES_DISC',
            name: 'HDFEOS/SWATHS/ColumnAmountAerosol/Data Fields/AerosolModelsPassedThreshold',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V2778424120-GES_DISC',
        },
    ],
    configuredOutputFormats: [],
    capabilitiesVersion: '2',
}
