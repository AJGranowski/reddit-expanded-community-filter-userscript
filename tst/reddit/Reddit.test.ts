import { mock } from "jest-mock-extended";

import { Reddit } from "../../src/reddit/Reddit";
import { RedditSession } from "../../src/reddit/RedditSession";

describe("Reddit", () => {
    let mockDocument: ReturnType<typeof mock<Document>>;
    let mockRedditSession: ReturnType<typeof mock<RedditSession>>;
    let reddit: Reddit;

    beforeEach(() => {
        mockDocument = mock<Document>();
        mockRedditSession = mock<RedditSession>();

        reddit = new Reddit(mockDocument, mockRedditSession);
    });

    describe("getMainContentElement", () => {
        test("should return AppRouter-main-content", () => {
            const mainContentElement = mock<HTMLElement>();
            mockDocument.getElementById.mockReturnValue(mainContentElement);
            expect(reddit.getMainContentElement()).toBe(mainContentElement);
            expect(mockDocument.getElementById.mock.calls[0][0]).toBe("AppRouter-main-content");
        });

        test("should error if AppRouter-main-content not found", () => {
            mockDocument.getElementById.mockReturnValue(null);
            expect(reddit.getMainContentElement).toThrowError();
        });
    });

    describe("getMutedPosts", () => {
        test("should return muted posts found on the page", async () => {
            const mutedPostContainer = mock<HTMLElement>();
            const mutedSubredditNameElement = mock<HTMLAnchorElement>();
            mutedSubredditNameElement.innerText = "r/SubOne";
            /* eslint-disable max-len */
            (mutedSubredditNameElement.parentElement as any) = { parentElement: { parentElement: {parentElement: {parentElement: {parentElement: {parentElement: {parentElement: mutedPostContainer}}}}}}};
            mockDocument.querySelectorAll.mockReturnValue([mutedSubredditNameElement] as any);
            mockRedditSession.getMutedSubreddits.mockReturnValue(Promise.resolve(["subone", "subtwo"]));

            const expectedResult = {
                container: mutedPostContainer,
                subreddit: mutedSubredditNameElement.innerText
            };

            const result = await reddit.getMutedPosts();
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject(expectedResult);
        });
    });
});