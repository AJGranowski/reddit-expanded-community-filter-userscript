// Sourced from https://stackoverflow.com/a/34749873

function isObject(item: any): boolean {
    return (item != null && typeof item === "object" && !Array.isArray(item));
}

/**
 * Merge a source object into a target object
 */
function mergeDeep <T1 extends Record<string, any>, T2 extends Record<string, any>>(target: T1, source: T2): T1 | T2 {
    for (const key in source) {
        if (isObject(source[key])) {
            if (!(key in target)) {
                Object.assign(target, {[key]: {}});
            }

            mergeDeep(target[key], source[key]);
        } else {
            Object.assign(target, {[key]: source[key]});
        }
    }

    return target;
}

export { mergeDeep };