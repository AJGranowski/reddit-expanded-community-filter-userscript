import { DeepReadonly } from "./@types/DeepReadonly";
import { InternalJSON } from "./@types/InternalJSON";

interface Translation {
    locale: string,
    translation: any
}

class Localization <FT extends Translation, T extends InternalJSON<FT["translation"]>> {
    readonly fallbackTranslation: T;

    preferredLanguages: string[];
    translations: Record<string, T>;

    constructor(defaultTranslation: FT) {
        this.fallbackTranslation = defaultTranslation.translation;
        this.preferredLanguages = [];
        this.translations = {[defaultTranslation.locale]: defaultTranslation.translation};
    }

    addTranslation(translation: Translation): void {
        this.translations[translation.locale] = translation.translation;
    }

    get(): DeepReadonly<T> {
        // return this.translations[this.currentLanguage] or this.fallbackTranslation?
        return this.fallbackTranslation;
    }

    setLanguage(preferredLanguages: string[]): void {
        this.preferredLanguages = preferredLanguages;
    }

    private getClosestMatchingTranslation(/*translations: Record<string, T>, preferredLanguages: string[]*/): any {
        // Merge translation with fallback?
        // NO, WAIT. PROXIES. PROXIES MY GUY. HOLYSHIT. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        // Nah... I might need to add a proxy for each property. Might as well just merge with the fallback when adding the translation.
        return null;
    }
}

const translationFile = {
    locale: "en-US",
    translation: {
        hello: "world",
        nice: "to meet you!",
        dive: {
            deep: "down"
        },
        _remove: "this",
        and: {}
    }
};

const localization = new Localization(translationFile);
console.log(localization.get());

export { Localization };