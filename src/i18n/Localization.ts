import { DeepReadonly } from "./@types/DeepReadonly";
import { InternalJSON } from "./@types/InternalJSON";
import { mergeDeep } from "../utilities/MergeDeep";
import { Translation } from "./@types/Translation";

import enRaw from "../../locale/en.internal.json";
import zhRaw from "../../locale/zh.internal.json";

type ReplaceTranslationLocale<T, L> = Omit<T, "locale"> & {locale: L};

/**
 * Verify the locale field of a translation, then add that locale literal to the returned type.
 * To be replaced by https://github.com/microsoft/TypeScript/issues/32063 in the future.
 */
function verifyTranslation
<T extends Translation<string>, L extends string>(translation: T, expectedLocale: L): ReplaceTranslationLocale<T, L> {
    if (translation.locale !== expectedLocale) {
        throw new TypeError(`Invalid translation locale: expected "${expectedLocale}" but got "${translation.locale}"`);
    }

    return translation as Omit<T, "locale"> as ReplaceTranslationLocale<T, L>;
}

const en = verifyTranslation(enRaw, "en");
const zh = verifyTranslation(zhRaw, "zh");

class Localization<TF extends Translation<string>, L extends TF["locale"]> {
    static get SINGLETON(): ReturnType<typeof this.loadSingleton> {
        if (this.singleton == null) {
            this.singleton = this.loadSingleton();
        }

        return this.singleton;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private static loadSingleton() {
        return new Localization(en)
            .addTranslation(zh);
    }

    private static singleton: ReturnType<typeof this.loadSingleton> | null = null;

    private readonly fallbackTranslation: InternalJSON<TF>;

    private currentLocale: L | null;
    private currentTranslation: InternalJSON<TF> | null;
    private preferredLocales: readonly string[];
    private translations: Record<L, InternalJSON<TF>>;

    constructor(defaultTranslation: TF) {
        this.currentLocale = null;
        this.currentTranslation = null;
        this.fallbackTranslation = defaultTranslation.translation;
        this.preferredLocales = [];
        this.translations = {[defaultTranslation.locale]: this.fallbackTranslation} as Record<L, InternalJSON<TF>>;
    }

    addTranslation <T extends string>(translation: T extends L ? never : Translation<T>): Localization<TF, L | T> {
        const fallbackClone = JSON.parse(JSON.stringify(this.fallbackTranslation));
        (this.translations as Record<L | T, InternalJSON<TF>>)[translation.locale as T] = mergeDeep(fallbackClone, translation.translation);
        this.populateCurrentTranslation();
        return this as Localization<TF, L | T>;
    }

    get(): DeepReadonly<InternalJSON<TF["translation"]>> {
        return this.currentTranslation == null ? this.fallbackTranslation : this.currentTranslation;
    }

    setPreferredLanguages(preferredLanguages: readonly string[]): void {
        this.preferredLocales = preferredLanguages;
        this.populateCurrentTranslation();
    }

    private populateCurrentTranslation(): void {
        const oldLocale = this.currentLocale;
        let newLocale: L | null = null;
        for (const locale of this.preferredLocales) {
            if (locale in this.translations) {
                newLocale = locale as L;
                break;
            }
        }

        if (newLocale === oldLocale) {
            return;
        }

        this.currentLocale = newLocale;
        if (newLocale == null) {
            this.currentTranslation = null;
        } else {
            this.currentTranslation = this.translations[newLocale];
        }
    }
}

export { Localization };