import { RedditFeed } from "./@types/RedditFeed";
import { RedditSession } from "./RedditSession";
import { Shreddit } from "./Shreddit";

type RedditFeedSupplier = (document: Document) => RedditFeed

class RedditFeedFactory {
    private readonly redditFeedSuppliers: RedditFeedSupplier[];

    constructor(redditSession: RedditSession) {
        this.redditFeedSuppliers = [
            (document): RedditFeed => new Shreddit(document, redditSession)
        ];
    }

    getRedditFeed(document: Document): RedditFeed {
        const throwList: unknown[] = [];
        for (const redditFeedSupplier of this.redditFeedSuppliers) {
            try {
                return redditFeedSupplier(document);
            } catch (e) {
                throwList.push(e);
            }
        }

        throwList.push(new Error("Could not construct a Reddit Feed from the set of available constructors."));
        throw throwList;
    }
}

export { RedditFeedFactory };