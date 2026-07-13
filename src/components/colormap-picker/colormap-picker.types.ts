export type ColormapCategory = 'all' | 'sequential' | 'diverging' | 'qualitative'

export interface ColormapEntry {
    name: string
    category: Exclude<ColormapCategory, 'all'>
    gradient: string
}
