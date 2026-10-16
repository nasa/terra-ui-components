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

    /**
     * Compares lat/lng against another LatLng within a small tolerance (to account for
     * floating point imprecision, e.g. after round-tripping through a URL and back).
     * `alt` is intentionally ignored since it's not populated by `HarmonyRequest.fromUrl`.
     */
    equals(other?: LatLng, epsilon = 1e-9): boolean {
        if (!other) return false
        return (
            Math.abs(this.lat - other.lat) <= epsilon &&
            Math.abs(this.lng - other.lng) <= epsilon
        )
    }
}
