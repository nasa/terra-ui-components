import type {
    ArchiveAndDistributionInformation,
    CmrGranule,
    CmrGranuleDataGranule,
    HostWithMaybeProperties,
} from './types.js'

export function getGranuleUrl(granule: CmrGranule) {
    const getDataUrl = granule.relatedUrls.find(url => url.type === 'GET DATA')
    return getDataUrl?.url
}

export function getVariableEntryId(host: HostWithMaybeProperties) {
    if (!host.variableEntryId && !(host.collection && host.variable)) {
        return
    }

    return host.variableEntryId ?? `${host.collection}_${host.variable}`
}

export function formatGranuleSize(sizeInMB: number): string {
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

export function calculateMeanGranuleSize(
    granules: { dataGranule: CmrGranuleDataGranule }[]
) {
    const sizes = granules.map(granule => calculateGranuleSize(granule, 'MB'))
    return sizes.reduce((a, b) => a + b, 0) / sizes.length
}

export function calculateGranuleSize(
    granule: { dataGranule: CmrGranuleDataGranule },
    unit: 'MB' | 'GB' | 'TB' | 'PB'
) {
    const archiveInfo = granule.dataGranule.archiveAndDistributionInformation

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

    function processItem(item: ArchiveAndDistributionInformation) {
        // Prioritize SizeInBytes if available
        // this is recommended by the CMR team
        if (item.sizeInBytes != null) {
            return item.sizeInBytes
        }

        // Otherwise use Size with SizeUnit
        if (item.size != null && item.sizeUnit) {
            const conversionFactor =
                BYTES_PER_UNIT[item.sizeUnit as keyof typeof BYTES_PER_UNIT]
            if (conversionFactor) {
                return item.size * conversionFactor
            }
        }

        return 0
    }

    function processFilePackageOrFile(item: ArchiveAndDistributionInformation) {
        let itemBytes = processItem(item)

        if (item.files && Array.isArray(item.files)) {
            for (const file of item.files) {
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
