import { NewReddit } from "./NewReddit";
import { RedditFeed } from "./@types/RedditFeed";
import { RedditSession } from "./RedditSession";

interface RedditFeedStrategy {
    typeDetection(document: Document): boolean
    createRedditFeed(document: Document): RedditFeed
}

class RedditFeedFactory {
    private readonly redditFeedStrategies: RedditFeedStrategy[];

    constructor(redditSession: RedditSession) {
        this.redditFeedStrategies = [
            {
                typeDetection: (document): boolean => document.body.className === "",
                createRedditFeed: (document): RedditFeed => new NewReddit(document, redditSession)
            },
            {
                typeDetection: (document): boolean => document.body.className === "v2",
                createRedditFeed: (): RedditFeed => {throw new Error("This script does not currently support the shreddit layout.");}
            }
        ];
    }

    getRedditFeed(document: Document): RedditFeed {
        const throwList: unknown[] = [];
        for (const redditFeedStrategy of this.redditFeedStrategies) {
            if (redditFeedStrategy.typeDetection(document)) {
                try {
                    return redditFeedStrategy.createRedditFeed(document);
                } catch (e) {
                    throwList.push(e);
                }
            }
        }

        throwList.push(new Error("Could not construct a Reddit Feed from the set of available constructors."));
        if (throwList.length === 1) {
            throw throwList[0];
        }

        throw throwList;
    }
}

export { RedditFeedFactory };