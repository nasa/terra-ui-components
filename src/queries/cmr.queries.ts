import { cmrApi } from '../apis/cmr.api.js'

// TODO: typings and generics
export function getCmrCollection(collectionEntryId?: string) {
    return {
        queryKey: ['collection', collectionEntryId],
        queryFn: async () => {
            if (!collectionEntryId) {
                return null
            }
            return cmrApi.getCollectionByEntryId(collectionEntryId)
        },
    }
}
