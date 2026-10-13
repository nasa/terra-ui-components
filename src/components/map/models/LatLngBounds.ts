import { formatCoord } from '../../../utilities/number.js'
import { LatLng } from './LatLng.js'

export class LatLngBounds {
    constructor(private extent: number[]) {}

    // extent is [west, south, east, north]; LatLng is (lat, lng)
    getSouthWest(): LatLng {
        return new LatLng(this.extent[1], this.extent[0]) // (south, west)
    }

    getNorthEast(): LatLng {
        return new LatLng(this.extent[3], this.extent[2]) // (north, east)
    }

    getNorthWest(): LatLng {
        return new LatLng(this.extent[3], this.extent[0]) // (north, west)
    }

    getSouthEast(): LatLng {
        return new LatLng(this.extent[1], this.extent[2]) // (south, east)
    }

    getWest(): number {
        return this.extent[0]
    }

    getSouth(): number {
        return this.extent[1]
    }

    getEast(): number {
        return this.extent[2]
    }

    getNorth(): number {
        return this.extent[3]
    }

    toBBoxString() {
        return `${formatCoord(this.getWest())},${formatCoord(this.getSouth())},${formatCoord(this.getEast())},${formatCoord(this.getNorth())}`
    }

    toString() {
        return this.toBBoxString()
    }

    /**
     * Compares bounds against another LatLngBounds within a small tolerance (to account
     * for floating point imprecision, e.g. after round-tripping through a URL and back).
     */
    equals(other?: LatLngBounds, epsilon = 1e-9): boolean {
        if (!other) return false
        return (
            Math.abs(this.getWest() - other.getWest()) <= epsilon &&
            Math.abs(this.getSouth() - other.getSouth()) <= epsilon &&
            Math.abs(this.getEast() - other.getEast()) <= epsilon &&
            Math.abs(this.getNorth() - other.getNorth()) <= epsilon
        )
    }
}
