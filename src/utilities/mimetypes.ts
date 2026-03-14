export const defaultSubsetFileMimeType = 'application/x-netcdf4'

export function getFriendlyNameForMimeType(mimeType: string, isGiovanni = false) {
    switch (mimeType) {
        case 'application/x-hdf':
        case 'application/octet-stream':
            return 'HDF-EOS5'

        case 'application/x-netcdf4':
        case 'application/netcdf':
            return 'NetCDF'

        case 'text/csv':
            if (isGiovanni) {
                return 'Area-averaged time series (CSV)'
            }

            return 'CSV'

        case 'image/tiff':
        case 'image/tif':
            if (isGiovanni) {
                return 'Time-averaged map (GeoTIFF)'
            }

            return 'TIFF'

        default:
            // don't know this mime type yet, just return it as is
            return mimeType
    }
}
