import { LatLng } from '../LatLng.js'
import { expect } from '@open-wc/testing'

describe('LatLng', () => {
    it('should create a LatLng instance with lat and lng', () => {
        const latLng = new LatLng(40.7128, -74.006)
        expect(latLng.lat).to.equal(40.7128)
        expect(latLng.lng).to.equal(-74.006)
    })

    it('should create a LatLng instance with lat, lng, and alt', () => {
        const latLng = new LatLng(40.7128, -74.006, 10)
        expect(latLng.lat).to.equal(40.7128)
        expect(latLng.lng).to.equal(-74.006)
        expect(latLng.alt).to.equal(10)
    })

    it('should create a LatLng instance without alt', () => {
        const latLng = new LatLng(40.7128, -74.006)
        expect(latLng.alt).to.be.undefined
    })

    it('should handle negative coordinates', () => {
        const latLng = new LatLng(-33.8688, 151.2093)
        expect(latLng.lat).to.equal(-33.8688)
        expect(latLng.lng).to.equal(151.2093)
    })

    it('should handle zero coordinates', () => {
        const latLng = new LatLng(0, 0)
        expect(latLng.lat).to.equal(0)
        expect(latLng.lng).to.equal(0)
    })

    it('should handle decimal coordinates', () => {
        const latLng = new LatLng(40.712776, -74.005974)
        expect(latLng.lat).to.equal(40.712776)
        expect(latLng.lng).to.equal(-74.005974)
    })

    it('should handle extreme lat/lng values', () => {
        const northPole = new LatLng(90, 0)
        expect(northPole.lat).to.equal(90)
        expect(northPole.lng).to.equal(0)

        const southPole = new LatLng(-90, 0)
        expect(southPole.lat).to.equal(-90)
        expect(southPole.lng).to.equal(0)

        const dateLineBefore = new LatLng(0, -180)
        expect(dateLineBefore.lng).to.equal(-180)

        const dateLineAfter = new LatLng(0, 180)
        expect(dateLineAfter.lng).to.equal(180)
    })

    it('should format toString() correctly', () => {
        const latLng = new LatLng(40.7128, -74.006)
        expect(latLng.toString()).to.equal('40.7128, -74.006')
    })

    it('should format toString() with negative coordinates', () => {
        const latLng = new LatLng(-33.8688, 151.2093)
        expect(latLng.toString()).to.equal('-33.8688, 151.2093')
    })

    it('should format toString() with zero coordinates', () => {
        const latLng = new LatLng(0, 0)
        expect(latLng.toString()).to.equal('0, 0')
    })

    it('should not include altitude in toString()', () => {
        const latLng = new LatLng(40.7128, -74.006, 10)
        expect(latLng.toString()).to.equal('40.7128, -74.006')
    })

    it('should have independent instances', () => {
        const latLng1 = new LatLng(40.7128, -74.006)
        const latLng2 = new LatLng(51.5074, -0.1278)

        expect(latLng1.lat).to.not.equal(latLng2.lat)
        expect(latLng1.lng).to.not.equal(latLng2.lng)
        expect(latLng1.toString()).to.not.equal(latLng2.toString())
    })

    it('should handle very large altitude values', () => {
        const latLng = new LatLng(40.7128, -74.006, 400000)
        expect(latLng.alt).to.equal(400000)
    })

    it('should handle negative altitude values', () => {
        const latLng = new LatLng(40.7128, -74.006, -100)
        expect(latLng.alt).to.equal(-100)
    })
})
