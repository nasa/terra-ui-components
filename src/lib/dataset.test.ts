import { calculateDataPoints, calculateDateChunks } from './dataset.js'
import { expect } from '@open-wc/testing'
import { TimeInterval } from '../types.js'

describe('calculateDataPoints', () => {
    const testCases: {
        name: string
        interval: TimeInterval
        start: Date
        end: Date
        expected: number
    }[] = [
        // Hourly
        {
            name: 'hourly - 1 day',
            interval: TimeInterval.Hourly,
            start: new Date('2020-05-01T00:00:00Z'),
            end: new Date('2020-05-01T23:59:59Z'),
            expected: 24,
        },
        {
            name: 'hourly - 2 days',
            interval: TimeInterval.Hourly,
            start: new Date('2020-05-01T00:00:00Z'),
            end: new Date('2020-05-02T23:59:59Z'),
            expected: 48,
        },

        // 3-Hourly
        {
            name: '3-hourly - 1 day',
            interval: TimeInterval.ThreeHourly,
            start: new Date('2020-05-01T00:00:00Z'),
            end: new Date('2020-05-01T23:59:59Z'),
            expected: 8,
        },
        {
            name: '3-hourly - 2 days',
            interval: TimeInterval.ThreeHourly,
            start: new Date('2020-05-01T00:00:00Z'),
            end: new Date('2020-05-02T23:59:59Z'),
            expected: 16,
        },

        // Half-Hourly
        {
            name: 'half-hourly - 2 hours',
            interval: TimeInterval.HalfHourly,
            start: new Date('2020-05-01T00:00:00Z'),
            end: new Date('2020-05-01T02:00:00Z'),
            expected: 5, // 00:00, 00:30, 01:00, 01:30, 02:00
        },
        {
            name: 'half-hourly - 24 hours',
            interval: TimeInterval.HalfHourly,
            start: new Date('2020-05-01T00:00:00Z'),
            end: new Date('2020-05-01T23:59:59Z'),
            expected: 48,
        },

        // Daily
        {
            name: 'daily - 1 day',
            interval: TimeInterval.Daily,
            start: new Date('2020-05-01'),
            end: new Date('2020-05-01'),
            expected: 1,
        },
        {
            name: 'daily - 10 days',
            interval: TimeInterval.Daily,
            start: new Date('2020-05-01'),
            end: new Date('2020-05-10'),
            expected: 10,
        },

        // Weekly
        {
            name: 'weekly - 1 week',
            interval: TimeInterval.Weekly,
            start: new Date('2020-01-01'),
            end: new Date('2020-01-07'),
            expected: 1,
        },
        {
            name: 'weekly - 3 weeks',
            interval: TimeInterval.Weekly,
            start: new Date('2020-01-01'),
            end: new Date('2020-01-21'),
            expected: 3,
        },

        // Edge cases
        {
            name: 'same start and end time',
            interval: TimeInterval.Hourly,
            start: new Date('2020-01-01T00:00:00Z'),
            end: new Date('2020-01-01T00:00:00Z'),
            expected: 1,
        },
    ]

    testCases.forEach(({ name, interval, start, end, expected }) => {
        it(`should return ${expected} data point(s) for ${name}`, () => {
            const result = calculateDataPoints(interval, start, end)
            expect(result).to.equal(expected)
        })
    })

    it('should throw an error for unsupported time interval', () => {
        expect(() => {
            calculateDataPoints(
                'unsupported' as TimeInterval,
                new Date(),
                new Date(),
            )
        }).to.throw('Unsupported time interval')
    })
})

describe('calculateDateChunks', () => {
    it('returns a single chunk when range is within the API data point limit', () => {
        const start = new Date('2024-01-01T00:00:00Z')
        const end = new Date('2024-01-15T00:00:00Z')

        const chunks = calculateDateChunks(TimeInterval.Hourly, start, end)

        expect(chunks).to.have.length(1)
        expect(chunks[0].start.toISOString()).to.equal(start.toISOString())
        expect(chunks[0].end.toISOString()).to.equal(end.toISOString())
    })

    it('splits into multiple chunks when range exceeds the API data point limit', () => {
        const start = new Date('1997-01-01T00:00:00Z')
        const end = new Date('2026-01-01T00:00:00Z')

        const chunks = calculateDateChunks(TimeInterval.Hourly, start, end)

        expect(chunks.length).to.be.greaterThan(1)
        expect(chunks[0].start.toISOString()).to.equal(start.toISOString())
        expect(chunks[chunks.length - 1].end.toISOString()).to.equal(
            end.toISOString(),
        )

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]
            const points = calculateDataPoints(
                TimeInterval.Hourly,
                chunk.start,
                chunk.end,
            )

            expect(points).to.be.at.most(200000)

            if (i > 0) {
                expect(chunk.start.getTime()).to.be.greaterThan(
                    chunks[i - 1].end.getTime(),
                )
            }
        }
    })

    it('does not create overlapping or near-zero tail chunks for long hourly ranges', () => {
        const start = new Date('1997-01-01T00:00:00.000Z')
        const end = new Date('2026-01-01T00:00:00.000Z')

        const chunks = calculateDateChunks(TimeInterval.Hourly, start, end)

        expect(chunks.length).to.be.greaterThan(1)

        for (let i = 1; i < chunks.length; i++) {
            const previousChunk = chunks[i - 1]
            const currentChunk = chunks[i]

            // Each chunk should advance by one full interval, never re-requesting
            // the prior chunk's end timestamp.
            expect(currentChunk.start.getTime()).to.equal(
                previousChunk.end.getTime() + 60 * 60 * 1000,
            )
        }

        const lastChunk = chunks[chunks.length - 1]
        const lastChunkDurationMs =
            lastChunk.end.getTime() - lastChunk.start.getTime()

        expect(lastChunkDurationMs).to.be.greaterThan(0)
    })
})
