function isEmpty(object) {
    for (const key in object) {
        if (Object.hasOwn(object, key)) {
            return false;
        }
    }

    return typeof object === "object";
}

function removeUnderscoreReviver(key, value) {
    return key.startsWith("_") ? undefined : value;
}

function removeEmptyObjectReviver(key, value) {
    if (value == null || typeof value !== "object") {
        return value;
    }

    if (Array.isArray(value)) {
        return value.filter((x) => !isEmpty(x));
    } else if (isEmpty(value)) {
        return undefined;
    }

    return value;
}

/**
 * Combine a series of revivers into one reviver.
 * Revivers run in order, and short circuit on undefined.
 */
function compoundReviver(...revivers) {
    return (key, value) => {
        let result = value;
        for (const reviver of revivers) {
            if (result === undefined) {
                return result;
            }

            result = reviver(key, result);
        }

        return result;
    };
}

/**
 * Transform internal JSON to production JSON.
 * * Removes private properties (those that start with an underscore).
 * * Removes empty objects while retaining empty arrays.
 */
export default function() {
    return {
        name: "rollup-plugin-internal-json",
        transform: (source, id) => {
            if (!id.toLowerCase().endsWith(".internal.json")) {
                return null;
            }

            const reviver = compoundReviver(removeUnderscoreReviver, removeEmptyObjectReviver);
            try {
                return JSON.stringify(JSON.parse(source, reviver));
            } catch (e) {
                console.warn(id, e);
                return null;
            }
        }
    };
}