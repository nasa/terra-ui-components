import { expect } from '@open-wc/testing'
import { SortOrder, getSortLabel, sortByPriority } from '../sort.js'

describe('sort utilities', () => {
    it('returns sort labels for SortOrder values', () => {
        expect(getSortLabel(SortOrder.AtoZ)).to.equal('A-Z')
        expect(getSortLabel(SortOrder.ZtoA)).to.equal('Z-A')
        expect(getSortLabel('custom')).to.equal('custom')
    })

    it('sorts items by priority order while preserving relative order of remaining items', () => {
        const items = [
            { key: 'text/csv' },
            { key: 'image/tiff' },
            { key: 'application/netcdf' },
            { key: 'application/x-netcdf4;profile=opendap_url' },
        ]

        const sorted = sortByPriority(
            items,
            ['application/x-netcdf4;profile=opendap_url', 'application/netcdf'],
            item => item.key
        )

        expect(sorted.map(i => i.key)).to.deep.equal([
            'application/x-netcdf4;profile=opendap_url',
            'application/netcdf',
            'text/csv',
            'image/tiff',
        ])
        // Ensure original array was not mutated
        expect(items[0].key).to.equal('text/csv')
    })

    it('returns original array reference when priorityOrder is empty', () => {
        const items = [{ key: 'a' }, { key: 'b' }]
        const sorted = sortByPriority(items, [], i => i.key)
        expect(sorted).to.equal(items)
    })
})
