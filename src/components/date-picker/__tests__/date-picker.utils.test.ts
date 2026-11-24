import { expect } from '@open-wc/testing'
import { Temporal } from 'temporal-polyfill'
import {
    disambiguationFor,
    parseBoundInstant,
    resolveTimezone,
    toInstant,
} from '../date-picker.utils.js'

describe('date-picker Temporal utilities', () => {
    describe('resolveTimezone', () => {
        it('returns UTC when omitted or empty', () => {
            expect(resolveTimezone()).to.equal('UTC')
            expect(resolveTimezone('')).to.equal('UTC')
        })

        it('preserves valid IANA identifiers', () => {
            expect(resolveTimezone('America/New_York')).to.equal('America/New_York')
            expect(resolveTimezone('Asia/Tokyo')).to.equal('Asia/Tokyo')
        })

        it('falls back to UTC and invokes onInvalid for unrecognized timezones', () => {
            const invalidCalls: string[] = []
            expect(
                resolveTimezone('Not/AValid/Timezone', tz => invalidCalls.push(tz))
            ).to.equal('UTC')
            expect(invalidCalls).to.deep.equal(['Not/AValid/Timezone'])
        })
    })

    describe('disambiguationFor', () => {
        it('returns compatible for unambiguous wall-clock times', () => {
            const zdt = Temporal.Instant.from(
                '2024-06-15T12:00:00Z'
            ).toZonedDateTimeISO('America/Chicago')
            expect(disambiguationFor(zdt, 'America/Chicago')).to.equal('compatible')
        })

        it('distinguishes earlier and later occurrences during DST fall-back', () => {
            // America/Chicago falls back on 2026-11-01 at 02:00 CDT -> 01:00 CST
            const earlier = Temporal.Instant.from(
                '2026-11-01T06:30:00Z'
            ).toZonedDateTimeISO('America/Chicago')
            const later = Temporal.Instant.from(
                '2026-11-01T07:30:00Z'
            ).toZonedDateTimeISO('America/Chicago')

            expect(disambiguationFor(earlier, 'America/Chicago')).to.equal('earlier')
            expect(disambiguationFor(later, 'America/Chicago')).to.equal('later')
        })
    })

    describe('parseBoundInstant', () => {
        it('returns undefined for empty or date-only strings', () => {
            expect(parseBoundInstant(undefined, 'UTC')).to.be.undefined
            expect(parseBoundInstant('', 'UTC')).to.be.undefined
            expect(parseBoundInstant('2024-01-01', 'UTC')).to.be.undefined
        })

        it('parses UTC and offset ISO instants', () => {
            expect(
                parseBoundInstant(
                    '2024-01-01T12:00:00Z',
                    'America/New_York'
                )?.toString()
            ).to.equal('2024-01-01T12:00:00Z')
            expect(
                parseBoundInstant('2024-01-01T07:00:00-05:00', 'UTC')?.toString()
            ).to.equal('2024-01-01T12:00:00Z')
        })

        it('interprets naive datetimes in the configured timezone', () => {
            expect(
                parseBoundInstant(
                    '2024-01-01 07:00:00',
                    'America/New_York'
                )?.toString()
            ).to.equal('2024-01-01T12:00:00Z')
        })

        it('returns undefined for malformed bound strings', () => {
            expect(parseBoundInstant('not-a-date', 'UTC')).to.be.undefined
        })
    })

    describe('toInstant', () => {
        it('resolves date, wall-clock time, and disambiguation in the target timezone', () => {
            const date = Temporal.PlainDate.from('2026-11-01')
            const earlier = toInstant(
                { date, hour: 1, minute: 30, second: 0, disambiguation: 'earlier' },
                'America/Chicago'
            )
            const later = toInstant(
                { date, hour: 1, minute: 30, second: 0, disambiguation: 'later' },
                'America/Chicago'
            )

            expect(earlier.toString()).to.equal('2026-11-01T06:30:00Z')
            expect(later.toString()).to.equal('2026-11-01T07:30:00Z')
        })
    })
})
