import { Storage, STORAGE_KEY } from "../../src/userscript/Storage";

describe("Storage", () => {
    let mockGetValue: jest.Mock<typeof GM_getValue, Parameters<typeof GM_getValue>, any>;
    let mockSetValue: jest.Mock<typeof GM_setValue, Parameters<typeof GM_setValue>, any>;
    let storage: Storage;
    let TestStorage: typeof Storage;

    beforeEach(() => {
        mockGetValue = jest.fn();
        mockSetValue = jest.fn();
        TestStorage = class extends Storage {
            protected getValue<T>(name: string, defaultValue?: T): T {
                return mockGetValue(name, defaultValue) as any;
            }

            /* istanbul ignore next */
            protected setValue(name: string, value: any): void {
                return mockSetValue(name, value) as any;
            }
        };

        storage = new TestStorage();
    });

    test("get", () => {
        storage.get(STORAGE_KEY.DEBUG);
        expect(mockGetValue).toHaveBeenCalledWith(STORAGE_KEY.DEBUG, false);
    });

    test("set", () => {
        storage.set(STORAGE_KEY.DEBUG, true);
        expect(mockSetValue).toHaveBeenCalledWith(STORAGE_KEY.DEBUG, true);
    });
});