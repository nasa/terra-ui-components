export class LatLng {
    constructor(
        public lat: number,
        public lng: number,
        public alt?: number
    ) {}

    toString() {
        return [this.lat, this.lng].map(this.formatCoord).join(', ')
    }

    formatCoord(value: number) {
        return value.toString().split('.')[1]?.length > 2
            ? value.toFixed(2)
            : value.toString()
    }
}
