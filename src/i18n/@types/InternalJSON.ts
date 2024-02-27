type RemoveUnderscore<T extends object> = {
    [K in keyof T as Exclude<K, `_${string}`>]:
        T[K] extends object ? RemoveUnderscore<T[K]> : T[K]
}

type RemoveEmptyObjects<T extends object> = {
    [K in keyof T as T[K] extends Record<string, never> ? never : K]:
        T[K] extends object ? RemoveEmptyObjects<T[K]> : T[K]
}

// Removing empty objects could result in more empty objects, that if removed could result in more empty objects...
type RecursivelyRemoveEmptyObjects<T extends object> = RemoveEmptyObjects<T> extends T ?
    T : RecursivelyRemoveEmptyObjects<RemoveEmptyObjects<T>>;

/**
 * Transform internal JSON type to production JSON type.
 * * Removes private properties (those that start with an underscore).
 * * Removes empty objects while retaining empty arrays.
 */
type InternalJSON<T extends object> = RecursivelyRemoveEmptyObjects<RemoveUnderscore<T>>;

export { InternalJSON };