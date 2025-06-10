import type { TimeInterval } from '../../types.js'

export type ListItem = {
    collectionBeginningDateTime: string
    collectionEndingDateTime: string
    collectionLongName: string
    collectionShortName: string
    collectionVersion: string
    entryId: string
    /* data used to emit event detail when option is selected */
    eventDetail: string
    longName: string
    name: string
    standardName: string
    units: string
    timeInterval: TimeInterval
}

export type GroupedListItem = {
    collectionEntryId: string
    variables: ListItem[]
}

export type ReadableTaskStatus = 'INITIAL' | 'PENDING' | 'COMPLETE' | 'ERROR'

export type MaybeBearerToken = string | null
