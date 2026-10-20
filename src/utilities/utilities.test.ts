import { expect } from '@open-wc/testing'
import { SortOrder, getSortLabel, sortByPriority } from './sort.js'
import { invertObject } from './object.js'

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
            { key: 'application/x-netcdf4' },
            { key: 'application/x-netcdf4;profile=opendap_url' },
        ]

        const sorted = sortByPriority(
            items,
            [
                'application/x-netcdf4;profile=opendap_url',
                'application/x-netcdf4',
                'application/netcdf',
            ],
            item => item.key
        )

        expect(sorted.map(i => i.key)).to.deep.equal([
            'application/x-netcdf4;profile=opendap_url',
            'application/x-netcdf4',
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

describe('object utilities', () => {
    it('inverts keys and values of an object', () => {
        const original = {
            'application/x-netcdf4': 'X-NETCDF-4',
            'text/csv': 'CSV',
        } as const

        const inverted = invertObject(original)

        expect(inverted).to.deep.equal({
            'X-NETCDF-4': 'application/x-netcdf4',
            CSV: 'text/csv',
        })
    })
})
