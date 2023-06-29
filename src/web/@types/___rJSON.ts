type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | {[key: string]: JSONValue};

interface JSONObject {
    [k: string]: JSONValue
}

interface ___rJSON extends JSONObject {
    user: {
        session: {
            accessToken: string;
            unsafeLoggedOut: boolean;
        };
        temporaryGQL: {
            isLoggedIn: boolean
        };
    };
}

export { ___rJSON };