import { mock } from "jest-mock-extended";

import { AsyncMutationObserver } from "../src/utilities/AsyncMutationObserver";
import { Reddit } from "../src/reddit/Reddit";
import { RedditExpandedCommunityFilter } from "../src/RedditExpandedCommunityFilter";
import { RedditSession } from "../src/reddit/RedditSession";
import { Storage } from "../src/userscript/Storage";

describe("RedditExpandedCommunityFilter", () => {
    let mockMutationObserver: ReturnType<typeof mock<MutationObserver>>;
    let mutationObserverSupplier: jest.Mock<MutationObserver, [MutationCallback], any>;
    let mockReddit: ReturnType<typeof mock<Reddit>>;
    let mockRedditSession: ReturnType<typeof mock<RedditSession>>;
    let redditExpandedCommunityFilter: RedditExpandedCommunityFilter;
    let TestAsyncMutationObserver: typeof AsyncMutationObserver;
    let TestRedditExpandedCommunityFilter: typeof RedditExpandedCommunityFilter;

    beforeEach(() => {
        mockMutationObserver = mock<MutationObserver>();
        mutationObserverSupplier = jest.fn().mockReturnValue(mockMutationObserver);

        mockReddit = mock<Reddit>();
        mockReddit.getMutedPosts.mockReturnValue(Promise.resolve([]));

        mockRedditSession = mock<RedditSession>();
        mockRedditSession.updateAccessToken.mockReturnValue(Promise.resolve("access token"));
        mockRedditSession.updateMutedSubreddits.mockReturnValue(Promise.resolve([]));
        mockRedditSession.getAccessToken.mockImplementation(mockRedditSession.updateAccessToken);
        mockRedditSession.getMutedSubreddits.mockImplementation(mockRedditSession.updateMutedSubreddits);

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

            protected redditSupplier(): Reddit {
                return mockReddit;
            }

            protected redditSessionSupplier(): RedditSession {
                return mockRedditSession;
            }

            protected storageSupplier(): Storage {
                const storage = mock<Storage>();
                storage.get.mockReturnValue(false);
                return storage;
            }
        };

        redditExpandedCommunityFilter = new TestRedditExpandedCommunityFilter();
    });

    test("stop should resolve immediately if not started", async () => {
        await redditExpandedCommunityFilter.stop();
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
        let mutationObserverCallback: MutationCallback;
        let startPromise: Promise<void>;

        beforeEach(async () => {
            startPromise = redditExpandedCommunityFilter.start();
            await new Promise<void>((resolve) => {
                mockMutationObserver.observe.mockImplementation(() => resolve());
            });

            mutationObserverCallback = mutationObserverSupplier.mock.calls[0][0];
        });

        test("should get muted posts", async () => {
            expect(mockReddit.getMutedPosts.mock.calls).toHaveLength(0);
            mutationObserverCallback([], mockMutationObserver);
            expect(mockReddit.getMutedPosts.mock.calls).toHaveLength(1);
        });

        test("promise should resolve on stop", async () => {
            redditExpandedCommunityFilter.stop();
            await startPromise;
        });
    });

    test("promise should resolve on stop", async () => {
        const promise = redditExpandedCommunityFilter.start();
        redditExpandedCommunityFilter.stop();
        await promise;
    });
});