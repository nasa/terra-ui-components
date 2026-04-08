import { LatLngBounds } from '../LatLngBounds.js'
import { LatLng } from '../LatLng.js'
import { expect } from '@open-wc/testing'

describe('LatLngBounds', () => {
    it('should create a LatLngBounds instance', () => {
        const bounds = new LatLngBounds([0, 10, 20, 30])
        expect(bounds).to.be.instanceOf(LatLngBounds)
    })

    describe('Corner methods', () => {
        let bounds: LatLngBounds

        beforeEach(() => {
            // [west, south, east, north]
            bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
        })

        it('should return correct SouthWest corner', () => {
            const sw = bounds.getSouthWest()
            expect(sw).to.be.instanceOf(LatLng)
            expect(sw.lat).to.equal(-122.4194)
            expect(sw.lng).to.equal(37.7749)
        })

        it('should return correct NorthEast corner', () => {
            const ne = bounds.getNorthEast()
            expect(ne).to.be.instanceOf(LatLng)
            expect(ne.lat).to.equal(-122.358)
            expect(ne.lng).to.equal(37.8199)
        })

        it('should return correct NorthWest corner', () => {
            const nw = bounds.getNorthWest()
            expect(nw).to.be.instanceOf(LatLng)
            expect(nw.lat).to.equal(-122.4194)
            expect(nw.lng).to.equal(37.8199)
        })

        it('should return correct SouthEast corner', () => {
            const se = bounds.getSouthEast()
            expect(se).to.be.instanceOf(LatLng)
            expect(se.lat).to.equal(-122.358)
            expect(se.lng).to.equal(37.7749)
        })
    })

    describe('Side value methods', () => {
        let bounds: LatLngBounds

        beforeEach(() => {
            // [west, south, east, north]
            bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
        })

        it('should return correct west value', () => {
            expect(bounds.getWest()).to.equal(-122.4194)
        })

        it('should return correct south value', () => {
            expect(bounds.getSouth()).to.equal(37.7749)
        })

        it('should return correct east value', () => {
            expect(bounds.getEast()).to.equal(-122.358)
        })

        it('should return correct north value', () => {
            expect(bounds.getNorth()).to.equal(37.8199)
        })
    })

    describe('toBBoxString method', () => {
        it('should format bounding box correctly', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            expect(bounds.toBBoxString()).to.equal(
                '-122.4194,37.7749,-122.358,37.8199'
            )
        })

        it('should format bounding box with positive coordinates', () => {
            const bounds = new LatLngBounds([10.5, 20.5, 30.5, 40.5])
            expect(bounds.toBBoxString()).to.equal('10.5,20.5,30.5,40.5')
        })

        it('should format bounding box with zero values', () => {
            const bounds = new LatLngBounds([0, 0, 0, 0])
            expect(bounds.toBBoxString()).to.equal('0,0,0,0')
        })

        it('should format bounding box with decimal values', () => {
            const bounds = new LatLngBounds([
                -180.123456, -90.654321, 180.123456, 90.654321,
            ])
            expect(bounds.toBBoxString()).to.equal(
                '-180.123456,-90.654321,180.123456,90.654321'
            )
        })

        it('should format bounding box with mixed sign coordinates', () => {
            const bounds = new LatLngBounds([-10, -5, 10, 5])
            expect(bounds.toBBoxString()).to.equal('-10,-5,10,5')
        })
    })

    describe('Extreme coordinate bounds', () => {
        it('should handle global bounds', () => {
            // Entire globe
            const bounds = new LatLngBounds([-180, -90, 180, 90])
            expect(bounds.getWest()).to.equal(-180)
            expect(bounds.getSouth()).to.equal(-90)
            expect(bounds.getEast()).to.equal(180)
            expect(bounds.getNorth()).to.equal(90)
            expect(bounds.toBBoxString()).to.equal('-180,-90,180,90')
        })

        it('should handle equator and prime meridian crossing', () => {
            const bounds = new LatLngBounds([-1, -1, 1, 1])
            expect(bounds.getWest()).to.equal(-1)
            expect(bounds.getSouth()).to.equal(-1)
            expect(bounds.getEast()).to.equal(1)
            expect(bounds.getNorth()).to.equal(1)
        })

        it('should handle small area bounds', () => {
            const bounds = new LatLngBounds([0.0001, 0.0001, 0.0002, 0.0002])
            expect(bounds.getWest()).to.equal(0.0001)
            expect(bounds.getSouth()).to.equal(0.0001)
            expect(bounds.getEast()).to.equal(0.0002)
            expect(bounds.getNorth()).to.equal(0.0002)
        })
    })

    describe('Real-world bounds examples', () => {
        it('should handle San Francisco bay area bounds', () => {
            const bounds = new LatLngBounds([-122.9, 37.2, -122.0, 37.9])
            const sw = bounds.getSouthWest()
            const ne = bounds.getNorthEast()

            expect(sw.lat).to.equal(-122.9)
            expect(sw.lng).to.equal(37.2)
            expect(ne.lat).to.equal(-122.0)
            expect(ne.lng).to.equal(37.9)
        })

        it('should handle NYC area bounds', () => {
            const bounds = new LatLngBounds([-74.3, 40.5, -73.7, 40.9])
            expect(bounds.toBBoxString()).to.equal('-74.3,40.5,-73.7,40.9')
        })

        it('should handle international dateline crossing bounds', () => {
            const bounds = new LatLngBounds([170, -10, -170, 10])
            expect(bounds.getWest()).to.equal(170)
            expect(bounds.getEast()).to.equal(-170)
            expect(bounds.getSouth()).to.equal(-10)
            expect(bounds.getNorth()).to.equal(10)
        })
    })

    describe('Multiple instances independence', () => {
        it('should have independent bounds instances', () => {
            const bounds1 = new LatLngBounds([0, 0, 10, 10])
            const bounds2 = new LatLngBounds([-50, -50, 50, 50])

            expect(bounds1.getWest()).to.not.equal(bounds2.getWest())
            expect(bounds1.getNorth()).to.not.equal(bounds2.getNorth())
            expect(bounds1.toBBoxString()).to.not.equal(bounds2.toBBoxString())
        })

        it('should return new LatLng instances for each call', () => {
            const bounds = new LatLngBounds([0, 0, 10, 10])
            const sw1 = bounds.getSouthWest()
            const sw2 = bounds.getSouthWest()

            expect(sw1).to.not.equal(sw2)
            expect(sw1.lat).to.equal(sw2.lat)
            expect(sw1.lng).to.equal(sw2.lng)
        })
    })
})
