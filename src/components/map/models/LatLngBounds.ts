import { LatLng } from './LatLng.js'

export class LatLngBounds {
    constructor(private extent: number[]) {}

    //[west, south, east, north]

    getSouthWest(): LatLng {
        return new LatLng(this.extent[0], this.extent[1])
    }

    getNorthEast(): LatLng {
        return new LatLng(this.extent[2], this.extent[3])
    }

    getNorthWest(): LatLng {
        return new LatLng(this.extent[0], this.extent[3])
    }

    getSouthEast(): LatLng {
        return new LatLng(this.extent[2], this.extent[1])
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
