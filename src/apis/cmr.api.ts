class CmrApi {
    async getCollection(shortName: string, version: string) {
        return this.getCollectionByEntryId(`${shortName}_${version}`)
    }

    async getCollectionByEntryId(collectionEntryId?: string) {
        if (!collectionEntryId) {
            return null
        }

        const response = await fetch(
            `https://cmr.earthdata.nasa.gov/search/collections.umm_json?entry_id[]=${collectionEntryId}`
        )

        return response.json()
    }
}

export const cmrApi = new CmrApi()
