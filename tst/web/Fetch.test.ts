import { mock } from "jest-mock-extended";

import { AsyncXMLHttpRequest } from "../../src/userscript/AsyncXMLHttpRequest";
import { Fetch } from "../../src/web/Fetch";

describe("Fetch", () => {
    let mockAsyncXMLHttpRequest: ReturnType<typeof mock<AsyncXMLHttpRequest>>;
    let mockAsyncXMLHttpRequestSupplier: jest.Mock<AsyncXMLHttpRequest, [], any>;
    let mockDOMParser: ReturnType<typeof mock<DOMParser>>;
    let mockDOMParserSupplier: jest.Mock<DOMParser, [], any>;
    let TestFetch: typeof Fetch;
    let fetch: Fetch;

    beforeEach(() => {
        mockAsyncXMLHttpRequest = mock<AsyncXMLHttpRequest>();
        mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mockImplementation((details, onLoadPredicate) => {
            if (onLoadPredicate({} as any)) {
                return Promise.resolve({} as any);
            } else {
                return Promise.reject({} as any);
            }
        });

        mockAsyncXMLHttpRequestSupplier = jest.fn().mockReturnValue(mockAsyncXMLHttpRequest);
        mockDOMParser = mock<DOMParser>();
        mockDOMParserSupplier = jest.fn().mockReturnValue(mockDOMParser);
        TestFetch = class extends Fetch {
            protected asyncXMLHttpRequestSupplier(): AsyncXMLHttpRequest {
                return mockAsyncXMLHttpRequestSupplier();
            }

            protected domParserSupplier(): DOMParser {
                return mockDOMParserSupplier();
            }
        };

        fetch = new TestFetch();
    });

    describe("fetchDocument", () => {
        const expectedDocument = (): any => {
            return {
                documentElement: {
                    innerHTML: response.responseText
                }
            };
        };

        let response: any;

        beforeEach(() => {
            response = {
                responseText: "<html></html>",
                status: 200
            };

            mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mockImplementation((details, onLoadPredicate) => {
                if (onLoadPredicate(response)) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(response);
                }
            });

            mockDOMParser.parseFromString.mockImplementation(expectedDocument);
        });

        test("should request using the specified url", async () => {
            const url = "url";
            await fetch.fetchDocument(url)
                .catch(() => {}); // Ignore errors here since we're just testing against the mock

            const call = mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mock.calls[0];
            expect(call[0].url).toBe(url);
        });

        test("should dom parse the requested page", async () => {
            await expect(fetch.fetchDocument("some url")).resolves.toStrictEqual(expectedDocument());
            expect(mockDOMParser.parseFromString.mock.calls[0][0]).toBe(response.responseText);
            expect(mockDOMParser.parseFromString.mock.calls[0][1]).toBe("text/html");
        });

        test("should reject if response status is 404", async () => {
            response = {
                responseText: "<html></html>",
                status: 404
            };

            await expect(fetch.fetchDocument("some url")).rejects.toBeDefined();
        });
    });

    describe("fetchMutedSubreddits", () => {
        let responseMutedSubreddits: any[];
        let response: any;
        beforeEach(() => {
            responseMutedSubreddits = ["1", "2"];
            response = {
                responseText: JSON.stringify({
                    data: {
                        identity: {
                            mutedSubreddits: {
                                edges: responseMutedSubreddits.map((x) => {return {node: {name: x}};})
                            }
                        }
                    }
                }),
                status: 200
            };

            mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mockImplementation((details, onLoadPredicate) => {
                if (onLoadPredicate(response)) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(response);
                }
            });
        });

        test("should request using the specified access token", async () => {
            const accessToken = "access token";

            await fetch.fetchMutedSubreddits(accessToken)
                .catch(() => {}); // Ignore errors here since we're just testing against the mock

            const call = mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mock.calls[0];
            expect(call[0].headers?.Authorization).toBe(`Bearer ${accessToken}`);
        });

        test("should request using the expected form", async () => {
            const accessToken = "another access token";
            const expectedRequest = {
                data: JSON.stringify({
                    "id": "c09ff0d041c1"
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                method: "POST",
                url: "https://gql.reddit.com/"
            };

            await fetch.fetchMutedSubreddits(accessToken)
                .catch(() => {}); // Ignore errors here since we're just testing against the mock

            const call = mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mock.calls[0];
            expect(call[0]).toMatchObject(expectedRequest);
        });

        test("should return a list of muted subreddits", async () => {
            await expect(fetch.fetchMutedSubreddits("some access token")).resolves.toEqual(responseMutedSubreddits);
        });

        test("should reject if response status is 404", async () => {
            response = {
                responseText: "<html></html>",
                status: 404
            };

            await expect(fetch.fetchMutedSubreddits("an access token")).rejects.toBeDefined();
        });

        test("should reject with error if there are no muted subreddits in the response", async () => {
            mockAsyncXMLHttpRequest.asyncXMLHttpRequest.mockReturnValue(Promise.resolve({
                responseText: JSON.stringify({ data: {} })
            } as any));
            await expect(fetch.fetchMutedSubreddits("access token, the accessor")).rejects.toThrow();
        });
    });
});