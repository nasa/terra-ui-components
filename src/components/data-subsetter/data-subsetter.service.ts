import nasaCmrApi from '../../apis/nasa-cmr.api.js'
import type nasaHarmonyApi from '../../apis/nasa-harmony.api.js'
import type {
    ConfiguredSubsetOptions,
    EstimatedJobSize,
    OutputFormat,
    SelectedSubsetOptions,
    SpatialSubsetting,
    TemporalSubsetting,
} from './types.js'

type HarmonyCapabilities = Awaited<ReturnType<
    typeof nasaHarmonyApi.getCollectionCapabilities
> | null>

type SampleGranule = Awaited<ReturnType<typeof nasaCmrApi.searchGranules> | null>

type Collection = Awaited<ReturnType<typeof nasaCmrApi.getCollection> | null>
export default class DataSubsetterService {
    getConfiguredSubsetOptions(
        selectedSubsetOptions: SelectedSubsetOptions,
        firstGranule?: SampleGranule,
        lastGranule?: SampleGranule,
        harmonyCapabilities?: HarmonyCapabilities,
        collection?: Collection
    ): ConfiguredSubsetOptions {
        return {
            hasGranules: this.#hasGranules(firstGranule),
            estimatedJobSize: this.#estimateJobSize(
                selectedSubsetOptions,
                firstGranule,
                lastGranule,
                collection
            ),
            outputFormats: this.getOutputFormatOptions(harmonyCapabilities),
            temporalSubsetting: this.#getTemporalSubsettingConfig(
                selectedSubsetOptions,
                firstGranule,
                lastGranule,
                harmonyCapabilities
            ),
            spatialSubsetting: this.#getSpatialSubsettingConfig(
                selectedSubsetOptions,
                harmonyCapabilities,
                collection
            ),
            variableSubsetting: {
                enabled: true,
                multipleVariablesAllowed: true,
            },
        }
    }

    getOutputFormatOptions(harmonyCapabilities?: HarmonyCapabilities) {
        const outputFormats: OutputFormat[] = []
        const hasNonGiovanniServices =
            this.#hasNonGiovanniServices(harmonyCapabilities)
        const hasGiovanni = this.#hasGiovanni(harmonyCapabilities)

        // If Giovanni is the only service, use only Giovanni formats
        if (hasGiovanni && !hasNonGiovanniServices) {
            this.#addGiovanniFormats(outputFormats)
            return outputFormats
        }

        // Get formats only from non-Giovanni services
        const nonGiovanniFormats = this.#getNonGiovanniFormats(harmonyCapabilities)

        // Process non-Giovanni output formats
        nonGiovanniFormats.forEach(format => {
            let label = format
            let description = `Download data in ${format} format`

            switch (format) {
                case 'application/x-hdf':
                case 'application/octet-stream':
                    label = 'HDF-EOS5'
                    description = 'Download data in HDF-EOS5 format'
                    break

                case 'application/x-netcdf4':
                case 'application/netcdf':
                    label = 'NetCDF'
                    description = 'Download data in NetCDF format'
                    break

                case 'text/csv':
                    label = 'CSV'
                    description = 'Download data in CSV format'
                    break

                case 'image/tiff':
                case 'image/tif':
                    label = 'TIFF'
                    description = 'Download data in TIFF format'
                    break
            }

            outputFormats.push({
                key: format,
                label,
                description,
            })
        })

        // Add Giovanni-specific formats if Giovanni is present with other services
        if (hasGiovanni && hasNonGiovanniServices) {
            this.#addGiovanniFormats(outputFormats)
        }

        return outputFormats
    }

    #hasGiovanni(harmonyCapabilities?: HarmonyCapabilities): boolean {
        return (
            harmonyCapabilities?.services?.some(service =>
                service.name.toLowerCase().includes('giovanni')
            ) ?? false
        )
    }

    #hasNonGiovanniServices(harmonyCapabilities?: HarmonyCapabilities): boolean {
        return (
            harmonyCapabilities?.services?.some(
                service => !service.name.toLowerCase().includes('giovanni')
            ) ?? false
        )
    }

    #getNonGiovanniFormats(harmonyCapabilities?: HarmonyCapabilities): string[] {
        if (!harmonyCapabilities?.services) {
            return []
        }

        const nonGiovanniServices = harmonyCapabilities.services.filter(
            service => !service.name.toLowerCase().includes('giovanni')
        )

        // Collect all unique output formats from non-Giovanni services
        const formats = new Set<string>()
        nonGiovanniServices.forEach(service => {
            service.capabilities.output_formats?.forEach(format => {
                formats.add(format)
            })
        })

        const formatArray = Array.from(formats)

        // If both application/netcdf and application/x-netcdf4 are present,
        // only use application/x-netcdf4
        if (
            formatArray.includes('application/netcdf') &&
            formatArray.includes('application/x-netcdf4')
        ) {
            return formatArray.filter(format => format !== 'application/netcdf')
        }

        return formatArray
    }

    #addGiovanniFormats(outputFormats: OutputFormat[]): void {
        const giovanniFormats: OutputFormat[] = [
            {
                key: 'text/csv',
                label: 'Time Series Plot (CSV)',
                description: 'Single variable plotted over time',
            },
            {
                key: 'image/tiff',
                label: 'Time Averaged Map (TIFF)',
                description: 'Time averaged representation as map',
            },
            {
                key: 'text/csv',
                label: 'Area Averaged Time Series (CSV)',
                description: 'Area averaged data over time',
            },
        ]

        // Add Giovanni formats that aren't already present, avoiding duplicates
        giovanniFormats.forEach(format => {
            if (!outputFormats.some(f => f.label === format.label)) {
                outputFormats.push(format)
            }
        })
    }

    #getTemporalSubsettingConfig(
        selectedSubsetOptions: SelectedSubsetOptions,
        firstGranule?: SampleGranule,
        lastGranule?: SampleGranule,
        harmonyCapabilities?: HarmonyCapabilities
    ): TemporalSubsetting {
        return {
            enabled: this.#isTemporalSubsettingEnabled(
                selectedSubsetOptions,
                harmonyCapabilities
            ),
            timePickerEnabled: this.#isSubDailyGranule(firstGranule),
            ...this.#granuleMinMaxDates(firstGranule, lastGranule),
        }
    }

    #isTemporalSubsettingEnabled(
        selectedSubsetOptions: SelectedSubsetOptions,
        harmonyCapabilities?: HarmonyCapabilities
    ): boolean {
        if (!harmonyCapabilities?.temporalSubset) {
            return false
        }

        const selectedFormat = selectedSubsetOptions?.format

        // if user has made no selections yet, temporal subsetting should be enabled if the collection allows it
        if (!selectedFormat) {
            return true
        }

        // Check if the selected format is supported by any service that allows temporal subsetting
        return (
            harmonyCapabilities.services?.some(
                service =>
                    service.capabilities.output_formats?.includes(selectedFormat) &&
                    service.capabilities.subsetting?.temporal
            ) ?? false
        )
    }

    #getSpatialSubsettingConfig(
        selectedSubsetOptions: SelectedSubsetOptions,
        harmonyCapabilities?: HarmonyCapabilities,
        collection?: Collection
    ): SpatialSubsetting {
        const hasBbbox = this.#isBbboxSubsettingEnabled(
            selectedSubsetOptions,
            harmonyCapabilities
        )
        const hasShape = this.#isShapeSubsettingEnabled(
            selectedSubsetOptions,
            harmonyCapabilities
        )

        return {
            enabled: hasBbbox || hasShape,
            bboxSubset: hasBbbox,
            shapeSubset: hasShape,
            spatialConstraints: this.#getSpatialConstraints(collection),
        }
    }

    #getSpatialConstraints(collection?: Collection) {
        const boundingRects =
            collection?.umm?.SpatialExtent?.HorizontalSpatialDomain?.Geometry
                ?.BoundingRectangles
        const coordinates = {
            westBoundingCoordinate:
                boundingRects?.[0]?.WestBoundingCoordinate ?? -180,
            southBoundingCoordinate:
                boundingRects?.[0]?.SouthBoundingCoordinate ?? -90,
            eastBoundingCoordinate: boundingRects?.[0]?.EastBoundingCoordinate ?? 180,
            northBoundingCoordinate:
                boundingRects?.[0]?.NorthBoundingCoordinate ?? 90,
        }

        return {
            coordinates,
            coordinatesStr: `${coordinates.westBoundingCoordinate}, ${coordinates.southBoundingCoordinate}, ${coordinates.eastBoundingCoordinate}, ${coordinates.northBoundingCoordinate}`,
        }
    }

    #isBbboxSubsettingEnabled(
        selectedSubsetOptions: SelectedSubsetOptions,
        harmonyCapabilities?: HarmonyCapabilities
    ): boolean {
        if (!harmonyCapabilities?.bboxSubset) {
            return false
        }

        const selectedFormat = selectedSubsetOptions?.format

        if (!selectedFormat) {
            return true
        }

        return (
            harmonyCapabilities?.services?.some(
                service =>
                    service.capabilities.output_formats?.includes(selectedFormat) &&
                    service.capabilities.subsetting?.bbox
            ) ?? false
        )
    }

    #isShapeSubsettingEnabled(
        selectedSubsetOptions: SelectedSubsetOptions,
        harmonyCapabilities?: HarmonyCapabilities
    ): boolean {
        if (!harmonyCapabilities?.shapeSubset) {
            return false
        }

        const selectedFormat = selectedSubsetOptions?.format

        if (!selectedFormat) {
            return true
        }

        return (
            harmonyCapabilities?.services?.some(
                service =>
                    service.capabilities.output_formats?.includes(selectedFormat) &&
                    service.capabilities.subsetting?.shape
            ) ?? false
        )
    }

    #isSubDailyGranule(firstGranule?: SampleGranule) {
        const granule = this.#getGranuleItem(firstGranule)

        if (!granule) {
            return false
        }

        const timeStart =
            granule.umm?.TemporalExtent?.RangeDateTime?.BeginningDateTime
        const timeEnd = granule.umm?.TemporalExtent?.RangeDateTime?.EndingDateTime

        if (!timeStart || !timeEnd) {
            return false
        }

        // Parse the dates and calculate the difference in hours
        const start = new Date(timeStart)
        const end = new Date(timeEnd)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        // If the temporal extent is less than 24 hours, it's sub-daily
        return diffHours < 24
    }

    #granuleMinMaxDates(firstGranule?: SampleGranule, lastGranule?: SampleGranule) {
        const firstGranuleItem = this.#getGranuleItem(firstGranule)
        const lastGranuleItem = this.#getGranuleItem(lastGranule)

        const granuleMinDate =
            firstGranuleItem?.umm?.TemporalExtent?.RangeDateTime?.BeginningDateTime?.toString()
        const granuleMaxDate =
            lastGranuleItem?.umm?.TemporalExtent?.RangeDateTime?.EndingDateTime?.toString()

        return { granuleMinDate, granuleMaxDate }
    }

    #hasGranules(firstGranule?: SampleGranule) {
        return (firstGranule?.hits ?? firstGranule?.items?.length ?? 0) > 0
    }

    #getGranuleItem(granule?: SampleGranule) {
        if (!granule) {
            return undefined
        }

        return granule?.items?.[0] ?? granule
    }

    #estimateJobSize(
        selectedSubsetOptions: SelectedSubsetOptions,
        firstGranule?: SampleGranule,
        lastGranule?: SampleGranule,
        collection?: Collection
    ): EstimatedJobSize | null {
        if (!collection) {
            return null
        }

        const selectedStartDate = selectedSubsetOptions.dateRange?.startDate
        const selectedEndDate = selectedSubsetOptions.dateRange?.endDate
        const { granuleMinDate, granuleMaxDate } = this.#granuleMinMaxDates(
            firstGranule,
            lastGranule
        )
        const collectionDateRange = this.getCollectionDateRange(collection)

        const startDate =
            selectedStartDate && selectedEndDate
                ? selectedStartDate
                : granuleMinDate ?? collectionDateRange.startDate
        const endDate =
            selectedStartDate && selectedEndDate
                ? selectedEndDate
                : granuleMaxDate ?? collectionDateRange.endDate

        if (!startDate || !endDate) {
            return null
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        const days =
            Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

        let links = collection?.meta['granule-count'] ?? 0

        const availableStart = granuleMinDate
            ? granuleMinDate.slice(0, 10)
            : collectionDateRange.startDate
        const availableEnd = granuleMaxDate
            ? granuleMaxDate.slice(0, 10)
            : collectionDateRange.endDate

        console.log(
            'making an estimate ',
            collection,
            availableStart,
            availableEnd,
            links,
            days
        )

        if (availableStart && availableEnd) {
            const availableDaysInCollection =
                Math.floor(
                    (new Date(availableEnd).getTime() -
                        new Date(availableStart).getTime()) /
                        (1000 * 60 * 60 * 24)
                ) + 1

            console.log('available days ', availableDaysInCollection)

            if (availableDaysInCollection > 0) {
                const granulesPerDay = links / availableDaysInCollection
                links = Math.ceil(days * granulesPerDay)

                console.log('set links to ', links, granulesPerDay)
            }
        }

        return { days, links }

        /*
        const collection = this.collectionQuery.result?.data
        if (!collection) return

        const range = this.#getCollectionDateRange()
        let startDate: string | null
        let endDate: string | null
        let links = collection?.meta['granule-count'] ?? 0

        if (this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
            // Use the user selected date range if available
            startDate = this.selectedDateRange.startDate
            endDate = this.selectedDateRange.endDate
        } else {
            // fallback to the collection's full date range
            startDate = this.granuleMinDate ?? range.startDate
            endDate = this.granuleMaxDate ?? range.endDate
        }

        if (!startDate || !endDate) return

        const start = new Date(startDate)
        const end = new Date(endDate)
        const days =
            Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

        if (range.startDate && range.endDate) {
            const availableDaysInCollection =
                Math.floor(
                    (new Date(range.endDate).getTime() -
                        new Date(range.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                ) + 1
            const granulesPerDay = links / availableDaysInCollection

            links = Math.ceil(days * granulesPerDay)
        }

        return { days, links }*/
    }

    getCollectionDateRange(collection?: Collection) {
        const temporalExtents = collection?.umm?.TemporalExtents

        if (!temporalExtents || !temporalExtents.length) {
            return {
                startDate: null,
                endDate: null,
            }
        }

        let minStart: Date | null = null
        let maxEnd: Date | null = null
        const today = new Date()

        for (const temporal of temporalExtents) {
            for (const range of temporal.RangeDateTimes || []) {
                const start = new Date(range.BeginningDateTime)
                const end =
                    temporal.EndsAtPresentFlag || !range.EndingDateTime
                        ? today
                        : new Date(range.EndingDateTime)

                if (!minStart || start < minStart) {
                    minStart = start
                }

                if (!maxEnd || end > maxEnd) {
                    maxEnd = end
                }
            }
        }

        return {
            startDate: minStart ? minStart.toISOString().slice(0, 10) : null,
            endDate: maxEnd ? maxEnd.toISOString().slice(0, 10) : null,
        }
    }

    getEffectiveDateRange(
        firstGranule?: SampleGranule,
        lastGranule?: SampleGranule,
        collection?: Collection
    ) {
        // Prefer granule sampling data for accurate date ranges
        const { granuleMinDate, granuleMaxDate } = this.#granuleMinMaxDates(
            firstGranule,
            lastGranule
        )

        if (granuleMinDate && granuleMaxDate) {
            return {
                startDate: granuleMinDate.slice(0, 10),
                endDate: granuleMaxDate.slice(0, 10),
            }
        }

        // Fallback to collection metadata
        return this.getCollectionDateRange(collection)
    }
}
