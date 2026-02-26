import type { UmmG } from '../../types/cmr.js'
import type { ArchiveAndDistributionInformationType } from '../../types/cmr/umm-g.js'

export default class DataAccessService {
    constructor() {}

    getEstimatedGranuleSize(
        firstGranule?: UmmG,
        lastGranule?: UmmG,
        totalGranules?: number
    ) {
        if (!firstGranule || !lastGranule || !totalGranules) {
            return null
        }

        return this.formatGranuleSize(
            this.calculateMeanGranuleSize([firstGranule, lastGranule]) * totalGranules
        )
    }

    granuleMinDate(granule?: UmmG) {
        if (!granule) {
            return null
        }

        return granule.TemporalExtent?.RangeDateTime?.BeginningDateTime ?? null
    }

    granuleMaxDate(granule?: UmmG) {
        if (!granule) {
            return null
        }

        return granule.TemporalExtent?.RangeDateTime?.EndingDateTime ?? null
    }

    isSubDaily(granule?: UmmG) {
        if (!granule) {
            return false
        }

        const timeStart = this.granuleMinDate(granule)
        const timeEnd = this.granuleMaxDate(granule)

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

    calculateGranuleSize(granule: UmmG, unit: 'MB' | 'GB' | 'TB' | 'PB') {
        const archiveInfo = granule.DataGranule?.ArchiveAndDistributionInformation

        if (!archiveInfo || !Array.isArray(archiveInfo)) {
            return 0
        }

        const BYTES_PER_UNIT = {
            KB: 1024,
            MB: 1024 * 1024,
            GB: 1024 * 1024 * 1024,
            TB: 1024 * 1024 * 1024 * 1024,
            PB: 1024 * 1024 * 1024 * 1024 * 1024,
            NA: 0,
        }

        let totalBytes = 0

        function processItem(item: ArchiveAndDistributionInformationType) {
            // Prioritize SizeInBytes if available
            // this is recommended by the CMR team
            if (item.SizeInBytes != null) {
                return item.SizeInBytes
            }

            // Otherwise use Size with SizeUnit
            if (item.Size != null && item.SizeUnit) {
                const conversionFactor =
                    BYTES_PER_UNIT[item.SizeUnit as keyof typeof BYTES_PER_UNIT]
                if (conversionFactor) {
                    return item.Size * conversionFactor
                }
            }

            return 0
        }

        function processFilePackageOrFile(
            item: ArchiveAndDistributionInformationType
        ) {
            let itemBytes = processItem(item)

            if (item.Files && Array.isArray(item.Files)) {
                for (const file of item.Files) {
                    itemBytes += processItem(file)
                }
            }

            return itemBytes
        }

        for (const item of archiveInfo) {
            totalBytes += processFilePackageOrFile(item)
        }

        return totalBytes / BYTES_PER_UNIT[unit]
    }

    formatGranuleSize(sizeInMB: number): string {
        const UNITS = ['MB', 'GB', 'TB', 'PB'] as const
        const THRESHOLD = 1000

        let size = sizeInMB
        let unitIndex = 0

        while (size >= THRESHOLD && unitIndex < UNITS.length - 1) {
            size /= 1024
            unitIndex++
        }

        const decimals = size >= 100 ? 0 : size >= 10 ? 1 : 2

        return `${size.toFixed(decimals)} ${UNITS[unitIndex]}`
    }

    calculateMeanGranuleSize(granules: UmmG[]) {
        const sizes = granules.map(granule =>
            this.calculateGranuleSize(granule, 'MB')
        )
        return sizes.reduce((a, b) => a + b, 0) / sizes.length
    }

    formatAvailableRangeDate(
        dateStr: Date | string | null,
        isSubDaily: boolean
    ): string {
        if (!dateStr) return ''

        const date = new Date(dateStr)
        const year = date.getUTCFullYear()
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const day = String(date.getUTCDate()).padStart(2, '0')

        if (isSubDaily) {
            const hours = String(date.getUTCHours()).padStart(2, '0')
            const minutes = String(date.getUTCMinutes()).padStart(2, '0')
            const seconds = String(date.getUTCSeconds()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }

        return `${year}-${month}-${day}`
    }
}
