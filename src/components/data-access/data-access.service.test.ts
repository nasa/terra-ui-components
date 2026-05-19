import { expect } from '@open-wc/testing'
import DataAccessService from './data-access.service.js'
import type { UmmG } from '../../apis/types/cmr/umm-g.js'

const toGranule = (overrides: Record<string, unknown>): UmmG =>
    overrides as unknown as UmmG

describe('DataAccessService', () => {
    let service: DataAccessService

    beforeEach(() => {
        service = new DataAccessService()
    })

    describe('Size Calculation and Formatting', () => {
        it('returns null estimated size when inputs are missing', () => {
            expect(service.getEstimatedGranuleSize()).to.equal(null)
        })

        it('calculates granule size from SizeInBytes and nested files', () => {
            const granule = toGranule({
                DataGranule: {
                    ArchiveAndDistributionInformation: [
                        {
                            Name: 'package',
                            SizeInBytes: 1024 * 1024,
                            Files: [
                                {
                                    Name: 'file-1',
                                    SizeInBytes: 1024 * 1024,
                                },
                            ],
                        },
                    ],
                },
            })

            const sizeMb = service.calculateGranuleSize(granule, 'MB')
            expect(sizeMb).to.equal(2)
        })

        it('calculates granule size using Size and SizeUnit fallback', () => {
            const granule = toGranule({
                DataGranule: {
                    ArchiveAndDistributionInformation: [
                        {
                            Name: 'archive',
                            Size: 1,
                            SizeUnit: 'GB',
                        },
                    ],
                },
            })

            const sizeMb = service.calculateGranuleSize(granule, 'MB')
            expect(sizeMb).to.equal(1024)
        })

        it('computes estimated total size from first and last granule samples', () => {
            const first = toGranule({
                DataGranule: {
                    ArchiveAndDistributionInformation: [
                        {
                            Name: 'a',
                            SizeInBytes: 10 * 1024 * 1024,
                        },
                    ],
                },
            })

            const last = toGranule({
                DataGranule: {
                    ArchiveAndDistributionInformation: [
                        {
                            Name: 'b',
                            SizeInBytes: 10 * 1024 * 1024,
                        },
                    ],
                },
            })

            const estimated = service.getEstimatedGranuleSize(first, last, 10)
            expect(estimated).to.equal('100 MB')
        })

        it('formats large sizes with promoted units', () => {
            expect(service.formatGranuleSize(500)).to.equal('500 MB')
            expect(service.formatGranuleSize(1500)).to.equal('1.46 GB')
        })
    })

    describe('Date Formatting', () => {
        it('formats available range for daily display', () => {
            const date = '2024-03-05T09:08:07.000Z'
            expect(service.formatAvailableRangeDate(date, false)).to.equal(
                '2024-03-05',
            )
        })

        it('formats available range for sub-daily display with time', () => {
            const date = '2024-03-05T09:08:07.000Z'
            expect(service.formatAvailableRangeDate(date, true)).to.equal(
                '2024-03-05 09:08:07',
            )
        })

        it('returns empty string for null/undefined dates', () => {
            expect(service.formatAvailableRangeDate(null, false)).to.equal('')
            expect(service.formatAvailableRangeDate(undefined, true)).to.equal(
                '',
            )
        })
    })
})
