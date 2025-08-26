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

export const CREATE_SUBSET_JOB = gql`
    mutation CreateSubsetJob(
        $collectionConceptId: String
        $collectionEntryId: String
        $variableConceptIds: [String]
        $variableEntryIds: [String]
        $average: String
        $boundingBox: BoundingBoxInput
        $startDate: String
        $endDate: String
        $format: String
        $labels: [String]
    ) {
        createSubsetJob(
            input: {
                collectionConceptId: $collectionConceptId
                collectionEntryId: $collectionEntryId
                variableConceptIds: $variableConceptIds
                variableEntryIds: $variableEntryIds
                average: $average
                boundingBox: $boundingBox
                startDate: $startDate
                endDate: $endDate
                format: $format
                labels: $labels
            }
        ) {
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

export const CANCEL_SUBSET_JOB = gql`
    query CancelSubsetJob($jobId: String) {
        cancelSubsetJob(jobId: $jobId) {
            jobID
            status
            message
        }
    }
`
