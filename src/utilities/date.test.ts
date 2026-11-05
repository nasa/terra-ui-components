import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import {
    formatDate,
    getDisplayTimeComponents,
    getTimezoneInfo,
    getTimezoneOffsetMinutes,
    getUtcTimeFromDisplay,
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

    describe('timezone utilities', () => {
        describe('getTimezoneOffsetMinutes', () => {
            it('returns 0 when timezone is undefined or empty', () => {
                expect(getTimezoneOffsetMinutes()).to.equal(0)
                expect(getTimezoneOffsetMinutes('')).to.equal(0)
            })

            it('returns 0 for UTC', () => {
                expect(getTimezoneOffsetMinutes('UTC')).to.equal(0)
            })

            it('returns 0 for invalid timezone strings without throwing', () => {
                expect(getTimezoneOffsetMinutes('Invalid/Timezone')).to.equal(0)
            })

            it('calculates correct offset for winter (EST = -300)', () => {
                const winter = new Date('2024-01-15T12:00:00Z')
                expect(getTimezoneOffsetMinutes('America/New_York', winter)).to.equal(
                    -300
                )
            })

            it('calculates correct offset for summer (EDT = -240)', () => {
                const summer = new Date('2024-07-15T12:00:00Z')
                expect(getTimezoneOffsetMinutes('America/New_York', summer)).to.equal(
                    -240
                )
            })

            it('calculates positive offset for half-hour timezones (Asia/Kolkata = +330)', () => {
                const date = new Date('2024-01-15T12:00:00Z')
                expect(getTimezoneOffsetMinutes('Asia/Kolkata', date)).to.equal(330)
            })
        })

        describe('getTimezoneInfo', () => {
            it('defaults to UTC when timezone is undefined or empty', () => {
                const info = getTimezoneInfo()
                expect(info.short).to.equal('UTC')
                expect(info.full).to.equal('Coordinated Universal Time (UTC)')
            })

            it('returns short and full info for America/New_York in summer', () => {
                const summer = new Date('2024-07-15T12:00:00Z')
                const info = getTimezoneInfo('America/New_York', summer)
                expect(info.short).to.equal('EDT')
                expect(info.full).to.equal('America/New_York (Eastern Daylight Time)')
            })

            it('returns short and full info for America/New_York in winter', () => {
                const winter = new Date('2024-01-15T12:00:00Z')
                const info = getTimezoneInfo('America/New_York', winter)
                expect(info.short).to.equal('EST')
                expect(info.full).to.equal('America/New_York (Eastern Standard Time)')
            })

            it('handles invalid timezone gracefully without throwing', () => {
                const info = getTimezoneInfo('Invalid/Timezone')
                expect(info.short).to.equal('Invalid/Timezone')
                expect(info.full).to.equal('Invalid/Timezone')
            })
        })

        describe('getDisplayTimeComponents and getUtcTimeFromDisplay', () => {
            it('returns unchanged time components when timezone is not set', () => {
                const display = getDisplayTimeComponents(15, 30, 45, null)
                expect(display).to.deep.equal({ hour: 15, minute: 30, second: 45 })

                const utc = getUtcTimeFromDisplay(15, 30, 45, null)
                expect(utc).to.deep.equal({ hour: 15, minute: 30, second: 45 })
            })

            it('shifts UTC time components to target timezone', () => {
                const summer = new Date('2024-07-15T12:00:00Z')
                // UTC 15:30 in EDT (-4h) = 11:30
                const display = getDisplayTimeComponents(
                    15,
                    30,
                    0,
                    summer,
                    'America/New_York'
                )
                expect(display).to.deep.equal({ hour: 11, minute: 30, second: 0 })
            })

            it('roundtrips UTC -> display -> UTC accurately', () => {
                const summer = new Date('2024-07-15T12:00:00Z')
                const utcH = 22
                const utcM = 15
                const utcS = 30
                const display = getDisplayTimeComponents(
                    utcH,
                    utcM,
                    utcS,
                    summer,
                    'America/New_York'
                )
                const restored = getUtcTimeFromDisplay(
                    display.hour,
                    display.minute,
                    display.second,
                    summer,
                    'America/New_York'
                )
                expect(restored).to.deep.equal({
                    hour: utcH,
                    minute: utcM,
                    second: utcS,
                })
            })
        })

        describe('to12Hour and to24Hour', () => {
            it('converts midnight (0) to 12 AM', () => {
                expect(to12Hour(0)).to.deep.equal({ hour: 12, period: 'AM' })
                expect(to24Hour(12, 'AM')).to.equal(0)
            })

            it('converts noon (12) to 12 PM', () => {
                expect(to12Hour(12)).to.deep.equal({ hour: 12, period: 'PM' })
                expect(to24Hour(12, 'PM')).to.equal(12)
            })

            it('converts afternoon (15) to 3 PM', () => {
                expect(to12Hour(15)).to.deep.equal({ hour: 3, period: 'PM' })
                expect(to24Hour(3, 'PM')).to.equal(15)
            })

            it('converts morning (9) to 9 AM', () => {
                expect(to12Hour(9)).to.deep.equal({ hour: 9, period: 'AM' })
                expect(to24Hour(9, 'AM')).to.equal(9)
            })
        })
    })
})
