export type MapProjection = 'EPSG:3857' | 'EPSG:4326' | 'EPSG:3413' | 'EPSG:3031'

export enum TimeInterval {
    HalfHourly = 'half-hourly',
    Hourly = 'hourly',
    ThreeHourly = '3-hourly',
    EightDaily = '8-daily',
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
}
