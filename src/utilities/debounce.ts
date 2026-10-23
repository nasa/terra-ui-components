export function debounce(func: Function, delay = 0) {
    let timeoutId: NodeJS.Timeout | string | number | undefined

    return function () {
        const args = arguments
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
