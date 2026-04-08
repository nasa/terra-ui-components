import { LatLng } from '../map/models/LatLng.js'
import { LatLngBounds } from '../map/models/LatLngBounds.js'

export type SpatialValue = LatLng | LatLngBounds

export type AllowedTypes = {
    allowPoint: boolean
    allowBbox: boolean
}

export type ParseResult =
    | { ok: true; value: SpatialValue; serialized: string }
    | { ok: false; error: string }

export class SpatialPickerService {
    /**
     * Parse a raw coordinate string into a typed LatLng or LatLngBounds.
     *
     * Accepted formats:
     *   "lat, lng"                   → LatLng
     *   "west, south, east, north"   → LatLngBounds
     */
    static parse(input: string): SpatialValue {
        const parts = input.split(',').map(p => p.trim())
        const nums = parts.map(Number)

        if (nums.some(isNaN)) {
            throw new Error('All coordinate values must be valid numbers.')
        }

        if (nums.length === 2) {
            return new LatLng(nums[0], nums[1])
        }

        if (nums.length === 4) {
            return new LatLngBounds(nums)
        }

        throw new Error(
            'Input must contain exactly 2 values (point) or 4 values (bounding box).'
        )
    }

    /**
     * Validate that coordinates are within their legal ranges.
     */
    static validateRanges(value: SpatialValue): string | null {
        if (value instanceof LatLng) {
            if (value.lat < -90 || value.lat > 90) {
                return `Latitude ${value.lat} is out of range (-90 to 90).`
            }
            if (value.lng < -180 || value.lng > 180) {
                return `Longitude ${value.lng} is out of range (-180 to 180).`
            }
            return null
        }

        const checks: [string, number, number, number][] = [
            ['South', value.getSouth(), -90, 90],
            ['North', value.getNorth(), -90, 90],
            ['West', value.getWest(), -180, 180],
            ['East', value.getEast(), -180, 180],
        ]

        for (const [label, v, min, max] of checks) {
            if (v < min || v > max) {
                return `${label} value ${v} is out of range (${min} to ${max}).`
            }
        }

        return null
    }

    /**
     * Validate the parsed value against which input types are permitted.
     */
    static validateAllowedType(
        value: SpatialValue,
        allowed: AllowedTypes
    ): string | null {
        const isPoint = value instanceof LatLng
        const isBbox = value instanceof LatLngBounds

        if (isPoint && !allowed.allowPoint) {
            return allowed.allowBbox
                ? 'Point selection is disabled. Enter a bounding box (west, south, east, north).'
                : 'Must be a valid bounding box (west, south, east, north).'
        }

        if (isBbox && !allowed.allowBbox) {
            return allowed.allowPoint
                ? 'Bounding box selection is disabled. Enter a point (lat, lng).'
                : 'Must be a valid point (lat, lng).'
        }

        return null
    }

    /**
     * Validate the parsed value against a spatial constraints extent.
     * Constraints are in "west, south, east, north" format.
     */
    static validateConstraints(
        value: SpatialValue,
        constraintsStr: string
    ): string | null {
        const parts = constraintsStr.split(',').map(p => parseFloat(p.trim()))
        if (parts.length !== 4 || parts.some(isNaN)) return null

        const [west, south, east, north] = parts

        // Skip check for global coverage
        if (west === -180 && south === -90 && east === 180 && north === 90)
            return null

        if (value instanceof LatLng) {
            const inside =
                value.lat >= south &&
                value.lat <= north &&
                value.lng >= west &&
                value.lng <= east
            return inside
                ? null
                : 'Selected point is outside the allowed spatial extent.'
        }

        if (value instanceof LatLngBounds) {
            const inside =
                value.getSouth() >= south &&
                value.getNorth() <= north &&
                value.getWest() >= west &&
                value.getEast() <= east
            return inside
                ? null
                : 'Selected area extends outside the allowed spatial extent.'
        }

        return null
    }

    /**
     * Serialize a parsed value back to canonical string form.
     */
    static serialize(value: SpatialValue): string {
        if (value instanceof LatLng) {
            return `${value.lat.toFixed(2)}, ${value.lng.toFixed(2)}`
        }
        // LatLngBounds: west, south, east, north
        return [value.getWest(), value.getSouth(), value.getEast(), value.getNorth()]
            .map(n => n.toFixed(2))
            .join(', ')
    }

    /**
     * Full parse + validate pipeline. Returns a discriminated union result.
     */
    static validate(
        input: string,
        allowed: AllowedTypes,
        constraintsStr?: string
    ): ParseResult {
        let value: SpatialValue

        try {
            value = this.parse(input)
        } catch (e) {
            const formatHint = this.formatHint(allowed)
            return { ok: false, error: `Invalid format. ${formatHint}` }
        }

        const rangeError = this.validateRanges(value)
        if (rangeError) return { ok: false, error: rangeError }

        const typeError = this.validateAllowedType(value, allowed)
        if (typeError) return { ok: false, error: typeError }

        if (constraintsStr) {
            const constraintError = this.validateConstraints(value, constraintsStr)
            if (constraintError) return { ok: false, error: constraintError }
        }

        return { ok: true, value, serialized: this.serialize(value) }
    }

    private static formatHint(allowed: AllowedTypes): string {
        if (allowed.allowPoint && allowed.allowBbox) {
            return 'Enter a point (lat, lng) or bounding box (west, south, east, north).'
        }
        if (allowed.allowPoint) return 'Enter a point (lat, lng).'
        if (allowed.allowBbox)
            return 'Enter a bounding box (west, south, east, north).'
        return ''
    }
}
