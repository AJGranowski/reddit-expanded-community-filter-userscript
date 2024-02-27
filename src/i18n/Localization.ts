import { DeepReadonly } from "./@types/DeepReadonly";
import { InternalJSON } from "./@types/InternalJSON";
import { mergeDeep } from "../utilities/MergeDeep";
import { Translation } from "./@types/Translation";

class Localization<TF extends Translation<string>, L extends TF["locale"]> {
    readonly fallbackTranslation: InternalJSON<TF>;

    currentLocale: L | null;
    currentTranslation: InternalJSON<TF> | null;
    preferredLocales: string[];
    translations: Record<L, InternalJSON<TF>>;

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

    setPreferredLanguages(preferredLanguages: string[]): void {
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