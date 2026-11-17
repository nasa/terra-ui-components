type Invert<T extends Record<PropertyKey, PropertyKey>> = {
    [K in keyof T as T[K]]: K
}

/**
 * Returns a new object with the keys and values inverted.
 * @example
 * const obj = { foo: 'bar', baz: 'buzz' };
 * invertObject(obj); // { bar: 'foo', buzz: 'baz' }
 * @param obj
 */
export function invertObject<T extends Record<PropertyKey, PropertyKey>>(
    obj: T
): Invert<T> {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [v, k])
    ) as Invert<T>
}
