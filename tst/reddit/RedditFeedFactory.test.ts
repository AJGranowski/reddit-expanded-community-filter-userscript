import { JSDOM } from "jsdom";
import { mock } from "jest-mock-extended";

import { TestConstants } from "../TestConstants";

import { RedditFeed } from "../../src/reddit/@types/RedditFeed";
import { RedditFeedFactory } from "../../src/reddit/RedditFeedFactory";
import { RedditSession } from "../../src/reddit/RedditSession";

describe("RedditFeedFactory", () => {
    let jsdom: JSDOM;
    let mockRedditSession: ReturnType<typeof mock<RedditSession>>;
    let redditFeedFactory: RedditFeedFactory;

    beforeEach(() => {
        mockRedditSession = mock<RedditSession>();
        redditFeedFactory = new RedditFeedFactory(mockRedditSession);
    });

    describe("getRedditFeed", () => {
        test("should construct a NewReddit given a new reddit document.", async () => {
            jsdom = await JSDOM.fromFile(TestConstants.HTML_PATH.NEW_REDDIT);
            const redditFeed: RedditFeed = redditFeedFactory.getRedditFeed(jsdom.window.document);
            expect(redditFeed).not.toBeNull();
        });

        test("should error given a shreddit document.", async () => {
            jsdom = await JSDOM.fromFile(TestConstants.HTML_PATH.SHREDDIT);
            expect(() => redditFeedFactory.getRedditFeed(jsdom.window.document)).toThrow();
        });
    });
});