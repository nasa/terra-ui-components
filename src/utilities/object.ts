export function shallowEqual(
    object1: Record<string, unknown>,
    object2: Record<string, unknown>
): boolean {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)

    console.log(keys1, keys2, object1, object2)

    if (keys1.length !== keys2.length) {
        console.log('not equal length', keys1.length, keys2.length)
        return false
    }

    for (let key of keys1) {
        if (!object2.hasOwnProperty(key) || object1[key] !== object2[key]) {
            console.log('not equal ', key, object1[key], object2[key])
            return false
        }
    }

    return true
}
