export const defaultSubsetFileMimeType = 'application/x-netcdf4'

export function getFriendlyNameForMimeType(mimeType: string) {
    switch (mimeType) {
        case 'application/x-hdf':
        case 'application/octet-stream':
            return 'HDF-EOS5'

        case 'application/x-netcdf4':
            return 'NetCDF-4'

        case 'application/netcdf':
            return 'NetCDF Classic (NetCDF-3)'

        default:
            // don't know this mime type yet, just return it as is
            return mimeType
    }
}
