import { expect } from '@open-wc/testing'
import { SpatialPickerService } from '../spatial-picker.service.js'
import { LatLng } from '../../map/models/LatLng.js'
import { LatLngBounds } from '../../map/models/LatLngBounds.js'

describe('SpatialPickerService', () => {
    describe('parse', () => {
        it('parses a point string into a LatLng', () => {
            const result = SpatialPickerService.parse('40.71, -74.00')
            expect(result).to.be.instanceOf(LatLng)
            expect((result as LatLng).lat).to.equal(40.71)
            expect((result as LatLng).lng).to.equal(-74.0)
        })

        it('parses a bounding box string into a LatLngBounds', () => {
            const result = SpatialPickerService.parse('-180, -90, 180, 90')
            expect(result).to.be.instanceOf(LatLngBounds)
            expect((result as LatLngBounds).getWest()).to.equal(-180)
            expect((result as LatLngBounds).getSouth()).to.equal(-90)
            expect((result as LatLngBounds).getEast()).to.equal(180)
            expect((result as LatLngBounds).getNorth()).to.equal(90)
        })

        it('throws for non-numeric values', () => {
            expect(() => SpatialPickerService.parse('abc, def')).to.throw(
                'All coordinate values must be valid numbers.'
            )
        })

        it('throws for wrong number of values', () => {
            expect(() => SpatialPickerService.parse('1, 2, 3')).to.throw(
                'Input must contain exactly 2 values (point) or 4 values (bounding box).'
            )
        })
    })

    describe('validateRanges', () => {
        it('returns null for a valid LatLng', () => {
            expect(SpatialPickerService.validateRanges(new LatLng(45, 90))).to.be.null
        })

        it('returns an error for latitude out of range', () => {
            expect(SpatialPickerService.validateRanges(new LatLng(91, 0))).to.include(
                'Latitude'
            )
        })

        it('returns an error for longitude out of range', () => {
            expect(
                SpatialPickerService.validateRanges(new LatLng(0, 181))
            ).to.include('Longitude')
        })

        it('returns null for a valid LatLngBounds', () => {
            expect(
                SpatialPickerService.validateRanges(
                    new LatLngBounds([-180, -90, 180, 90])
                )
            ).to.be.null
        })

        it('returns an error for a LatLngBounds value out of range', () => {
            expect(
                SpatialPickerService.validateRanges(
                    new LatLngBounds([-181, -90, 180, 90])
                )
            ).to.include('West')
        })
    })

    describe('validateAllowedType', () => {
        it('returns null when point is allowed and value is a LatLng', () => {
            expect(
                SpatialPickerService.validateAllowedType(new LatLng(0, 0), {
                    allowPoint: true,
                    allowBbox: false,
                })
            ).to.be.null
        })

        it('returns an error when point is not allowed', () => {
            expect(
                SpatialPickerService.validateAllowedType(new LatLng(0, 0), {
                    allowPoint: false,
                    allowBbox: true,
                })
            ).to.include('Point selection is disabled')
        })

        it('returns null when bbox is allowed and value is a LatLngBounds', () => {
            expect(
                SpatialPickerService.validateAllowedType(
                    new LatLngBounds([-180, -90, 180, 90]),
                    { allowPoint: false, allowBbox: true }
                )
            ).to.be.null
        })

        it('returns an error when bbox is not allowed', () => {
            expect(
                SpatialPickerService.validateAllowedType(
                    new LatLngBounds([-180, -90, 180, 90]),
                    { allowPoint: true, allowBbox: false }
                )
            ).to.include('Bounding box selection is disabled')
        })
    })

    describe('validateConstraints', () => {
        it('returns null when point is inside constraints', () => {
            expect(
                SpatialPickerService.validateConstraints(
                    new LatLng(45, 90),
                    '-180, -90, 180, 90'
                )
            ).to.be.null
        })

        it('returns an error when point is outside constraints', () => {
            expect(
                SpatialPickerService.validateConstraints(
                    new LatLng(45, 90),
                    '0, 0, 10, 10'
                )
            ).to.include('outside the allowed spatial extent')
        })

        it('returns null when bbox is inside constraints', () => {
            expect(
                SpatialPickerService.validateConstraints(
                    new LatLngBounds([0, 0, 5, 5]),
                    '-180, -90, 180, 90'
                )
            ).to.be.null
        })

        it('returns an error when bbox extends outside constraints', () => {
            expect(
                SpatialPickerService.validateConstraints(
                    new LatLngBounds([-10, -10, 5, 5]),
                    '0, 0, 10, 10'
                )
            ).to.include('outside the allowed spatial extent')
        })

        it('skips validation for global coverage constraints', () => {
            expect(
                SpatialPickerService.validateConstraints(
                    new LatLng(45, 90),
                    '-180, -90, 180, 90'
                )
            ).to.be.null
        })
    })

    describe('serialize', () => {
        it('serializes a LatLng to a string', () => {
            expect(
                SpatialPickerService.serialize(new LatLng(40.7128, -74.006))
            ).to.equal('40.71, -74.01')
        })

        it('serializes a LatLngBounds to a string', () => {
            expect(
                SpatialPickerService.serialize(new LatLngBounds([-180, -90, 180, 90]))
            ).to.equal('-180.00, -90.00, 180.00, 90.00')
        })
    })

    describe('validate', () => {
        const allowed = { allowPoint: true, allowBbox: true }

        it('returns ok for a valid point', () => {
            const result = SpatialPickerService.validate('45, 90', allowed)
            expect(result.ok).to.be.true
            if (result.ok) {
                expect(result.value).to.be.instanceOf(LatLng)
                expect(result.serialized).to.equal('45.00, 90.00')
            }
        })

        it('returns ok for a valid bounding box', () => {
            const result = SpatialPickerService.validate(
                '-180, -90, 180, 90',
                allowed
            )
            expect(result.ok).to.be.true
        })

        it('returns an error for invalid format', () => {
            const result = SpatialPickerService.validate('abc', allowed)
            expect(result.ok).to.be.false
            if (!result.ok) expect(result.error).to.include('Invalid format')
        })

        it('returns an error for out of range coordinates', () => {
            const result = SpatialPickerService.validate('91, 0', allowed)
            expect(result.ok).to.be.false
            if (!result.ok) expect(result.error).to.include('Latitude')
        })

        it('returns an error when type is not allowed', () => {
            const result = SpatialPickerService.validate('45, 90', {
                allowPoint: false,
                allowBbox: true,
            })
            expect(result.ok).to.be.false
            if (!result.ok)
                expect(result.error).to.include('Point selection is disabled')
        })

        it('returns an error when value is outside constraints', () => {
            const result = SpatialPickerService.validate(
                '45, 90',
                allowed,
                '0, 0, 10, 10'
            )
            expect(result.ok).to.be.false
            if (!result.ok)
                expect(result.error).to.include('outside the allowed spatial extent')
        })
    })
})
