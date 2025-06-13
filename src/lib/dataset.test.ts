import { calculateDataPoints } from './dataset.js'
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
            calculateDataPoints('unsupported' as TimeInterval, new Date(), new Date())
        }).to.throw('Unsupported time interval')
    })
})
