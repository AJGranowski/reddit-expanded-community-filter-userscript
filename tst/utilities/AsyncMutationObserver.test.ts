import { mock } from "jest-mock-extended";

import { AsyncMutationObserver } from "../../src/utilities/AsyncMutationObserver";

describe("AsyncMutationObserver", () => {
    let mockMutationObserver: ReturnType<typeof mock<MutationObserver>>;
    let mutationObserverSupplier: jest.Mock<MutationObserver, [MutationCallback], any>;
    let TestAsyncMutationObserver: typeof AsyncMutationObserver;

    beforeEach(() => {
        mockMutationObserver = mock<MutationObserver>();
        mutationObserverSupplier = jest.fn().mockReturnValue(mockMutationObserver);
        TestAsyncMutationObserver = class extends AsyncMutationObserver {
            protected mutationObserverSupplier(callback: MutationCallback): MutationObserver {
                return mutationObserverSupplier(callback);
            }
        };
    });

    describe("constructor", () => {
        test("should construct one mutation observer at most", () => {
            new TestAsyncMutationObserver(jest.fn());
            expect(mutationObserverSupplier.mock.calls.length).toBeLessThanOrEqual(1);
        });
    });

    describe("MutationObserver behavior", () => {
        test("should trigger callback when observer is triggered", () => {
            const callback = jest.fn();
            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(callback);
            asyncMutationObserver.observe(null as any);

            const mutationObserverCallback = mutationObserverSupplier.mock.calls[0][0];

            expect(callback).toBeCalledTimes(0);
            mutationObserverCallback([], asyncMutationObserver);
            expect(callback).toBeCalledTimes(1);
        });

        test("observer in callback should match the original observer", () => {
            let callbackObserver: any = null;
            const callback: MutationCallback = (mutationList, observer) => {
                callbackObserver = observer;
            };

            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(callback);
            asyncMutationObserver.observe(null as any);

            const mutationObserverCallback = mutationObserverSupplier.mock.calls[0][0];

            mutationObserverCallback([], asyncMutationObserver);
            expect(callbackObserver).toBe(asyncMutationObserver);
        });
    });

    describe("async", () => {
        test("should return a promise", () => {
            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(jest.fn());
            expect(asyncMutationObserver.observe(null as any)).toBeInstanceOf(Promise);
        });

        test("should resolve the promise on disconnect", async () => {
            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(jest.fn());
            const promise = asyncMutationObserver.observe(null as any);
            asyncMutationObserver.disconnect();
            await promise;
        });

        test("should resolve all promises on disconnect", async () => {
            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(jest.fn());
            const promise1 = asyncMutationObserver.observe(null as any);
            const promise2 = asyncMutationObserver.observe(null as any);
            const promise3 = asyncMutationObserver.observe(null as any);
            asyncMutationObserver.disconnect();
            await Promise.all([promise1, promise2, promise3]);
        });

        test("disconnect should reset, allowing for more observations", async () => {
            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(jest.fn());
            const promise1 = asyncMutationObserver.observe(null as any);
            asyncMutationObserver.disconnect();
            await promise1;
            const promise2 = asyncMutationObserver.observe(null as any);
            asyncMutationObserver.disconnect();
            await promise2;
        });

        test("should resolve the promise on disconnect from the callback", async () => {
            const callback: MutationCallback = (mutationList, observer) => {
                observer.disconnect();
            };

            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(callback);
            const promise = asyncMutationObserver.observe(null as any);
            const mutationObserverCallback = mutationObserverSupplier.mock.calls[0][0];
            mutationObserverCallback([], asyncMutationObserver);
            await promise;
        });

        test("should reject the promise on thrown error from the callback", async () => {
            const callback: MutationCallback = () => {
                throw new Error();
            };

            const asyncMutationObserver: AsyncMutationObserver = new TestAsyncMutationObserver(callback);
            const promise = asyncMutationObserver.observe(null as any);
            const mutationObserverCallback = mutationObserverSupplier.mock.calls[0][0];
            mutationObserverCallback([], asyncMutationObserver);
            await expect(promise).rejects.toThrowError();
        });
    });
});