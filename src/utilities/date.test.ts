import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import {
    formatDate,
    getYesterdayIsoDate,
    isDateRangeContained,
    to12Hour,
    to24Hour,
} from './date.js'

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
                existingEnd
            )
        ).to.equal(true)
    })

    it('returns yesterday in YYYY-MM-DD format', () => {
        const clock = sinon.useFakeTimers(
            new Date('2026-06-15T12:00:00.000Z').getTime()
        )
        try {
            expect(getYesterdayIsoDate()).to.equal('2026-06-14')
        } finally {
            clock.restore()
        }
    })

    describe('to12Hour & to24Hour', () => {
        it('to12Hour converts midnight (0) to 12 AM', () => {
            const result = to12Hour(0)
            expect(result.hour).to.equal(12)
            expect(result.period).to.equal('AM')
        })

        it('to12Hour converts morning hours (1–11) to AM', () => {
            expect(to12Hour(9)).to.deep.equal({ hour: 9, period: 'AM' })
            expect(to12Hour(11)).to.deep.equal({ hour: 11, period: 'AM' })
        })

        it('to12Hour converts noon (12) to 12 PM', () => {
            const result = to12Hour(12)
            expect(result.hour).to.equal(12)
            expect(result.period).to.equal('PM')
        })

        it('to12Hour converts afternoon/evening hours (13–23) to PM', () => {
            expect(to12Hour(13)).to.deep.equal({ hour: 1, period: 'PM' })
            expect(to12Hour(15)).to.deep.equal({ hour: 3, period: 'PM' })
            expect(to12Hour(23)).to.deep.equal({ hour: 11, period: 'PM' })
        })

        it('to24Hour converts 12 AM to 0', () => {
            expect(to24Hour(12, 'AM')).to.equal(0)
        })

        it('to24Hour preserves morning AM hours (1–11)', () => {
            expect(to24Hour(1, 'AM')).to.equal(1)
            expect(to24Hour(9, 'AM')).to.equal(9)
            expect(to24Hour(11, 'AM')).to.equal(11)
        })

        it('to24Hour converts 12 PM to 12', () => {
            expect(to24Hour(12, 'PM')).to.equal(12)
        })

        it('to24Hour adds 12 for afternoon PM hours (1–11)', () => {
            expect(to24Hour(1, 'PM')).to.equal(13)
            expect(to24Hour(3, 'PM')).to.equal(15)
            expect(to24Hour(11, 'PM')).to.equal(23)
        })
    })
})
