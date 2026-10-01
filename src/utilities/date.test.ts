import { expect } from '@open-wc/testing'
import { formatDate, isDateRangeContained } from './date.js'

describe('date utilities', () => {
    it('formats date-only strings in UTC (no timezone day shift)', () => {
        const value = formatDate('2016-01-01T00:00:00.000Z')
        expect(value).to.equal('2016-01-01')
    })

    it('formats time strings in UTC', () => {
        const value = formatDate('2016-01-01T23:30:00.000Z', 'yyyy-MM-dd HH:mm')
        expect(value).to.equal('2016-01-01 23:30')
    })

    it('checks date range containment by UTC day boundaries', () => {
        const requestedStart = new Date('2016-01-01T00:00:00.000Z')
        const requestedEnd = new Date('2016-05-06T23:59:59.999Z')
        const existingStart = new Date('2016-01-01T12:00:00.000Z')
        const existingEnd = new Date('2016-05-06T00:00:00.000Z')

        expect(
            isDateRangeContained(
                requestedStart,
                requestedEnd,
                existingStart,
                existingEnd,
            ),
        ).to.equal(true)
    })
})
