import { AsyncXMLHttpRequest } from "../../src/userscript/AsyncXMLHttpRequest";

describe("AsyncXMLHttpRequest", () => {
    let mockXMLHttpRequest: jest.MockedFunction<typeof GM_xmlhttpRequest>;
    let TestAsyncXMLHttpRequest: typeof AsyncXMLHttpRequest;

    beforeEach(() => {
        mockXMLHttpRequest = jest.fn();
        TestAsyncXMLHttpRequest = class extends AsyncXMLHttpRequest {
            protected xmlHttpRequest<T>(details: Tampermonkey.Request<T>): Tampermonkey.AbortHandle<void> {
                return mockXMLHttpRequest(details);
            }
        };
    });

    test("should forward request details to the underlying xmlHttpRequest", () => {
        const details: Tampermonkey.Request = {
            method: "GET",
            url: "url",
            headers: {header: "string"},
            data: "data",
            cookie: "cookie",
            binary: false,
            nocache: false,
            revalidate: false,
            timeout: 1234,
            responseType: "json",
            user: "username",
            password: "password"
        };

        new TestAsyncXMLHttpRequest().asyncXMLHttpRequest(details, jest.fn());
        expect(mockXMLHttpRequest.mock.calls[0][0]).toMatchObject(details);
    });

    test("should return a promise", async () => {
        expect(new TestAsyncXMLHttpRequest().asyncXMLHttpRequest({url: "url"}, jest.fn())).toBeInstanceOf(Promise);
    });

    test("should resolve onload when the predicate returns true", async () => {
        const response: any = {
            responseText: "This is a response"
        };

        const promise = new TestAsyncXMLHttpRequest().asyncXMLHttpRequest({url: "url"}, () => true);
        mockXMLHttpRequest.mock.calls[0][0].onload?.call(response, response);
        await expect(promise).resolves.toBe(response);
    });

    describe("response error handling", () => {
        test("should reject onabort", async () => {
            const promise = new TestAsyncXMLHttpRequest().asyncXMLHttpRequest({url: "url"}, () => true);
            mockXMLHttpRequest.mock.calls[0][0].onabort?.();
            await expect(promise).rejects.toThrow();
        });

        test("should reject onerror", async () => {
            const errorResponse: any = {
                responseText: "There was an error",
                error: "There was an error"
            };

            const promise = new TestAsyncXMLHttpRequest().asyncXMLHttpRequest({url: "url"}, () => true);
            mockXMLHttpRequest.mock.calls[0][0].onerror?.call(errorResponse, errorResponse);
            await expect(promise).rejects.toBe(errorResponse);
        });

        test("should reject ontimeout", async () => {
            const promise = new TestAsyncXMLHttpRequest().asyncXMLHttpRequest({url: "url"}, () => true);
            mockXMLHttpRequest.mock.calls[0][0].ontimeout?.();
            await expect(promise).rejects.toThrow();
        });

        test("should reject onload when the predicate returns false", async () => {
            const response: any = {
                responseText: "This is a response"
            };

            const promise = new TestAsyncXMLHttpRequest().asyncXMLHttpRequest({url: "url"}, () => false);
            mockXMLHttpRequest.mock.calls[0][0].onload?.call(response, response);
            await expect(promise).rejects.toBe(response);
        });
    });
});