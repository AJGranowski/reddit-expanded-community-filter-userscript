import { JSDOM } from "jsdom";
import { mock } from "jest-mock-extended";

import { TestConstants } from "../TestConstants";

import { NewReddit } from "../../src/reddit/NewReddit";
import { RedditSession } from "../../src/reddit/RedditSession";

describe("NewReddit", () => {
    let jsdom: JSDOM;
    let mockRedditSession: ReturnType<typeof mock<RedditSession>>;
    let newReddit: NewReddit;

    beforeEach(async () => {
        jsdom = await JSDOM.fromFile(TestConstants.HTML_PATH.NEW_REDDIT);
        mockRedditSession = mock<RedditSession>();

        newReddit = new NewReddit(jsdom.window.document, mockRedditSession);
    });

    describe("getFeedContainer", () => {
        test("should return the post feed", () => {
            const expectedPostFeedElement = jsdom.window.document.getElementById("__post_feed")!;
            expect(expectedPostFeedElement.children.length).toBe(3);
            expect(newReddit.getFeedContainer()).toBe(expectedPostFeedElement);
        });

        test("should error if AppRouter-main-content not found", async () => {
            const expectedPostFeedElement = jsdom.window.document.getElementById("AppRouter-main-content")!;
            expectedPostFeedElement.remove();
            expect(() => newReddit.getFeedContainer()).toThrow();
        });
    });

    describe("getMutedPosts", () => {
        test("should return muted posts found on the page", async () => {
            mockRedditSession.getMutedSubreddits.mockReturnValue(Promise.resolve(["subredditone", "garbage data"]));

            const expectedResult = {
                container: jsdom.window.document.getElementsByClassName("__post_container")[0],
                subreddit: "r/SubredditOne"
            };

            const result = Array.from(await newReddit.getMutedPosts());
            expect(result).toHaveLength(1);
            expect(result[0].subreddit).toBe(expectedResult.subreddit);
            expect(result[0].container).toBe(expectedResult.container);
        });
    });
});