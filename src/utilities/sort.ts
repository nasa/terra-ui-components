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

export function sortByPriority<T, K = string>(
    items: T[],
    priorityOrder: K[],
    getKey: (item: T) => K
): T[] {
    if (!priorityOrder.length) {
        // returns reference to the original array
        return items
    }

    const getRank = (item: T) => {
        const index = priorityOrder.indexOf(getKey(item))

        return index === -1 ? priorityOrder.length : index
    }

    // sorts the array and returns a cloned copy of the sorted array
    return items.toSorted((a, b) => getRank(a) - getRank(b))
}
