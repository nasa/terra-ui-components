export enum SortOrder {
    AtoZ = 'aToZ',
    ZtoA = 'zToA',
}

export function getSortLabel(sortOrder: SortOrder | string) {
    switch (sortOrder) {
        case SortOrder.AtoZ:
            return 'A-Z'
        case SortOrder.ZtoA:
            return 'Z-A'
        default:
            return sortOrder
    }
}
