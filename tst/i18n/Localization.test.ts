import { Localization } from "../../src/i18n/Localization";
import { Translation } from "../../src/i18n/@types/Translation";

import en from "../../locale/en.internal.json";

describe("Localization", () => {
    describe("get", () => {
        it("should return the default language without any other languages", () => {
            const defaultLanguage = {
                locale: "default-lang",
                translation: {
                    text: "Hello world!"
                }
            } satisfies Translation<"default-lang">;

            const localization = new Localization(defaultLanguage);
            const get = localization.get() satisfies typeof defaultLanguage["translation"];
            expect(get).toEqual(defaultLanguage.translation);
        });

        it("should return the default language if preferred language does not exist", () => {
            const defaultLanguage = {
                locale: "default-lang",
                translation: {
                    text: "Hello world!"
                }
            } satisfies Translation<"default-lang">;

            const localization = new Localization(defaultLanguage);
            localization.setPreferredLanguages(["something-different"]);
            expect(localization.get()).toEqual(defaultLanguage.translation);
        });
    });

    describe("addTranslation", () => {
        it("should switch between two languages", () => {
            const languageA = {
                locale: "lang-A",
                translation: {
                    text: "Hello!"
                }
            } satisfies Translation<"lang-A">;

            const languageB = {
                locale: "lang-B",
                translation: {
                    text: "What's up!"
                }
            } satisfies Translation<"lang-B">;

            const localization = new Localization(languageA)
                .addTranslation(languageB);

            localization.setPreferredLanguages(["lang-A"]);
            expect(localization.get().text).toEqual(languageA.translation.text);

            localization.setPreferredLanguages(["lang-B"]);
            expect(localization.get().text).toEqual(languageB.translation.text);
        });

        it("should fallback to default language if translation not found", () => {
            const languageA = {
                locale: "lang-A",
                translation: {
                    foo: "foo",
                    bar: "bar"
                }
            } satisfies Translation<"lang-A">;

            const languageB = {
                locale: "lang-B",
                translation: {
                    bar: "baz"
                }
            } satisfies Translation<"lang-B">;

            const localization = new Localization(languageA)
                .addTranslation(languageB);

            localization.setPreferredLanguages(["lang-B"]);
            expect(localization.get().foo).toEqual(languageA.translation.foo);
            expect(localization.get().bar).toEqual(languageB.translation.bar);
        });
    });

    describe("setPreferredLanguages", () => {
        it("should no-op if changing the language to the current language", () => {
            const defaultLanguage = {
                locale: "default-lang",
                translation: {
                    text: "Hello world!"
                }
            } satisfies Translation<"default-lang">;

            const localization = new Localization(defaultLanguage);
            localization.setPreferredLanguages([defaultLanguage.locale]);
            expect(localization.get()).toEqual(defaultLanguage.translation);
        });

        it("should return the first matching locale from the list of preferred languages", () => {
            const languageA = {
                locale: "lang-A",
                translation: {
                    text: "A"
                }
            } satisfies Translation<"lang-A">;

            const languageAA = {
                locale: "lang-A-AA",
                translation: {
                    text: "AA"
                }
            } satisfies Translation<"lang-A-AA">;

            const languageB = {
                locale: "lang-B",
                translation: {
                    text: "B"
                }
            } satisfies Translation<"lang-B">;

            const localization = new Localization(languageA)
                .addTranslation(languageAA)
                .addTranslation(languageB);

            localization.setPreferredLanguages(["lang-A-AA", "lang-A"]);
            expect(localization.get().text).toEqual(languageAA.translation.text);

            localization.setPreferredLanguages(["lang-A", "lang-A-AA"]);
            expect(localization.get().text).toEqual(languageA.translation.text);

            localization.setPreferredLanguages(["does-not-exit", "something-else", "lang-B"]);
            expect(localization.get().text).toEqual(languageB.translation.text);
        });

        it("should use the fallback language if preferred language does not exist", () => {
            const languageA = {
                locale: "lang-A",
                translation: {
                    text: "A"
                }
            } satisfies Translation<"lang-A">;

            const languageB = {
                locale: "lang-B",
                translation: {
                    text: "B"
                }
            } satisfies Translation<"lang-B">;

            const localization = new Localization(languageA)
                .addTranslation(languageB);

            localization.setPreferredLanguages(["lang-B"]);
            localization.setPreferredLanguages(["does-not-exist"]);
            expect(localization.get().text).toEqual(languageA.translation.text);
        });
    });

    describe("singleton", () => {
        it("should fallback to English", () => {
            expect(Localization.SINGLETON.get()).toEqual(en.translation);
        });
    });
});