import { expect } from '@open-wc/testing'
import { invertObject } from '../object.js'

describe('object utilities', () => {
    it('inverts keys and values of an object', () => {
        const original = {
            'application/netcdf': 'NETCDF-4',
            'text/csv': 'CSV',
        } as const

        const inverted = invertObject(original)

        expect(inverted).to.deep.equal({
            'NETCDF-4': 'application/netcdf',
            CSV: 'text/csv',
        })
    })
})
