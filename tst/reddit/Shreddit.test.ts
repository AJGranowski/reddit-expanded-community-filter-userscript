import { JSDOM } from "jsdom";
import { mock } from "jest-mock-extended";

import { TestConstants } from "../TestConstants";

import { Shreddit } from "../../src/reddit/Shreddit";
import { RedditSession } from "../../src/reddit/RedditSession";

describe("Shreddit", () => {
    let jsdom: JSDOM;
    let mockRedditSession: ReturnType<typeof mock<RedditSession>>;
    let shreddit: Shreddit;

    beforeEach(async () => {
        jsdom = await JSDOM.fromFile(TestConstants.HTML_PATH.SHREDDIT);
        mockRedditSession = mock<RedditSession>();

        shreddit = new Shreddit(jsdom.window.document, mockRedditSession);
    });

    describe("getFeedContainer", () => {
        test("should return the post feed", () => {
            const expectedPostFeedElement = jsdom.window.document.getElementsByTagName("shreddit-feed").item(0)!;
            expect(expectedPostFeedElement.children.length).toBe(3 * 2); // Three posts, three horizontal rules.
            expect(shreddit.getFeedContainer()).toBe(expectedPostFeedElement);
        });

        test("should error if shreddit-feed element not found", async () => {
            const expectedPostFeedElement = jsdom.window.document.getElementsByTagName("shreddit-feed").item(0)!;
            expectedPostFeedElement.remove();
            expect(() => shreddit.getFeedContainer()).toThrow();
        });
    });

    describe("getMutedPosts", () => {
        test("should return muted posts found on the page", async () => {
            mockRedditSession.getMutedSubreddits.mockReturnValue(Promise.resolve(["subredditone", "garbage data"]));

            const expectedResult = {
                elements: [
                    jsdom.window.document.getElementsByClassName("__post_container")[0],
                    jsdom.window.document.getElementsByClassName("__post_hr")[0]
                ],
                subreddit: "r/SubredditOne"
            };

            const result = Array.from(await shreddit.getMutedPosts());
            expect(result).toHaveLength(1);
            expect(result[0].subreddit).toBe(expectedResult.subreddit);
            expect(result[0].elements).toEqual(expectedResult.elements);
        });
    });
});