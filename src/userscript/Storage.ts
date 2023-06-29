enum STORAGE_KEY {
    DEBUG = "debug"
}

const DEFAULT_VALUES = {
    [STORAGE_KEY.DEBUG]: false as boolean
};

/**
 * Wrapper for GM_getValue and GM_setValue with strict checks on the key values.
 */
class Storage {
    get<K extends keyof typeof DEFAULT_VALUES>(key: K): typeof DEFAULT_VALUES[K] {
        return this.getValue(key, DEFAULT_VALUES[key]);
    }

    set<K extends keyof typeof DEFAULT_VALUES>(key: K, value: typeof DEFAULT_VALUES[K]): void {
        this.setValue(key, value);
    }

    /* istanbul ignore next */
    protected getValue<T>(name: string, defaultValue?: T): T {
        return GM_getValue(name, defaultValue);
    }

    /* istanbul ignore next */
    protected setValue(name: string, value: any): void {
        return GM_setValue(name, value);
    }
}

export { Storage, STORAGE_KEY };