export const onlyNetcdf = {
    conceptId: 'C1239966755-GES_DISC',
    shortName: 'OMAERO',
    variableSubset: true,
    bboxSubset: true,
    shapeSubset: true,
    temporalSubset: true,
    concatenate: false,
    reproject: false,
    outputFormats: ['application/netcdf', 'application/x-netcdf4'],
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
                output_formats: ['application/netcdf', 'application/x-netcdf4'],
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
    capabilitiesVersion: '2',
}
