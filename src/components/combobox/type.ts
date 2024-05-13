export enum SearchableListType {
    GroupedListItem = 'GroupedListItem',
    ListItem = 'ListItem',
}
export interface GroupedListItem {
    name: string
    items: ListItem[]
}

export interface ListItem {
    name: string
    title?: string
    value: string
}

export interface ListError {
    errorMessage: string
}

export interface SearchableList<T> {
    type: SearchableListType
    data: T[]
    error?: ListError
    loading?: Boolean
}

export interface Content {
    type: SearchableListType
    data: string | GroupedListItem[] | ListItem[] | undefined
}
