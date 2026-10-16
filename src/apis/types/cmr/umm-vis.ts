// hand-written subset of UMM-Visualization (UMM-Vis) — we only model the fields
// this codebase actually reads. See the full schema at:
// https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/browse/visualization
export interface UmmVis {
    /** e.g. 'tiles' for GIBS-renderable raster imagery. */
    VisualizationType?: string
    Name?: string
    Identifier?: string
    Title?: string
    Subtitle?: string
    Description?: string
    Specification?: {
        ProductIdentification?: {
            InternalIdentifier?: string
            /**
             * The GIBS WMTS layer identifier for the standard or near-real-time
             * variant of this visualization — matches what `GibsLayer` expects
             * as its `layer` option.
             */
            StandardOrNRTExternalIdentifier?: string
            /**
             * The GIBS WMTS layer identifier GIBS/CMR consider the best
             * available variant for this collection (e.g. preferring a
             * standard/validated product over NRT when both exist). This is
             * what we treat as the "top layer" of the collection's GIBS stack.
             */
            BestAvailableExternalIdentifier?: string
            GIBSTitle?: string
        }
        ProductMetadata?: {
            InternalIdentifier?: string
            /** [west, south, east, north] in EPSG:4326. */
            NativeSpatialCoverage?: [number, number, number, number]
            SourceDatasets?: string[]
            RepresentingDatasets?: string[]
            Measurement?: string
            ColorMap?: string
        }
    }
    Generation?: {
        SourceProjection?: string
        /** The GIBS projection this layer is published in, e.g. 'EPSG:4326'. */
        OutputProjection?: string
        SourceFormat?: string
        OutputFormat?: string
    }
}
