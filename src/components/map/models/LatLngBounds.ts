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
        return `${this.getWest()},${this.getSouth()},${this.getEast()},${this.getNorth()}`
    }
}
