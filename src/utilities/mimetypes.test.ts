import { expect } from '@open-wc/testing'
import { getFriendlyNameForMimeType } from './mimetypes.js'

describe('mimetypes', () => {
    it('should return HDF-EOS5 for application/x-hdf files', () => {
        expect(getFriendlyNameForMimeType('application/x-hdf')).to.equal('HDF-EOS5')
    })

    it('should return HDF-EOS5 for application/octet-stream files', () => {
        expect(getFriendlyNameForMimeType('application/octet-stream')).to.equal(
            'HDF-EOS5'
        )
    })

    it('should return NetCDF for application/x-netcdf4 files', () => {
        expect(getFriendlyNameForMimeType('application/x-netcdf4')).to.equal('NetCDF')
    })

    it('should return NetCDF for application/netcdf files', () => {
        expect(getFriendlyNameForMimeType('application/netcdf')).to.equal('NetCDF')
    })

    it('should return CSV for text/csv files', () => {
        expect(getFriendlyNameForMimeType('text/csv')).to.equal('CSV')
    })

    it('should return "Area-averaged time series (CSV)" for text/csv files when Giovanni is the available service', () => {
        expect(getFriendlyNameForMimeType('text/csv', true)).to.equal(
            'Area-averaged time series (CSV)'
        )
    })

    it('should return TIFF for image/tiff files', () => {
        expect(getFriendlyNameForMimeType('image/tiff')).to.equal('TIFF')
    })

    it('should return "Time-averaged map (GeoTIFF)" for image/tiff files when Giovanni is the available service', () => {
        expect(getFriendlyNameForMimeType('image/tiff', true)).to.equal(
            'Time-averaged map (GeoTIFF)'
        )
    })

    it('should return TIFF for image/tif files', () => {
        expect(getFriendlyNameForMimeType('image/tif')).to.equal('TIFF')
    })

    it('should return the original mime type if it is not recognized', () => {
        expect(getFriendlyNameForMimeType('application/unknown')).to.equal(
            'application/unknown'
        )
    })
})
