import { gql } from '@apollo/client/core'

export const GET_SHAPE_FILES = gql`
    query {
        shapeFiles {
            categories {
                shapefileID
                title
                sourceName
                sourceURL
                shapes {
                    name
                    shapeID
                    shapefileID
                }
            }
        }
    }
`

export const GET_GEOJSON_SHAPE = gql`
    query GetGeoJsonShape($shape: String!) {
        getGeoJsonShape(shape: $shape) {
            type
            features {
                type
                geometry {
                    type
                    coordinates
                }
                properties {
                    TYPE
                    RIVER
                    USE_1
                    USE_2
                    USE_3
                    ELEV_M
                    COUNTRY
                    GLWD_ID
                    LAT_DEG
                    VOL_SRC
                    AREA_SKM
                    DAM_NAME
                    DAM_YEAR
                    LONG_DEG
                    LRS_AREA
                    PERIM_KM
                    POLY_SRC
                    gShapeID
                    LAKE_NAME
                    LRS_CATCH
                    MGLD_AREA
                    MGLD_TYPE
                    NEAR_CITY
                    SEC_CNTRY
                    CATCH_TSKM
                    DAM_HEIGHT
                    INFLOW_CMS
                    LRS_AR_SRC
                    VOLUME_CKM
                }
            }
        }
    }
`
