import { mock } from "jest-mock-extended";

import { AccessToken } from "../../src/reddit/AccessToken";
import { Fetch } from "../../src/web/Fetch";
import { RedditSession } from "../../src/reddit/RedditSession";
import { Storage } from "../../src/userscript/Storage";

describe("RedditSession", () => {
    let mockAccessToken: ReturnType<typeof mock<AccessToken>>;
    let mockFetch: ReturnType<typeof mock<Fetch>>;
    let redditSession: RedditSession;
    let TestRedditSession: typeof RedditSession;

    beforeEach(() => {
        mockAccessToken = mock<AccessToken>();
        mockFetch = mock<Fetch>();
        TestRedditSession = class extends RedditSession {
            protected storageSupplier(): Storage {
                const storage = mock<Storage>();
                storage.get.mockReturnValue(false);
                return storage;
            }

            protected windowSupplier(): Window {
                return {} as Window;
            }
        };

        redditSession = new TestRedditSession(mockAccessToken, mockFetch);
    });

    describe("update", () => {
        describe("updateAccessToken", () => {
            test("should return the access token from the window if available", async () => {
                const accessToken = "an access token";
                mockAccessToken.fromWindow.mockReturnValue(accessToken);

                await expect(redditSession.updateAccessToken()).resolves.toBe(accessToken);
            });

            test("should fallback to scraping a webpage if the window access token is not available", async () => {
                const accessToken = "an access token";
                mockAccessToken.fromWindow.mockImplementation(() => {throw new Error();});
                mockFetch.fetchDocument.mockReturnValue(Promise.resolve({} as Document));
                mockAccessToken.fromDocument.mockReturnValue(accessToken);

                await expect(redditSession.updateAccessToken()).resolves.toBe(accessToken);
                expect(mockFetch.fetchDocument.mock.calls).toHaveLength(1);
            });

            describe("deduplication", () => {
                test("should return the pending promise if not yet resolved", () => {
                    const promise = redditSession.updateAccessToken();
                    expect(redditSession.updateAccessToken()).toBe(promise);
                });

                test("should return a new promise if the first resolves", async () => {
                    mockAccessToken.fromWindow.mockReturnValue("access token");
                    const promise = redditSession.updateAccessToken();
                    await promise;
                    expect(redditSession.updateAccessToken()).not.toBe(promise);
                });

                test("should return a new promise if the first rejects", async () => {
                    mockAccessToken.fromWindow.mockImplementation(() => {throw new Error();});
                    mockFetch.fetchDocument.mockReturnValue(Promise.reject(new Error()));
                    const promise1 = redditSession.updateAccessToken();
                    await expect(promise1).rejects.toThrowError();
                    const promise2 = redditSession.updateAccessToken();
                    expect(promise2).not.toBe(promise1);
                    await expect(promise2).rejects.toThrowError();
                });
            });
        });

        describe("updateMutedSubreddits", () => {
            let accessToken: any;
            beforeEach(() => {
                accessToken = "access token";
                mockAccessToken.fromWindow.mockReturnValue(accessToken);
            });

            test("should return the result of fetchMutedSubreddits", async () => {
                const mutedSubreddits = ["1", "2"];
                mockFetch.fetchMutedSubreddits.mockReturnValue(Promise.resolve(mutedSubreddits));

                await expect(redditSession.updateMutedSubreddits()).resolves.toBe(mutedSubreddits);
                expect(mockFetch.fetchMutedSubreddits.mock.calls[0][0]).toBe(accessToken);
            });

            test("should not hide errors", async () => {
                mockAccessToken.fromWindow.mockReturnValue("access token");
                mockFetch.fetchMutedSubreddits.mockReturnValue(Promise.reject(new Error()));

                await expect(redditSession.updateMutedSubreddits()).rejects.toThrowError();
            });

            describe("deduplication", () => {
                test("should return the pending promise if not yet resolved", () => {
                    const promise = redditSession.updateMutedSubreddits();
                    expect(redditSession.updateMutedSubreddits()).toBe(promise);
                });

                test("should return a new promise if the first resolves", async () => {
                    mockFetch.fetchMutedSubreddits.mockReturnValue(Promise.resolve([]));
                    const promise = redditSession.updateMutedSubreddits();
                    await promise;
                    expect(redditSession.updateAccessToken()).not.toBe(promise);
                });

                test("should return a new promise if the first rejects", async () => {
                    mockFetch.fetchMutedSubreddits.mockReturnValue(Promise.reject(new Error()));
                    const promise1 = redditSession.updateMutedSubreddits();
                    await expect(promise1).rejects.toThrowError();
                    const promise2 = redditSession.updateMutedSubreddits();
                    expect(promise2).not.toBe(promise1);
                    await expect(promise2).rejects.toThrowError();
                });
            });
        });
    });

    describe("get", () => {
        describe("getAccessToken", () => {
            test("should return the access token from the window if available", async () => {
                const accessToken = "an access token";
                mockAccessToken.fromWindow.mockReturnValue(accessToken);

                await expect(redditSession.getAccessToken()).resolves.toBe(accessToken);
                await expect(redditSession.getAccessToken()).resolves.toBe(accessToken);
            });
        });

        describe("getMutedSubreddits", () => {
            test("should return the result of fetchMutedSubreddits", async () => {
                mockAccessToken.fromWindow.mockReturnValue("access token");
                const mutedSubreddits = ["1", "2"];
                mockFetch.fetchMutedSubreddits.mockReturnValue(Promise.resolve(mutedSubreddits));

                await expect(redditSession.getMutedSubreddits()).resolves.toBe(mutedSubreddits);
                await expect(redditSession.getMutedSubreddits()).resolves.toBe(mutedSubreddits);
            });
        });
    });
});