export function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1]
}


/**
 * @param array an array of values
 * @param key a function that returns the key for an item
 * @returns a new array where, if any element has the same key as another, the latter overwrites the previous
 */
export function distinctBy<V>(array: readonly V[], key: (value: V) => string): V[] {
    const map: Record<string, V> = {}
    for (const value of array) {
        map[key(value)] = value
    }
    return Object.values(map)
}

/**
 * @param array an array of strings or numbers
 * @returns a new array o unique values
 */
export function distinct<T extends string | number>(array: readonly T[]) {
    return distinctBy(array, k => k.toString())
}

export const NUM_CMP = (a: number, b: number) => a - b