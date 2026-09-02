export function getRandomIntInclusive(min: number, max: number) {
    return (
        Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
        Math.ceil(min)
    )
}

// only round to 2 decimals when there's more precision than that to trim (e.g. 40.134 -> "40.13"); leave 40, 40.1, 40.12 as-is
export function formatCoord(value: number): string {
    const [, decimals = ''] = value.toString().split('.')
    return decimals.length > 2 ? value.toFixed(2) : value.toString()
}
