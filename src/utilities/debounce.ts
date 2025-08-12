export function debounce(func: Function, delay = 0) {
    let timeoutId: NodeJS.Timeout | string | number | undefined

    return function () {
        const context = this
        const args = arguments
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}
