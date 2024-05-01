/* eslint-disable @typescript-eslint/no-unused-vars */
import { promisify } from "../../src/utilities/promisify";

const emptyReturnVoid = (): void => {};
const numberReturnVoid = (number: number): void => {};
const stringReturnVoid = (string: string): void => {};
const booleanReturnVoid = (boolean: boolean): void => {};
const optionalNumberReturnVoid = (number?: number): void => {};
const numberNumberReturnVoid = (number1: number, number2: number): void => {};
const numberStringNumberReturnVoid = (number1: number, string: string, number2: number): void => {};
const emptyReturnNumber = (): number => {return 2;};
const numberReturnNumber = (number: number): number => {return 3;};
const stringNumberReturnNumber = (string: string, number: number): number => {return 5;};
const tReturnT = <T>(thing: T): T => {return thing;};
const emptyReturnPromise = (): Promise<void> => {return Promise.resolve();};
const emptyThrowsError = ((e) => {return (): void => {throw e;};})(new Error());

describe("promisify", () => {
    describe("type check", () => {
        promisify(emptyReturnVoid);
        promisify(numberReturnVoid);
        promisify(stringReturnVoid);
        promisify(booleanReturnVoid);
        promisify(optionalNumberReturnVoid);
        promisify(numberNumberReturnVoid);
        promisify(numberStringNumberReturnVoid);
        promisify(emptyReturnNumber);
        promisify(numberReturnNumber);
        promisify(stringNumberReturnNumber);
        promisify(tReturnT);
        promisify(emptyReturnPromise);
        promisify(emptyThrowsError);
    });

    describe("resolved promise matches original function return", () => {
        test("emptyReturnVoid", async () => {
            return expect(promisify(emptyReturnVoid)())
                .resolves.toBeUndefined();
        });

        test("numberReturnVoid", async () => {
            return expect(promisify(numberReturnVoid)(1))
                .resolves.toBeUndefined();
        });

        test("emptyReturnNumber", async () => {
            return expect(promisify(emptyReturnNumber)())
                .resolves.toBe(emptyReturnNumber());
        });

        test("tReturnT", async () => {
            const obj = {
                a: 1,
                b: {
                    c: 2,
                    d: 3
                }
            };

            return expect(promisify(tReturnT)(obj))
                .resolves.toBe(tReturnT(obj));
        });
    });

    describe("rejected promise matches original function throw", () => {
        test("emptyThrowsError", async () => {
            let expectedError: any;
            try {
                emptyThrowsError();
            } catch (e) {
                expectedError = e;
            }

            expect(expectedError).toEqual(expect.anything());
            return expect(promisify(emptyThrowsError)())
                .rejects.toBe(expectedError);
        });
    });
});