import { apiClient, type RequestOptions } from '../lib/api.client.js'

export type Projection = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'

export const GIBS_ROOT = 'https://gibs.earthdata.nasa.gov'
export const GIBS_WMTS_ENDPOINT = `${GIBS_ROOT}/wmts`
export const GIBS_LEGENDS_ENDPOINT = `${GIBS_ROOT}/legends`

export class GibsApi {
    /**
     * Fetches WMTS GetCapabilities XML for a given projection.
     */
    async getCapabilitiesXml(
        projection: Projection,
        options?: RequestOptions
    ): Promise<string> {
        const endpoint = projection.replace(':', '').toLowerCase()
        const url = `${GIBS_WMTS_ENDPOINT}/${endpoint}/best/wmts.cgi?REQUEST=GetCapabilities`
        return apiClient.get<string>(url, { ...options, responseType: 'text' })
    }

    /**
     * Fetches the SVG text for a GIBS legend (horizontal by default if layer name provided).
     */
    async getLegendSvg(
        urlOrLayer: string,
        options?: RequestOptions
    ): Promise<string> {
        const url = urlOrLayer.startsWith('http')
            ? urlOrLayer
            : `${GIBS_LEGENDS_ENDPOINT}/${urlOrLayer}_H.svg`
        return apiClient.get<string>(url, { ...options, responseType: 'text' })
    }
}

export const gibsApi = new GibsApi()
export default gibsApi
