import { HttpException } from '../exceptions/http.exception.js'
import type { RequestOptions } from '../lib/api.client.js'

export type Projection = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'

export const GIBS_ROOT = 'https://gibs.earthdata.nasa.gov'
export const GIBS_WMTS_ENDPOINT = `${GIBS_ROOT}/wmts`
export const GIBS_LEGENDS_ENDPOINT = `${GIBS_ROOT}/legends`
export const GIBS_COLORMAPS_ENDPOINT = `${GIBS_ROOT}/colormaps`

async function fetchText(url: string, options?: RequestOptions): Promise<string> {
    const res = await fetch(url, {
        signal: options?.signal,
        headers: options?.headers,
    })

    if (!res.ok) {
        throw new HttpException({
            status: res.status,
            message: `GIBS request failed with status ${res.status}: ${url}`,
        })
    }

    return res.text()
}

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
        return fetchText(url, options)
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
        return fetchText(url, options)
    }

    /**
     * Fetches the raw Colormap XML for a GIBS layer.
     */
    async getColormapXml(
        layer: string,
        version = 'v1.3',
        options?: RequestOptions
    ): Promise<string> {
        const url = `${GIBS_COLORMAPS_ENDPOINT}/${version}/${layer}.xml`
        return fetchText(url, options)
    }
}

export const gibsApi = new GibsApi()
export default gibsApi
