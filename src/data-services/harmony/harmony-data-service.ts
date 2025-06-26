import type { DataServiceInterface } from '../types.js'

export const HARMONY_CONFIG = {
    baseUrl: 'https://harmony.earthdata.nasa.gov',
    cmrUrl: 'https://cmr.earthdata.nasa.gov/search',
}

export class HarmonyDataService implements DataServiceInterface {
    async getAvailableServices(): Promise<any> {
        // TODO: implement
        return []
    }
}
