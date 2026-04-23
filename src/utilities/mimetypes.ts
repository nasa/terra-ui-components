export const defaultSubsetFileMimeType = 'application/x-netcdf4'

export function getFriendlyNameForMimeType(
    mimeType: string,
    isGiovanni = false,
) {
    switch (mimeType) {
        case 'application/x-hdf':
        case 'application/octet-stream':
            return 'HDF-EOS5'

        case 'application/x-netcdf4':
        case 'application/netcdf':
            return 'NetCDF'

        case 'application/x-netcdf4;profile=opendap_url':
            return 'OPeNDAP URL (x-netcdf4)'

        case 'text/csv':
            if (isGiovanni) {
                return 'CSV (area-averaged time series; one file)'
            }

            return 'CSV'

        case 'image/tiff':
        case 'image/tif':
            if (isGiovanni) {
                return 'GeoTIFF (time-averaged map; one file)'
            }

            return 'TIFF'

        case 'image/gif':
            return 'GIF'

        case 'image/png':
            return 'PNG'

        case 'image/jpg':
        case 'image/jpeg':
            return 'JPEG'

        case 'application/shapefile+zip':
            return 'Shapefile+zip'

        case 'application/x-zarr':
            return 'ZARR'

        default:
            // don't know this mime type yet, just return it as is
            return mimeType
    }
}
