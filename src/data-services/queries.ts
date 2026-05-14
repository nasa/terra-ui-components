import { gql } from '@apollo/client/core'

export const GET_SERVICE_CAPABILITIES = gql`
    query GetServiceCapabilities($collectionEntryId: String) {
        getServiceCapabilities(input: { collectionEntryId: $collectionEntryId }) {
            conceptId
            shortName
            variableSubset
            bboxSubset
            shapeSubset
            temporalSubset
            concatenate
            reproject
            capabilitiesVersion
            outputFormats
            services {
                name
                href
                capabilities {
                    output_formats
                    subsetting {
                        temporal
                        bbox
                        variable
                        shape
                    }
                }
            }
            variables {
                name
                href
                conceptId
            }
            collection {
                ShortName
                Version
                granuleCount
                EntryTitle
                SpatialExtent {
                    GranuleSpatialRepresentation
                    HorizontalSpatialDomain {
                        Geometry {
                            CoordinateSystem
                            BoundingRectangles {
                                WestBoundingCoordinate
                                NorthBoundingCoordinate
                                EastBoundingCoordinate
                                SouthBoundingCoordinate
                            }
                        }
                    }
                }
                TemporalExtents {
                    EndsAtPresentFlag
                    RangeDateTimes {
                        BeginningDateTime
                        EndingDateTime
                    }
                }
            }
        }
    }
`

export const GET_SUBSET_JOBS = gql`
    query {
        getSubsetJobs {
            count
            jobs {
                jobID
                status
                message
                progress
                request
                labels
                createdAt
            }
        }
    }
`

export const GET_SUBSET_JOB_STATUS = gql`
    query GetSubsetJobStatus($jobId: String) {
        getSubsetJobStatus(jobId: $jobId) {
            jobID
            status
            message
            progress
            createdAt
            updatedAt
            dataExpiration
            request
            numInputGranules
            originalDataSize
            outputDataSize
            dataSizePercentChange
            labels
            links {
                title
                href
                rel
                type
                bbox
                temporal {
                    start
                    end
                }
            }
            errors {
                url
                message
            }
        }
    }
`
