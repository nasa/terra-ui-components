export class LatLng {
    constructor(
        public lat: number,
        public lng: number,
        public alt?: number
    ) {}

    toString() {
        return `${this.lat}, ${this.lng}`
    }
}
