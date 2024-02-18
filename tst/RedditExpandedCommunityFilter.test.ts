import { JSDOM } from "jsdom";
import { mock } from "jest-mock-extended";

import { TestConstants } from "./TestConstants";

import { AsyncMutationObserver } from "../src/utilities/AsyncMutationObserver";
import { RedditFeed } from "../src/reddit/@types/RedditFeed";
import { RedditExpandedCommunityFilter } from "../src/RedditExpandedCommunityFilter";
import { RedditSession } from "../src/reddit/RedditSession";
import { Storage } from "../src/userscript/Storage";

describe("RedditExpandedCommunityFilter", () => {
    let mockMutationObserver: ReturnType<typeof mock<MutationObserver>>;
    let mockReddit: ReturnType<typeof mock<RedditFeed>>;
    let mockRedditSession: ReturnType<typeof mock<RedditSession>>;
    let mockStorage: ReturnType<typeof mock<Storage>>;
    let mutationObserverSupplier: jest.Mock<MutationObserver, [MutationCallback], any>;
    let redditExpandedCommunityFilter: RedditExpandedCommunityFilter;
    let TestAsyncMutationObserver: typeof AsyncMutationObserver;
    let TestRedditExpandedCommunityFilter: typeof RedditExpandedCommunityFilter;

    beforeEach(() => {
        mockMutationObserver = mock<MutationObserver>();
        mutationObserverSupplier = jest.fn().mockReturnValue(mockMutationObserver);

        mockReddit = mock<RedditFeed>();
        mockReddit.getMutedPosts.mockReturnValue(Promise.resolve([]));

        mockRedditSession = mock<RedditSession>();
        mockRedditSession.updateAccessToken.mockReturnValue(Promise.resolve("access token"));
        mockRedditSession.updateMutedSubreddits.mockReturnValue(Promise.resolve([]));
        mockRedditSession.getAccessToken.mockImplementation(mockRedditSession.updateAccessToken);
        mockRedditSession.getMutedSubreddits.mockImplementation(mockRedditSession.updateMutedSubreddits);

        mockStorage = mock<Storage>();
        mockStorage.get.mockReturnValue(false);

        TestAsyncMutationObserver = class extends AsyncMutationObserver {
            protected mutationObserverSupplier(callback: MutationCallback): MutationObserver {
                return mutationObserverSupplier(callback);
            }
        };

        TestRedditExpandedCommunityFilter = class extends RedditExpandedCommunityFilter {
            protected addStyle(): HTMLStyleElement {
                return mock<HTMLStyleElement>();
            }

            protected asyncMutationObserverSupplier(callback: MutationCallback): AsyncMutationObserver {
                return new TestAsyncMutationObserver(callback);
            }

            protected redditSupplier(): RedditFeed {
                return mockReddit;
            }

            protected redditSessionSupplier(): RedditSession {
                return mockRedditSession;
            }

            protected storageSupplier(): Storage {
                return mockStorage;
            }
        };

        redditExpandedCommunityFilter = new TestRedditExpandedCommunityFilter();
    });

    test("stop should resolve immediately if not started", async () => {
        await redditExpandedCommunityFilter.stop();
    });

    test("start should return the same promise", () => {
        const startPromise1 = redditExpandedCommunityFilter.start();
        const startPromise2 = redditExpandedCommunityFilter.start();
        expect(startPromise2).toBe(startPromise1);
    });

    test("should get updated access token immediately", () => {
        redditExpandedCommunityFilter.start();
        expect(mockRedditSession.updateAccessToken.mock.calls).toHaveLength(1);
    });

    test("should get updated muted subreddits immediately", () => {
        redditExpandedCommunityFilter.start();
        expect(mockRedditSession.updateMutedSubreddits.mock.calls).toHaveLength(1);
    });

    describe("on mutation update", () => {
        let jsdom: JSDOM;
        let mutationObserverCallback: MutationCallback;
        let postElements: Element[];
        let startPromise: Promise<void>;

        function createMutationRecord(mutationRecord: Partial<MutationRecord>): MutationRecord {
            return {
                addedNodes: [] as unknown as NodeList,
                attributeName: null,
                attributeNamespace: null,
                nextSibling: null,
                oldValue: null,
                previousSibling: null,
                removedNodes: [] as unknown as NodeList,
                target: jsdom.window.document,
                type: "childList",
                ...mutationRecord
            };
        }

        beforeEach(async () => {
            jsdom = await JSDOM.fromFile(TestConstants.HTML_PATH.NEW_REDDIT);

            const postFeedElement: HTMLElement = jsdom.window.document.getElementById("__post_feed")!;
            postElements = [];
            for (const child of postFeedElement.children) {
                postElements.push(child);
            }

            startPromise = redditExpandedCommunityFilter.start();
            await new Promise<void>((resolve) => {
                mockMutationObserver.observe.mockImplementation(() => resolve());
            });

            mutationObserverCallback = mutationObserverSupplier.mock.calls[0][0];
        });

        test("should get muted posts", async () => {
            expect(mockReddit.getMutedPosts.mock.calls).toHaveLength(1);
            const mutationRecord = createMutationRecord({addedNodes: [postElements[1]] as unknown as NodeList});
            await mutationObserverCallback([mutationRecord], mockMutationObserver);
            expect(mockReddit.getMutedPosts.mock.calls).toHaveLength(2);
        });

        test("promise should resolve on stop", async () => {
            redditExpandedCommunityFilter.stop();
            await startPromise;
        });

        describe("post removal", () => {
            let mutationRecord: MutationRecord;
            let postToRemove: Element;

            beforeEach(() => {
                postToRemove = postElements[1];
                postToRemove.remove = jest.fn();

                mockReddit.getMutedPosts.mockReturnValue(Promise.resolve([{
                    elements: [postToRemove as HTMLElement],
                    subreddit: "r/blah"
                }]));

                mutationRecord = createMutationRecord({addedNodes: [postToRemove] as unknown as NodeList});
            });

            test("should remove muted post", async () => {
                await mutationObserverCallback([mutationRecord], mockMutationObserver);
                expect((postToRemove.remove as ReturnType<typeof jest.fn>).mock.calls).toHaveLength(1);
            });

            test("should not remove muted post if debug mode enabled", async () => {
                mockStorage.get.mockReturnValue(true);
                await mutationObserverCallback([mutationRecord], mockMutationObserver);
                expect((postToRemove.remove as ReturnType<typeof jest.fn>).mock.calls).toHaveLength(0);
            });
        });
    });

    test("promise should resolve on stop", async () => {
        const promise = redditExpandedCommunityFilter.start();
        redditExpandedCommunityFilter.stop();
        await promise;
    });
});