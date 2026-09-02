import { formatCoord } from '../../../utilities/number.js'

export class LatLng {
    constructor(
        public lat: number,
        public lng: number,
        public alt?: number,
    ) {}

    toString() {
        return `${formatCoord(this.lat)}, ${formatCoord(this.lng)}`
    }
}
